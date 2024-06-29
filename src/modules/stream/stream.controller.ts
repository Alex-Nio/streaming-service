import { Router, Response, Request, NextFunction } from 'express';
import WebTorrent, { Torrent } from 'webtorrent';
// Interfaces
import { ErrorWithStatus, StreamRequest } from './stream.interfaces';

const router = Router();
const client = new WebTorrent();

interface State {
  progress: number;
  downloadSpeed: number;
  ratio: number;
}

let state: State = {
  progress: 0,
  downloadSpeed: 0,
  ratio: 0
};

let error: string | undefined;

client.on('error', (err: Error) => {
  console.error('err', err.message);
  error = err.message;
});

client.on('torrent', () => {
  state = {
    progress: Math.round(client.progress * 100 * 100) / 100,
    downloadSpeed: client.downloadSpeed,
    ratio: client.ratio
  };
});

router.get('/add/:magnetLink', (req: Request, res: Response) => {
  const magnetLink = req.params.magnetLink;

  client.add(magnetLink, (torrent: Torrent) => {
    const files = torrent.files.map(({ name, length }) => ({
      name,
      length
    }));

    console.log('DOWNLOAD PATH: ', torrent.path);

    res.status(200).send(files);
  });
});

router.get('/stats', (_req: Request, res: Response) => {
  state = {
    progress: Math.round(client.progress * 100 * 100) / 100,
    downloadSpeed: client.downloadSpeed,
    ratio: client.ratio
  };

  res.status(200).send(state);
});

// stream
router.get('/:magnetLink/:fileName', (req: StreamRequest, res: Response, next: NextFunction) => {
  const {
    params: { magnetLink, fileName },
    headers: { range }
  } = req;

  if (!range) {
    const err = new Error('Range is not defined, please make request from HTML5 Player') as ErrorWithStatus;
    err.status = 416;
    return next(err);
  }

  const torrent = client.get(magnetLink) as Torrent;
  const file = torrent.files.find(f => f.name === fileName);

  if (!file) {
    const err = new Error('File not found') as ErrorWithStatus;
    err.status = 404;
    return next(err);
  }

  const fileSize = file.length;
  const [startParsed, endParsed] = range.replace(/bytes=/, '').split('-');

  const start = Number(startParsed);
  const end = endParsed ? Number(endParsed) : fileSize - 1;

  const chunkSize = end - start + 1;

  const headers = {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': 'video/mp4'
  };

  res.writeHead(206, headers);

  const streamPositions = { start, end };
  const stream = file.createReadStream(streamPositions);

  stream.pipe(res);

  stream.on('error', err => next(err));
});

export default router;
