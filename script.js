let scene, camera, renderer;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202020);

  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 1000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const container = document.getElementById("game-container");
  container.appendChild(renderer.domElement);

  addDynamicLighting();
  addFallingCubes();

  animate();

  window.addEventListener("resize", onWindowResize, false);
}

function addDynamicLighting() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5, 10, 7.5);
  dirLight.castShadow = true;
  scene.add(dirLight);

  const pointLight = new THREE.PointLight(0xffffff, 1, 100);
  pointLight.position.set(0, 10, 0);
  pointLight.castShadow = true;
  scene.add(pointLight);

  const spotLight = new THREE.SpotLight(0xffffff, 0.5);
  spotLight.position.set(-5, 15, 5);
  spotLight.castShadow = true;
  scene.add(spotLight);
}

function addFallingCubes() {
  const materials = [
    new THREE.MeshPhysicalMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.2, clearcoat: 1.0, reflectivity: 0.9 }),
    new THREE.MeshPhysicalMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.5, reflectivity: 0.7 }),
    new THREE.MeshPhysicalMaterial({ color: 0x777777, metalness: 0.3, roughness: 0.7, reflectivity: 0.5 })
  ];

  const geometry = new THREE.BoxGeometry(1, 1, 1);

  for (let i = 0; i < 50; i++) {
    const material = materials[Math.floor(Math.random() * materials.length)];
    const cube = new THREE.Mesh(geometry, material);

    cube.position.set(
      (Math.random() - 0.5) * 20,
      Math.random() * 20,
      (Math.random() - 0.5) * 20
    );

    cube.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );

    scene.add(cube);
  }
}

function animate() {
  requestAnimationFrame(animate);

  scene.children.forEach((child) => {
    if (child instanceof THREE.Mesh) {
      child.rotation.x += 0.01;
      child.rotation.y += 0.01;
      child.position.y -= 0.05;
      if (child.position.y < -10) {
        child.position.y = 20;
      }
    }
  });

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = init;