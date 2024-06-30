// Placemark handler
export const setupPlacemarks = (context, renderFunc) => {
  // Container const
  const mapContainer = document.getElementById('dpd-map-desktop');
  const mapContainerInner = mapContainer.closest('.order-map__inner');

  // Output const
  const outputAttribute = `[data-ilabmap-point-description='${context.mapId}']`;
  const descriptionOutput = document.querySelector(outputAttribute);

  //* Functions:
  // Placemark description update
  const updateDescriptionOutput = () => {
    descriptionOutput.innerHTML = renderFunc(
      context.settings.points[0].description
    );
  };

  // Placemark click handler
  const handlePlacemarkClick = (placemark) => {
    descriptionOutput.innerHTML = renderFunc(
      context.getPlacemarkData(placemark)[0].description
    );

    changePointBtn?.addEventListener('click', toggleContainer);
  };

  // Container toggle
  const toggleContainer = () => {
    let containerState = mapContainerInner.dataset.infoExist;

    containerState = containerState === 'true' ? 'false' : 'true';
    mapContainerInner.dataset.infoExist = containerState;

    context.placemarks.forEach((placemark) => {
      placemark.events.remove('click', () => handlePlacemarkClick(placemark));
    });

    context.destroy();
    context.reinit();

    context.mapNode.removeEventListener('click', mapClickListener);
    changePointBtn.removeEventListener('click', toggleContainer);
  };

  // Handling click on the button in the balloon
  const mapClickListener = (e) => {
    const isBalloonOpenBtn = e.target.classList.contains('btn');
    const isBalloonCloseBtn = e.target.classList.contains('map-point__close');

    if (isBalloonOpenBtn) {
      context.map.balloon.close();
      toggleContainer();
    }

    if (isBalloonCloseBtn) {
      context.map.balloon.close();
    }
  };

  updateDescriptionOutput();

  const changePointBtn = document.getElementById('change-point-btn');

  context.placemarks.forEach((placemark) => {
    placemark.events.add('click', () => handlePlacemarkClick(placemark));
  });

  context.mapNode.addEventListener('click', mapClickListener);
  changePointBtn?.addEventListener('click', toggleContainer);

  return () => {
    context.mapNode.removeEventListener('click', mapClickListener);
    changePointBtn?.removeEventListener('click', toggleContainer);
  };
};
