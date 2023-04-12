import * as THREE from 'three';
import { Vector3 } from 'three';

export class FlyingCamera {

    constructor(screen_ratio) {
        this.screenRatio = screen_ratio;
        this.CamLookat = new Vector3(0, 90, 0);

        this.orthographicCamera = new THREE.OrthographicCamera();
        this.orthographicCamera.near = 0;
        this.orthographicCamera.far = 1000;

        this.orthographicCamera.position.set(8, 100, 117);


        this.CamdirAngle = Math.PI * 5 / 3;
        this.CamdirDiameter = 40.0;

        this.ViewScale = 25;

        this.GetClose(0.01);
        this.ViewBottom(0.01);
        this.orthographicCamera.updateProjectionMatrix();
        this.UpdateLookat();
    }

    updateScreenRatio(screen_ratio) {
        this.screenRatio = screen_ratio;

        this.orthographicCamera.left = -1 * this.ViewScale * this.screenRatio;
        this.orthographicCamera.right = this.ViewScale * this.screenRatio;
        this.orthographicCamera.updateProjectionMatrix();
    }

    UpdateLookat() { 
        this.CamLookat.x = this.orthographicCamera.position.x + this.CamdirDiameter * Math.cos(this.CamdirAngle);
        this.CamLookat.z = this.orthographicCamera.position.z + this.CamdirDiameter * Math.sin(this.CamdirAngle);
    }

    GoAngle(angle, scalar) {
        this.orthographicCamera.position.x += 0.1 * Math.cos(angle) * scalar * this.ViewScale / 5;
        this.orthographicCamera.position.z += 0.1 * Math.sin(angle) * scalar * this.ViewScale / 5;
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
        this.orthographicCamera.position.y += 0.1 * scalar;
        if (this.orthographicCamera.position.y > 100)
            this.orthographicCamera.position.y = 100;
    }

    GoDown(scalar) {
        this.orthographicCamera.position.y -= 0.1 * scalar;
        if (this.orthographicCamera.position.y < this.ViewScale)
            this.orthographicCamera.position.y = this.ViewScale;
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
        this.CamLookat.y += 0.1 * scalar;
        if (this.CamLookat.y > this.orthographicCamera.position.y + 18)
            this.CamLookat.y = this.orthographicCamera.position.y + 18;

        this.CamdirDiameter = 20.0 - Math.abs(this.orthographicCamera.position.y - this.CamLookat.y);

        this.UpdateLookat();
    }

    ViewBottom(scalar) {
        this.CamLookat.y -= 0.1 * scalar;
        if (this.CamLookat.y < this.orthographicCamera.position.y - 18)
            this.CamLookat.y = this.orthographicCamera.position.y - 18;

        this.CamdirDiameter = 20.0 - Math.abs(this.orthographicCamera.position.y - this.CamLookat.y);
        this.UpdateLookat();
    }

    GetClose(scalar) {
        this.ViewScale -= scalar;
        if (this.ViewScale < 2)
            this.ViewScale = 2;

        this.orthographicCamera.top = this.ViewScale;
        this.orthographicCamera.bottom = this.ViewScale * -1;
        this.orthographicCamera.left = this.ViewScale * -1 * this.screenRatio;
        this.orthographicCamera.right = this.ViewScale * this.screenRatio;
        this.orthographicCamera.updateProjectionMatrix();
    }

    RightRotate(scalar) {
        this.CamdirAngle += 0.005 * scalar;
        if (this.CamdirAngle > 2 * Math.PI) {
            this.CamdirAngle -= 2 * Math.PI;
        }
        this.CamLookat.x = this.orthographicCamera.position.x + this.CamdirDiameter * Math.cos(this.CamdirAngle);
        this.CamLookat.z = this.orthographicCamera.position.z + this.CamdirDiameter * Math.sin(this.CamdirAngle);
    }

    LeftRotate(scalar) {
        this.CamdirAngle -= 0.005 * scalar;
        if (this.CamdirAngle < 0) {
            this.CamdirAngle += 2 * Math.PI;
        }
        this.CamLookat.x = this.orthographicCamera.position.x + this.CamdirDiameter * Math.cos(this.CamdirAngle);
        this.CamLookat.z = this.orthographicCamera.position.z + this.CamdirDiameter * Math.sin(this.CamdirAngle);
    }

    UpdateCamera() {
        this.orthographicCamera.lookAt(this.CamLookat);
        this.orthographicCamera.updateProjectionMatrix();
    }
}