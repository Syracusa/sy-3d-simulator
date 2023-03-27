import * as THREE from 'three'
import { Vector3 } from 'three';
import { ArrowShape } from './arrow.js';

export class ShiftHelper {
    constructor(scene) {
        this.scene = scene;
        this.targetPos = new Vector3(0, 0, 0);
        this.drawArrows();
    }

    drawArrows() {
        let xdest = this.targetPos.clone();
        xdest.x += 8;
        this.arrowX = new ArrowShape(this.scene, this.targetPos, xdest);
        this.arrowX.setColor(0xFF0000);
        this.arrowX.setDebugName('X_Arrow');
        this.arrowX.setIntersectHandler(() => {
            this.arrowX.setTempColor(0xFFFF00);
        });
        this.arrowX.setIntersectOutHandler(() => {
            this.arrowX.setOriginalColor();
        });

        let ydest = this.targetPos.clone();
        ydest.y += 8;
        this.arrowY = new ArrowShape(this.scene, this.targetPos, ydest);
        this.arrowY.setColor(0x00FF00);
        this.arrowY.setDebugName('Y_Arrow');
        this.arrowY.setIntersectHandler(() => {
            this.arrowY.setTempColor(0xFFFF00);
        });
        this.arrowY.setIntersectOutHandler(() => {
            this.arrowY.setOriginalColor();
        });

        let zdest = this.targetPos.clone();
        zdest.z += 8;
        this.arrowZ = new ArrowShape(this.scene, this.targetPos, zdest);
        this.arrowZ.setColor(0x0000FF);
        this.arrowZ.setDebugName('Z_Arrow');
        this.arrowZ.setIntersectHandler(() => {
            this.arrowZ.setTempColor(0xFFFF00);
        });
        this.arrowZ.setIntersectOutHandler(() => {
            this.arrowZ.setOriginalColor();
        });
    }
}