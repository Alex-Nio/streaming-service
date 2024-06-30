// Находим данные геометки по координатам
export const findPointByCoordinates = (points, lat, lon) => {
  return points.find(
    (point) => point.coordinates[0] === lat && point.coordinates[1] === lon
  );
};
