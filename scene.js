import * as THREE from 'three';

import { Terrain } from './terrain.js';
import { Camera } from './camera.js';
import { Controller } from './controller.js';

export class MySceneContext {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xeeeeee);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;

        this.sceneDomParent = document.getElementById("three_scene");
        this.sceneDomParent.appendChild(this.renderer.domElement);
        this.renderer.setSize(
            this.sceneDomParent.offsetWidth,
            this.sceneDomParent.offsetHeight);

        this.cam = new Camera();
        this.terrain = new Terrain(this.scene);
        this.controller = new Controller();

        this.lightPos = { x: 3, y: 15, z: 3 };
        this.spherePos = { x: 8, y: 8, z: 8 };
        this.genLight();
        this.genSphere();
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
    }

    update(timeDiff) {
        this.inputHandler(timeDiff);

        this.sphere.position.set(this.spherePos.x, this.spherePos.y, this.spherePos.z);
        this.light.position.set(this.lightPos.x, this.lightPos.y, this.lightPos.z);
        this.lightSource.position.set(this.lightPos.x, this.lightPos.y, this.lightPos.z);
    
        this.cam.UpdateCamera();
        this.renderer.render(this.scene, this.cam.camera);
    }

    genLight() {
        const geometrylightSource = new THREE.SphereGeometry(1, 8, 8);
        const materiallightSource = new THREE.MeshStandardMaterial({
            color: 0xffffff
        });

        const lightSource = new THREE.Mesh(geometrylightSource, materiallightSource);
        lightSource.position.set(this.lightPos.x, this.lightPos.y, this.lightPos.z);
        this.scene.add(lightSource);

        // light
        let light = new THREE.DirectionalLight(0xa0a0a0, 0.5);
        light.position.set(this.lightPos.x, this.lightPos.y, this.lightPos.z);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;

        light.shadow.mapSize.width = 10240
        light.shadow.mapSize.height = 10240
        light.shadow.camera.near = -20
        light.shadow.camera.far = 100
        light.shadow.camera.top = 10
        light.shadow.camera.right = 10 
        light.shadow.camera.left = -10 
        light.shadow.camera.bottom = -10 
        this.scene.add(light);
        
        this.light = light;
        this.lightSource = lightSource;

        // const ambientLight = new THREE.AmbientLight( 0x404040, 1 );
        // scene.add(ambientLight);
    }

    genGrid() {
        const gridHelper = new THREE.GridHelper(10, 10);
        this.scene.add(gridHelper);
    }

    genPlain() {
        const geometryP = new THREE.PlaneGeometry(100, 100);
        const materialP = new THREE.MeshStandardMaterial({ color: 0xFCF7DE })
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