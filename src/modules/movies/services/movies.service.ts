// Packages
import axios from 'axios';
// Consts
import { BASE_SEARCH_URL } from '../constants/movies.consts';
// Utils
import { getPublications, getTorrents } from '../helpers/movies.helper';
// Interfaces
import { Movie } from '../interfaces/entity.interfaces';
// Models
import MovieEntity from '../models/movies.model';

export const doSearch = async query => {
  const cookies = process.env.RUTRACKER_COOKIES;
  const response = await axios.get(`${BASE_SEARCH_URL}${query}`, {
    responseType: 'arraybuffer',
    headers: { Cookie: cookies },
    withCredentials: true
  });

  const publications = getPublications(response.data);
  return getTorrents(publications);
};

// CRUD
export const create = async (input: Movie) => {
  const item = new MovieEntity(input);
  await item.save();
  return item;
};

export const update = (input: Partial<Movie>, id: string) => {
  return MovieEntity.findByIdAndUpdate(id, input, {
    new: true
  });
};

export const findOne = (id: string) => {
  return MovieEntity.findById(id);
};

export const findAll = () => {
  return MovieEntity.find();
};

export const deleteOne = (id: string) => {
  return MovieEntity.findByIdAndDelete(id);
};
