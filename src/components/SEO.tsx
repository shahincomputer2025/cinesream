import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: string;
  canonicalUrl?: string;
  jsonLd?: object;
}

const SEO = ({ 
  title, 
  description, 
  keywords = "free movies online, watch movies free, classic movies, public domain films, streaming movies",
  image = "https://cinemas-stream.netlify.app/icon-512.png",
  type = "website",
  canonicalUrl,
  jsonLd
}: SEOProps) => {
  const location = useLocation();
  const baseUrl = "https://cinemas-stream.netlify.app";
  const fullUrl = canonicalUrl || `${baseUrl}${location.pathname}`;
  const fullTitle = `${title} | CineStream`;

  useEffect(() => {
    // Update title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${property}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, property);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('author', 'CineStream');

    // Open Graph tags
    updateMetaTag('og:title', fullTitle, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', fullUrl, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:site_name', 'CineStream', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', fullTitle);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

    // JSON-LD Structured Data
    if (jsonLd) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }

    // Cleanup function
    return () => {
      const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
      if (jsonLdScript && !jsonLd) {
        jsonLdScript.remove();
      }
    };
  }, [title, description, keywords, image, type, fullUrl, fullTitle, jsonLd]);

  return null;
};

export default SEO;
