import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { loadFBX } from '../utils/index';
import { SurroundLine } from '../effect/surroundLine'
import { Background } from '../effect/background'

export class City {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;

        this.tweenPosition = null;
        this.tweenRotation = null;

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

            this.initEffect();
        })
    }

    initEffect() {
        new Background(this.scene);

        this.addClick();
    }
    
    addClick() {
        let flag = true;

        document.onmousedown = () => {
            flag = true;

            document.onmousemove = () => {
                flag = false;
            }
        }

        document.onmouseup = (event) => {
            if (flag) {
                this.clickEvent(event);
            }

            document.onmousemove = null;
        }    
    }

    clickEvent(event) {
        const camera = this.camera;
        const scene = this.scene;

        // 获取到浏览器坐标
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2  + 1;

        // 创建设备坐标(三维)
        const standardVector = new THREE.Vector3(x, y, 0.5);

        // 转化为世界坐标
        const worldVertor = standardVector.unproject(camera);
        
        // 做序列化
        const ray = worldVertor.sub(camera.position).normalize();

        // 如何实现点击选中
        // 创建一个射线发射器，用来发射一条射线
        const raycaster = new THREE.Raycaster(camera.position, ray);

        // 返回射线碰撞到的物体
        const intersects = raycaster.intersectObjects(scene.children, true);

        let point3d = null;

        if (intersects.length > 0) {
            point3d = intersects[0];
        }

        if (point3d) {

            const proportion = 3;
            // 开始动画来修改观察点
            const time = 1000;

            this.tweenPosition = new TWEEN.Tween(camera.position).to({
                x: point3d.point.x * proportion,
                y: point3d.point.y * proportion,
                z: point3d.point.z * proportion,
            }, time).start();

            this.tweenRotation = new TWEEN.Tween(camera.rotation).to({
                x: camera.rotation.x,
                y: camera.rotation.y,
                z: camera.rotation.z
            }, time).start();
        }
    }

    start() {
        if (this.tweenPosition && this.tweenRotation) {
            this.tweenPosition.update();
            this.tweenRotation.update();
        }
    }
}