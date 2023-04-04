import * as THREE from 'three'

export class Bulb {
    constructor(scene, pos) {
        let bulbMesh = this.genBulbMesh();
        scene.add(builbMesh);

        this.builbMesh = builbMesh;
        this.scene = scene;
    }

    genBulbMesh() {
        const geometry = new THREE.SphereGeometry(1, 8, 8);
        const material= new THREE.MeshStandardMaterial({
            color: 0xffffff
        });

        return new THREE.Mesh(geometry, material);
    }

    getBulbLight() {
        // TODO
    }

}