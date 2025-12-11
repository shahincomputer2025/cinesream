import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import BackButton from '@/components/BackButton';
import MovieGrid from '@/components/MovieGrid';
import SEO from '@/components/SEO';
import { tmdb, Movie } from '@/lib/tmdb';

const Movies = () => {
  const { data: popular } = useQuery<Movie[]>({
    queryKey: ['popular'],
    queryFn: () => tmdb.getPopular(),
  });

  const { data: topRated } = useQuery<Movie[]>({
    queryKey: ['topRated'],
    queryFn: () => tmdb.getTopRated(),
  });

  const { data: nowPlaying } = useQuery<Movie[]>({
    queryKey: ['nowPlaying'],
    queryFn: () => tmdb.getNowPlaying(),
  });

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <SEO 
        title="Free Movies Online - Popular, Top Rated & New Releases"
        description="Browse popular movies, top rated classics, and new releases. Watch free movies online in HD. Stream classic cinema, horror, sci-fi, drama, comedy and more."
        keywords="popular movies online, top rated movies free, new movie releases, classic movies streaming, watch movies online free, trending movies, best movies"
      />
      <Navbar />
      <BackButton />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Browse Free Movies Online</h1>

        <Tabs defaultValue="popular" className="w-full">
          <TabsList className="mb-8 bg-muted">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
            <TabsTrigger value="now-playing">Now Playing</TabsTrigger>
          </TabsList>

          <TabsContent value="popular">
            {popular && <MovieGrid movies={popular} />}
          </TabsContent>

          <TabsContent value="top-rated">
            {topRated && <MovieGrid movies={topRated} />}
          </TabsContent>

          <TabsContent value="now-playing">
            {nowPlaying && <MovieGrid movies={nowPlaying} />}
          </TabsContent>
        </Tabs>
      </main>

      <MobileNav />
    </div>
  );
};

export default Movies;
