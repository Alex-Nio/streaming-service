// Router
import { Router } from 'express';

// Packages
import axios from 'axios';
import iconv from 'iconv-lite';
import dotenv from 'dotenv';
import chalk from 'chalk-cjs';
import * as cheerio from 'cheerio';
import { parse } from 'qs';

// Interfaces
import { SearchRequest } from './movies.interfaces';

// Загрузка переменных из .env файла
dotenv.config();

const router = Router();

const BASE_SEARCH_URL = 'https://rutracker.org/forum/tracker.php?f=252&nm=';
const BASE_FILM_URL = 'https://rutracker.org/forum';
const MAGNET_KEY = 'magnet:?xt';
const REPLACE_MAGNET_STRING = 'urn:btih:';

const logs = (searchTerm: string) => {
  console.log(chalk.bgMagenta('============================================'));
  console.log(chalk.blue('searchTerm:'), chalk.green(searchTerm));
  console.log(chalk.blue('URL: '), chalk.green(`${BASE_SEARCH_URL}${searchTerm}`));
  console.log(chalk.blue('COOKIES: '), chalk.cyan(process.env.RUTRACKER_COOKIES));
  console.log(chalk.bgMagenta('============================================'));
};

router.get('/search', async (req: SearchRequest, res) => {
  try {
    const cookies = process.env.RUTRACKER_COOKIES;
    const searchTerm = req.query.nm;

    logs(searchTerm);

    const searchResult = await axios.get(`${BASE_SEARCH_URL}${searchTerm}`, {
      responseType: 'arraybuffer', // важный параметр для получения данных в бинарном формате
      headers: {
        Cookie: cookies
      },
      withCredentials: true
    });

    // Конвертация полученных данных из Windows-1251 в UTF-8
    const decodedData = iconv.decode(Buffer.from(searchResult.data), 'win1251');

    const $ = cheerio.load(decodedData);

    const data = $('#tor-tbl tr').toArray();

    // TODO: refactoring this
    let posts = [];

    data.map((item, index) => {
      const [categoryTag, pageTag, authorTag, sizeTag] = $(item).find('a').toArray();

      const categoryName = $(categoryTag).parent().children().text();
      const pageLink = $(pageTag).attr('href');
      const title = $(pageTag).text();
      const author = $(authorTag).text();
      const size = $(sizeTag).text();

      posts.push({
        title: title,
        category: categoryName,
        page: pageLink,
        author: author,
        size: size,
        torrent: `${BASE_FILM_URL}/${pageLink}`
      });
    });

    posts = posts.slice(1, posts.length - 1);

    // TODO: refactoring this
    for (let post of posts) {
      try {
        const response = await axios.get(`${BASE_FILM_URL}/${post.page}`, {
          responseType: 'arraybuffer',
          headers: {
            Cookie: cookies
          },
          withCredentials: true
        });

        // Конвертация полученных данных из Windows-1251 в UTF-8
        const decodedPageData = iconv.decode(Buffer.from(response.data), 'win1251');

        const $page = cheerio.load(decodedPageData);

        // Найти элемент с классом .magnet-link и получить его атрибут href
        let magnetLink = $page('.magnet-link').attr('href');

        if (magnetLink) {
          const parsedMagnetLink = parse(magnetLink);
          post.magnetLink = String(parsedMagnetLink[MAGNET_KEY]).replace(REPLACE_MAGNET_STRING, '');
        } else {
          post.magnetLink = `Magnet link not found for page: ${post.page}`;
        }

        // Найти элемент <span class="post-b">Качество видео</span> и получить текст после него
        const descriptionElement = $page('span.post-b')
          .filter(function () {
            return $(this).text().trim() === 'Качество видео';
          })
          .parent();

        // TODO: refactoring this
        let description = '';
        let description2 = '';
        let description3 = '';

        if (descriptionElement.length) {
          const fullText = descriptionElement.text().trim();
          const descriptionStartIndex = fullText.indexOf('Качество видео');
          const description2StartIndex = fullText.indexOf('Видео:');
          const description3StartIndex = fullText.indexOf('Аудио:');

          if (descriptionStartIndex !== -1) {
            description = fullText
              .slice(descriptionStartIndex + 'Качество видео'.length)
              .trim()
              .replace(/^:\s*/, '');

            if (descriptionStartIndex !== -1) {
              description2 = fullText
                .slice(description2StartIndex + 'Аудио:'.length)
                .trim()
                .replace(/^:\s*/, '');
            }

            if (descriptionStartIndex !== -1) {
              description3 = fullText
                .slice(description3StartIndex)
                .trim()
                .replace(/^:\s*/, '')
                .replace(/Аудио:/, '');
            }
          }
        }

        // TODO: refactoring this
        if (description) {
          post.quality = description.split('\n')[0].replace(/^:\s*/, '').trim();
          post.format = description2.split('\n')[0].replace(/^:\s*/, '').trim();
          post.audio = description3.split('\n')[0].replace(/^:\s*/, '').trim();
        } else {
          console.warn(`Quality not found for page: ${post.page}`);
        }
      } catch (error) {
        console.error('Ошибка при запросе страницы', error);
      }
    }

    res.status(200).send(posts);
  } catch (err) {
    res.status(404).send(err);
  }
});

export default router;
