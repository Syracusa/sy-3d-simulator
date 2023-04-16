import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

export class DroneModel {

    constructor(mainScene) {
        this.mainScene = mainScene;
        this.modelLoaded = false;

        this.loadDroneModel(this);
    }

    generateDrone() {
        if (!this.modelLoaded) {
            console.log('Model not loaded');
            return;
        }
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
            this.mainScene.shiftHelper.retarget(sphere);
        }
        sphere.meshName = 'Drone';

        let droneModel = SkeletonUtils.clone(this.droneModel)
        droneModel.receiveShadow = true;

        sphere.add(droneModel);

        let materialL = new THREE.LineBasicMaterial({ color: 0x555555 });
        const points =
            [new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, -100, 0)];
        const geometryL = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometryL, materialL);
        line.ignoreIntersect = true;
        sphere.add(line);
        this.mainScene.scene.add(sphere);

        return sphere;
    }

    loadDroneModel(that) {
        const loader = new GLTFLoader();

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
        loader.setDRACOLoader(dracoLoader);

        loader.load(
            './static/Drone2.glb',
            function (gltf) {

                gltf.scene.scale.set(0.5, 0.5, 0.5);
                gltf.scene.traverse(function (node) {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });

                console.log(gltf.scene);
                console.log(gltf.scene.clone());
                that.droneModel = gltf.scene.clone();

                that.modelLoaded = true;

            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
                console.log('An error happened');
            }
        );

    }
}