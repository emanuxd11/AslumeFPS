import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';
import { Shadows } from '../Aux/Shadows.js';


class Painting extends SceneObject {

  /**
   * Constructor for the Painting subclass of SceneObject 
   * @param { app } app - app reference
   * @param { string } name - Painting name
   * @param { number } x - Initial x coordinate
   * @param { number } y - Initial y coordinate
   * @param { number } z - Initial z coordinate 
   */
  constructor(app, name, x = 0, y = 0, z = 0, rotation = 0, innerWidth = 2, innerHeight = 1, frameWidth = 0.1, frameThickness = 0.05, image = './Textures/placeholder.jpg') {
    super(app, name, x, y, z, rotation);

    this.innerWidth = innerWidth;
    this.innerHeight = innerHeight;
    this.frameWidth = frameWidth;
    this.frameThickness = frameThickness;
    this.image = image;

    this.initMaterials();
  }

  /**
   * Painting's implementation of initMaterials()
   */
  initMaterials() {
    const loader = new THREE.TextureLoader();

    this.innerTexture = loader.load(this.image);
    this.innerMaterial = new THREE.MeshPhongMaterial({
      color: "#ffffff",
      specular: "#222222",
      emissive: "#000000",
      shininess: 1,
    });
    this.innerMaterial.map = this.innerTexture;
    this.innerTexture.wrapS = THREE.RepeatWrapping;
    this.innerTexture.wrapT = THREE.RepeatWrapping;
    this.innerTexture.repeat.set(1, 1);

    this.frameTexture = loader.load('./Textures/wood_frame.jpg');

    this.frameMaterial = new THREE.MeshPhongMaterial({
      color: "#8b4513",
      specular: "#222222",
      emissive: "#000000",
      shininess: 30,
      map: this.frameTexture,
      bumpScale: 0.05,
    });
    this.frameTexture.wrapS = THREE.RepeatWrapping;
    this.frameTexture.wrapT = THREE.RepeatWrapping;
    this.frameTexture.repeat.set(1, 1);
  }

  /**
   * Painting's implementation of build()
   */
  build() {
    this.buildFrame();
    this.buildCanvas();
  }

  /**
   * Builds the frame around the painting
   */
  buildFrame() {
    const horizontalFrameGeometry = new THREE.BoxGeometry(this.innerWidth, this.frameWidth, this.frameThickness);
    const verticalFrameGeometry = new THREE.BoxGeometry(this.innerHeight + this.frameWidth * 2, this.frameWidth, this.frameThickness);

    const topMesh = new THREE.Mesh(horizontalFrameGeometry, this.frameMaterial);
    topMesh.position.set(0, this.innerHeight / 2 + this.frameWidth / 2, this.frameThickness / 2 + 0.0011);
    Shadows.enableShadows(topMesh);
    this.sceneObject.add(topMesh);

    const bottomMesh = new THREE.Mesh(horizontalFrameGeometry, this.frameMaterial);
    bottomMesh.position.set(0, -this.innerHeight / 2 - this.frameWidth / 2, this.frameThickness / 2 + 0.0011);
    Shadows.enableShadows(bottomMesh);
    this.sceneObject.add(bottomMesh);

    const leftMesh = new THREE.Mesh(verticalFrameGeometry, this.frameMaterial);
    leftMesh.position.set(-this.innerWidth / 2 - this.frameWidth / 2, 0, this.frameThickness / 2 + 0.0011);
    leftMesh.rotateZ(Math.PI / 2);
    Shadows.enableShadows(leftMesh);
    this.sceneObject.add(leftMesh);

    const rightMesh = new THREE.Mesh(verticalFrameGeometry, this.frameMaterial);
    rightMesh.position.set(this.innerWidth / 2 + this.frameWidth / 2, 0, this.frameThickness / 2 + 0.0011);
    rightMesh.rotateZ(Math.PI / 2);
    Shadows.enableShadows(rightMesh);
    this.sceneObject.add(rightMesh);
  }

  /**
   * Builds the inner canvas
   */
  buildCanvas() {
    const canvasGeometry = new THREE.PlaneGeometry(this.innerWidth, this.innerHeight);
    const canvasMesh = new THREE.Mesh(canvasGeometry, this.innerMaterial);
    canvasMesh.position.set(0, 0, 0.001);
    Shadows.enableShadows(canvasMesh);
    this.sceneObject.add(canvasMesh);
  }

}

export { Painting };
