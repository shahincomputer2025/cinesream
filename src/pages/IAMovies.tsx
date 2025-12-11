import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import BackButton from '@/components/BackButton';
import SEO from '@/components/SEO';
import { iaVideos, IACollectionMovie } from '@/lib/iaVideos';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Calendar, HardDrive } from 'lucide-react';
import { Link } from 'react-router-dom';

const IAMovies = () => {
  const { data: movies, isLoading } = useQuery<IACollectionMovie[]>({
    queryKey: ['ia-collection'],
    queryFn: () => iaVideos.fetchCollection(),
    refetchInterval: 60000, // Refresh every minute
  });

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    if (mb > 1024) {
      return `${(mb / 1024).toFixed(2)} GB`;
    }
    return `${mb.toFixed(2)} MB`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <SEO 
        title="Free Public Domain Movies - Internet Archive Collection"
        description="Watch free public domain movies from the Internet Archive. Stream classic films, vintage cinema, and rare movies legally. No subscription required."
        keywords="public domain movies, internet archive movies, free classic films, vintage movies, old public domain films, watch archive movies, classic cinema free"
      />
      <Navbar />
      <BackButton />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Free Public Domain Movies - Internet Archive Collection</h1>
          <p className="text-muted-foreground">
            Movies from movieverse-uploads collection • {movies?.length || 0} items
          </p>
        </header>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading collection...</p>
            </div>
          </div>
        ) : movies && movies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((movie) => (
              <Card key={movie.identifier} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <a 
                    href={movie.streamUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="aspect-video bg-muted flex items-center justify-center relative group">
                      <Play className="w-16 h-16 text-primary opacity-70 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                  </a>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{movie.title}</h3>
                    
                    {movie.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {movie.description}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {movie.addedDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(movie.addedDate)}
                        </div>
                      )}
                      {movie.fileSize && (
                        <div className="flex items-center gap-1">
                          <HardDrive className="w-3 h-3" />
                          {formatFileSize(movie.fileSize)}
                        </div>
                      )}
                      {movie.duration && (
                        <div className="flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          {movie.duration}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t flex gap-2">
                      <a
                        href={movie.streamUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
                      >
                        Watch
                      </a>
                      <a
                        href={movie.detailUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors text-sm font-medium"
                      >
                        Details
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No movies found in the collection.</p>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default IAMovies;
