// Функция для создания объектов опций
const setDropdownOptions = (type, placeholder, icon, selectedId) => ({
  type,
  data: [],
  input: { placeholder, icon, selectedId },
});

// Создание объектов опций
const default_template = setDropdownOptions(
  'default',
  'Выбрать',
  'icon-caret24'
);

const sorting_template = setDropdownOptions(
  'default',
  'Сортировать по',
  'icon-caret24'
);

const edition_template = setDropdownOptions(
  'default',
  'Добавить редакцию',
  'icon-caret24'
);

const search_template = setDropdownOptions(
  'search',
  'Поиск по тегам',
  'icon-search24'
);

const headerSearch_template = setDropdownOptions(
  'search',
  'Найти решение..',
  'icon-search24'
);

const inn_template = setDropdownOptions('search', 'ИНН *', '');

// Экспорт шаблона
export const templates = {
  default: default_template,
  search: search_template,
  inn: inn_template,
  sorting: sorting_template,
  headerSearch: headerSearch_template,
  selectEdition: edition_template,
};
