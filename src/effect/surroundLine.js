import * as THREE from 'three';
import { color } from '../config';

export class SurroundLine {
    constructor(scene, child) {
        this.scene = scene;
        this.child = child;
        
        // 模型颜色，底部显示颜色
        this.meshColor = color.mesh;
        // 头部颜色，顶部显示颜色
        this.headColor = color.head;

        // 创建物体
        this.createMesh();

        // 创建描边线框
        this.createLine();
    }

    computedMesh() {
        this.child.geometry.computeBoundingBox();
        this.child.geometry.computeBoundingSphere();
    }

    createMesh() {
        this.computedMesh();

        const { max, min} = this.child.geometry.boundingBox;

        // 高度差
        const size = max.z - min.z;

        const material = new THREE.ShaderMaterial({ 
            uniforms: {
                u_city_color: {
                    value: new THREE.Color(this.meshColor)
                },
                u_head_color: {
                    value: new THREE.Color(this.headColor)
                },
                u_size: {
                    value: size
                }
            },
            vertexShader: `
                varying vec3 v_position;

                void main() {
                    v_position = position;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 v_position;
                
                uniform vec3 u_city_color;
                uniform vec3 u_head_color;
                uniform float u_size;
                
                void main() {
                    vec3 base_color = mix(u_city_color, u_head_color, v_position.z / u_size);

                    gl_FragColor = vec4(base_color, 1.0);
                }
            `
        });

        const mesh = new THREE.Mesh(this.child.geometry, material);

        // 让 mesh 继承 child 的旋转、缩放、平移
        mesh.position.copy(this.child.position);
        mesh.rotation.copy(this.child.rotation);
        mesh.scale.copy(this.child.scale);

        this.scene.add(mesh);
    }

    createLine() {
        // 获取建筑物的外围
        const geometry = new THREE.EdgesGeometry(this.child.geometry);

        // const material = new THREE.LineBasicMaterial({ color: color.soundLine })

        const material = new THREE.ShaderMaterial({
            uniforms: {
                line_color: {
                    value: new THREE.Color(color.soundLine)
                }
            },
            vertexShader: `
                void main() {
                    gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 line_color;

                void main() {
                    gl_FragColor = vec4(line_color, 1.0);
                }
            `
        })

        // 创建线条
        const line = new THREE.LineSegments(geometry, material);

        // 继承建筑物的偏移量和旋转
        line.scale.copy(this.child.scale);
        line.rotation.copy(this.child.rotation)
        line.position.copy(this.child.position)

        this.scene.add(line)
    }
}
