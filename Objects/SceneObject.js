import * as THREE from "three";


class SceneObject {

  /**
   * Constructor of SceneObject base class
   * @method
   * @param { app } app - app reference
   * @param { string } name - Object name
   * @param { number } x - Initial x coordinate
   * @param { number } y - Initial y coordinate
   * @param { number } z - Initial z coordinate
   * @param { number } rotation - Initial rotation of the object
   */
  constructor(app, name, x = 0, y = 0, z = 0, rotation = 0) {
    this.sceneObject = new THREE.Group();
    this.name = name;

    this.subObjects = [];

    this.translate(x, y, z);
    this.rotate(new THREE.Vector3(0, 1, 0), rotation);

    this.app = app;
    this.app.scene.add(this.sceneObject);
  }

  /**
   * Translate object
   * @method
   * @param { number } x - New position x coordinate
   * @param { number } y - New position y coordinate
   * @param { number } z - New position z coordinate
   */
  translate(x, y, z) {
    this.sceneObject.translateX(x);
    this.sceneObject.translateY(y);
    this.sceneObject.translateZ(z);

    this.subObjects.forEach((obj) => {
      // obj.sceneObject.translateX(x);
      // obj.sceneObject.translateY(y);
      // obj.sceneObject.translateZ(z);
      obj.translate(x, y, z);
    });
  }

  /**
   * Rotate object
   * @method
   * @param { THREE.Vector3 } axis - New scale on the x axis
   * @param { number } angle - New scale on the y axis
   */
  rotate(axis = new THREE.Vector3(0, 1, 0), angle) {
    this.sceneObject.rotateOnAxis(axis, angle);

    this.subObjects.forEach((obj) => {
      obj.rotate(axis, angle);   //////// this might need some adjustments lol
    });
  }

  /**
   * Scale object
   * @method
   * @param { number } x - New scale on the x axis
   * @param { number } y - New scale on the y axis
   * @param { number } z - New scale on the z axis
   */
  scale(x, y, z) {
    this.sceneObject.scale.set(x, y, z);

    this.subObjects.forEach((obj) => {
      obj.scale(obj.sceneObject.scale.x * x, obj.sceneObject.scale.y * y, obj.sceneObject.scale.z * z);
    });
  }

  /**
   * Add object to sub object list for association 
   * @param { SceneObject } object - object to be added
   */
  addSubObject(object) {
    this.subObjects.push(object);
  }

  /**
   * Template for initMaterials() method to be implemented by subclasses
   */
  initMaterials() {}

  /**
   * Template for build() method to be implemented by subclasses
   */
  build() {}

}

export { SceneObject };
