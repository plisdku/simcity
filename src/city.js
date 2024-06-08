export function createCity(size) {
  const data = [];

  initialize();

  function initialize() {
    for (let x = 0; x < size; x += 1) {
      const column = [];
      for (let y = 0; y < size; y += 1) {
        const tile = createTile(x, y);

        // if (Math.random() > 0.7) {
        //   tile.building = "building";
        // }

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
      buildingId: undefined,
      update() {
        const r = Math.random();
        if (r < 0.01) {
          // console.log(`Building[${x}, ${y}] = ${this.buildingId}`);
          if (this.buildingId === undefined) {
            this.buildingId = "building-1";
          } else if (this.buildingId === "building-1") {
            this.buildingId = "building-2";
          } else if (this.buildingId === "building-2") {
            this.buildingId = "building-3";
          } else if (this.buildingId === "building-3") {
            this.buildingId = undefined;
          }
        }
        // console.log(`Updating ${x}, ${y}, ${this.buildingId}`);
      },
    };
  }

  function update() {
    for (let x = 0; x < size; x += 1) {
      for (let y = 0; y < size; y += 1) {
        data[x][y].update();
      }
    }
  }

  return {
    data,
    size,
    update,
  };
}
