import * as THREE from 'three';
import { Shadows } from '../Aux/Shadows.js';
import { SceneObject } from './SceneObject.js';


class Wall extends SceneObject {

  static texture = Object.assign(new THREE.TextureLoader().load('../Textures/wall.jpg'), {
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
    repeat: new THREE.Vector2(1, 1)
  });

  static bumpTexture = Object.assign(new THREE.TextureLoader().load('../Textures/wall_bump.jpg'), {
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.RepeatWrapping,
    repeat: new THREE.Vector2(1, 1)
  });

  static material = new THREE.MeshPhongMaterial({
    color: "#ffffff",
    specular: "#000000",
    emissive: "#000000",
    shininess: 0,
    map: Wall.texture,
    bumpMap: Wall.bumpTexture,
    bumpScale: 0.05,
  });

  /**
   * Constructor for the Wall subclass of SceneObject 
   * @param { app } app - app reference
   * @param { string } name - Wall name
   * @param { number } x - Initial x coordinate
   * @param { number } y - Initial y coordinate
   * @param { number } z - Initial z coordinate 
   * @param { number } rotation - Initial rotation
   */
  constructor(app, name, x = 0, y = 0, z = 0, width = 10, height = 10, rotation = 0) {
    super(app, name, x, y, z, rotation);

    this.width = width;
    this.height = height;
    this.collisionBox = null;

    this.initMaterials();
  }

  /**
   * Wall's build() method implementation
   */
  build() {
    const plane = new THREE.PlaneGeometry(this.width, this.height);
    const planeMesh = new THREE.Mesh(plane, Wall.material);
    Shadows.enableShadows(planeMesh);
    this.sceneObject.add(planeMesh);

    // Create bounding box for the entire group
    this.collisionBox = new THREE.Box3().setFromObject(planeMesh);

    const boxHelper = new THREE.BoxHelper(planeMesh, 0xff0000);
    this.sceneObject.add(boxHelper);
    this.app.addCollisionBox(this.collisionBox);
  }

}

export { Wall };
