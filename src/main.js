import { createCity } from "./city";
import { createScene } from "./scene";

console.log("Hello, World!");

function createGame() {
  const scene = createScene();
  const city = createCity(20);
  scene.initialize(city);
  scene.setupLights();
  scene.onObjectSelected = (selectedObject) => {
    console.log("Selected", selectedObject);

    let { x, y } = selectedObject.userData;
    const tile = city.data[x][y];
    console.log(tile);
  }

  console.log("oos:", scene.onObjectSelected)
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
