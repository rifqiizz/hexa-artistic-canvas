import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

const ProjectedMesh = ({ onHover }: { onHover: (isHovered: boolean, data?: any) => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const [hovered, setHovered] = useState(false);

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

  const handlePointerOver = () => {
    setHovered(true);
    onHover(true, {
      name: "GRC Panel Type A",
      indexValue: (Math.random() * 10).toFixed(2),
      thermalStability: Math.floor(Math.random() * 20 + 80),
      elasticRating: (Math.random() * 3 + 6).toFixed(2),
    });
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover(false);
  };

  return (
    <mesh 
      ref={meshRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <torusKnotGeometry args={[1.5, 0.5, 128, 32]} />
      <meshStandardMaterial
        map={texture}
        metalness={0.6}
        roughness={0.3}
        envMapIntensity={1}
        emissive={hovered ? "#4fd1c5" : "#000000"}
        emissiveIntensity={hovered ? 0.3 : 0}
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

const Scene = ({ onHover }: { onHover: (isHovered: boolean, data?: any) => void }) => {
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
      
      <ProjectedMesh onHover={onHover} />
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
  const [hoverData, setHoverData] = useState<any>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = (hovered: boolean, data?: any) => {
    setIsHovered(hovered);
    setHoverData(data);
  };

  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#e5ddd5"]} />
        <fog attach="fog" args={["#e5ddd5", 8, 20]} />
        <Scene onHover={handleHover} />
      </Canvas>

      {/* Hover Info HUD */}
      <AnimatePresence>
        {isHovered && hoverData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div className="bg-foreground/60 backdrop-blur-md border border-border/20 rounded-lg p-6 min-w-[280px] shadow-elegant">
              <h3 className="text-xl font-bold text-background mb-4">
                {hoverData.name}
              </h3>
              <div className="space-y-2 text-background/90">
                <div className="flex justify-between">
                  <span className="font-medium">Index Value:</span>
                  <span className="font-mono">{hoverData.indexValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Thermal Stability:</span>
                  <span className="font-mono">{hoverData.thermalStability}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Elastic Rating:</span>
                  <span className="font-mono">{hoverData.elasticRating}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TextureProjection;
