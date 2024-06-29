import axios from 'axios';
import iconv from 'iconv-lite';
import dotenv from 'dotenv';
import * as cheerio from 'cheerio';
import { parse } from 'qs';
import { GLOBAL_SEARCH_URL, MAGNET_KEY, BASE_SEARCH_URL, BASE_FILM_URL, REPLACE_MAGNET_STRING } from './movies.consts';

// Загрузка переменных из .env файла
dotenv.config();

const setTorrentDetails = (publication, data) => {
  const decodedPageData = iconv.decode(Buffer.from(data), 'win1251');
  const $ = cheerio.load(decodedPageData);

  // Найти элемент <span class="post-b">Качество видео</span> и получить текст после него
  const elementDescription = $('span.post-b')
    .filter(function () {
      return $(this).text().trim() === 'Качество видео';
    })
    .parent();

  // Инициализация переменных для описаний
  let quality = 'Не найдено';
  let format = 'Не найдено';
  let audio = 'Не найдено';

  if (elementDescription.length) {
    const fullText = elementDescription.text().trim();

    const parseDetails = label => {
      const startIndex = fullText.indexOf(label);
      if (startIndex === -1) return 'Не найдено';

      const nextLabelIndex = ['Качество видео', 'Видео:', 'Аудио:']
        .map(lbl => (lbl !== label ? fullText.indexOf(lbl, startIndex + label.length) : -1))
        .filter(idx => idx !== -1)
        .sort((a, b) => a - b)[0];

      return fullText
        .slice(startIndex + label.length, nextLabelIndex === undefined ? undefined : nextLabelIndex)
        .trim()
        .replace(/^:\s*/, '');
    };

    quality = parseDetails('Качество видео');
    format = parseDetails('Видео:');
    audio = parseDetails('Аудио:');
  }

  // Заполнение полей объекта publication
  publication.quality = quality.split('\n')[0].trim();
  publication.format = format.split('\n')[0].trim();
  publication.audio = audio.split('\n')[0].trim();

  // Предупреждение в случае отсутствия данных
  if (publication.quality === 'Не найдено') {
    console.warn(`Quality not found for page: ${publication.page}`);
  }
};

const setMagnetKeys = (publication, data) => {
  const decodedPageData = iconv.decode(Buffer.from(data), 'win1251');
  const $page = cheerio.load(decodedPageData);
  const magnetLinkNode = $page('.magnet-link').attr('href');

  publication.magnetLink = getMagnetKey(magnetLinkNode, publication.page);
};

const getMagnetKey = (node, page) => {
  if (!node) return `Magnet link not found for page: ${page}`;

  const parsedMagnetLink = parse(node);
  return String(parsedMagnetLink[MAGNET_KEY]).replace(REPLACE_MAGNET_STRING, '');
};

const getTorrents = async publications => {
  const cookies = process.env.RUTRACKER_COOKIES;

  for (let publication of publications) {
    try {
      const response = await axios.get(`${BASE_FILM_URL}/${publication.page}`, {
        responseType: 'arraybuffer',
        headers: {
          Cookie: cookies
        },
        withCredentials: true
      });

      setMagnetKeys(publication, response.data);
      setTorrentDetails(publication, response.data);
    } catch (error) {
      console.error('Ошибка при запросе страницы', error);
    }
  }

  return publications;
};

const getPublications = async data => {
  // Конвертация полученных данных из Windows-1251 в UTF-8
  const decodedData = iconv.decode(Buffer.from(data), 'win1251');
  const $ = cheerio.load(decodedData);
  const nodes = $('#tor-tbl tr').toArray();

  let posts = [];

  nodes.map(node => {
    const [categoryTag, pageTag, authorTag, sizeTag] = $(node).find('a').toArray();

    const categoryName = $(categoryTag).parent().children().text();
    const pageLink = $(pageTag).attr('href');
    const title = $(pageTag).text();
    const author = $(authorTag).text();
    const size = $(sizeTag).text();
    const seeds = $(node).find('.seedmed').text();
    const peers = $(node).find('.leechmed').text();

    posts.push({
      title: title ? title : 'Не найдено',
      category: categoryName ? categoryName : 'Не найдено',
      page: pageLink,
      author: author ? author : 'Не найдено',
      size: size ? size : 'Не найдено',
      torrent: `${BASE_FILM_URL}/${pageLink}`,
      seeds: seeds ? seeds : 'Не найдено',
      peers: peers ? peers : 'Не найдено'
    });
  });

  return posts.slice(1, posts.length - 1);
};

export const doSearch = async (query: string) => {
  const cookies = process.env.RUTRACKER_COOKIES;

  const response = await axios.get(`${GLOBAL_SEARCH_URL}${query}`, {
    responseType: 'arraybuffer', // важный параметр для получения данных в бинарном формате
    headers: {
      Cookie: cookies
    },
    withCredentials: true
  });

  const publications = await getPublications(response.data);

  return await getTorrents(publications);
};
