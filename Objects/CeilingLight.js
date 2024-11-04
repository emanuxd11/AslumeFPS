import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';


class CeilingLight extends SceneObject {

  /**
   * Constructor for the CeilingLight subclass of SceneObject
   * @param { app } app - app reference
   * @param { string } name - light name
   * @param { number } x - Initial x coordinate
   * @param { number } y - Initial y coordinate
   * @param { number } z - Initial z coordinate
   * @param { number } rotation - Initial rotation
   */
  constructor({app, name, x = 0, y = 0, z = 0, rotation = 0, intensity = 40, width = 2, height = 0.3, length = 2, color = 0xffffff, enableShadows = false}) {
    super(app, name, x, y, z, rotation);

    this.width = width;
    this.height = height;
    this.length = length;
    this.intensity = intensity;
    this.color = color;
    this.enableShadows = enableShadows;

    this.initMaterials();
  }

  /**
   * CeilingLight's initMaterials() implementation
   */
  initMaterials() {
    this.frameMaterial = new THREE.MeshPhongMaterial({
      color: "#333333",
    });

    this.panelMaterial = new THREE.MeshPhongMaterial({
      color: "#ffffff",
      emissive: "#ffffe0",
      shininess: 10,
      transparent: true,
      opacity: 0.95,
    });
  }

  /**
   * CeilingLight's implementation of build()
   */
  build() {
    this.buildFrame();
    this.buildLightSourcePanel();
    this.buildLight();
  }
  
  /**
   * Builds outer frame of ceiling light 
   */
  buildFrame() {
    const frameGeometry = new THREE.BoxGeometry(this.width, this.height, this.length);
    this.frameMesh = new THREE.Mesh(frameGeometry, this.frameMaterial);
    this.frameMesh.position.set(0, -this.height / 2, 0);
    this.sceneObject.add(this.frameMesh);
  }

  /**
   * Builds panel (figurative light source)
   */
  buildLightSourcePanel() {
    const panelGeometry = new THREE.BoxGeometry(this.width * 0.85, this.length * 0.85, this.height * 0.3);
    this.panelMesh = new THREE.Mesh(panelGeometry, this.panelMaterial);
    this.panelMesh.position.set(0, -this.height - this.height * 0.2 / 2, 0);
    this.panelMesh.rotation.x = -Math.PI / 2;
    this.sceneObject.add(this.panelMesh);
  }

  /**
   * Create the light source (point light)
   */
  buildLight() {
    this.pointLight = new THREE.PointLight(0xffffff, this.intensity, 100);
    this.pointLight.position.set(0, -this.height, 0);

    if (this.enableShadows) {
      this.pointLight.castShadow = true;
      this.pointLight.shadow.bias = -0.00025;
      this.pointLight.shadow.mapSize.width = 4096;
      this.pointLight.shadow.mapSize.height = 4096;
      this.pointLight.shadow.camera.near = 0.5;
      this.pointLight.shadow.camera.far = 10;
      this.pointLight.shadow.camera.left = -10;
      this.pointLight.shadow.camera.right = 10;
      this.pointLight.shadow.camera.bottom = -10;
      this.pointLight.shadow.camera.top = 10;
      this.pointLight.shadow.radius = 4;
    }

    this.sceneObject.add(this.pointLight);
  }

}

export { CeilingLight };
