import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';

//loading
const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load('/NormalMap.png');

//Scene
const scene = new THREE.Scene();

//Create our sphere
const geometry = new THREE.SphereGeometry(0.5, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: '#ff0000',
  emissive: '#000',
  depthTest: false,
  alphaTest: 0,
  normalMap: normalTexture,

  side: THREE.FrontSide,
});
const mesh = new THREE.Mesh(geometry, material);

//Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

scene.add(mesh);

//Light
const light = new THREE.PointLight(0xffffff, 1, 30);
light.position.set(0, 15, 10);
scene.add(light);

//Camera
const camera = new THREE.PerspectiveCamera(
  8,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 15;
scene.add(camera);

//Renderer
const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

//Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 10;

//Resize
window.addEventListener('resize', () => {
  //Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //Update Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};

loop();

const tl = gsap.timeline({ defaults: { duration: 0.5, ease: 'power' } });

tl.fromTo(
  mesh.scale,
  {
    z: 0,
    x: 0,
    y: 0,
  },
  {
    z: 1,
    y: 1,
    x: 1,
  }
);

tl.fromTo('nav', { y: '-100%' }, { y: '0%' });
tl.fromTo('.title', { opacity: 0 }, { opacity: 1 });

//Mouse Animation Color

let rgb = [];

window.addEventListener('mousedown', (e) => {
  rgb = [
    Math.round((e.pageX / sizes.width) * 255),
    Math.round((e.pageY / sizes.height) * 255),
    150,
  ];

  let newColor = new THREE.Color(`rgb(${rgb.join(',')})`);

  gsap.to(mesh.material.color, {
    r: newColor.r,
    g: newColor.g,
    b: newColor.b,
  });
});
