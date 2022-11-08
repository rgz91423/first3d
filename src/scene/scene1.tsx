import React from "react";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  Raycaster,
  Vector2,
} from "three";

export default function Scene1() {
  const scene = new Scene();

  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.y = 3;
  camera.position.z = 8;
  camera.rotateX(-0.1);

  const raycaster = new Raycaster();
  const mouse = new Vector2(1, 1);

  const renderer = new WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.innerHTML = "";
  document.body.appendChild(renderer.domElement);

  const meshes: HitObject[] = [];

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const hitObject = new HitObject(i * 0.5, j * 0.5);
      meshes.push(hitObject);

      scene.add(hitObject.cube);
      scene.add(hitObject.hitBox);
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    raycaster.setFromCamera(mouse, camera);

    const cubes = meshes.map((h) => h.cube);

    cubes.forEach((cube) => {
      cube.position.y = Math.max(cube.position.y - 0.01, 0);
    });

    render();
  }

  function wave(event: MouseEvent) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const hitBoxes = meshes.map((h) => h.hitBox);

    const intersection = raycaster.intersectObjects(hitBoxes);

    if (intersection.length > 0) {
      const instanceId = intersection[0].object.uuid;

      const cube = meshes.find((m) => m.hitBox.uuid === instanceId)?.cube;

      if (cube) {
        console.log(cube);
        cube.position.y = Math.min(cube.position.y + 0.03, 3);
      }
    }

    render();
  }

  function render() {
    renderer.render(scene, camera);
  }

  window.addEventListener("mousemove", (event) => {
    wave(event);
  });

  animate();

  return <></>;
}

export class HitObject {
  cube: Mesh;
  hitBox: Mesh;

  constructor(x: number, z: number) {
    const geometry = new BoxGeometry(0.3, 0.3, 0.3);
    const material = new MeshBasicMaterial({ color: 0x0000ff });
    const cube = new Mesh(geometry, material);
    cube.position.x = x;
    cube.position.z = z;
    this.cube = cube;

    const geometry2 = new BoxGeometry(0.3, 0.6, 0.3);
    const material2 = new MeshBasicMaterial({ color: 0xff000 });
    const hitBox = new Mesh(geometry2, material2);
    hitBox.visible = false;
    hitBox.position.x = x;
    hitBox.position.z = z;
    this.hitBox = hitBox;
  }
}
