import { points } from './../data/points.js';

// order.html
const courierMapOptionsDesktop = {
  points: points.orderCourierMap,
  controls: [
    'zoomControl',
    'geolocationControl',
    'searchControl',
    'trafficControl',
    'typeSelector',
    'fullscreenControl',
    'rulerControl',
  ],
  icons: {
    placemarks: {
      default: {
        iconLayout: 'default#image',
        iconImageHref: './images/reused/map//placemark-default.svg',
        iconImageSize: [40, 40],
        iconImageOffset: [-16, -39],
      },
      active: {
        iconLayout: 'default#image',
        iconImageHref: './images/reused/map//placemark-active.svg',
        iconImageSize: [40, 40],
        iconImageOffset: [-16, -39],
      },
      disabled: {
        iconLayout: 'default#image',
        iconImageHref: './images/reused/map//placemark-disabled.svg',
        iconImageSize: [40, 40],
        iconImageOffset: [-16, -39],
      },
      controller: {
        iconLayout: 'default#image',
        iconImageHref: './images/reused/map//placemark-controller.svg',
        iconImageSize: [40, 40],
        iconImageOffset: [-16, -39],
      },
      geolocation: {
        iconLayout: 'default#image',
        iconImageHref: './images/reused/map//placemark-geolocation.svg',
        iconImageSize: [40, 40],
        iconImageOffset: [-16, -39],
      },
    },
    clusters: {
      default: {
        href: './images/reused/map//cluster-default.svg',
        size: [40, 40],
        offset: [-20, -20],
      },
    },
  },
  behaviour: {
    fixed: false,
    monochrome: true,
    balloonClickable: false,
    zoomEnabled: false,
    disablePoiInteractivity: true,
    hasSearch: true,
  },
  buttons: {
    zoomIn: 'zoomIn',
    zoomOut: 'zoomOut',
  },
  zoom: {
    max: 21,
    min: 3,
  },
  animations: {
    scrollDuration: 500,
    zoomDuration: 500,
  },
};

//? Пример кастомных настроек для ilab Map
export const settings = {
  courier: {
    desktop: courierMapOptionsDesktop,
    // mobile: courierMapOptionsMobile,
  },
};
