import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Movie, tmdb } from '@/lib/tmdb';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

const MovieCard = ({ movie, className }: MovieCardProps) => {
  const posterUrl = tmdb.getImageUrl(movie.poster_path, 'w500');
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <Link
      to={`/movie/${movie.id}`}
      className={cn(
        "group relative block overflow-hidden rounded-xl bg-card transition-all",
        "active:scale-95 md:hover:scale-105 md:hover:shadow-[var(--shadow-card)]",
        "touch-manipulation", // Improves touch responsiveness
        className
      )}
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={posterUrl}
          alt={`${movie.title} (${year}) - Watch free online movie poster`}
          className="w-full h-full object-cover transition-transform md:group-hover:scale-110"
          loading="lazy"
          decoding="async"
        />
      </div>
      
      {/* Overlay - always visible on mobile, hover on desktop */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 md:p-4">
        <h3 className="font-bold text-xs md:text-sm mb-1 line-clamp-2">{movie.title}</h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{year}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            <span>{rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
