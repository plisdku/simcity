import * as THREE from "three";
import { transformedBitangentWorld } from "three/examples/jsm/nodes/Nodes.js";

const DEG2RAD = Math.PI / 180.0;
const RAD2DEG = 1 / DEG2RAD;

const INITIAL_AZIMUTH = 30 * DEG2RAD;
const INITIAL_ELEVATION = 30 * DEG2RAD;
const INITIAL_RADIUS = 25;

const LEFT_MOUSE_BUTTON = 0;
const RIGHT_MOUSE_BUTTON = 1;

export function createCamera(gameWindow) {
  const camera = new THREE.PerspectiveCamera(
    35,
    gameWindow.offsetWidth / gameWindow.offsetHeight,
    0.1,
    1000
  );

  let cameraRadius = INITIAL_RADIUS;
  let cameraAzimuth_rad = INITIAL_AZIMUTH;
  let cameraElevation_rad = INITIAL_ELEVATION;
  let cameraLookAt = new THREE.Vector3(0, 0, 0);

  // Math.PI / 10;
  function updatePosition() {
    camera.position.x =
      cameraLookAt.x +
      cameraRadius *
        Math.cos(cameraAzimuth_rad) *
        Math.cos(cameraElevation_rad);
    camera.position.y =
      cameraLookAt.y +
      cameraRadius *
        Math.sin(cameraAzimuth_rad) *
        Math.cos(cameraElevation_rad);
    camera.position.z = cameraRadius * Math.sin(cameraElevation_rad);

    camera.up.set(0, 0, 1);
    camera.lookAt(cameraLookAt);
    camera.updateMatrix();

    // console.log("Look at", cameraLookAt);

    // camera.rotation.set();
    // console.log("Azimuth:", RAD2DEG * cameraAzimuth_rad);
    // console.log("Elevation:", RAD2DEG * cameraElevation_rad);
    // console.log("Cam pos", camera.position);
  }

  updatePosition();

  let isLeftMouseDown = false;
  let isRightMouseDown = false;
  let isMiddleMouseDown = false;
  let prevMousePosition = null; //new THREE.Vector2(0, 0);

  function onMouseDown(event) {
    // console.log(event);

    // console.log("DOWN button ", event.button);
    // console.log(event);

    if (event.button == RIGHT_MOUSE_BUTTON || event.ctrlKey) {
      isRightMouseDown = true;
    } else if (event.button == LEFT_MOUSE_BUTTON) {
      isLeftMouseDown = true;
    }
  }

  function onMouseUp(event) {
    // console.log(event);

    isLeftMouseDown = false;
    isRightMouseDown = false;
  }

  function onMouseMove(event) {
    const curMousePosition = new THREE.Vector2(event.clientX, event.clientY);

    if (prevMousePosition === null) {
    } else {
      const delta = curMousePosition.clone().sub(prevMousePosition);

      if (isLeftMouseDown) {
        cameraAzimuth_rad -= 0.001 * delta.x;
        cameraElevation_rad += 0.001 * delta.y;

        cameraElevation_rad = Math.max(
          Math.min(cameraElevation_rad, Math.PI / 2),
          0
        );
        updatePosition();
      } else if (isRightMouseDown) {
        const right = 3e-2 * delta.x;
        const fwd = 3e-2 * delta.y;

        console.log(`Delta ${delta.x}, ${delta.y}; Right ${right}, fwd ${fwd}`);

        const sin = Math.sin(cameraAzimuth_rad);
        const cos = Math.cos(cameraAzimuth_rad);

        console.log(`sin ${sin} cos ${cos}`);

        let wd = new THREE.Vector3();
        camera.getWorldDirection(wd);
        console.log(wd);

        const dx = sin * right + fwd * wd.x;
        const dy = -cos * right + fwd * wd.y;
        console.log(`dx = ${dx}, dy = ${dy}`);
        cameraLookAt.x += dx;
        cameraLookAt.y += dy;
        updatePosition();
      }
    }
    prevMousePosition = curMousePosition;
  }

  function onWheel(event) {
    cameraRadius -= 0.01 * event.wheelDelta;
    cameraRadius = Math.max(2, cameraRadius);
    updatePosition();
  }

  return {
    camera,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onWheel,
  };
}
