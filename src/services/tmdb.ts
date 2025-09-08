import axios from 'axios';

const API_KEY = '8265bd1679663a7ea12ac168da84d2e8'; // TMDB public API key
const BASE_URL = 'https://api.themoviedb.org/3';

export const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export interface Movie {
  id: number;
  title: string;
  poster_path?: string;
  backdrop_path?: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface MovieDetails extends Movie {
  runtime?: number;
  genres: Array<{ id: number; name: string }>;
  production_companies: Array<{ id: number; name: string; logo_path?: string }>;
  production_countries: Array<{ iso_3166_1: string; name: string }>;
  spoken_languages: Array<{ english_name: string; iso_639_1: string; name: string }>;
  status: string;
  tagline?: string;
  budget: number;
  revenue: number;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  size: number;
  official: boolean;
  published_at: string;
}

export interface VideosResponse {
  id: number;
  results: Video[];
}

export interface StreamingSource {
  quality: string;
  url: string;
  format: string;
  size?: string;
}

export interface MovieStreamingData {
  sources: StreamingSource[];
  subtitles: Array<{
    language: string;
    url: string;
    label: string;
  }>;
}

// API Functions
export const movieService = {
  // Get trending movies
  getTrending: async (timeWindow: 'day' | 'week' = 'week'): Promise<TMDBResponse<Movie>> => {
    const response = await tmdbApi.get(`/trending/movie/${timeWindow}`);
    return response.data;
  },

  // Get popular movies
  getPopular: async (page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await tmdbApi.get('/movie/popular', { params: { page } });
    return response.data;
  },

  // Get top rated movies
  getTopRated: async (page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await tmdbApi.get('/movie/top_rated', { params: { page } });
    return response.data;
  },

  // Get upcoming movies
  getUpcoming: async (page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await tmdbApi.get('/movie/upcoming', { params: { page } });
    return response.data;
  },

  // Search movies
  searchMovies: async (query: string, page: number = 1): Promise<TMDBResponse<Movie>> => {
    const response = await tmdbApi.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  },

  // Get movie details
  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  },

  // Get movie videos/trailers
  getMovieVideos: async (movieId: number): Promise<VideosResponse> => {
    const response = await tmdbApi.get(`/movie/${movieId}/videos`);
    return response.data;
  },

  // Get movie streaming sources (محاكاة - في التطبيق الحقيقي ستأتي من خادم الأفلام)
  getMovieStreamingSources: async (movieId: number): Promise<MovieStreamingData> => {
    // في التطبيق الحقيقي، هذا سيكون API منفصل لخادم الأفلام
    // الآن سنحاكي البيانات بناءً على معرف الفيلم
    
    const movieStreamingSources: Record<string, MovieStreamingData> = {
      // Night of the Living Dead (1968) - فيلم حقيقي في الملك العام
      '12644': {
        sources: [
          {
            quality: 'HD',
            url: 'https://archive.org/download/night_of_the_living_dead_1968/night_of_the_living_dead_1968_512kb.mp4',
            format: 'mp4',
            size: '495MB'
          },
          {
            quality: 'SD',
            url: 'https://archive.org/download/night_of_the_living_dead_1968/night_of_the_living_dead_1968_256kb.mp4',
            format: 'mp4',
            size: '247MB'
          }
        ],
        subtitles: [
          {
            language: 'en',
            url: 'https://archive.org/download/night_of_the_living_dead_1968/night_of_the_living_dead_1968.srt',
            label: 'English'
          }
        ]
      },

      // Plan 9 from Outer Space - فيلم حقيقي مجاني
      '24986': {
        sources: [
          {
            quality: 'HD',
            url: 'https://archive.org/download/Plan9FromOuterSpace_201301/Plan9FromOuterSpace.mp4',
            format: 'mp4',
            size: '623MB'
          }
        ],
        subtitles: [
          {
            language: 'en',
            url: 'https://archive.org/download/Plan9FromOuterSpace_201301/Plan9FromOuterSpace.srt',
            label: 'English'
          }
        ]
      },

      // The Cabinet of Dr. Caligari - فيلم كلاسيكي مجاني
      '3090': {
        sources: [
          {
            quality: 'HD',
            url: 'https://archive.org/download/TheCabinetOfDr.Caligari_201410/TheCabinetOfDr.Caligari.mp4',
            format: 'mp4',
            size: '445MB'
          }
        ],
        subtitles: []
      },

      // Nosferatu (1922) - فيلم رعب كلاسيكي
      '657': {
        sources: [
          {
            quality: 'HD',
            url: 'https://archive.org/download/Nosferatu_1922_murnau/Nosferatu_1922_murnau_512kb.mp4',
            format: 'mp4',
            size: '387MB'
          }
        ],
        subtitles: [
          {
            language: 'en',
            url: 'https://archive.org/download/Nosferatu_1922_murnau/Nosferatu_1922_murnau.srt',
            label: 'English'
          }
        ]
      },

      // Metropolis (1927) - تحفة السينما الصامتة
      '62': {
        sources: [
          {
            quality: 'HD',
            url: 'https://archive.org/download/Metropolis_1927_various/Metropolis_1927_german_512kb.mp4',
            format: 'mp4',
            size: '1.2GB'
          }
        ],
        subtitles: [
          {
            language: 'en',
            url: 'https://archive.org/download/Metropolis_1927_various/Metropolis_1927_english.srt',
            label: 'English'
          }
        ]
      },

      // Big Buck Bunny - فيلم مجاني عالي الجودة
      '10378': {
        sources: [
          {
            quality: '4K',
            url: 'https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4',
            format: 'mp4',
            size: '355MB'
          },
          {
            quality: 'HD',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            format: 'mp4',
            size: '158MB'
          }
        ],
        subtitles: [
          {
            language: 'en',
            url: 'https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.srt',
            label: 'English'
          }
        ]
      },

      // Sintel - فيلم قصير احترافي
      '45745': {
        sources: [
          {
            quality: 'HD',
            url: 'https://download.blender.org/durian/trailer/sintel_trailer-720p.mp4',
            format: 'mp4',
            size: '127MB'
          }
        ],
        subtitles: [
          {
            language: 'en',
            url: 'https://download.blender.org/durian/trailer/sintel_trailer-720p.srt',
            label: 'English'
          }
        ]
      },

      // أفلام أخرى (أمثلة لأفلام شهيرة - ستستخدم عينات)
      '550': { // Fight Club
        sources: [
          {
            quality: 'HD',
            url: 'https://archive.org/download/night_of_the_living_dead_1968/night_of_the_living_dead_1968_512kb.mp4',
            format: 'mp4',
            size: '495MB'
          }
        ],
        subtitles: [
          {
            language: 'en',
            url: 'https://archive.org/download/night_of_the_living_dead_1968/night_of_the_living_dead_1968.srt',
            label: 'English'
          }
        ]
      }
    };

    // إذا لم يكن الفيلم متوفر، استخدم مصادر افتراضية سريعة
    const defaultSources: MovieStreamingData = {
      sources: [
        {
          quality: 'HD',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          format: 'mp4',
          size: '158MB'
        },
        {
          quality: 'SD',
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          format: 'mp4',
          size: '95MB'
        }
      ],
      subtitles: [
        {
          language: 'en',
          url: 'https://example.com/subtitles.srt',
          label: 'English'
        }
      ]
    };

    return movieStreamingSources[movieId.toString()] || defaultSources;
  },

  // Get movie genres
  getGenres: async () => {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data;
  },

  // Discover movies with filters
  discoverMovies: async (params: {
    page?: number;
    with_genres?: string;
    sort_by?: string;
    'primary_release_date.gte'?: string;
    'primary_release_date.lte'?: string;
    'vote_average.gte'?: number;
  }): Promise<TMDBResponse<Movie>> => {
    const response = await tmdbApi.get('/discover/movie', { params });
    return response.data;
  },
};

export default movieService;