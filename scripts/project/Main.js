var container, gui, stats, scene, origin, shader, plane;

var CAMERA_Z = 100;

var uniforms = {
  image: 'images/greengreengreen.png',
  gamut: {
    gamutCorner000: [48, 48, 50],
    gamutCorner100: [178, 65, 61],
    gamutCorner010: [113, 147, 90],
    gamutCorner001: [55, 86, 136],
    gamutCorner110: [177, 169, 91],
    gamutCorner011: [111, 156, 171],
    gamutCorner101: [151, 93, 133],
    gamutCorner111: [156, 162, 167]
  }
};

initialise();

function initialise() {
  scene = new Scene();
  scene.camera.position.z = CAMERA_Z;
  stats = new Stats();
  stats.domElement.classList.add('stats');
  container = document.getElementById('container');
  container.appendChild(scene.domElement);
  container.appendChild(stats.domElement);
  addEventListeners();
  addObjects();
  addGUI();
  resize();
}

function addEventListeners() {
  window.addEventListener('resize', onWindowResize);
  scene.projected.add(layout);
  scene.updated.add(update);
}

function addObjects() {
  var geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  plane = new THREE.Mesh(geometry, createShader());
  plane.scalar = 0.8;
  scene.add(plane);
}

function addGUI() {
  gui = new dat.GUI();
  gui.add(scene, 'fov', 1, 89);
  gui.add(plane, 'scalar', 0.1, 1.0).onChange(layout);
  gui.add(plane.material, 'wireframe');

  gui.add(uniforms, 'image').onChange(function(v) {
    shader.uniforms.uTexture.value = THREE.ImageUtils.loadTexture(v);
  });

  var guiGamut = gui.addFolder('color gamut');

  function addGUIColor(gamutCorner) {
    guiGamut.addColor(uniforms.gamut, gamutCorner).onChange(function(v) {
      var a = ((typeof v === 'string')? parseHexString(v.replace('#', '')) : v);

      console.log(gamutCorner, a);

      shader.uniforms[gamutCorner].value.fromArray(a).multiplyScalar(1/255);
    });
  }

  for(var c in uniforms.gamut) {
    addGUIColor(c);
  }
}

function resize() {
  scene.setSize(window.innerWidth, window.innerHeight);
  layout();
}

function layout() {
  var depth = scene.camera.position.z,
      angle = Math.degreesToRadians(scene.fov / 2),
      scaleY = Math.tan(angle) * depth * 2,
      scaleX = scaleY * scene.aspect;
  plane.scale.x = scaleX * plane.scalar;
  plane.scale.y = scaleY * plane.scalar;
}

function update(time, delta) {
  stats.update();
  plane.rotation.y = Math.PI * 0.25 * Math.sin(time * 1.2);
  plane.material.uniforms.uTime.value = time;
}

function createShader() {
  return shader = new THREE.ShaderMaterial({
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent,
    side: THREE.DoubleSide,
    wireframe: false,
    uniforms: {
      uTime: {
        type: 'f',
        value: 0
      },
      uTexture: {
        type: 't',
        value: THREE.ImageUtils.loadTexture(uniforms.image)
      },
      gamutCorner000: {
        type: 'v3',
        value: (new THREE.Vector3()).fromArray(uniforms.gamut.gamutCorner000).multiplyScalar(1/255)
      },
      gamutCorner100: {
        type: 'v3',
        value: (new THREE.Vector3()).fromArray(uniforms.gamut.gamutCorner100).multiplyScalar(1/255)
      },
      gamutCorner010: {
        type: 'v3',
        value: (new THREE.Vector3()).fromArray(uniforms.gamut.gamutCorner010).multiplyScalar(1/255)
      },
      gamutCorner001: {
        type: 'v3',
        value: (new THREE.Vector3()).fromArray(uniforms.gamut.gamutCorner001).multiplyScalar(1/255)
      },
      gamutCorner110: {
        type: 'v3',
        value: (new THREE.Vector3()).fromArray(uniforms.gamut.gamutCorner110).multiplyScalar(1/255)
      },
      gamutCorner011: {
        type: 'v3',
        value: (new THREE.Vector3()).fromArray(uniforms.gamut.gamutCorner011).multiplyScalar(1/255)
      },
      gamutCorner101: {
        type: 'v3',
        value: (new THREE.Vector3()).fromArray(uniforms.gamut.gamutCorner101).multiplyScalar(1/255)
      },
      gamutCorner111: {
        type: 'v3',
        value: (new THREE.Vector3()).fromArray(uniforms.gamut.gamutCorner111).multiplyScalar(1/255)
      }
    }
  });
}

function parseHexString(str) { 
  var result = [];
  // Ignore any trailing single digit; I don't know what your needs
  // are for this case, so you may want to throw an error or convert
  // the lone digit depending on your needs.
  while (str.length >= 2) { 
    result.push(parseInt(str.substring(0, 2), 16));
    str = str.substring(2, str.length);
  }

  return result;
}

//----------------------------------------
// CALLBACKS
//----------------------------------------

function onWindowResize() {
  resize();
}
