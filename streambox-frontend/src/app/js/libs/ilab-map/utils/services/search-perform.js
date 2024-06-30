// Рекурсивная проверка на наличие модуля
const waitForSearchSetup = (condition) => {
  return new Promise((resolve) => {
    const checkCondition = () =>
      condition() ? resolve() : setTimeout(checkCondition, 100);

    checkCondition();
  });
};

// Ждём инициализации модуля поиска
export async function performMapSearch(dropdown, data, map) {
  if (dropdown.options.id === 'order-map-search-mobile-pickup') {
    await waitForSearchSetup(() => map.mapSearch);
    map.search('', dropdown, data);
  }

  if (dropdown.options.id === 'order-map-search') {
    await waitForSearchSetup(() => map.mapSearch);
    map.search('', dropdown, data);
  }
}
