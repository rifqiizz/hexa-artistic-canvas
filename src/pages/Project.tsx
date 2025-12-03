import { CardStack3D } from "@/components/CardStack3D";

const Project = () => {
  const projectImages = [
    {
      src: "https://grc-artikon-xi.vercel.app/assets/grc-installation-Dk_QjazK.jpg",
      alt: "GRC Installation Project"
    },
    {
      src: "https://grc-artikon-xi.vercel.app/assets/gallery-2-T3Dx8iRn.jpg",
      alt: "GRC Gallery Project"
    },
    {
      src: "https://grc-artikon-xi.vercel.app/assets/grc-texture-2-CCOA-iYh.jpg",
      alt: "GRC Texture Detail"
    },
    {
      src: "https://grc-artikon-xi.vercel.app/assets/grc-installation-Dk_QjazK.jpg",
      alt: "GRC Panel Installation"
    },
    {
      src: "https://grc-artikon-xi.vercel.app/assets/gallery-2-T3Dx8iRn.jpg",
      alt: "Modern Architecture"
    }
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-auto">
      <div className="absolute top-48 sm:top-1/2 left-12 right-12 sm:right-2/3 -translate-y-1/2 max-w-lg z-10">
        <h1 className="text-lg md:text-xl font-bold text-muted-foreground mb-4 hover:text-glow">
          Our Projects
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mb-6">
          Explore our portfolio of premium GRC panel installations across Indonesia
        </p>
        </div>
        <div className="">
        <CardStack3D 
          images={projectImages}
          cardWidth={400}
          cardHeight={240}
          spacing={{ x: 60, y: 60 }}
        />
        </div>
      

      {/* Info Overlay */}
      <div className="fixed bottom-16 sm:bottom-8 left-8 right-8 sm:left-1/2 sm:-translate-x-1/2 text-left sm:text-center z-40">
        <p className="text-foreground text-xs tracking-wider uppercase">
          Our Project Portfolio • GRC Artikon
        </p>
      </div>
    </div>
  );
};

export default Project;
