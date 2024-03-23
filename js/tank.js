// 导入three.js
import * as THREE from './three.module.min.js';
import Stats from './stats.module.js';
import {OrbitControls} from './OrbitControls.js';
import {GLTFLoader} from './GLTFLoader.js';
// 场景
const scene = new THREE.Scene();
// 相机
const camera = new THREE.PerspectiveCamera();
camera.aspect = window.innerWidth / window.innerHeight;
camera.position.set(10, 2, 0);
camera.lookAt(0,2,0);
// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.antialias = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
window.onresize = function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
};
document.body.appendChild(renderer.domElement);
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.target.set(0, 2, 0);
orbitControls.update();
// 灯
const color = 0xFFFFFF;
const intensity = 2;
const light = new THREE.AmbientLight(color,intensity);
scene.add(light);

// 创建材质


// 加载模型
/*
const textureLoader = new THREE.TextureLoader();
const material = new THREE.MeshPhongMaterial({
	map:textureLoader.load('')
});
*/


function dumpObject(obj, lines = [], isLast = true, prefix = '') {
	const localPrefix = isLast ? '└─' : '├─';
	lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
	const newPrefix = prefix + (isLast ? '  ' : '│ ');
	const lastNdx = obj.children.length - 1;
	obj.children.forEach((child, ndx) => {
		const isLast = ndx === lastNdx;
		dumpObject(child, lines, isLast, newPrefix);
	});
	return lines;
}

const gltfLoader = new GLTFLoader();
gltfLoader.load('../3D/tank.gltf', function (gltf) {
	const root = gltf.scene;
    scene.add(root);
	console.log(dumpObject(root).join('\n'));
});

const stats = new Stats();
document.body.appendChild(stats.domElement);
function render() {
	stats.update();
	orbitControls.update();
	renderer.render(scene, camera);
	requestAnimationFrame(render);
}
render();