import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { tmdb, GENRES } from '@/lib/tmdb';
import MovieCard from './MovieCard';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

interface GenreSectionProps {
  genreId: number;
  genreName: string;
}

const GenreSection = ({ genreId, genreName }: GenreSectionProps) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['genre', genreId],
    queryFn: ({ pageParam = 1 }) => tmdb.getByGenre(genreId, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      // Limit to 3 pages (60 movies) to allow users to reach footer
      if (allPages.length < 3 && lastPage.length === 20) {
        return allPages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const movies = data?.pages.flatMap((page) => page) ?? [];

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
      </div>
    );
  }

  return (
    <section className="mb-16">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        {genreName}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {movies.map((movie) => (
          <MovieCard key={`${movie.id}-${genreId}`} movie={movie} />
        ))}
      </div>
      
      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="mt-8 text-center">
        {isFetchingNextPage && (
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        )}
        {!hasNextPage && movies.length > 0 && (
          <p className="text-muted-foreground">No more movies in this genre</p>
        )}
      </div>

      {/* Manual load more button as fallback */}
      {hasNextPage && !isFetchingNextPage && (
        <div className="mt-8 text-center">
          <Button
            onClick={() => fetchNextPage()}
            variant="outline"
            className="gap-2"
          >
            Load More {genreName} Movies
          </Button>
        </div>
      )}
    </section>
  );
};

export default GenreSection;
