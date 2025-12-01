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
      <div className="max-w-7xl mx-auto px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">
          Our Projects
        </h1>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
          Explore our portfolio of premium GRC panel installations across Indonesia
        </p>
        
        <CardStack3D 
          images={projectImages}
          cardWidth={400}
          cardHeight={240}
          spacing={{ x: 60, y: 60 }}
        />
      </div>
    </div>
  );
};

export default Project;
