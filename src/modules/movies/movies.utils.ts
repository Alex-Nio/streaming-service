import axios from 'axios';
import iconv from 'iconv-lite';
import dotenv from 'dotenv';
import * as cheerio from 'cheerio';
import { parse } from 'qs';
import { MAGNET_KEY, BASE_SEARCH_URL, BASE_FILM_URL, REPLACE_MAGNET_STRING } from './movies.consts';

dotenv.config();

const parseDetails = (fullText, label) => {
  const startIndex = fullText.indexOf(label);
  if (startIndex !== -1) {
    return fullText
      .slice(startIndex + label.length)
      .trim()
      .replace(/^:\s*/, '');
  }
  return '';
};

const setTorrentDetails = (publication, data) => {
  const decodedPageData = iconv.decode(Buffer.from(data), 'win1251');
  const $ = cheerio.load(decodedPageData);

  const descriptionElement = $('span.post-b')
    .filter(function () {
      return $(this).text().trim() === 'Качество видео';
    })
    .parent();

  if (descriptionElement.length) {
    const fullText = descriptionElement.text().trim();

    publication.quality = parseDetails(fullText, 'Качество видео').split('\n')[0] || 'Не найдено';
    publication.format = parseDetails(fullText, 'Видео:').split('\n')[0] || 'Не найдено';
    publication.audio = parseDetails(fullText, 'Аудио:').split('\n')[0] || 'Не найдено';
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

  const promises = publications.map(publication =>
    axios
      .get(`${BASE_FILM_URL}/${publication.page}`, {
        responseType: 'arraybuffer',
        headers: { Cookie: cookies },
        withCredentials: true
      })
      .then(response => {
        setMagnetKeys(publication, response.data);
        setTorrentDetails(publication, response.data);
        return publication;
      })
      .catch(error => {
        console.error('Ошибка при запросе страницы', error);
        return publication;
      })
  );

  return Promise.all(promises);
};

const getPublications = data => {
  const decodedData = iconv.decode(Buffer.from(data), 'win1251');
  const $ = cheerio.load(decodedData);
  const nodes = $('#tor-tbl tr').toArray();

  return nodes.slice(1, nodes.length - 1).map(node => {
    const [categoryTag, pageTag, authorTag, sizeTag] = $(node).find('a').toArray();
    const author = $(authorTag).text();
    const title = $(pageTag).text();
    const categoryName = $(categoryTag).parent().children().text();
    const pageLink = $(pageTag).attr('href');
    const size = $(sizeTag).text();
    const seeds = $(node).find('.seedmed').text();
    const peers = $(node).find('.leechmed').text();

    return {
      author: author || 'Не найдено',
      title: title || 'Не найдено',
      category: categoryName || 'Не найдено',
      torrent: `${BASE_FILM_URL}/${pageLink}`,
      page: pageLink,
      size: size || 'Не найдено',
      seeds: seeds || 'Не найдено',
      peers: peers || 'Не найдено'
    };
  });
};

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
