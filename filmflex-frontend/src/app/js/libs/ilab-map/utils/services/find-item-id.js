// Вспомогательная функция для поиска элемента в выпадающем списке
export const findTargetWithIdAttribute = (element) => {
  const hasId = element.hasAttribute('data-id');

  if (hasId) return element;
  if (!hasId && element.parentNode.hasAttribute('data-id'))
    return element.parentNode;
  return null;
};
