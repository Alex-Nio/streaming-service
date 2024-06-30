import axios from 'axios';
import { stringify } from 'querystring';
// Consts
import { IMDB_SEARCH_URL } from '../movies.consts';
// Interfaces
import {
  Movie,
  IMDBMovie,
  SearchMoviesResponse,
  GetCreditsResponse,
  GetVideosResponse,
  CrewMember
} from '../movies.interfaces';

export const IMDBRequests = () => {
  const params = stringify({
    language: 'ru',
    api_key: process.env.IMDB_API_KEY
  });

  const MOVIE_URL = `${IMDB_SEARCH_URL}/movie`;
  const SEARCH_URL = `${IMDB_SEARCH_URL}/search/movie`;

  return {
    getMovie: (imdbId: string) => axios.get<IMDBMovie>(`${MOVIE_URL}/${imdbId}?${params}`),
    getMovieCredits: (imdbId: number) => axios.get<GetCreditsResponse>(`${MOVIE_URL}/${imdbId}/credits?${params}`),
    searchMovie: (query: string) => axios.get<SearchMoviesResponse>(`${SEARCH_URL}?${params}&query=${query}`),
    getVideos: (imdbId: number) => axios.get<GetVideosResponse>(`${MOVIE_URL}/${imdbId}/videos?${params}`)
  };
};

const findCrewMember = (crew: CrewMember[], memberJob: string) => crew.find(({ job }) => job === memberJob).name || '';

const { getMovieCredits, getVideos } = IMDBRequests();

export const movieCredits = async (imdbId: number) => {
  try {
    const {
      data: { crew, cast }
    } = await getMovieCredits(imdbId);

    const actors = cast.map(({ name }) => name);

    return {
      actors,
      director: findCrewMember(crew, 'Director'),
      writer: findCrewMember(crew, 'Writer')
    };
  } catch (error) {
    console.log(error);
    return {
      actors: [],
      director: '',
      writer: ''
    };
  }
};

export const getMovieTrailer = async (imdbId: number) => {
  try {
    const {
      data: { results }
    } = await getVideos(imdbId);
    const { key } = results.find(({ type }) => type === 'Trailer');

    return `https://www.themoviedb.org/video/play?key=${key}`;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const convertMovie = async ({
  title,
  original_title,
  overview,
  release_date,
  id,
  poster_path,
  backdrop_path,
  revenue,
  runtime,
  vote_average,
  imdb_id,
  genres
}: IMDBMovie): Promise<Partial<Movie>> => {
  const { actors, director, writer } = await movieCredits(id);
  return {
    title,
    original_title,
    description: overview,
    year: String(new Date(release_date).getFullYear()),
    director,
    actors,
    poster: `https://media.themoviedb.org/t/p/original${poster_path}`,
    backdrop: `https://media.themoviedb.org/t/p/original${backdrop_path}`,
    trailer: await getMovieTrailer(id),
    boxOffice: String(revenue),
    released: release_date,
    writer: writer,
    runtime: String(runtime),
    ratingImdb: String(vote_average),
    imdbId: imdb_id,
    rated: '',
    genres: genres.map(({ name }) => name)
  };
};
