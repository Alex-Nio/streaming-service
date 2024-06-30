import { Request } from 'express';
import { Movie } from './entity.interfaces';

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
