// Cfg
import 'dotenv/config';
// Interfaces
import { Movie, IMDBMovie } from '../movies.interfaces';
// Helpers
import { convertMovie, IMDBRequests } from '../helpers/imdb.helper';

const { searchMovie, getMovie } = IMDBRequests();

export const doSearchInImdb = async (query: string): Promise<Partial<IMDBMovie>> => {
  const {
    data: { results }
  } = await searchMovie(query);
  const [movie] = results;

  return movie;
};

export const getMovieFromImdb = async (imdbId: string): Promise<Partial<Movie>> => {
  const { data } = await getMovie(imdbId);
  return convertMovie(data);
};
