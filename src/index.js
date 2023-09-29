//CSSの読み込み
import "./scss/style.scss";
//Three.jsの読み込み
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as dat from "lil-gui";
import vertexShader from "./shaders/vertexShader";
import fragmentShader from "./shaders/fragmentShader";
import skyImage from "../dist/images/sky_opt.jpg";

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
// const skyTexture = textureLoader.load(skyImage);
// scene.background = skyTexture;

// Geometry
const geometry = new THREE.PlaneGeometry(15, 15, 512, 512);
// const geometry = new THREE.SphereGeometry(0.5, 32, 16);

//color
const colorObject = {};
colorObject.depthColor = "#2d81ae";
colorObject.surfaceColor = "#66c1f9";

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uWaveLength: { value: 0.38 },
    uFrequency: { value: new THREE.Vector2(6.6, 3.5) },
    uTime: { value: 0 },
    uWaveSpeed: { value: 0.75 },
    uDepthColor: { value: new THREE.Color(colorObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(colorObject.surfaceColor) },
    uColorOffset: { value: 0.03 },
    uColorMultiplier: { value: 9.0 },
    uSmallWaveElevation: { value: 0.15 },
    uSmallWaveFrequency: { value: 3.0 },
    uSmallWaveSpeed: { value: 0.2 },
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
materialFolder
  .add(material.uniforms.uColorOffset, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uColorOffset");
materialFolder
  .add(material.uniforms.uColorMultiplier, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uColorMultiplier");
materialFolder
  .add(material.uniforms.uSmallWaveElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uSmallWaveElevation");
materialFolder
  .add(material.uniforms.uSmallWaveFrequency, "value")
  .min(0)
  .max(30)
  .step(0.01)
  .name("uSmallWaveFrequency");
materialFolder
  .add(material.uniforms.uSmallWaveSpeed, "value")
  .min(0)
  .max(10)
  .step(0.01)
  .name("uSmallWaveSpeed");
materialFolder.addColor(colorObject, "depthColor").onChange(() => {
  material.uniforms.uDepthColor.value.set(colorObject.depthColor);
});
materialFolder.addColor(colorObject, "surfaceColor").onChange(() => {
  material.uniforms.uSurfaceColor.value.set(colorObject.surfaceColor);
});

// gui.show(false);

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

const cameraFolder = gui.addFolder("camera");
cameraFolder
  .add(camera.position, "x")
  .min(-10)
  .max(10)
  .step(0.001)
  .name("cameraPositionX");
cameraFolder
  .add(camera.position, "y")
  .min(-10)
  .max(10)
  .step(0.001)
  .name("cameraPositionY");
cameraFolder
  .add(camera.position, "z")
  .min(-10)
  .max(10)
  .step(0.001)
  .name("cameraPositionZ");

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

  //カメラを円周上に周回する
  camera.position.x = Math.sin(elapsedTime * 0.15) * 3;
  camera.position.z = Math.cos(elapsedTime * 0.15) * 1.5;

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(animate);
};

animate();
