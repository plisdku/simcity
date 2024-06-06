import { createCity } from "./city";
import { createScene } from "./scene";

console.log("Hello, World!");

window.onload = () => {
  const scene = createScene();
  const city = createCity(8);
  scene.initialize(city);
  scene.setupLights();
  scene.start();

  console.log("Window loaded, scene started.");

  document.addEventListener("mousedown", scene.onMouseDown, false);
  document.addEventListener("mouseup", scene.onMouseUp, false);
  document.addEventListener("mousemove", scene.onMouseMove, false);
  document.addEventListener("wheel", scene.onWheel, false);

  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  // function zoom(e) {
  //   console.log(e.scale);
  //   e.preventDefault();
  // }
  // console.log("EVENTS");
  // document.addEventListener("gesturestart", zoom);
  // document.addEventListener("gesturechange", zoom);
  // document.addEventListener("gestureend", zoom);
};
