// Шаблонизатор панели пунктов выдачи
export const renderAddressItem = (data) => {
  const listItem = document.createElement('li');
  listItem.classList.add('pvz-item');

  listItem.innerHTML = `
    <div class="pvz-item__title">
      <span>${data.address}</span>
    </div>
    <div class="pvz-item__work-time">
      <span>${data.timetable}</span>
    </div>
  `;

  return listItem;
};
