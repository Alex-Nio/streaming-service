import { getSearchResultTemplate as desktopSearchResult } from './../templates/search-result/desktop/desktop-search-result.js';
import { getSearchResultTemplate as mobileSearchResult } from './../templates/search-result/mobile/mobile-search-result.js';

/*eslint-disable*/
export class ilabMapSearch {
  constructor() {
    this.$items = [];
    this.searchResults = [];
  }

  getItemTemplate(params, mapId) {
    let ww = window.innerWidth;

    const template =
      ww <= 767
        ? mobileSearchResult(params, mapId)
        : desktopSearchResult(params);

    window.addEventListener('resize', () => {
      ww = window.innerWidth;
    });

    return template;
  }

  #updateDropdown(dropdownNode, results) {
    dropdownNode.innerHTML = '';

    this.$items = results.map((result) => {
      const item = this.getItemTemplate(result, this.id);
      dropdownNode.appendChild(item);
      return item;
    });
  }

  #filterResults(request, data, key) {
    const requestParts = request.split(/\s+/).filter(Boolean);
    const regexParts = requestParts.map((part) => new RegExp(part, 'i'));

    this.searchResults = data.filter((item) => {
      const keyParts = key.split('.');
      let formattedValue = item;

      for (const part of keyParts) {
        formattedValue = formattedValue[part];

        if (!formattedValue) {
          return false;
        }
      }

      if (Array.isArray(formattedValue)) {
        formattedValue = formattedValue.join(', ');
      }

      formattedValue = formattedValue.toLowerCase();

      return regexParts.every((regex) => regex.test(formattedValue));
    });
  }

  async search(request, dropdown, data) {
    this.id = dropdown.options.id;
    this.itemClassName = dropdown.$dropdown.classList[1];

    if (data) {
      this.#updateDropdown(dropdown.$dropdown, data);

      if (request.trim() !== '') {
        this.#filterResults(request, data, 'description.address');
        this.#updateDropdown(dropdown.$dropdown, this.searchResults);
      }
    } else {
      if (request.trim() !== '') {
        const res = await ymaps.geocode(request, {
          results: dropdown.options.search.results ?? 5,
        });

        this.searchResults = [];

        res.geoObjects.each((geoObject) => {
          const name = geoObject.properties.get('name');
          const descr = geoObject.properties.get('description');
          const coords = geoObject.geometry.getCoordinates();

          this.searchResults.push({
            description: {
              address: name,
              info: descr,
              coordinates: coords,
            },
          });
        });

        this.#filterResults(request, this.searchResults, 'description.address');
        this.#updateDropdown(dropdown.$dropdown, this.searchResults);
      }
    }
  }
}
