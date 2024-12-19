import { createCity } from "./city";
import { SceneController } from "./scene";
import { InputController } from "./inputcontroller";
import buildingFactory from "./buildings";

const CITY_SIZE = 20;

console.log("Hello, World!");

class Game {
  constructor() {
    this.scene = new SceneController(document.getElementById("render-target"));
    this.city = createCity(CITY_SIZE);
    this.input = new InputController(document.getElementById("render-target"), this.scene, this.scene.camera);
    this.activeToolId = null;

    this.scene.initialize(this.city);
    this.scene.setupLights();
    this.scene.start();

    this.scene.onObjectSelected = (selectedObject) => {
      // console.log("Selected", selectedObject);

      const { x, y } = selectedObject.userData;
      const tile = this.city.data[x][y];

      if (this.activeToolId === "bulldoze") {
        // remove building at that location
        this.city.data[x][y].building = undefined;
      } else if (!tile.building) {
        // place building at that location
        this.city.data[x][y].building = buildingFactory[this.activeToolId]();
      }
      this.city.update();
      this.scene.update(this.city);
    };


    console.log("Window loaded, scene started.");

    setInterval(() => {
      this.update();
    }, 1000)
  }

  update() {
    this.city.update();
    this.scene.update(this.city);
  }

  setActiveToolId(id) {
    this.activeToolId = id;
  }
}

/**
 * Create the game and GOOOOO!
 * 
 * From here on, we are defining things that we want to be accessible from the HTML.
 */

window.onload = () => {
  window.game = new Game();
};

let selectedControl = document.getElementById("button-bulldoze");

/**
 * Function referenced from the HTML
 */
window.setActiveTool = (event, id) => {
  if (selectedControl) {
    selectedControl.classList.remove("selected");
  }
  selectedControl = event.target;
  selectedControl.classList.add("selected");
  window.game.setActiveToolId(id);
}
