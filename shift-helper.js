import * as THREE from 'three'
import { Vector3 } from 'three';
import { ArrowShape } from './arrow.js';

export class ShiftHelper {
    constructor(scene, target) {
        this.scene = scene;
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

    drawXYZArrows() {
        let xArrowTo = this.targetPos.clone();
        xArrowTo.x += 8;
        this.arrowX = this.drawArrow('X_Arrow', 0xFF0000, xArrowTo);

        let yArrowTo = this.targetPos.clone();
        yArrowTo.y += 8;
        this.arrowY = this.drawArrow('Y_Arrow', 0x00FF00, yArrowTo);

        let zArrowTo = this.targetPos.clone();
        zArrowTo.z += 8;
        this.arrowZ = this.drawArrow('Z_Arrow', 0x0000FF, zArrowTo);
    }
}