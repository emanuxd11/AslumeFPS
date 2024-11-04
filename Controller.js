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
  constructor(app) {
    this.app = app;
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

    document.addEventListener('mousemove', (event) => {
      this.mouseX = (event.movementX || 0) * 0.002;
      this.mouseY = (event.movementY || 0) * 0.002;
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

}

export { Controller };
