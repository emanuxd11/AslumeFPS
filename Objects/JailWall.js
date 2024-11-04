import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';
import { Shadows } from '../Aux/Shadows.js';


class JailWall extends SceneObject {

  /**
   * Constructor for the JailWall subclass of SceneObject 
   * @param { app } app - app reference
   * @param { string } name - JailWall name
   * @param { number } x - Initial x coordinate
   * @param { number } y - Initial y coordinate
   * @param { number } z - Initial z coordinate 
   * @param { number } rotation - Initial rotation
   */
  constructor(app, name, x = 0, y = 0, z = 0, wallWidth = 10, wallHeight = 10, barRadius = 0.1, barSpacing = 0.4, rotation = 0) {
    super(app, name, x, y, z, rotation);

    this.wallWidth = wallWidth;
    this.wallHeight = wallHeight;

    this.doorHeight = this.wallHeight / 1.25;
    this.barRadius = barRadius;
    this.barHeight = this.doorHeight;
    this.barSpacing = barSpacing;

    this.doorCutoutDimensions = {
      topLeft: { x: -this.wallWidth / 2 + 1, y: this.barHeight },
      bottomLeft: { x: -this.wallWidth / 2 + 1, y: 0 },
      topRight: { x: -2, y: this.barHeight },
      bottomRight: { x: -2, y: 0 },
    };

    this.doorWidth = this.doorCutoutDimensions.topRight.x - this.doorCutoutDimensions.topLeft.x;
    this.barCount = Math.floor(this.doorWidth / this.barSpacing) + 1;

    this.doorCasingWidth = 0.15;
    this.doorCasingThickness = 0.2;

    this.initMaterials();
  }

  /**
   * JailWall's initMaterials() implementation
   */
  initMaterials() {
    const loader = new THREE.TextureLoader();
    this.wallTexture = loader.load('../Textures/wall.jpg');
    this.bumpMap = loader.load('../Textures/wall_bump.jpg');
    this.wallTexture.wrapS = THREE.RepeatWrapping;
    this.wallTexture.wrapT = THREE.RepeatWrapping;
    this.wallTexture.repeat.set(this.wallWidth / 10, 1);
    this.wallMaterial = new THREE.MeshPhongMaterial({
      map: this.wallTexture,
      color: "#ffffff",
      specular: "#222222",
      emissive: "#000000",
      shininess: 10,
      bumpMap: this.bumpMap,
      bumpScale: 0.05,
    });
    this.wallMaterial.side = THREE.DoubleSide;
    this.wallMaterial.transparent = false;
    this.wallMaterial.opacity = 1;

    this.barMaterial = new THREE.MeshPhongMaterial({ color: "#333333" });
  }


  /**
   * JailWall's build() implementation
   */
  build() {
    this.buildWallStructure();
    this.buildBars();
  }

  /**
   * Builds the wall structure composed of 3 pieces
   */
  buildWallStructure() {

    const leftPlaneWidth = this.doorCutoutDimensions.bottomLeft.x + this.wallWidth / 2;
    const leftPlane = new THREE.PlaneGeometry(leftPlaneWidth, this.wallHeight);
    leftPlane.attributes.uv.array.forEach((_, index) => {
      if (index % 2 === 0) leftPlane.attributes.uv.array[index] *= leftPlaneWidth / this.wallWidth;
    });
    const leftPlaneMesh = new THREE.Mesh(leftPlane, this.wallMaterial);
    leftPlaneMesh.position.set(-this.wallWidth / 2 + leftPlaneWidth / 2, 0, 0);
    Shadows.enableShadows(leftPlaneMesh);
    this.sceneObject.add(leftPlaneMesh);

    const rightPlaneWidth = this.wallWidth / 2 - this.doorCutoutDimensions.bottomRight.x;
    const rightPlane = new THREE.PlaneGeometry(rightPlaneWidth, this.wallHeight);
    rightPlane.attributes.uv.array.forEach((_, index) => {
      if (index % 2 === 0) rightPlane.attributes.uv.array[index] *= rightPlaneWidth / this.wallWidth;
      else rightPlane.attributes.uv.array[index] += leftPlaneWidth / this.wallWidth;
    });
    const rightPlaneMesh = new THREE.Mesh(rightPlane, this.wallMaterial);
    rightPlaneMesh.position.set(this.wallWidth / 2 - rightPlaneWidth / 2, 0, 0);
    Shadows.enableShadows(rightPlaneMesh);
    this.sceneObject.add(rightPlaneMesh);

    const topPlaneHeight = this.wallHeight - this.doorCutoutDimensions.topLeft.y;
    const topPlane = new THREE.PlaneGeometry(this.doorWidth, topPlaneHeight);
    for (let i = 0; i < topPlane.attributes.uv.count; i++) {
      const u = topPlane.attributes.uv.getX(i);
      const v = topPlane.attributes.uv.getY(i);
      topPlane.attributes.uv.setXY(i,
        u * (this.doorWidth / this.wallWidth) + (leftPlaneWidth / this.wallWidth),
        v * (topPlaneHeight / this.wallHeight) + (this.doorCutoutDimensions.topLeft.y / this.wallHeight)
      );
    }
    const topPlaneMesh = new THREE.Mesh(topPlane, this.wallMaterial);
    topPlaneMesh.position.set(
      (this.doorCutoutDimensions.bottomLeft.x + this.doorCutoutDimensions.bottomRight.x) / 2,
      this.barHeight / 2, 
      0
    );
    Shadows.enableShadows(topPlaneMesh);
    this.sceneObject.add(topPlaneMesh);

    // build casing
    const topCasing = new THREE.BoxGeometry(this.doorWidth + 2 * (this.barRadius / 2), this.doorCasingWidth, this.doorCasingThickness);
    const topCasingMesh = new THREE.Mesh(topCasing, this.barMaterial);
    Shadows.enableShadows(topCasingMesh);
    topCasingMesh.position.set(
      (this.doorCutoutDimensions.bottomLeft.x + this.doorCutoutDimensions.bottomRight.x) / 2, 
      this.wallHeight / 2 - topPlaneHeight + this.doorCasingWidth / 2, 
      this.doorCasingThickness / 2,
    );
    const topCasingClone = topCasingMesh.clone();
    topCasingClone.position.set(
      (this.doorCutoutDimensions.bottomLeft.x + this.doorCutoutDimensions.bottomRight.x) / 2, 
      this.wallHeight / 2 - topPlaneHeight + this.doorCasingWidth / 2, 
      -this.doorCasingThickness / 2,
    );
    this.sceneObject.add(topCasingMesh, topCasingClone);

    const verticalCasing = new THREE.BoxGeometry(this.doorCasingWidth, this.doorHeight + this.doorCasingWidth, this.doorCasingThickness);
    const leftCasingMesh = new THREE.Mesh(verticalCasing, this.barMaterial);
    Shadows.enableShadows(leftCasingMesh);
    leftCasingMesh.position.set(
      this.doorCutoutDimensions.bottomLeft.x - this.barRadius / 2 - this.doorCasingWidth / 2,
      -(this.wallHeight - this.doorHeight) / 2 + this.doorCasingWidth / 2, 
      this.doorCasingThickness / 2
    );
    const leftCasingClone = leftCasingMesh.clone();
    leftCasingClone.position.set(
      this.doorCutoutDimensions.bottomLeft.x - this.barRadius / 2 - this.doorCasingWidth / 2,
      -(this.wallHeight - this.doorHeight) / 2 + this.doorCasingWidth / 2, 
      -this.doorCasingThickness / 2
    );
    this.sceneObject.add(leftCasingMesh, leftCasingClone);

    const rightCasingMesh = new THREE.Mesh(verticalCasing, this.barMaterial);
    Shadows.enableShadows(rightCasingMesh);
    rightCasingMesh.position.set(
      this.doorCutoutDimensions.bottomRight.x + this.barRadius / 2 + this.doorCasingWidth / 2,
      -(this.wallHeight - this.doorHeight) / 2 + this.doorCasingWidth / 2, 
      this.doorCasingThickness / 2
    );
    const rightCasingClone = rightCasingMesh.clone();
    rightCasingClone.position.set(
      this.doorCutoutDimensions.bottomRight.x + this.barRadius / 2 + this.doorCasingWidth / 2,
      -(this.wallHeight - this.doorHeight) / 2 + this.doorCasingWidth / 2, 
      -this.doorCasingThickness / 2
    );
    this.sceneObject.add(rightCasingMesh, rightCasingClone);
  }

  /**
   * Builds the jail bars
   */
  buildBars() {
    for (let i = 0; i < this.barCount; i++) {
      const barGeometry = new THREE.CylinderGeometry(this.barRadius, this.barRadius, this.barHeight, 32);
      const barMesh = new THREE.Mesh(barGeometry, this.barMaterial);
      Shadows.enableShadows(barMesh);

      barMesh.position.set(
        this.doorCutoutDimensions.bottomLeft.x + i * this.barSpacing,
        -(this.wallHeight - this.barHeight) / 2, 
        0,
      );

      this.sceneObject.add(barMesh);
    }
  }

}

export { JailWall };
