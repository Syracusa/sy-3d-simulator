
import * as THREE from 'three';

import { MySceneContext } from './scene.js';

let ctx = new MySceneContext();

let minIntervalMs = 10;

let oldTime = Date.now();


function onWindowResize() {
    ctx.cam.updateScreenRatio( window.innerWidth / window.innerHeight);
    ctx.cam.camera.updateProjectionMatrix();
    ctx.renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener( 'resize', onWindowResize );
onWindowResize();

function animate() {
    requestAnimationFrame(animate);

    let currtime = Date.now();
    let timeDiff = currtime - oldTime;
    if (timeDiff >= minIntervalMs){
        oldTime = currtime;
        ctx.update(timeDiff);
    }
};

animate();
