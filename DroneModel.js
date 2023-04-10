import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

export class DroneModel {
 
    constructor(mainScene) {
        this.mainScene = mainScene;
        this.modelLoaded = false;

        this.loadDroneModel(this);
    }

    generateDrone() {
        if (!this.modelLoaded){
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

        sphere.add(this.droneModel.clone());
        this.mainScene.scene.add(sphere);
    }

    loadDroneModel(that) {
        const loader = new GLTFLoader();

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/examples/jsm/libs/draco/');
        loader.setDRACOLoader(dracoLoader);

        loader.load(
            './static/Drone.glb',
            function (gltf) {

                gltf.scene.scale.set(5.0, 5.0, 5.0);
                gltf.scene.traverse(function (node) {
                    if (node.isMesh) {
                        node.castShadow = true;
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