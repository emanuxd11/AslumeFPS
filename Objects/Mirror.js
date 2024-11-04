import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { SceneObject } from './SceneObject.js';


class Mirror extends SceneObject {

  static decalMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('../Textures/am_i_stupid.png'),
    transparent: true,
  });

  static frameMaterial = new THREE.MeshPhongMaterial({
    color: "#333333",
    specular: "#222222",
    emissive: "#000000",
    shininess: 100,
    bumpScale: 0.05,
  });

  /**
   * Constructor for the Mirror subclass of SceneObject 
   * @param { app } app - app reference
   * @param { string } name - Mirror name
   * @param { number } x - Initial x coordinate
   * @param { number } y - Initial y coordinate
   * @param { number } z - Initial z coordinate 
   */
  constructor({ app, name, x = 0, y = 0, z = 0, rotation = 0, innerWidth = 2, innerHeight = 1, frameWidth = 0.1, frameThickness = 0.05 }) {
    super(app, name, x, y, z, rotation);

    this.innerWidth = innerWidth;
    this.innerHeight = innerHeight;
    this.frameWidth = frameWidth;
    this.frameThickness = frameThickness;

    this.initMaterials();
  }

  /**
   * Mirror's implementation of initMaterials()
   */
  initMaterials() {
    this.frameMaterial = Mirror.frameMaterial;
    this.decalMaterial = Mirror.decalMaterial;
  }

  /**
   * Mirror's implementation of build()
   */
  build() {
    this.buildFrame();
    this.buildMirror();
    this.addDecal();
  }

  /**
   * Builds the frame around the mirror
   */
  buildFrame() {
    const horizontalFrameGeometry = new THREE.BoxGeometry(this.innerWidth, this.frameWidth, this.frameThickness);
    const verticalFrameGeometry = new THREE.BoxGeometry(this.innerHeight + this.frameWidth * 2, this.frameWidth, this.frameThickness);

    const topMesh = new THREE.Mesh(horizontalFrameGeometry, this.frameMaterial);
    topMesh.position.set(0, this.innerHeight / 2 + this.frameWidth / 2, this.frameThickness / 2 + 0.0011);
    this.sceneObject.add(topMesh);

    const bottomMesh = new THREE.Mesh(horizontalFrameGeometry, this.frameMaterial);
    bottomMesh.position.set(0, -this.innerHeight / 2 - this.frameWidth / 2, this.frameThickness / 2 + 0.0011);
    this.sceneObject.add(bottomMesh);

    const leftMesh = new THREE.Mesh(verticalFrameGeometry, this.frameMaterial);
    leftMesh.position.set(-this.innerWidth / 2 - this.frameWidth / 2, 0, this.frameThickness / 2 + 0.0011);
    leftMesh.rotateZ(Math.PI / 2);
    this.sceneObject.add(leftMesh);

    const rightMesh = new THREE.Mesh(verticalFrameGeometry, this.frameMaterial);
    rightMesh.position.set(this.innerWidth / 2 + this.frameWidth / 2, 0, this.frameThickness / 2 + 0.0011);
    rightMesh.rotateZ(Math.PI / 2);
    this.sceneObject.add(rightMesh);
  }

  /**
   * Builds the inner canvas
   */
  buildMirror() {
    const geometry = new THREE.PlaneGeometry(this.innerWidth, this.innerHeight);
    const mirror = new Reflector(geometry, {
      clipBias: 0.003,
      textureWidth: innerWidth * window.devicePixelRatio * 0.5,
      textureHeight: window.innerHeight * window.devicePixelRatio * 0.5,
      color: 0xc1cbcb,
    });
    mirror.position.set(0, 0, this.frameThickness / 2 + 0.001);
    mirror.material.opacity = 0.9;
    mirror.material.transparent = true;

    this.sceneObject.add(mirror);
  }

  /**
   * Adds a decal on an invisible plane in front of the mirror
   */
  addDecal() {
    const decalWidth = this.innerWidth * 0.8;
    const decalHeight = this.innerHeight * 0.8;

    const decalGeometry = new THREE.PlaneGeometry(decalWidth, decalHeight);
    const decalMesh = new THREE.Mesh(decalGeometry, this.decalMaterial);
    decalMesh.position.set(0, 0, this.frameThickness / 2 + 0.01);
    decalMesh.rotation.set(0, 0, 0);

    this.sceneObject.add(decalMesh);
  }
}

export { Mirror };
