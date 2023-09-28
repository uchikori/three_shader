//CSSの読み込み
import "./scss/style.scss";
//Three.jsの読み込み
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as dat from "lil-gui";
import vertexShader from "./shaders/vertexShader";
import fragmentShader from "./shaders/fragmentShader";

/**
 * デバッグ
 */
const gui = new dat.GUI();
gui.add(document, "title");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
// const geometry = new THREE.SphereGeometry(1, 32, 16);

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uWaveLength: { value: 0.2 },
    uFrequency: { value: new THREE.Vector2(10.0, 2.5) },
    uTime: { value: 0 },
    uWaveSpeed: { value: 0.75 },
  },
});

const materialFolder = gui.addFolder("ShaderMaterial");
materialFolder
  .add(material.uniforms.uWaveLength, "value")
  .min(0)
  .max(1)
  .step(0.01)
  .name("波の長さ");
materialFolder
  .add(material.uniforms.uFrequency.value, "x")
  .min(0)
  .max(50)
  .step(0.5)
  .name("周波数X");
materialFolder
  .add(material.uniforms.uFrequency.value, "y")
  .min(0)
  .max(50)
  .step(0.5)
  .name("周波数Y");
materialFolder
  .add(material.uniforms.uWaveSpeed, "value")
  .min(0)
  .max(10)
  .step(0.01)
  .name("波の速さ");

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = -Math.PI / 2;
scene.add(mesh);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0.2, 0.7, 0.7);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const animate = () => {
  //時間取得
  const elapsedTime = clock.getElapsedTime();

  material.uniforms.uTime.value = elapsedTime;

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();
