// Получаем данные из объекта data
export const extractBalloonData = ({ address, timetable, info, status }) => ({
  address,
  timetable,
  info,
  status,
});

// Шаблонизатор для balloon
export const createBalloon = (data) => {
  const content = `
      <div class="map-point balloon">
        <div class="map-point__address">
          <span>${data.address}</span>
        </div>
        <div class="map-point__work-time">
          <span>${data.timetable}</span>
        </div>
        <div class="map-point__title">
          <span>Как добраться</span>
        </div>
        <div class="map-point__description balloon__description" data-simplebar>
          <p>${data.info}</p>
        </div>
        <button class="map-point__close icon-close-white24px"></button>
        <button class="btn btn--button btn--green">
          Выбрать
        </button>
      </div>
    `;

  return content;
};
