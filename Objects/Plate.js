import * as THREE from 'three';
import { Shadows } from '../Aux/Shadows.js';
import { SceneObject } from './SceneObject.js';


class Plate extends SceneObject {

  /**
   * Constructor for the Plate subclass of SceneObject 
   * @param { app } app - app reference
   * @param { string } name - Plate name
   * @param { number } x - Initial x coordinate
   * @param { number } y - Initial y coordinate
   * @param { number } z - Initial z coordinate 
   */
  constructor(app, name, x = 0, y = 0, z = 0, radius = 0.8, thickness = 0.05) {
    super(app, name, x, y, z);

    this.radiusTop = radius;
    this.radiusBottom = radius / 1.5;
    this.thickness = thickness;

    this.initMaterials();
  }

  /**
   * Plate's implementation of initMaterials()
   */
  initMaterials() {
    this.material = new THREE.MeshStandardMaterial({
      color: '#FAF9F6',
      roughness: 0.5,
      metalness: 0.0,
      side: THREE.DoubleSide
    });
  }

  /**
   * Plate's implementation of build()
   */
  build() {
    const geometry = new THREE.CylinderGeometry(this.radiusTop, this.radiusBottom, this.thickness, 64);
    const plateMesh = new THREE.Mesh(geometry, this.material);
    Shadows.enableShadows(plateMesh);
    
    this.sceneObject.add(plateMesh);
  }

}

export { Plate };
