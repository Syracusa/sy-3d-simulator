import { GUI } from 'dat.gui'
import * as THREE from 'three'
import { DragHelper } from './DragHelper.js';
import { ShiftHelper } from './ShiftHelper.js';

const MOUSE_STATE_DEFAULT = 0;
const MOUSE_STATE_RAISE_TERRAIN = 1;
const MOUSE_STATE_DROP_TERRAIN = 2;

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

        this.dummyTargetSync = false;

        /* Dummy target for shifthelper */
        this.genDummy();

        /* ShiftHelper */
        this.shiftHelper = new ShiftHelper(scene,
            this.flyingCamera.camera,
            this.dummyTarget);
    }

    initDatGui(controller) {
        let callbacks = {
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
            'Raise terrain test': function () {
                console.log('Terrain raise test');
                controller.mainScene.terrain.raiseHeighPoint(50, 50, 10);
            },
            'Drop terrain test': function () {
                console.log('Terrain raise test');
                controller.mainScene.terrain.raiseHeighPoint(50, 50, -10);
            },
            'Raise Terrain': function () {
                controller.mouseMode = MOUSE_STATE_RAISE_TERRAIN;
            },
            'Drop Terrain': function () {
                controller.mouseMode = MOUSE_STATE_DROP_TERRAIN;
            },
            'Default Mode': function () {
                controller.mouseMode = MOUSE_STATE_DEFAULT;
            }
        }

        const gui = new GUI()

        const nodeFolder = gui.addFolder('Node');
        nodeFolder.add(callbacks, 'Create new node');
        nodeFolder.add(callbacks, 'Remove node');
        nodeFolder.add(callbacks, 'Remove all node');
    
        nodeFolder.open();
    
        const terrainFolder = gui.addFolder('Terrain');
        terrainFolder.add(callbacks, 'Raise terrain test');
        terrainFolder.add(callbacks, 'Drop terrain test');

        terrainFolder.open();

        const mouseModeFolder = gui.addFolder('MouseMode');
        mouseModeFolder.add(callbacks, 'Raise Terrain');
        mouseModeFolder.add(callbacks, 'Drop Terrain');
        mouseModeFolder.add(callbacks, 'Default Mode');
    }

    genDummy() {
        const geometryS = new THREE.SphereGeometry(1, 32, 32);
        const materialS = new THREE.MeshStandardMaterial({
            color: 0xFFAACF,
            // wireframe: true,
        });

        const sphere1 = new THREE.Mesh(geometryS, materialS);

        sphere1.position.set(45, 100, 48);
        sphere1.meshName = 'Dummy';
        this.mainScene.add(sphere1);

        this.dummyTarget = sphere1;
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
            this.shiftHelper.retarget(this.dummyTarget);
        }

        if (this.intersected.object.hasOwnProperty('onTargetHandler')) {
            this.intersected.object.onTargetHandler(e);
        }
    }

    addMouseEventListener(controller) {
        /* On mouse down */
        this.mainScene.renderer.domElement.onmousedown = function (e) {
            /* Warning : this != Controller */
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
            /* Warning : this != Controller */
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
            /* Warning : this != Controller */
            controller.dragTarget = null;

            controller.selectedTargetList = controller.dragHelper.getDragIntersects();
            controller.selectdTargetOrigPos = [];

            let maxX = -99999.9;
            let minX = 99999.9;
            let maxY = -99999.9;
            let minY = 99999.9;
            let maxZ = -99999.9;
            let minZ = 99999.9;
            
            for (let i = 0; i < controller.selectedTargetList.length; i++) {
                let selTarget = controller.selectdTargetList[i];
                
                if (selTarget.hasOwnProperty('onTargetHandler')) {
                    selTarget.onTargetHandler(e);
                }
                controller.selectdTargetOrigPos[i] = selTarget.position.clone();

                if (selTarget.position.x > maxX)
                    maxX = selTarget.position.x;
                if (selTarget.position.x < minX)
                    minX = selTarget.position.x;
                if (selTarget.position.y > maxY)
                    maxY = selTarget.position.y;
                if (selTarget.position.y < minY)
                    minY = selTarget.position.y;
                if (selTarget.position.z > maxZ)
                    maxZ = selTarget.position.z;
                if (selTarget.position.z < minZ)
                    minZ = selTarget.position.z;
            }

            if (controller.selectedTargetList.length > 0) {
                /* Calc Max x, y, z and Min x, y, z */
                targetCenterPos = new THREE.Vector3((minX + maxX) / 2,
                                                    (minY + maxY) / 2, 
                                                    (minZ + maxZ) / 2);

                /* Move dummy target to center of targets */
                controller.dummyTargetOriginalpos = targetCenterPos.clone();

                /* Shifthelper retarget to dummy target */
                controller.shiftHelper.retarget(this.dummyTarget);

                controller.dummyTargetSync = true;
            }
            controller.dragHelper.removeSquare();
        }

        /* On mouse out */
        this.mainScene.renderer.domElement.onmouseout = function (e) {
            /* Warning : this != Controller */
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
            let diffPos = this.dummyTarget.position.clone.sub(this.dummyTargetOriginalpos);

            for (let i = 0; i < controller.selectdTargetList.length; i++){
                let elem = this.selectdTargetList[i];
                let origPos = this.selectdTargetOrigPos[i];

                elem.position = origPos.clone().sub(diffPos);   
            }
        }
    }
}