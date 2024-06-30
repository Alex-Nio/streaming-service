// Определение выбранного элемента выпадающего списка
export const getSelectedItem = (data, selectedId) => {
  return data.find((item) => item.id === +selectedId);
};
