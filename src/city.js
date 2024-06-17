export function createCity(size) {
  const data = [];

  initialize();

  function initialize() {
    for (let x = 0; x < size; x += 1) {
      const column = [];
      for (let y = 0; y < size; y += 1) {
        const tile = createTile(x, y);
        column.push(tile);
      }
      data.push(column);
    }
  }

  function createTile(x, y) {
    return {
      x,
      y,
      terrainId: "grass",
      building: undefined,
      update() {
      },
    };
  }

  function update() {
    for (let x = 0; x < size; x += 1) {
      for (let y = 0; y < size; y += 1) {
        data[x][y].building?.update();
      }
    }
  }

  return {
    data,
    size,
    update,
  };
}
