
import * as THREE from 'three';

import { MySceneContext } from './scene.js';

let ctx = new MySceneContext();

let oldTime = Date.now();
function animate() {
    let currtime = Date.now();
    let timeDiff = currtime - oldTime;
    oldTime = currtime;

    ctx.update(timeDiff);
    requestAnimationFrame(animate);
};

animate();
