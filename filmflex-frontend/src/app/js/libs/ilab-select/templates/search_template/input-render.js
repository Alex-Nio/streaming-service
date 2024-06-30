import { getSelectedItem } from './../utils/getSelectedItem.js';

//? Шаблонизатор для input items
export const setItemTemplate = (data, selectedId) => {
  const items = data.map((item) => {
    let trigger = '';

    if (item.id === selectedId) {
      trigger = 'active';
    }

    if (item.type === 'text') {
      return `
        <li class="search-list__item ${trigger}" data-type="item" data-id="${item.id}">
          <span>${item.value}</span>
        </li>
      `;
    }

    if (item.type === 'link') {
      return `
        <a
          class="search-list__item ${trigger}"
          data-id="${item.id}"
          data-type="item"
          href="${item.href}">
            ${item.value}
        </a>
      `;
    }

    return '';
  });

  return items.join('');
};

//? Шаблонизатор для input
export const setInputTemplate = (options, nodeName, data) => {
  if (data) {
    const parentSelector = nodeName || '';
    const placeholder = options.input.placeholder || 'Default placeholder';
    const selectedId = options.input.selectedId ?? null;
    const icon = options.input.icon || null;
    const items = setItemTemplate(data, selectedId);

    let value = getSelectedItem(data, selectedId)?.value ?? placeholder ?? '';

    return `
    <label class="${parentSelector}__label" data-type="label">
      <i class="icon-search" aria-hidden="true"></i>
      <input class="${parentSelector}__input" type="search" data-type="input" placeholder="${value}" autocomplete="off"/>
      <i class="${icon}" aria-hidden="true" data-type="icon"></i>
    </label>
    <div class="${parentSelector}__dropdown">
      <ul class="${parentSelector}__list ${parentSelector}-list" data-type="dropdown">
        ${items}
      </ul>
    </div>
  `;
  }
};
