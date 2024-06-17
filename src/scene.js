import * as THREE from "three";

import { createCamera } from "./camera";
import { Resizer } from "./resizer";
import { createAssetInstance } from "./assets";

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

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let selectedObject = undefined;
  let onObjectSelected = undefined;

  let rotAngle = 0;
  let terrain = [];
  let buildings = [];

  function initialize(city) {
    scene.clear();
    terrain = [];
    buildings = [];

    for (let x = 0; x < city.size; x += 1) {
      const column = [];
      for (let y = 0; y < city.size; y += 1) {
        const terrainId = city.data[x][y].terrainId;
        const mesh = createAssetInstance(terrainId, x, y);
        if (mesh === undefined) {
          console.log("UNDEFINED: ", terrainId, x, y);
        }
        column.push(mesh);
        scene.add(mesh);
      }
      terrain.push(column);
      buildings.push([...Array(city.size)]); // column of undefined values
    }
  }

  function update(city) {
    // console.log("Update", city);
    for (let x = 0; x < city.size; x += 1) {
      const column = [];
      for (let y = 0; y < city.size; y += 1) {
        const currentBuildingId = buildings[x][y]?.userData.id;
        const newBuildingId = city.data[x][y].building?.id;

        // If the player removes a building, remove it from the scene
        if (!newBuildingId && currentBuildingId) {
          scene.remove(buildings[x][y]);
          buildings[x][y] = undefined;
        }

        // If the data model has changed
        if (newBuildingId && newBuildingId !== currentBuildingId) {
          scene.remove(buildings[x][y]);
          const mesh = createAssetInstance(newBuildingId, x, y);

          if (!mesh) {
            console.log("MASH", newBuildingId);
          }
          // console.log(mesh.position, mesh.scale);
          buildings[x][y] = mesh;
          scene.add(mesh);
        }
      }
    }
  }

  function setupLights() {
    const lights = [
      new THREE.AmbientLight(0xffffff, 0.2),
      new THREE.DirectionalLight(0xffffff, 0.6),
      new THREE.DirectionalLight(0xffffff, 0.3),
      new THREE.DirectionalLight(0xffffff, 0.9),
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

    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera.camera);

    let intersections = raycaster.intersectObjects(scene.children, false);

    if (selectedObject) {
      selectedObject.material.emissive.setHex(0);
    }

    if (intersections.length > 0) {
      selectedObject = intersections[0].object;
      selectedObject.material.emissive.setHex(0x555555);

      // console.log("User data", selectedObject.userData)
      // console.log(`Tile ${selectedObject.userData.x}, ${selectedObject.userData.y}`);

      if (this.onObjectSelected) {
        this.onObjectSelected(selectedObject)
      }
    }
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
    update,
    onObjectSelected
  };
}
