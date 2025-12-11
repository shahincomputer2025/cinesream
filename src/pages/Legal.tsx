import Navbar from '@/components/Navbar';
import MobileNav from '@/components/MobileNav';
import BackButton from '@/components/BackButton';
import Footer from '@/components/Footer';
import { Shield, Lock, FileText, Eye } from 'lucide-react';

const Legal = () => {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Navbar />
      <BackButton />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 mb-6">
              <Shield className="w-12 h-12 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Legal & Privacy
              </h1>
            </div>
            <p className="text-xl text-muted-foreground">
              Your privacy and security are our top priorities
            </p>
          </div>

          {/* Privacy Policy */}
          <section className="mb-12 animate-scale-in">
            <div className="bg-card p-8 rounded-2xl border border-border">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Privacy Policy</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Information We Collect</h3>
                  <p className="leading-relaxed">
                    We collect information you provide directly to us, such as when you create an account, 
                    update your profile, or use our services. This includes your email address, name, 
                    and viewing preferences.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">How We Use Your Information</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>To provide and improve our streaming services</li>
                    <li>To personalize your experience and recommendations</li>
                    <li>To communicate with you about your account</li>
                    <li>To ensure the security of our platform</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Data Security</h3>
                  <p className="leading-relaxed">
                    We implement industry-standard security measures to protect your personal information. 
                    Your data is encrypted both in transit and at rest, and we regularly review and update 
                    our security practices.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Your Rights</h3>
                  <p className="leading-relaxed">
                    You have the right to access, update, or delete your personal information at any time. 
                    You can manage your account settings or contact us directly for assistance.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Terms of Service */}
          <section className="mb-12">
            <div className="bg-card p-8 rounded-2xl border border-border">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Terms of Service</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Account Usage</h3>
                  <p className="leading-relaxed">
                    By creating an account, you agree to provide accurate information and maintain the 
                    security of your account credentials. You are responsible for all activity under your account.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Content Access</h3>
                  <p className="leading-relaxed">
                    All content on CineStream is provided for personal, non-commercial use only. 
                    You may not redistribute, reproduce, or create derivative works from our content.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">User Conduct</h3>
                  <p className="leading-relaxed">
                    You agree not to use our service for any unlawful purpose or in any way that could 
                    damage, disable, or impair the service. Be respectful in all interactions with other users.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Cookie Policy */}
          <section className="mb-12">
            <div className="bg-card p-8 rounded-2xl border border-border">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Cookie Policy</h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  We use cookies and similar technologies to enhance your experience, analyze usage patterns, 
                  and deliver personalized content. You can control cookie preferences through your browser settings.
                </p>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Types of Cookies We Use</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Essential Cookies:</strong> Required for the site to function properly</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how you use our service</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Attribution */}
          <section>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold mb-4">Attribution</h2>
              <p className="text-muted-foreground leading-relaxed">
                This product uses the TMDB API but is not endorsed or certified by TMDB. 
                All movie and TV show data, including images, is provided by The Movie Database (TMDB).
              </p>
            </div>
          </section>

          {/* Contact */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Questions about our legal policies? Contact us at{' '}
              <a href="mailto:legal@cinestream.com" className="text-primary hover:underline">
                legal@cinestream.com
              </a>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
};

export default Legal;
