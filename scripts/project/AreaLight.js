(function(name, window, THREE) {

  var AreaLight = function() {
    Object.create();

    // Orientation
    this.normal = new THREE.Vector3();
    this.right = new THREE.Vector3();
    this.up = new THREE.Vector3();

    // Dimensions
    this.width = 1;
    this.height = 1;

    // Colors
    this.ambientColor = 0x000000;
    this.diffuseColor = 0xFFFFFF;
    this.specularColor = 0xFFFFFF;

    // Properties
    this.attenuation = 0;

    // View
    this.geometry = new THREE.PlaneGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({wireframe:true});
    this.mesh = new THREE.Mesh(geometry, material);
  };

  // Define dimensions properties.
  defineDimensionProperty('width');
  defineDimensionProperty('height');

  // Define color properties.
  defineColorProperty('ambient');
  defineColorProperty('diffuse');
  defineColorProperty('specular');

  function defineDimensionProperty(name) {
    Object.defineProperty(AreaLight.prototype, name, {
      set: function(value) {
        this['__'+name] = value;
      },
      get: function() {
        return this['__'+name];
      },
    });
  }

  function defineColorProperty(name) {
    Object.defineProperty(AreaLight.prototype, name, {
      set: function(value) {
        name = '__'+name+'Color';
        if (this[name] instanceof THREE.Color) {
          this[name] = value;
        } else {
          this[name] = new THREE.Color(value);
        }
      },
      get: function() {
        return this['__'+name+'Color'];
      },
    });
  }

  window[name] = AreaLight;

})('AreaLight', window, THREE);
