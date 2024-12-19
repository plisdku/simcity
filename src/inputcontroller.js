import { SceneController } from "./scene";
import { CameraController } from "./camera";

const LEFT_MOUSE_BUTTON = 0;
const MIDDLE_MOUSE_BUTTON = 1;
const RIGHT_MOUSE_BUTTON = 2;

const FUDGE_PIXELS = 5;

class InputState {
  /**
   * Creates an instance of InputState.
   */
  constructor() {
    this.isLeftMouseDown = false;
    this.isRightMouseDown = false;
    this.isMiddleMouseDown = false;
    this.isSpaceDown = false;
    this.isCtrl = false;
    this.isShift = false;

    this.down = null;
    this.cur = null;
    this.prev = null;
    this.delta = null;
  }

  moved() {
      if (this.down === null) {
        return false;
      }
      const dx = this.cur.x - this.down.x;
      const dy = this.cur.y - this.down.y
      return Math.abs(dx) < FUDGE_PIXELS &&  Math.abs(dy) < FUDGE_PIXELS;
  }
}

class InputController {
  /**
   * Creates an instance of InputController.
   *
   * @param {HTMLElement} gameWindow
   * @param {SceneController} scene
   * @param {CameraController} camera
   */
  constructor(gameWindow, scene, camera) {
    this.gameWindow = gameWindow;
    this.scene = scene;
    this.camera = camera;

    this.state = new InputState();

    this.bindEventListeners();
  }

  bindEventListeners() {
    this.gameWindow.addEventListener(
      "mousedown",
      this.onMouseDown.bind(this),
      false
    );
    this.gameWindow.addEventListener(
      "mouseup",
      this.onMouseUp.bind(this),
      false
    );
    this.gameWindow.addEventListener(
      "mousemove",
      this.onMouseMove.bind(this),
      false
    );
    this.gameWindow.addEventListener("wheel", this.onWheel.bind(this), false);
    document.addEventListener(
      "keydown",
      this.onKeyDown.bind(this),
      false
    );
    document.addEventListener("keyup", this.onKeyUp.bind(this), false);

    this.gameWindow.addEventListener("contextmenu", (e) => {
      console.log("contextmenu");
      e.preventDefault();
    });
  }

  /**
   * Handle key down.
   *
   * @param {KeyboardEvent} event - The key down event.
   */
  onKeyDown(event) {
    if (event.code === "Space") {
      this.state.isSpaceDown = true;
      event.preventDefault(); // prevent scrolling
    }
  }

  /**
   * Handle key up.
   *
   * @param {KeyboardEvent} event - The key up event.
   */
  onKeyUp(event) {
    if (event.code === "Space") {
      this.state.isSpaceDown = false;
    }
  }

  /**
   * Handle mouse down.
   *
   * @param {MouseEvent} - The mouse down event.
   */
  onMouseDown(event) {
    if (event.button == LEFT_MOUSE_BUTTON) {
      this.state.isLeftMouseDown = true;
    } else if (event.button == RIGHT_MOUSE_BUTTON) {
      this.state.isRightMouseDown = true;
    } else if (event.button == MIDDLE_MOUSE_BUTTON) {
      this.state.isMiddleMouseDown = true;
    }

    if (event.ctrlKey) {
      this.state.isCtrl = true;
    }
    if (event.shiftKey) {
      this.state.isShift = true;
    }

    this.state.down = { x: event.clientX, y: event.clientY };
    this.state.prev = { x: event.clientX, y: event.clientY };

    console.log("Set down to", this.state.down);

    // this.logMouseAndButtonStates();
  }

  /**
   * Handle mouse up.
   *
   * @param {MouseEvent} event - The mouse up event.
   */
  onMouseUp(event) {
    this.state.isLeftMouseDown = false;
    this.state.isRightMouseDown = false;
    this.state.isMiddleMouseDown = false;
    this.state.isShift = false;
    this.state.isCtrl = false;

    if (this.state.moved()) {
      this.scene.onMouseUp(this.state);
    }

    console.log("State down nulling.");

    this.state.down = null;
  }

  /**
   * Handle mouse move.
   *
   * @param {MouseEvent} event - The mouse move event.
   */
  onMouseMove(event) {

    if (this.state.prev === null) {
      this.state.prev = { x: event.clientX, y: event.clientY };
    }
    this.state.cur = { x: event.clientX, y: event.clientY };

    this.state.delta = {
      x: this.state.cur.x - this.state.prev.x,
      y: this.state.cur.y - this.state.prev.y,
    };

    // If shift is held, pass this to the scene for tool stuff.
    // Otherwise, pass to the camera controller.

    if (this.state.isShift) {
      // Scene can apply whatever the current tool is, over and over.
      // It doesn't need the delta. It probably does want to be tracking
      // the previously moused-over object to see if it needs to do anything
      // else.
      this.scene.onMouseMove(this.state);
    } else {
      // Camera will pan or rotate. But, which one?
      // Maybe need to check the space bar?
      this.camera.onMouseMove(this.state);
    }

    this.state.prev = this.state.cur;
  }

  /**
   * Handle wheel event.
   *
   * @param {WheelEvent} event - The wheel event.
   */
  onWheel(event) {
    this.camera.onWheel(event);
  }

  /**
   * Logs the current mouse and button states.
   */
  logMouseAndButtonStates() {
    console.log("Mouse Position:", this.state.prev);
    console.log("Left Mouse Down:", this.state.isLeftMouseDown);
    console.log("Middle Mouse Down:", this.state.isMiddleMouseDown);
    console.log("Right Mouse Down:", this.state.isRightMouseDown);
    console.log("Ctrl Down:", this.state.isCtrl);
    console.log("Shift Down:", this.state.isShift);
  }
}

export { InputController, InputState };
