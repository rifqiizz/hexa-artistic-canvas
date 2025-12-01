"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

/**
 * TextureProjection.tsx
 * - client component (use client)
 * - uses drei <Environment /> for HDR env map
 * - meshPhysicalMaterial for realistic metal
 * - preserves your hover HUD and geometry
 */

// Using CDN-hosted HDR for reliable loading
const HDR_URL = "https://raw.githack.com/pmndrs/drei-assets/456060a26bbeb8fdf79326f224b6d99b8bcce736/hdri/potsdamer_platz_1k.hdr";


// ------------------------- ProjectedMesh -------------------------
type ProjectedMeshProps = {
  onHover: (isHovered: boolean, data?: any) => void;
  position?: [number, number, number];
  geometry?: "torusKnot" | "sphere" | "box" | "torus";
  color: string;
  panelType: string;
};

const ProjectedMesh: React.FC<ProjectedMeshProps> = ({
  onHover,
  position = [0, 0, 0],
  geometry = "torusKnot",
  color,
  panelType,
}) => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const [hovered, setHovered] = useState(false);

  // gradient canvas texture (kept from original)
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, "#38bdf8");
    gradient.addColorStop(1, "#818cf8");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [color]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.3 + position[0]) * 0.2;
      meshRef.current.rotation.y += 0.005;
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    onHover(true, {
      name: panelType,
      indexValue: (Math.random() * 10).toFixed(2),
      thermalStability: Math.floor(Math.random() * 20 + 80),
      elasticRating: (Math.random() * 3 + 6).toFixed(2),
    });
  };

  const handlePointerOut = () => {
    setHovered(false);
    onHover(false);
  };

  const renderGeometry = () => {
    switch (geometry) {
      case "sphere":
        return <sphereGeometry args={[1.2, 32, 32]} />;
      case "box":
        return <boxGeometry args={[2, 2, 2]} />;
      case "torus":
        return <torusGeometry args={[1.3, 0.4, 16, 100]} />;
      default:
        return <torusKnotGeometry args={[1.5, 0.5, 128, 32]} />;
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      castShadow
      receiveShadow
    >
      {renderGeometry()}

      <meshPhysicalMaterial
        map={texture}
        metalness={1}
        roughness={0.08}
        clearcoat={1}
        clearcoatRoughness={0.02}
        reflectivity={1}
        envMapIntensity={2}
        toneMapped={true}
        emissive={hovered ? color : "#111"}
        emissiveIntensity={hovered ? 0.25 : 0.02}
      />
    </mesh>
  );
};

// ------------------------- BackgroundSpheres -------------------------
const BackgroundSpheres: React.FC = () => {
  const groupRef = useRef<THREE.Group | null>(null);

  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.002;
  });

  const spheres = useMemo(() => {
    const arr: { key: number; pos: THREE.Vector3; scale: number }[] = [];
    for (let i = 0; i < 30; i++) {
      arr.push({
        key: i,
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20 - 5
        ),
        scale: Math.random() * 0.5 + 0.2,
      });
    }
    return arr;
  }, []);

  return (
    <group ref={groupRef}>
      {spheres.map((s) => (
        <mesh key={s.key} position={s.pos} scale={s.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial
            color="#e76a25"
            transparent
            opacity={0.18}
            emissive="#000"
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
};

// ------------------------- Scene -------------------------
const Scene: React.FC<{ onHover: (h: boolean, d?: any) => void }> = ({
  onHover,
}) => {
  return (
    <>
      {/* Using CDN HDR for realistic lighting */}
      <Environment files={HDR_URL} blur={0.12} background={false} />


      <ambientLight intensity={0.12} />

      <directionalLight position={[5, 5, 5]} intensity={1.6} castShadow />
      <directionalLight position={[-4, -3, 3]} intensity={0.7} />

      <spotLight
        position={[0, 8, 0]}
        angle={0.36}
        penumbra={0.9}
        intensity={1.1}
        color="#bfe8ff"
      />

      <ProjectedMesh
        onHover={onHover}
        position={[0, 0, 0]}
        geometry="torusKnot"
        color="#4fd1c5"
        panelType="GRC Panel Type A"
      />

      <ProjectedMesh
        onHover={onHover}
        position={[-3.5, 1.5, -2]}
        geometry="sphere"
        color="#e76a25"
        panelType="GRC Panel Type B - Premium"
      />

      <ProjectedMesh
        onHover={onHover}
        position={[3.5, -1, -1]}
        geometry="torus"
        color="#8b5cf6"
        panelType="GRC Panel Type C - Elite"
      />

      <ProjectedMesh
        onHover={onHover}
        position={[0, -2.5, 1]}
        geometry="box"
        color="#10b981"
        panelType="GRC Panel Type D - Standard"
      />

      <BackgroundSpheres />

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        maxDistance={15}
        minDistance={5}
        autoRotate
        autoRotateSpeed={0.6}
      />
    </>
  );
};

// ------------------------- Main Component -------------------------
const TextureProjection: React.FC = () => {
  const [hoverData, setHoverData] = useState<any>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = (hovered: boolean, data?: any) => {
    setIsHovered(hovered);
    setHoverData(data);
  };

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        camera={{ position: [0, 0, 8], fov: 80 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#e5ddd5"]} />
        <fog attach="fog" args={["#e5ddd5", 12, 30]} />
        <Scene onHover={handleHover} />
      </Canvas>

      {/* Hover HUD */}
      <AnimatePresence>
        {isHovered && hoverData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.28 }}
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
