import * as THREE from 'three';

export class Terrain {
    heights = [];

    constructor(scene) {
        console.log(scene);
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

        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.computeVertexNormals()
        const material = new THREE.MeshBasicMaterial({ color: 0xFCF7DE });
        const mesh = new THREE.Mesh(geometry, material);

        // mesh.castShadow = true;
        // mesh.receiveShadow = true;
        this.scene.add(mesh);
    }

    genRandomTerrain() {
        const RANDER_BOTH_SIDE = 0;
        const RANDER_DIAGONAL_LINE = 1;

        let mapsize = 100;
        for (let i = 0; i < mapsize + 1; i++) {
            let xarr = [];
            for (let j = 0; j < mapsize + 1; j++) {
                xarr[j] = Math.random() * 2 + 1;
            }
            this.heights[i] = xarr;

        }

        for (let i = 0; i < mapsize; i++) {
            for (let j = 0; j < mapsize; j++) {
                let v = [
                    i, this.heights[i][j + 1], j + 1,
                    i + 1, this.heights[i + 1][j + 1], j + 1,
                    i + 1, this.heights[i + 1][j], j,
                    i, this.heights[i][j], j,
                ];
                console.log(v);
                this.drawSquare(v);

                if (RANDER_BOTH_SIDE){
                    v = [
                        i, this.heights[i][j], j,
                        i + 1, this.heights[i + 1][j], j,
                        i + 1, this.heights[i + 1][j + 1], j + 1,
                        i, this.heights[i][j + 1], j + 1,
                    ];
                    console.log(v);
                    this.drawSquare(v);
                }

                if (RANDER_DIAGONAL_LINE){
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