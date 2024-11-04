import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';


class Ceiling extends SceneObject {

  /**
   * Constructor for the Ceiling subclass of SceneObject 
   * @param { app } app - app reference
   * @param { string } name - ceiling name
   * @param { number } x - Initial x coordinate
   * @param { number } y - Initial y coordinate
   * @param { number } z - Initial z coordinate 
   * @param { number } rotation - Initial rotation
   */
  constructor(app, name, x = 0, y = 0, z = 0, width = 10, length = 10, rotation = 0) {

    super(app, name, x, y, z);

    this.rotate(new THREE.Vector3(1, 0, 0), -Math.PI/2);

    this.width = width;
    this.length = length;

    const loader = new THREE.TextureLoader();
    this.texture = loader.load('../Textures/floor.jpg');
    this.bumpMap = loader.load('../Textures/floor_bump.jpg');
    this.material = new THREE.MeshPhongMaterial({
      color: "#ffffff",
      specular: "#555555",
      emissive: "#000000",
      shininess: 60,
      map: this.texture,
      bumpMap: this.bumpMap,
      bumpScale: 0.02,
    });
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.repeat.set(2, 2);
    this.bumpMap.wrapS = THREE.RepeatWrapping;
    this.bumpMap.wrapT = THREE.RepeatWrapping;
    this.bumpMap.repeat.set(2, 2);
  }

  /**
   * Ceiling's implementation of build()
   */
  build() {
    const plane = new THREE.PlaneGeometry(this.width, -this.length);
    const planeMesh = new THREE.Mesh(plane, this.material);
    this.sceneObject.add(planeMesh);
  }

}

export { Ceiling };
