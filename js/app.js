// Declare global variables 
let container;
let camera;
let controls;
let renderer;
let scene;
let mesh;
let mesh2;

var settings = {
  metalness: 1,
  roughness: 0.4,
  envMapIntensity: 1.0,
};

var textureLoader = new THREE.TextureLoader();

// Init
function init() {
  container = document.querySelector('#scene-container');

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xCCDCDA);

  createCamera();
  createControls();
  createLights();
  createMeshes();
  createRenderer();

  // start the animation loop
  renderer.setAnimationLoop(() => {
    // controls.update();
    update();
    render();
  });
}

// Camera
function createCamera() {
  camera = new THREE.PerspectiveCamera(
    45, // FOV
    container.clientWidth / container.clientHeight, // aspect
    1, // near clipping plane
    100, // far clipping plane
  );

  camera.position.set(0, 0, 12);
}

// Orbit Controls
function createControls() {
  controls = new THREE.OrbitControls(camera, container);
  // controls.target.set(0, 5, 0);
  controls.enableZoom = true;
  // controls.autoRotate = true;
  controls.enableKeys = false;
}

// Lights
function createLights() {
  const ambientLight = new THREE.HemisphereLight(
    0xddeeff, // sky color
    0x202020, // ground color
    10, // intensity
  );
  scene.add(ambientLight);

  const mainLight = new THREE.SpotLight(0xffffff, 80);
  mainLight.position.set(0, 0, 200);
  mainLight.angle = 0.3;
  scene.add(mainLight);

  const sunLight = new THREE.SpotLight(0x202020, 200);
  sunLight.position.set(0, 20, 300);
  sunLight.angle = 1;
  scene.add(sunLight);
}

//  Mesh
function createMeshes() {
  const geometry = new THREE.CubeGeometry(5, 7, 0.05);
  const geometry_sheen = new THREE.PlaneGeometry(5, 7);
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('./textures/Front.png');
  const textureBack = textureLoader.load('./textures/Back.png');
  const texture_sheen = textureLoader.load('./textures/reflection-gold.png');

  // Use MeshBasicMaterial which is not affected by lights.
  var frontMaterial = new THREE.MeshBasicMaterial({
    map: texture,
  });

  var backMaterial = new THREE.MeshStandardMaterial({
    map: textureBack,
  });
  var sideMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
  });

  var materials = [
    sideMaterial,
    sideMaterial,
    sideMaterial,
    sideMaterial,
    frontMaterial,
    backMaterial
  ];

  var sheen = new THREE.MeshStandardMaterial({
    map: texture_sheen,
    metalness: settings.metalness,
    roughness: settings.roughness,
    shininess: 1,
    reflectivity: 1,
    transparent: true,
  });

  mesh = new THREE.Mesh(geometry, materials);
  mesh2 = new THREE.Mesh(geometry_sheen, sheen);

  // Update Sheen Map
  mesh2.material.needsUpdate = true;

  // Sheen Position
  mesh2.position.z = 0.05;
  scene.add(mesh);
  scene.add(mesh2);
}

// Update materials on input selection
function updateMaterials(map) {
  texture_sheen = textureLoader.load("./textures/reflection-"+ map +".png");
  mesh2.material.map = texture_sheen;
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;
  renderer.physicallyCorrectLights = true;
  container.appendChild(renderer.domElement);
}

// perform any updates to the scene, called once per frame
// avoid heavy computation here
function update() {
  // Don't delete this function!
}

// render, or 'draw a still image', of the scene
function render() {
  renderer.render(scene, camera);
}

// a function that will be called every time the window gets resized.
// It can get called a lot, so don't put any heavy computation in here!
function onWindowResize() {
  // set the aspect ratio to match the new browser window aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  // update the size of the renderer AND the canvas
  renderer.setSize(container.clientWidth, container.clientHeight);
}

window.addEventListener('resize', onWindowResize);

// call the init function to set everything up
init();

