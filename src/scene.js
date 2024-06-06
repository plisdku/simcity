import * as THREE from "three";

import { createCamera } from "./camera";
import { Resizer } from "./resizer";

export function createScene() {
  const gameWindow = document.getElementById("render-target");
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x777777);

  console.log("Created scene! Game window:", gameWindow);

  const camera = createCamera(gameWindow);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight);
  gameWindow.appendChild(renderer.domElement); // the domElement is a canvas element

  const resizer = new Resizer(gameWindow, camera.camera, renderer);

  const floor = new THREE.BoxGeometry(10, 10, 0.1);
  const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x223322 });
  const floorMesh = new THREE.Mesh(floor, floorMaterial);

  scene.add(floorMesh);

  let rotAngle = 0;

  let meshes = [];

  function initialize(city) {
    scene.clear();
    meshes = [];

    for (let x = 0; x < city.size; x += 1) {
      const column = [];
      for (let y = 0; y < city.size; y += 1) {
        // 1. load mesh/3d object corresponding to the tile at x,y
        // 2. add that mesh to the scene
        // 3. add that mesh to the meshes array

        // Grass geometry
        // const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const boxMaterial = new THREE.MeshLambertMaterial({ color: 0x00aa00 });
        const simpleBox = new THREE.BoxGeometry(1.0, 1.0, 1.0);
        const mesh = new THREE.Mesh(simpleBox, boxMaterial);
        mesh.position.set(x, y, -0.5);
        column.push(mesh);
        scene.add(mesh);

        // Building geometry

        const tile = city.data[x][y];
        if (tile.building == "building") {
          const buildingMaterial = new THREE.MeshLambertMaterial({
            color: 0x777777,
          });
          const buildingBox = new THREE.BoxGeometry(1.0, 1.0, 1.0);
          const buildingMesh = new THREE.Mesh(buildingBox, buildingMaterial);
          buildingMesh.position.set(x, y, 0.5);
          column.push(buildingMesh);
          scene.add(buildingMesh);
        }
      }
      meshes.push(column);
    }
  }

  function setupLights() {
    const lights = [
      new THREE.AmbientLight(0xffffff, 0.2),
      new THREE.DirectionalLight(0xffffff, 0.3),
      new THREE.DirectionalLight(0xffffff, 0.3),
      new THREE.DirectionalLight(0xffffff, 0.3),
    ];

    lights[1].position.set(0, 0, 10);
    lights[2].position.set(5, 5, 10);
    lights[3].position.set(-5, 5, 10);

    scene.add(...lights);
  }

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
    camera.onWheel(event);
  }

  return {
    start,
    stop,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onWheel,
    initialize,
    setupLights,
  };
}
