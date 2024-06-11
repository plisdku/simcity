import * as THREE from "three";

// const grassMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

const simpleBox = new THREE.BoxGeometry(1.0, 1.0, 1.0);

// console.log(buildingMaterial, buildingMaterial.copy())

const assets = {
  grass: (x, y) => {
    // Grass geometry
    const grassMaterial = new THREE.MeshLambertMaterial({
      color: 0x00aa00,
    });
    const mesh = new THREE.Mesh(simpleBox, grassMaterial);
    mesh.userData = { id: "grass", x, y };
    mesh.position.set(x, y, 0.5);
    return mesh;
  },
  residential: (x, y) => {
    const buildingMaterial = new THREE.MeshLambertMaterial({
      color: 0xee7777,
    });
    const mesh = new THREE.Mesh(simpleBox, buildingMaterial);
    mesh.userData = { id: "residential", x, y };
    mesh.scale.set(1, 1, 1);
    mesh.position.set(x, y, 1.5);
    return mesh;
  },
  commercial: (x, y) => {
    const buildingMaterial = new THREE.MeshLambertMaterial({
      color: 0x77ee77,
    });
    const mesh = new THREE.Mesh(simpleBox, buildingMaterial);
    mesh.userData = { id: "commercial", x, y };
    mesh.scale.set(1, 1, 2);
    mesh.position.set(x, y, 2);
    return mesh;
  },
  industrial: (x, y) => {
    const buildingMaterial = new THREE.MeshLambertMaterial({
      color: 0x7777ee,
    });
    const mesh = new THREE.Mesh(simpleBox, buildingMaterial);
    mesh.userData = { id: "industrial", x, y };
    mesh.scale.set(1, 1, 3);
    mesh.position.set(x, y, 2.5);
    return mesh;
  },
  road: (x, y) => {
    const buildingMaterial = new THREE.MeshLambertMaterial({
      color: 0x222222,
    });
    const mesh = new THREE.Mesh(simpleBox, buildingMaterial);
    mesh.userData = { id: "road", x, y };
    mesh.scale.set(1, 1, 0.1);
    mesh.position.set(x, y, 1.05);
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
