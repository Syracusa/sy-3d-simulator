import * as THREE from 'three';
import { Vector3 } from 'three';

export class Camera {

    constructor(screen_ratio) {
        this.screenRatio = screen_ratio;
        this.CamLookat = new Vector3(0, 40, 0);

        this._camera = new THREE.OrthographicCamera();
        this._camera.near = 0;
        this._camera.far = 1000;

        this._camera.position.set(34, 50, 76);

        this.CamdirAngle = Math.PI * 5 / 3;
        this.CamdirDiameter = 20.0;

        this.ViewScale = 16;

        this.GetClose(0.01);
        this.ViewBottom(0.01);
        this._camera.updateProjectionMatrix();
        this.UpdateLookat();
    }

    updateScreenRatio(screen_ratio) {
        this.screenRatio = screen_ratio;

        this._camera.left = -1 * this.ViewScale * this.screenRatio;
        this._camera.right = this.ViewScale * this.screenRatio;
        this._camera.updateProjectionMatrix();
    }

    UpdateLookat() { 
        this.CamLookat.x = this._camera.position.x + this.CamdirDiameter * Math.cos(this.CamdirAngle);
        this.CamLookat.z = this._camera.position.z + this.CamdirDiameter * Math.sin(this.CamdirAngle);
    }

    GoAngle(angle, scalar) {
        this._camera.position.x += 0.1 * Math.cos(angle) * scalar * this.ViewScale / 5;
        this._camera.position.z += 0.1 * Math.sin(angle) * scalar * this.ViewScale / 5;
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
        this._camera.position.y += 0.1 * scalar;
        if (this._camera.position.y > 100)
            this._camera.position.y = 100;
    }

    GoDown(scalar) {
        this._camera.position.y -= 0.1 * scalar;
        if (this._camera.position.y < this.ViewScale)
            this._camera.position.y = this.ViewScale;
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
        if (this.CamLookat.y > this._camera.position.y + 18)
            this.CamLookat.y = this._camera.position.y + 18;

        this.CamdirDiameter = 20.0 - Math.abs(this._camera.position.y - this.CamLookat.y);

        this.UpdateLookat();
    }

    ViewBottom(scalar) {
        this.CamLookat.y -= 0.1 * scalar;
        if (this.CamLookat.y < this._camera.position.y - 18)
            this.CamLookat.y = this._camera.position.y - 18;

        this.CamdirDiameter = 20.0 - Math.abs(this._camera.position.y - this.CamLookat.y);
        this.UpdateLookat();
    }

    GetClose(scalar) {
        this.ViewScale -= scalar;
        if (this.ViewScale < 2)
            this.ViewScale = 2;

        this._camera.top = this.ViewScale;
        this._camera.bottom = this.ViewScale * -1;
        this._camera.left = this.ViewScale * -1 * this.screenRatio;
        this._camera.right = this.ViewScale * this.screenRatio;
        this._camera.updateProjectionMatrix();
    }

    RightRotate(scalar) {
        this.CamdirAngle += 0.005 * scalar;
        if (this.CamdirAngle > 2 * Math.PI) {
            this.CamdirAngle -= 2 * Math.PI;
        }
        this.CamLookat.x = this._camera.position.x + this.CamdirDiameter * Math.cos(this.CamdirAngle);
        this.CamLookat.z = this._camera.position.z + this.CamdirDiameter * Math.sin(this.CamdirAngle);
    }

    LeftRotate(scalar) {
        this.CamdirAngle -= 0.005 * scalar;
        if (this.CamdirAngle < 0) {
            this.CamdirAngle += 2 * Math.PI;
        }
        this.CamLookat.x = this._camera.position.x + this.CamdirDiameter * Math.cos(this.CamdirAngle);
        this.CamLookat.z = this._camera.position.z + this.CamdirDiameter * Math.sin(this.CamdirAngle);
    }

    UpdateCamera() {
        this._camera.lookAt(this.CamLookat);
        this._camera.updateProjectionMatrix();
    }
}