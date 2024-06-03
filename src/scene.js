import * as THREE from "three";
import { update } from "three/examples/jsm/libs/tween.module.js";

const DEG2RAD = Math.PI / 180.0;
const RAD2DEG = 1 / DEG2RAD;

export function createScene() {
  const gameWindow = document.getElementById("render-target");
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x777777);

  console.log("Created scene! Game window:", gameWindow);

  const camera = new THREE.PerspectiveCamera(
    75,
    gameWindow.offsetWidth / gameWindow.offsetHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 10);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight);
  gameWindow.appendChild(renderer.domElement); // the domElement is a canvas element

  const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const simpleBox = new THREE.BoxGeometry(1.0, 1.0, 1.0);

  const floor = new THREE.BoxGeometry(10, 10, 0.1);
  const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x223322 });
  const floorMesh = new THREE.Mesh(floor, floorMaterial);

  const mesh = new THREE.Mesh(simpleBox, boxMaterial);

  scene.add(mesh, floorMesh);

  let rotAngle = 0;
  function draw() {
    // console.log("Draw!");
    renderer.render(scene, camera);

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

  let isMouseDown = false;
  let cameraRadius = 10;
  let cameraAzimuth_rad = 0;
  let cameraElevation_rad = 0;
  // Math.PI / 10;

  function updateCameraPosition() {
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

    console.log("Azimuth:", RAD2DEG * cameraAzimuth_rad);
    console.log("Elevation:", RAD2DEG * cameraElevation_rad);
    console.log("Cam pos", camera.position);
  }
  updateCameraPosition();

  let prevMousePosition = null; //new THREE.Vector2(0, 0);

  function onMouseDown(event) {
    console.log(event);

    isMouseDown = true;
  }

  function onMouseUp(event) {
    console.log(event);

    isMouseDown = false;
  }

  function onMouseMove(event) {
    // console.log("Previmouse:", prevMousePosition);
    const curMousePosition = new THREE.Vector2(event.clientX, event.clientY);
    // console.log("Cur:", curMousePosition, "prev", prevMousePosition);
    if (prevMousePosition === null) {
    } else {
      const delta = curMousePosition.clone().sub(prevMousePosition);
      // console.log(delta);

      if (isMouseDown) {
        cameraAzimuth_rad -= 1e-3 * delta.x;
        cameraElevation_rad += 1e-3 * delta.y;

        cameraElevation_rad = Math.max(
          Math.min(cameraElevation_rad, Math.PI / 2),
          0
        );
        updateCameraPosition();
      }
    }
    prevMousePosition = curMousePosition;
    // console.log("New prev:", prevMousePosition);
  }

  return {
    start,
    stop,
    onMouseDown,
    onMouseUp,
    onMouseMove,
  };
}
