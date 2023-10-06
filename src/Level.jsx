import * as THREE from "three";
import { Float, Text } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const floor1Material = new THREE.MeshStandardMaterial({ color: "limegreen" });
const floor2Material = new THREE.MeshStandardMaterial({ color: "indigo" });
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: "purple" });
const wallMaterial = new THREE.MeshStandardMaterial({ color: "slateblue" });

function BlockStart({ position = [0, 0, 0] }) {
  return (
    <>
      <group position={position}>
        {/*Floor*/}
        <Float floatIntensity={0.25} rotationIntensity={0.25}>
          <Text
            scale={0.3}
            font="./bebas-neue-v9-latin-regular.woff"
            maxWidth={0.25}
            lineHeight={0.75}
            textAlign="right"
            position={[0.75, 0.65, 0]}
            rotation-y={-0.25}
          >
            Hackathon!
            {/* <meshBasicMaterial toneMapped={false} /> */}
            <meshPhysicalMaterial
              color="#ffffff"
              roughness={0.5}
              thickness={2}
              transmission={1.2}
              opacity={1}
            />
          </Text>
        </Float>
        <mesh
          geometry={boxGeometry}
          material={floor1Material}
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        >
          <meshStandardMaterial color="limegreen" />
        </mesh>
      </group>
    </>
  );
}
export function BlockSpinner({ position = [0, 0, 0] }) {
  const obstacle = useRef();
  const [speed] = useState(
    () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1)
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    obstacle.current.setNextKinematicRotation(rotation);
  });
  return (
    <>
      <group position={position}>
        {/*Floor*/}
        <mesh
          geometry={boxGeometry}
          material={floor2Material}
          position={[0, -0.1, 0]}
          scale={[4, 0.2, 4]}
          receiveShadow
        ></mesh>

        {/*Obstacles*/}
        <RigidBody
          ref={obstacle}
          type="kinematicPosition"
          position={[0, 0.3, 0]}
          restitution={0.2}
          friction={0}
        >
          <mesh
            geometry={boxGeometry}
            material={obstacleMaterial}
            scale={[3.5, 0.3, 0.3]}
            castShadow
            receiveShadow
          ></mesh>
        </RigidBody>
      </group>
    </>
  );
}

export function BlockLimbo({ position = [0, 0, 0] }) {
  const obstacle = useRef();
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const y = Math.sin(time + timeOffset) + 1.15;
    obstacle.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[3.5, 0.3, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}
export function BlockAxe({ position = [0, 0, 0] }) {
  const obstacle = useRef();
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    const x = Math.sin(time + timeOffset) * 1.25;
    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 0.75,
      z: position[2],
    });
  });

  return (
    <group position={position}>
      <mesh
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        ref={obstacle}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          geometry={boxGeometry}
          material={obstacleMaterial}
          scale={[1.5, 1.5, 0.3]}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </group>
  );
}

export function BlockEnd({ position = [0, 0, 0] }) {
  const hamburger = useGLTF("./hamburger.glb");
  hamburger.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
  });
  return (
    <group position={position}>
      <Text
        scale={1}
        font="./bebas-neue-v9-latin-regular.woff"
        maxWidth={0.25}
        lineHeight={0.75}
        textAlign="right"
        position={[0, 2.25, 2]}
        rotation-y={-0.25}
      >
        FINISH
        <meshBasicMaterial toneMapped={false} color="indigo" />
      </Text>

      <mesh
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, 0, 0]}
        scale={[4, 0.2, 4]}
        receiveShadow
      />
      <RigidBody
        type="fixed"
        colliders="hull"
        position={[0, 0.25, 0]}
        restitution={0.2}
        friction={0}
      >
        <primitive object={hamburger.scene} scale={0.2} />
      </RigidBody>
    </group>
  );
}
export function Level({
  count = 5,
  types = [BlockSpinner, BlockAxe, BlockLimbo],
  seed = 0,
}) {
  const blocks = useMemo(() => {
    const blocks = [];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }

    return blocks;
  }, [count, types, seed]);

  function Bounds({ length = 1 }) {
    return (
      <>
        <RigidBody type="fixed" restitution={0.2} friction={0}>
          <mesh
            position={[2.15, 0.75, -(length * 2) + 2]}
            geometry={boxGeometry}
            material={wallMaterial}
            scale={[0.3, 1.5, 4 * length]}
            castShadow
          />
          <mesh
            position={[-2.15, 0.75, -(length * 2) + 2]}
            geometry={boxGeometry}
            material={wallMaterial}
            scale={[0.3, 1.5, 4 * length]}
            receiveShadow
          />
          <mesh
            position={[0, 0.75, -(length * 4) + 2]}
            geometry={boxGeometry}
            material={wallMaterial}
            scale={[4, 1.5, 0.3]}
            receiveShadow
          />
          <CuboidCollider
            args={[2, 0.1, 2 * length]}
            position={[0, -0.1, -(length * 2) + 2]}
            restitution={0.2}
            friction={1}
          />
        </RigidBody>
      </>
    );
  }

  return (
    <>
      <BlockStart position={[0, 0, 0]} />

      {blocks.map((Block, index) => (
        <Block key={index} position={[0, 0, -(index + 1) * 4]} />
      ))}
      <Bounds length={count + 2} />
      <BlockEnd position={[0, 0, -(count + 1) * 4]} />
    </>
  );
}
