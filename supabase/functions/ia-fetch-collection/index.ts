const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const collectionName = 'movieverse-uploads';
    
    console.log(`Fetching items from collection: ${collectionName}`);

    // Fetch items from Internet Archive collection
    const searchUrl = `https://archive.org/advancedsearch.php?q=collection:${collectionName}&fl[]=identifier,title,description,item_size,runtime,addeddate&rows=100&output=json&sort[]=addeddate+desc`;
    
    const response = await fetch(searchUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch collection from Internet Archive');
    }

    const data = await response.json();
    const items = data.response?.docs || [];

    console.log(`Found ${items.length} items in collection`);

    // Fetch metadata and stream URLs for each item
    const moviesWithMetadata = await Promise.all(
      items.map(async (item: any) => {
        try {
          const metadataUrl = `https://archive.org/metadata/${item.identifier}`;
          const metadataResponse = await fetch(metadataUrl);

          if (metadataResponse.ok) {
            const metadata = await metadataResponse.json();
            const mp4File = metadata.files?.find((f: any) => 
              f.name.endsWith('.mp4') && f.format === 'h.264'
            );

            return {
              identifier: item.identifier,
              title: item.title,
              description: item.description,
              fileSize: item.item_size,
              duration: item.runtime,
              addedDate: item.addeddate,
              streamUrl: mp4File 
                ? `https://archive.org/download/${item.identifier}/${mp4File.name}`
                : `https://archive.org/embed/${item.identifier}`,
              embedUrl: `https://archive.org/embed/${item.identifier}`,
              detailUrl: `https://archive.org/details/${item.identifier}`,
              metadata: metadata.metadata || {},
            };
          }
        } catch (error) {
          console.error(`Error fetching metadata for ${item.identifier}:`, error);
        }

        return {
          identifier: item.identifier,
          title: item.title,
          description: item.description,
          fileSize: item.item_size,
          duration: item.runtime,
          addedDate: item.addeddate,
          streamUrl: `https://archive.org/embed/${item.identifier}`,
          embedUrl: `https://archive.org/embed/${item.identifier}`,
          detailUrl: `https://archive.org/details/${item.identifier}`,
        };
      })
    );

    console.log(`Processed ${moviesWithMetadata.length} movies from collection`);

    return new Response(
      JSON.stringify({ 
        collection: collectionName,
        count: moviesWithMetadata.length,
        movies: moviesWithMetadata 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching collection:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
