import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import BackButton from '@/components/BackButton';
import Footer from '@/components/Footer';
import { Film, Users, Star, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      <BackButton />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-6">
              <Film className="w-12 h-12 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                About CineStream
              </h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Your ultimate destination for streaming entertainment
            </p>
          </div>

          {/* Mission */}
          <section className="mb-12 animate-scale-in">
            <div className="bg-card p-8 rounded-2xl border border-border">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                At CineStream, we believe that everyone deserves access to world-class entertainment. 
                Our mission is to provide a seamless, intuitive streaming experience that brings the magic 
                of cinema directly to your screen. Whether you're looking for the latest blockbusters, 
                timeless classics, or hidden gems, we've got you covered.
              </p>
            </div>
          </section>

          {/* Features */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-xl border border-border hover:border-primary transition-colors">
                <Film className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Vast Library</h3>
                <p className="text-muted-foreground">
                  Access thousands of movies and series from all genres, updated regularly with the latest releases.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border hover:border-primary transition-colors">
                <Star className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Personalized Experience</h3>
                <p className="text-muted-foreground">
                  Get recommendations based on your viewing history and create custom watchlists.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border hover:border-primary transition-colors">
                <Users className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Community</h3>
                <p className="text-muted-foreground">
                  Share reviews, ratings, and connect with fellow movie enthusiasts.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border border-border hover:border-primary transition-colors">
                <Sparkles className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">High Quality</h3>
                <p className="text-muted-foreground">
                  Stream in the highest quality available with support for multiple devices.
                </p>
              </div>
            </div>
          </section>

          {/* Story */}
          <section className="mb-12">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Founded by a team of passionate movie lovers and technology enthusiasts, CineStream 
                was born from a simple idea: streaming should be effortless, enjoyable, and accessible to everyone.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We've partnered with TMDB (The Movie Database) to bring you comprehensive, up-to-date 
                information about every title in our catalog. Our platform is constantly evolving, 
                incorporating user feedback and the latest technology to provide you with the best 
                possible streaming experience.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default About;
