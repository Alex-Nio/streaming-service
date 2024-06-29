// Router
import { Router } from 'express';

// Interfaces
import { SearchRequest } from './movies.interfaces';
import { doSearch } from './movies.utils';

const router = Router();

router.get('/search', async (req: SearchRequest, res) => {
  try {
    const searchTerm = req.query.nm;

    const torrents = await doSearch(searchTerm);

    console.log('TOTAL TORRENTS LENGTH: ', torrents.length);

    res.status(200).send(torrents);
  } catch (err) {
    res.status(404).send(err);
  }
});

export default router;
