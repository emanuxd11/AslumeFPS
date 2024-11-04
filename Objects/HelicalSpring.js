import * as THREE from 'three';
import { Shadows } from '../Aux/Shadows.js';
import { SceneObject } from './SceneObject.js';


class HelicalSpring extends SceneObject {

  /**
   * Constructor for HelicalSpring
   * @param {*} app - app reference
   * @param {*} name - spring name
   * @param {*} x - initial x coordinate
   * @param {*} y - initial y coordinate
   * @param {*} z - initial z coordinate
   * @param {*} rotation - initial y rotation
   * @param {*} radius - radius
   * @param {*} length - spring length
   * @param {*} numCoils - number of coils
   * @param {*} coilRadius - coil radius
   */
  constructor(app, name, x = 0, y = 0, z = 0, rotation = 0, radius = 0.01, length = 1, numCoils = 50, coilRadius = 0.1) {
    super(app, name, x, y, z, rotation);
    this.radius = radius;
    this.length = length;
    this.numCoils = numCoils;
    this.coilRadius = coilRadius;

    this.color = "#1A1A1A";
    this.shininess = 10;
    this.material = new THREE.MeshPhongMaterial({
      color: this.color,
      specular: "#EEEEEE",
      emissive: "#000000",
      shininess: this.shininess
    });
  }

  /**
   * HelicalSpring's implementation of build()
   */
  build() {
    const path = this.createCoilPath();
    const curve = new THREE.CatmullRomCurve3(path, false, 'centripetal');
    const tubeGeometry = new THREE.TubeGeometry(curve, 100, this.coilRadius, 8, false);
    const spring = new THREE.Mesh(tubeGeometry, this.material);
    Shadows.enableShadows(spring);
    this.addCapsToSpring(spring);
    this.sceneObject.add(spring);
  }

  /**
   * Creates spring cap
   * @param {*} position 
   * @returns cap
   */
  createCap(position) {
    const capGeometry = new THREE.SphereGeometry(this.coilRadius, 10, 10);
    const cap = new THREE.Mesh(capGeometry, this.material);
    Shadows.enableShadows(cap);
    cap.position.copy(position);
    return cap;
  }

  /**
   * Adds cap to end of spring
   * @param {*} spring 
   */
  addCapsToSpring(spring) {
    const path = this.createCoilPath();
    const cap1 = this.createCap(path[0]);
    const cap2 = this.createCap(path[path.length - 1]);
    spring.add(cap1);
    spring.add(cap2);
  }

  /**
   * Creates coil path for spring shape
   * @returns created path
   */
  createCoilPath() {
    const path = [];
    const totalPoints = this.numCoils * 2;
    const angleStep = (Math.PI * 2) / this.numCoils;

    for (let i = 0; i < totalPoints; i++) {
      const angle = i * angleStep;
      const x = (i / totalPoints) * this.length; 
      const y = Math.cos(angle) * (this.radius + this.coilRadius); 
      const z = Math.sin(angle) * (this.radius + this.coilRadius);
      
      path.push(new THREE.Vector3(x, y, z));
    }

    return path;
  }

}

export { HelicalSpring };
