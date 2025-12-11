import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import BackButton from '@/components/BackButton';

const Watchlist = () => {
  const [watchlists] = useState([
    {
      id: 1,
      title: 'Action Packed Thrillers',
      description: 'A collection of high-octane movies that will keep you on the edge of your seat.',
      movieCount: 12,
      thumbnail: '/placeholder.svg',
    },
    {
      id: 2,
      title: 'Romantic Comedies',
      description: 'A curated list of heartwarming and funny romantic comedies.',
      movieCount: 8,
      thumbnail: '/placeholder.svg',
    },
    {
      id: 3,
      title: 'Sci-Fi Classics',
      description: 'Explore the best science fiction movies from the past and present.',
      movieCount: 15,
      thumbnail: '/placeholder.svg',
    },
  ]);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      <BackButton />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">My Watchlists</h1>
          <Button className="gap-2">
            <Plus className="w-5 h-5" />
            New Watchlist
          </Button>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="bg-muted">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="movies">Movies</TabsTrigger>
            <TabsTrigger value="series">Series</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {watchlists.map((list) => (
                <div
                  key={list.id}
                  className="group bg-card rounded-xl overflow-hidden hover:shadow-[var(--shadow-card)] transition-all cursor-pointer"
                >
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                    <img
                      src={list.thumbnail}
                      alt={list.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{list.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {list.description}
                    </p>
                    <Button variant="outline" className="w-full">
                      View Watchlist ({list.movieCount})
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="movies" className="mt-8">
            <div className="text-center py-20">
              <p className="text-muted-foreground">No movie watchlists yet</p>
            </div>
          </TabsContent>

          <TabsContent value="series" className="mt-8">
            <div className="text-center py-20">
              <p className="text-muted-foreground">No series watchlists yet</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <MobileNav />
    </div>
  );
};

export default Watchlist;
