import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Shadows } from '../Aux/Shadows.js';


class Toilet extends SceneObject {

  /**
   * Constructor for the Skibidi Rizz Toilet object
   * @param { MyApp } app - Reference to the app
   * @param { string } name - Name of the object
   * @param { number } x - Initial x position
   * @param { number } y - Initial y position
   * @param { number } z - Initial z position
   */
  constructor(app, name, x = 0, y = 0, z = 0) {
    super(app, name, x, y, z);
    this.loadSkibidiHead();
  }

  /**
   * Load the Skibidi head model from a GLB file and position it
   */
  loadSkibidiHead() {
    const loader = new GLTFLoader();

    loader.load('../Models/skibiditoiletmale07.glb', (gltf) => {
      const head = gltf.scene;

      head.scale.set(2.7, 2.7, 2.7);

      head.traverse((node) => {
        if (node.isMesh) {
          Shadows.enableShadows(node);
        }
      });

      this.sceneObject.add(head);

    }, undefined, (error) => {
      console.error('An error occurred while loading the Skibidi head model:', error);
    });
  }

}

export { Toilet };
