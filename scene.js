import * as THREE from 'three';

import { Terrain } from './terrain.js';
import { Camera } from './camera.js';
import { Controller } from './controller.js';

export class MySceneContext {
    constructor() {

        let USE_WINDOW_SIZE = 0;
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xeeeeee);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        this.sceneDomParent = document.getElementById("three_scene");
        this.sceneDomParent.appendChild(this.renderer.domElement);

        if (USE_WINDOW_SIZE) {
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
        this.cam = new Camera(this.screenRatio);
        this.terrain = new Terrain(this.scene);
        this.controller = new Controller();

        this.lightPos = { x: 3, y: 15, z: 3 };
        this.spherePos = { x: 8, y: 8, z: 8 };
        this.genLight();
        this.genSphere();

        this.infoPanel = document.getElementById("info");
        this.randerNum = 0;

        this.currIntersected = null;

        const planeMaterial = new THREE.MeshPhongMaterial( { color: 0xffb851 } );
        const cubes1 = new THREE.Mesh( new THREE.BoxGeometry( 3, 3, 3 ), planeMaterial );

        cubes1.position.y = 10;
        cubes1.position.x = 25;
        cubes1.position.z = 25;
    
        cubes1.castShadow = true;
        cubes1.receiveShadow = true;

        cubes1.tname = 'BoxMesh';
    
        this.scene.add( cubes1 );
    
        this.scene.fog = new THREE.Fog( 0x59472b, 0, 156 );

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
            this.cam.ViewFar(timeDiff);
        }
        if (this.controller.isKeyPressed('2')) {
            this.cam.ViewNear(timeDiff);
        }
        if (this.controller.isKeyPressed('3')) {
            this.cam.GetClose(0.1 * timeDiff);
        }
        if (this.controller.isKeyPressed('4')) {
            this.cam.GetClose(-0.1 * timeDiff);
        }

        if (this.controller.isKeyPressed('z')) {
            this.cam.GoUp(timeDiff);
        }
        if (this.controller.isKeyPressed('x')) {
            this.cam.GoDown(timeDiff);
        }
        if (this.controller.isKeyPressed('c')) {
            this.cam.ViewUp(timeDiff);
        }
        if (this.controller.isKeyPressed('v')) {
            this.cam.ViewBottom(timeDiff);
        }
    }

    updateInfoPanel() {
        let text = "";
        text += "Frame : " + this.randerNum + "\n";
        text += "View scale : " + this.cam.ViewScale.toPrecision(4) + "\n";
        text += "Cam Position : "
            + this.cam.CamPos.x.toPrecision(6) + ", "
            + this.cam.CamPos.y.toPrecision(6) + ", "
            + this.cam.CamPos.z.toPrecision(6) + "\n";

        text += "Cam Lookat : "
            + this.cam.CamLookat.x.toPrecision(6) + ", "
            + this.cam.CamLookat.y.toPrecision(6) + ", "
            + this.cam.CamLookat.z.toPrecision(6) + "\n";

        text += "Cam xz angle : " + (this.cam.CamdirAngle / Math.PI * 180).toPrecision(4) + "\n";

        let ydiff = this.cam.CamPos.y - this.cam.CamLookat.y;
        text += "Cam y angle : " + (Math.atan(ydiff / this.cam.CamdirDiameter) / Math.PI * 180).toPrecision(4) + "\n";

        text += "Mouse x: "
            + this.controller.pointer.x.toPrecision(6)
            + " y: "
            + this.controller.pointer.y.toPrecision(6)
            + "\n";
        this.infoPanel.innerText = text;
    }

    update(timeDiff) {
        this.inputHandler(timeDiff);

        this.sphere.position.set(this.spherePos.x, this.spherePos.y, this.spherePos.z);
        this.light.position.set(this.lightPos.x, this.lightPos.y, this.lightPos.z);
        this.lightSource.position.set(this.lightPos.x, this.lightPos.y, this.lightPos.z);

        /* Camera update */
        this.cam.UpdateCamera();

        /* Raycaster */
        this.raycaster.setFromCamera(this.controller.pointer, this.cam.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, false);
        if (intersects.length > 0) {
            if (intersects[0].object.hasOwnProperty('tname')){
                console.log(intersects[0].object.tname);

            } else {
                console.log(intersects[0]);
            }
        }


        // console.log(intersects);
        // if (intersects.length > 0) {
        //     if (this.currIntersected){
        //         if (this.currIntersected != intersects[0]){
        //             this.currIntersected.object.material.color.set(0x110000);
        //             intersects[0].object.material.color.set( 0xff0000 );
        //             this.currIntersected = intersects[0];
        //         }
        //     } else {
        //         this.currIntersected = intersects[0];
        //     }
        // }
        
        /* Randerer call */
        this.renderer.render(this.scene, this.cam.camera);

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
        lightSource.position.set(this.lightPos.x, this.lightPos.y, this.lightPos.z);
        this.scene.add(lightSource);
        this.lightSource = lightSource;

        /* ========== Light ========= */

        const USE_DIRECTIONAL_LIGHT = 0;
        if (USE_DIRECTIONAL_LIGHT){
            let light = new THREE.DirectionalLight(0xa0a0a0, 0.5);
            light.position.set(this.lightPos.x, this.lightPos.y, this.lightPos.z);
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
            let light = new THREE.PointLight( 0xffffff, 1, 0, Math.PI / 5, 0.001 );
            light.position.set( 10, 3, 10 );
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
        // const ambientLight = new THREE.AmbientLight( 0x404040, 2 );
        // this.scene.add(ambientLight);
    }

    genGrid() {
        const gridHelper = new THREE.GridHelper(10, 10);
        this.scene.add(gridHelper);
    }

    genPlain() {
        const geometryP = new THREE.PlaneGeometry(100, 100);
        const materialP = new THREE.MeshStandardMaterial({ color: 0xFCF7DE });
        const plane = new THREE.Mesh(geometryP, materialP);

        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this.scene.add(plane);
    }

    genSphere() {
        const geometryS = new THREE.SphereGeometry(2, 32, 32);
        const materialS = new THREE.MeshPhongMaterial({
            color: 0xFFAACF,
            // wireframe: true,
        });

        const sphere = new THREE.Mesh(geometryS, materialS);

        sphere.position.set(this.spherePos.x, this.spherePos.y, this.spherePos.z);
        sphere.castShadow = true;
        this.scene.add(sphere);

        this.sphere = sphere;
    }
}