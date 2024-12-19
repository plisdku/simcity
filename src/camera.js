import * as THREE from "three";
import { InputState } from "./inputcontroller";

const DEG2RAD = Math.PI / 180.0;
const RAD2DEG = 1 / DEG2RAD;

const FOV_DEG = 35;

const INITIAL_AZIMUTH = 30 * DEG2RAD;
const INITIAL_ELEVATION = 30 * DEG2RAD;
const INITIAL_RADIUS = 25;

/*
How is this supposed to work?

Hover: whatever I hover over is highlighted
Left click: select or use tool
Left click and drag or three finger drag: use tool over everything
Right click: context menu
Space and click: pan
Mouse wheel or pinch or two finger drag: zoom
Arrow keys: pan
How do I rotate the camera though, on a laptop?

I think this is unintuitive. Maybe I'll hold down shift for brushstrokes.
*/

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
   * @param {InputState} state - The mouse down event.
   */
  onMouseDown(state) {}

  onMouseUp(state) {}

  /**
   * Handles the mouse move event to update the camera's position and orientation.
   * If the left mouse button is held down, the camera rotates around the `cameraLookAt` point.
   * If the right mouse button is held down, the camera pans across the scene.
   *
   * @param {InputState} state - The mouse move event.
   */
  onMouseMove(state) {
    console.log(state);

    const degPerPixel = (5 * FOV_DEG) / this.gameWindow.clientWidth;
    const distPerFOV = this.cameraRadius * Math.tan(0.5 * DEG2RAD * FOV_DEG);
    const distPerPixel = distPerFOV / this.gameWindow.clientWidth;

    if (state.isLeftMouseDown && state.isSpaceDown) {
      // Pan.
      console.log("Panning");
      const right = 4 * distPerPixel * state.delta.x;
      const fwd = 4 * distPerPixel * state.delta.y;

      // console.log(`Delta ${delta.x}, ${delta.y}; Right ${right}, fwd ${fwd}`);

      const sin = Math.sin(this.cameraAzimuth_rad);
      const cos = Math.cos(this.cameraAzimuth_rad);

      // console.log(`sin ${sin} cos ${cos}`);

      let worldDirection = new THREE.Vector3();
      this.camera.getWorldDirection(worldDirection);

      const dx = sin * right + fwd * worldDirection.x;
      const dy = -cos * right + fwd * worldDirection.y;
      // console.log(`dx = ${dx}, dy = ${dy}`);
      this.cameraLookAt.x += dx;
      this.cameraLookAt.y += dy;
      this.updatePosition();
    } else if (state.isLeftMouseDown) {
      this.cameraAzimuth_rad -= DEG2RAD * degPerPixel * state.delta.x;
      this.cameraElevation_rad += DEG2RAD * degPerPixel * state.delta.y;

      this.cameraElevation_rad = Math.max(
        Math.min(this.cameraElevation_rad, Math.PI / 2),
        0
      );
      this.updatePosition();
    } else {
      console.log(
        "Left",
        state.isLeftMouseDown,
        "Right",
        state.isRightMouseDown,
        "Ctrl",
        state.isCtrl
      );
    }
  }

  onWheel(event) {
    this.cameraRadius -= 0.01 * event.wheelDelta;
    this.cameraRadius = Math.max(2, this.cameraRadius);
    this.updatePosition();
  }

  onContextMenu(event) {
    // nothing
  }
}
