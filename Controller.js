import { App } from './App.js';
import { Contents } from './Contents.js';
import * as THREE from "three";


/**
  This class customizes the gui interface for the app
*/
class Controller  {

  static KEYS = {
    'a': 65,
    's': 83,
    'w': 87,
    'd': 68,
  };

  /**
   * 
   * @param { App } app The application object 
   */
  constructor({camera}) {
    this.camera = camera;
    this.init();
  }

  /**
   * Initialize the gui interface
   */
  init() {
    this.speed = 0.2;
    this.direction = new THREE.Vector3();

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.mouseX = 0;
    this.mouseY = 0;
    this.pitch = 0;
    this.yaw = 0;
    this.mouseMoving = false;

    document.addEventListener('mousemove', (event) => {
      this.mouseX = (event.movementX || 0) * 0.002;
      this.mouseY = (event.movementY || 0) * 0.002;
      this.mouseMoving = true;
    });

    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'w': this.moveForward = true; break;
        case 's': this.moveBackward = true; break;
        case 'a': this.moveLeft = true; break;
        case 'd': this.moveRight = true; break;
      }
    });

    document.addEventListener('keyup', (event) => {
      switch (event.key) {
        case 'w': this.moveForward = false; break;
        case 's': this.moveBackward = false; break;
        case 'a': this.moveLeft = false; break;
        case 'd': this.moveRight = false; break;
      }
    });
  }

  controlCamera() {
    // Track yaw and pitch separately
    if (this.mouseMoving) {
      this.yaw -= this.mouseX;
      this.pitch -= this.mouseY;
      this.mouseMoving = false;
    }

    // Clamp the pitch to prevent the camera from flipping
    this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));

    // Create quaternion from yaw and pitch
    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ'));
    this.camera.quaternion.copy(quaternion);
  }

  controlMovement() {
    // Calculate the camera's forward and right vectors
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();

    // Adjust movement based on the camera's orientation
    if (this.moveForward) {
      forward.set(0, 0, -1).applyQuaternion(this.camera.quaternion);
      forward.y = 0;
      this.direction.add(forward);
    }
    if (this.moveBackward) {
      forward.set(0, 0, 1).applyQuaternion(this.camera.quaternion);
      forward.y = 0;
      this.direction.add(forward);
    }
    if (this.moveLeft) {
      right.set(-1, 0, 0).applyQuaternion(this.camera.quaternion);
      right.y = 0;
      this.direction.add(right);
    }
    if (this.moveRight) {
      right.set(1, 0, 0).applyQuaternion(this.camera.quaternion);
      right.y = 0;
      this.direction.add(right);
    }

    // Normalize to keep consistent movement speed in all directions
    this.direction.normalize();

    this.camera.position.add(this.direction.clone().multiplyScalar(this.speed));
    this.direction.set(0, 0, 0);
  }

}

export { Controller };
