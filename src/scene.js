import * as THREE from "three";

import { CameraController } from "./camera";
import { Resizer } from "./resizer";
import { createAssetInstance } from "./assets";

const BACKGROUND_COLOR = 0x777777;

function getObjectSize(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);
  return size;
}

export class SceneController {
  constructor(gameWindow) {
    this.gameWindow = gameWindow;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(BACKGROUND_COLOR);
    this.camera = new CameraController(this.gameWindow);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.gameWindow.appendChild(this.renderer.domElement); // the domElement is a canvas element

    this.resizer = new Resizer(this.gameWindow, this.camera.camera, this.renderer);

    this.raycaster = new THREE.Raycaster();

    this.selectedObject = undefined;
    this.hoverObject = undefined;
    this.onObjectSelected = undefined;

    this.terrain = [];
    this.buildings = [];

    this.cityGroup = new THREE.Group();
    this.cityGroup.name = "CityGroup";
  }

  initialize(city) {
    this.scene.clear();
    this.terrain = [];
    this.buildings = [];

    for (let x = 0; x < city.size; x += 1) {
      const column = [];
      for (let y = 0; y < city.size; y += 1) {
        const terrainId = city.data[x][y].terrainId;
        const mesh = createAssetInstance(terrainId, x, y);
        if (mesh === undefined) {
          console.log("UNDEFINED: ", terrainId, x, y);
        }
        column.push(mesh);
        this.cityGroup.add(mesh);
      }
      this.terrain.push(column);
      this.buildings.push([...Array(city.size)]); // column of undefined values
    }
    this.scene.add(this.cityGroup);
    console.log("City group size", getObjectSize(this.cityGroup));

    const size = getObjectSize(this.cityGroup);
    this.cityGroup.position.set(-size.x / 2, -size.y / 2, 0);
  }

  update(city) {
    // console.log("Update", city);
    for (let x = 0; x < city.size; x += 1) {
      const column = [];
      for (let y = 0; y < city.size; y += 1) {
        const tile = city.data[x][y];

        const existingBuildingMesh = this.buildings[x][y];

        // If the player removes a building, remove it from the scene
        if (!tile.building && existingBuildingMesh) {
          this.cityGroup.remove(this.buildings[x][y]);
          this.buildings[x][y] = undefined;
        }

        // If the data model has changed
        if (tile.building && tile.building.updated) {
          console.log("Updating building at", x, y);
          this.cityGroup.remove(this.buildings[x][y]);
          const mesh = createAssetInstance(
            tile.building.id,
            x,
            y,
            tile.building
          );

          this.buildings[x][y] = mesh;
          this.cityGroup.add(mesh);
          tile.building.updated = false;
        } // tile.building
      } // for y
    } // for x
  }

  setupLights() {
    const sun = new THREE.DirectionalLight(0xffffff, 1.0);
    const sunTarget = new THREE.Object3D();
    sunTarget.position.set(10,10,0);
    this.scene.add(sunTarget);
    sun.position.set(20, 20,20);
    sun.target = sunTarget;
    sun.castShadow = true;
    sun.shadow.camera.left = -20;
    sun.shadow.camera.right = 20;
    sun.shadow.camera.top = 20;
    sun.shadow.camera.bottom = -20;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 50;
    sun.shadow.camera.up.set(0, 0, 1);
    // sun.shadow.camera.lookAt(sunTarget.position);
    sun.shadow.camera.updateMatrix();
    this.scene.add(sun);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.3));


    // const helper = new THREE.DirectionalLightHelper(sun, 5);
    // scene.add(helper);

    // const helper2 = new THREE.CameraHelper(sun.shadow.camera);
    // scene.add(helper2);

    // const lights = [
    //   new THREE.AmbientLight(0xffffff, 0.2),
    //   new THREE.DirectionalLight(0xffffff, 0.6),
    //   new THREE.DirectionalLight(0xffffff, 0.3),
    //   new THREE.DirectionalLight(0xffffff, 0.9),
    // ];

    // lights[1].position.set(0, 0, 10);
    // lights[2].position.set(5, 5, 10);
    // lights[3].position.set(-5, 5, 10);

    // scene.add(...lights);
  }

  draw() {
    this.renderer.render(this.scene, this.camera.camera);
  }

  start() {
    this.renderer.setAnimationLoop(this.draw.bind(this));
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  onMouseDown(event) {
    this.camera.onMouseDown(event);

    const mouse = new THREE.Vector2(
      (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
      -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1
    );

    this.raycaster.setFromCamera(mouse, this.camera.camera);

    let intersections = this.raycaster.intersectObjects(this.cityGroup.children, false);

    if (this.selectedObject) {
      this.selectedObject.material.emissive.setHex(0);
    }

    if (intersections.length > 0) {
      this.selectedObject = intersections[0].object;
      this.selectedObject.material.emissive.setHex(0x555555);

      // console.log("User data", this.selectedObject.userData)
      // console.log(`Tile ${this.selectedObject.userData.x}, ${this.selectedObject.userData.y}`);

      if (this.onObjectSelected) {
        this.onObjectSelected(this.selectedObject)
      }
    }
    else {
      console.log("No intersection");
    }
  }

  onMouseUp(event) {
    this.camera.onMouseUp(event);
  }

  onMouseMove(event) {
    this.camera.onMouseMove(event);
  }

  onWheel(event) {
    this.camera.onWheel(event);
  }

  onContextMenu(event) {
    this.event.preventDefault();
  }
}


// export function createScene() {
//   const gameWindow = document.getElementById("render-target");
//   const scene = new THREE.Scene();
//   scene.background = new THREE.Color(0x777777);

//   console.log("Created scene! Game window:", gameWindow);

//   const camera = new CameraController(gameWindow);

//   const renderer = new THREE.WebGLRenderer();
//   renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight);
//   renderer.setClearColor(0x000000, 0);
//   renderer.shadowMap.enabled = true;
//   renderer.shadowMap.type = THREE.PCFShadowMap;
//   gameWindow.appendChild(renderer.domElement); // the domElement is a canvas element

//   const resizer = new Resizer(gameWindow, camera.camera, renderer);

//   const raycaster = new THREE.Raycaster();
//   const mouse = new THREE.Vector2();
//   let selectedObject = undefined;
//   let onObjectSelected = undefined;

//   let rotAngle = 0;
//   let terrain = [];
//   let buildings = [];

//   const cityGroup = new THREE.Group();
//   cityGroup.name = "CityGroup";

//   function getObjectSize(object) {
//     const box = new THREE.Box3().setFromObject(object);
//     const size = new THREE.Vector3();
//     box.getSize(size);
//     return size;
//   }

//   function initialize(city) {
//     scene.clear();
//     terrain = [];
//     buildings = [];

//     for (let x = 0; x < city.size; x += 1) {
//       const column = [];
//       for (let y = 0; y < city.size; y += 1) {
//         const terrainId = city.data[x][y].terrainId;
//         const mesh = createAssetInstance(terrainId, x, y);
//         if (mesh === undefined) {
//           console.log("UNDEFINED: ", terrainId, x, y);
//         }
//         column.push(mesh);
//         // scene.add(mesh);
//         cityGroup.add(mesh);
//       }
//       terrain.push(column);
//       buildings.push([...Array(city.size)]); // column of undefined values
//     }
//     scene.add(cityGroup);
//     console.log("City group size", getObjectSize(cityGroup));

//     const size = getObjectSize(cityGroup)
//     cityGroup.position.set(-size.x/2, -size.y/2, 0);
//   }

//   function update(city) {
//     // console.log("Update", city);
//     for (let x = 0; x < city.size; x += 1) {
//       const column = [];
//       for (let y = 0; y < city.size; y += 1) {
//         const tile = city.data[x][y];

//         const existingBuildingMesh = buildings[x][y];

//         // If the player removes a building, remove it from the scene
//         if (!tile.building && existingBuildingMesh) {
//           cityGroup.remove(buildings[x][y]);
//           buildings[x][y] = undefined;
//         }

//         // If the data model has changed
//         if (tile.building && tile.building.updated) {
//           console.log("Updating building at", x, y);
//           cityGroup.remove(buildings[x][y]);
//           const mesh = createAssetInstance(tile.building.id, x, y, tile.building);
          
//           buildings[x][y] = mesh;
//           cityGroup.add(mesh);
//           tile.building.updated = false;
//         }
//       }
//     }
//   }

  // function setupLights() {
  //   const sun = new THREE.DirectionalLight(0xffffff, 1.0);
  //   const sunTarget = new THREE.Object3D();
  //   sunTarget.position.set(10,10,0);
  //   scene.add(sunTarget);
  //   sun.position.set(20, 20,20);
  //   sun.target = sunTarget;
  //   sun.castShadow = true;
  //   sun.shadow.camera.left = -20;
  //   sun.shadow.camera.right = 20;
  //   sun.shadow.camera.top = 20;
  //   sun.shadow.camera.bottom = -20;
  //   sun.shadow.mapSize.width = 1024;
  //   sun.shadow.mapSize.height = 1024;
  //   sun.shadow.camera.near = 1;
  //   sun.shadow.camera.far = 50;
  //   sun.shadow.camera.up.set(0, 0, 1);
  //   // sun.shadow.camera.lookAt(sunTarget.position);
  //   sun.shadow.camera.updateMatrix();
  //   scene.add(sun);
  //   scene.add(new THREE.AmbientLight(0xffffff, 0.3));


  //   // const helper = new THREE.DirectionalLightHelper(sun, 5);
  //   // scene.add(helper);

  //   // const helper2 = new THREE.CameraHelper(sun.shadow.camera);
  //   // scene.add(helper2);

  //   // const lights = [
  //   //   new THREE.AmbientLight(0xffffff, 0.2),
  //   //   new THREE.DirectionalLight(0xffffff, 0.6),
  //   //   new THREE.DirectionalLight(0xffffff, 0.3),
  //   //   new THREE.DirectionalLight(0xffffff, 0.9),
  //   // ];

  //   // lights[1].position.set(0, 0, 10);
  //   // lights[2].position.set(5, 5, 10);
  //   // lights[3].position.set(-5, 5, 10);

  //   // scene.add(...lights);
  // }

//   function draw() {
//     // console.log("Draw!");
//     renderer.render(scene, camera.camera);

//     // mesh.rotateZ(0.01);
//     // mesh.rotateX(0.001);
//     // mesh.rotation.y += 0.005;
//   }

//   function start() {
//     renderer.setAnimationLoop(draw);
//   }

//   function stop() {
//     renderer.setAnimationLoop(null);
//   }

//   function onMouseDown(event) {
//     camera.onMouseDown(event);

//     mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
//     mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

//     raycaster.setFromCamera(mouse, camera.camera);

//     let intersections = raycaster.intersectObjects(cityGroup.children, false);

//     if (selectedObject) {
//       selectedObject.material.emissive.setHex(0);
//     }

//     if (intersections.length > 0) {
//       selectedObject = intersections[0].object;
//       selectedObject.material.emissive.setHex(0x555555);

//       // console.log("User data", selectedObject.userData)
//       // console.log(`Tile ${selectedObject.userData.x}, ${selectedObject.userData.y}`);

//       if (this.onObjectSelected) {
//         this.onObjectSelected(selectedObject)
//       }
//     }
//     else {
//       console.log("No intersection");
//     }
//   }

//   function onMouseUp(event) {
//     camera.onMouseUp(event);
//   }

//   function onMouseMove(event) {
//     camera.onMouseMove(event);
//   }

//   function onWheel(event) {
//     camera.onWheel(event);
//   }

//   function onContextMenu(event) {
//     // camera.onContextMenu(event);
//     event.preventDefault();
//   }

//   return {
//     start,
//     stop,
//     onMouseDown,
//     onMouseUp,
//     onMouseMove,
//     onWheel,
//     initialize,
//     setupLights,
//     update,
//     onObjectSelected
//   };
// }
