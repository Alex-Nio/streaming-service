import { Request } from 'express';

export interface SearchRequest extends Request {
  query: {
    nm: string;
    searchTerm: string;
  };
}

export interface GetMovieFromImdbRequest extends Request {
  params: {
    imdbId: string;
  };
}

export interface CreateMovieRequest extends Request {
  body: Movie;
}

export interface UpdateMovieRequest extends Request {
  body: Partial<Movie>;
  params: {
    id: string;
  };
}

export interface DeleteMovieRequest extends Request {
  params: {
    id: string;
  };
}

export interface GetMovieRequest extends Request {
  params: {
    id: string;
  };
}

export interface Movie {
  title: string;
  original_title: string;
  description: string;
  magnet: string;
  fileName: string;
  sourceUrl: string;
  year: string;
  director: string;
  actors: string[];
  poster: string;
  backdrop: string;
  trailer: string;
  _id?: string;
  boxOffice: string;
  released: string;
  writer: string;
  runtime: string;
  ratingImdb: string;
  imdbId: string;
  rated: string;
  genres: string[];
}

export interface IMDBMovie {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: Belongstocollection;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: Productioncompany[];
  production_countries: Productioncountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: Spokenlanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface Spokenlanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

interface Productioncountry {
  iso_3166_1: string;
  name: string;
}

interface Productioncompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}

interface Genre {
  id: number;
  name: string;
}

interface Belongstocollection {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
}

export interface CrewMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: null | string;
  credit_id?: string;
  cast_id?: string;
  character?: string;
  department: string;
  job: string;
  order: number;
}

export interface GetCreditsResponse {
  id: number;
  cast: CrewMember[];
  crew: CrewMember[];
}

export interface GetVideosResponse {
  id: number;
  results: IMDBTrailer[];
}

interface IMDBTrailer {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface SearchMoviesResponse {
  page: number;
  results: Partial<IMDBMovie>[];
  total_pages: number;
  total_results: number;
}
