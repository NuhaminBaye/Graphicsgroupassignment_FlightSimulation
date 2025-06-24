import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#canvas'), antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Aircraft state
const aircraft = {
    speed: 0,
    altitude: 200,
    roll: 0,
    pitch: 0,
    yaw: 0,
    maxSpeed: 1000,
    acceleration: 0.5,
    deceleration: 0.3,
    turnSpeed: 0.02,
    position: new THREE.Vector3(0, 200, 0)
};

// Enhanced Aircraft Model
const aircraftGroup = new THREE.Group();

// Main fuselage
const fuselageGeometry = new THREE.CylinderGeometry(1.5, 1.8, 25, 32);
const fuselageMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xFFFFFF,
    shininess: 100
});
const fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial);
fuselage.rotation.z = Math.PI / 2;
aircraftGroup.add(fuselage);

// Nose cone
const noseGeometry = new THREE.ConeGeometry(1.8, 6, 32);
const nose = new THREE.Mesh(noseGeometry, fuselageMaterial);
nose.rotation.z = -Math.PI / 2;
nose.position.set(15.5, 0, 0);
aircraftGroup.add(nose);

// Wings
const wingGeometry = new THREE.BoxGeometry(20, 0.4, 4);
const wingMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
leftWing.position.set(-2, -1.5, -10);
aircraftGroup.add(leftWing);

const rightWing = leftWing.clone();
rightWing.position.set(-2, -1.5, 10);
aircraftGroup.add(rightWing);

// Wing tips
const wingTipGeometry = new THREE.BoxGeometry(2, 0.3, 1);
const wingTipMaterial = new THREE.MeshPhongMaterial({ color: 0xFF0000 });
const leftWingTip = new THREE.Mesh(wingTipGeometry, wingTipMaterial);
leftWingTip.position.set(-2, -1.5, -14);
aircraftGroup.add(leftWingTip);

const rightWingTip = leftWingTip.clone();
rightWingTip.position.set(-2, -1.5, 14);
aircraftGroup.add(rightWingTip);

// Tail
const verticalStabilizerGeometry = new THREE.BoxGeometry(3, 5, 0.4);
const verticalStabilizer = new THREE.Mesh(verticalStabilizerGeometry, wingMaterial);
verticalStabilizer.position.set(-13, 2, 0);
aircraftGroup.add(verticalStabilizer);

const horizontalStabilizerGeometry = new THREE.BoxGeometry(4, 0.4, 8);
const horizontalStabilizer = new THREE.Mesh(horizontalStabilizerGeometry, wingMaterial);
horizontalStabilizer.position.set(-13, 0, 0);
aircraftGroup.add(horizontalStabilizer);

// Engines
const engineGeometry = new THREE.CylinderGeometry(1, 1.2, 4, 16);
const engineMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
const leftEngine = new THREE.Mesh(engineGeometry, engineMaterial);
leftEngine.rotation.z = Math.PI / 2;
leftEngine.position.set(-1, -1.5, -8);
aircraftGroup.add(leftEngine);

const rightEngine = leftEngine.clone();
rightEngine.position.set(-1, -1.5, 8);
aircraftGroup.add(rightEngine);

// Windows
const windowGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.6);
const windowMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x111111,
    transparent: true,
    opacity: 0.8
});

for(let i = -6; i < 6; i++) {
    const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    leftWindow.position.set(i * 2, 1.2, -1.6);
    aircraftGroup.add(leftWindow);

    const rightWindow = leftWindow.clone();
    rightWindow.position.z = 1.6;
    aircraftGroup.add(rightWindow);
}

const cockpitWindowGeometry = new THREE.BoxGeometry(3, 1, 2.5);
const cockpitWindow = new THREE.Mesh(cockpitWindowGeometry, windowMaterial);
cockpitWindow.position.set(12, 0.5, 0);
aircraftGroup.add(cockpitWindow);

aircraftGroup.scale.set(0.5, 0.5, 0.5);
aircraftGroup.position.copy(aircraft.position);
scene.add(aircraftGroup);

// Terrain
const terrainGeometry = new THREE.PlaneGeometry(10000, 10000, 100, 100);
const terrainMaterial = new THREE.MeshPhongMaterial({
    color: 0x4a7c59,
    side: THREE.DoubleSide
});

const vertices = terrainGeometry.attributes.position.array;
for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const z = vertices[i + 2];
    
    let elevation = Math.sin(x * 0.001) * Math.cos(z * 0.001) * 500;
    elevation += Math.sin(x * 0.002) * Math.cos(z * 0.002) * 200;
    elevation += (Math.random() - 0.5) * 100;
    
    vertices[i + 1] = elevation;
}
terrainGeometry.attributes.position.needsUpdate = true;

const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
terrain.rotation.x = -Math.PI / 2;
terrain.position.y = -1000;
terrain.receiveShadow = true;
scene.add(terrain);

// Ocean
const oceanGeometry = new THREE.PlaneGeometry(15000, 15000, 50, 50);
const oceanMaterial = new THREE.MeshPhongMaterial({
    color: 0x006994,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
});

const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial);
ocean.rotation.x = -Math.PI / 2;
ocean.position.y = -800;
ocean.receiveShadow = true;
scene.add(ocean);

// Mountain Peaks
const mountainPeaks = [];
for (let i = 0; i < 10; i++) {
    const peakGeometry = new THREE.ConeGeometry(200 + Math.random() * 300, 600 + Math.random() * 800, 8);
    const peakMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.3, 0.4, 0.3 + Math.random() * 0.2)
    });
    
    const peak = new THREE.Mesh(peakGeometry, peakMaterial);
    peak.position.set(
        (Math.random() - 0.5) * 6000,
        -1000 + Math.random() * 300,
        (Math.random() - 0.5) * 6000
    );
    peak.castShadow = true;
    peak.receiveShadow = true;
    scene.add(peak);
    mountainPeaks.push(peak);
}

// Create Village Function
function createVillage(x, z) {
    const villageGroup = new THREE.Group();
    
    // Houses
    for (let i = 0; i < 8 + Math.random() * 12; i++) {
        const houseGeometry = new THREE.BoxGeometry(8 + Math.random() * 4, 6 + Math.random() * 4, 8 + Math.random() * 4);
        const houseMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(
                0.1 + Math.random() * 0.1,
                0.3 + Math.random() * 0.3,
                0.4 + Math.random() * 0.3
            )
        });
        
        const house = new THREE.Mesh(houseGeometry, houseMaterial);
        house.position.set(
            (Math.random() - 0.5) * 100,
            3,
            (Math.random() - 0.5) * 100
        );
        house.castShadow = true;
        house.receiveShadow = true;
        villageGroup.add(house);
        
        // Roofs
        const roofGeometry = new THREE.ConeGeometry(6, 4, 4);
        const roofMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(0.05, 0.6, 0.3 + Math.random() * 0.2)
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(
            house.position.x,
            house.position.y + 5,
            house.position.z
        );
        roof.castShadow = true;
        villageGroup.add(roof);
    }
    
    // Church
    const churchGeometry = new THREE.BoxGeometry(12, 15, 12);
    const churchMaterial = new THREE.MeshPhongMaterial({ color: 0xCCCCCC });
    const church = new THREE.Mesh(churchGeometry, churchMaterial);
    church.position.set(0, 7.5, 0);
    church.castShadow = true;
    church.receiveShadow = true;
    villageGroup.add(church);
    
    // Church tower
    const towerGeometry = new THREE.CylinderGeometry(2, 2, 8, 8);
    const tower = new THREE.Mesh(towerGeometry, churchMaterial);
    tower.position.set(0, 19, 0);
    tower.castShadow = true;
    villageGroup.add(tower);
    
    // Trees
    for (let i = 0; i < 15 + Math.random() * 10; i++) {
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 4, 8);
        const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(
            (Math.random() - 0.5) * 120,
            2,
            (Math.random() - 0.5) * 120
        );
        trunk.castShadow = true;
        villageGroup.add(trunk);
        
        const leavesGeometry = new THREE.SphereGeometry(3 + Math.random() * 2, 8, 8);
        const leavesMaterial = new THREE.MeshPhongMaterial({ 
            color: new THREE.Color().setHSL(0.25, 0.6, 0.3 + Math.random() * 0.2)
        });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.set(
            trunk.position.x,
            trunk.position.y + 5,
            trunk.position.z
        );
        leaves.castShadow = true;
        villageGroup.add(leaves);
    }
    
    // Roads
    const roadGeometry = new THREE.PlaneGeometry(150, 8, 1, 1);
    const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
    const road1 = new THREE.Mesh(roadGeometry, roadMaterial);
    road1.rotation.x = -Math.PI / 2;
    road1.position.y = 0.1;
    road1.receiveShadow = true;
    villageGroup.add(road1);
    
    const road2 = new THREE.Mesh(roadGeometry, roadMaterial);
    road2.rotation.x = -Math.PI / 2;
    road2.rotation.z = Math.PI / 2;
    road2.position.y = 0.1;
    road2.receiveShadow = true;
    villageGroup.add(road2);
    
    villageGroup.position.set(x, -1000, z);
    return villageGroup;
}

// Create villages
const villages = [];
for (let i = 0; i < 6; i++) {
    const village = createVillage(
        (Math.random() - 0.5) * 4000,
        (Math.random() - 0.5) * 4000
    );
    scene.add(village);
    villages.push(village);
}

// Skybox
const skyboxGeometry = new THREE.BoxGeometry(20000, 20000, 20000);
const skyboxMaterial = new THREE.ShaderMaterial({
    uniforms: {
        topColor: { value: new THREE.Color(0x0077ff) },
        bottomColor: { value: new THREE.Color(0xffffff) },
        offset: { value: 33 },
        exponent: { value: 0.6 }
    },
    vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
            float h = normalize(vWorldPosition + offset).y;
            gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
    `,
    side: THREE.BackSide
});

const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
scene.add(skybox);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(1000, 1000, 500);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 5000;
directionalLight.shadow.camera.left = -2000;
directionalLight.shadow.camera.right = 2000;
directionalLight.shadow.camera.top = 2000;
directionalLight.shadow.camera.bottom = -2000;
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0xffaa00, 0.5, 1000);
pointLight.position.set(500, 300, 500);
scene.add(pointLight);

// Camera setup
camera.position.set(0, 10, 20);
camera.lookAt(aircraftGroup.position);

// Controls state
const keys = {
    w: false,
    s: false,
    a: false,
    d: false,
    q: false,
    e: false,
    arrowup: false,
    arrowdown: false
};

// User interaction
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) {
        keys[key] = true;
    }
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) {
        keys[key] = false;
    }
});

// Mouse interaction
let mouseDown = false;
let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousedown', (e) => {
    mouseDown = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
});

window.addEventListener('mouseup', () => {
    mouseDown = false;
});

window.addEventListener('mousemove', (e) => {
    if (mouseDown) {
        const deltaX = e.clientX - mouseX;
        const deltaY = e.clientY - mouseY;
        
        const radius = 50;
        const angleX = deltaX * 0.01;
        const angleY = deltaY * 0.01;
        
        camera.position.x = aircraft.position.x + Math.sin(angleX) * radius;
        camera.position.z = aircraft.position.z + Math.cos(angleX) * radius;
        camera.position.y = aircraft.position.y + 25 + angleY * 10;
        
        camera.lookAt(aircraft.position);
        
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
});

window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateUI() {
    document.getElementById('speedValue').textContent = Math.round(aircraft.speed);
    document.getElementById('altitudeValue').textContent = Math.round(aircraft.position.y);
}

// Clouds
const clouds = [];
const cloudMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffffff, 
    transparent: true, 
    opacity: 0.8 
});

for (let i = 0; i < 30; i++) {
    const cloudGroup = new THREE.Group();
    const cloudCount = 3 + Math.floor(Math.random() * 4);
    
    for (let j = 0; j < cloudCount; j++) {
        const cloud = new THREE.Mesh(
            new THREE.SphereGeometry(8 + Math.random() * 12, 8, 8),
            cloudMaterial
        );
        cloud.position.set(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 15
        );
        cloudGroup.add(cloud);
    }
    
    cloudGroup.position.set(
        (Math.random() - 0.5) * 6000,
        300 + Math.random() * 600,
        (Math.random() - 0.5) * 6000
    );
    
    scene.add(cloudGroup);
    clouds.push(cloudGroup);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Handle controls
    if (keys.w) aircraft.speed = Math.min(aircraft.speed + aircraft.acceleration, aircraft.maxSpeed);
    if (keys.s) aircraft.speed = Math.max(aircraft.speed - aircraft.deceleration, 0);
    if (keys.a) aircraft.yaw += aircraft.turnSpeed;
    if (keys.d) aircraft.yaw -= aircraft.turnSpeed;
    if (keys.q) aircraft.roll -= aircraft.turnSpeed * 1.5;
    if (keys.e) aircraft.roll += aircraft.turnSpeed * 1.5;
    if (keys.arrowup) aircraft.pitch = Math.max(aircraft.pitch - 0.01, -Math.PI / 6);
    if (keys.arrowdown) aircraft.pitch = Math.min(aircraft.pitch + 0.01, Math.PI / 6);

    // Natural roll and pitch recovery
    aircraft.roll *= 0.96;
    aircraft.pitch *= 0.96;

    // Calculate forward direction
    const forward = new THREE.Vector3(
        Math.sin(aircraft.yaw) * Math.cos(aircraft.pitch),
        Math.sin(aircraft.pitch),
        Math.cos(aircraft.yaw) * Math.cos(aircraft.pitch)
    );
    forward.normalize();

    // Move aircraft forward
    aircraft.position.add(forward.clone().multiplyScalar(aircraft.speed * 0.1));

    // Move world objects
    const moveVec = forward.clone().multiplyScalar(aircraft.speed * 0.1);
    terrain.position.sub(moveVec);
    ocean.position.sub(moveVec);
    
    for (const cloud of clouds) {
        cloud.position.sub(moveVec);
    }
    
    for (const peak of mountainPeaks) {
        peak.position.sub(moveVec);
    }
    
    for (const village of villages) {
        village.position.sub(moveVec);
    }

    // Wrap-around effect
    const wrapDistance = 5000;
    if (terrain.position.x > wrapDistance) terrain.position.x -= wrapDistance * 2;
    if (terrain.position.x < -wrapDistance) terrain.position.x += wrapDistance * 2;
    if (terrain.position.z > wrapDistance) terrain.position.z -= wrapDistance * 2;
    if (terrain.position.z < -wrapDistance) terrain.position.z += wrapDistance * 2;
    
    if (ocean.position.x > wrapDistance) ocean.position.x -= wrapDistance * 2;
    if (ocean.position.x < -wrapDistance) ocean.position.x += wrapDistance * 2;
    if (ocean.position.z > wrapDistance) ocean.position.z -= wrapDistance * 2;
    if (ocean.position.z < -wrapDistance) ocean.position.z += wrapDistance * 2;

    // Update aircraft
    aircraftGroup.position.copy(aircraft.position);
    aircraftGroup.rotation.set(aircraft.pitch, aircraft.yaw, aircraft.roll);

    // Chase camera
    const cameraOffset = new THREE.Vector3(
        -Math.sin(aircraft.yaw) * 50,
        25,
        -Math.cos(aircraft.yaw) * 50
    );
    
    const targetCameraPosition = aircraft.position.clone().add(cameraOffset);
    camera.position.lerp(targetCameraPosition, 0.05);
    camera.lookAt(aircraft.position);

    // Animate ocean waves
    const time = Date.now() * 0.001;
    const oceanVertices = ocean.geometry.attributes.position.array;
    for (let i = 0; i < oceanVertices.length; i += 3) {
        const x = oceanVertices[i];
        const z = oceanVertices[i + 2];
        oceanVertices[i + 1] = Math.sin(x * 0.01 + time) * Math.cos(z * 0.01 + time) * 5;
    }
    ocean.geometry.attributes.position.needsUpdate = true;

    // Animate clouds
    for (let i = 0; i < clouds.length; i++) {
        clouds[i].rotation.y += 0.001;
        clouds[i].position.y += Math.sin(time + i) * 0.1;
    }

    // Animate engines
    if (aircraft.speed > 0) {
        leftEngine.rotation.y += 0.2;
        rightEngine.rotation.y += 0.2;
    }

    updateUI();
    renderer.render(scene, camera);
}

animate(); 