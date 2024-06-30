// Search setup
export const setupSearch = (dropdown, map, data = null) => {
  const input = dropdown.$input;

  // on input
  const handleInput = () => {
    const mapItemsCount = map.mapSearch.$items.length;
    let value = input.value;

    if (value === '') {
      dropdown.close();
      map.search(value, dropdown, data);
    }

    if (value.length >= dropdown.options.search.min) {
      map.search(value, dropdown, data);

      let total = map.mapSearch.$items.length;

      if (mapItemsCount > 0) {
        dropdown.open();
      }

      if (total === 0) {
        dropdown.close();
        dropdown.$icon.classList.add(dropdown.options.trigger);
      }
    }
  };

  // on click
  const handleClick = () => {
    if (map.mapId !== 'courier-map') {
      map.search(input.value, dropdown, data);
    }

    if (map.mapSearch.searchResults.length === 0 || input.value.length === 0) {
      dropdown.close();
    }
  };

  input.addEventListener('input', handleInput);
  input.addEventListener('click', handleClick);
};
