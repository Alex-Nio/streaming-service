import { getSelectedItem } from './../utils/getSelectedItem.js';

//? Шаблонизатор для input items
const setItemTemplate = (data, selectedId) => {
  const items = data.map((item) => {
    let trigger = '';

    if (item.id === selectedId) {
      trigger = 'active';
    }

    if (item.type === 'text') {
      return `
        <li class="select-dropdown-list__item icon-check24 ${trigger}" data-type="item" data-id="${item.id}">
          <span>${item.value}</span>
        </li>
      `;
    }

    if (item.type === 'link') {
      return `
        <a
          class="select-dropdown-list__item ${trigger}"
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
    const hasParams = options !== '';
    const input = options.input || {};

    const parentSelector = nodeName || '';
    const placeholder = hasParams ? input.placeholder : 'Default placeholder';
    const icon = hasParams ? input.icon : null;
    const selectedId = hasParams ? input.selectedId : null;
    const items = setItemTemplate(data, selectedId);

    let text = getSelectedItem(data, selectedId)?.value ?? placeholder ?? '';

    return `
      <div class="${parentSelector}__input" data-type="input">
        <span data-type="value">${text}</span>
        <i class="${icon}" aria-hidden="true" data-type="icon"></i>
      </div>
      <div class="${parentSelector}__backdrop">
      </div>
      <div class="${parentSelector}__dropdown">
        <div class="${parentSelector}__header">
          <span>Сортировать по</span>
          <a href="#" class="icon-close24 select-close"></a>
        </div>
        <ul class="${parentSelector}__list ${parentSelector}-list" data-type="dropdown">
          ${items}
        </ul>
      </div>
    `;
  }
};
