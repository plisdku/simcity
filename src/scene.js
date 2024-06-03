import * as THREE from "three";

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
  const mesh = new THREE.Mesh(simpleBox, boxMaterial);

  scene.add(mesh);

  let rotAngle = 0;
  function draw() {
    // console.log("Draw!");
    renderer.render(scene, camera);

    mesh.rotateZ(0.01);
    mesh.rotateX(0.001);
    mesh.rotation.y += 0.005;
  }

  function start() {
    renderer.setAnimationLoop(draw);
  }

  function stop() {
    renderer.setAnimationLoop(null);
  }

  return {
    start,
    stop,
  };
}
