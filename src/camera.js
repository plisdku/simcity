import * as THREE from "three";

const DEG2RAD = Math.PI / 180.0;
const RAD2DEG = 1 / DEG2RAD;

export function createCamera(gameWindow) {
  const camera = new THREE.PerspectiveCamera(
    75,
    gameWindow.offsetWidth / gameWindow.offsetHeight,
    0.1,
    1000
  );

  let cameraRadius = 10;
  let cameraAzimuth_rad = 0;
  let cameraElevation_rad = 0;
  // Math.PI / 10;
  function updatePosition() {
    camera.position.x =
      cameraRadius *
      Math.cos(cameraAzimuth_rad) *
      Math.cos(cameraElevation_rad);
    camera.position.y =
      cameraRadius *
      Math.sin(cameraAzimuth_rad) *
      Math.cos(cameraElevation_rad);
    camera.position.z = cameraRadius * Math.sin(cameraElevation_rad);

    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);
    camera.updateMatrix();

    // camera.rotation.set();
    // console.log("Azimuth:", RAD2DEG * cameraAzimuth_rad);
    // console.log("Elevation:", RAD2DEG * cameraElevation_rad);
    // console.log("Cam pos", camera.position);
  }

  updatePosition();

  let isMouseDown = false;
  let prevMousePosition = null; //new THREE.Vector2(0, 0);

  function onMouseDown(event) {
    // console.log(event);

    isMouseDown = true;
  }

  function onMouseUp(event) {
    // console.log(event);

    isMouseDown = false;
  }

  function onMouseMove(event) {
    const curMousePosition = new THREE.Vector2(event.clientX, event.clientY);

    if (prevMousePosition === null) {
    } else {
      const delta = curMousePosition.clone().sub(prevMousePosition);

      if (isMouseDown) {
        cameraAzimuth_rad -= 0.001 * delta.x;
        cameraElevation_rad += 0.001 * delta.y;

        cameraElevation_rad = Math.max(
          Math.min(cameraElevation_rad, Math.PI / 2),
          0
        );
        updatePosition();
      }
    }
    prevMousePosition = curMousePosition;
  }

  return {
    camera,
    onMouseDown,
    onMouseUp,
    onMouseMove,
  };
}
