import { useQuery } from '@tanstack/react-query';
import { tmdb, Movie } from '@/lib/tmdb';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Play, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Autoplay from 'embla-carousel-autoplay';

const HeroCarousel = () => {
  const navigate = useNavigate();
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const { data: movies } = useQuery<Movie[]>({
    queryKey: ['hero-trending'],
    queryFn: () => tmdb.getTrending('week'),
  });

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const heroMovies = movies?.slice(0, 5) || [];

  if (heroMovies.length === 0) return null;

  return (
    <section className="relative overflow-hidden mt-16">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {heroMovies.map((movie) => (
            <CarouselItem key={movie.id}>
              <div className="relative h-[600px] flex items-center justify-center">
                <div className="absolute inset-0">
                  <img
                    src={tmdb.getImageUrl(movie.backdrop_path || movie.poster_path, 'original')}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
                </div>

                <div className="relative z-10 container mx-auto px-4">
                  <div className="max-w-2xl space-y-4 animate-fade-in">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
                      {movie.title}
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground line-clamp-3">
                      {movie.overview}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="text-secondary font-bold">★</span>
                        {movie.vote_average.toFixed(1)}
                      </span>
                      <span>•</span>
                      <span>
                        {movie.release_date
                          ? new Date(movie.release_date).getFullYear()
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 pt-4">
                      <Button
                        size="lg"
                        onClick={() => navigate(`/movie/${movie.id}`)}
                        className="gap-2 shadow-[var(--glow-primary)]"
                      >
                        <Play className="w-5 h-5" />
                        Watch Now
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => navigate(`/movie/${movie.id}`)}
                        className="gap-2"
                      >
                        <Info className="w-5 h-5" />
                        More Info
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 h-12 w-12 bg-background/80 hover:bg-background border-border" />
        <CarouselNext className="right-4 h-12 w-12 bg-background/80 hover:bg-background border-border" />
        
        {/* Dots Navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                current === index
                  ? 'bg-primary w-8'
                  : 'bg-muted-foreground/50 hover:bg-muted-foreground'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </section>
  );
};

export default HeroCarousel;
