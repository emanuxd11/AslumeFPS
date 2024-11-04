import * as THREE from 'three';
import { Shadows } from '../Aux/Shadows.js';
import { SceneObject } from './SceneObject.js';


class Sink extends SceneObject {
  /**
   * Constructor for the WallMountedSink object
   * @param {MyApp} app - Reference to the app
   * @param {string} name - Name of the object
   * @param {number} x - Initial x position
   * @param {number} y - Initial y position
   * @param {number} z - Initial z position
   */
  constructor(app, name, x = 0, y = 0, z = 0, rotation = 0) {
    super(app, name, x, y, z, rotation);

    // Initialize sink dimension variables
    this.dimensions = {
      baseWidth: 1.3,
      baseDepth: 1.3,
      baseHeight: 0.04,
      cornerRadius: 0.2,
      baseYPosition: 0.85,
      basinRadius: 0.6,
      basinYPosition: 0.85,
      basinSegments: 64,
      faucetHeight: 0.45,
      faucetRadius: 0.02,
      faucetXPosition: 0.5,
      faucetYPosition: 1.076,
      faucetZPosition: 0.4,
      spoutRadius: 0.01,
      spoutLength: 0.15,
      spoutRotationY: -Math.PI / 4,
      spoutRotationZ: Math.PI / 2,
      spoutXPosition: 0.42,
      spoutYPosition: 1.2,
      spoutZPosition: 0.4,
      pipeRadius: 0.05,
      pipeSegments: 20,
      faucetPoints: [
        new THREE.Vector3(0.5, 0.65, 0.4),
        new THREE.Vector3(0.5, 1.2, 0.4),
        new THREE.Vector3(0.35, 1.2, 0.3),
        new THREE.Vector3(0.35, 1.1, 0.3)
      ],
      faucetPositionY: 0.2,
      pipePoints: [
        new THREE.Vector3(0, 0.046, 0),
        new THREE.Vector3(-0.1, -0.6, 0),
        new THREE.Vector3(0.65, -0.6, 0)
      ],
      pipePositionY: 0.2
    };

    this.initMaterials();
    this.build();
  }

  /**
   * Initialize materials for the sink
   */
  initMaterials() {
    this.baseMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc, shininess: 100 });
    this.basinMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 100, metalness: 0.6 });
    this.faucetMaterial = new THREE.MeshPhongMaterial({ color: 0x888888, shininess: 150 });
    this.pipeMaterial = new THREE.MeshPhongMaterial({ color: 0x555555, shininess: 100 });
  }

  /**
   * Build the wall-mounted sink
   */
  build() {
    this.buildBase();
    this.buildBasin();
    this.buildFaucet();
    this.buildPipe();
  }

  /**
   * Build the base of the sink (rectangular)
   */
  buildBase() {
    const { baseWidth, baseDepth, baseHeight, basinRadius, baseYPosition, cornerRadius, basinSegments } = this.dimensions;

    const baseShape = new THREE.Shape();

    baseShape.moveTo(-baseWidth / 2 + cornerRadius, -baseDepth / 2);
    baseShape.lineTo(baseWidth / 2 - cornerRadius, -baseDepth / 2);
    baseShape.quadraticCurveTo(baseWidth / 2, -baseDepth / 2, baseWidth / 2, -baseDepth / 2 + cornerRadius);
    baseShape.lineTo(baseWidth / 2, baseDepth / 2 - cornerRadius);
    baseShape.quadraticCurveTo(baseWidth / 2, baseDepth / 2, baseWidth / 2 - cornerRadius, baseDepth / 2);
    baseShape.lineTo(-baseWidth / 2 + cornerRadius, baseDepth / 2);
    baseShape.quadraticCurveTo(-baseWidth / 2, baseDepth / 2, -baseWidth / 2, baseDepth / 2 - cornerRadius);
    baseShape.lineTo(-baseWidth / 2, -baseDepth / 2 + cornerRadius);
    baseShape.quadraticCurveTo(-baseWidth / 2, -baseDepth / 2, -baseWidth / 2 + cornerRadius, -baseDepth / 2);

    const holePath = new THREE.Path();
    for (let i = 0; i < basinSegments; i++) {
      const angle = (i / basinSegments) * Math.PI * 2;
      const x = Math.cos(angle) * basinRadius;
      const y = Math.sin(angle) * basinRadius;
      if (i === 0) {
        holePath.moveTo(x, y);
      } else {
        holePath.lineTo(x, y);
      }
    }
    holePath.lineTo(Math.cos(0) * basinRadius, Math.sin(0) * basinRadius);
    baseShape.holes.push(holePath);

    const extrudeSettings = { depth: baseHeight, bevelEnabled: false };
    const baseGeometry = new THREE.ExtrudeGeometry(baseShape, extrudeSettings);

    const base = new THREE.Mesh(baseGeometry, this.baseMaterial);
    base.position.set(0, baseYPosition, 0);
    base.rotation.x = Math.PI / 2;
    Shadows.enableShadows(base);
    this.sceneObject.add(base);
  }

  /**
   * Build the basin (half-sphere for the bowl)
   */
  buildBasin() {
    const { basinRadius, basinYPosition, basinSegments } = this.dimensions;

    // visible from outside
    const basinGeometry = new THREE.SphereGeometry(basinRadius * 1.05, basinSegments, basinSegments, 0, Math.PI * 2, 0, Math.PI / 2);
    const outerBasin = new THREE.Mesh(basinGeometry, this.basinMaterial);
    outerBasin.rotation.x = -Math.PI / 1;
    outerBasin.position.set(0, basinYPosition, 0);
    Shadows.enableShadows(outerBasin);
    this.sceneObject.add(outerBasin);

    // visible from inside
    const innerBasinGeometry = new THREE.SphereGeometry(basinRadius * 1, basinSegments, basinSegments, 0, Math.PI * 2, 0, Math.PI / 2);
    const innerBasinMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 100,
      metalness: 0.6,
      side: THREE.BackSide
    });
    const innerBasin = new THREE.Mesh(innerBasinGeometry, innerBasinMaterial);
    innerBasin.rotation.x = -Math.PI / 1;
    innerBasin.position.set(0, basinYPosition, 0);
    Shadows.enableShadows(innerBasin);
    this.sceneObject.add(innerBasin);
  }

  /**
   * Build the faucet (cylinder for the spout, torus for the handle)
   */
  buildFaucet() {
    const { faucetPoints, faucetRadius, faucetSegments, faucetPositionY } = this.dimensions;

    const faucetCurve = new THREE.CatmullRomCurve3(faucetPoints);
    const faucetGeometry = new THREE.TubeGeometry(faucetCurve, faucetSegments, faucetRadius, 8, false);
    const faucet = new THREE.Mesh(faucetGeometry, this.faucetMaterial);
    faucet.position.set(0, faucetPositionY, 0);
    Shadows.enableShadows(faucet);
    this.sceneObject.add(faucet);
  }

  /**
   * Build the curved pipe below the sink
   */
  buildPipe() {
    const { pipePoints, pipeRadius, pipeSegments, pipePositionY } = this.dimensions;

    const pipeCurve = new THREE.CatmullRomCurve3(pipePoints);

    const pipeGeometry = new THREE.TubeGeometry(pipeCurve, pipeSegments, pipeRadius, 8, false);
    const pipe = new THREE.Mesh(pipeGeometry, this.pipeMaterial);
    pipe.position.set(0, pipePositionY, 0);
    Shadows.enableCastShadows(pipe);
    this.sceneObject.add(pipe);
  }

}

export { Sink };
