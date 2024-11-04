import * as THREE from 'three';
import { Shadows } from '../Aux/Shadows.js';
import { SceneObject } from './SceneObject.js';


class Floor extends SceneObject {

  static texture = Object.assign(new THREE.TextureLoader().load('../Textures/floor.jpg'), {
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
    repeat: new THREE.Vector2(2, 2)
  });

  static bumpMap = Object.assign(new THREE.TextureLoader().load('../Textures/floor_bump.jpg'), {
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
    repeat: new THREE.Vector2(2, 2)
  });

  static material = new THREE.MeshPhongMaterial({
    color: "#ffffff",
    specular: "#555555",
    emissive: "#000000",
    shininess: 60,
    map: Floor.texture,
    bumpMap: Floor.bumpMap,
    bumpScale: 0.1,
  });

  /**
   * Constructor for the Floor subclass of SceneObject 
   * @param { app } app - app reference
   * @param { string } name - Floor name
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

  }

  /**
   * Floor's implementation of build()
   */
  build() {
    // Create a Plane Mesh with basic material
    const plane = new THREE.PlaneGeometry(this.width, this.length);
    const planeMesh = new THREE.Mesh(plane, Floor.material);
    Shadows.enableReceiveShadows(planeMesh);
    this.sceneObject.add(planeMesh);
  }

}

export { Floor };
