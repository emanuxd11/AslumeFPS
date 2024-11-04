import * as THREE from 'three';
import { Shadows } from '../Aux/Shadows.js';
import { SceneObject } from './SceneObject.js';


class Table extends SceneObject {
  
  /**
   * Constructor for the Table subclass of SceneObject
   * @param { app } app - app reference
   * @param { string } - Table name
   * @param { number } x - Initial x coordinate
   * @param { number } y - Initial y coordinate
   * @param { number } z - Initial z coordinate
   * @param { number } width - Table width
   * @param { number } length - Table length
   * @param { number } thickness - Table top thickness
   * @param { number } legHeight - Table leg height
   * @param { number } legRadius - Table leg radius
   */
  constructor(app, name, x = 0, y = 0, z = 0, width = 4, length = 2.5, thickness = 0.2, legHeight = 2, legRadius = 0.1) {
    super(app, name, x, y, z);

    this.width = width
    this.length = length;
    this.thickness = thickness;
    this.legHeight = legHeight;
    this.legRadius = legRadius;

    this.initMaterials();
  }

  /**
   * Table's implementation of initMaterials()
   */
  initMaterials() {
    const loader = new THREE.TextureLoader();

    this.tableTopTexture = loader.load('../Textures/anodizedmetal.jpg');
    this.tableTopBump = loader.load('../Textures/anodizedmetal_bump.jpg');

    this.tableTopMaterial = new THREE.MeshPhongMaterial({
      color: "#808080",
      specular: "#555555",
      emissive: "#000000",
      shininess: 60,
      bumpMap: this.tableTopBump,
      bumpScale: 0.01,
    });
    this.tableTopMaterial.map = this.tableTopTexture;
    this.tableTopTexture.wrapS = THREE.RepeatWrapping;
    this.tableTopTexture.wrapT = THREE.RepeatWrapping;
    this.tableTopTexture.repeat.set(1, 1);

    this.tableLegTexture = loader.load('../Textures/anodizedmetal.jpg');
    this.tableLegMaterial = new THREE.MeshPhongMaterial({
      color: "#ffffff",
      specular: "#555555",
      emissive: "#000000",
      shininess: 100,
    });
    this.tableLegMaterial.map = this.tableLegTexture;
    this.tableLegTexture.wrapS = THREE.RepeatWrapping;
    this.tableLegTexture.wrapT = THREE.RepeatWrapping;
    this.tableLegTexture.repeat.set(1, 1);
  }

  /**
   * Table's implementation of the build() method
   */
  build() {
    const topGeometry = new THREE.BoxGeometry(this.width, this.thickness, this.length);
    const topMesh = new THREE.Mesh(topGeometry, this.tableTopMaterial);
    topMesh.position.y = this.legHeight + this.thickness / 2;
    Shadows.enableShadows(topMesh);
    this.sceneObject.add(topMesh);

    const legGeometry = new THREE.CylinderGeometry(this.legRadius, this.legRadius, this.legHeight, 16);

    const positions = [
      { x: -this.width / 2.5, y: this.legHeight / 2, z: -this.length / 2.5 },
      { x: this.width / 2.5, y: this.legHeight / 2, z: -this.length / 2.5 },
      { x: -this.width / 2.5, y: this.legHeight / 2, z: this.length / 2.5 },
      { x: this.width / 2.5, y: this.legHeight / 2, z: this.length / 2.5 },
    ];

    positions.forEach((pos) => {
      const legMesh = new THREE.Mesh(legGeometry, this.tableLegMaterial);
      legMesh.position.set(pos.x, pos.y, pos.z);
      Shadows.enableShadows(legMesh); 
      this.sceneObject.add(legMesh);
    });
  }

}

export { Table };
