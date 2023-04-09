import * as THREE from 'three';


import { Terrain } from './Terrain.js';
import { FlyingCamera } from './FlyingCamera.js';
import { Controller } from './Controller.js';
import { ShiftHelper } from './ShiftHelper.js';
import { Bulb } from './Bulb.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export class MainScene {
    constructor() {
        let USE_WINDOW_SIZE = 1;

        /* Scene */
        let scene = new THREE.Scene();
        this.scene = scene;
        scene.background = new THREE.Color(0xeeeeee);

        /* Renderer */
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
        this.flyingCamera = new FlyingCamera(window.innerWidth / window.innerHeight);

        /* Terrain */
        this.terrain = new Terrain(scene);

        /* Controller */
        this.controller = new Controller(this);

        /* Sphere */
        this.genSphere();

        /* ShiftHelper */
        this.shiftHelper = new ShiftHelper(scene, this.flyingCamera.orthographicCamera, this.sphere1);

        /* Panel */
        this.infoPanel = document.getElementById("info");
        this.randerNum = 0;

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

        this.loaderTest(this);
    }

    loaderTest(mainScene) {
        // Instantiate a loader
        const loader = new GLTFLoader();

        // Optional: Provide a DRACOLoader instance to decode compressed mesh data
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
        loader.setDRACOLoader(dracoLoader);

        // Load a glTF resource
        loader.load(
            // resource URL
            './static/Drone.glb',
            // called when the resource is loaded
            function (gltf) {
                gltf.scene.position.set(56, 22, 53);
                gltf.scene.scale.set(5.0, 5.0, 5.0);
                gltf.scene.meshName = 'Drone';
                console.log(gltf.scene);
                mainScene.scene.add(gltf.scene);

                gltf.animations; // Array<THREE.AnimationClip>
                gltf.scene; // THREE.Group
                gltf.scenes; // Array<THREE.Group>
                gltf.cameras; // Array<THREE.Camera>
                gltf.asset; // Object
            },
            // called while loading is progressing
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // called when loading has errors
            function (error) {
                console.log('An error happened');
            }
        );
    }

    updateInfoPanel() {
        let text = "";
        text += "Frame : " + this.randerNum + "\n";
        text += "View scale : " + this.flyingCamera.ViewScale.toPrecision(4) + "\n";
        text += "Cam Position : "
            + this.flyingCamera.orthographicCamera.position.x.toPrecision(6) + ", "
            + this.flyingCamera.orthographicCamera.position.y.toPrecision(6) + ", "
            + this.flyingCamera.orthographicCamera.position.z.toPrecision(6) + "\n";

        text += "Cam Lookat : "
            + this.flyingCamera.CamLookat.x.toPrecision(6) + ", "
            + this.flyingCamera.CamLookat.y.toPrecision(6) + ", "
            + this.flyingCamera.CamLookat.z.toPrecision(6) + "\n";

        text += "Cam xz angle : " + (this.flyingCamera.CamdirAngle / Math.PI * 180).toPrecision(4) + "\n";

        let ydiff = this.flyingCamera.orthographicCamera.position.y - this.flyingCamera.CamLookat.y;
        text += "Cam y angle : " + (Math.atan(ydiff / this.flyingCamera.CamdirDiameter) / Math.PI * 180).toPrecision(4) + "\n";

        text += "Mouse x: "
            + this.controller.pointer.x.toPrecision(6)
            + " y: "
            + this.controller.pointer.y.toPrecision(6)
            + "\n";

        if (this.controller.intersected != null){
            if (this.controller.intersected.object.hasOwnProperty('meshName')){
                text += "Intersected : " + this.controller.intersected.object.meshName + "\n";
            } else {
                text += "Intersected : unknown\n";
            }


        }

        this.infoPanel.innerText = text;
    }

    update(timeDiff) {
        this.controller.update(timeDiff);

        /* Camera update */
        this.flyingCamera.UpdateCamera();

        /* Randerer call */
        this.renderer.render(this.scene, this.flyingCamera.orthographicCamera);

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