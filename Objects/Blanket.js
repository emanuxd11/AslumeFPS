import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';
import { Shadows } from '../Aux/Shadows.js';
import { nurbsGenerator } from '../Aux/NurbSurface.js';


class Blanket extends SceneObject {

  /**
   * Constructs a Blanket object.
   * @param {String} name - Name of the object.
   * @param {number} x - The x-coordinate of the Blanket's position.
   * @param {number} y - The y-coordinate of the Blanket's position.
   * @param {number} z - The z-coordinate of the Blanket's position.
   * @param {number} ang - The initial angle of the Blanket (default is 0).
   */
  constructor(name, x, y, z, rotation = 0) {
    super(name, x, y, z, rotation);

    this.diffuseColor = "#FFFFFF";
    this.specularColor = "#DDDDDD";
    this.shininess = 30;

    this.build();
  }

  /**
   * Build the Blanket.
   */
  build() {
    let controlPoints = [
      [
        [-1.8, -2.1, 1.4, 1],
        [-1.8, -3, 0.6, 1],
        [-1.8, 0.35, 0.8, 1]
      ],
      [
        [-1.0, -2.1, 1.6, 1],
        [-1.0, -3, 0.6, 1],
        [-1.0, 0.35, 0.8, 1]
      ],
      [
        [2.9, -2.1, 1.6, 1],
        [2.9, -3, 0.6, 1],
        [2.9, 0.35, 0.8, 1]
      ],
      [
        [2.2, -2.1, 1.4, 1],
        [2.2, -3, 0.6, 1],
        [2.2, 0.35, 0.8, 1]
      ],
    ];

    let orderU = 3;
    let orderV = 2;

    const blanketTexture = new THREE.TextureLoader().load('../Textures/blanket.jpg');
    blanketTexture.wrapS = blanketTexture.wrapT = THREE.RepeatWrapping;

    const blanketSurface = nurbsGenerator.createDoubleSidedNurbsSurfaces(0, 0, 0, controlPoints, orderU, orderV, 10, 10, blanketTexture);
    Shadows.enableShadows(blanketSurface);
    this.sceneObject.add(blanketSurface);
  }
}

export { Blanket };
