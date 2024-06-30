const removeClassFromElements = (elements, className) => {
  elements.forEach((el) => {
    el.classList.remove(className);
  });
};

const addClassToElements = (elements, className) => {
  elements.forEach((el) => {
    el.classList.add(className);
  });
};

const addClassToBody = (className) => {
  const body = document.querySelector('body');
  body.classList.add(className);
};

const removeClassFromBody = (className) => {
  const body = document.querySelector('body');
  body.classList.remove(className);
};

// Export preloader function
export const preloader = (selector, timeout, withLock) => {
  return new Promise((resolve) => {
    const elements = document.querySelectorAll(selector);

    if (elements.length > 0) {
      if (withLock) {
        addClassToBody('lock');

        setTimeout(() => {
          addClassToElements(elements, 'no-display');
          removeClassFromBody('lock');
          resolve();
        }, timeout);
      } else {
        setTimeout(() => {
          removeClassFromElements(elements, selector.replace('.', ''));
          resolve();
        }, timeout);
      }
    } else {
      resolve();
    }
  });
};
