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
      building: undefined,
      update() {
        const r = Math.random();
        if (r < 0.001) {
          // console.log(`Building[${x}, ${y}] = ${this.buildingId}`);
          if (this.buildingId === undefined) {
            this.buildingId = "road";
          } else if (this.buildingId === "road") {  
            this.buildingId = "residential";
          } else if (this.buildingId === "residential") {
            this.buildingId = "commercial";
          } else if (this.buildingId === "commercial") {
            this.buildingId = "industrial";
          } else if (this.buildingId === "industrial") {
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
