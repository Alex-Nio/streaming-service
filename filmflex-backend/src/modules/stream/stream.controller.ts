import { Router, Response, Request, NextFunction } from 'express';
import WebTorrent, { Torrent } from 'webtorrent';
import { ErrorWithStatus, StreamRequest } from './stream.interfaces';
import chalk from 'chalk-cjs'; // добавляем chalk
import * as mime from 'mime-types';

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
  console.error(chalk.red('WebTorrent client error:'), err.message); // раскрашиваем ошибку красным
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

    console.log(chalk.bgMagenta('==================================='));
    console.log(chalk.green('DOWNLOAD PATH:'), chalk.green(torrent.path));
    console.log(chalk.bgMagenta('==================================='));

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

router.get('/video/:magnetLink/:fileName', (req: StreamRequest, res: Response, next: NextFunction) => {
  const {
    params: { magnetLink, fileName },
    headers: { range }
  } = req;

  console.log(chalk.bgMagenta('==================================='));
  console.log(chalk.bgMagenta('==================================='));

  console.log(chalk.bgMagenta('==================================='));
  console.log(chalk.yellow('RANGE:'), range); // раскрашиваем диапазон жёлтым
  console.log(chalk.bgMagenta('==================================='));

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

  // Определение Content-Type на основе расширения файла
  const contentType = mime.contentType(fileName) || 'application/octet-stream';

  console.log(chalk.magenta('==================================='));
  console.log(chalk.yellow('CONTENT TYPE:'), contentType);
  console.log(chalk.magenta('==================================='));

  const headers = {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
    'Content-Type': contentType
  };

  // Определение текущего прогресса загрузки в MB
  const loadedMB = (end - start + 1) / (1024 * 1024); // преобразование из байтов в MB
  const fileSizeMB = fileSize / (1024 * 1024); // преобразование из байтов в MB
  const remainingMB = (fileSize - (end - start + 1)) / (1024 * 1024); // преобразование из байтов в MB
  const chunkSizeMB = chunkSize / (1024 * 1024); // преобразование из байтов в MB

  console.log(chalk.bgBlue('==================================='));
  console.log(chalk.cyan('FILE SIZE:'), fileSizeMB.toFixed(2), 'MB');
  console.log(chalk.cyan('LOADED:'), loadedMB.toFixed(2), 'MB');
  console.log(chalk.cyan('CHUNK SIZE:'), chunkSizeMB.toFixed(2), 'MB');
  console.log(chalk.cyan('REMAINING:'), remainingMB.toFixed(2), 'MB');
  console.log(chalk.bgBlue('==================================='));
  console.log(chalk.cyan('START:'), start, ' bytes');
  console.log(chalk.cyan('END:'), end, ' bytes');
  console.log(chalk.cyan('CHUNK SIZE:'), chunkSize, ' bytes');
  console.log(chalk.cyan('REMAINING:'), fileSize, ' bytes');
  console.log(chalk.bgBlue('==================================='));

  res.writeHead(206, headers);

  const streamPositions = { start, end };
  const fileStream = file.createReadStream(streamPositions);

  fileStream.on('error', err => {
    console.log(chalk.bgBlue('==================================='));
    console.error(chalk.red('File stream error:'), err);
    console.log(chalk.bgBlue('==================================='));
    next(err);
  });

  fileStream.pipe(res);

  // Обработка закрытия соединения
  res.socket.on('close', () => {
    console.log(chalk.bgBlue('==================================='));
    console.log(chalk.gray('Connection closed by client'));
    console.log(chalk.bgBlue('==================================='));
  });

  fileStream.on('end', () => {
    console.log(chalk.bgBlue('==================================='));
    console.log(chalk.gray('All the data in the file has been read'));
    console.log(chalk.bgBlue('==================================='));
  });

  fileStream.on('close', () => {
    console.log(chalk.bgBlue('==================================='));
    console.log(chalk.gray('Stream has been destroyed and file has been closed'));
    console.log(chalk.bgBlue('==================================='));
  });
});

export default router;
