/*eslint-disable*/
import { templates } from './config/template_options.js';
import { getTemplate } from './modules/render.js';

/*
  Lib: ilab-select
  updated: 29.11.2023
  author: Alex Nio
  GitHub: https://github.com/Alex-Nio
  Telegram: @eterfox
*/

export class ilabSelect {
  constructor(options) {
    this.options = options;

    this.data = this.options.data ?? [];
    this.$el = document.getElementById(`${this.options.id}`) || null;

    this.nodeName = this.options.id ?? this.#logger('idError');
    this.trigger = this.options.trigger ?? 'active';
    this.focus = this.options.focus ?? 'focus';

    this.behaviour = this.options.behaviour ?? {};
    this.callbacks = this.options.callbacks ?? {};

    if (!this.$el) return;

    this.#render();
    this.#setup();
  }

  //* ==============================Private============================ *\\
  //* ================================================================= *\\

  #render() {
    this.type = this.$el.dataset.type ?? this.#logger('datasetError');
    this.template = this.$el.dataset.template ?? this.#logger('datasetError');
    this.templates = templates || {};
    this.selectedTemplate = this.templates[this.template] || '';

    this.$el.innerHTML =
      getTemplate(this.selectedTemplate, this.nodeName, this.data) ?? '';

    this.$el.classList.add(this.nodeName);
    this.$icon = this.$el.querySelector('[data-type="icon"]');
    this.$input = this.$el.querySelector('[data-type="input"]');
    this.$items = this.$el.querySelectorAll('[data-type="item"]');
    this.$dropdown = this.$el.querySelector('[data-type="dropdown"]');
  }

  #setup() {
    this.document = document;
    this.enabled = true;
    this.events = this.#dispatcher();

    this.isEnabled ? null : this.disable();

    this.$el.addEventListener('click', this.clickHandler);
    this.$el.addEventListener('input', this.inputHandler);

    this.hasCallbacks > 0 ? this.#callbacks() : null;

    // Global obj init
    window.dropdowns ? null : (window.dropdowns = []);
    window.dropdowns.push(this);
  }

  #callbacks() {
    Object.values(this.callbacks).forEach((cb) => {
      cb(this);
    });
  }

  //* =============================Logger============================== *\\
  //* ================================================================= *\\

  #logger(error) {
    switch (error) {
      case 'idError':
        console.error('Не указан дата-атрибут id');
        break;
      case 'datasetError':
        console.error(
          `Не указан дата-атрибут data-type на элементе c id="${this.$el.id}"`
        );
        break;
      case 'setDataError':
        console.error('Новое значение не является массивом.');
        break;
    }
  }

  //* ===========================Dispatcher============================ *\\
  //* ================================================================= *\\

  // Returns custom events obj
  #dispatcher() {
    return {
      toggle: new Event('dropdown-toggle'),
      open: new Event('dropdown-opened'),
      close: new Event('dropdown-closed'),
      clear: new Event('dropdown-clear'),
      select: new Event('dropdown-select'),
      enter: new Event('enter-keydown'),
      destroy: new Event('dropdown-destroy'),
      custom: new CustomEvent('custom', { detail: this.data }),
    };

    /*
      !Пример использования:
      -----------------------
      //* Регистрация события
      window.dispatchEvent(this.events.custom);
      -----------------------
      //* Подписка на событие
      window.addEventListener("custom", (event) => {
        console.log(event.detail);
      });
      -----------------------
    */
  }

  //* ===============================Search============================ *\\
  //* ================================================================= *\\

  // Normalize search query string
  #normalizeString = (str) => {
    return str.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').toLowerCase();
  };

  // Updates display on elements
  #updateDisplay = (visibleItems) => {
    const visibleItemsArray = Array.from(visibleItems);

    this.$items.forEach((item) => {
      item.style.display =
        visibleItemsArray.indexOf(item) !== -1 ? 'block' : 'none';
    });
  };

  // Search function
  #searchByValue = (query) => {
    if (query) {
      const normalizedQuery = this.#normalizeString(query);
      const queryRegex = new RegExp(normalizedQuery, 'i');
      const results = [];

      this.$items.forEach((item) => {
        const text = item.innerText;
        let param = this.#normalizeString(text);

        if (param.match(queryRegex)) {
          results.push(item);
        }
      });

      return results;
    }
  };

  //* ========================Keydown navigation======================= *\\
  //* ================================================================= *\\

  // Keydown navigation
  navigateResults(step) {
    this.$items = this.searchedItems;

    let items = Array.from(this.$items);
    let currentIndex = this.currentFocusedItem;

    if (currentIndex !== -1) {
      let newIndex = currentIndex;

      // Поиск следующего видимого элемента
      do {
        newIndex = (newIndex + step + items.length) % items.length;
      } while (items[newIndex].style.display === 'none');

      items[currentIndex].classList.remove(this.focus);
      items[newIndex].classList.add(this.focus);

      // Проверка видимости элемента и прокрутка, если не виден
      this.scrollItemIntoView(items[newIndex]);
    } else {
      // Если текущего элемента нет в фокусе, выберите первый видимый элемент
      const firstVisibleIndex = items.findIndex(
        (item) => item.style.display !== 'none'
      );

      if (firstVisibleIndex !== -1) {
        items[firstVisibleIndex].classList.add(this.focus);
        // Прокрутка, чтобы сделать этот элемент видимым
        this.scrollItemIntoView(items[firstVisibleIndex]);
      }
    }
  }

  // Прокрутка если выбранный элемент фокуса выходит за границу контейнера
  scrollItemIntoView(item) {
    const container = this.$dropdown.parentElement;
    const itemRect = item.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    if (itemRect.top < containerRect.top) {
      // Прокручиваем вверх, чтобы сделать верхнюю границу элемента видимой
      container.scrollTop += itemRect.top - containerRect.top;
    } else if (itemRect.bottom > containerRect.bottom) {
      // Прокручиваем вниз, чтобы сделать нижнюю границу элемента видимой
      container.scrollTop += itemRect.bottom - containerRect.bottom;
    }
  }

  //* =============================Handlers============================ *\\
  //* ================================================================= *\\

  outsideClickHandler = (e) => {
    if (!this.$el.contains(e.target)) {
      this.close();
    }
  };

  clickHandler = (e) => {
    e.preventDefault();

    const target = e.target.dataset.type ?? e.target.parentNode.dataset.type;
    this.$target = target;
    this.$targetEl = e.target;

    if (!this.enabled || (this.$input.value && this.$input.value.length === 0))
      return;

    const actions = {
      input: () => this.toggle(),
      value: () => this.open(),
      icon: () => {
        if (
          this.type === 'search' &&
          this.$icon.classList.contains(this.trigger)
        ) {
          this.clear();
        }
      },
      item: () => {
        const id = e.target.dataset.id ?? e.target.parentNode.dataset.id;
        this.select(id);

        if (this.type === 'search') this.$icon.classList.add(this.trigger);
      },
    };

    const action = actions[target];

    if (action) {
      action();
    }
  };

  inputHandler = (e) => {
    const { min, results } = this.options.search || { min: 3, results: 3 };
    const value = e.target.value.trim();

    if (e.target.value.length === 0) {
      return;
    }

    if (!this.isOpen && this.searchedItems.length > 0) {
      this.open();
    }

    if (value.length === 0 || value.length < min) {
      this.#updateDisplay(this.$items);
      return;
    }

    this.$searchResults = this.#searchByValue(value);

    if (this.$searchResults.length > 0) {
      this.#updateDisplay(this.$searchResults.slice(0, results));
    } else {
      this.#updateDisplay(this.$items);
    }
  };

  keydownHandler = (e) => {
    if (this.isOpen) {
      if (e.key === 'Escape') {
        this.close();
      }

      // Обработка нажатия стрелки вниз
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateResults(1);
      }

      // Обработка нажатия стрелки вверх
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateResults(-1);
      }

      // Enter
      if (e.key === 'Enter') {
        const currentIndex = this.currentFocusedItem;

        if (currentIndex >= 0) {
          this.select(this.$items[currentIndex].dataset.id);
          this.$currentFocusedItem = this.$items[currentIndex];
          window.dispatchEvent(this.events.enter);
        }
      }
    }
  };

  //* ==============================Getters============================ *\\
  //* ================================================================= *\\

  get isOpen() {
    return this.$el.classList.contains(this.trigger);
  }

  get isEnabled() {
    return this.behaviour.enabled;
  }

  get current() {
    return this.data.find((item) => item.id === +this.selectedId);
  }

  get currentFocusedItem() {
    const items = Array.from(this.$items);

    return items.findIndex((item) => item.classList.contains(this.focus));
  }

  get searchedItems() {
    return this.$el.querySelectorAll('[data-type="item"]');
  }

  get hasCallbacks() {
    return Object.values(this.callbacks).length;
  }

  //* ===============================Public============================ *\\
  //* ================================================================= *\\

  select(id) {
    const items = this.$el.querySelectorAll('[data-type="item"]');
    const currentItem = this.$el.querySelector(`[data-id='${id}']`);

    this.selectedId = id;

    if (this.type === 'default') {
      this.$input.firstElementChild.textContent = this.current.value;
    }

    // 1. По известному массиву данных
    // 2. По получаемому массиву данных
    // 3. По обновленным данным

    if (this.type === 'search') {
      if (this.current) {
        this.$input.value = this.current.value;
      } else {
        if (!Array.isArray(this.data)) {
          this.$selectedItem = this.data.find(
            (item) => item.getAttribute('data-id') === id
          );

          this.$input.value = this.$selectedItem
            ? this.$selectedItem.firstElementChild.innerText
            : '';
        } else {
          this.$selectedItem = Array.from(this.searchedItems).find(
            (item) => item.getAttribute('data-id') === id
          );
          this.$input.value = this.$selectedItem
            ? this.$selectedItem.firstElementChild.innerText
            : '';
        }
      }
    }

    items.forEach((item) => item.classList.remove(this.trigger));
    currentItem.classList.add(this.trigger);

    this.close();

    this.options.onSelect ? this.options.onSelect(this) : null;
    window.dispatchEvent(this.events.select);
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
    window.dispatchEvent(this.events.toggle);

    window.dropdowns.forEach((dropdown) => {
      if (dropdown.$el === this.$el) return;
      dropdown.close();
    });
  }

  open() {
    if (this.type === 'search' && this.searchedItems.length === 0) return;
    this.$el.addEventListener('keydown', this.keydownHandler);
    this.document.addEventListener('click', this.outsideClickHandler);

    this.$el.classList.add(this.trigger);
    this.$icon.classList.add(this.trigger);
    window.dispatchEvent(this.events.open);
  }

  close() {
    this.$el.removeEventListener('keydown', this.keydownHandler);
    this.document.removeEventListener('click', this.outsideClickHandler);

    this.$el.classList.remove(this.trigger);
    this.$icon.classList.remove(this.trigger);

    if (this.currentFocusedItem !== -1) {
      const currentIndex = this.currentFocusedItem;

      this.$items[currentIndex].classList.remove(this.focus);
    }

    window.dispatchEvent(this.events.close);
  }

  clear() {
    this.close();
    this.$input.value = '';
    this.#updateDisplay(this.$items);
    window.dispatchEvent(this.events.clear);
  }

  disable() {
    this.enabled = !this.enabled;
  }

  destroy() {
    this.$el.removeEventListener('click', this.clickHandler);
    this.$el.removeEventListener('input', this.inputHandler);
    this.$el.removeEventListener('keydown', this.keydownHandler);
    this.$el.innerHTML = '';
    window.dispatchEvent(this.events.destroy);
  }

  reinit(data) {
    this.data = data;

    this.destroy();
    this.#render();
    this.#setup();
  }

  init() {
    this.$el.classList.add(this.options.nodeName);
    this.$el.innerHTML = getTemplate(this.selectedTemplate, this.data) ?? '';

    this.#setup();
  }
}
