import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Loading Manager
const loadingManager = new THREE.LoadingManager();
const loadingOverlay = document.getElementById('loading-overlay');

loadingManager.onLoad = function () {
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
};

loadingManager.onError = function (url) {
    console.error('There was an error loading ' + url);
    if(loadingOverlay) {
        const loadingText = loadingOverlay.querySelector('p');
        if (loadingText) {
            loadingText.textContent = 'Error loading model. Displaying fallback cube.';
        }
        // Hide overlay after a short delay to show the error message
        setTimeout(() => {
            if (loadingOverlay) loadingOverlay.style.display = 'none';
        }, 3000);
    }
};


// Basic setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf9f9f9); // Set off-white background
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
camera.position.set(0, 0, 1);
camera.lookAt(0, 0, 0);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;
controls.autoRotate = false; // Turned off auto-rotation


// Model
let model;
const loader = new GLTFLoader(loadingManager);
loader.load(
    'model.glb', // This file does not exist, so it will fall back to the cube.
    function (gltf) {
        model = gltf.scene;
        // Center and scale the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center); // center the model
        model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
            }
        });
        scene.add(model);
    },
    undefined,
    function (error) {
        console.error('An error happened while loading the model:', error);
        // Add a fallback cube if model fails to load
        const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
        const material = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.1, roughness: 0.2 });
        model = new THREE.Mesh(geometry, material);
        model.castShadow = true;
        scene.add(model);
    }
);

// Lights - Simplified and more effective lighting setup
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 2 );
hemiLight.position.set( 0, 20, 0 );
scene.add( hemiLight );

const dirLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
dirLight.position.set( 5, 5, 5 );
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
// Adjust the shadow camera frustum to tightly contain the scene objects
dirLight.shadow.camera.top = 4;
dirLight.shadow.camera.bottom = -4;
dirLight.shadow.camera.left = -4;
dirLight.shadow.camera.right = 4;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
scene.add( dirLight );


// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // only required if controls.enableDamping or controls.autoRotate are set to true
  renderer.render(scene, camera);
}

animate();

// Handle window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);