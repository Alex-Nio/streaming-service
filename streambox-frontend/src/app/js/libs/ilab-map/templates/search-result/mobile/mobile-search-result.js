import { findKey } from './../../../utils/services/find-param-key.js';

export const getSearchResultTemplate = (params) => {
  const container = document.createElement('div');
  const uniqueId = Math.floor(Math.random() * 1000000);
  const coords = findKey(params, 'coordinates');

  const defaultTemplate = `
      <span>${params.description.info} ${params.description.address}</span>
    `;

  container.innerHTML = `
      <li class="select-search-list-mobile__item" data-type="item" data-id="${uniqueId}" data-coords="${coords}">
        ${defaultTemplate}
      </li>
    `;

  return container.firstElementChild;
};
