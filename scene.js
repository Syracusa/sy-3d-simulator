import * as THREE from 'three';

import { Terrain } from './terrain.js';
import { Camera } from './camera.js';
import { Controller } from './controller.js';
import { ShiftHelper } from './shift-helper.js';
import { Vector3 } from 'three';

export class MySceneContext {
    constructor() {
        let USE_WINDOW_SIZE = 1;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xeeeeee);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        this.sceneDomParent = document.getElementById("three_scene");
        this.sceneDomParent.appendChild(this.renderer.domElement);

        if (USE_WINDOW_SIZE) {
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(
                window.innerWidth,
                window.innerHeight);
            this.screenRatio = window.innerWidth / window.innerHeight;
        } else {
            this.renderer.setSize(
                this.sceneDomParent.offsetWidth,
                this.sceneDomParent.offsetHeight);

            this.screenRatio = this.sceneDomParent.offsetWidth / this.sceneDomParent.offsetHeight;
        }
        this.raycaster = new THREE.Raycaster();
        this.cam = new Camera(window.innerWidth / window.innerHeight);
        this.terrain = new Terrain(this.scene);
        this.controller = new Controller();

        this.genLight();
        this.genSphere();

        this.shiftHelper = new ShiftHelper(this.scene, this.cam._camera, this.sphere1);

        this.infoPanel = document.getElementById("info");
        this.randerNum = 0;

        this.currIntersected = null;

        const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffb851 });
        const cubes1 = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), planeMaterial);

        cubes1.position.y = 10;
        cubes1.position.x = 25;
        cubes1.position.z = 25;

        cubes1.castShadow = true;
        cubes1.receiveShadow = true;

        cubes1.meshName = 'BoxMesh';

        this.scene.add(cubes1);
        this.scene.fog = new THREE.Fog(0x59472b, 0, 156);

        /* Helper */
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);

        /* Mouse Event */
        this.intersected = null;
        this.dragTarget = null;
        this.addMouseEventListener(this);
    }

    addMouseEventListener(ctx) {
        window.onmousedown = function (e) {
            if (ctx.intersected) {
                ctx.dragTarget = ctx.intersected;
                ctx.dragStartX = e.clientX;
                ctx.dragStartY = e.clientY;
                if (ctx.intersected.object.hasOwnProperty('onMouseDownHandler')) {
                    ctx.intersected.object.onMouseDownHandler(e);
                } else {
                    console.log('No handler');
                }
            } else {
                console.log('No intersected');
            }
        }

        window.onmousemove = function (e) {
            if (ctx.dragTarget){
                if (ctx.dragTarget.object.hasOwnProperty('onMouseDragHandler')) {
                    ctx.dragTarget.object.onMouseDragHandler(ctx.dragStartX, ctx.dragStartY, e.clientX, e.clientY);

                } else {
                    console.log('no drag handler');
                }
            }
            // console.log("Mouse move pos : " + e.clientX + ", " + e.clientY + "");
        }

        window.onmouseup = function (e) {
            ctx.dragTarget = null;
            // console.log("Mouse up pos :  " + e.clientX + ", " + e.clientY + "");
        }

        window.onmouseout = function (e) {
            // console.log("Mouse out pos : " + e.clientX + ", " + e.clientY + "");
        }
    }

    inputHandler(timeDiff) {
        timeDiff *= 0.1;
        if (this.controller.isKeyPressed('w')) {
            this.cam.GoFront(timeDiff);
        }
        if (this.controller.isKeyPressed('s')) {
            this.cam.GoBack(timeDiff);
        }
        if (this.controller.isKeyPressed('a')) {
            this.cam.GoLeft(timeDiff);
        }
        if (this.controller.isKeyPressed('d')) {
            this.cam.GoRight(timeDiff);
        }
        if (this.controller.isKeyPressed('q')) {
            this.cam.LeftRotate(timeDiff);
        }
        if (this.controller.isKeyPressed('e')) {
            this.cam.RightRotate(timeDiff);
        }
        if (this.controller.isKeyPressed('1')) {
            this.cam.ViewUp(timeDiff);
        }
        if (this.controller.isKeyPressed('2')) {
            this.cam.ViewBottom(timeDiff);
        }
        if (this.controller.isKeyPressed('3')) {
            this.cam.GetClose(0.1 * timeDiff);
        }
        if (this.controller.isKeyPressed('4')) {
            this.cam.GetClose(-0.1 * timeDiff);
        }
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

        if (this.intersected != null && this.intersected.object.hasOwnProperty('meshName')) {
            text += "Intersected : " + this.intersected.object.meshName + "\n";
        }

        this.infoPanel.innerText = text;
    }

    update(timeDiff) {
        this.inputHandler(timeDiff);

        /* Camera update */
        this.cam.UpdateCamera();

        /* Raycaster */
        this.raycaster.setFromCamera(this.controller.pointer, this.cam._camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, false);
        if (0) {
            if (intersects.length > 0) {
                for (let i = 0; i < intersects.length; i++) {
                    if (intersects[i].object.hasOwnProperty('meshName')) {
                        console.log(intersects[i].object.meshName);
                    } else {
                        console.log(intersects[i]);
                    }
                }
            }
        } else {
            if (intersects.length > 0) {
                const INTERSECT_VERBOSE = 0;
                if (INTERSECT_VERBOSE) {
                    if (intersects[0].object.hasOwnProperty('meshName')) {
                        console.log(intersects[0].object.meshName);
                    } else {
                        console.log(intersects[0]);
                    }
                }

                if (this.intersected == null
                    || this.intersected.object.uuid != intersects[0].object.uuid) {
                    if (this.intersected &&
                        this.intersected.object.hasOwnProperty('intersectOutHandler')) {
                        this.intersected.object.intersectOutHandler();
                        console.log('out handler');
                    }

                    this.intersected = intersects[0];
                    if (intersects[0].object.hasOwnProperty('intersectHandler')) {
                        intersects[0].object.intersectHandler();
                        console.log('in handler');
                    }
                }
            }

        }

        /* Randerer call */
        this.renderer.render(this.scene, this.cam._camera);

        /* Update stat */
        this.randerNum++;
        this.updateInfoPanel();
    }

    genLight() {
        /* ========== LightSource ========= */
        const geometrylightSource = new THREE.SphereGeometry(1, 8, 8);
        const materiallightSource = new THREE.MeshStandardMaterial({
            color: 0xffffff
        });

        const lightSource = new THREE.Mesh(geometrylightSource, materiallightSource);
        lightSource.position.set(3, 15, 3);
        this.scene.add(lightSource);
        this.lightSource = lightSource;

        /* ========== Light ========= */

        const USE_DIRECTIONAL_LIGHT = 1;
        if (USE_DIRECTIONAL_LIGHT) {
            let light = new THREE.DirectionalLight(0xa0a0a0, 1.0);
            light.position.set(3, 15, 3);
            light.target.position.set(0, 0, 0);
            light.castShadow = true;

            light.shadow.mapSize.width = 10240;
            light.shadow.mapSize.height = 10240;
            light.shadow.camera.near = -20;
            light.shadow.camera.far = 100;
            light.shadow.camera.top = 10;
            light.shadow.camera.right = 10;
            light.shadow.camera.left = -10;
            light.shadow.camera.bottom = -10;
            this.scene.add(light);

            this.light = light;
        } else {
            let light = new THREE.PointLight(0xffffff, 10, 1000);
            light.position.set(10, 50, 10);
            // light.target.position.set( 10, 25, 25 );

            light.castShadow = true;
            light.shadow.camera.near = -1000;
            light.shadow.camera.far = 2500;
            light.shadow.bias = 0.0001;

            light.shadow.mapSize.width = 2048;
            light.shadow.mapSize.height = 1024;
            this.scene.add(light);

            this.light = light;
        }


        /* ========== Ambient Light ========= */
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        this.scene.add(ambientLight);
    }

    genSphere() {
        const geometryS = new THREE.SphereGeometry(1, 32, 32);
        const materialS = new THREE.MeshPhongMaterial({
            color: 0xFFAACF,
            // wireframe: true,
        });

        const sphere1 = new THREE.Mesh(geometryS, materialS);

        sphere1.position.set(48, 18, 48);
        sphere1.castShadow = true;
        sphere1.meshName = 'Pink Circle1';
        this.scene.add(sphere1);
        sphere1.onMouseDownHandler = () => {this.shiftHelper.retarget(sphere1);}

        const sphere2 = new THREE.Mesh(geometryS, materialS);

        sphere2.position.set(56, 18, 48);
        sphere2.castShadow = true;
        sphere2.meshName = 'Pink Circle2';
        this.scene.add(sphere2);

        sphere2.onMouseDownHandler = () => {this.shiftHelper.retarget(sphere2);}

        this.sphere1 = sphere1;
        this.sphere2 = sphere2;
    }
}