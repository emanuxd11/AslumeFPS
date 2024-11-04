import * as THREE from 'three';
import { NURBSSurface } from 'three/addons/curves/NURBSSurface.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';


export const nurbsGenerator = {

  /**
   * Create a NURBS surface.
   * @method
   * @param {number} x - X-coordinate of the surface's position.
   * @param {number} y - Y-coordinate of the surface's position.
   * @param {number} z - Z-coordinate of the surface's position.
   * @param {Array} controlPoints - Control points for the NURBS surface.
   * @param {number} orderU - The order in the U direction.
   * @param {number} orderV - The order in the V direction.
   * @param {number} samplesU - Number of samples in the U direction (default is 10).
   * @param {number} samplesV - Number of samples in the V direction (default is 10).
   * @returns {THREE.Mesh} The NURBS surface mesh.
   */
  createNurbsSurfaces(x, y, z, controlPoints, orderU, orderV, samplesU = 10, samplesV = 10) {
    const material = new THREE.MeshPhongMaterial({
      color: 0xFFFFFF,
      side: THREE.DoubleSide,
    });

    const surfaceData = this.buildNurbsSurface(controlPoints, orderU, orderV, samplesU, samplesV);
    const mesh = new THREE.Mesh(surfaceData, material);
    mesh.position.set(x, y, z);

    return mesh;
  },

  /**
   * Create a double-sided NURBS surface.
   * @method
   * @param {number} x - X-coordinate of the surface's position.
   * @param {number} y - Y-coordinate of the surface's position.
   * @param {number} z - Z-coordinate of the surface's position.
   * @param {Array} controlPoints - Control points for the NURBS surface.
   * @param {number} orderU - The order in the U direction.
   * @param {number} orderV - The order in the V direction.
   * @param {number} samplesU - Number of samples in the U direction (default is 10).
   * @param {number} samplesV - Number of samples in the V direction (default is 10).
   * @param {THREE.Texture} texture - texture to add to the nurbs surface.
   * @returns {THREE.Mesh} The double-sided NURBS surface mesh.
   */
  createDoubleSidedNurbsSurfaces(x, y, z, controlPoints, orderU, orderV, samplesU = 10, samplesV = 10, texture) {
    const material = new THREE.MeshPhongMaterial({
      color: 0xFFFFFF,
      side: THREE.DoubleSide,
      map: texture
    });

    const surfaceData = this.buildNurbsSurface(controlPoints, orderU, orderV, samplesU, samplesV);
    const mesh = new THREE.Mesh(surfaceData, material);
    mesh.position.set(x, y, z);

    return mesh;
  },

  /**
   * Build a NURBS surface geometry.
   * @param {Array} controlPoints - Control points for the NURBS surface.
   * @param {number} degree1 - The degree in the U direction.
   * @param {number} degree2 - The degree in the V direction.
   * @param {number} samples1 - Number of samples in the U direction.
   * @param {number} samples2 - Number of samples in the V direction.
   * @returns {THREE.ParametricGeometry} The NURBS surface geometry.
   */
  buildNurbsSurface(controlPoints, degree1, degree2, samples1, samples2) {
    const knots1 = this.createKnots(controlPoints.length, degree1);
    const knots2 = this.createKnots(controlPoints[0].length, degree2);

    const nurbsSurface = new NURBSSurface(degree1, degree2, knots1, knots2, controlPoints.map(row =>
      row.map(point => new THREE.Vector4(...point))
    ));

    return new ParametricGeometry(
      (u, v, target) => nurbsSurface.getPoint(u, v, target),
      samples1,
      samples2
    );
  },

  /**
   * Create knot vectors for NURBS surface.
   * @param {number} length - Number of control points.
   * @param {number} degree - Degree of the NURBS surface.
   * @returns {Array} The knot vector.
   */
  createKnots(length, degree) {
    const knots = Array(degree + 1).fill(0);
    for (let i = 1; i <= length - degree - 1; i++) {
      knots.push(i / (length - degree));
    }
    knots.push(...Array(degree + 1).fill(1));
    return knots;
  }
};
