import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";

const ReflectiveSphere = () => {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.003;
      sphereRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={sphereRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.5, 64, 64]} />

      <meshPhysicalMaterial
        metalness={1}
        roughness={0.08}
        clearcoat={1}
        clearcoatRoughness={0.05}
        reflectivity={1}
        envMapIntensity={2.2}
        color="#e76a25"
        emissive="#2b1205"
        emissiveIntensity={0.12}
      />
    </mesh>
  );
};


const FloatingTorus = ({ position }: { position: [number, number, number] }) => {
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (torusRef.current) {
      torusRef.current.rotation.x += 0.01;
      torusRef.current.rotation.y += 0.005;
      torusRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3;
    }
  });

  return (
    <mesh ref={torusRef} position={position}>
      <torusGeometry args={[0.6, 0.2, 16, 32]} />

      <meshPhysicalMaterial
        metalness={1}
        roughness={0.12}
        clearcoat={1}
        clearcoatRoughness={0.08}
        reflectivity={1}
        envMapIntensity={1.8}
        color="#877f7d"
        emissive="#1a1919"
        emissiveIntensity={0.06}
      />
    </mesh>
  );
};


const Scene = () => {
  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4fd1c5" />
      
      <ReflectiveSphere />
      <FloatingTorus position={[-3, 0, -2]} />
      <FloatingTorus position={[3, 1, -1]} />
      <FloatingTorus position={[0, -2, 2]} />

      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={2048}
          mixBlur={1}
          mixStrength={40}
          roughness={1}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0a0a"
          metalness={0.5}
          mirror={0.5}
        />
      </mesh>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        maxDistance={15}
        minDistance={5}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
};

const CubemapScene = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 70 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#e5ddd5"]} />
        <fog attach="fog" args={["#e5ddd5", 10, 25]} />
        <Scene />
      </Canvas>
    </div>
  );
};

export default CubemapScene;
