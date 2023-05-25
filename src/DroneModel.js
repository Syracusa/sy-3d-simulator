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
        sphere.position.set(63, 22, 33);
        sphere.onMouseDownHandler = () => {
            this.mainScene.controller.shiftHelper.retarget(sphere);
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

        const materialC = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const geometryC = new THREE.CircleGeometry(1.2, 16);
        materialC.transparent = true;
        materialC.opacity = 0.0;

        sphere.onTargetHandler = () => {
            materialC.opacity = 1.0;
        };
        sphere.outTargetHandler = () => {
            materialC.opacity = 0.0;
        };

        const itemSize = 3;
        geometryC.setAttribute('position',
            new THREE.BufferAttribute(
                geometryC.attributes.position.array.slice(itemSize,
                    geometryC.attributes.position.array.length - itemSize
                ), itemSize
            )
        );
        geometryC.index = null;
        geometryC.rotateX(Math.PI / 2);
        const circle = new THREE.LineLoop(geometryC, materialC);
        circle.position.set(0, -0.3, 0);
        circle.ignoreIntersect = true;

        sphere.add(circle);

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