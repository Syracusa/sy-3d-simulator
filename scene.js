import * as THREE from 'three';


import { Terrain } from './terrain.js';
import { Camera } from './camera.js';
import { Controller } from './controller.js';
import { ShiftHelper } from './shift-helper.js';
import { Bulb } from './bulb.js'

export class MySceneContext {
    constructor() {
        let USE_WINDOW_SIZE = 1;

        /* Scene */
        let scene = new THREE.Scene();
        this.scene = scene;
        scene.background = new THREE.Color(0xeeeeee);

        /* Randerer */
        let renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer = renderer;

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        renderer.shadowMap.renderSingleSided = false;

        this.sceneDomParent = document.getElementById("three_scene");
        this.sceneDomParent.appendChild(renderer.domElement);

        if (USE_WINDOW_SIZE) {
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(
                window.innerWidth,
                window.innerHeight);
            this.screenRatio = window.innerWidth / window.innerHeight;
        } else {
            renderer.setSize(
                this.sceneDomParent.offsetWidth,
                this.sceneDomParent.offsetHeight);

            this.screenRatio = this.sceneDomParent.offsetWidth / this.sceneDomParent.offsetHeight;
        }


        /* Camera */
        this.cam = new Camera(window.innerWidth / window.innerHeight);

        /* Terrain */
        this.terrain = new Terrain(scene);

        /* Controller */
        this.controller = new Controller(this);

        /* Sphere */
        this.genSphere();

        /* ShiftHelper */
        this.shiftHelper = new ShiftHelper(scene, this.cam._camera, this.sphere1);

        /* Panel */
        this.infoPanel = document.getElementById("info");
        this.randerNum = 0;

        this.currIntersected = null;

        /* Ambient light */
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
        scene.add(ambientLight);

        /* Bulb */
        let bulb = new Bulb(scene, new THREE.Vector3(48, 25, 48));
        bulb.bulbMesh.meshName = 'bulb';
        bulb.bulbMesh.onMouseDownHandler = () => { this.shiftHelper.retarget(bulb.bulbMesh); }
        this.bulb = bulb;

        /* Fog */
        scene.fog = new THREE.Fog(0x59472b, 0, 500);

        /* Helper */
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
    }

    updateInfoPanel() {
        let text = "";
        text += "Frame : " + this.randerNum + "\n";
        text += "View scale : " + this.cam.ViewScale.toPrecision(4) + "\n";
        text += "Cam Position : "
            + this.cam._camera.position.x.toPrecision(6) + ", "
            + this.cam._camera.position.y.toPrecision(6) + ", "
            + this.cam._camera.position.z.toPrecision(6) + "\n";

        text += "Cam Lookat : "
            + this.cam.CamLookat.x.toPrecision(6) + ", "
            + this.cam.CamLookat.y.toPrecision(6) + ", "
            + this.cam.CamLookat.z.toPrecision(6) + "\n";

        text += "Cam xz angle : " + (this.cam.CamdirAngle / Math.PI * 180).toPrecision(4) + "\n";

        let ydiff = this.cam._camera.position.y - this.cam.CamLookat.y;
        text += "Cam y angle : " + (Math.atan(ydiff / this.cam.CamdirDiameter) / Math.PI * 180).toPrecision(4) + "\n";

        text += "Mouse x: "
            + this.controller.pointer.x.toPrecision(6)
            + " y: "
            + this.controller.pointer.y.toPrecision(6)
            + "\n";

        if (this.controller.intersected != null &&
            this.controller.intersected.object.hasOwnProperty('meshName')) {

            text += "Intersected : " + this.controller.intersected.object.meshName + "\n";
        }

        this.infoPanel.innerText = text;
    }

    update(timeDiff) {
        this.controller.update(timeDiff);

        /* Camera update */
        this.cam.UpdateCamera();

        /* Randerer call */
        this.renderer.render(this.scene, this.cam._camera);

        /* Update stat */
        this.randerNum++;
        this.updateInfoPanel();
    }

    genSphere() {
        const geometryS = new THREE.SphereGeometry(1, 32, 32);
        const materialS = new THREE.MeshStandardMaterial({
            color: 0xFFAACF,
            // wireframe: true,
        });
        materialS.shadowSide = THREE.DoubleSide;
        const sphere1 = new THREE.Mesh(geometryS, materialS);

        sphere1.position.set(48, 18, 48);
        sphere1.castShadow = true;
        sphere1.receiveShadow = true;
        sphere1.meshName = 'Pink Circle1';
        this.scene.add(sphere1);
        sphere1.onMouseDownHandler = () => { this.shiftHelper.retarget(sphere1); }

        const sphere2 = new THREE.Mesh(geometryS, materialS);

        sphere2.position.set(56, 18, 48);
        sphere2.castShadow = true;
        sphere2.receiveShadow = true;
        sphere2.meshName = 'Pink Circle2';
        this.scene.add(sphere2);

        sphere2.onMouseDownHandler = () => { this.shiftHelper.retarget(sphere2); }

        this.sphere1 = sphere1;
        this.sphere2 = sphere2;


    }
}