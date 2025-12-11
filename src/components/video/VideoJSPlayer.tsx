import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, Download, Video, Film, Archive } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { iaVideos, IAVideo } from '@/lib/iaVideos';

interface VideoJSPlayerProps {
  movieId: number;
  movieTitle: string;
  posterUrl: string;
  videos: Array<{ id: string; key: string; name: string; site: string; type: string }>;
}

const qualities = ['4K', '1080p', '720p', '480p', '360p'] as const;

type Quality = typeof qualities[number];

const videoSources: Record<Quality, string> = {
  '4K': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  '1080p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  '720p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  '480p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  '360p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
};

const VideoJSPlayer = ({ movieId, movieTitle, posterUrl, videos }: VideoJSPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null);
  const [quality, setQuality] = useState<Quality>('1080p');
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [selectedSource, setSelectedSource] = useState<'youtube' | 'ia' | 'sample'>('ia');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Internet Archive videos with caching
  const { data: iaVideoList } = useQuery<IAVideo[]>({
    queryKey: ['ia-videos', movieId],
    queryFn: () => iaVideos.getVideosForMovie(movieId),
    staleTime: 15 * 60 * 1000, // Cache for 15 minutes
    gcTime: 30 * 60 * 1000,
  });

  // Filter and prioritize videos
  const trailers = videos.filter(v => v.site === 'YouTube' && v.type === 'Trailer');
  const teasers = videos.filter(v => v.site === 'YouTube' && v.type === 'Teaser');
  const availableVideos = [...trailers, ...teasers];

  // Auto-select first Internet Archive video, then trailers
  useEffect(() => {
    if (iaVideoList && iaVideoList.length > 0 && !selectedVideo) {
      setSelectedVideo(iaVideoList[0].ia_identifier);
      setSelectedSource('ia');
    } else if (availableVideos.length > 0 && !selectedVideo) {
      setSelectedVideo(availableVideos[0].key);
      setSelectedSource('youtube');
    }
  }, [iaVideoList, availableVideos.length]);

  useEffect(() => {
    if (!videoRef.current || selectedSource !== 'sample') return;

    if (!playerRef.current) {
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: 'none', // Changed from 'metadata' to 'none' for faster initial load
        fluid: true,
        poster: posterUrl,
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        sources: [{ src: videoSources[quality], type: 'video/mp4' }],
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [selectedSource, quality]);

  const handleQualityChange = (q: Quality) => {
    const player = playerRef.current;
    if (!player) return;

    const currentTime = player.currentTime();
    const wasPaused = player.paused();

    setQuality(q);
    player.src({ src: videoSources[q], type: 'video/mp4' });

    // When the new source is ready, restore time/state
    player.one('loadedmetadata', () => {
      player.currentTime(currentTime);
      if (!wasPaused) player.play();
    });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = videoSources[quality];
    link.download = `${movieTitle}-${quality}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCurrentVideo = () => {
    if (selectedSource === 'ia' && iaVideoList) {
      return iaVideoList.find(v => v.ia_identifier === selectedVideo);
    }
    if (selectedSource === 'youtube') {
      return availableVideos.find(v => v.key === selectedVideo);
    }
    return null;
  };

  const currentVideo = getCurrentVideo();
  const currentVideoName = selectedSource === 'ia' 
    ? (currentVideo as IAVideo)?.title || 'Internet Archive Video'
    : selectedSource === 'youtube'
    ? (currentVideo as any)?.name || 'YouTube Video'
    : 'Sample Video';
  const isTrailer = selectedSource === 'youtube' && currentVideo && (currentVideo as any).type === 'Trailer';
  const isIAVideo = selectedSource === 'ia';

  return (
    <section aria-label={`${movieTitle} video player`} className="w-full">
      <div className="relative rounded-xl overflow-hidden border border-border/50 bg-gradient-to-b from-card to-background shadow-[var(--shadow-card)] transition-all duration-300 hover:shadow-[var(--glow-primary)]">
        {/* Header */}
        <div className="px-4 py-3 bg-card/80 backdrop-blur-sm border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              {isIAVideo ? <Archive className="w-5 h-5 text-white" /> : selectedVideo ? <Film className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h3 className="font-semibold text-sm line-clamp-1">{currentVideoName}</h3>
              <p className="text-xs text-muted-foreground">
                {isIAVideo ? 'Internet Archive' : selectedVideo ? (isTrailer ? 'Official Trailer' : 'Teaser') : 'Sample Video'}
              </p>
            </div>
          </div>
          {(isTrailer || isIAVideo) && (
            <Badge variant="secondary" className="gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              {isIAVideo ? 'Archive' : 'Official'}
            </Badge>
          )}
        </div>

        {/* Top controls */}
        <div className="absolute z-10 right-3 top-16 flex items-center gap-2">
          {/* Video Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-2 shadow-lg backdrop-blur-sm">
                <Film className="w-4 h-4" />
                Switch Video
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[250px]">
              {iaVideoList && iaVideoList.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Internet Archive</div>
                  {iaVideoList.map((video) => (
                    <DropdownMenuItem
                      key={video.id}
                      onClick={() => {
                        setSelectedVideo(video.ia_identifier);
                        setSelectedSource('ia');
                      }}
                      className={selectedVideo === video.ia_identifier && selectedSource === 'ia' ? 'bg-accent' : ''}
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      {video.title}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
              {trailers.length > 0 && (
                <>
                  {iaVideoList && iaVideoList.length > 0 && <div className="border-t my-1" />}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Trailers</div>
                  {trailers.map((video) => (
                    <DropdownMenuItem
                      key={video.id}
                      onClick={() => {
                        setSelectedVideo(video.key);
                        setSelectedSource('youtube');
                      }}
                      className={selectedVideo === video.key && selectedSource === 'youtube' ? 'bg-accent' : ''}
                    >
                      <Film className="w-4 h-4 mr-2" />
                      {video.name}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
              {teasers.length > 0 && (
                <>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">Teasers</div>
                  {teasers.map((video) => (
                    <DropdownMenuItem
                      key={video.id}
                      onClick={() => {
                        setSelectedVideo(video.key);
                        setSelectedSource('youtube');
                      }}
                      className={selectedVideo === video.key && selectedSource === 'youtube' ? 'bg-accent' : ''}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      {video.name}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
              <div className="border-t my-1" />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedVideo('');
                  setSelectedSource('sample');
                }}
                className={selectedSource === 'sample' ? 'bg-accent' : ''}
              >
                <Video className="w-4 h-4 mr-2" />
                Sample Video
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedSource === 'sample' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="sm" className="gap-2 shadow-lg backdrop-blur-sm">
                  <Settings className="w-4 h-4" />
                  {quality}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {qualities.map((q) => (
                  <DropdownMenuItem
                    key={q}
                    onClick={() => handleQualityChange(q)}
                    className={quality === q ? 'bg-accent' : ''}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{q}</span>
                      {quality === q && <span className="ml-2 text-primary">✓</span>}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {selectedSource === 'sample' && (
            <Button
              variant="outline"
              size="icon"
              title="Download video"
              onClick={handleDownload}
              className="shadow-lg backdrop-blur-sm"
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Video player */}
        <div data-vjs-player className="relative bg-black">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
              <div className="animate-pulse text-white">Loading video...</div>
            </div>
          )}
          {selectedSource === 'youtube' && selectedVideo ? (
            <iframe
              className="w-full aspect-video"
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=0&rel=0&modestbranding=1`}
              title={movieTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
              onLoadStart={() => setIsLoading(true)}
            />
          ) : selectedSource === 'ia' && selectedVideo ? (
            <iframe
              className="w-full aspect-video"
              src={(iaVideoList?.find(v => v.ia_identifier === selectedVideo)?.embedUrl) || `https://archive.org/embed/${selectedVideo}`}
              title={movieTitle}
              allow="fullscreen"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
              onLoadStart={() => setIsLoading(true)}
            />
          ) : (
            <video
              ref={videoRef}
              className="video-js vjs-big-play-centered w-full"
            />
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-card/60 backdrop-blur-sm border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {(iaVideoList?.length || 0) + availableVideos.length} video{(iaVideoList?.length || 0) + availableVideos.length !== 1 ? 's' : ''} available
            {iaVideoList && iaVideoList.length > 0 && ` (${iaVideoList.length} from Internet Archive)`}
          </span>
          <span>{isIAVideo ? 'Internet Archive' : 'TMDB'}</span>
        </div>
      </div>
    </section>
  );
};

export default VideoJSPlayer;
