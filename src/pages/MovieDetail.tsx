import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Play, Bookmark, Download, Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import BackButton from '@/components/BackButton';
import MovieGrid from '@/components/MovieGrid';
import VideoJSPlayer from '@/components/video/VideoJSPlayer';
import SEO from '@/components/SEO';
import { tmdb, MovieDetails, Review, Movie, Video } from '@/lib/tmdb';
import { useState } from 'react';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id || '0');
  const [showPlayer, setShowPlayer] = useState(false);

  const { data: movie, isLoading, isError } = useQuery<MovieDetails | null>({
    queryKey: ['movie', movieId],
    queryFn: () => tmdb.getMovieDetails(movieId),
    enabled: movieId > 0,
  });

  const { data: reviews } = useQuery<Review[]>({
    queryKey: ['reviews', movieId],
    queryFn: () => tmdb.getMovieReviews(movieId),
    enabled: !!movie,
  });

  const { data: similar } = useQuery<Movie[]>({
    queryKey: ['similar', movieId],
    queryFn: () => tmdb.getSimilarMovies(movieId),
    enabled: !!movie,
  });

  const { data: videos } = useQuery<Video[]>({
    queryKey: ['videos', movieId],
    queryFn: () => tmdb.getMovieVideos(movieId),
    enabled: !!movie,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-xl mb-4">Failed to load movie details</p>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const backdropUrl = tmdb.getImageUrl(movie.backdrop_path, 'original');
  const posterUrl = tmdb.getImageUrl(movie.poster_path, 'w500');
  const rating = movie.vote_average.toFixed(1);
  const ratingPercent = (movie.vote_average / 10) * 100;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title,
    "description": movie.overview,
    "image": posterUrl,
    "datePublished": movie.release_date,
    "genre": movie.genres.map(g => g.name),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "ratingCount": movie.vote_count,
      "bestRating": "10",
      "worstRating": "0"
    },
    "duration": `PT${movie.runtime}M`
  };

  const ratingDistribution = [
    { stars: 5, percent: 40 },
    { stars: 4, percent: 30 },
    { stars: 3, percent: 15 },
    { stars: 2, percent: 10 },
    { stars: 1, percent: 5 },
  ];

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <SEO 
        title={`Watch ${movie.title} (${new Date(movie.release_date).getFullYear()}) Free Online`}
        description={`${movie.overview.slice(0, 150)}... Stream ${movie.title} in HD. ${movie.genres.map(g => g.name).join(', ')} - Free classic movie streaming.`}
        keywords={`${movie.title}, watch ${movie.title} online free, ${movie.genres.map(g => g.name.toLowerCase()).join(', ')}, ${new Date(movie.release_date).getFullYear()} movies, free movie streaming`}
        image={posterUrl}
        type="video.movie"
        jsonLd={jsonLd}
      />
      <Navbar />
      <BackButton />

      {/* Hero Section */}
      <div className="relative h-[600px] mt-16">
        <div className="absolute inset-0">
          <img
            src={backdropUrl}
            alt={`${movie.title} (${new Date(movie.release_date).getFullYear()}) - Watch free online - ${movie.genres.map(g => g.name).join(', ')} movie`}
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>

        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-12">
          <Link to="/" className="mb-4 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
          
          <div className="flex items-center gap-4 text-muted-foreground mb-6">
            <span>{new Date(movie.release_date).getFullYear()}</span>
            <span>•</span>
            <span>{movie.runtime} min</span>
            <span>•</span>
            <div className="flex gap-2">
              {movie.genres.slice(0, 3).map((genre) => (
                <span key={genre.id} className="px-3 py-1 bg-muted rounded-full text-xs">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          <p className="text-lg max-w-3xl mb-8 line-clamp-3">{movie.overview}</p>

          <div className="flex items-center gap-4">
            <Button 
              size="lg" 
              className="gap-2 shadow-[var(--glow-primary)]"
              onClick={() => {
                setShowPlayer(true);
                window.scrollTo({ top: document.body.scrollHeight / 3, behavior: 'smooth' });
              }}
            >
              <Play className="w-5 h-5" />
              Play
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Bookmark className="w-5 h-5" />
              Add to Watchlist
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <Download className="w-5 h-5" />
              Download
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Video Player Section */}
        {showPlayer && (
          <div className="mb-12">
            <VideoJSPlayer
              movieId={movieId}
              movieTitle={movie.title}
              posterUrl={tmdb.getImageUrl(movie.poster_path, 'w500')}
              videos={videos || []}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Cast & Crew */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Cast & Crew</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                  {movie.credits.cast.slice(0, 10).map((actor) => (
                    <div key={actor.id} className="flex-none w-32 text-center">
                      <div className="w-32 h-32 rounded-full overflow-hidden mb-3 bg-muted">
                        {actor.profile_path && (
                          <img
                            src={tmdb.getImageUrl(actor.profile_path, 'w200')}
                            alt={actor.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <p className="font-medium text-sm">{actor.name}</p>
                      <p className="text-xs text-muted-foreground">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            {reviews && reviews.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Reviews</h2>
                <div className="space-y-6">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="bg-card rounded-lg p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                          {review.author[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{review.author}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        {review.author_details.rating && (
                          <div className="ml-auto flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-medium">{review.author_details.rating}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-muted-foreground line-clamp-4">{review.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Ratings */}
            <section className="bg-card rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Ratings</h3>
              <div className="text-center mb-6">
                <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {rating}
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(movie.vote_average / 2)
                          ? 'fill-yellow-500 text-yellow-500'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {movie.vote_count.toLocaleString()} reviews
                </p>
              </div>

              <div className="space-y-3">
                {ratingDistribution.map(({ stars, percent }) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-sm w-4">{stars}</span>
                    <Progress value={percent} className="flex-1" />
                    <span className="text-sm text-muted-foreground w-12">{percent}%</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Similar Movies */}
        {similar && similar.length > 0 && (
          <div className="mt-12">
            <MovieGrid movies={similar.slice(0, 12)} title="You May Also Like" />
          </div>
        )}
      </div>

      <MobileNav />
    </div>
  );
};

export default MovieDetail;
