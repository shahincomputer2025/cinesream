import { supabase } from '@/integrations/supabase/client';

export interface IAVideo {
  id: string;
  movie_id: number;
  ia_identifier: string;
  title: string;
  description?: string;
  streamUrl?: string;
  embedUrl?: string;
  detailUrl?: string;
  file_size?: number;
  duration?: number;
  metadata?: any;
}

export interface IASearchResult {
  identifier: string;
  title: string;
  description?: string;
  uploadDate?: string;
  fileSize?: number;
  duration?: string;
  streamUrl: string;
  detailUrl: string;
}

export interface IACollectionMovie {
  identifier: string;
  title: string;
  description?: string;
  fileSize?: number;
  duration?: string;
  addedDate?: string;
  streamUrl: string;
  embedUrl: string;
  detailUrl: string;
  metadata?: any;
}

export const iaVideos = {
  async getVideosForMovie(movieId: number): Promise<IAVideo[]> {
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ia-get-videos?movieId=${movieId}`;
      const response = await fetch(url, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch videos');
      const data = await response.json();
      return data?.videos || [];
    } catch (error) {
      console.error('Error fetching IA videos:', error);
      return [];
    }
  },

  async searchMovies(query: string): Promise<IASearchResult[]> {
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ia-search-movies?query=${encodeURIComponent(query)}`;
      const response = await fetch(url, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });

      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      return data?.results || [];
    } catch (error) {
      console.error('Error searching IA:', error);
      return [];
    }
  },

  async uploadVideo(params: {
    movieId: number;
    title: string;
    description?: string;
    file: File;
  }): Promise<any> {
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          
          const { data, error } = await supabase.functions.invoke('ia-upload-video', {
            body: {
              movieId: params.movieId,
              title: params.title,
              description: params.description,
              file: base64,
              fileName: params.file.name,
            },
          });

          if (error) throw error;
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = reject;
      reader.readAsDataURL(params.file);
    });
  },

  async linkVideo(params: {
    movieId: number;
    iaIdentifier: string;
    title: string;
    description?: string;
    isPrimary?: boolean;
  }): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('ia-link-video', {
        body: params,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error linking video:', error);
      throw error;
    }
  },

  async fetchCollection(): Promise<IACollectionMovie[]> {
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ia-fetch-collection`;
      const response = await fetch(url, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch collection');
      const data = await response.json();
      return data?.movies || [];
    } catch (error) {
      console.error('Error fetching IA collection:', error);
      return [];
    }
  },
};