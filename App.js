import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { Contents } from './Contents.js';
import { Controller } from './Controller.js';
import { GuiInterface } from './GuiInterface.js';
import Stats from 'three/addons/libs/stats.module.js'


/**
 * This class contains the application object
 */
class App {

  /**
   * the constructor
   */
  constructor() {
    this.scene = null
    this.stats = null

    // camera related attributes
    this.activeCamera = null
    this.activeCameraName = null
    this.lastCameraName = null
    this.cameras = []
    this.frustumSize = 20

    // other attributes
    this.renderer = null
    this.controls = null
    this.gui = null
    this.axis = null
    this.contents == null
  }

  /**
   * initializes the application
   */
  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x101010);

    this.stats = new Stats()
    this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom)

    this.initCameras();
    this.setActiveCamera('Perspective')

    // setup controller
    this.controller = new Controller({
      camera: this.activeCamera,
    });

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor("#000000");

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("canvas").appendChild(this.renderer.domElement);
    window.addEventListener('resize', this.onResize.bind(this), false);

    const canvas = document.querySelector('canvas');
    canvas.addEventListener("click", async () => {
      canvas.requestPointerLock();

      this.goFullScreen();
    });
  }

  /**
   * initializes all the cameras
   */
  initCameras() {
    const aspect = window.innerWidth / window.innerHeight;

    // Create a basic perspective camera
    const perspective1 = new THREE.PerspectiveCamera(75, aspect, 0.1, 2000); // first parameter is fov
    perspective1.position.set(0, 5, 0);
    this.cameras['Perspective'] = perspective1;

  }

  /**
   * sets the active camera by name
   * @param { String } cameraName 
   */
  setActiveCamera(cameraName) {
    this.activeCameraName = cameraName;
    this.activeCamera = this.cameras[this.activeCameraName];
  }

  /**
   * updates the active camera if required
   * this function is called in the render loop
   * when the active camera name changes
   * it updates the active camera and the controls
   */
  updateCameraIfRequired() {

    // camera changed?
    if (this.lastCameraName !== this.activeCameraName) {
      this.lastCameraName = this.activeCameraName;
      this.activeCamera = this.cameras[this.activeCameraName];
      document.getElementById("camera").innerHTML = this.activeCameraName;

      // call on resize to update the camera aspect ratio
      // among other things
      this.onResize()

      // if (this.controls === null) {
      //   // Orbit controls allow the camera to orbit around a target.
      //   this.controls = new OrbitControls(this.activeCamera, this.renderer.domElement);
      //   this.controls.enableDamping = true;
      //   this.controls.dampingFactor = 0.05;
      //   this.controls.enableZoom = true;
      //   this.controls.target = new THREE.Vector3(0, 5, 0);
      //   this.controls.update();
      // } else {
      //   this.controls.object = this.activeCamera
      // }
    }
  }

  /**
   * the window resize handler
   */
  onResize() {
    if (this.activeCamera !== undefined && this.activeCamera !== null) {
      this.activeCamera.aspect = window.innerWidth / window.innerHeight;
      this.activeCamera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }
  /**
   * 
   * @param { Contents } contents the contents object 
   */
  setContents(contents) {
    this.contents = contents;
  }

  /**
   * @param { GuiInterface } contents the gui interface object
   */
  setGui(gui) {
    this.gui = gui
  }

  /**
   * 
   */
  goFullScreen() {
    const canvas = document.querySelector('canvas');

    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.mozRequestFullScreen) {
      canvas.mozRequestFullScreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) {
      canvas.msRequestFullscreen();
    }
  }

  /**
  * the main render function. Called in a requestAnimationFrame loop
  */
  render() {
    this.stats.begin();
    this.updateCameraIfRequired();

    // update the animation if contents were provided
    if (this.activeCamera !== undefined && this.activeCamera !== null) {
      this.contents.update();
    }

    this.controller.controlMovement();
    this.controller.controlCamera();

    // required if controls.enableDamping or controls.autoRotate are set to true
    // this.controls.update(); // not related to fps camera

    // render the scene
    this.renderer.render(this.scene, this.activeCamera);

    // subsequent async calls to the render loop
    requestAnimationFrame(this.render.bind(this));

    // this.lastCameraName = this.activeCameraName;
    this.stats.end();
  }
}

export { App };
