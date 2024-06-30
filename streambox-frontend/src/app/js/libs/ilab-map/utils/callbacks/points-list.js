// Setups points list panel
export const setupPointsList = async (
  context,
  map,
  popup,
  settings,
  renderItemFunc,
  renderOutputInformation
) => {
  const pointsListId = `[data-ilabmap-points="${context.mapId}"]`;
  const destination = document.querySelector(pointsListId);

  if (destination && settings.points.length > 0) {
    settings.points.forEach(({ coordinates, description }) => {
      const item = renderItemFunc(description);
      destination.append(item);

      item.addEventListener('click', (e) => {
        e.preventDefault();

        const outputAttribute = `[data-ilabmap-point-description='${context.mapId}']`;
        const descriptionOutput = document.querySelector(outputAttribute);

        descriptionOutput.innerHTML = renderOutputInformation(description);

        const isItem =
          e.target.classList.contains('pvz-item') ||
          e.target.closest('.pvz-item');

        if (isItem) {
          map.scrollTo(coordinates, 500);
        }
      });

      // Клик по элементам пунктов выдачи сгенерированных функцией выше
      const pointItems = popup.$popup.querySelectorAll('.pvz-item');

      if (pointItems.length > 0) {
        pointItems.forEach((item) => {
          item.addEventListener('click', () => {
            popup.changeState(1);
          });
        });
      }
    });
  }
};
