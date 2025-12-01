// CubemapSceneConcrete.tsx
"use client";

import React, { useMemo, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { ACESFilmicToneMapping } from "three";
import * as THREE from "three";

/**
 * Safe concrete / GRC scene
 * - No shader onBeforeCompile injections
 * - Uses procedural canvas noise as map + bumpMap
 * - Uses HDR env from /hdr/concrete_tunnel_02_4k.hdr (place file in public/hdr/)
 */

function SafeEnvironment() {
  const hdrPath = "/hdr/concrete_tunnel_02_4k.hdr";
  const [exists, setExists] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    fetch(hdrPath, { method: "HEAD" })
      .then((res) => setExists(res.ok))
      .catch(() => setExists(false));
  }, []);

  if (exists === null) return null;
  if (!exists) return null; // tidak render jika file HDR tidak ada

  return (
    <Suspense fallback={null}>
      <Environment
        files={hdrPath}
        background={false}
        environmentIntensity={0.45}
        blur={0.25}
      />
    </Suspense>
  );
}


// create a noise canvas texture (grayscale) to use as map + bump
function useNoiseTexture(size = 512, scale = 1.0) {
  return useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const imgData = ctx.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // layered noise: base + small speckles
        const nx = x / size;
        const ny = y / size;
        const base =
          (Math.sin(nx * 50 * scale + ny * 30 * scale) * 0.5 + 0.5) * 30;
        const speck = Math.random() * 40;
        const baseNoise = (Math.sin(nx * 60 * scale) * 0.5 + 0.5) * 80;
        const grain = Math.random() * 25;
        const v = 150 + baseNoise * 0.5 + grain * 0.5; // center at mid-gray concrete

        const idx = (y * size + x) * 4;
        imgData.data[idx + 0] = v;
        imgData.data[idx + 1] = v;
        imgData.data[idx + 2] = v;
        imgData.data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  }, [size, scale]);
}

const ConcreteMaterialProps = (colorHex: string, noiseTex: THREE.Texture) => ({
  map: noiseTex,
  bumpMap: noiseTex,
  bumpScale: 0.03,
  color: colorHex,
  roughness: 0.68,
  metalness: 0.02,
  clearcoat: 0.04,
  clearcoatRoughness: 0.85,

  envMapIntensity: 1.25,   // ⭐️ sangat penting
});


const ConcreteSphere: React.FC<{ noise: THREE.Texture }> = ({ noise }) => {
  const ref = useRef<THREE.Mesh | null>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0025;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.04;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]} castShadow receiveShadow>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshPhysicalMaterial {...ConcreteMaterialProps("#d7d3cc", noise)} />
    </mesh>
  );
};

const ConcreteTorus: React.FC<{
  noise: THREE.Texture;
  position: [number, number, number];
  color?: string;
}> = ({ noise, position, color = "#b9b6b2" }) => {
  const ref = useRef<THREE.Mesh | null>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x += 0.008;
      ref.current.rotation.y += 0.004;
      ref.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.18;
    }
  });

  return (
    <mesh ref={ref} position={position} castShadow receiveShadow>
      <torusGeometry args={[0.7, 0.22, 24, 64]} />
      <meshPhysicalMaterial {...ConcreteMaterialProps(color, noise)} />
    </mesh>
  );
};

const ConcreteBackdrop: React.FC = () => {
  return (
    <mesh scale={[30, 30, 1]} position={[0, 0, -10]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial color="#dbd7d0" roughness={0.85} metalness={0} />

    </mesh>
  );
};

export default function CubemapSceneConcrete() {
  // create a reusable noise texture
  const noiseTex = useNoiseTexture(1024, 1.0);

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
        camera={{ position: [0, 0, 8], fov: 70 }}
      >
        <color attach="background" args={["#e2dfd8"]} />
        <fog attach="fog" args={["#e2dfd8", 8, 28]} />

        {/* Basic fill lights while HDR loads */}
        <hemisphereLight groundColor={"#444444"} intensity={0.25} />
        <directionalLight
          castShadow
          position={[6, 8, 6]}
          intensity={0.6}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Suspense-wrapped Environment (loads HDR) */}
        {/* <Suspense fallback={null}>
          <Environment
            files="/hdr/concrete_tunnel_02_4k.hdr"
            background={false}
            environmentIntensity={0.45}
            blur={0.25}
          />
        </Suspense> */}
        
        <SafeEnvironment />

        <ConcreteBackdrop />
        <ConcreteSphere noise={noiseTex} />
        <ConcreteTorus noise={noiseTex} position={[3, 1.2, -1.5]} color="#b9b6b2" />
        <ConcreteTorus noise={noiseTex} position={[-3, -1.2, -1]} color="#a9a7a4" />

        <OrbitControls enablePan={false} enableZoom={true} />
      </Canvas>
    </div>
  );
}
