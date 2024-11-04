import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { App } from './App.js';
import { Contents } from './Contents.js';


/**
  This class customizes the gui interface for the app
*/
class GuiInterface  {

  /**
   * 
   * @param { App } app The application object 
   */
  constructor(app) {
    this.app = app;
    this.datgui =  new GUI();
    this.contents = null;
  }

  /**
   * Set the contents object
   * @param { Contents } contents the contents objects 
   */
  setContents(contents) {
    this.contents = contents;
  }

  /**
   * Initialize the gui interface
   */
  init() {
    this.initObjectFolder();
    this.initCameraFolder();
    this.initCeilingLightFolder();
    this.initSpotLightFolder();
  }

  initCameraFolder() {
    const cameraFolder = this.datgui.addFolder('Camera');
    cameraFolder.add(this.app, 'activeCameraName', ['Perspective']).name("active camera");
    cameraFolder.add(this.app.activeCamera.position, 'x', -10, 10).name("x coord");
    cameraFolder.open();
  }

  initSpotLightFolder() {
    const spotLightFolder = this.datgui.addFolder('Spotlight');
    const spotLightParameters = {
      'color': 0xffffff,
      'intensity': 10,
      'limit_distance': 20,
      'angle': Math.PI / 9,
      'penumbra': 0.05,
      'decay': 0.5,
      'target_x': 5,
      'target_y': 0,
      'target_z': 5,
    };

    spotLightFolder.addColor(spotLightParameters, 'color').name("Color").onChange((value) => {
      this.contents.spotLight.spotlight.color = value;
    });
    spotLightFolder.add(spotLightParameters, 'intensity', 0, 20).name("Intensity").onChange((value) => {
      this.contents.spotLight.spotlight.intensity = value;
    });
    spotLightFolder.add(spotLightParameters, 'limit_distance', 0, 50).name("Limit Distance").onChange((value) => {
      this.contents.spotLight.spotlight.distance = value;
    });
    spotLightFolder.add(spotLightParameters, 'angle', 0, Math.PI / 2).name("Angle").onChange((value) => {
      this.contents.spotLight.spotlight.angle = value;
    });
    spotLightFolder.add(spotLightParameters, 'penumbra', 0, 1).name("Penumbra").onChange((value) => {
      this.contents.spotLight.spotlight.penumbra = value;
    });
    spotLightFolder.add(spotLightParameters, 'decay', 0, 3).name("Decay").onChange((value) => {
      this.contents.spotLight.spotlight.decay = value;
    });
    spotLightFolder.add(spotLightParameters, 'target_x', -5, 5).name("Target X").onChange((value) => {
      const spotlightTargetPos = this.contents.spotLight.relativeTarget;
      this.contents.spotLight.setTargetPosition(value, spotlightTargetPos.y, spotlightTargetPos.z);
      this.contents.spotLight.rotateHead();
    });
    spotLightFolder.add(spotLightParameters, 'target_z', -5, 5).name("Target Z").onChange((value) => {
      const spotlightTargetPos = this.contents.spotLight.relativeTarget;
      this.contents.spotLight.setTargetPosition(spotlightTargetPos.x, spotlightTargetPos.y, value);
      this.contents.spotLight.rotateHead();
    });

    spotLightFolder.open();
  } 

  initCeilingLightFolder() {
    const ceilingLightFolder = this.datgui.addFolder('Ceiling Light');

    const ceilingLightParameters = {
      'intensity': 115,
    };
    
    ceilingLightFolder.add(ceilingLightParameters, 'intensity', 0, 250).name('Intensity').onChange((value) => {
      this.contents.ceilingLight.pointLight.intensity = value;
    });
  }

  initObjectFolder() { }

}

export { GuiInterface };
