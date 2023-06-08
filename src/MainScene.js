import * as THREE from 'three';

import { Terrain } from './Terrain.js';
import { Controller } from './Controller.js';
import { Bulb } from './Bulb.js'
import { DroneModel } from './DroneModel.js';
import { LinkManager } from './LinkManager.js';
import { FlyingPerspectiveCamera } from './FlyingPerspectiveCamera.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { Scenario } from './Scenario.js';

export class MainScene {
    constructor() {
        /* Scene */
        let scene = new THREE.Scene();
        this.scene = scene;
        scene.background = new THREE.Color(0xeeeeee);

        /* Renderer */
        this.generateRenderer();

        /* Camera */
        this.flyingCamera = new FlyingPerspectiveCamera(window.innerWidth / window.innerHeight);
        
        /* Terrain */
        this.terrain = new Terrain(scene);
        
        /* Scenario */
        this.scenario = new Scenario(this);
        
        /* Controller */
        this.controller = new Controller(this);

        /* Panel */
        this.infoPanel = document.getElementById("info");
        this.randerNum = 0;

        this.nodeInfoPanel = document.getElementById("node-info");

        /* Ambient light */
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
        scene.add(ambientLight);

        /* Directional light */
        this.generateDirectionalLight();

        if (0) {
            let helper = new THREE.CameraHelper(directionalLight.shadow.camera);
            scene.add(helper);
        }

        /* Bulb */
        if (0) {
            let bulb = new Bulb(scene, new THREE.Vector3(48, 25, 48));
            bulb.bulbMesh.meshName = 'bulb';
            // bulb.bulbMesh.onMouseDownHandler = () => { this.shiftHelper.retarget(bulb.bulbMesh); }
            this.bulb = bulb;
        }

        /* Fog */
        scene.fog = new THREE.Fog(0x59472b, 0, 5000);

        /* Helper */
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        /* Drone */
        this.droneModel = new DroneModel(this);
        this.droneList = [];

        /* LinkManager */
        this.linkManager = new LinkManager(this);

    }

    generateRenderer() {
        let renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer = renderer;

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        renderer.shadowMap.renderSingleSided = false;
        document.body.appendChild(renderer.domElement);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(
            window.innerWidth,
            window.innerHeight);
        this.screenRatio = window.innerWidth / window.innerHeight;

        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        document.body.appendChild(labelRenderer.domElement);
        this.labelRenderer = labelRenderer;
    }

    generateDirectionalLight() {
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);

        this.scene.add(directionalLight);
        this.scene.add(directionalLight.target);
        directionalLight.position.set(56, 1000, 53);
        directionalLight.target.position.set(56, 0, 53);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.near = 0.1;
        directionalLight.shadow.camera.far = 2500;

        directionalLight.shadow.camera.top = 100;
        directionalLight.shadow.camera.bottom = -100;
        directionalLight.shadow.camera.left = -100;
        directionalLight.shadow.camera.right = 100;

        directionalLight.shadow.bias = -0.001;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
    }

    update(timeDiff) {
        this.controller.update(timeDiff);

        this.linkManager.drawLink();

        /* Camera update */
        this.flyingCamera.UpdateCamera();

        /* Randerer call */
        this.renderer.render(this.scene, this.flyingCamera.camera);
        this.labelRenderer.render(this.scene, this.flyingCamera.camera);

        /* Update stat */
        this.randerNum++;
    }

    updateDebugPanel() {
        let text = "";
        text += "Frame : " + this.randerNum + "\n";
        text += "Cam Position : "
            + this.flyingCamera.camera.position.x.toPrecision(6) + ", "
            + this.flyingCamera.camera.position.y.toPrecision(6) + ", "
            + this.flyingCamera.camera.position.z.toPrecision(6) + "\n";

        text += "Cam Lookat : "
            + this.flyingCamera.camLookat.x.toPrecision(6) + ", "
            + this.flyingCamera.camLookat.y.toPrecision(6) + ", "
            + this.flyingCamera.camLookat.z.toPrecision(6) + "\n";

        text += "Cam xz angle : " + (this.flyingCamera.CamXzAngle / Math.PI * 180 % 360).toPrecision(4) + "\n";

        let ydiff = this.flyingCamera.camera.position.y - this.flyingCamera.camLookat.y;
        text += "Cam y angle : " + (Math.atan(ydiff / this.flyingCamera.CamdirDiameter) / Math.PI * 360).toPrecision(4) + "\n";

        text += "Mouse x: "
            + this.controller.pointer.x.toPrecision(6)
            + " y: "
            + this.controller.pointer.y.toPrecision(6)
            + "\n";

        if (this.controller.intersected != null) {
            if (this.controller.intersected.object.hasOwnProperty('meshName')) {
                text += "Intersected : " + this.controller.intersected.object.meshName + "\n";
            } else {
                text += "Intersected : unknown\n";
            }
        }

        this.infoPanel.innerText = text;
    }

    updateNodePanel() {
        let node = null;
        if (this.controller.selectedNode)
            node = this.controller.selectedNode.object;

        let infoText = '';
        if (node) {
            let currtime = Date.now();

            if (0) {
                node.bubbleInfoList.push("test !!" + currtime + "\n");
                node.bubbleInfoAddTimeList.push(currtime);
            }

            let bubbleText = '';

            for (let i = 0; i < node.bubbleInfoList.length; i++) {
                let addedTime = node.bubbleInfoAddTimeList[i];
                if (currtime - addedTime > 1000) {
                    node.bubbleInfoAddTimeList.shift();
                    node.bubbleInfoList.shift();
                    i--;
                    continue;
                }
                bubbleText += node.bubbleInfoList[i];
            }
            node.infoElem.innerText = bubbleText;

            infoText = node.nodeName + '\n';
            infoText +=
                'X : ' + node.position.x.toPrecision(4)
                + '\xa0\xa0 Y : ' + node.position.y.toPrecision(4)
                + '\xa0\xa0 Z : ' + node.position.z.toPrecision(4)
                + '\n';

        } else {
            infoText = 'No node selected';
        }
        this.nodeInfoPanel.innerText = infoText;
    }

    updatePanelInfo() {
        this.updateDebugPanel();
        this.updateNodePanel();
    }

}
