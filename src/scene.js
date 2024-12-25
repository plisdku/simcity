import * as THREE from "three";

import { CameraController } from "./camera";
import { Resizer } from "./resizer";
import { createAssetInstance } from "./assets";

import buildingFactory from "./buildings";

const BACKGROUND_COLOR = 0x777777;

function getObjectSize(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  box.getSize(size);
  return size;
}


export class SceneController {
  /**
   * Creates an instance of SceneController.
   * Initializes the Three.js scene, camera, renderer, and other necessary components.
   * Sets up the game window, resizer, raycaster, and city group.
   *
   * @param {HTMLElement} gameWindow - The HTML element that will contain the rendered scene.
   */
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

    this.lastAffectedObject = undefined;
    this.selectedObject = undefined;
    this.hoverObject = undefined;

    this.terrain = [];
    this.buildings = [];

    this.cityGroup = new THREE.Group();
    this.cityGroup.name = "CityGroup";
  }

  /**
   * Initializes the scene with the given city data.
   * Clears the existing scene, creates terrain and building meshes, and adds them to the city group.
   * The city group is then added to the scene and positioned appropriately.
   *
   * @param {Object} city - The city data object containing terrain and building information.
   */
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
  /**
   * Updates the scene with the given city data.
   * Iterates through the city data to update the terrain and building meshes.
   * Removes buildings that no longer exist and adds or updates buildings that have changed.
   *
   * @param {Object} city - The city data object containing terrain and building information.
   */
  update(city) {
    for (let x = 0; x < city.size; x += 1) {
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
        }
      }
    }
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

  getObjectUnderMouse(state) {
    const mouse = new THREE.Vector2(
      (state.cur.x / this.renderer.domElement.clientWidth) * 2 - 1,
      -(state.cur.y / this.renderer.domElement.clientHeight) * 2 + 1
    );

    this.raycaster.setFromCamera(mouse, this.camera.camera);

    let intersections = this.raycaster.intersectObjects(
      this.cityGroup.children,
      false
    );

    if (intersections.length === 0) {
      return undefined;
    } else {
      return intersections[0].object;
    }
  }

  /**
   * 
   * @param {*} activeToolId 
   * @param {*} selectedObject 
   * @param {City} city 
   */
  onObjectSelected(activeToolId, selectedObject, city) {
    console.log("Active tool", activeToolId);
    const { x, y } = selectedObject.userData;
    const tile = city.data[x][y];

    if (activeToolId === "bulldoze") {
      // remove building at that location
      city.data[x][y].building = undefined;
    } else if (!tile.building) {
      // place building at that location
      city.data[x][y].building = buildingFactory[activeToolId]();
    }
    city.update();
    this.update(city);
  }

  onMouseDown(state) {
    console.log("Scene controller mouse down");
    // really, do nothing.
    // this.mouseDownObject = this.getObjectUnderMouse(state);
  }

  onMouseUp(state, activeToolId, city) {
    console.log("Scene controller mouse up", state);

    const mouseObject = this.getObjectUnderMouse(state);

    if (state.isShift) {
      // brushstroke mouse up: do nothing.
    } else if (state.isLeftMouseDown) {
      // normal click mouse up: take action.
      this.onObjectSelected(activeToolId, mouseObject, city);
    }
    // this.lastAffectedObject = undefined;
  }

  onMouseMove(state, activeToolId, city) {
    console.log("Scene controller mouse move", state);
    if (state.moved()) {

      const mouseObject = this.getObjectUnderMouse(state);

      if (state.isShift) {
        // brushstroke mouse move: take action.
        this.onObjectSelected(activeToolId, mouseObject, city);
      } else {
        console.log("what")
        // do nothing
      }
    }
    else {
      console.log("No movement");
    }
  }

  onWheel(event) {
    // this.camera.onWheel(event);
  }

  onContextMenu(event) {
    // this.event.preventDefault();
  }
}
