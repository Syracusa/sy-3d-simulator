import { DroneModel } from './DroneModel.js';
export class NodeManager {
    constructor(mainScene) {
        this.mainScene = mainScene;
        this.nodeSet = {};
        this.nodeList = [];

        /* Drone */
        this.droneModel = new DroneModel(mainScene);   
    }

    addNode() {
        let node = this.droneModel.generateDrone();
        this.nodeList.push(node);
        this.nodeSet[node.nodeName] = node;

        return node;
    }

    deleteNode(node) {
        node.removeFromParent();
    }

    deleteAllNode() {
        for (let i = 0; i < this.nodeList.length; i++) {
            console.log(this.nodeList[i]);
            this.nodeList[i].removeFromParent();
        }
        this.nodeList = [];
    }
}