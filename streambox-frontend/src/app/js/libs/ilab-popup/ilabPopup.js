/* eslint-disable */

/*
  Lib: ilab-popup
  updated: 24.12.2023
  author: Alex Nio
  GitHub: https://github.com/Alex-Nio
  Telegram: @eterfox
*/

export class ilabPopup {
  constructor(element, options) {
    this.$popup = document.querySelector(`[data-popup="${element}"]`) || null;
    this.popupSelector = element;
    this.options = options;
    this.enabled = true;

    this.init();
  }

  //* ==============================Private============================ *\\
  //* ================================================================= *\\

  #checkViewport(ww) {
    const arr = Object.entries(this.options.breakpoints);

    for (let i = 0; i < arr.length; i++) {
      let breakpoint = +arr[i][0];
      let options = arr[i][1];

      const condition =
        !isNaN(breakpoint) &&
        breakpoint !== null &&
        typeof breakpoint === 'number' &&
        Object.keys(options).length > 0;

      if (condition) {
        this.checkBreakpoint(breakpoint, ww, options.enabled);
      } else {
        console.error(
          !Object.keys(options).length
            ? 'Invalid breakpoint options'
            : 'Invalid breakpoint'
        );
      }
    }
  }

  #render() {
    const { trigger } = this.options;

    this.trigger = trigger;
    this.$openButtons = document.querySelectorAll(
      `[data-popup-open="${this.popupSelector}"]`
    );
    this.$closeButtons = document.querySelectorAll(
      `[data-popup-close="${this.popupSelector}"]`
    );
    this.$popup.classList.add('fixed');
  }

  #setup() {
    this.events = this.dispatcher();
    this.states = this.$popup.querySelectorAll('[data-popup-state]');
    this.currentState = 0;

    // Global obj init
    window.popups ? null : (window.popups = []);
    window.popups.push(this);

    this.$openButtons.forEach((button) => {
      button.addEventListener('click', this.handleOpen);
    });

    this.$closeButtons.forEach((button) => {
      button.addEventListener('click', this.handleClose);
    });

    document.addEventListener('mousedown', this.handleOutsideClick);
  }

  //* =======================Mobile queries============================ *\\
  //* ================================================================= *\\

  // Временное
  isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
      return (
        navigator.userAgent.match(/IEMobile/i) ||
        navigator.userAgent.match(/WPDesktop/i)
      );
    },
    any: function () {
      return (
        this.Android() ||
        this.BlackBerry() ||
        this.iOS() ||
        this.Opera() ||
        this.Windows()
      );
    },
  };

  //* ============================Functions============================ *\\
  //* ================================================================= *\\

  checkBreakpoint = (breakpoint, ww, enabled) => {
    if (breakpoint <= ww && enabled) {
      this.enabled = true;
    }

    if (breakpoint <= ww && !enabled) {
      this.enabled = false;
    }
  };

  removeListeners = (elements, handler) => {
    if (elements && elements.length > 0) {
      elements.forEach((el) => {
        el.removeEventListener('click', handler);
      });
    }
  };

  resetBodyOffset = () => {
    const body = document.body;
    const fixedElements = document.querySelectorAll('.fixed');

    body.style.paddingRight = '';
    fixedElements.forEach((el) => (el.style.paddingRight = ''));
    body.style.overflow = 'auto';
  };

  toggleBodyOffset = () => {
    const body = document.body;
    const fixedElements = document.querySelectorAll('.fixed');
    const scrollWidth = window.innerWidth - body.offsetWidth;

    if (body.style.paddingRight) {
      body.style.paddingRight = '';
      fixedElements.forEach((el) => (el.style.paddingRight = ''));
      body.style.overflow = 'auto';
    } else {
      body.style.paddingRight = `${scrollWidth}px`;
      fixedElements.forEach(
        (el) => (el.style.paddingRight = `${scrollWidth}px`)
      );
      body.style.overflow = 'hidden';
    }
  };

  //* =============================Setters============================ *\\
  //* ================================================================= *\\

  set setCurrentState(stateNum) {
    this.currentState = stateNum;
  }

  //* =============================Getters============================ *\\
  //* ================================================================= *\\

  get windowWidth() {
    return window.innerWidth;
  }

  //* =============================Handlers============================ *\\
  //* ================================================================= *\\

  handleOpen = (e) => {
    e.preventDefault();

    // Установка класса 'active' для кнопки с атрибутом data-popup-open
    this.$openButtons.forEach((btn) => {
      btn.classList.remove('active');
    });
    const currentBtn = e.currentTarget;
    currentBtn.classList.add('active');

    this.options.onPopupOpen
      ? this.options.onPopupOpen(this.events.open)
      : null;
    this.open();
  };

  handleClose = (e) => {
    e.preventDefault();

    // Удаление класса 'active' при закрытии попапа
    this.$openButtons.forEach((btn) => {
      btn.classList.remove('active');
    });

    this.options.onPopupClose
      ? this.options.onPopupOpen(this.events.close)
      : null;
    this.close();
  };

  handleOutsideClick = (e) => {
    const isOutsidePopupContent = !e.target.closest('[data-popup-content]');

    if (isOutsidePopupContent && this.$popup.classList.contains(this.trigger)) {
      // Удаление класса 'active' при клике вне попапа
      this.$openButtons.forEach((btn) => {
        btn.classList.remove('active');
      });
      this.close();
    }
  };

  handleResize = () => {
    this.update();
  };

  //* =============================Dispatcher========================== *\\
  //* ================================================================= *\\

  // Returns custom events obj
  dispatcher() {
    return {
      open: new Event('popup-opened'),
      close: new Event('popup-closed'),
      stateChanged: new Event('popup-state-changed'),
      custom: new CustomEvent('custom', { detail: this.$popup }),
    };
  }

  //* ==============================Methods============================ *\\
  //* ================================================================= *\\

  update() {
    if (this.options.breakpoints) {
      this.#checkViewport(this.windowWidth);

      if (!this.enabled) {
        this.$popup.classList.remove(this.trigger);
        this.resetBodyOffset();
      }
    }
  }

  open() {
    if (!this.enabled) {
      return;
    }

    this.$popup.classList.add(this.trigger);

    if (this.events) {
      window.dispatchEvent(this.events.open, this.$popup);
      window.dispatchEvent(this.events.custom, this.$popup);
    }

    this.toggleBodyOffset();
  }

  close() {
    this.$popup.classList.remove(this.trigger);

    if (this.events) {
      window.dispatchEvent(this.events.close, this.$popup);
    }

    this.resetBodyOffset();
  }

  changeState(stateNum) {
    this.currentState = stateNum;

    if (stateNum >= 0 && stateNum < this.states.length) {
      window.dispatchEvent(this.events.stateChanged, this.states, this.$popup);

      // Скрыть все элементы
      this.states.forEach((state) => {
        state.style.display = 'none';
      });

      // Найти и отобразить только нужные элементы
      const sorted = Array.from(this.states).filter(
        (state) => +state.getAttribute('data-popup-state') === stateNum
      );

      sorted.forEach((state) => {
        state.style.display = 'flex';
      });
    }
  }

  destroy() {
    this.removeListeners(this.$openButtons, this.openButtonHandler);
    this.removeListeners(this.$closeButtons, this.closeButtonHandler);
    document.removeEventListener('mousedown', this.handleOutsideClick);

    if (this.options.breakpoints) {
      window.removeEventListener('resize', this.handleResize);
    }
  }

  init() {
    if (this.options.breakpoints) {
      window.addEventListener('resize', this.handleResize);
    }

    if (this.enabled) {
      this.update();
      this.#render();
      this.#setup();
    }
  }
}
