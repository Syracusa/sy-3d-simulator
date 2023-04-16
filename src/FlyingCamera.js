import * as THREE from 'three';
import { Vector3 } from 'three';

export class FlyingCamera {

    constructor(screen_ratio) {
        this.screenRatio = screen_ratio;
        this.camLookat = new Vector3(0, 90, 0);

        this.camera = new THREE.camera();
        this.camera.near = 0;
        this.camera.far = 1000;

        this.camera.position.set(8, 100, 117);


        this.CamdirAngle = Math.PI * 5 / 3;
        this.CamdirDiameter = 40.0;

        this.ViewScale = 25;

        this.GetClose(0.01);
        this.ViewBottom(0.01);
        this.camera.updateProjectionMatrix();
        this.UpdateLookat();
    }

    updateScreenRatio(screen_ratio) {
        this.screenRatio = screen_ratio;

        this.camera.left = -1 * this.ViewScale * this.screenRatio;
        this.camera.right = this.ViewScale * this.screenRatio;
        this.camera.updateProjectionMatrix();
    }

    UpdateLookat() { 
        this.camLookat.x = this.camera.position.x + this.CamdirDiameter * Math.cos(this.CamdirAngle);
        this.camLookat.z = this.camera.position.z + this.CamdirDiameter * Math.sin(this.CamdirAngle);
    }

    GoAngle(angle, scalar) {
        this.camera.position.x += 0.1 * Math.cos(angle) * scalar * this.ViewScale / 5;
        this.camera.position.z += 0.1 * Math.sin(angle) * scalar * this.ViewScale / 5;
        this.UpdateLookat();
    }

    GoFront(scalar) {
        this.GoAngle(this.CamdirAngle, scalar);
    }

    GoBack(scalar) {
        this.GoAngle(this.CamdirAngle + Math.PI, scalar);
    }

    GoLeft(scalar) {
        this.GoAngle(this.CamdirAngle + Math.PI * 3 / 2, scalar);
    }

    GoRight(scalar) {
        this.GoAngle(this.CamdirAngle + Math.PI * 1 / 2, scalar);
    }

    GoUp(scalar) {
        this.camera.position.y += 0.1 * scalar;
        if (this.camera.position.y > 100)
            this.camera.position.y = 100;
    }

    GoDown(scalar) {
        this.camera.position.y -= 0.1 * scalar;
        if (this.camera.position.y < this.ViewScale)
            this.camera.position.y = this.ViewScale;
    }

    ViewFar(scalar) {
        this.CamdirDiameter += 0.1 * scalar;
        this.UpdateLookat();
    }

    ViewNear(scalar) {
        this.CamdirDiameter -= 0.1 * scalar;
        if (this.CamdirDiameter < 0.5) {
            this.CamdirDiameter = 0.5;
        }

        this.UpdateLookat();
    }

    ViewUp(scalar) {
        this.camLookat.y += 0.1 * scalar;
        if (this.camLookat.y > this.camera.position.y + 18)
            this.camLookat.y = this.camera.position.y + 18;

        this.CamdirDiameter = 20.0 - Math.abs(this.camera.position.y - this.camLookat.y);

        this.UpdateLookat();
    }

    ViewBottom(scalar) {
        this.camLookat.y -= 0.1 * scalar;
        if (this.camLookat.y < this.camera.position.y - 18)
            this.camLookat.y = this.camera.position.y - 18;

        this.CamdirDiameter = 20.0 - Math.abs(this.camera.position.y - this.camLookat.y);
        this.UpdateLookat();
    }

    GetClose(scalar) {
        this.ViewScale -= scalar;
        if (this.ViewScale < 2)
            this.ViewScale = 2;

        this.camera.top = this.ViewScale;
        this.camera.bottom = this.ViewScale * -1;
        this.camera.left = this.ViewScale * -1 * this.screenRatio;
        this.camera.right = this.ViewScale * this.screenRatio;
        this.camera.updateProjectionMatrix();
    }

    RightRotate(scalar) {
        this.CamdirAngle += 0.005 * scalar;
        if (this.CamdirAngle > 2 * Math.PI) {
            this.CamdirAngle -= 2 * Math.PI;
        }
        this.camLookat.x = this.camera.position.x + this.CamdirDiameter * Math.cos(this.CamdirAngle);
        this.camLookat.z = this.camera.position.z + this.CamdirDiameter * Math.sin(this.CamdirAngle);
    }

    LeftRotate(scalar) {
        this.CamdirAngle -= 0.005 * scalar;
        if (this.CamdirAngle < 0) {
            this.CamdirAngle += 2 * Math.PI;
        }
        this.camLookat.x = this.camera.position.x + this.CamdirDiameter * Math.cos(this.CamdirAngle);
        this.camLookat.z = this.camera.position.z + this.CamdirDiameter * Math.sin(this.CamdirAngle);
    }

    UpdateCamera() {
        this.camera.lookAt(this.camLookat);
        this.camera.updateProjectionMatrix();
    }
}