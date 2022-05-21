import React from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BufferGeometryUtils } from "three/examples/jsm/utils/BufferGeometryUtils";
import pathToStl from "./blitzball_whole.stl";
import pathToVideo from "./bg.mp4";

import TreeSTLLoader from "three-stl-loader";


const STLLoader = TreeSTLLoader(THREE);

const loader = new STLLoader();
const textureLoader = new THREE.TextureLoader();
const imageLoader = new THREE.ImageLoader();



/**
 * https://threejs.org/examples/#webgl_lightprobe
 * https://github.com/mrdoob/three.js/blob/master/examples/webgl_lightprobe.html
 * @param {*} param0
 */

// function initEnvironment({ scene, imageSrc }) {
//   const sphere = new THREE.SphereGeometry(750, 64, 64);
//   sphere.scale(-1, 1, 1);

//   const texture = new THREE.Texture();

//   const material = new THREE.MeshBasicMaterial({
//     map: texture,

//   });

//   imageLoader.load(imageSrc, (image) => {
//     texture.image = image;
//     texture.needsUpdate = true;
//   });

//   scene.add(new THREE.Mesh(sphere, material));
// }

function createAnimate({ scene, camera, renderer }) {
  const triggers = [];

  function animate() {
    requestAnimationFrame(animate);

    triggers.forEach((trigger) => {
      trigger();
    });

    renderer.render(scene, camera);
  }
  function addTrigger(cb) {
    if (typeof cb === "function") triggers.push(cb);
  }
  function offTrigger(cb) {
    const triggerIndex = triggers.indexOf(cb);
    if (triggerIndex !== -1) {
      triggers.splice(triggerIndex, 1);
    }
  }

  return {
    animate,
    addTrigger,
    offTrigger
  };
}

export class StlViewer extends React.Component {
  componentDidMount() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    const camera = new THREE.PerspectiveCamera(
      345,
      window.innerWidth / window.innerHeight,
      10,
      100000
    );

    loader.load(pathToStl, (geometry) => {
      const material = new THREE.MeshMatcapMaterial({
        color: 0xffffff,
        opacity: 0.5
      },);
      const mesh = new THREE.Mesh(geometry, material);

      mesh.geometry.computeVertexNormals(true);
      mesh.geometry.center();
      

      scene.add(mesh);

      mesh.rotation.x = 10
      mesh.rotation.y = 30

      animate.addTrigger(() => {
        // mesh.rotation.z +=  Math.PI / 180
        mesh.rotation.y += 0.01
        mesh.rotation.x += 0.01
      });
    });

    // initEnvironment({ scene });

    const renderer = new THREE.WebGLRenderer();

    // const controls = new OrbitControls(camera, renderer.domElement);

    // controls.maxDistance = 700;
    // controls.minDistance = 100;

    // const geometry = new THREE.BoxGeometry(10, 10, 10);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00,opacity:0.5,wireframe:true });


    /**
     * Light setup
     */
    const secondaryLight = new THREE.PointLight(0xff0000, 1, 100);
    secondaryLight.position.set(5, 5, 5);
    scene.add(secondaryLight);

    // gui.add(secondaryLight.position, "y").min(-10).max(10).step(0.1);

    renderer.setSize(window.innerWidth, window.innerHeight);
    this.mount.appendChild(renderer.domElement);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("resize", onWindowResize, false);

    const animate = createAnimate({ scene, camera, renderer });

    camera.position.z = 300;

    animate.animate();


  }

  
  render() {
    const style = {
      'display': 'inline-block',
      'line-height': '0em',
     'padding-bottom': '0.5em',
      'margin-bottom': '0.5em'
    }


    return <div>
                    <h1 className="text-7xl ml-5 mt-5 mb-5"> 
                      <span>Blitzball </span>
                      <br></br>
                      <mark style={style}> fan page</mark>
                      </h1>
      <div ref={(ref) => (this.mount = ref)} />      
      </div>
  }
}
