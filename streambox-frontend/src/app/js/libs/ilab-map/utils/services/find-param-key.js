export const findKey = (obj, targetKey) => {
  // Проверяем, есть ли ключ в текущем объекте
  if (targetKey in obj) {
    return obj[targetKey];
  }

  // Проходим по всем ключам объекта
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      // Если значение является объектом, вызываем функцию рекурсивно
      const result = findKey(obj[key], targetKey);

      if (result !== undefined) {
        return result;
      }
    }
  }

  // Если ключ не найден, возвращаем null
  return null;
};
