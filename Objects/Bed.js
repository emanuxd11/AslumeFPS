import * as THREE from 'three';
import { Shadows } from '../Aux/Shadows.js';
import { SceneObject } from './SceneObject.js';


class Bed extends SceneObject {

  /**
   * Constructor for the Bed object
   * @param {MyApp} app - Reference to the app
   * @param {string} name - Name of the object
   * @param {number} x - Initial x position
   * @param {number} y - Initial y position
   * @param {number} z - Initial z position
   */
  constructor(app, name, x = 0, y = 0, z = 0) {
    super(app, name, x, y, z);
    this.frameHeight = 0.15;
    this.frameWidth = 2.3;
    this.frameLength = 5.5;
    this.legHeight = 0.6;
    this.legRadius = 0.05;
    this.mattressHeight = 0.35;
    this.mattressWidth = this.frameWidth - 0.1;
    this.mattressLength = this.frameLength - 0.2;
    this.pillowHeight = 0.2;
    this.pillowWidth = 0.7;
    this.pillowLength = this.mattressWidth - 0.5;
    this.initMaterials();
    this.build();
  }

  /**
   * Initialize materials for the bed
   */
  initMaterials() {
    const loader = new THREE.TextureLoader();

    this.frameMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
    this.mattressMaterial = new THREE.MeshPhongMaterial({ color: 0xeeeeee });
    this.pillowMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
  }

  /**
   * Build the bed
   */
  build() {
    this.buildFrame();
    this.buildMattress();
    this.buildPillow();
  }

  /**
   * Build the bed frame (four legs and a base)
   */
  buildFrame() {
    const frameGeometry = new THREE.BoxGeometry(this.frameLength, this.frameHeight, this.frameWidth);
    const frame = new THREE.Mesh(frameGeometry, this.frameMaterial);
    frame.position.y = this.legHeight + this.frameHeight / 2;
    Shadows.enableShadows(frame);
    this.sceneObject.add(frame);

    const legGeometry = new THREE.CylinderGeometry(this.legRadius, this.legRadius, this.legHeight, 16);
    const legPositions = [
      { x: -this.frameLength / 2 + this.legRadius, y: this.legHeight / 2, z: -this.frameWidth / 2 + this.legRadius },
      { x: this.frameLength / 2 - this.legRadius, y: this.legHeight / 2, z: -this.frameWidth / 2 + this.legRadius },
      { x: -this.frameLength / 2 + this.legRadius, y: this.legHeight / 2, z: this.frameWidth / 2 - this.legRadius },
      { x: this.frameLength / 2 - this.legRadius, y: this.legHeight / 2, z: this.frameWidth / 2 - this.legRadius },
    ];

    legPositions.forEach((pos) => {
      const legMesh = new THREE.Mesh(legGeometry, this.frameMaterial);
      legMesh.position.set(pos.x, pos.y, pos.z);
      Shadows.enableShadows(legMesh);
      this.sceneObject.add(legMesh);
    });
  }

  /**
   * Build the mattress (box geometry)
   */
  buildMattress() {
    const mattressGeometry = new THREE.BoxGeometry(this.mattressLength, this.mattressHeight, this.mattressWidth);
    const mattress = new THREE.Mesh(mattressGeometry, this.mattressMaterial);
    mattress.position.y = this.legHeight + this.frameHeight + this.mattressHeight / 2;
    Shadows.enableShadows(mattress);
    this.sceneObject.add(mattress);
  }

  /**
   * Build the pillow (smaller box)
   */
  buildPillow() {
    const pillowGeometry = new THREE.BoxGeometry(this.pillowWidth, this.pillowHeight, this.pillowLength);
    const pillow = new THREE.Mesh(pillowGeometry, this.pillowMaterial);
    pillow.position.set(-this.mattressLength / 2 + 0.2 + this.pillowWidth / 2, this.legHeight + this.frameHeight + this.mattressHeight + this.pillowHeight / 2, 0);
    Shadows.enableShadows(pillow);
    this.sceneObject.add(pillow);
  }

}

export { Bed };
