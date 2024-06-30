import { CrewMember, IMDBMovie, IMDBTrailer } from './entity.interfaces';

export interface GetCreditsResponse {
  id: number;
  cast: CrewMember[];
  crew: CrewMember[];
}

export interface GetVideosResponse {
  id: number;
  results: IMDBTrailer[];
}

export interface SearchMoviesResponse {
  page: number;
  results: Partial<IMDBMovie>[];
  total_pages: number;
  total_results: number;
}
