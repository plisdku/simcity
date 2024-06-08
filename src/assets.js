import * as THREE from "three";

// const grassMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

const buildingMaterial = new THREE.MeshLambertMaterial({
  color: 0x777777,
});

const grassMaterial = new THREE.MeshLambertMaterial({
  color: 0x00aa00,
});

const simpleBox = new THREE.BoxGeometry(1.0, 1.0, 1.0);

const assets = {
  grass: (x, y) => {
    // Grass geometry
    const mesh = new THREE.Mesh(simpleBox, grassMaterial);
    mesh.userData = { id: "grass" };
    mesh.position.set(x, y, 0.5);
    return mesh;
  },
  "building-1": (x, y) => {
    const mesh = new THREE.Mesh(simpleBox, buildingMaterial);
    mesh.userData = { id: "building-1" };
    mesh.scale.set(1, 1, 1);
    mesh.position.set(x, y, 1.5);
    return mesh;
  },
  "building-2": (x, y) => {
    const mesh = new THREE.Mesh(simpleBox, buildingMaterial);
    mesh.userData = { id: "building-2" };
    mesh.scale.set(1, 1, 2);
    mesh.position.set(x, y, 2);
    return mesh;
  },
  "building-3": (x, y) => {
    const mesh = new THREE.Mesh(simpleBox, buildingMaterial);
    mesh.userData = { id: "building-3" };
    mesh.scale.set(1, 1, 3);
    mesh.position.set(x, y, 2.5);
    return mesh;
  },
};

export function createAssetInstance(assetId, x, y) {
  if (assetId in assets) {
    return assets[assetId](x, y);
  } else {
    console.warn(`Asset id ${assetId} is not found.`);
    return undefined;
  }
}
