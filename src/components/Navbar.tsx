import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Film, Search, Bookmark, User, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Film, label: 'Movies', path: '/movies' },
    { icon: Film, label: 'IA Collection', path: '/ia-movies' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Bookmark, label: 'Watchlist', path: '/watchlist' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border safe-top">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link to="/" className="flex items-center gap-2 group touch-manipulation active:scale-95">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-primary rounded-lg flex items-center justify-center group-hover:shadow-[var(--glow-primary)] transition-shadow">
              <Film className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
            </div>
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CineStream
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.slice(0, 3).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary touch-manipulation",
                  location.pathname === item.path ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link
              to="/search"
              className="p-2 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center rounded-lg hover:bg-muted transition-colors touch-manipulation active:scale-90"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>
            {user ? (
              <Link
                to="/profile"
                className="w-9 h-9 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center touch-manipulation active:scale-90"
                aria-label="Profile"
              >
                <User className="w-4 h-4 text-white" />
              </Link>
            ) : (
              <Button 
                variant="default" 
                size="sm"
                onClick={() => navigate('/auth')}
                className="gap-2 h-9 md:h-8 touch-manipulation active:scale-95"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
