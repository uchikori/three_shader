//CSSの読み込み
import "./scss/style.scss";
//Three.jsの読み込み
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let scene, camera, renderer, pointLight, controls;

window.addEventListener("load", init);
function init() {
  //シーン
  scene = new THREE.Scene();
  //カメラ
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 500);
  //レンダラー
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  //テクスチャを追加
  let textures = new THREE.TextureLoader().load("./images/earth_opt.jpg");

  //ジオメトリー
  let ballGeometry = new THREE.SphereGeometry(100, 64, 32);

  //マテリアル
  let ballMaterial = new THREE.MeshPhysicalMaterial({ map: textures });

  //メッシュ化
  let ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
  scene.add(ballMesh);

  //平行光源を追加
  let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  //ポイント光源
  pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(-200, -200, -200);
  scene.add(pointLight);

  //ポイント光源がどこにあるのか
  let pointLightHelper = new THREE.PointLightHelper(pointLight, 30);
  scene.add(pointLightHelper);

  //マウス操作
  controls = new OrbitControls(camera, renderer.domElement);

  window.addEventListener("resize", onWindowResize);

  //アニメーション
  animate();
}

//ブラウザのリサイズに対応
function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  //カメラのアスペクト比を正す
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
//ポイント光源を公転させる
function animate() {
  pointLight.position.set(
    200 * Math.sin(Date.now() / 500),
    200 * Math.sin(Date.now() / 1000),
    200 * Math.cos(Date.now() / 500)
  );
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
