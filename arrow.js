import * as THREE from 'three'

export class ArrowShape {
    constructor(scene) {
        this.scene = scene;
        this.createArrow();

        let vStart = new THREE.Vector3(10, 10, 10);
        let vEnd = new THREE.Vector3(15, 15, 15);

        this.reposition(vStart, vEnd);
        // this.test();
    }

    test(){
        const geometry = new THREE.ConeGeometry(1, 4, 32);
        const material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
        let cone = new THREE.Mesh(geometry, material);
        cone.position.set(0,0,0);
        
        let target = new THREE.Vector3(1, -1, 1);
        const direction = target.clone().normalize();
        const angleXZ = Math.atan2(direction.x, direction.z);
        const angleY = Math.acos(direction.y);
        const euler = new THREE.Euler(-angleY, angleXZ + Math.PI, 0, 'YXZ');

        cone.rotation.copy(euler);
        this.scene.add(cone);
    }

    reposition(vStart, vEnd) {
        let length = vStart.distanceTo(vEnd);
        let rotation = vEnd.clone();
        rotation.sub(vStart);

        let cylinderPos = new THREE.Vector3().lerpVectors(vStart, vEnd, 0.3);
        let conePos = new THREE.Vector3().lerpVectors(vStart, vEnd, 0.9);

        this.cone.position.copy(conePos);
        this.cylinder.position.copy(cylinderPos);

        const direction = rotation.clone().normalize();
        const angleXZ = Math.atan2(direction.x, direction.z);
        const angleY = Math.acos(direction.y);
        const euler = new THREE.Euler(-angleY, angleXZ + Math.PI, 0, 'YXZ');

        this.cone.rotation.copy(euler);
        this.cylinder.rotation.copy(euler);
    }

    createArrow() {
        this.createCone();
        this.createCylinder();
    }

    createCone() {
        const geometry = new THREE.ConeGeometry(0.5, 2, 32);
        const material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
        this.cone = new THREE.Mesh(geometry, material);
        this.scene.add(this.cone);
    }

    createCylinder() {
        const geometry = new THREE.CylinderGeometry(0.2, 0.2, 9, 32);
        const material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
        this.cylinder = new THREE.Mesh(geometry, material);

        this.scene.add(this.cylinder);
    }
}