import * as THREE from 'three';

import { loadFBX } from '../utils/index';
import { SurroundLine } from '../effect/surroundLine'
import { Background } from '../effect/background'

export class City {
    constructor(scene) {
        this.scene = scene;
        this.loadCity();
    }

    loadCity() {
        // 加载模型，并渲染到画布上
        loadFBX('/src/model/beijing.fbx').then((res) => {
            res.traverse((child) => {
                if (!child.isMesh) {
                    return;
                }

                new SurroundLine(this.scene, child);
            });

            new Background(this.scene);
        })
    }

    start() {

    }
}