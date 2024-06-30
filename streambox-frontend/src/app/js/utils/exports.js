// Экспортируемые функции
export const fn = {
  toggle(element, selector) {
    element.classList.toggle(selector);
  },
  addActiveSelector(element, selector) {
    element.classList.add(selector);
  },
  removeActiveSelector(element, selector) {
    element.classList.remove(selector);
  },
  setValue(placeholder, newValue) {
    placeholder.value = newValue;
  },
  getElementHeight(element) {
    return element.offsetHeight;
  },

  // функции скрывания и появления элементов
  unfadeEffect(el, timeout, display) {
    el.style.opacity = 0;
    el.style.display = display || 'block';
    el.style.transition = `opacity ${timeout}ms`;

    setTimeout(() => {
      el.style.opacity = 1;
    }, 10);
  },

  fadeEffect(el, timeout) {
    el.style.opacity = 1;
    el.style.transition = `opacity ${timeout}ms`;
    el.style.opacity = 0;

    setTimeout(() => {
      el.style.display = 'none';
    }, timeout);
  },

  resetBodyOffset() {
    const body = document.body;
    const fixedElements = document.querySelectorAll('.fixed');

    body.style.paddingRight = '';
    fixedElements.forEach((el) => (el.style.paddingRight = ''));
    body.style.overflow = 'auto';
  },

  toggleBodyOffset() {
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
  },
};
