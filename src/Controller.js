import { GUI } from 'dat.gui'
import * as THREE from 'three'
import { DragHelper } from './DragHelper.js';

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
        this.selectedTargetList = [];

        this.initDatGui(this);

        this.dragHelper = new DragHelper(mainScene);
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
                for (let i = 0; i < droneList.length; i++) {
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

    outCurrentTarget(e) {
        /* Target out handler */
        if (this.selectedTarget) {
            if (this.selectedTarget.object.hasOwnProperty('outTargetHandler')) {
                this.selectedTarget.object.outTargetHandler(e);
            }
        }
        for (let i = 0; i < this.selectedTargetList.length; i++) {
            if (this.selectedTargetList[i].hasOwnProperty('outTargetHandler')) {
                this.selectedTargetList[i].outTargetHandler(e);
            }
        }
    }

    inNewTarget(e) {
        /* Update Target */
        this.selectedTarget = this.intersected;
        this.dragTarget = this.intersected;
        if (this.intersected.object.hasOwnProperty('onMouseDownHandler')) {
            this.intersected.object.onMouseDownHandler(e);
        } else {
            console.log('No handler');
            this.mainScene.shiftHelperTargetToDummy();
        }

        if (this.intersected.object.hasOwnProperty('onTargetHandler')) {
            this.intersected.object.onTargetHandler(e);
        }
    }

    addMouseEventListener(controller) {
        /* On mouse down */
        this.mainScene.renderer.domElement.onmousedown = function (e) {
            controller.dragStartX = e.clientX;
            controller.dragStartY = e.clientY;
            if (controller.intersected) {
                controller.outCurrentTarget(e);
                controller.inNewTarget(e);
            } else {
                console.log('No intersected');
            }
        }

        /* On mouse move */
        this.mainScene.renderer.domElement.onmousemove = function (e) {
            if (controller.dragTarget) {
                if (controller.dragTarget.object.hasOwnProperty('onMouseDragHandler')) {
                    controller.dragTarget.object.onMouseDragHandler(
                        controller.dragStartX, controller.dragStartY,
                        e.clientX, e.clientY);

                } else {
                    controller.dragHelper.updateDraw(
                        (controller.dragStartX / window.innerWidth) * 2 - 1,
                        -1 * (controller.dragStartY / window.innerHeight) * 2 + 1,
                        controller.pointer.x,
                        controller.pointer.y
                    );
                }
            }
        }

        /* On mouse up */
        this.mainScene.renderer.domElement.onmouseup = function (e) {
            controller.dragTarget = null;

            controller.selectedTargetList = controller.dragHelper.getDragIntersects();
            for (let i = 0; i < controller.selectedTargetList.length; i++) {
                if (controller.selectedTargetList[i].hasOwnProperty('onTargetHandler')) {
                    controller.selectedTargetList[i].onTargetHandler(e);
                }
            }

            if (controller.selectedTargetList.length > 0) {
                /* Make dummy target */

                /* Retarget shifthelper to dummy target */

                this.dummyTargetSync = true;

                /* */
            }
            controller.dragHelper.removeSquare();
        }

        /* On mouse out */
        this.mainScene.renderer.domElement.onmouseout = function (e) {
            // console.log("Mouse out pos : " + e.clientX + ", " + e.clientY + "");
        }
    }

    raycastControl() {
        /* Raycaster */
        this.raycaster.setFromCamera(this.pointer, this.mainScene.flyingCamera.camera);
        const intersects = this.raycaster.intersectObjects(this.mainScene.scene.children, false);

        if (intersects.length > 0) {
            let firstIntersect = null;
            for (let i = 0; i < intersects.length; i++) {
                if (intersects[i].object.hasOwnProperty('ignoreIntersect')) {
                    if (intersects[i].object.ignoreIntersect == true) {
                        continue;
                    }
                }
                firstIntersect = intersects[i];
                break;
            }


            const INTERSECT_VERBOSE = 0;
            if (INTERSECT_VERBOSE) {
                if (firstIntersect.object.hasOwnProperty('meshName')) {
                    console.log(firstIntersect.object.meshName);
                } else {
                    console.log(firstIntersect);
                }
            }

            if (this.intersected == null
                || this.intersected.object.uuid != firstIntersect.object.uuid) {
                if (this.intersected &&
                    this.intersected.object.hasOwnProperty('intersectOutHandler')) {
                    this.intersected.object.intersectOutHandler();
                    console.log('out handler');
                }

                this.intersected = firstIntersect;
                if (firstIntersect.object.hasOwnProperty('intersectHandler')) {
                    firstIntersect.object.intersectHandler();
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
        // this.dragHelper.updateDraw(-0.3, -0.3, 0.3, 0.3);

        if (this.dummyTargetSync == true) {
            /* TODO */
        }
    }
}