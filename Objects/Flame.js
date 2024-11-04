import * as THREE from 'three';
import { SceneObject } from './SceneObject.js';

class Flame extends SceneObject {
  /**
   * Constructor for the Flame subclass of SceneObject
   * @param { app } app - app reference
   * @param { string } name - Flame name
   * @param { number } x - Initial x coordinate
   * @param { number } y - Initial y coordinate
   * @param { number } z - Initial z coordinate
   * @param { number } radius - Radius of the flame base
   * @param { number } height - Height of the flame
   */
  constructor(app, name, x = 0, y = 0, z = 0, radius = 0.04, height = 0.8) {
    super(app, name, x, y, z);

    this.radius = radius;
    this.height = height;

    this.translate(x, y, z); // add like a stick in the candle from which the fire comes out
    
    this.initMaterials();
    this.initParticles();
  }

  /**
   * Flame's initMaterials() implementation
   */
  initMaterials() {
    this.material = new THREE.PointsMaterial({
      color: '#FF4500',
      size: 0.02,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }

  /**
   * Initialize the particle system for the flame.
   */
  initParticles() {
    this.particleCount = 100;
    this.particles = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const lifetimes = new Float32Array(this.particleCount);

    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * this.radius;
      positions[i * 3 + 1] = Math.random() * this.height / 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * this.radius;

      lifetimes[i] = Math.random() * 1.5;
    }

    this.particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particles.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));

    this.particleSystem = new THREE.Points(this.particles, this.material);
    this.sceneObject.add(this.particleSystem);

    this.clock = new THREE.Clock();
  }

  /**
   * Update the particle system for the flame.
   */
  updateParticles() {
    const delta = this.clock.getDelta();
    const positions = this.particles.getAttribute('position').array;
    const lifetimes = this.particles.getAttribute('lifetime').array;

    for (let i = 0; i < this.particleCount; i++) {
      lifetimes[i] -= delta;

      if (lifetimes[i] <= 0) {
        positions[i * 3] = (Math.random() - 0.5) * this.radius;
        positions[i * 3 + 1] = 0.0;
        positions[i * 3 + 2] = (Math.random() - 0.5) * this.radius;
        lifetimes[i] = Math.random() * 1.5;
      } else {
        positions[i * 3 + 1] += delta * 0.06;
      }
    }

    this.particles.attributes.position.needsUpdate = true;
    this.particles.attributes.lifetime.needsUpdate = true;
  }

  /**
   * Flame's build() implementation
   */
  build() { }

  /**
   * Call this method in your animation loop to update the flame particles.
   */
  update() {
    this.updateParticles();
  }
}

export { Flame };
