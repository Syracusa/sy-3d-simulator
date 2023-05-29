import * as THREE from 'three'

export class LinkManager {
    constructor(mainScene) {
        this.mainScene = mainScene;

        this.param = {
            linkDist: 20,
            goodLinkDist: 15
        };

        this.lineList = [];
        this.drawLink();
    }

    drawLinkLine(pos1, pos2) {
        let distance = pos1.distanceTo(pos2);
        let material;

        if (distance < this.param.linkDist){
            if (distance < this.param.goodLinkDist){
                material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
            } else {
                material = new THREE.LineBasicMaterial({ color: 0xff0000 });
            }
            
            const points = [pos1, pos2];
    
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            line.ignoreIntersect = true;
            this.lineList.push(line);
    
            this.mainScene.scene.add(line);
        }
    }

    drawLink() {
        for (let i = 0; i < this.lineList.length; i++){
            this.lineList[i].removeFromParent();
            this.lineList[i].geometry.dispose();
            this.lineList[i].material.dispose();
        }
        this.lineList = [];

        for (let i = 0; i < this.mainScene.droneList.length; i++) {
            for (let j = i + 1; j < this.mainScene.droneList.length; j++) {
                this.drawLinkLine(
                    this.mainScene.droneList[i].position.clone(),
                    this.mainScene.droneList[j].position.clone()
                    );
            }
        }
    }
}