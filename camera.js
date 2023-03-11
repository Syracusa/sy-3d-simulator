import * as THREE from 'three';

export class Camera {
    constructor() {
        this.CamPos = { x: 10, y: 20, z: 10 };
        this.CamLookat = { x: 5, y: 0, z: 0 };

        this.CamdirAngle = 0.3;
        this.CamdirDiameter = 5;

        this.ViewScale = 10;
        this.camera = new THREE.OrthographicCamera(-1 * this.ViewScale, this.ViewScale,
            this.ViewScale, -1 * this.ViewScale,
            -200, 1000);
        this.camera.position.set(this.CamPos.x, this.CamPos.y, this.CamPos.z);

        this.UpdateLookat();
        this.camera.lookAt(this.CamLookat.x, this.CamLookat.y, this.CamLookat.z);
    }


    UpdateLookat() {
        this.CamLookat.x = this.CamPos.x + this.CamdirDiameter * Math.cos(this.CamdirAngle);
        this.CamLookat.z = this.CamPos.z + this.CamdirDiameter * Math.sin(this.CamdirAngle);
    }

    GoAngle(angle, scalar) {
        this.CamPos.x += 0.1 * Math.cos(angle) * scalar;
        this.CamPos.z += 0.1 * Math.sin(angle) * scalar;
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
        if (this.CamPos.y < 1)
            this.CamPos.y = 1;
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

    GetClose(scalar) {
        this.ViewScale -= scalar;
        if (this.ViewScale < 2)
            this.ViewScale = 2;

        this.camera.top = this.ViewScale;
        this.camera.bottom = this.ViewScale * -1;
        this.camera.left = this.ViewScale * -1;
        this.camera.right = this.ViewScale;
        this.camera.updateProjectionMatrix();
        console.log("Scale :" + this.ViewScale);
    }

    RightRotate(scalar) {
        this.CamdirAngle += 0.01 * scalar;
        if (this.CamdirAngle > 2 * Math.PI) {
            this.CamdirAngle -= 2 * Math.PI;
        }
        this.CamLookat.x = this.CamPos.x + this.CamdirDiameter * Math.cos(this.CamdirAngle);
        this.CamLookat.z = this.CamPos.z + this.CamdirDiameter * Math.sin(this.CamdirAngle);
    }

    LeftRotate(scalar) {
        this.CamdirAngle -= 0.01 * scalar;
        if (this.CamdirAngle < 0) {
            this.CamdirAngle += 2 * Math.PI;
        }
        this.CamLookat.x = this.CamPos.x + this.CamdirDiameter * Math.cos(this.CamdirAngle);
        this.CamLookat.z = this.CamPos.z + this.CamdirDiameter * Math.sin(this.CamdirAngle);
    }

    UpdateCamera() {
        this.camera.position.set(this.CamPos.x, this.CamPos.y, this.CamPos.z);
        this.camera.lookAt(this.CamLookat.x, this.CamLookat.y, this.CamLookat.z);
        // console.log('Campos ' + this.CamPos.x + ' ' + this.CamPos.y + ' ' + this.CamPos.z);
        // console.log('CamLookat ' + this.CamLookat.x + ' ' + this.CamLookat.y + ' ' + this.CamLookat.z);
    }
}