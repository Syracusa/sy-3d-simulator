import * as THREE from 'three'
import { Vector3, _SRGBAFormat } from 'three';
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
        arrow.to = to.clone();
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

            const material = new THREE.LineBasicMaterial({ color: 0xaaaaaa });
            const points = [];

            let posStart = this.targetPos.clone().project(this.cam);
            posStart.z = -0.9999;
            posStart.unproject(this.cam);

            let posEnd = arrow.to.clone().project(this.cam);
            
            posEnd.z = -0.9999;
            posEnd.unproject(this.cam);

            points.push(posStart);
            points.push(posEnd);

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            this.scene.add(line);

            if (0){
                const material = new THREE.LineBasicMaterial({ color: 0xaaaaaa });
                const points = [];
    
                let xcPosStart = this.targetPos.clone().project(this.cam);
                xcPosStart.z = -0.9999;
                xcPosStart.unproject(this.cam);
    
                let xcPosEnd = this.xArrowTo.clone().project(this.cam);
                
                xcPosEnd.z = -0.9999;
                xcPosEnd.unproject(this.cam);
    
                points.push(xcPosStart);
                points.push(xcPosEnd);
    
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, material);
                this.scene.add(line);
            }


            // xcPosStart.z -= 0.0001;
            // xcPosEnd.z -= 0.0001;
            // console.log(xcPosStart);
            // console.log(xcPosEnd);

            // this.scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material));

            // console.log(this.cam.position);
            // console.log(this.targetPos);
            // let cpworld = new Vector3();
            // console.log(this.cam.getWorldPosition(cpworld));
            // console.log(cpworld);
    
            // let xcPosStart = this.targetPos.clone().project(this.cam);
            // let xcPosEnd = this.xArrowTo.clone().project(this.cam);
    
            // console.log(xcPosStart);
            // console.log(xcPosEnd);

            // let ycPosStart = this.targetPos.clone().project(this.cam);
            // let ycPosEnd = this.yArrowTo.clone().project(this.cam);
    
            // console.log(ycPosStart);
            // console.log(ycPosEnd);
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
        this.xArrowTo = xArrowTo;

        let yArrowTo = this.targetPos.clone();
        yArrowTo.y += 8;
        this.arrowY = this.drawArrow('Y_Arrow', 0x00FF00, yArrowTo);
        this.yArrowTo = yArrowTo;

        let zArrowTo = this.targetPos.clone();
        zArrowTo.z += 8;
        this.arrowZ = this.drawArrow('Z_Arrow', 0x0000FF, zArrowTo);
        this.zArrowTo = zArrowTo;
    }
}