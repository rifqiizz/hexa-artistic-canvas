import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import ParticleCube from './ParticleCube';

export default function ParticleCubeScene() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [4, 3, 4], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: 'hsl(var(--background))' }}
      >
        <color attach="background" args={['hsl(30, 15%, 92%)']} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#667788" />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#ff6666" />
        
        {/* Main Cube */}
        <ParticleCube />
        
        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={10}
          autoRotate={false}
          dampingFactor={0.05}
          enableDamping
        />
        
        {/* Environment for reflections */}
        <Environment preset="city" />
      </Canvas>
      
      {/* Info Overlay */}
      <div className="absolute bottom-12 sm:bottom-8 left-8 right-8 sm:left-1/2 sm:-translate-x-1/2 text-left sm:text-center z-40">
        <p className="text-foreground text-xs tracking-wider uppercase">
          Hover over the object • Drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  );
}
