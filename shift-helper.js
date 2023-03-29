import * as THREE from 'three'
import { Vector3 } from 'three';
import { ArrowShape } from './arrow.js';

export class ShiftHelper {
    constructor(scene, cam, target) {
        this.scene = scene;
        this.cam = cam;
        this.targetPos = target.position.clone();
        this.drawXYZArrows();
    }

    drawArrow(name, color, to) {
        let arrow = new ArrowShape(this.scene, this.targetPos, to);
        arrow.setColor(color);
        arrow.setMeshName(name);
        arrow.setIntersectHandler(() => {
            arrow.setTempColor(0xFFFF00);
        });
        arrow.setIntersectOutHandler(() => {
            arrow.setOriginalColor();
        });
        arrow.setOnMouseDownHandler(() => {
            console.log("Mouse down on " + name);
        });
        return arrow;
    }

    toWindowPos (pos) {
        pos.x = Math.round( (   pos.x + 1 ) * window.innerWidth  / 2 ),
        pos.y = Math.round( ( - pos.y + 1 ) * window.innerHeight / 2 );
        pos.z = 0;
    }

    drawXYZArrows() {
        let xArrowTo = this.targetPos.clone();
        xArrowTo.x += 8;
        this.arrowX = this.drawArrow('X_Arrow', 0xFF0000, xArrowTo);

        console.log(this.cam.position);
        console.log(this.targetPos);

        let xcPosStart = this.targetPos.clone().project(this.cam);
        let xcPosEnd = xArrowTo.clone().project(this.cam);

        console.log(xcPosStart);
        console.log(xcPosEnd);

        let yArrowTo = this.targetPos.clone();
        yArrowTo.y += 8;
        this.arrowY = this.drawArrow('Y_Arrow', 0x00FF00, yArrowTo);

        let ycPosStart = this.targetPos.clone().project(this.cam);
        let ycPosEnd = yArrowTo.clone().project(this.cam);

        console.log(ycPosStart);
        console.log(ycPosEnd);

        let zArrowTo = this.targetPos.clone();
        zArrowTo.z += 8;
        this.arrowZ = this.drawArrow('Z_Arrow', 0x0000FF, zArrowTo);
    }
}