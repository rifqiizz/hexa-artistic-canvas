import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';

interface TileData {
  position: THREE.Vector3;
  originalPosition: THREE.Vector3;
  currentHeight: number;
  targetHeight: number;
  color: THREE.Color;
  targetColor: THREE.Color;
  emissive: THREE.Color;
  targetEmissive: THREE.Color;
  face: 'top' | 'bottom' | 'front' | 'back' | 'left' | 'right';
  index: number;
  gridX: number;
  gridY: number;
}

interface DisplayedTile {
  index: number;
  worldPos: THREE.Vector3;
  data: TileData;
  popupPos: THREE.Vector3;
}

const CUBE_SIZE = 2;
const TILES_PER_SIDE = 12;
const TILE_SIZE = CUBE_SIZE / TILES_PER_SIDE;
const GAP = 0.02;
const TILE_ACTUAL_SIZE = TILE_SIZE - GAP;
const POPUP_UPDATE_DELAY = 4000;

const CONCRETE_COLOR = new THREE.Color().setHSL(220 / 360, 0.05, 0.45);
const RED_COLOR = new THREE.Color().setHSL(0 / 360, 0.75, 0.55);
const GLOW_COLOR = new THREE.Color().setHSL(0 / 360, 0.9, 0.6);
const NO_GLOW = new THREE.Color(0, 0, 0);

export default function ParticleCube() {
  const groupRef = useRef<THREE.Group>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);
  const tilesDataRef = useRef<TileData[]>([]);
  const { camera } = useThree();
  const mouseRef = useRef(new THREE.Vector2());
  const raycasterRef = useRef(new THREE.Raycaster());
  
  const currentClosestRef = useRef<{ index: number; worldPos: THREE.Vector3; data: TileData } | null>(null);
  const [displayedTile, setDisplayedTile] = useState<DisplayedTile | null>(null);
  const lastUpdateTimeRef = useRef(0);

  const tiles = useMemo(() => {
    const tilesArray: TileData[] = [];
    const halfSize = CUBE_SIZE / 2;
    const offset = (TILES_PER_SIDE - 1) / 2;

    const faces: Array<{
      face: TileData['face'];
      normal: THREE.Vector3;
      up: THREE.Vector3;
      right: THREE.Vector3;
      center: THREE.Vector3;
    }> = [
      { face: 'top', normal: new THREE.Vector3(0, 1, 0), up: new THREE.Vector3(0, 0, -1), right: new THREE.Vector3(1, 0, 0), center: new THREE.Vector3(0, halfSize, 0) },
      { face: 'bottom', normal: new THREE.Vector3(0, -1, 0), up: new THREE.Vector3(0, 0, 1), right: new THREE.Vector3(1, 0, 0), center: new THREE.Vector3(0, -halfSize, 0) },
      { face: 'front', normal: new THREE.Vector3(0, 0, 1), up: new THREE.Vector3(0, 1, 0), right: new THREE.Vector3(1, 0, 0), center: new THREE.Vector3(0, 0, halfSize) },
      { face: 'back', normal: new THREE.Vector3(0, 0, -1), up: new THREE.Vector3(0, 1, 0), right: new THREE.Vector3(-1, 0, 0), center: new THREE.Vector3(0, 0, -halfSize) },
      { face: 'right', normal: new THREE.Vector3(1, 0, 0), up: new THREE.Vector3(0, 1, 0), right: new THREE.Vector3(0, 0, -1), center: new THREE.Vector3(halfSize, 0, 0) },
      { face: 'left', normal: new THREE.Vector3(-1, 0, 0), up: new THREE.Vector3(0, 1, 0), right: new THREE.Vector3(0, 0, 1), center: new THREE.Vector3(-halfSize, 0, 0) },
    ];

    let globalIndex = 0;
    faces.forEach(({ face, up, right, center }) => {
      for (let i = 0; i < TILES_PER_SIDE; i++) {
        for (let j = 0; j < TILES_PER_SIDE; j++) {
          const u = (i - offset) * TILE_SIZE;
          const v = (j - offset) * TILE_SIZE;

          const position = center.clone()
            .add(right.clone().multiplyScalar(u))
            .add(up.clone().multiplyScalar(v));

          tilesArray.push({
            position: position.clone(),
            originalPosition: position.clone(),
            currentHeight: 0,
            targetHeight: 0,
            color: CONCRETE_COLOR.clone(),
            targetColor: CONCRETE_COLOR.clone(),
            emissive: NO_GLOW.clone(),
            targetEmissive: NO_GLOW.clone(),
            face,
            index: globalIndex++,
            gridX: i,
            gridY: j,
          });
        }
      }
    });

    tilesDataRef.current = tilesArray;
    return tilesArray;
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y += delta * 0.15;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;

    raycasterRef.current.setFromCamera(mouseRef.current, camera);

    let closestDistance = Infinity;
    let closestTileData: { index: number; worldPos: THREE.Vector3; data: TileData } | null = null;

    meshesRef.current.forEach((mesh, index) => {
      if (!mesh) return;

      const tileData = tilesDataRef.current[index];
      if (!tileData) return;

      const worldPos = new THREE.Vector3();
      mesh.getWorldPosition(worldPos);

      const rayOrigin = raycasterRef.current.ray.origin;
      const rayDir = raycasterRef.current.ray.direction;
      
      const toTile = worldPos.clone().sub(rayOrigin);
      const projLength = toTile.dot(rayDir);
      const closestPoint = rayOrigin.clone().add(rayDir.clone().multiplyScalar(projLength));
      const distance = worldPos.distanceTo(closestPoint);

      if (distance < closestDistance && projLength > 0) {
        closestDistance = distance;
        closestTileData = { index, worldPos: worldPos.clone(), data: tileData };
      }

      const maxDistance = 1.125;
      const influence = Math.max(0, 1 - distance / maxDistance);
      const heightMultiplier = Math.pow(influence, 2) * 0.5;

      tileData.targetHeight = heightMultiplier;
      
      if (influence > 0.05) {
        tileData.targetColor.copy(CONCRETE_COLOR).lerp(RED_COLOR, influence);
        const glowIntensity = Math.pow(influence, 1.5);
        tileData.targetEmissive.copy(NO_GLOW).lerp(GLOW_COLOR, glowIntensity * 0.6);
      } else {
        tileData.targetColor.copy(CONCRETE_COLOR);
        tileData.targetEmissive.copy(NO_GLOW);
      }

      const lerpSpeed = 5 * delta;
      tileData.currentHeight += (tileData.targetHeight - tileData.currentHeight) * lerpSpeed;
      tileData.color.lerp(tileData.targetColor, lerpSpeed);
      tileData.emissive.lerp(tileData.targetEmissive, lerpSpeed);

      let normal: THREE.Vector3;
      switch (tileData.face) {
        case 'top': normal = new THREE.Vector3(0, 1, 0); break;
        case 'bottom': normal = new THREE.Vector3(0, -1, 0); break;
        case 'front': normal = new THREE.Vector3(0, 0, 1); break;
        case 'back': normal = new THREE.Vector3(0, 0, -1); break;
        case 'right': normal = new THREE.Vector3(1, 0, 0); break;
        case 'left': normal = new THREE.Vector3(-1, 0, 0); break;
        default: normal = new THREE.Vector3(0, 1, 0);
      }

      mesh.position.copy(
        tileData.originalPosition.clone().add(normal.multiplyScalar(tileData.currentHeight))
      );

      const material = mesh.material as THREE.MeshStandardMaterial;
      material.color.copy(tileData.color);
      material.emissive.copy(tileData.emissive);
      material.emissiveIntensity = 1;
    });

    if (closestTileData && closestDistance < 1.125) {
      currentClosestRef.current = closestTileData;
    } else {
      currentClosestRef.current = null;
    }

    const currentTime = state.clock.elapsedTime * 1000;
    if (currentTime - lastUpdateTimeRef.current >= POPUP_UPDATE_DELAY) {
      lastUpdateTimeRef.current = currentTime;
      
      if (currentClosestRef.current) {
        const tile = currentClosestRef.current;
        const popupPos = tile.worldPos.clone();
        popupPos.y += 0.5;
        
        setDisplayedTile({
          ...tile,
          popupPos,
        });
      } else {
        setDisplayedTile(null);
      }
    }
    
    if (displayedTile && meshesRef.current[displayedTile.index]) {
      const mesh = meshesRef.current[displayedTile.index];
      const newWorldPos = new THREE.Vector3();
      mesh.getWorldPosition(newWorldPos);
      displayedTile.worldPos.copy(newWorldPos);
      displayedTile.popupPos.copy(newWorldPos);
      displayedTile.popupPos.y += 0.5;
    }
  });

  const getFaceRotation = (face: TileData['face']): [number, number, number] => {
    switch (face) {
      case 'top': return [-Math.PI / 2, 0, 0];
      case 'bottom': return [Math.PI / 2, 0, 0];
      case 'front': return [0, 0, 0];
      case 'back': return [0, Math.PI, 0];
      case 'right': return [0, Math.PI / 2, 0];
      case 'left': return [0, -Math.PI / 2, 0];
      default: return [0, 0, 0];
    }
  };

  return (
    <group ref={groupRef}>
      {tiles.map((tile, index) => (
        <mesh
          key={index}
          ref={(el) => {
            if (el) meshesRef.current[index] = el;
          }}
          position={[tile.position.x, tile.position.y, tile.position.z]}
          rotation={getFaceRotation(tile.face)}
        >
          <boxGeometry args={[TILE_ACTUAL_SIZE, TILE_ACTUAL_SIZE, 0.03]} />
          <meshStandardMaterial
            color={CONCRETE_COLOR}
            emissive={NO_GLOW}
            emissiveIntensity={1}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      ))}
      
      {displayedTile && (
        <Line
          points={[
            [displayedTile.worldPos.x, displayedTile.worldPos.y, displayedTile.worldPos.z],
            [displayedTile.popupPos.x, displayedTile.popupPos.y, displayedTile.popupPos.z],
          ]}
          color="hsl(0, 75%, 55%)"
          lineWidth={2}
          dashed
          dashScale={10}
          dashSize={0.1}
          gapSize={0.05}
        />
      )}
      
      {displayedTile && (
        <Html
          position={[displayedTile.popupPos.x, displayedTile.popupPos.y, displayedTile.popupPos.z]}
          center
          style={{
            pointerEvents: 'none',
          }}
        >
          <div className="bg-card/90 backdrop-blur-sm border border-primary/50 rounded-md px-3 py-2 text-xs font-mono shadow-lg shadow-primary/20 animate-fade-in">
            <div className="text-primary font-bold mb-1">Tile #{displayedTile.data.index}</div>
            <div className="text-muted-foreground">
              <span className="text-foreground">Face:</span> {displayedTile.data.face}
            </div>
            <div className="text-muted-foreground">
              <span className="text-foreground">Grid:</span> [{displayedTile.data.gridX}, {displayedTile.data.gridY}]
            </div>
            <div className="text-muted-foreground">
              <span className="text-foreground">Height:</span> {displayedTile.data.currentHeight.toFixed(3)}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
