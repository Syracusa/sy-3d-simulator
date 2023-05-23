import * as THREE from 'three';

export class Terrain {
    heights = [];

    constructor(scene) {
        this.scene = scene;
        this.genTerrain(10);
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

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.computeVertexNormals(); /* For shadows */

        const count = geometry.attributes.position.count;
        geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(count * 3), 3));

        const color = new THREE.Color();
        const positions = geometry.attributes.position;
        const colors = geometry.attributes.color;

        for (let i = 0; i < count; i++) {
            let posY = positions.getY(i);
            if (posY > 16.0) {
                color.setRGB(1.0 / 2.0, (posY / 20.0), (posY / 20.0));
                colors.setXYZ(i, color.r, color.g, color.b);
            } else {
                color.setRGB(1.0 / 2.0, (posY / 20.0) * 0.5, (posY / 20.0) * 0.1);
                colors.setXYZ(i, color.r, color.g, color.b);
            }
        }
        let material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            vertexColors: true
        });
        
        const mesh = new THREE.Mesh(geometry, material);

        mesh.receiveShadow = true;
        mesh.castShadow = false;
        mesh.meshName = 'floor';
        this.scene.add(mesh);
    }

    genTerrain(bumpyness) {
        const RANDER_BOTH_SIDE = 0;
        const RANDER_DIAGONAL_LINE = 0;
        const DRAW_LINE = 0;
        let mapsize = 100;
        for (let i = 0; i < mapsize + 1; i++) {
            let xarr = [];
            for (let j = 0; j < mapsize + 1; j++) {
                xarr[j] = Math.random() * bumpyness + 10;
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
            data[i] += Math.random() * 10;
        }

        for (let i = 1; i < width - 1; i++) {
            for (let j = 1; j < height - 1; j++) {
                data[i * width + j] =
                    (data[(i - 1) * width + j] + data[(i - 1) * width + j - 1] + data[i * width + j - 1] + data[i * width + j]) / 4;
            }
        }
        for (let i = 1; i < width - 1; i++) {
            for (let j = 1; j < height - 1; j++) {
                data[i * width + j] =
                    (data[(i - 1) * width + j] + data[(i - 1) * width + j - 1] + data[i * width + j - 1] + data[i * width + j]) / 4;
            }
        }

        return data;
    }
}