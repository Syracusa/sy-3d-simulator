
/* 
Some code snippets are copied from
https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_terrain_raycast.html 
*/
import * as THREE from 'three';

export class Terrain {
    heights = [];

    constructor(scene) {
        this.scene = scene;
        this.genRandomTerrain();
    }

    drawSquare(v) {
        const geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            v[0], v[1], v[2],
            v[3], v[4], v[5],
            v[6], v[7], v[8],

            v[6], v[7], v[8],
            v[9], v[10], v[11],
            v[0], v[1], v[2]
        ]);

        let avg = (v[1] + v[4] + v[7] + v[10]) / 4;

        let intense = avg * 30 - 50;
        if (intense > 255)
            intense = 255;
        if (intense < 10)
            intense = 10;

        // intense = parseInt(intense);

        let red = parseInt(intense * 0.1);
        let green = parseInt(intense * 1.0);
        let blue = parseInt(intense * 0.01);

        let hcolor = (blue + green * 0x100 + red * 0x10000);
        // hcolor = 0x999999;

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const material = new THREE.MeshBasicMaterial({ color: hcolor });
        const mesh = new THREE.Mesh(geometry, material);

        mesh.receiveShadow = true;
        mesh.tname = 'floor';
        this.scene.add(mesh);
    }

    genNoplaneTerrain() {
        const RANDER_BOTH_SIDE = 0;
        const RANDER_DIAGONAL_LINE = 0;
        const DRAW_LINE = 0;
        let mapsize = 100;
        for (let i = 0; i < mapsize + 1; i++) {
            let xarr = [];
            for (let j = 0; j < mapsize + 1; j++) {
                xarr[j] = Math.random() * 10;
            }
            this.heights[i] = xarr;
        }

        for (let i = 1; i < mapsize; i++) {
            for (let j = 1; j < mapsize; j++) {
                this.heights[i][j] = (this.heights[i - 1][j - 1] + this.heights[i - 1][j] + this.heights[i][j - 1] + this.heights[i][j]) / 4;
            }
        }

        for (let i = 1; i < mapsize; i++) {
            for (let j = 1; j < mapsize; j++) {
                this.heights[i][j] = (this.heights[i - 1][j - 1] + this.heights[i - 1][j] + this.heights[i][j - 1] + this.heights[i][j]) / 4;
            }
        }

        for (let i = 1; i < mapsize - 1; i++) {
            for (let j = 1; j < mapsize - 1; j++) {
                let v = [
                    i, this.heights[i][j + 1], j + 1,
                    i + 1, this.heights[i + 1][j + 1], j + 1,
                    i + 1, this.heights[i + 1][j], j,
                    i, this.heights[i][j], j,
                ];
                this.drawSquare(v);

                if (RANDER_BOTH_SIDE) {
                    v = [
                        i, this.heights[i][j], j,
                        i + 1, this.heights[i + 1][j], j,
                        i + 1, this.heights[i + 1][j + 1], j + 1,
                        i, this.heights[i][j + 1], j + 1,
                    ];
                    this.drawSquare(v);
                }

                if (RANDER_DIAGONAL_LINE && DRAW_LINE) {
                    const material = new THREE.LineBasicMaterial({ color: 0xaaaaaa });
                    const points = [];
                    points.push(new THREE.Vector3(i, this.heights[i][j + 1] + 0.02, j + 1));
                    points.push(new THREE.Vector3(i + 1, this.heights[i + 1][j] + 0.02, j));

                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(geometry, material);
                    this.scene.add(line);
                }
            }
        }

        if (DRAW_LINE) {
            const material = new THREE.LineBasicMaterial({ color: 0xaaaaaa });

            for (let i = 0; i < mapsize; i++) {
                const points = [];
                for (let j = 0; j < mapsize; j++) {
                    points.push(new THREE.Vector3(i, this.heights[i][j] + 0.02, j));
                }
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, material);
                this.scene.add(line);
            }

            for (let j = 0; j < mapsize; j++) {
                const points = [];
                for (let i = 0; i < mapsize; i++) {
                    points.push(new THREE.Vector3(i, this.heights[i][j] + 0.02, j));
                }
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, material);
                this.scene.add(line);
            }
        }

    }

    genHeights(width, height) {
        const size = width * height;
        const data = new Uint8Array(size);


        for (let i = 0; i < size; i++) {
            data[i] += Math.random() * 5;
        }

        for (let i = 1; i < width - 1; i++) {
            for (let j = 1; j < height - 1; j++) {
                data[i * width + j] =
                    (data[(i - 1) * width + j] + data[(i - 1) * width + j - 1] + data[i * width + j - 1] + data[i * width + j]) / 4;
            }
        }

        return data;
    }

    genRandomTerrain() {
        const USE_PLANE = 0;
        const segments = 100;

        if (USE_PLANE) {
            const geometry = new THREE.PlaneGeometry(100, 100, segments - 1, segments - 1);
            geometry.rotateX(- Math.PI / 2);

            const vertices = geometry.attributes.position.array;

            const data = this.genHeights(segments, segments);

            for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
                // j + 1 because it is the y component that we modify
                vertices[j + 1] = data[i];
            }

            const texture = new THREE.CanvasTexture(this.generateTexture(data, segments, segments));
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;

            const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }));
            this.scene.add(mesh);

        } else {
            this.genNoplaneTerrain();
        }

    }

    generateTexture(data, width, height) {

        // bake lighting into texture

        let context, image, imageData, shade;

        const vector3 = new THREE.Vector3(0, 0, 0);

        const sun = new THREE.Vector3(1, 2, 1);
        sun.normalize();

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        context = canvas.getContext('2d');
        context.fillStyle = '#000000';
        context.fillRect(0, 0, width, height);

        image = context.getImageData(0, 0, canvas.width, canvas.height);
        imageData = image.data;

        for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {

            vector3.x = data[j - 2] - data[j + 2];
            vector3.y = 2;
            vector3.z = data[j - width * 2] - data[j + width * 2];
            vector3.normalize();

            shade = vector3.dot(sun);
            console.log(shade);

            // imageData[i] = ( shade * 256 ) * (0.5 + data[j] * 0.007);
            // imageData[i + 1] = (shade * 256) * (0.5 + data[j] * 0.007);
            // imageData[i + 2] = ( shade * 256) * (0.5 + data[j] * 0.007);

            imageData[i] = (shade * 0xFC) * (0.5 + data[j] * 0.07);;
            imageData[i + 1] = (shade * 0xF7) * (0.5 + data[j] * 0.07);;
            imageData[i + 2] = (shade * 0xDE) * (0.5 + data[j] * 0.07);;

        }

        context.putImageData(image, 0, 0);

        // Scaled 4x

        const canvasScaled = document.createElement('canvas');
        canvasScaled.width = width * 4;
        canvasScaled.height = height * 4;

        context = canvasScaled.getContext('2d');
        context.scale(4, 4);
        context.drawImage(canvas, 0, 0);

        image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height);
        imageData = image.data;

        for (let i = 0, l = imageData.length; i < l; i += 4) {

            const v = ~ ~(Math.random() * 5);

            imageData[i] += v;
            imageData[i + 1] += v;
            imageData[i + 2] += v;

        }

        context.putImageData(image, 0, 0);

        return canvasScaled;

    }


}