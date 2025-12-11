import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import BackButton from '@/components/BackButton';
import MovieGrid from '@/components/MovieGrid';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import SEO from '@/components/SEO';
import { tmdb, Movie, GENRES } from '@/lib/tmdb';

const Search = () => {
  const [query, setQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popularity');

  // Debounce search to reduce API calls
  const debouncedQuery = useDebounce(query, 400);

  const { data: searchResults, isLoading: searchLoading } = useQuery<Movie[]>({
    queryKey: ['search', debouncedQuery],
    queryFn: () => tmdb.searchMovies(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data: genreResults, isLoading: genreLoading } = useQuery<Movie[]>({
    queryKey: ['genre', selectedGenre],
    queryFn: () => tmdb.getMoviesByGenre(parseInt(selectedGenre)),
    enabled: selectedGenre !== 'all',
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const isLoading = searchLoading || genreLoading;

  // Memoize sorted movies to avoid re-sorting on every render
  const sortedMovies = useMemo(() => {
    const displayMovies = debouncedQuery ? searchResults : genreResults;
    if (!displayMovies) return [];
    
    return [...displayMovies].sort((a, b) => {
      if (sortBy === 'popularity') return b.popularity - a.popularity;
      if (sortBy === 'rating') return b.vote_average - a.vote_average;
      if (sortBy === 'release') {
        const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
        const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
        return dateB - dateA;
      }
      return 0;
    });
  }, [searchResults, genreResults, debouncedQuery, sortBy]);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <SEO 
        title="Search Free Movies Online - Find Classic Films by Genre"
        description="Search and discover free classic movies. Filter by genre, rating, and release date. Find horror, sci-fi, drama, comedy, and more classic films to stream online."
        keywords="search movies online, find free movies, movies by genre, classic horror movies, sci-fi films, drama movies free, comedy movies online, filter movies"
      />
      <Navbar />
      <BackButton />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Search & Discover Free Classic Movies</h1>

        {/* Search Bar with Autocomplete */}
        <SearchAutocomplete onQueryChange={setQuery} className="mb-8" />

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-[200px] bg-card">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {GENRES.map((genre) => (
                <SelectItem key={genre.id} value={genre.id.toString()}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px] bg-card">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="release">Release Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        {query && (
          <p className="text-muted-foreground mb-6">
            Results ({sortedMovies.length})
          </p>
        )}

        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-pulse text-muted-foreground text-lg">Searching...</div>
          </div>
        ) : sortedMovies.length > 0 ? (
          <MovieGrid movies={sortedMovies} />
        ) : query || selectedGenre !== 'all' ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No movies found</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <SearchIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground text-lg">
              Search for movies or browse by genre
            </p>
          </div>
        )}
      </main>

      <MobileNav />
    </div>
  );
};

export default Search;
