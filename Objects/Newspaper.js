import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';
import { Shadows } from '../Aux/Shadows.js';
import { nurbsGenerator } from '../Aux/NurbSurface.js';


class Newspaper extends SceneObject {

  /**
   * Constructs a Newspaper object
   * @param {String} name - Name of the object.
   * @param {number} x - The x-coordinate of the Newspaper's position.
   * @param {number} y - The y-coordinate of the Newspaper's position.
   * @param {number} z - The z-coordinate of the Newspaper's position.
   * @param {number} ang - The initial angle of the Newspaper (default is 0).
   */
  constructor(name, x, y, z, ang = 0) {
    super(name, x, y, z, ang);

    this.diffuseColor = "#FFFFFF";
    this.specularColor = "#FFFFFF";
    this.shininess = 30;

    this.build();
  }

  /**
   * Build the Newspaper
   */
  build() {
    let controlPoints = [
      [
        [-0.2, -0.3, 0.0, 1],
        [-0.2, 0.3, 0.0, 1]
      ],
      [
        [0, -0.3, 0.2, 1],
        [0, 0.3, 0.2, 1.3]
      ],
      [
        [0.2, -0.3, 0.0, 1],
        [0.2, 0.3, 0.0, 1]
      ]
    ];

    let orderU = 2;
    let orderV = 1;

    const newspaperTexture1 = new THREE.TextureLoader().load('../Textures/newspaper.jpg');
    const newspaperTexture2 = new THREE.TextureLoader().load('../Textures/newspaper1.jpg');
    newspaperTexture1.wrapS = newspaperTexture1.wrapT = THREE.RepeatWrapping;
    newspaperTexture2.wrapS = newspaperTexture2.wrapT = THREE.RepeatWrapping;

    const side1 = nurbsGenerator.createDoubleSidedNurbsSurfaces(0, 0, 0, controlPoints, orderU, orderV, 10, 10, newspaperTexture1);
    const side2 = nurbsGenerator.createDoubleSidedNurbsSurfaces(0.4, 0, 0, controlPoints, orderU, orderV, 10, 10, newspaperTexture2);

    side1.rotateX(-Math.PI / 2)
    side2.rotateX(-Math.PI / 2)
    Shadows.enableShadows(side1);
    Shadows.enableShadows(side2);

    this.sceneObject.add(side1, side2);
  }
}

export { Newspaper };
