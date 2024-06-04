import * as THREE from "three";

import { createCamera } from "./camera";

export function createScene() {
  const gameWindow = document.getElementById("render-target");
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x777777);

  console.log("Created scene! Game window:", gameWindow);

  const camera = createCamera(gameWindow);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight);
  gameWindow.appendChild(renderer.domElement); // the domElement is a canvas element

  const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const simpleBox = new THREE.BoxGeometry(1.0, 1.0, 1.0);

  const floor = new THREE.BoxGeometry(10, 10, 0.1);
  const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x223322 });
  const floorMesh = new THREE.Mesh(floor, floorMaterial);

  const mesh = new THREE.Mesh(simpleBox, boxMaterial);

  scene.add(mesh, floorMesh);

  let rotAngle = 0;
  function draw() {
    // console.log("Draw!");
    renderer.render(scene, camera.camera);

    // mesh.rotateZ(0.01);
    // mesh.rotateX(0.001);
    // mesh.rotation.y += 0.005;
  }

  function start() {
    renderer.setAnimationLoop(draw);
  }

  function stop() {
    renderer.setAnimationLoop(null);
  }

  function onMouseDown(event) {
    camera.onMouseDown(event);
  }

  function onMouseUp(event) {
    camera.onMouseUp(event);
  }

  function onMouseMove(event) {
    camera.onMouseMove(event);
  }

  function onWheel(event) {
    console.log("WHAT");
    camera.onWheel(event);
  }

  return {
    start,
    stop,
    onMouseDown,
    onMouseUp,
    onMouseMove,
  };
}
