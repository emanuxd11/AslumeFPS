import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';


class Candle extends SceneObject {

  /**
   * Constructor for the Candle subclass of SceneObject
   * @param { app } app - app reference
   * @param { string } name - Candle name
   * @param { number } x - Initial x coordinate
   * @param { number } y - Initial y coordinate
   * @param { number } z - Initial z coordinate
   */
  constructor(app, name, x = 0, y = 0, z = 0, waxHeight = 0.15, waxRadius = 0.02, wickHeight = NaN, wickRadius = NaN) {
    super(app, name, x, y, z);

    this.waxHeight = waxHeight;
    this.waxRadius = waxRadius;
    this.wickHeight = wickHeight || this.waxHeight * 0.1;
    this.wickRadius = wickRadius || this.waxRadius * 0.05;
    this.height = this.waxHeight + this.wickHeight;

    this.initMaterials();
    this.initLight();
  }

  /**
   * Candle's initMaterials() implementation
   */
  initMaterials() {
    this.waxMaterial = new THREE.MeshPhongMaterial({ color: '#FFFF99' });
    this.wickMaterial = new THREE.MeshPhongMaterial({ color: '#000000' });
  }

  /**
   * Initialize a light source for the flame
   */
  initLight() {
    this.light = new THREE.PointLight('#FFA500', 1, 0.5); // soft orange glow
    this.light.position.set(0, this.flameHeight, 0);
    this.sceneObject.add(this.light);
  }

  /**
   * Build lower part of the candle (stick built out of wax...)
   */
  buildWax() {
    const geometry = new THREE.CylinderGeometry(this.waxRadius * 0.95, this.waxRadius, this.waxHeight, 16); 
    const waxMesh = new THREE.Mesh(geometry, this.waxMaterial);
    this.sceneObject.add(waxMesh);
  }

  /**
   * Build wick (thread that burns)
   */
  buildWick() {
    const geometry = new THREE.CylinderGeometry(this.wickRadius, this.wickRadius, this.wickHeight, 16); 
    const wickMesh = new THREE.Mesh(geometry, this.wickMaterial);
    wickMesh.position.set(0, this.waxHeight / 2 + this.wickHeight / 2, 0);
    this.sceneObject.add(wickMesh);
  }

  /**
   * Candle's build() implementation
   */
  build() {
    this.buildWax();
    this.buildWick();
  }

}

export { Candle };
