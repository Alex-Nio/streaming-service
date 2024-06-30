// Setup courier map
export const setupCourierMap = (context, map, options, settings, dropdown) => {
  // Привязываем обработчик "dragend"
  const addDragendHandler = (placemark) => {
    placemark.events.add('dragend', (e) => {
      const coords = e.get('target').geometry.getCoordinates();

      //* Получаем координаты когда точка была инициализирована
      map.getCoordsData(coords, (address) => {
        dropdown.$input.value = address;
        dropdown.$icon.classList.add(dropdown.options.trigger);
      });

      // Плавный скролл до выставленной координаты
      map.scrollTo(coords, 500);
    });
  };

  map.removeAllPlacemarks();

  map.addMarker(
    options.center,
    {
      ...settings.icons.placemarks.controller,
      draggable: true,
    },
    {}
  );

  //* Получаем координаты когда точка была инициализирована
  // map.getCoordsData(options.center, (address) => {
  //   if (window.innerWidth <= 767) {
  //     const placemarkInfoArea = document.querySelector(
  //       '[data-info="placemark-info"'
  //     );

  //     placemarkInfoArea.value = address;
  //   }
  // });

  //* Получаем точку по координатам
  const placemark = map.getPlacemarkByCoordinates(options.center);

  // Добавляем обработчик "dragend" к первоначальной точке
  addDragendHandler(placemark);

  // Событие клика по карте
  context.map.events.add('click', (e) => {
    const coords = e.get('coords');

    map.removeAllPlacemarks();

    //* Устанавливаем новую точку при клике на карту
    map.addMarker(coords, {
      ...settings.icons.placemarks.controller,
      draggable: true,
    });

    // Получаем новую точку по координатам
    const newPlacemark = map.getPlacemarkByCoordinates(coords);

    // Добавляем обработчик "dragend" к новой точке
    addDragendHandler(newPlacemark);

    //* Записываем данные адреса в глобальную переменную
    map.getCoordsData(coords, (address) => {
      dropdown.$input.value = address;
      dropdown.$icon.classList.add(dropdown.options.trigger);

      if (window.innerWidth <= 767) {
        const placemarkInfoArea = document.querySelector(
          '[data-info="placemark-info"'
        );

        placemarkInfoArea.value = address;
      }
    });
  });

  // Событие перетаскивания точки
  placemark.events.add('dragend', (e) => {
    const coords = e.get('target').geometry.getCoordinates();

    //* Получаем координаты когда точка была инициализирована
    map.getCoordsData(coords, (address) => {
      dropdown.$input.value = address;
      dropdown.$icon.classList.add(dropdown.options.trigger);
    });

    // Плавный скролл до выставленной координаты
    map.scrollTo(coords, 500);
  });
};
