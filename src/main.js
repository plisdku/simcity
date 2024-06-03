import { createScene } from "./scene";

console.log("Hello, World!");

let scene;

window.onload = () => {
  scene = createScene();
  scene.start();

  console.log("Window loaded, scene started.");
};
