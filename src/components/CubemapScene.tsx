"use client";

import React, { useRef, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame, useThree, createPortal } from "@react-three/fiber";
import { OrbitControls, Environment, MeshReflectorMaterial, Text } from "@react-three/drei";
import * as THREE from "three";

// CubemapScene.tsx — single-file complete component

/* --------------------------------------------------
   UNIVERSAL HOVER FX — smooth scale + wobble (render-prop)
-------------------------------------------------- */
type HoverChildren = (hover: boolean, ref: React.RefObject<THREE.Group>) => React.ReactNode;
const HoverFX: React.FC<{ children: HoverChildren; }> = ({ children }) => {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!group.current) return;
    const s = hovered ? 1.18 : 1;
    group.current.scale.lerp(new THREE.Vector3(s, s, s), 0.12);
    // wobble removed
  });

  return (
    <group
      ref={group}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      onPointerMissed={(e)=>{}} // optional
    >
      {children(hovered, group)}
    </group>
  );
};

/* --------------------------------------------------
   3D Popup + connector line (billboarded, smooth)
-------------------------------------------------- */
/* --------------------------------------------------
   3D Popup (perfected)
   - Smart left/right placement
   - Smooth motion
   - True billboard
   - World-space portal rendering
   - Perfect line + pointer alignment
   - Hologram shader
-------------------------------------------------- */

const HoverPopup: React.FC<{
  targetRef: React.RefObject<THREE.Object3D>;
  visible: boolean;
  title: string;
}> = ({ targetRef, visible, title }) => {

  const popupRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Mesh>(null);
  const { camera, scene } = useThree();

  // Connector line (not JSX <line>, real three.js Line)
  const lineObj = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const mat = new THREE.LineBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.9
    });
    const line = new THREE.Line(geo, mat);
    line.frustumCulled = false;
    return line;
  }, []);

  // Stable jitter per popup instance
  const jitter = useMemo(() => (Math.random() - 0.5) * 0.35, []);

  // Hologram shader (unchanged)
  const hologramMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#ffffff") },
          uOpacity: { value: 0.95 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform float uTime;
          uniform vec3 uColor;
          uniform float uOpacity;

          float rand(vec2 co){
            return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
          }

          void main(){
            float noise = rand(vUv * uTime * 0.2);
            float scan = abs(sin((vUv.y + uTime*0.2) * 18.0));
            vec3 col = mix(vec3(0.9), uColor, scan * 0.4 + noise * 0.12);
            gl_FragColor = vec4(col, uOpacity);
          }
        `,
      }),
    []
  );

  // Random dummy data
  const metrics = useMemo(
    () => ({
      load: (Math.random() * 30 + 70).toFixed(1),
      temp: (Math.random() * 20 + 20).toFixed(1),
      status: Math.floor(Math.random() * 10 + 90),
    }),
    []
  );

  /* --------------------------------------------------
     Frame loop — perfect UI behavior
  -------------------------------------------------- */
  useFrame((state) => {
    if (!popupRef.current || !targetRef.current) return;

    const targetWorld = targetRef.current.getWorldPosition(new THREE.Vector3());
    const screen = targetWorld.clone().project(camera);

    /* ---------- Best-side detection ---------- */
    const tooRight = screen.x > 0.55;
    const tooLeft  = screen.x < -0.55;

    let useRight = screen.x >= 0;
    if (tooRight) useRight = false;
    if (tooLeft) useRight = true;

    /* ---------- Popup desired world position ---------- */
    const sideOffset = useRight ? 2.35 : -2.35;
    const verticalOffset = 1.25 + Math.abs(screen.y) * 0.45;

    const desired = targetWorld.clone().add(
      new THREE.Vector3(
        sideOffset + jitter,
        verticalOffset + screen.y * 0.45,
        0
      )
    );

    /* ---------- Avoid camera collision ---------- */
    const camDir = desired.clone().sub(camera.position);
    const minDist = 2.4;
    if (camDir.length() < minDist) {
      desired.add(camDir.normalize().multiplyScalar(minDist - camDir.length()));
    }

    /* ---------- Move popup smoothly ---------- */
    popupRef.current.position.lerp(desired, 0.16);
    popupRef.current.quaternion.copy(camera.quaternion);
    popupRef.current.scale.lerp(
      new THREE.Vector3(visible ? 1 : 0.0001, visible ? 1 : 0.0001, visible ? 1 : 0.0001),
      0.18
    );

    /* ---------- Update line ---------- */
    const popupWorld = popupRef.current.getWorldPosition(new THREE.Vector3());
    (lineObj.geometry as THREE.BufferGeometry).setFromPoints([targetWorld, popupWorld]);

    /* ---------- Update pointer ---------- */
    if (tailRef.current) {
      const mid = targetWorld.clone().lerp(popupWorld, 0.55);
      tailRef.current.position.copy(mid);
      tailRef.current.lookAt(targetWorld);
      tailRef.current.rotateX(Math.PI / 2);
    }

    hologramMat.uniforms.uTime.value = state.clock.elapsedTime;
  });

  /* --------------------------------------------------
     Render popup at scene root using createPortal
  -------------------------------------------------- */

  if (!visible) return null; // hide popup & line when not hovered

return createPortal(
  <>
    {/* Popup Box */}
    <group ref={popupRef} raycast={() => null}>
      <mesh>
        <planeGeometry args={[2.4, 1.05]} />
        <primitive object={hologramMat} attach="material" />
      </mesh>

      {/* TEXT INSIDE BOX (centered properly) */}
      <group position={[-0.05, 0.28, 0.01]}>
        <Text fontSize={0.18} color="#000000">{title}</Text>

        <Text fontSize={0.12} color="#222222" position={[0, -0.30, 0]}>
          {`Load: ${metrics.load}%`}
        </Text>

        <Text fontSize={0.12} color="#222222" position={[0, -0.52, 0]}>
          {`Temp: ${metrics.temp}°C`}
        </Text>

        <Text fontSize={0.12} color="#222222" position={[0, -0.74, 0]}>
          {`Integrity: ${metrics.status}%`}
        </Text>
      </group>
    </group>

    {/* Connector LINE — appears only on hover */}
    <primitive object={lineObj} raycast={() => null} />

    {/* Pointer / Arrow */}
    <mesh ref={tailRef}>
      <coneGeometry args={[0.08, 0.22, 10]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  </>,
  scene
);

};



/* --------------------------------------------------
   ReflectiveSphere with HoverFX + Popup
-------------------------------------------------- */
const ReflectiveSphere: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ffe8c7", wireframe: true, transparent: true, opacity: 0.55 }), []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <HoverFX>
      {(hover, groupRef) => (
        <>
          {/* Base Sphere */}
          <mesh ref={meshRef} position={[0, 0, 0]}>
            <sphereGeometry args={[1.5, 64, 64]} />
            <meshPhysicalMaterial
              metalness={1}
              roughness={hover ? 0.04 : 0.08}
              emissive={hover ? "#ffab68" : "#2b1205"}
              emissiveIntensity={hover ? 0.6 : 0.12}
              clearcoat={1}
              clearcoatRoughness={0.05}
              reflectivity={1}
              envMapIntensity={hover ? 3.3 : 2.2}
              color="#e76a25"
            />

            {/* Wireframe Overlay */}
            {hover && (
              <mesh scale={[1.015, 1.015, 1.015]} raycast={() => null}> 
                <sphereGeometry args={[1.51, 16, 16]} />
                <primitive object={wireMaterial} attach="material" />
              </mesh>
            )}
          </mesh>

          {/* Popup */}
          <HoverPopup targetRef={meshRef} visible={hover} title="SPHERE NODE" />

        </>
      )}
    </HoverFX>
  );
};

/* --------------------------------------------------
   FloatingTorus with HoverFX + Popup
-------------------------------------------------- */
const FloatingTorus: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const scanMaterial = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      time: { value: 0 },
      color: { value: new THREE.Color('#66ccff') },
      opacity: { value: 0.45 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float time;
      uniform vec3 color;
      uniform float opacity;

      void main() {
        float scan = abs(sin((vUv.y + time) * 10.0)) * 0.6;
        float edge = smoothstep(0.0, 0.15, abs(vUv.x - 0.5)) * 0.4;
        float intensity = scan + edge;
        gl_FragColor = vec4(color, intensity * opacity);
      }
    `,
  }), []);

  const wireMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ffffff', wireframe: true, transparent: true, opacity: 0.35 }), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.005;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3;

    scanMaterial.uniforms.time.value = state.clock.elapsedTime * 0.7;
  });

  return (
    <HoverFX>
      {(hover, groupRef) => (
        <>
          {/* Base Torus */}
          <mesh ref={meshRef} position={position}>
            <torusGeometry args={[0.6, 0.2, 16, 32]} />
            <meshPhysicalMaterial
              metalness={1}
              roughness={hover ? 0.08 : 0.12}
              emissive={hover ? '#cfcfcf' : '#1a1919'}
              emissiveIntensity={hover ? 0.35 : 0.06}
              reflectivity={1}
              envMapIntensity={hover ? 3.0 : 1.8}
              clearcoat={1}
              color="#877f7d"
            />

            {/* Wireframe overlay bound to rotation */}
            {hover && (
              <mesh scale={[1.015, 1.015, 1.015]} raycast={() => null}>
                <torusGeometry args={[0.6, 0.2, 16, 32]} />
                <primitive object={wireMaterial} attach="material" />
              </mesh>
            )}

            {/* Scanline hologram overlay */}
            {hover && (
              <mesh scale={[1.05, 1.05, 1.05]} raycast={() => null}>
                <torusGeometry args={[0.6, 0.2, 16, 32]} />
                <primitive object={scanMaterial} attach="material" />
              </mesh>
            )}
          </mesh>

          {/* Popup */}
          <HoverPopup targetRef={meshRef} visible={hover} title="TORUS NODE" />

        </>
      )}
    </HoverFX>
  );
};

/* --------------------------------------------------
   Scene + Root
-------------------------------------------------- */
const Scene: React.FC = () => {
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
          color="#0d0d0d"
          metalness={0.2}
          mirror={0.2}
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

const CubemapScene: React.FC = () => {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 70 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={["#e5ddd5"]} />
        <fog attach="fog" args={["#e5ddd5", 10, 25]} />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* Info Overlay */}
      <div className="absolute bottom-12 sm:bottom-8 left-8 right-8 sm:left-1/2 sm:-translate-x-1/2 text-left sm:text-center z-40">
        <p className="text-foreground text-xs tracking-wider uppercase">
          Hover over the object • Drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  );
};

export default CubemapScene;
