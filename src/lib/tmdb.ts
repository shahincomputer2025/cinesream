const TMDB_API_KEY = '0510324d27fbae60f7ac5bdfc3f1481f';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
}

export interface MovieDetails extends Omit<Movie, 'genre_ids'> {
  runtime: number;
  genres: { id: number; name: string }[];
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
    }[];
  };
}

export interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details: {
    rating: number | null;
  };
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export const tmdb = {
  async getTrending(timeWindow: 'day' | 'week' = 'week'): Promise<Movie[]> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch trending movies');
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching trending movies:', error);
      return [];
    }
  },

  async getPopular(): Promise<Movie[]> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch popular movies');
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return [];
    }
  },

  async getTopRated(): Promise<Movie[]> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch top rated movies');
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      return [];
    }
  },

  async getNowPlaying(): Promise<Movie[]> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch now playing movies');
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      return [];
    }
  },

  async searchMovies(query: string): Promise<Movie[]> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error('Failed to search movies');
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  },

  async getMovieDetails(movieId: number): Promise<MovieDetails | null> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits`
      );
      if (!response.ok) throw new Error('Failed to fetch movie details');
      return response.json();
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  },

  async getMovieReviews(movieId: number): Promise<Review[]> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${movieId}/reviews?api_key=${TMDB_API_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },

  async getSimilarMovies(movieId: number): Promise<Movie[]> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch similar movies');
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching similar movies:', error);
      return [];
    }
  },

  async getMoviesByGenre(genreId: number): Promise<Movie[]> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}`
      );
      if (!response.ok) throw new Error('Failed to fetch movies by genre');
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      return [];
    }
  },

  async getByGenre(genreId: number, page: number = 1): Promise<Movie[]> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}`
      );
      if (!response.ok) throw new Error('Failed to fetch movies by genre');
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      return [];
    }
  },

  async getMovieVideos(movieId: number): Promise<Video[]> {
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}`
      );
      if (!response.ok) throw new Error('Failed to fetch movie videos');
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error fetching movie videos:', error);
      return [];
    }
  },

  getImageUrl(path: string | null, size: 'w200' | 'w500' | 'original' = 'w500'): string {
    if (!path) return '/placeholder.svg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  },
};

export const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];
