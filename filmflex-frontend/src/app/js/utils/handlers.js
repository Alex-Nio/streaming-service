import { preloader } from '../libs/ilab-preloader/ilabPreloader.js';
import { ilabScrollbar } from './../libs/ilab-scrollbar/ilabScrollbar.js';

// Custom Scrollbars init
const initializeScrollbars = () => {
  const customScrollElements = document.querySelectorAll('[data-simplebar]');

  if (customScrollElements.length > 0) {
    window.customScrollElements = [];

    customScrollElements.forEach((element) => {
      const scrollElement = new ilabScrollbar(element, {
        autoHide: false,
      });

      setTimeout(() => {
        window.customScrollElements.push(scrollElement);
      }, 0);
    });
  }
};

// Вызываем прелоадеры последовательно и затем инициализацию скроллбаров
preloader('.page-preloader', 1000, true)
  .then(() => {
    return Promise.all([
      preloader('.element-preloader', 1500, false),
      preloader('.button-preloader', 1500, false),
    ]);
  })
  .then(() => {
    initializeScrollbars();
  });
