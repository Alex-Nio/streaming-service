import { Belongstocollection, Productioncompany, Productioncountry, Spokenlanguage } from './movies.interfaces';

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

export interface IMDBTrailer {
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

export interface Genre {
  id: number;
  name: string;
}
