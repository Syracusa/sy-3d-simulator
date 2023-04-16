import * as THREE from 'three';
import { Vector3 } from 'three';

export class FlyingPerspectiveCamera {

    constructor(screen_ratio) {
        this.screenRatio = screen_ratio;
        this.camLookat = new Vector3(40, 10, 40);

        this.camera = new THREE.PerspectiveCamera();
        this.camera.near = 0.1;
        this.camera.far = 2000;

        this.CamXzAngle = Math.PI * 5 / 3;
        this.CamYAngle = Math.PI * 5 / 3;
        this.CamdirDiameter = 40.0;

        this.ViewScale = 25;

        this.UpdateCameraPositionByLookAt();
        this.camera.updateProjectionMatrix();

        // this.GetClose(0.01);
        // this.ViewBottom(0.01);
        // this.camera.updateProjectionMatrix();
        // this.UpdateLookat();
    }

    updateScreenRatio(screen_ratio) {
        this.screenRatio = screen_ratio;

        this.camera.left = -1 * this.ViewScale * this.screenRatio;
        this.camera.right = this.ViewScale * this.screenRatio;
        this.camera.updateProjectionMatrix();
    }

    UpdateCameraPositionByLookAt(){
        let camPos = new Vector3().setFromSphericalCoords(this.CamdirDiameter, this.CamYAngle, this.CamXzAngle);
        camPos.add(this.camLookat);
        this.camera.position.copy(camPos);

        this.camLookDir = Math.atan2(this.camera.position.z - this.camLookat.z, 
            this.camera.position.x - this.camLookat.x) + Math.PI;
    }

    GoAngle(angle, scalar) {
        this.camLookat.x += 0.1 * Math.cos(angle) * scalar * this.ViewScale / 5;
        this.camLookat.z += 0.1 * Math.sin(angle) * scalar * this.ViewScale / 5;
    }

    GoFront(scalar) {
        this.GoAngle(this.camLookDir, scalar);
    }

    GoBack(scalar) {
        this.GoAngle(this.camLookDir + Math.PI, scalar);
    }

    GoLeft(scalar) {
        this.GoAngle(this.camLookDir + Math.PI * 3 / 2, scalar);
    }

    GoRight(scalar) {
        this.GoAngle(this.camLookDir + Math.PI * 1 / 2, scalar);
    }

    GoUp(scalar) {
        this.camLookat.position.y += 0.1 * scalar;
    }

    GoDown(scalar) {
        this.camLookat.position.y -= 0.1 * scalar;
    }

    ViewFar(scalar) {
        this.CamdirDiameter += 0.1 * scalar;
    }

    ViewNear(scalar) {
        this.CamdirDiameter -= 0.1 * scalar;
    }

    ViewUp(scalar) {
        this.CamYAngle += 0.01 * scalar;
        // this.camLookat.y += 0.1 * scalar;
        // if (this.camLookat.y > this.camera.position.y + 18)
        //     this.camLookat.y = this.camera.position.y + 18;

        // this.CamdirDiameter = 20.0 - Math.abs(this.camera.position.y - this.camLookat.y);

        // this.UpdateLookat();
    }

    ViewBottom(scalar) {
        this.CamYAngle -= 0.01 * scalar;
        // this.camLookat.y -= 0.1 * scalar;
        // if (this.camLookat.y < this.camera.position.y - 18)
        //     this.camLookat.y = this.camera.position.y - 18;

        // this.CamdirDiameter = 20.0 - Math.abs(this.camera.position.y - this.camLookat.y);
        // this.UpdateLookat();
    }

    GetClose(scalar) {
        this.camLookat.y -= 1 * scalar;
    }

    RightRotate(scalar) {
        this.CamXzAngle += 0.01 * scalar;
        // this.CamXzAngle += 0.005 * scalar;
        // if (this.CamXzAngle > 2 * Math.PI) {
        //     this.CamXzAngle -= 2 * Math.PI;
        // }
        // this.camLookat.x = this.camera.position.x + this.CamdirDiameter * Math.cos(this.CamXzAngle);
        // this.camLookat.z = this.camera.position.z + this.CamdirDiameter * Math.sin(this.CamXzAngle);
    }

    LeftRotate(scalar) {
        this.CamXzAngle -= 0.01 * scalar;
        // this.CamXzAngle -= 0.005 * scalar;
        // if (this.CamXzAngle < 0) {
        //     this.CamXzAngle += 2 * Math.PI;
        // }
        // this.camLookat.x = this.camera.position.x + this.CamdirDiameter * Math.cos(this.CamXzAngle);
        // this.camLookat.z = this.camera.position.z + this.CamdirDiameter * Math.sin(this.CamXzAngle);
    }

    UpdateCamera() {
        this.UpdateCameraPositionByLookAt();
        this.camera.lookAt(this.camLookat);
        this.camera.updateProjectionMatrix();
    }
}