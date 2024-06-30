import { findPointByCoordinates } from '../services/find-point.js';
import { findTargetWithIdAttribute } from '../services/find-item-id.js';

// Search Dropdown item click handler
export const setupSearchItemClick = (dropdown, map) => {
  const dropdownClickHandler = () => {
    // Item clicked
    if (dropdown.$target === 'item') {
      const target = findTargetWithIdAttribute(dropdown.$targetEl);
      if (!target) return;

      const id = target.dataset.id;
      const [lat, lon] = target.dataset.coords.split(',').map(parseFloat);

      const { points } = map.settings;
      const currentPoint = findPointByCoordinates(points, lat, lon);

      // Если карта доставки типа курьер
      if (!currentPoint) {
        map.removeAllPlacemarks();
        map.addMarker(
          [lat, lon],
          {
            ...map.settings.icons.placemarks.controller,
            draggable: true,
          },
          {}
        );

        map.map.panTo([lat, lon], 500);
        return;
      }

      dropdown.data = map.mapSearch.$items;
      dropdown.select(id);
      // dropdown.$icon.classList.add(dropdown.options.trigger);
    }

    // Close btn clicked
    if (dropdown.$target === 'icon') {
      // Reset all placemarks to defaults
      map.placemarks.forEach((placemark) => {
        map.getPlacemarkState(placemark) !== 'active'
          ? null
          : map.togglePlacemarkState(placemark);
      });
    }
  };

  dropdown.$el.addEventListener('click', dropdownClickHandler);
};
