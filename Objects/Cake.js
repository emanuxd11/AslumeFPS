import * as THREE from 'three';
import { Shadows } from '../Aux/Shadows.js';
import { SceneObject } from './SceneObject.js';


class Cake extends SceneObject {

  /**
   * Constructor for the Cake subclass of SceneObject 
   * @param { app } - app reference
   * @param { string } name - Cake name
   * @param { number } x - Initial x coordinate
   * @param { number } y - Initial y coordinate
   * @param { number } z - Initial z coordinate 
   */
  constructor(app, name, x = 0, y = 0, z = 0, rotation, radius = 0.5, height = 0.25, thetaLength = Math.PI * 1.8) {
    super(app, name, x, y, z, rotation);

    this.radius = radius;
    this.height = height;
    this.thetaLength = thetaLength;

    this.initMaterials();
  }

  /**
   * Cake's implementation of initMaterials()
   */
  initMaterials() {
    const loader = new THREE.TextureLoader();
    this.texture = loader.load('../Textures/cake.jpg');
    this.material = new THREE.MeshPhongMaterial({ color: '#8B4513' });
    this.material.map = this.texture;
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.repeat.set(5, 5);
  }
  
  /**
   * Cake's build() method implementation
   */
  build() {
    const geometry = new THREE.CylinderGeometry(this.radius, this.radius, 0.25, 32, 1, false, 0, this.thetaLength);
    const cakeMesh = new THREE.Mesh(geometry, this.material);
    Shadows.enableShadows(cakeMesh);
    this.sceneObject.add(cakeMesh);

    const planeGeometry = new THREE.PlaneGeometry(this.radius, this.height);

    const planeMesh1 = new THREE.Mesh(planeGeometry, this.material);
    const planeMesh2 = new THREE.Mesh(planeGeometry, this.material);

    Shadows.enableShadows(planeMesh1);
    Shadows.enableShadows(planeMesh2);

    this.sceneObject.add(planeMesh1);
    this.sceneObject.add(planeMesh2);

    const planeAngle = 2 * Math.PI - this.thetaLength;
    
    planeMesh1.rotateY(-Math.PI / 2);
    planeMesh1.position.set(0, 0, this.radius / 2);

    planeMesh2.rotateY(Math.PI / 2 - planeAngle);
    planeMesh2.position.set(
      -Math.cos(Math.PI / 2 - planeAngle) * this.radius / 2, 
      0, 
      Math.sin(Math.PI / 2 - planeAngle) * this.radius / 2
    );
  }

}

export { Cake };
