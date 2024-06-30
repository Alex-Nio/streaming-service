// Router
import { Router } from 'express';

// Service
import * as movieService from '../services/movies.service';
import * as imdbService from '../services/imdb.service';

// Interfaces
import { CreateMovieRequest, SearchRequest, GetMovieFromImdbRequest } from '../movies.interfaces';

const router = Router();

router.get('/search', async (req: SearchRequest, res) => {
  try {
    const searchTerm = req.query.nm;

    const results = await movieService.doSearch(searchTerm);

    console.log('TOTAL TORRENTS LENGTH: ', results.length);

    // Сортировка по убыванию сидов
    if (results.length > 0) results.sort((a, b) => b.seeds - a.seeds);

    res.status(200).send(results);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.get('/imdb-search', async ({ query: { searchTerm } }: SearchRequest, res) => {
  try {
    const results = await imdbService.doSearchInImdb(searchTerm);

    res.status(200).send(results);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.get('/imdb/:imdbId', async ({ params: { imdbId } }: GetMovieFromImdbRequest, res) => {
  try {
    console.log(imdbId);

    const results = await imdbService.getMovieFromImdb(imdbId);

    res.status(200).send(results);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.post('/', async ({ body }: CreateMovieRequest, res) => {
  try {
    const result = await movieService.create(body);

    res.status(200).send(result);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.get('/', async (_, res) => {
  try {
    const results = await movieService.findAll();

    res.status(200).send(results);
  } catch (err) {
    res.status(404).send(err);
  }
});

export default router;
