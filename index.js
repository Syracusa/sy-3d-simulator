import { MainScene } from './src/MainScene.js';

let ctx = new MainScene();
let minIntervalMs = 10;
let oldTime = Date.now();
let lastPanelUpdate = Date.now();
let panelUpdateTimeMs = 500;

function onWindowResize() {
    ctx.flyingCamera.updateScreenRatio( window.innerWidth / window.innerHeight);
    ctx.renderer.setSize( window.innerWidth, window.innerHeight );
    ctx.labelRenderer.setSize( window.innerWidth, window.innerHeight );
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

    let panelUpdateTimeDiff = currtime - lastPanelUpdate;
    if (panelUpdateTimeDiff >= panelUpdateTimeMs){
        lastPanelUpdate = currtime;
        ctx.updatePanelInfo();
    }
};

animate();
