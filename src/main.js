import { createCity } from "./city";
import { createScene } from "./scene";
import buildingFactory from "./buildings";

const CITY_SIZE = 20;

console.log("Hello, World!");

function createGame() {
  const scene = createScene();
  const city = createCity(CITY_SIZE);
  let activeToolId = "bulldoze";

  scene.initialize(city);
  scene.setupLights();
  scene.onObjectSelected = (selectedObject) => {
    // console.log("Selected", selectedObject);

    let { x, y } = selectedObject.userData;
    const tile = city.data[x][y];

    if (activeToolId === "bulldoze") {
      // remove building at that location
      city.data[x][y].building = undefined;
    } else if (!tile.building) {
      // place building at that location
      city.data[x][y].building = buildingFactory[activeToolId]();
    }
    city.update();
    scene.update(city);
  }

  // console.log("oos:", scene.onObjectSelected)
  scene.start();

  console.log("Window loaded, scene started.");

  document.addEventListener("mousedown", scene.onMouseDown.bind(scene), false);
  document.addEventListener("mouseup", scene.onMouseUp.bind(scene), false);
  document.addEventListener("mousemove", scene.onMouseMove.bind(scene), false);
  document.addEventListener("wheel", scene.onWheel.bind(scene), false);

  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  const game = {
    update() {
      // console.log("Update");
      city.update();
      scene.update(city);
    },
    setActiveToolId(toolId) {
      activeToolId = toolId;
    }
  };
  setInterval(() => {
    game.update();
  }, 1000);

  // game.update();

  // function zoom(e) {
  //   console.log(e.scale);
  //   e.preventDefault();
  // }
  // console.log("EVENTS");
  // document.addEventListener("gesturestart", zoom);
  // document.addEventListener("gesturechange", zoom);
  // document.addEventListener("gestureend", zoom);

  return game;
}

window.onload = () => {
  window.game = createGame();
};

let selectedControl = document.getElementById("button-bulldoze");
// console.log("Selected:", selectedControl)
window.setActiveTool = (event, id) => {
  // console.log("Set active:", event, id)
  if (selectedControl) {
    selectedControl.classList.remove("selected");
  }
  selectedControl = event.target;
  selectedControl.classList.add("selected");
  window.game.setActiveToolId(id);
}
