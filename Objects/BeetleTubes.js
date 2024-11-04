import * as THREE from 'three';
import { Shadows } from '../Aux/Shadows.js';
import { SceneObject } from './SceneObject.js';


class BeetleTubes extends SceneObject {

  /**
   * Constructor for the BeetleTubes subclass of SceneObject 
   * @param { app } - app reference
   * @param { string } name - BeetleTubes name
   * @param { number } x - Initial x coordinate
   * @param { number } y - Initial y coordinate
   * @param { number } z - Initial z coordinate 
   */
  constructor(app, name, x = 0, y = 0, z = 0, rotation = 0, radius = 0.05) {
    super(app, name, x, y, z, rotation);

    this.radius = radius;
    this.totalLength = 16/3;
    this.totalHeight = 8/3;

    this.initMaterials();
  }

  /**
   * BeetleTubes's implementation of initMaterials()
   */
  initMaterials() {
    this.material = new THREE.MeshPhongMaterial({ color: '#404040' });
  }

  /**
   * BeetleTubes's build() method implementation
   */
  build() {
    const xOffset = -8/3 + 1; // center the beetle geometry
    const yOffset = -8/6; // center the beetle geometry along the y axis too

    // rear wheel
    this.buildCircunferencePath(this.radius, 1, 0, Math.PI, 1, xOffset, yOffset, 0);

    // front wheel
    this.buildCircunferencePath(this.radius, 1, 0, Math.PI, 1, 3 + 1/3 + xOffset, yOffset, 0);

    // rear section
    this.buildCircunferencePath(this.radius, 8/3, Math.PI, Math.PI / 2, -1, 8/3 - 1 + xOffset, yOffset, 0);

    // hood
    this.buildCircunferencePath(this.radius, 1 + 1/3, 0, Math.PI / 2, 1, 3 + xOffset, yOffset, 0);

    // windshield
    this.buildCircunferencePath(this.radius, 1 + 1/3, 0, Math.PI / 2, 1, 1 + 2/3 + xOffset, 1 + 1/3 + yOffset, 0);
  }

  /**
   * Builds a circunference path starting at startAngle and ending at endAngle
   * @param { number } tubeRadius - radius of the TubeGeometry
   * @param { number } circRadius - radius of the circunference
   * @param { number } startAngle - starting angle of the circunference
   * @param { number } endAngle - ending angle of the circunference
   * @param { number } orientation - 1 for counter clockwise, -1 for clockwise
   * @param { number } x - x coordinate of the circunference's center
   * @param { number } y - y coordinate of the circunference's center
   * @param { number } z - z coordinate of the circunference's center
   */
  buildCircunferencePath(tubeRadius, pathRadius, startAngle, endAngle, orientation = 1, x = 0, y = 0, z = 0, shadows = true) {
    
    const points = [];
    const segments = 50;

    for (let i = 0; i <= segments; i++) {
      const angle = startAngle + (endAngle * i * orientation) / segments;
      const x = Math.cos(angle) * pathRadius;
      const y = Math.sin(angle) * pathRadius;
      const z = 0;
      points.push(new THREE.Vector3(x, y, z));
    }

    const path = new THREE.CatmullRomCurve3(points);
    const tubeGeometry = new THREE.TubeGeometry(path, segments, tubeRadius, 8, false);
    const tube = new THREE.Mesh(tubeGeometry, this.material);
    tube.position.set(x, y, z);

    if (shadows) {
      Shadows.enableShadows(tube);
    }
    
    this.sceneObject.add(tube);
  }

}

export { BeetleTubes };
