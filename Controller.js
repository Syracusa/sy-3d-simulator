import { GUI } from 'dat.gui'
import * as THREE from 'three'

export class Controller {
    that = this;

    constructor(mainScene) {
        this.mainScene = mainScene;
        this.keystate = {};

        window.onkeydown = (e) => {
            this.keystate[e.key] = 1;
        }
        window.onkeyup = (e) => {
            this.keystate[e.key] = 0;
        }

        this.pointer = new THREE.Vector2(0, 0);
        console.log(this.pointer);
        console.log(this.pointer.x);

        this.mainScene.renderer.domElement.addEventListener(
            'pointermove',
            this.onPointerMove.bind(this));

        this.addMouseEventListener(this);

        /* Raycaster */
        this.raycaster = new THREE.Raycaster();

        this.intersected = null;
        this.dragTarget = null;
        this.selectedTarget = null;

        this.initDatGui(this);
    }

    initDatGui(controller) {
        let test = {
            'Create new node': function () {
                console.log("Create new node");
                let node = controller.mainScene.droneModel.generateDrone();
                controller.mainScene.droneList.push(node);
            },
            'Remove node': function () {
                console.log("Remove node");
                console.log(controller.selectedTarget);
                controller.selectedTarget.object.removeFromParent();
            },
            'Remove all node': function () {
                console.log("Remove all node");
                let droneList = controller.mainScene.droneList;
                console.log(droneList);
                for (let i = 0; i < droneList.length; i++){
                    console.log(droneList[i]);
                    droneList[i].removeFromParent();
                }
                controller.mainScene.droneList = [];
            },
        }

        const gui = new GUI()

        const nodeFolder = gui.addFolder('Node')
        nodeFolder.add(test, 'Create new node');
        nodeFolder.add(test, 'Remove node');
        nodeFolder.add(test, 'Remove all node');
        nodeFolder.open()
    }

    onPointerMove(event) {
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -1 * (event.clientY / window.innerHeight) * 2 + 1;
    }

    isKeyPressed(key) {
        if (key in this.keystate) {
            if (this.keystate[key] == 1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    addMouseEventListener(controller) {
        this.mainScene.renderer.domElement.onmousedown = function (e) {
            if (controller.intersected) {
                controller.selectedTarget = controller.intersected;
                controller.dragTarget = controller.intersected;
                controller.dragStartX = e.clientX;
                controller.dragStartY = e.clientY;
                if (controller.intersected.object.hasOwnProperty('onMouseDownHandler')) {
                    controller.intersected.object.onMouseDownHandler(e);
                } else {
                    console.log('No handler');
                }
            } else {
                console.log('No intersected');
            }
        }

        this.mainScene.renderer.domElement.onmousemove = function (e) {
            if (controller.dragTarget) {
                if (controller.dragTarget.object.hasOwnProperty('onMouseDragHandler')) {
                    controller.dragTarget.object.onMouseDragHandler(
                        controller.dragStartX, controller.dragStartY,
                        e.clientX, e.clientY);

                } else {
                    console.log('no drag handler');
                }
            }
            // console.log("Mouse move pos : " + e.clientX + ", " + e.clientY + "");
        }

        this.mainScene.renderer.domElement.onmouseup = function (e) {
            controller.dragTarget = null;
            // console.log("Mouse up pos :  " + e.clientX + ", " + e.clientY + "");
        }

        this.mainScene.renderer.domElement.onmouseout = function (e) {
            // console.log("Mouse out pos : " + e.clientX + ", " + e.clientY + "");
        }
    }

    raycastControl() {
        /* Raycaster */
        this.raycaster.setFromCamera(this.pointer, this.mainScene.flyingCamera.orthographicCamera);
        const intersects = this.raycaster.intersectObjects(this.mainScene.scene.children, false);

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

    update(timeDiff) {
        timeDiff *= 0.1;
        if (this.isKeyPressed('w')) {
            this.mainScene.flyingCamera.GoFront(timeDiff);
        }
        if (this.isKeyPressed('s')) {
            this.mainScene.flyingCamera.GoBack(timeDiff);
        }
        if (this.isKeyPressed('a')) {
            this.mainScene.flyingCamera.GoLeft(timeDiff);
        }
        if (this.isKeyPressed('d')) {
            this.mainScene.flyingCamera.GoRight(timeDiff);
        }
        if (this.isKeyPressed('q')) {
            this.mainScene.flyingCamera.LeftRotate(timeDiff);
        }
        if (this.isKeyPressed('e')) {
            this.mainScene.flyingCamera.RightRotate(timeDiff);
        }
        if (this.isKeyPressed('1')) {
            this.mainScene.flyingCamera.ViewUp(timeDiff);
        }
        if (this.isKeyPressed('2')) {
            this.mainScene.flyingCamera.ViewBottom(timeDiff);
        }
        if (this.isKeyPressed('3')) {
            this.mainScene.flyingCamera.GetClose(0.1 * timeDiff);
        }
        if (this.isKeyPressed('4')) {
            this.mainScene.flyingCamera.GetClose(-0.1 * timeDiff);
        }

        this.raycastControl();
    }
}