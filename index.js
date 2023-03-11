
import * as THREE from 'three';

import { MySceneContext } from './scene.js';

let ctx = new MySceneContext();

let minIntervalMs = 10;

let oldTime = Date.now();
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
