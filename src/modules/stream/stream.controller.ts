import { Router, Response, Request, NextFunction } from "express";
import WebTorrent, { Torrent, TorrentFile } from 'webtorrent';

const router = Router();
const client = new WebTorrent();

let state = {
  process: 0,
  downloadSpeed: 0,
  ratio: 0
}

let error;

client.on('error', (err: Error) => {
  console.error('err', err.message);
  error = err.message;
});

client.on('torrent', () => {
  console.log(client.progress);
  state = {
    process: Math.round(client.progress * 100 * 100) / 100,
    downloadSpeed: client.downloadSpeed,
    ratio: client.ratio
  }
});

router.get('/add/:magnet', (req: Request, res: Response) => {
  const magnet = req.params.magnet;

  client.add(magnet, (torrent) => {
    const files = torrent.files.map(data => (
      {
        name: data.name,
        length: data.length
      }
    ));

    res.status(200).send(files);
  });
});

router.get('/stats', (req: Request, res: Response) => {
  state = {
    process: Math.round(client.progress * 100 * 100) / 100,
    downloadSpeed: client.downloadSpeed,
    ratio: client.ratio
  }

  res.status(200).send(state)
});

// stream
interface StreamRequest extends Request {
  params: {
    magnet: string,
    fileName: string
  }
  headers: {
    range: string
  }
}

interface ErrorWithStatus extends Error {
  status: number
}

router.get(
  '/:magnet/:filename',
  (req: StreamRequest, res: Response, next: NextFunction) => {
    const {
      params: { magnet, fileName },
      headers: { range }
    } = req;

    if (!range) {
      const err = new Error('Range not defined, please make request from HTML5 player') as ErrorWithStatus;
      err.status = 416;
      return next(err);
    }

    const torrentFile = client.get(magnet) as Torrent;

    if (!torrentFile) {
      const err = new Error('Torrent not found') as ErrorWithStatus;
      err.status = 404;
      return next(err);
    }

    let file: TorrentFile | undefined = undefined;

    for (let i = 0; i < torrentFile.files.length; i++) {
      const currentTorrentPiece = torrentFile.files[i];

      if (currentTorrentPiece.name === fileName) {
        file = currentTorrentPiece;
        break;
      }
    }

    if (!file) {
      const err = new Error('File not found in torrent') as ErrorWithStatus;
      err.status = 404;
      return next(err);
    }

    const fileSize = file.length;

    console.log('RANGE:', range);
    const [startParsed, endParsed] = range.replace(/bytes=/, '').split('-')

    const start = Number(startParsed);
    const end = endParsed ? Number(endParsed) : fileSize - 1;

    console.log('FileSIZE:', fileSize);
    console.log('END:', end);

    const chunkSize = end - start + 1;

    console.log(`${start}-${end}/${fileSize}`);

    const headers = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4'
    }

    res.writeHead(206, headers);

    const streamPositions = {
      start,
      end
    }

    const stream = file.createReadStream(streamPositions);

    stream.pipe(res);

    stream.on('error', (err) => {
      return next(err);
    });
});


export default router;
