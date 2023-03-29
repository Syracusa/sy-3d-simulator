import * as THREE from 'three';

export class Camera {

    constructor(screen_ratio) {
        this.screenRatio = screen_ratio;
        this.CamPos = { x: 34, y: 50, z: 76 };
        this.CamLookat = { x: 0, y: 40, z: 0 };

        this.CamdirAngle = Math.PI * 5 / 3;
        this.CamdirDiameter = 20.0 - Math.abs(this.CamPos.y - this.CamLookat.y);
        this.UpdateLookat();

        this.ViewScale = 16;
        this.camera = new THREE.OrthographicCamera(
            -1 * this.ViewScale * this.screenRatio, 
            this.ViewScale * this.screenRatio,
            this.ViewScale, 
            -1 * this.ViewScale,
            -500, 1000);
        this.camera.position.set(this.CamPos.x, this.CamPos.y, this.CamPos.z);

        this.camera.updateProjectionMatrix();
    }

    updateScreenRatio(screen_ratio){
        this.screenRatio = screen_ratio;
        this.camera = new THREE.OrthographicCamera(
            -1 * this.ViewScale * this.screenRatio, 
            this.ViewScale * this.screenRatio,
            this.ViewScale, 
            -1 * this.ViewScale,
            0, 1000);
    }

    UpdateLookat() {
        this.CamLookat.x = this.CamPos.x + this.CamdirDiameter * Math.cos(this.CamdirAngle);
        this.CamLookat.z = this.CamPos.z + this.CamdirDiameter * Math.sin(this.CamdirAngle);
    }

    GoAngle(angle, scalar) {
        this.CamPos.x += 0.1 * Math.cos(angle) * scalar * this.ViewScale / 5;
        this.CamPos.z += 0.1 * Math.sin(angle) * scalar * this.ViewScale / 5;
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
        this.CamPos.y += 0.1 * scalar;
        if (this.CamPos.y > 100)
            this.CamPos.y = 100;
    }

    GoDown(scalar) {
        this.CamPos.y -= 0.1 * scalar;
        if (this.CamPos.y < this.ViewScale)
            this.CamPos.y = this.ViewScale;
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
        if (this.CamLookat.y > this.CamPos.y + 18)
            this.CamLookat.y = this.CamPos.y + 18;
        
        this.CamdirDiameter = 20.0 - Math.abs(this.CamPos.y - this.CamLookat.y);

        this.UpdateLookat();
    }

    ViewBottom(scalar) {
        this.CamLookat.y -= 0.1 * scalar;
        if (this.CamLookat.y < this.CamPos.y - 18)
            this.CamLookat.y = this.CamPos.y - 18;

        this.CamdirDiameter = 20.0 - Math.abs(this.CamPos.y - this.CamLookat.y);
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
        this.CamLookat.x = this.CamPos.x + this.CamdirDiameter * Math.cos(this.CamdirAngle);
        this.CamLookat.z = this.CamPos.z + this.CamdirDiameter * Math.sin(this.CamdirAngle);
    }

    LeftRotate(scalar) {
        this.CamdirAngle -= 0.005 * scalar;
        if (this.CamdirAngle < 0) {
            this.CamdirAngle += 2 * Math.PI;
        }
        this.CamLookat.x = this.CamPos.x + this.CamdirDiameter * Math.cos(this.CamdirAngle);
        this.CamLookat.z = this.CamPos.z + this.CamdirDiameter * Math.sin(this.CamdirAngle);
    }

    UpdateCamera() {
        this.camera.position.set(this.CamPos.x, this.CamPos.y, this.CamPos.z);
        this.camera.lookAt(this.CamLookat.x, this.CamLookat.y, this.CamLookat.z);
    }
}