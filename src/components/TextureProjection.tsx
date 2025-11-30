import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

const ProjectedMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  // Create a gradient texture
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, "#4fd1c5");
    gradient.addColorStop(0.5, "#38bdf8");
    gradient.addColorStop(1, "#818cf8");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1.5, 0.5, 128, 32]} />
      <meshStandardMaterial
        map={texture}
        metalness={0.6}
        roughness={0.3}
        envMapIntensity={1}
      />
    </mesh>
  );
};

const BackgroundSpheres = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  const spheres = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 30; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20 - 5
      );
      const scale = Math.random() * 0.5 + 0.2;
      temp.push({ pos, scale, key: i });
    }
    return temp;
  }, []);

  return (
    <group ref={groupRef}>
      {spheres.map((sphere) => (
        <mesh key={sphere.key} position={sphere.pos} scale={sphere.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color="#4fd1c5"
            transparent
            opacity={0.3}
            emissive="#4fd1c5"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4fd1c5" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#38bdf8"
      />
      
      <ProjectedMesh />
      <BackgroundSpheres />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        maxDistance={12}
        minDistance={4}
        autoRotate
        autoRotateSpeed={1}
      />
    </>
  );
};

const TextureProjection = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <fog attach="fog" args={["#0a0a0a", 8, 20]} />
        <Scene />
      </Canvas>
    </div>
  );
};

export default TextureProjection;
