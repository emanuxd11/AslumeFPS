import * as THREE from 'three';
import { Shadows } from '../Aux/Shadows.js';
import { nurbsGenerator } from '../Aux/NurbSurface.js';
import { SceneObject } from './SceneObject.js';

class FlowerJar extends SceneObject {
  constructor({
    app, 
    name, 
    x = 0, 
    y = 0, 
    z = 0, 
    rotation = 0,
    jarBodyHeight = 1,
    jarBodyMinWidth = 0.1667,
    jarBodyMaxWidth = 0.3333,
    jarHeadHeight = 0.5,
    jarHeadMinWidth = 0.1,
    jarHeadMouthWidth = 0.1667,
  }) {
    super(app, name, x, y, z, rotation);

    this.jarBodyHeight = jarBodyHeight;
    this.jarBodyMinWidth = jarBodyMinWidth;
    this.jarBodyMaxWidth = jarBodyMaxWidth;
    this.jarHeadHeight = jarHeadHeight;
    this.jarHeadMinWidth = jarHeadMinWidth;
    this.jarHeadMouthWidth = jarHeadMouthWidth; 

    this.initMaterials();
    this.build();
  }

  initMaterials() {
    this.bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x8B4513,
      roughness: 0.7,
      metalness: 0.1,
    });
    this.bodyMaterial.side = THREE.DoubleSide;
  }

  build() {
    const bodyControlPoints1 = [
      [
        [-this.jarBodyMinWidth, 0, 0], 
        [-this.jarBodyMinWidth, 0, -this.jarBodyMinWidth], 
        [this.jarBodyMinWidth, 0, -this.jarBodyMinWidth], 
        [this.jarBodyMinWidth, 0, 0],
      ],
      [
        [-this.jarBodyMaxWidth, this.jarBodyHeight / 3, 0], 
        [-this.jarBodyMaxWidth, this.jarBodyHeight / 3, -this.jarBodyMaxWidth], 
        [this.jarBodyMaxWidth, this.jarBodyHeight / 3, -this.jarBodyMaxWidth], 
        [this.jarBodyMaxWidth, this.jarBodyHeight / 3, 0],
      ],
      [
        [(-this.jarBodyMaxWidth - this.jarBodyMinWidth) / 2, 2 * this.jarBodyHeight / 3, 0], 
        [(-this.jarBodyMaxWidth - this.jarBodyMinWidth) / 2, 2 * this.jarBodyHeight / 3, (-this.jarBodyMaxWidth - this.jarBodyMinWidth) / 2], 
        [(this.jarBodyMaxWidth + this.jarBodyMinWidth) / 2, 2 * this.jarBodyHeight / 3, (-this.jarBodyMaxWidth - this.jarBodyMinWidth) / 2], 
        [(this.jarBodyMaxWidth + this.jarBodyMinWidth) / 2, 2 * this.jarBodyHeight / 3, 0],
      ],
      [
        [-this.jarHeadMinWidth, this.jarBodyHeight, 0], 
        [-this.jarHeadMinWidth, this.jarBodyHeight, -this.jarHeadMinWidth], 
        [this.jarHeadMinWidth, this.jarBodyHeight, -this.jarHeadMinWidth], 
        [this.jarHeadMinWidth, this.jarBodyHeight, 0],
      ],
      [
        [-this.jarHeadMouthWidth, this.jarBodyHeight + this.jarHeadHeight, 0], 
        [-this.jarHeadMouthWidth, this.jarBodyHeight + this.jarHeadHeight, -this.jarHeadMouthWidth], 
        [this.jarHeadMouthWidth, this.jarBodyHeight + this.jarHeadHeight, -this.jarHeadMouthWidth], 
        [this.jarHeadMouthWidth, this.jarBodyHeight + this.jarHeadHeight, 0],
      ],
    ];

    const bodyControlPoints2 = [
      [
        [this.jarBodyMinWidth, 0, 0], 
        [this.jarBodyMinWidth, 0, this.jarBodyMinWidth], 
        [-this.jarBodyMinWidth, 0, this.jarBodyMinWidth], 
        [-this.jarBodyMinWidth, 0, 0],
      ],
      [
        [this.jarBodyMaxWidth, this.jarBodyHeight / 3, 0], 
        [this.jarBodyMaxWidth, this.jarBodyHeight / 3, this.jarBodyMaxWidth], 
        [-this.jarBodyMaxWidth, this.jarBodyHeight / 3, this.jarBodyMaxWidth], 
        [-this.jarBodyMaxWidth, this.jarBodyHeight / 3, 0],
      ],
      [
        [-(-this.jarBodyMaxWidth - this.jarBodyMinWidth) / 2, 2 * this.jarBodyHeight / 3, 0], 
        [-(-this.jarBodyMaxWidth - this.jarBodyMinWidth) / 2, 2 * this.jarBodyHeight / 3, -(-this.jarBodyMaxWidth - this.jarBodyMinWidth) / 2], 
        [-(this.jarBodyMaxWidth + this.jarBodyMinWidth) / 2, 2 * this.jarBodyHeight / 3, -(-this.jarBodyMaxWidth - this.jarBodyMinWidth) / 2], 
        [-(this.jarBodyMaxWidth + this.jarBodyMinWidth) / 2, 2 * this.jarBodyHeight / 3, 0],
      ],
      [
        [this.jarHeadMinWidth, this.jarBodyHeight, 0], 
        [this.jarHeadMinWidth, this.jarBodyHeight, this.jarHeadMinWidth], 
        [-this.jarHeadMinWidth, this.jarBodyHeight, this.jarHeadMinWidth], 
        [-this.jarHeadMinWidth, this.jarBodyHeight, 0],
      ],
      [
        [this.jarHeadMouthWidth, this.jarBodyHeight + this.jarHeadHeight, 0], 
        [this.jarHeadMouthWidth, this.jarBodyHeight + this.jarHeadHeight, this.jarHeadMouthWidth], 
        [-this.jarHeadMouthWidth, this.jarBodyHeight + this.jarHeadHeight, this.jarHeadMouthWidth], 
        [-this.jarHeadMouthWidth, this.jarBodyHeight + this.jarHeadHeight, 0],
      ],
    ];

    const bodyOrderU = 3;
    const bodyOrderV = 3;
    const bodySamplesU = 20;
    const bodySamplesV = 20;

    const bodyMesh1 = nurbsGenerator.createNurbsSurfaces(
      0, 0, 0,
      bodyControlPoints1,
      bodyOrderU,
      bodyOrderV,
      bodySamplesU,
      bodySamplesV,
    );
    bodyMesh1.material = this.bodyMaterial;

    const bodyMesh2 = nurbsGenerator.createNurbsSurfaces(
      0, 0, 0,
      bodyControlPoints2,
      bodyOrderU,
      bodyOrderV,
      bodySamplesU,
      bodySamplesV,
    );
    bodyMesh2.material = this.bodyMaterial;
    Shadows.enableShadows(bodyMesh1);
    Shadows.enableShadows(bodyMesh2);
    this.sceneObject.add(bodyMesh1, bodyMesh2);
  }

}

export { FlowerJar };
