import { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { tmdb, Movie } from '@/lib/tmdb';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchAutocompleteProps {
  onQueryChange?: (query: string) => void;
  className?: string;
}

const SearchAutocomplete = ({ onQueryChange, className }: SearchAutocompleteProps) => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Debounce search query to reduce API calls
  const debouncedQuery = useDebounce(query, 300);

  const { data: searchResults, isLoading } = useQuery<Movie[]>({
    queryKey: ['search-autocomplete', debouncedQuery],
    queryFn: () => tmdb.searchMovies(debouncedQuery),
    enabled: debouncedQuery.length > 2,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  // Memoize filtered results
  const displayResults = useMemo(() => 
    searchResults?.slice(0, 8) || [], 
    [searchResults]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value: string) => {
    setQuery(value);
    setShowResults(value.length > 2);
    onQueryChange?.(value);
  };

  const handleMovieClick = (movieId: number) => {
    navigate(`/movie/${movieId}`);
    setShowResults(false);
    setQuery('');
  };

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
      <Input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => query.length > 2 && setShowResults(true)}
        className="pl-12 pr-12 h-14 text-lg bg-card border-border"
      />
      {query && (
        <button
          onClick={() => {
            setQuery('');
            setShowResults(false);
            onQueryChange?.('');
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Live Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg max-h-[400px] overflow-y-auto z-50 animate-fade-in">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">Searching...</div>
          ) : displayResults.length > 0 ? (
            <div className="py-2">
              {displayResults.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => handleMovieClick(movie.id)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left"
                >
                  <img
                    src={tmdb.getImageUrl(movie.poster_path, 'w200')}
                    alt={movie.title}
                    className="w-12 h-18 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{movie.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-secondary">
                      {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">★</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
