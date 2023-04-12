import * as THREE from 'three'

export class DragHelper {
    constructor(mainScene, x1, y1, x2, y2) {

        /* Make square with NDC */
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            x1, y1, -1.0,
            x1, y2, -1.0,
            x2, y1, -1.0,
            x1, y2, -1.0,
            x2, y1, -1.0,
            x2, y2, -1.0
        ]);

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const mesh = new THREE.Mesh(geometry, material);

        /* Convert to world coordinate */


        /* Add to Scene */
    }

    updateDraw() {
        /* Dispose current square */

        /* Draw new one */
    }
}