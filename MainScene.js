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
        document.body.appendChild( renderer.domElement );
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(
            window.innerWidth,
            window.innerHeight);
        this.screenRatio = window.innerWidth / window.innerHeight;

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
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.5);
        scene.add(ambientLight);

        /* Directional light */
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);

        scene.add(directionalLight);
        scene.add(directionalLight.target);
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

        if (0) {
            let helper = new THREE.CameraHelper(directionalLight.shadow.camera);
            scene.add(helper);
        }

        /* Bulb */
        if (0) {
            let bulb = new Bulb(scene, new THREE.Vector3(48, 25, 48));
            bulb.bulbMesh.meshName = 'bulb';
            bulb.bulbMesh.onMouseDownHandler = () => { this.shiftHelper.retarget(bulb.bulbMesh); }
            this.bulb = bulb;
        }

        /* Fog */
        scene.fog = new THREE.Fog(0x59472b, 0, 500);

        /* Helper */
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        this.loaderTest(this);
    }

    loaderTest(mainScene) {
        const loader = new GLTFLoader();

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
        loader.setDRACOLoader(dracoLoader);

        loader.load(
            './static/Drone.glb',
            function (gltf) {
                const geometryS = new THREE.SphereGeometry(1, 8, 8);
                const materialS = new THREE.MeshStandardMaterial({
                    color: 0x000000,
                    // wireframe: true,
                });
                materialS.transparent = true;
                materialS.opacity = 0.0;

                const sphere = new THREE.Mesh(geometryS, materialS);
                sphere.position.set(56, 22, 53);
                sphere.onMouseDownHandler = () => {
                    mainScene.shiftHelper.retarget(sphere);
                }

                sphere.add(gltf.scene);
                gltf.scene.scale.set(5.0, 5.0, 5.0);
                gltf.scene.traverse(function (node) {
                    if (node.isMesh) {
                        node.castShadow = true;
                    }
                });

                mainScene.scene.add(sphere);
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
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

        if (this.controller.intersected != null) {
            if (this.controller.intersected.object.hasOwnProperty('meshName')) {
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

        sphere1.position.set(45, 18, 48);
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
