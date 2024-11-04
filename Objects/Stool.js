import * as THREE from 'three';
import { Shadows } from '../Aux/Shadows.js';
import { SceneObject } from './SceneObject.js';

class Stool extends SceneObject {

  static seatMaterial = new THREE.MeshPhongMaterial({
    color: "#262626",
    specular: "#555555",
    shininess: 30,
  });

  static legMaterial = new THREE.MeshPhongMaterial({
    color: "#3d3d3d",
    specular: "#555555",
    shininess: 30,
  });

  /**
   * Constructor for the Stool subclass of SceneObject
   * @param {app} app - app reference
   * @param {string} name - Stool name
   * @param {number} x - Initial x coordinate
   * @param {number} y - Initial y coordinate
   * @param {number} z - Initial z coordinate 
   * @param {number} seatRadius - Radius of the seat's circunference
   * @param {number} seatThickness - Thickness of the seat
   * @param {number} legHeight - Height of the legs
   * @param {number} legRadius - Radius of the legs
   */
  constructor({ 
    app, 
    name, 
    x = 0, 
    y = 0, 
    z = 0, 
    seatRadius = 0.6, 
    seatThickness = 0.1, 
    legHeight = 2, 
    legRadius = 0.05, 
  }) {
    super(app, name, x, y, z);

    this.seatRadius = seatRadius;
    this.seatThickness = seatThickness;
    this.legHeight = legHeight;
    this.legRadius = legRadius;

    this.initMaterials();
  }

  /**
   * Stool's implementation of initMaterials()
   */
  initMaterials() {
    this.seatMaterial = Stool.seatMaterial;
    this.legMaterial = Stool.legMaterial;
  }

  /**
   * Stool's implementation of build()
   */
  build() {
    this.buildSeat();
    this.buildLegs();
  }

  /**
   * Builds the seat of the stool
   */
  buildSeat() {
    const seatGeometry = new THREE.CylinderGeometry(this.seatRadius, this.seatRadius, this.seatThickness, 32);
    const seatMesh = new THREE.Mesh(seatGeometry, this.seatMaterial);
    seatMesh.position.set(0, this.legHeight + this.seatThickness / 2, 0);
    Shadows.enableCastShadows(seatMesh);
    this.sceneObject.add(seatMesh);
  }

  /**
   * Builds the legs of the stool
   */
  buildLegs() {
    const pipePoints1 = [
      new THREE.Vector3(-this.seatRadius, 0, 0),
      new THREE.Vector3(-this.seatRadius / 1.7, this.legHeight - this.legRadius, 0),
      new THREE.Vector3(0, this.legHeight, 0),
      new THREE.Vector3(this.seatRadius  / 1.7, this.legHeight - this.legRadius, 0),
      new THREE.Vector3(this.seatRadius, 0, 0),
    ];

    const pipePoints2 = [
      new THREE.Vector3(0, 0, -this.seatRadius),
      new THREE.Vector3(0, this.legHeight - this.legRadius, -this.seatRadius  / 1.7),
      new THREE.Vector3(0, this.legHeight, 0),
      new THREE.Vector3(0, this.legHeight - this.legRadius, this.seatRadius  / 1.7),
      new THREE.Vector3(0, 0, this.seatRadius),
    ];
    const pipeRadius = this.legRadius;
    const pipeSegments = 32;
    const pipePositionY = 0;

    const pipeCurve1 = new THREE.CatmullRomCurve3(pipePoints1);
    const pipeCurve2 = new THREE.CatmullRomCurve3(pipePoints2);

    const pipeGeometry1 = new THREE.TubeGeometry(pipeCurve1, pipeSegments, pipeRadius, 8, false);
    const pipe1 = new THREE.Mesh(pipeGeometry1, this.legMaterial);
    Shadows.enableCastShadows(pipe1);
    pipe1.position.set(0, pipePositionY, 0);
    this.sceneObject.add(pipe1);

    const pipeGeometry2 = new THREE.TubeGeometry(pipeCurve2, pipeSegments, pipeRadius, 8, false);
    const pipe2 = new THREE.Mesh(pipeGeometry2, this.legMaterial);
    Shadows.enableCastShadows(pipe2);
    pipe2.position.set(0, pipePositionY, 0);
    this.sceneObject.add(pipe2);
  }

}

export { Stool };
