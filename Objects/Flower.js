import * as THREE from 'three';
import { Shadows } from '../Aux/Shadows.js';
import { SceneObject } from './SceneObject.js';


class Flower extends SceneObject {
  constructor(app, name, x = 0, y = 0, z = 0) {
    super(app, name, x, y, z);

    this.initMaterials();
    this.build();
  }

  initMaterials() {
    this.stemMaterial = new THREE.MeshPhongMaterial({ color: 0x228B22 }); // Green for the stem
    this.petalMaterial = new THREE.MeshPhongMaterial({ color: 0xff69b4 }); // Pink for petals
    this.centerMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 }); // Yellow for the center
  }

  build() {
    this.buildStem();
    this.buildFlowerHead();
  }

  buildStem() {
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0, 0.3, 0),
      new THREE.Vector3(-0, 0.8, 0.1),
      new THREE.Vector3(-0, 1.0, 0.3),
    ]);

    const stemGeometry = new THREE.TubeGeometry(stemCurve, 20, 0.02, 8, false);
    const stem = new THREE.Mesh(stemGeometry, this.stemMaterial);
    Shadows.enableCastShadows(stem);
    this.sceneObject.add(stem);
  }

  buildFlowerHead() {
    const flowerHead = new THREE.Group();
    const centerGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const center = new THREE.Mesh(centerGeometry, this.centerMaterial);
    Shadows.enableCastShadows(center);
    center.position.set(-0, 1, 0.3);
    flowerHead.add(center);

    const petalGeometry = new THREE.CylinderGeometry(0.1, 0.05, 0.5, 8);
    for (let i = 0; i < 6; i++) {
      const petal = new THREE.Mesh(petalGeometry, this.petalMaterial);
      Shadows.enableCastShadows(petal);
      petal.rotation.z = Math.PI / 6 * i;
      petal.position.set(-0, 1, 0.3);
      flowerHead.add(petal);
    }

    this.sceneObject.add(flowerHead);
  }
}

export { Flower };
