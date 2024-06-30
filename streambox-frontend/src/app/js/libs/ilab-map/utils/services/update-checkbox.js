export const updatePanelItemCheckbox = (map, currentPoint) => {
  const mapId = map.mapId;
  if (!mapId) {
    console.error('Map ID is not provided.');
    return;
  }

  const pointsListId = `[data-ilabmap-points="${mapId}"]`;
  const panel = document.querySelector(pointsListId);

  if (!panel) {
    console.error(`Panel with ID ${pointsListId} not found.`);
    return;
  }

  const panelItems = panel.querySelectorAll('[data-item="pickup-item"]');

  if (!panelItems.length) {
    console.warn('No panel items found.');
    return;
  }

  const currentAddress = currentPoint?.description?.address;

  if (!currentAddress) {
    console.error('Current point address is missing.');
    return;
  }

  const matchingItem = Array.from(panelItems).find((item) => {
    const addressElement = item.querySelector(
      '.saved-addresses__location-address'
    );
    return addressElement && addressElement.innerText === currentAddress;
  });

  if (!matchingItem) {
    console.warn('No matching item found for the current address.');
    return;
  }

  const checkbox = matchingItem.querySelector('.checkbox--hidden');

  if (!checkbox) {
    console.error('Checkbox element not found in the matching item.');
    return;
  }

  checkbox.checked = true;
  matchingItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
};
