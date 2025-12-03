import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { useDrag } from "@use-gesture/react";
import { cn } from "@/lib/utils";

interface DomeImage {
  src: string;
  alt?: string;
}

interface DomeGalleryProps {
  images: (string | DomeImage)[];
  fit?: number;
  minRadius?: number;
  maxVerticalRotationDeg?: number;
  segments?: number;
  dragDampening?: number;
  grayscale?: boolean;
  overlayBlurColor?: string;
  imageBorderRadius?: string;
  openedImageBorderRadius?: string;
  openedImageWidth?: string;
  openedImageHeight?: string;
  className?: string;
}

interface TilePosition {
  x: number;
  y: number;
  z: number;
  rotateX: number;
  rotateY: number;
  scale: number;
  image: DomeImage;
  index: number;
}

const DomeGallery: React.FC<DomeGalleryProps> = ({
  images,
  fit = 0.8,
  minRadius = 600,
  maxVerticalRotationDeg = 0,
  segments = 34,
  dragDampening = 2,
  grayscale = false,
  overlayBlurColor = "#060010",
  imageBorderRadius = "20px",
  openedImageBorderRadius = "20px",
  openedImageWidth = "400px",
  openedImageHeight = "400px",
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [selectedImage, setSelectedImage] = useState<DomeImage | null>(null);
  const animationRef = useRef<number>();

  // Normalize images to DomeImage format
  const normalizedImages: DomeImage[] = useMemo(
    () =>
      images.map((img) =>
        typeof img === "string" ? { src: img, alt: "Gallery image" } : img
      ),
    [images]
  );

  // Calculate radius based on container size
  const radius = useMemo(() => {
    const baseRadius = Math.min(containerSize.width, containerSize.height) * fit;
    return Math.max(baseRadius, minRadius);
  }, [containerSize, fit, minRadius]);

  // Generate tile positions on a dome
  const tiles: TilePosition[] = useMemo(() => {
    const positions: TilePosition[] = [];
    const imageCount = normalizedImages.length;
    const rows = Math.ceil(Math.sqrt(imageCount / 2));
    const cols = Math.ceil(imageCount / rows);

    let imageIndex = 0;
    for (let row = 0; row < rows && imageIndex < imageCount; row++) {
      const phi = (Math.PI / 2) * (row / rows) * 0.6; // Vertical angle (0 to ~54 degrees)
      const colsInRow = Math.ceil(cols * Math.cos(phi));

      for (let col = 0; col < colsInRow && imageIndex < imageCount; col++) {
        const theta = ((col / colsInRow) * Math.PI * 2) - Math.PI; // Horizontal angle

        const x = radius * Math.cos(phi) * Math.sin(theta);
        const y = radius * Math.sin(phi) * -0.3;
        const z = radius * Math.cos(phi) * Math.cos(theta);

        positions.push({
          x,
          y,
          z,
          rotateX: phi * (180 / Math.PI) * -0.3,
          rotateY: theta * (180 / Math.PI),
          scale: 1 - row * 0.05,
          image: normalizedImages[imageIndex],
          index: imageIndex,
        });

        imageIndex++;
      }
    }

    return positions;
  }, [normalizedImages, radius]);

  // Handle container resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Animation loop for momentum
  useEffect(() => {
    const animate = () => {
      setVelocity((v) => {
        const dampening = dragDampening * 0.02;
        const newVx = v.x * (1 - dampening);
        const newVy = v.y * (1 - dampening);

        if (Math.abs(newVx) > 0.01 || Math.abs(newVy) > 0.01) {
          setRotation((r) => ({
            x: Math.max(
              -maxVerticalRotationDeg,
              Math.min(maxVerticalRotationDeg, r.x + newVy * 0.5)
            ),
            y: r.y + newVx * 0.5,
          }));
        }

        return { x: newVx, y: newVy };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dragDampening, maxVerticalRotationDeg]);

  // Drag gesture
  const bind = useDrag(
    ({ movement: [mx, my], velocity: [vx, vy], down }) => {
      if (down) {
        setRotation((r) => ({
          x: Math.max(
            -maxVerticalRotationDeg,
            Math.min(maxVerticalRotationDeg, r.x - my * 0.1)
          ),
          y: r.y + mx * 0.1,
        }));
        setVelocity({ x: 0, y: 0 });
      } else {
        setVelocity({ x: vx * 10, y: -vy * 10 });
      }
    },
    { filterTaps: true }
  );

  const handleImageClick = useCallback((image: DomeImage) => {
    setSelectedImage(image);
  }, []);

  const closeImage = useCallback(() => {
    setSelectedImage(null);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing",
        className
      )}
      {...bind()}
      style={{ touchAction: "none" }}
    >
      {/* 3D Scene */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          perspective: `${radius * 2}px`,
          perspectiveOrigin: "center center",
        }}
      >
        <div
          className="relative preserve-3d"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: "transform 0.05s ease-out",
          }}
        >
          {tiles.map((tile, index) => (
            <div
              key={index}
              className="absolute transition-all duration-200 hover:scale-110 hover:z-10"
              style={{
                width: "180px",
                height: "120px",
                transform: `
                  translateX(-50%) translateY(-50%)
                  translate3d(${tile.x}px, ${tile.y}px, ${tile.z}px)
                  rotateY(${tile.rotateY}deg)
                  rotateX(${tile.rotateX}deg)
                  scale(${tile.scale})
                `,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
              onClick={() => handleImageClick(tile.image)}
            >
              <img
                src={tile.image.src}
                alt={tile.image.alt || `Image ${index + 1}`}
                className="w-full h-full object-cover shadow-lg hover:shadow-2xl transition-shadow"
                style={{
                  borderRadius: imageBorderRadius,
                  filter: grayscale ? "grayscale(100%)" : "none",
                }}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Radial overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, transparent 30%, ${overlayBlurColor}90 100%)`,
        }}
      />

      {/* Opened image modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-pointer"
          onClick={closeImage}
        >
          <img
            src={selectedImage.src}
            alt={selectedImage.alt || "Selected image"}
            className="max-w-[90vw] max-h-[90vh] object-contain shadow-2xl"
            style={{
              width: openedImageWidth,
              height: openedImageHeight,
              borderRadius: openedImageBorderRadius,
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default DomeGallery;
