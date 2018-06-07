(function(name, window, THREE, Signal) {

  var Scene = function() {
    THREE.Scene.call(this);

    // Properties
    this.raf = null;
    this.time = null;
    this.delta = null;

    // Dimensions
    this.__width = 100;
    this.__height = 100;
    this.__aspect = 1;

    // Camera Frustrum
    this.__fov = 35;
    this.__near = 1;
    this.__far = 1000;

    // Components
    this.clock = new THREE.Clock();
    this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
    this.renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
    this.domElement = this.renderer.domElement;

    // Signals
    this.resized = new Signal();
    this.updated = new Signal();
    this.rendered = new Signal();
    this.projected = new Signal();

    // Setup
    this.animate = this.animate.bind(this);
    this.start();
  };

  Scene.prototype = Object.create(THREE.Scene.prototype);

  defineCameraProperty('fov');
  defineCameraProperty('aspect');
  defineCameraProperty('near');
  defineCameraProperty('far');

  function defineCameraProperty(name) {
    Object.defineProperty(Scene.prototype, name, {
      set: function(value) {
        if (typeof value === 'number' && this['__'+name] !== value) {
          this.camera[name] = this['__'+name] = value;
          this.camera.updateProjectionMatrix();
          this.projected.dispatch(this);
        }
      },
      get: function() {
        return this['__'+name];
      },
    });
  }

  Scene.prototype.start = function() {
    this.animate();
  };

  Scene.prototype.pause = function() {
    window.cancelAnimationFrame(this.raf);
  };

  Scene.prototype.animate = function() {
    this.raf = window.requestAnimationFrame(this.animate);
    this.delta = this.clock.getDelta();
    this.time = this.clock.elapsedTime;
    this.update();
    this.render();
  };

  Scene.prototype.update = function() {
    this.updated.dispatch(this.time, this.delta, this);
  };

  Scene.prototype.render = function() {
    this.renderer.render(this, this.camera);
    this.rendered.dispatch(this);
  };

  Scene.prototype.setSize = function(width, height) {
    if (this.width !== width || this.height !== height) {
      this.width = width;
      this.height = height;
      this.aspect = this.width / this.height;
      this.renderer.setSize(this.width, this.height);
      this.resized.dispatch(this.width, this.height, this);
    }
  };

  window[name] = Scene;

})('Scene', window, THREE, signals.Signal);
