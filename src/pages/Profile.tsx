import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Clock, Bell, Play, User as UserIcon, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import BackButton from '@/components/BackButton';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { AccountSettingsDialog } from '@/components/AccountSettingsDialog';

const Profile = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { data: profile, isLoading: profileLoading, refetch } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // Cache profile for 2 minutes
    gcTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (authLoading || profileLoading) {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      <BackButton />
        <div className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
          <div className="text-center mb-12">
            <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
            <Skeleton className="h-8 w-48 mx-auto mb-2" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  if (!user || !profile) return null;

  const handleMenuClick = (label: string) => {
    if (label === 'Watchlist') {
      navigate('/watchlist');
    } else if (label === 'Account') {
      setSettingsOpen(true);
    }
    // Other menu items can be implemented as needed
  };

  const menuItems = [
    { icon: Bookmark, label: 'Watchlist', section: 'stuff', action: () => navigate('/watchlist') },
    { icon: Clock, label: 'Viewing History', section: 'stuff' },
    { icon: Bell, label: 'Notifications', section: 'settings' },
    { icon: Play, label: 'Playback', section: 'settings' },
    { icon: UserIcon, label: 'Account', section: 'settings', action: () => setSettingsOpen(true) },
    { icon: HelpCircle, label: 'Help', section: 'settings' },
  ];

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
        {/* Profile Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="relative inline-block mb-4">
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.full_name || 'Profile'} 
                className="w-32 h-32 rounded-full object-cover mx-auto"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold mx-auto">
                {profile.full_name?.charAt(0).toUpperCase() || profile.email.charAt(0).toUpperCase()}
              </div>
            )}
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
              <UserIcon className="w-5 h-5 text-white" />
            </button>
          </div>
          <h1 className="text-3xl font-bold mb-2">{profile.full_name || 'Movie Fan'}</h1>
          <p className="text-muted-foreground">{profile.email}</p>
        </div>

        {/* My Stuff */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
            My Stuff
          </h2>
          <div className="space-y-2">
            {menuItems
              .filter((item) => item.section === 'stuff')
              .map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => item.action?.()}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-card hover:bg-muted transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                    <svg
                      className="w-5 h-5 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                );
              })}
          </div>
        </section>

        {/* Settings */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
            Settings
          </h2>
          <div className="space-y-2">
            {menuItems
              .filter((item) => item.section === 'settings')
              .map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => item.action?.()}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-card hover:bg-muted transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="flex-1 text-left font-medium">{item.label}</span>
                    <svg
                      className="w-5 h-5 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                );
              })}
          </div>
        </section>

        {/* Log Out */}
        <Button
          variant="destructive"
          className="w-full h-14 text-base font-semibold"
          onClick={handleSignOut}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Log Out
        </Button>
      </div>

      <AccountSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        profile={profile}
        onProfileUpdate={() => refetch()}
      />

      <MobileNav />
    </div>
  );
};

export default Profile;
