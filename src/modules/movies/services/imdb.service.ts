// Packages
import axios from 'axios';
import { stringify } from 'querystring';
// Consts
import { IMDB_SEARCH_URL } from '../movies.consts';
// Cfg
import 'dotenv/config';

export const doSearchInImdb = async query => {
  const queryParams = stringify({
    query,
    language: 'ru',
    api_key: process.env.IMDB_API_KEY
  });

  const {
    data: { results }
  } = await axios.get(`${IMDB_SEARCH_URL}/search/movie?${queryParams}`);

  const [movie] = results;

  return movie;
};

export const getMovieFromImdb = async (imdbId: string) => {
  const queryParams = stringify({
    language: 'ru',
    api_key: process.env.IMDB_API_KEY
  });

  const result = await axios.get(`${IMDB_SEARCH_URL}/movie/${imdbId}?${queryParams}`);

  return result.data;
};
