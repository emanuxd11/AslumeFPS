import * as THREE from 'three';


class Shadows {

  static enableShadows(mesh) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  } 

  static enableCastShadows(mesh) {
    mesh.castShadow = true;
  }

  static enableReceiveShadows(mesh) {
    mesh.receiveShadow = true;
  }

}

export { Shadows };
