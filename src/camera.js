import * as THREE from "three";

const DEG2RAD = Math.PI / 180.0;
const RAD2DEG = 1 / DEG2RAD;

const FOV_DEG = 35;

const INITIAL_AZIMUTH = 30 * DEG2RAD;
const INITIAL_ELEVATION = 30 * DEG2RAD;
const INITIAL_RADIUS = 25;

const LEFT_MOUSE_BUTTON = 0;
const MIDDLE_MOUSE_BUTTON = 1;
const RIGHT_MOUSE_BUTTON = 2;

export class CameraController {
  constructor(gameWindow) {
    this.camera = new THREE.PerspectiveCamera(
      FOV_DEG,
      gameWindow.offsetWidth / gameWindow.offsetHeight,
      0.1,
      1000
    );

    this.gameWindow = gameWindow;

    this.cameraRadius = INITIAL_RADIUS;
    this.cameraAzimuth_rad = INITIAL_AZIMUTH;
    this.cameraElevation_rad = INITIAL_ELEVATION;
    this.cameraLookAt = new THREE.Vector3(0, 0, 0);

    this.isLeftMouseDown = false;
    this.isRightMouseDown = false;
    this.isMiddleMouseDown = false;
    this.prevMousePosition = null; //new THREE.Vector2(0, 0);

    this.updatePosition();
  }

  /**
   * Updates the camera's position based on the current azimuth, elevation, and radius.
   * The camera is positioned relative to the `cameraLookAt` point.
   * This method recalculates the camera's position in 3D space and updates its orientation.
   */
  updatePosition() {
    this.camera.position.x =
      this.cameraLookAt.x +
      this.cameraRadius *
        Math.cos(this.cameraAzimuth_rad) *
        Math.cos(this.cameraElevation_rad);
    this.camera.position.y =
      this.cameraLookAt.y +
      this.cameraRadius *
        Math.sin(this.cameraAzimuth_rad) *
        Math.cos(this.cameraElevation_rad);
    this.camera.position.z =
      this.cameraRadius * Math.sin(this.cameraElevation_rad);

    this.camera.up.set(0, 0, 1);
    this.camera.lookAt(this.cameraLookAt);
    this.camera.updateMatrix();
  }
  /**
   * Handles the mouse down event to update the mouse button status.
   * Sets the appropriate mouse button status to true and records the initial mouse position.
   *
   * @param {MouseEvent} event - The mouse down event.
   */
  onMouseDown(event) {
    if (event.button == LEFT_MOUSE_BUTTON) {
      this.isLeftMouseDown = true;
    } else if (event.button == RIGHT_MOUSE_BUTTON) {
      this.isRightMouseDown = true;
    }

    if (event.ctrlKey) {
      this.isCtrl = true;
    }
    if (event.shiftKey) {
      this.isShift = true;
    }

    this.prevMousePosition = { x: event.clientX, y: event.clientY };

    this.logMouseAndButtonStates();
  }

  onMouseUp(event) {
    this.isLeftMouseDown = false;
    this.isRightMouseDown = false;
    this.isShift = false;
    this.isCtrl = false;
  }

  /**
   * Handles the mouse move event to update the camera's position and orientation.
   * If the left mouse button is held down, the camera rotates around the `cameraLookAt` point.
   * If the right mouse button is held down, the camera pans across the scene.
   *
   * @param {MouseEvent} event - The mouse move event.
   */
  onMouseMove(event) {
    if (this.prevMousePosition === null) {
      return;
    }
    const curMousePosition = { x: event.clientX, y: event.clientY };

    const delta = {
      x: curMousePosition.x - this.prevMousePosition.x,
      y: curMousePosition.y - this.prevMousePosition.y,
    };

    const degPerPixel = (5 * FOV_DEG) / this.gameWindow.clientWidth;
    const distPerFOV = this.cameraRadius * Math.tan(0.5 * DEG2RAD * FOV_DEG);
    const distPerPixel = distPerFOV / this.gameWindow.clientWidth;

    if (this.isLeftMouseDown && this.isShift) {
      this.cameraAzimuth_rad -= DEG2RAD * degPerPixel * delta.x;
      this.cameraElevation_rad += DEG2RAD * degPerPixel * delta.y;

      this.cameraElevation_rad = Math.max(
        Math.min(this.cameraElevation_rad, Math.PI / 2),
        0
      );
      this.updatePosition();
    } else if (this.isRightMouseDown || (this.isLeftMouseDown && this.isCtrl)) {
      console.log("Panning");
      const right = 4 * distPerPixel * delta.x;
      const fwd = 4 * distPerPixel * delta.y;

      // console.log(`Delta ${delta.x}, ${delta.y}; Right ${right}, fwd ${fwd}`);

      const sin = Math.sin(this.cameraAzimuth_rad);
      const cos = Math.cos(this.cameraAzimuth_rad);

      // console.log(`sin ${sin} cos ${cos}`);

      let wd = new THREE.Vector3();
      this.camera.getWorldDirection(wd);
      // console.log(wd);

      const dx = sin * right + fwd * wd.x;
      const dy = -cos * right + fwd * wd.y;
      // console.log(`dx = ${dx}, dy = ${dy}`);
      this.cameraLookAt.x += dx;
      this.cameraLookAt.y += dy;
      this.updatePosition();
    } else {
      console.log("Left", this.isLeftMouseDown, "Right", this.isRightMouseDown, "Ctrl", this.isCtrl);
    }

    this.prevMousePosition = { x: event.clientX, y: event.clientY };
  }

  onWheel(event) {
    this.cameraRadius -= 0.01 * event.wheelDelta;
    this.cameraRadius = Math.max(2, this.cameraRadius);
    this.updatePosition();
  }

  onContextMenu(event) {
    // nothing
  }

  /**
   * Logs the current mouse and button states.
   */
  logMouseAndButtonStates() {
    console.log("Mouse Position:", this.prevMousePosition);
    console.log("Left Mouse Down:", this.isLeftMouseDown);
    console.log("Middle Mouse Down:", this.isMiddleMouseDown);
    console.log("Right Mouse Down:", this.isRightMouseDown);
    console.log("Ctrl Down:", this.isCtrl);
    console.log("Shift Down:", this.isShift);
  }
}
