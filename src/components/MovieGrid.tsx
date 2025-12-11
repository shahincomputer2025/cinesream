import { memo } from 'react';
import { Movie } from '@/lib/tmdb';
import MovieCard from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  title?: string;
}

const MovieGrid = memo(({ movies, title }: MovieGridProps) => {
  if (movies.length === 0) return null;

  return (
    <section className="mb-12 animate-fade-in">
      {title && (
        <h2 className="text-2xl md:text-3xl font-bold mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
});

MovieGrid.displayName = 'MovieGrid';

export default MovieGrid;
