import * as THREE from 'three';
import { Shadows} from '../Aux/Shadows.js';
import { SceneObject } from './SceneObject.js';


class Spotlight extends SceneObject {
  /**
   * Constructor for the Spotlight object
   * @param { MyApp } app - Reference to the app
   * @param { string } name - Name of the object
   * @param { number } x - Initial x position
   * @param { number } y - Initial y position
   * @param { number } z - Initial z position
   */
  constructor(app, name, x = 0, y = 0, z = 0) {
    super(app, name, x, y, z);

    this.relativeTarget = new THREE.Vector3();
    this.initMaterials();
    this.build();
  }

  /**
   * Initialize materials for the spotlight
   */
  initMaterials() {
    this.baseMaterial  = new THREE.MeshPhongMaterial({ color: 0x333333 });
    this.lightMaterial = new THREE.MeshPhongMaterial({ 
      color: "#ffff00", 
      emissive: "#ffffe0",
      shininess: 100,
      transparent: true,
      opacity: 0.95,
    });
    this.armMaterial   = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
  }

  /**
   * Build the spotlight
   */
  build() {
    this.buildBase();
    this.buildArm();
    this.buildLightHead();
  }

  /**
   * Build the base of the spotlight that will attach to the wall
   */
  buildBase() {
    const baseGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
    const base = new THREE.Mesh(baseGeometry, this.baseMaterial);
    base.position.set(0, 0, 0.1);
    base.rotation.x = -Math.PI / 2;
    Shadows.enableCastShadows(base);
    this.sceneObject.add(base);
  }

  /**
   * Build the arm extending out from the wall
   */
  buildArm() {
    const armCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0.1),
      new THREE.Vector3(0, 0.6, 0.4),
      new THREE.Vector3(0, 1.0, 1.0)
    ]);

    const armGeometry = new THREE.TubeGeometry(armCurve, 20, 0.04, 8, false);
    const arm = new THREE.Mesh(armGeometry, this.armMaterial);
    Shadows.enableCastShadows(arm);
    this.sceneObject.add(arm);
  }

  /**
   * Build the light head
   */
  buildLightHead() {
    if (this.lightHead) {
      this.sceneObject.remove(this.lightHead);
    }

    if (this.spotlight) {
      this.sceneObject.remove(this.spotlight);
    }

    this.lightHead = new THREE.Group();

    const casingGeometry = new THREE.CylinderGeometry(0.14, 0.14, 0.7, 32);
    const casingMaterial = new THREE.MeshPhongMaterial({ color: 0x333333, side: THREE.DoubleSide });
    this.casing = new THREE.Mesh(casingGeometry, casingMaterial);
    this.casing.position.set(0, 0, 0);

    this.casing.castShadow = true;
    this.casing.receiveShadow = true;

    this.lightHead.add(this.casing);

    const lightGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.4, 8);
    this.light = new THREE.Mesh(lightGeometry, this.lightMaterial);
    this.light.position.set(0, 0.2, 0);
    this.lightHead.add(this.light);

    this.sceneObject.add(this.lightHead);
    this.lightHead.position.set(0, 1.0, 1.0);

    this.spotlight = new THREE.SpotLight(0xffffff, 1);
    this.spotlight.position.set(0, 1, 1);

    this.spotlight.intensity = 10;
    this.spotlight.angle = Math.PI / 9;
    this.spotlight.penumbra = 0.05;
    this.spotlight.decay = 0.5;
    this.spotlight.distance = 20;
    this.setTargetPosition(5, 0, 5)

    this.spotlight.castShadow = true; 
    this.spotlight.shadow.bias = -0.00025;
    this.spotlight.shadow.mapSize.width = 1024;
    this.spotlight.shadow.mapSize.height = 1024;
    this.spotlight.shadow.camera.near = 0.5;
    this.spotlight.shadow.camera.far = 30;
    
    this.sceneObject.add(this.spotlight.target);
    this.sceneObject.add(this.spotlight);

    this.rotateHead();
  }

  setTargetPosition(x, y, z) {
    this.relativeTarget.x = x;
    this.relativeTarget.y = y;
    this.relativeTarget.z = z;

    const parentWorldPosition = new THREE.Vector3();
    const spotLightRelativePosition = new THREE.Vector3();
    const spotLightWorldPosition = new THREE.Vector3();
    const targetPosition = new THREE.Vector3();

    this.sceneObject.getWorldPosition(parentWorldPosition);
    this.spotlight.getWorldPosition(spotLightWorldPosition);

    spotLightWorldPosition.addVectors(parentWorldPosition, spotLightRelativePosition);
    spotLightWorldPosition.multiplyScalar(-1);
    targetPosition.addVectors(spotLightWorldPosition, new THREE.Vector3(x, y, z));

    this.spotlight.target.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
  }
  
  /**
   * Update head rotation based on spotlight's target position
   */
  rotateHead() {
    const direction = new THREE.Vector3()
      .subVectors(this.spotlight.target.position, this.spotlight.position)
      .normalize();

    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction);

    this.lightHead.setRotationFromQuaternion(quaternion);
  }

}

export { Spotlight };
