import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IAItem {
  identifier: string;
  title: string;
  description?: string;
  publicdate?: string;
  item_size?: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting Internet Archive auto-sync...');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const iaAccessKey = Deno.env.get('INTERNET_ARCHIVE_ACCESS_KEY')!;
    const iaSecretKey = Deno.env.get('INTERNET_ARCHIVE_SECRET_KEY')!;
    const tmdbApiKey = Deno.env.get('TMDB_API_KEY');

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Search for uploads using the uploader's access key as identifier
    // Format: uploader:USERNAME AND mediatype:movies
    const searchQuery = `uploader:${iaAccessKey} AND mediatype:movies`;
    const searchUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(searchQuery)}&fl[]=identifier,title,description,publicdate,item_size&sort[]=publicdate desc&rows=50&page=1&output=json`;

    console.log('Fetching recent uploads from Internet Archive...');
    const iaResponse = await fetch(searchUrl);
    
    if (!iaResponse.ok) {
      throw new Error(`IA search failed: ${iaResponse.statusText}`);
    }

    const iaData = await iaResponse.json();
    const items: IAItem[] = iaData.response?.docs || [];
    console.log(`Found ${items.length} items in Internet Archive`);

    // Get existing identifiers to avoid duplicates
    const { data: existingVideos } = await supabase
      .from('ia_videos')
      .select('ia_identifier');

    const existingIdentifiers = new Set(
      existingVideos?.map((v: any) => v.ia_identifier) || []
    );

    console.log(`Found ${existingIdentifiers.size} existing videos in database`);

    const newVideos = [];
    const skippedVideos = [];

    for (const item of items) {
      if (existingIdentifiers.has(item.identifier)) {
        console.log(`Skipping duplicate: ${item.identifier}`);
        skippedVideos.push(item.identifier);
        continue;
      }

      console.log(`Processing new video: ${item.identifier}`);

      // Fetch detailed metadata from IA
      const metadataUrl = `https://archive.org/metadata/${item.identifier}`;
      const metadataResponse = await fetch(metadataUrl);
      
      if (!metadataResponse.ok) {
        console.error(`Failed to fetch metadata for ${item.identifier}`);
        continue;
      }

      const metadata = await metadataResponse.json();
      const files = metadata.files || [];
      
      // Find MP4 file
      const mp4File = files.find((f: any) => 
        f.name?.endsWith('.mp4') && !f.name?.includes('_512kb')
      );

      const fileSize = mp4File?.size ? parseInt(mp4File.size) : item.item_size;
      const duration = metadata.metadata?.runtime ? 
        Math.floor(parseFloat(metadata.metadata.runtime) * 60) : null;

      // Fetch TMDB metadata
      let movieId = null;
      let tmdbTitle = null;
      let tmdbOverview = null;
      let posterPath = null;
      let releaseYear = null;

      if (tmdbApiKey && item.title) {
        try {
          console.log(`🔍 Searching TMDB for: "${item.title}"`);
          const tmdbSearchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(item.title)}`;
          const tmdbResponse = await fetch(tmdbSearchUrl);
          
          if (tmdbResponse.ok) {
            const tmdbData = await tmdbResponse.json();
            if (tmdbData.results && tmdbData.results.length > 0) {
              const movie = tmdbData.results[0];
              movieId = movie.id;
              tmdbTitle = movie.title;
              tmdbOverview = movie.overview;
              posterPath = movie.poster_path;
              releaseYear = movie.release_date ? parseInt(movie.release_date.split('-')[0]) : null;
              
              console.log(`✅ Found TMDB match for "${item.title}":`);
              console.log(`   - TMDB ID: ${movieId}`);
              console.log(`   - Title: ${tmdbTitle}`);
              console.log(`   - Release Year: ${releaseYear}`);
              console.log(`   - Poster: ${posterPath ? 'Yes' : 'No'}`);
            } else {
              console.log(`⚠️  No TMDB match found for "${item.title}"`);
            }
          }
        } catch (error) {
          console.error(`❌ TMDB search failed for "${item.title}":`, error);
        }
      } else if (!tmdbApiKey) {
        console.log('⚠️  TMDB_API_KEY not configured - skipping metadata fetch');
      }

      // Insert into ia_videos table with TMDB metadata
      const { data: video, error: videoError } = await supabase
        .from('ia_videos')
        .insert({
          ia_identifier: item.identifier,
          title: item.title || item.identifier,
          description: item.description || metadata.metadata?.description,
          movie_id: movieId || 0,
          tmdb_title: tmdbTitle,
          tmdb_overview: tmdbOverview,
          poster_path: posterPath,
          release_year: releaseYear,
          file_size: fileSize,
          duration: duration,
          upload_date: item.publicdate || new Date().toISOString(),
          is_active: true,
        })
        .select()
        .single();

      if (videoError) {
        console.error(`Failed to insert video ${item.identifier}:`, videoError);
        continue;
      }

      const videoUrl = `https://archive.org/download/${item.identifier}/${item.identifier}.mp4`;
      console.log(`✅ NEW MOVIE ADDED → ${tmdbTitle || item.title}`);
      console.log(`   📼 IA Identifier: ${item.identifier}`);
      console.log(`   🎬 Video URL: ${videoUrl}`);
      console.log(`   🎨 Poster: ${posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'None'}`);
      console.log(`   📅 Release Year: ${releaseYear || 'Unknown'}`);
      
      newVideos.push({
        identifier: item.identifier,
        title: tmdbTitle || item.title,
        movieId: movieId,
        posterUrl: posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : null,
        releaseYear: releaseYear,
      });

      // If we found a TMDB match, create mapping
      if (movieId && video) {
        const { error: mappingError } = await supabase
          .from('movie_video_mappings')
          .insert({
            movie_id: movieId,
            ia_video_id: video.id,
            is_primary: true,
          });

        if (mappingError) {
          console.error(`Failed to create mapping for ${item.identifier}:`, mappingError);
        } else {
          console.log(`✓ Created TMDB mapping for movie ${movieId}`);
        }
      }
    }

    const summary = {
      totalScanned: items.length,
      newVideosAdded: newVideos.length,
      duplicatesSkipped: skippedVideos.length,
      newVideos: newVideos,
      timestamp: new Date().toISOString(),
    };

    console.log('Sync completed:', summary);

    return new Response(
      JSON.stringify({
        success: true,
        ...summary,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Auto-sync error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
