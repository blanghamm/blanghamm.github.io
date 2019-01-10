var key;
var wCharCount = 0;//Stores the number of times a key is pressed

//////SYNTH/////

let octave = 4; //Number of octaves allowed
const keys = []; //Stores keyboard keys in an array to be called later
const Instruments = {
  keyboard: { //Keyboard store, assigns keyboard letters to musical notes.
    // Lower octave.
    a: 'Cl',
    w: 'C#l',
    s: 'Dl',
    e: 'D#l',
    d: 'El',
    f: 'Fl',
    t: 'F#l',
    g: 'Gl',
    y: 'G#l',
    h: 'Al',
    u: 'A#l',
    j: 'Bl',
    // Upper octave.
    k: 'Cu',
    o: 'C#u',
    l: 'Du',
    p: 'D#u',
    ';': 'Eu',
    "'": 'Fu',
    ']': 'F#u',
    '\\': 'Gu',
  }, //All keys are assigned to a note.
};

let instrument = Instruments.keyboard; //Links tone js instrument to key inputs

const keyToNote = key => { //Function to initiate key to note
  const note = instrument[ key ]; //Takes input from key variable and links to note
  if ( !note ) {
    return;
  }

  return Tone.Frequency(
    note
    .replace( 'l', octave )
    .replace( 'u', octave + 1 )
  ).toNote();
};

const onKeyDown = (() => {
  let listener; //Listens for Keydown

  return synth => { //Nothing has been pressed and the listener is removed
    document.removeEventListener( 'keydown', listener );

    listener = event => {
      const { key } = event;
      // Only trigger once per keydown event.
      if ( !keys[ key ] ) {
        keys[ key ] = true;

        const note = keyToNote( key );
        if ( note ) {
          synth.triggerAttack( note );
          prevKey = key;
        }
      }
    };

    document.addEventListener( 'keydown', listener, );
  };
})();

const onKeyUp = (() => {
  let listener;
  let prev;

  return synth => {
    // Clean-up.
    if ( prev ) {
      prev.triggerRelease();
    }
    document.removeEventListener( 'keyup', listener );

    prev = synth;
    listener = event => {
      const { key } = event;
      if ( keys[ key ] ) {
        keys[ key ] = false;

        const note = keyToNote( key );
        if ( synth instanceof Tone.PolySynth ) {
          synth.triggerRelease( note );
        } else if ( note && key === prevKey ) {
          // Trigger release if this is the previous note played.
          synth.triggerRelease();
        }
      }
    };

    document.addEventListener( 'keyup', listener );
  };
})();

// Octave controls.
document.addEventListener( 'keydown', event => {
  // Decrease octave range (min: 0).
  if ( event.key === 'z' ) { octave = Math.max( octave - 1, 0 ); }
  // Increase octave range (max: 10).
  if ( event.key === 'x' ) { octave = Math.min( octave + 1, 9 ); }
});

// Init.
(() => {
  const synth = new Tone.PolySynth( 10 ); //Adds PolySynth and sends audio to the master output.
  synth.toMaster();

  onKeyDown( synth ); //Runs function and interacts with the synth properites
  onKeyUp( synth ); //Runs function to release the synth
})();





////GLOBAL VARIABLES////
var scene, camera, renderer, controls, mesh, light, geometry, material, particle, mesh5;
var mouseX = 0; //Stores value
var mouseY = 0;
var time = 0;

function init() { //Initialises

//////RENDERER//////

renderer = new THREE.WebGLRenderer({antialias:true, alpha: true}); //Sets the renderer engnine
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight ); //Sets the size of the scene to fit the screen resolution

//////SCENE////////

  scene = new THREE.Scene(); //Creates a new scene
  scene.fog = new THREE.FogExp2( 'black', 0.002 ); //Adds fog to the scene with a colour property
  scene.background = new THREE.Color( '#ffe4e1' ); //Adds a coloured background to the scene

  particle = new THREE.Object3D(); //Sets the particle array as an object so it can be manipulated as one
  particle2 = new THREE.Object3D();//Same again

  scene.add(particle, particle2); //Adds the array to the scene

////////GEOMETRY/////////

  geometry = new THREE.IcosahedronGeometry( 50, 0); //New geometry
  material = new THREE.MeshPhongMaterial({ //Adds specified material
    color: "white", //Sets basic colour
    shading: THREE.FlatShading, //Adds a flat shading property to help with the low poly aesthetic
    });
  mesh = new THREE.Mesh( geometry, material ); //Combinews the geometry and material

  geometry2 = new THREE.IcosahedronGeometry( 70, 0);
  material2 = new THREE.MeshPhongMaterial({
    color: "white",
    wireframe: true, //Shows the wireframe of the geometry
  });
  mesh2 = new THREE.Mesh( geometry2, material2 );
  mesh2.rotation.y = 20;

  geometry3 = new THREE.IcosahedronGeometry( 20, 0);
  material3 = new THREE.MeshPhongMaterial({
    color: "white",
    wireframe: true,
  });

  mesh3 = new THREE.Mesh( geometry3, material3 );
  mesh3.rotation.y = 20; //Sets the rotation of the object
  mesh3.position.x = 200; //Sets the position in the scene
  mesh3.position.y = 30;
  mesh3.position.z = 50;


  geometry4 = new THREE.DodecahedronGeometry( 20, 0);
  material4 = new THREE.MeshPhongMaterial({
    color: "white",
    wireframe: false,
  });

  mesh4 = new THREE.Mesh( geometry4, material4 );
  mesh4.rotation.y = 20;
  mesh4.position.x = -100;
  mesh4.position.y = 30;
  mesh4.position.z = 10;

  geometry5 = new THREE.DodecahedronGeometry( 2, 0);
  material5 = new THREE.MeshPhongMaterial({
    color: "white",
    wireframe: false,
  });

  for (var i = 0; i < 1000; i++) { //For loop to create copies of the same mesh.
    var mesh5 = new THREE.Mesh(geometry5, material5); //Sets the mesh
    mesh5.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(); //Sets the objects position, changes everytime the program runs
    mesh5.position.multiplyScalar(90 + (Math.random() * 700)); //Sets the number of copies
    mesh5.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2); //Sets a random rotation for each copy

    particle.add(mesh5); //Adds the mesh to the particle object that was set previously
  }

  geometry6 = new THREE.IcosahedronGeometry( 0.5, 0);
  material6 = new THREE.MeshPhongMaterial({
    color: "white",
    shading: THREE.FlatShading,

    });

  for (var i = 0; i < 1000; i++) { //Same as the pervious loop but for a different mesh
    var mesh6 = new THREE.Mesh(geometry6, material6);
    mesh6.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    mesh6.position.multiplyScalar(90 + (Math.random() * 700));
    mesh6.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);

    particle2.add(mesh6);
  }

  geometry7 = new THREE.BoxGeometry( 40, 40, 40);
  material7 = new THREE.MeshPhongMaterial({
    color: "white",
    wireframe: false,
  });

  mesh7 = new THREE.Mesh( geometry7, material7 );
  mesh7.rotation.y = 20;

  mesh7.position.x = 130;
  mesh7.position.y = -50;
  mesh7.position.z = 10;

  scene.add(  mesh, mesh2, mesh3, mesh4, mesh7 ); //Adds all of the mesh's to the scene


  camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 50, 500000 ); //Sets up the scene camera keeping the dimensions to the overall viewport size
  //Sets camera position
  camera.position.x = -500;
  camera.position.y = 50;
  camera.position.z = -100;

  document.getElementById('canvas').appendChild( renderer.domElement ); //Allows me to add the threejs file to my html page

  //////////CONTROLS////////

  controls = new THREE.OrbitControls( camera , renderer.domElement ); //Sets up orbital controls, currently it is disabled
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;

  controls.screenSpacePanning = false;

  controls.minDistance = 300;
  controls.maxDistance = 450;

  controls.maxPolarAngle = Math.PI / 2.1;
  controls.enabled = false; //Disables the controls

  ///////LIMITS MOVEMENT//////////

  document.addEventListener("mousemove", onDocumentMouseMove, false); //This section is what allows for the slight pivot in movement when the mouse is moved.
  function onDocumentMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) / 10;
    mouseY = (event.clientY - window.innerHeight / 2) / 10;
  }
  //////////LIGHTS//////////

  //Each light has a different colour which lights the objects, rather than colouring each geometry. (Each geometry colour is white)

  light = new THREE.DirectionalLight( "#F39C12", 0.8 ); //Adds a directional light that is set to a specific colour
  light.position.set( - 1, - 1, - 1 );
  scene.add( light );

  light = new THREE.DirectionalLight( "#3498DB", 0.5 );
  light.position.set( 1, 0.75, - 1 );
  scene.add( light );

  light2 = new THREE.AmbientLight( "#8E44AD",  );
  light.position.set( 1, 0.75, -1 );
  scene.add( light2 );

  window.addEventListener( 'resize', onWindowResize, false  ); //Sets up the resize listener for when the viewport is scaled
  //Adds a listener for the functions that follow
  document.body.addEventListener('keydown', keyPressed, false );
  document.body.addEventListener('keyup', keyReleased, false );


}

var distance = 0.1; //Sets the default property


function keyPressed(e){ //Function for keydown property
  switch(e.key) {
    case 'w': //Assigns the key to the function
      var tween = new TWEEN.Tween(mesh) //Adds the tween
      .easing (TWEEN.Easing.Quadratic.Out) //A property from tweenjs that allows for easing of movement
      .onUpdate(function(){ //Function that intitiates when the correct case is pressed, this then moves the mesh by the desired amount
        mesh.translateY(distance); //Moves the mesh by 0.1 for every key press.
        mesh2.translateY(distance);
        wCharCount = wCharCount + 0.1; //Counts the number of times the key has been pressed and stores it in a global variable
      })
      .start(); //Runs the tween
      break; //Same code as before but the character and mesh has been changed
      case 'a':
      var thing = new TWEEN.Tween(mesh3)
      .easing (TWEEN.Easing.Quadratic.Out)
      .onUpdate(function(){
        mesh3.translateY(distance);
        wCharCount = wCharCount + 0.1;
        console.log(wCharCount);
      })
      .start();
      break;//Same code as before but the character and mesh has been changed
      case 'u':
      var thing = new TWEEN.Tween(mesh4)
      .easing (TWEEN.Easing.Quadratic.Out)
      .onUpdate(function(){
        mesh4.translateY(distance);
        wCharCount = wCharCount + 0.1;
        console.log(wCharCount);
      })
      .start();
      break;//Same code as before but the character and mesh has been changed
      case 'e':
      var thing = new TWEEN.Tween(particle)
      .easing (TWEEN.Easing.Quadratic.Out)
      .onUpdate(function(){
        particle.translateY(distance);
        wCharCount = wCharCount + 0.1;
        console.log(wCharCount);
      })
      .start();
      break;//Same code as before but the character and mesh has been changed
      case 'd':
      var thing = new TWEEN.Tween(particle2)
      .easing (TWEEN.Easing.Quadratic.Out)
      .onUpdate(function(){
        particle2.translateY(distance);
        wCharCount = wCharCount + 0.1;
        console.log(wCharCount);
      })
      .start();
      break;//Same code as before but the character and mesh has been changed
      case 'h':
      var thing = new TWEEN.Tween(mesh7)
      .easing (TWEEN.Easing.Quadratic.Out)
      .onUpdate(function(){
        mesh7.translateY(distance);
        wCharCount = wCharCount + 0.1;
        console.log(wCharCount);
      })
      .start();

    }
    e.preventDefault();
}

function keyReleased(t){ //The reverse of keyPressed
  switch(t.key) {
    case 'w': //Takes the same character
      var thing = new TWEEN.Tween(mesh)
      .easing (TWEEN.Easing.Quadratic.Out)
      .onUpdate(function(){ //Runs a for loop that takes into account the number of times the key was pressed in the pervious function.
        for (i=0;i<wCharCount;i++) { //Then reverses the number, this returns the mesh to it's previous position.
          mesh.translateY(-0.1);
          mesh2.translateY(-0.1);
          wCharCount = wCharCount-0.1; //This is run everytime the key is released to so the mesh will always bounce back.
        }
      })
      .start();
      break; //Same code as before but the case and mesh has been changed
      case 'a':
      var thing = new TWEEN.Tween(mesh3)
      .easing (TWEEN.Easing.Quadratic.Out)
      .onUpdate(function(){
        for (i=0;i<wCharCount;i++) {
          mesh3.translateY(-0.1);
          wCharCount = wCharCount-0.1;
        }
      })
      .start();
      break;//Same code as before but the case and mesh has been changed
      case 'u':
      var thing = new TWEEN.Tween(mesh4)
      .easing (TWEEN.Easing.Quadratic.Out)
      .onUpdate(function(){
        for (i=0;i<wCharCount;i++) {
          mesh4.translateY(-0.1);
          wCharCount = wCharCount-0.1;
        }
      })
      .start();
      break;//Same code as before but the case and mesh has been changed
      case 'e':
      var thing = new TWEEN.Tween(particle)
      .easing (TWEEN.Easing.Quadratic.Out)
      .onUpdate(function(){
        for (i=0;i<wCharCount;i++) {
          particle.translateY(-0.1);
          wCharCount = wCharCount-0.1;
        }
      })
      .start();
      break;//Same code as before but the case and mesh has been changed
      case 'd':
      var thing = new TWEEN.Tween(particle)
      .easing (TWEEN.Easing.Quadratic.Out)
      .onUpdate(function(){
        for (i=0;i<wCharCount;i++) {
          particle2.translateY(-0.1);
          wCharCount = wCharCount-0.1;
        }
      })
      .start();
      break;//Same code as before but the case and mesh has been changed
      case 'h':
      var thing = new TWEEN.Tween(mesh7)
      .easing (TWEEN.Easing.Quadratic.Out)
      .onUpdate(function(){
        for (i=0;i<wCharCount;i++) {
          mesh7.translateY(-0.1);
          wCharCount = wCharCount-0.1;
        }
      })
      .start();

    }
    t.preventDefault();
}



function onWindowResize(){ //Resize function that updates the scene when the viewport size is changed.
  //All of the scene objects disappear on window resize. Couldn't solve this issue.
  camera.aspect = window.innerWidth / window.innnerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight ); //Render size after update
}

// Render Loop
function animate() { //Adds animation to specific objects or scene camera
  camera.position.x += (mouseX - camera.position.x) * 0.02; //Runs an initial camera move that sweeps on the x axis
  //Adds a rotation loop for mesh's in the scene
  mesh2.rotation.y += 0.01;
  mesh3.rotation.y -= 0.02;
  mesh4.rotation.y += 0.02;
  //Adds rotation for the particle group.
  particle.rotation.y += 0.001;
  particle.rotation.y -= 0.002;
  //Adds rotation for the second particle group.
  particle2.rotation.y += 0.001;
  particle2.rotation.y -= 0.002;

  mesh7.rotation.y -= 0.01;
  TWEEN.update(); //COntinuously updates the tween state.
  requestAnimationFrame( animate ); //Update for each frame.

  controls.update();// Updates any controls for the orbit control

  renderer.render( scene, camera, ); //Renders the scene and camera, all mesh's have been added to the scene and it renders as a group.
}

init(); // Runs the function which contains the scene.
animate();//Runs the animate function.
