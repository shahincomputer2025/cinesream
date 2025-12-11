import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import Footer from '@/components/Footer';
import MovieGrid from '@/components/MovieGrid';
import GenreSection from '@/components/GenreSection';
import HeroCarousel from '@/components/HeroCarousel';
import SEO from '@/components/SEO';
import { tmdb, Movie, GENRES } from '@/lib/tmdb';

const Index = () => {
  const { data: trending, isLoading: trendingLoading } = useQuery<Movie[]>({
    queryKey: ['trending'],
    queryFn: () => tmdb.getTrending('week'),
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    gcTime: 30 * 60 * 1000,
  });

  const { data: popular, isLoading: popularLoading } = useQuery<Movie[]>({
    queryKey: ['popular'],
    queryFn: () => tmdb.getPopular(),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const { data: topRated, isLoading: topRatedLoading } = useQuery<Movie[]>({
    queryKey: ['topRated'],
    queryFn: () => tmdb.getTopRated(),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const isLoading = trendingLoading || popularLoading || topRatedLoading;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CineStream",
    "url": "https://cinemas-stream.netlify.app",
    "description": "Watch free classic movies online. Stream public domain films, vintage cinema, and more.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://cinemas-stream.netlify.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <SEO 
        title="Watch Free Movies Online | Classic Films & Public Domain Cinema"
        description="Watch free classic movies online. Stream public domain films, vintage cinema, old horror movies, sci-fi classics & more. No subscription required. High-quality streaming."
        keywords="free movies online, watch movies free, classic movies, public domain films, old movies, vintage cinema, free streaming, classic horror movies, sci-fi films, watch old movies online, free cinema, retro movies"
        jsonLd={jsonLd}
      />
      <Navbar />
      
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Content Sections */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="animate-pulse text-muted-foreground text-lg">Loading movies...</div>
          </div>
        ) : (
          <>
            {trending && trending.length > 0 && <MovieGrid movies={trending.slice(0, 12)} title="Trending Now" />}
            {popular && popular.length > 0 && <MovieGrid movies={popular.slice(0, 12)} title="Popular Movies" />}
            {topRated && topRated.length > 0 && <MovieGrid movies={topRated.slice(0, 12)} title="Top Rated" />}
            
            {/* Genres Section with Infinite Scroll */}
            <section className="mt-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Browse Classic Movies by Genre
              </h2>
              {GENRES.slice(0, 4).map((genre) => (
                <GenreSection key={genre.id} genreId={genre.id} genreName={genre.name} />
              ))}
            </section>
          </>
        )}
      </div>

      <Footer />

      <MobileNav />
    </div>
  );
};

export default Index;
