import { ilabMapSearch } from './modules/search.js';
import {
  createBalloon,
  extractBalloonData,
} from './templates/balloon/balloon.js';

/*
  Lib: ilab-map
  updated: 16.12.2023
  author: Alex Nio
  GitHub: https://github.com/Alex-Nio
  Telegram: @eterfox
*/

/* eslint-disable */
export class ilabMap {
  constructor(data) {
    this.$map = document.getElementById(data.id);
    this.mapId = data.id;
    this.mapOptions = data.options || {};
    this.settings = data.settings || {};
    this.callbacks = data.callbacks || {};
    this.handlers = data.handlers || {};

    this.#render();
  }

  //* ==============================Private============================ *\\
  //* ================================================================= *\\

  async #render() {
    // Или использование условия, если есть хотя бы одно свойство
    const pointerActivity =
      Object.keys(this.settings).length > 0
        ? this.settings.behaviour.disablePoiInteractivity
        : false;

    await ymaps.ready(() => {
      this.map = new ymaps.Map(this.mapId, this.mapOptions, {
        yandexMapDisablePoiInteractivity: pointerActivity,
      });

      this.#setup();
    });
  }

  #setup() {
    this.events = this.#dispatcher();
    this.removeControls(this.settings.controls);
    this.renderPlacemarks();
    this.renderClusters();

    const behaviour = this.settings.behaviour;

    behaviour && this.isZoomEnabled ? this.disableZoom() : null;
    behaviour && this.isMapFixed ? this.disableDragging() : null;
    behaviour && this.isBalloonClickable ? this.disableBalloonClick() : null;
    behaviour && this.isMonochrome ? this.enableMonochromeBackground() : null;

    this.hasButtons > 0 ? this.#buttons() : null;
    this.hasCallbacks > 0 ? this.#callbacks() : null;
    this.hasHandlers > 0 ? this.#handlers() : null;
    this.mapSearch = new ilabMapSearch();
  }

  #buttons() {
    // Находим все элементы с атрибутом data-ilabmap равным this.mapId
    this.buttonNodes = document.querySelectorAll(
      `[data-ilabmap='${this.mapId}']`
    );

    // Объект для хранения обработчиков событий
    this.buttonClickHandlers = {};

    // Определяем действия для каждой кнопки
    const actions = {
      zoomIn: () => this.zoomHandler(1),
      zoomOut: () => this.zoomHandler(-1),
      getGeolocation: () => this.geolocationHandler(),
    };

    // Перебираем найденные элементы
    this.buttonNodes.forEach((node) => {
      const controller = {
        mapId: node.dataset.ilabmap,
        type: node.dataset.ilabmapButton,
        button: node,
      };

      // Определяем, какое действие должно выполняться при клике на кнопку
      const action = actions[controller.type];

      if (action) {
        // Создаем обработчик события click
        const clickHandler = () => action();

        // Если действие определено, назначаем обработчик события click
        controller.button.addEventListener('click', clickHandler);

        // Сохраняем обработчики событий в объекте
        this.buttonClickHandlers[controller.type] = clickHandler;
      }
    });
  }

  #callbacks() {
    this.callbacksStore = [];
    Object.values(this.callbacks).forEach((cb) => {
      cb(this);
      this.callbacksStore.push(cb);
    });
  }

  #handlers() {
    this.handlersStore = [];

    Object.values(this.handlers).forEach((handler) => {
      handler(this);
      this.handlersStore.push(handler);
    });
  }

  //* =============================Dispatcher========================== *\\
  //* ================================================================= *\\

  // Returns custom events obj
  #dispatcher() {
    return {
      placemark: {
        toggle: new Event('placemark-toggle'),
      },
    };
  }

  //* ============================Functions============================ *\\
  //* ================================================================= *\\

  //* Убираем стандартные кнопки на карте
  removeControls = (controls) => {
    if (controls && controls.length > 0) {
      controls.forEach((control) => {
        this.map.controls.remove(control);
      });
    }
  };

  //* Убираем кастомные обработчики кнопок на карте
  destroyButtons = () => {
    this.buttonNodes.forEach((node) => {
      const controller = {
        type: node.dataset.ilabmapButton,
        button: node,
      };

      const clickHandler = this.buttonClickHandlers[controller.type];

      if (clickHandler) {
        controller.button.removeEventListener('click', clickHandler);
      }
    });
  };

  //* Callbacks store clear
  destroyCallbacks = () => {
    this.callbacksStore = [];
  };

  //* Handlers store clear
  destroyHandlers = () => {
    this.handlersStore = [];
  };

  //* ==============================Getters============================ *\\
  //* ================================================================= *\\

  // //* Предотвращаем изменение zoom через колесо мыши
  get isZoomEnabled() {
    return !this.settings.behaviour.zoomEnabled || null;
  }

  get isMapFixed() {
    return this.settings.behaviour.fixed || null;
  }

  get isBalloonClickable() {
    return !this.settings.behaviour.balloonClickable || null;
  }

  get isMonochrome() {
    return this.settings.behaviour.monochrome || null;
  }

  get isGeolocationMarkerExists() {
    return !this.userCoords ? false : true;
  }

  get mapCenter() {
    return this.map.getCenter();
  }

  get currentZoom() {
    return this.map.getZoom();
  }

  get hasCallbacks() {
    if (this.callbacks) {
      return Object.values(this.callbacks).length;
    }
  }

  get hasHandlers() {
    if (this.handlers) {
      return Object.values(this.handlers).length;
    }
  }

  get hasButtons() {
    if (this.settings.buttons) {
      return Object.values(this.settings.buttons).length;
    }
  }

  get mapNode() {
    return this.$map;
  }

  //* =============================Handlers============================ *\\
  //* ================================================================= *\\

  geolocationHandler() {
    let needGeolocation = true;

    this.map.geoObjects.each((geoObject) => {
      if (
        geoObject instanceof ymaps.Placemark &&
        geoObject.options.get('isGeolocation')
      ) {
        needGeolocation = false;
      }
    });

    if (needGeolocation) {
      this.getUserGeolocation();
    }
  }

  //* Zoom + или -
  zoomHandler(zoomChange) {
    // Проверяем, выполняется ли уже анимация увеличения масштаба
    if (this.zoomInProcess) {
      return;
    }

    const { zoom, animations } = this.settings; // Извлекаем настройки масштабирования и анимаций
    const currentZoom = this.map.getZoom(); // Получаем текущее значение масштаба карты
    const newZoom = Math.max(currentZoom + zoomChange, zoom.min); // Рассчитываем новое значение масштаба
    const maxZoomValue = zoom.max; // Определяем максимальное значение масштаба

    // Проверяем, находится ли новое значение масштаба в пределах допустимых значений
    if (newZoom > maxZoomValue || newZoom < zoom.min) {
      return;
    }

    // Устанавливаем флаг анимации масштабирования
    this.zoomInProcess = true;

    // Опции анимации
    const zoomOptions = {
      duration: animations.zoomDuration,
      timingFunction: 'ease-in-out',
    };

    // Изменяем масштаб карты с заданными опциями
    this.map.setZoom(newZoom, zoomOptions);

    // После завершения анимации снимаем флаг анимации
    setTimeout(() => {
      this.zoomInProcess = false;
    }, animations.zoomDuration);
  }

  //* ===============================Search============================ *\\
  //* ================================================================= *\\

  search(request, dropdownNode, data) {
    this.mapSearch.search(request, dropdownNode, data);
  }

  //* ===============================Custom============================ *\\
  //* ================================================================= *\\

  //* Создаем метку на карте по заданным координатам
  addMarker = (coords = this.options.center, options, data = {}) => {
    this.currentMarker = new ymaps.Placemark(
      coords,
      {
        balloonContent: Object.keys(data).length > 0 ? createBalloon(data) : '',
      },
      {
        ...options,
      }
    );

    this.updateZoomLevel(); // Проверяем текущий зум и сбрасываем в дефолт
    this.scrollTo(coords, this.settings.animations.scrollDuration);
    this.map.geoObjects.add(this.currentMarker); // Добавляем точку в коллекцию точек
  };

  //* Меняем стиль placemark при клике
  togglePlacemarkState(placemark) {
    const {
      active,
      default: defaultIcon,
      disabled,
    } = this.settings.icons.placemarks;
    const currentIcon = placemark.options.get('iconImageHref');

    if (placemark.options.get('isGeolocation')) return;

    const newIcon =
      currentIcon === active.iconImageHref ? defaultIcon : disabled;

    this.placemarks.forEach((item) =>
      item.options.set('iconImageHref', newIcon.iconImageHref)
    );

    if (currentIcon !== active.iconImageHref)
      placemark.options.set('iconImageHref', active.iconImageHref);

    window.dispatchEvent(this.events.placemark.toggle);
  }

  //* Получаем текущий статус иконки
  getPlacemarkState(placemark) {
    const {
      active,
      default: defaultIcon,
      disabled,
    } = this.settings.icons.placemarks;

    const currentIcon = placemark.options.get('iconImageHref');

    if (currentIcon === active.iconImageHref) {
      return 'active';
    } else if (currentIcon === defaultIcon.iconImageHref) {
      return 'default';
    } else if (currentIcon === disabled.iconImageHref) {
      return 'disabled';
    } else {
      return 'unknown'; // Если иконка не соответствует ни одному из известных состояний.
    }
  }

  //* Zoom disable
  disableZoom() {
    this.map.events.add(
      'wheel',
      (e) => {
        e.preventDefault();
      },
      { passive: false }
    );
  }

  //* Disable balloon click
  disableBalloonClick() {
    this.placemarks.forEach((placemark) => {
      placemark.events.add('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    this.$map.addEventListener('click', () => {
      if (this.map.balloon) {
        this.map.balloon.close();
      }
    });
  }

  //* Disable map dragging
  disableDragging() {
    this.map.behaviors.disable('drag');
  }

  //* Если зум больше дефолтного ставим дефолтный
  updateZoomLevel() {
    if (this.currentZoom < this.mapOptions.zoom) {
      this.map.setZoom(this.mapOptions.zoom);
    }
  }

  //* Enable monochrome background
  enableMonochromeBackground() {
    this.$map.classList.add('monochrome');
  }

  //* Находим точку по координатам
  getPlacemarkByCoordinates(coordinates) {
    const geoObjects = this.map.geoObjects;

    for (let i = 0; i < geoObjects.getLength(); i++) {
      const geoObject = geoObjects.get(i);

      if (geoObject.geometry) {
        const objectCoordinates = geoObject.geometry.getCoordinates();

        if (
          objectCoordinates[0] === coordinates[0] &&
          objectCoordinates[1] === coordinates[1]
        ) {
          return geoObject;
        }
      }
    }

    return null;
  }

  //* Возвращает координаты геолокации пользователя
  getUserGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!this.isGeolocationMarkerExists) {
            this.userCoords = [
              position.coords.latitude,
              position.coords.longitude,
            ];
            this.addMarker(this.userCoords, {
              ...this.settings.icons.placemarks.geolocation,
            });
            this.scrollTo(
              this.userCoords,
              this.settings.animations.scrollDuration
            );
          }
        },
        (error) => {
          console.error('Ошибка получения геолокации:', error);
        }
      );
    } else {
      console.error('Геолокация не поддерживается вашим браузером');
    }
  }

  //* Получение адреса по координатам (Геокодирование)
  getCoordsData(coords, callback) {
    ymaps
      .geocode(coords)
      .then((res) => {
        const firstGeoObject = res.geoObjects.get(0);

        if (firstGeoObject) {
          const address = firstGeoObject.getAddressLine();

          if (callback) {
            callback(address);
          }
        }
      })
      .catch((error) => {
        console.error('Ошибка геокодирования:', error);
      });
  }

  //* Получение центра нужной точки
  getPlacemarkCoords(placemark) {
    return placemark.geometry.getCoordinates();
  }

  //* Получение данных точки
  getPlacemarkData(placemark) {
    return this.settings.points.filter(
      (point) => point.coordinates === placemark.geometry.getCoordinates()
    );
  }

  //* ===============================Public============================ *\\
  //* ================================================================= *\\

  //* Create Clusterer
  createClusterer = () => {
    if (this.settings.icons) {
      const { default: clusterIcon } = this.settings.icons.clusters;

      return new ymaps.Clusterer({
        clusterIcons: [clusterIcon],
        clusterIconContentLayout: ymaps.templateLayoutFactory.createClass(
          '<div class="cluster-icon__content">{{ properties.geoObjects.length }}</div>'
        ),
      });
    }
  };

  //* Placemarks rendering
  renderPlacemarks() {
    if (this.settings.points) {
      const placemarks = this.settings.points.map(
        ({ coordinates, description }) => {
          const { default: placemarkIcon } = this.settings.icons.placemarks;
          const data = extractBalloonData(description);

          return new ymaps.Placemark(
            coordinates,
            {
              balloonContent: createBalloon(data),
            },
            {
              ...placemarkIcon,
              zIndex: 1000,
            }
          );
        }
      );

      this.placemarks = placemarks;
    } else {
      console.error('Нет данных по точкам. Назначьте this.settings.points');
    }
  }

  //* Clusters rendering
  renderClusters() {
    const clusterer = this.createClusterer();
    if (!clusterer) return;

    clusterer.add(this.placemarks);
    this.map.geoObjects.add(clusterer);
  }

  //* Удаление всех геообъектов с карты
  removeAllPlacemarks() {
    this.map.geoObjects.removeAll();
  }

  //* Удаление конкретного объекта
  removePlacemarkByCoordinates(coordinates) {
    for (let i = 0; i < this.placemarks.length; i++) {
      const placemark = this.placemarks[i];

      if (
        placemark.geometry.getCoordinates().toString() ===
        coordinates.toString()
      ) {
        // Нашли точку по координатам, удаляем её
        this.map.geoObjects.remove(placemark);
        this.placemarks.splice(i, 1); // Удаляем из массива
        break;
      }
    }
  }

  //* Двигаем карту в указанную координату
  scrollTo(coordinates, scrollDuration) {
    this.map.panTo(coordinates, scrollDuration);
  }

  destroy() {
    this.hasButtons > 0 ? this.destroyButtons() : null;
    this.hasCallbacks > 0 ? this.destroyCallbacks() : null;
    this.hasHandlers > 0 ? this.destroyHandlers() : null;
    this.map.destroy();
  }

  setNewData(data = {}) {
    this.destroy();
    this.mapId = data.id;
    this.options = data.options;
    this.settings = data.settings;
    this.callbacks = data.callbacks;
    this.reinit();
  }

  reinit() {
    this.#render();
  }
}
