import * as THREE from "three";

// const grassMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

const simpleBox = new THREE.BoxGeometry(1.0, 1.0, 1.0);

// console.log(buildingMaterial, buildingMaterial.copy())

const assets = {
  grass: (x, y, data) => {
    // Grass geometry
    const grassMaterial = new THREE.MeshLambertMaterial({
      color: 0x00aa00,
    });
    const mesh = new THREE.Mesh(simpleBox, grassMaterial);
    mesh.userData = { id: "grass", x, y };
    mesh.position.set(x, y, -0.5);
    return mesh;
  },
  residential: (x, y, data) => {
    const buildingMaterial = new THREE.MeshLambertMaterial({
      color: 0xee7777,
    });
    const mesh = new THREE.Mesh(simpleBox, buildingMaterial);
    mesh.userData = { id: "residential", x, y };
    mesh.scale.set(1, 1, data.height);
    mesh.position.set(x, y, data.height/2);
    return mesh;
  },
  commercial: (x, y, data) => {
    const buildingMaterial = new THREE.MeshLambertMaterial({
      color: 0x77ee77,
    });
    const mesh = new THREE.Mesh(simpleBox, buildingMaterial);
    mesh.userData = { id: "commercial", x, y };
    mesh.scale.set(1, 1, data.height);
    mesh.position.set(x, y, data.height/2);
    return mesh;
  },
  industrial: (x, y, data) => {
    const buildingMaterial = new THREE.MeshLambertMaterial({
      color: 0x7777ee,
    });
    const mesh = new THREE.Mesh(simpleBox, buildingMaterial);
    mesh.userData = { id: "industrial", x, y };
    mesh.scale.set(1, 1, data.height);
    mesh.position.set(x, y, data.height/2);
    return mesh;
  },
  road: (x, y, data) => {
    const buildingMaterial = new THREE.MeshLambertMaterial({
      color: 0x222222,
    });
    const mesh = new THREE.Mesh(simpleBox, buildingMaterial);
    mesh.userData = { id: "road", x, y };
    mesh.scale.set(1, 1, data.height);
    mesh.position.set(x, y, data.height/2);
    return mesh;
  },
};

export function createAssetInstance(assetId, x, y, data) {
  if (assetId in assets) {
    return assets[assetId](x, y, data);
  } else {
    console.warn(`Asset id ${assetId} is not found.`);
    return undefined;
  }
}
