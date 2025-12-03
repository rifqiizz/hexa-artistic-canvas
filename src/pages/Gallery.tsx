import DomeGallery from "@/components/DomeGallery";

const Gallery = () => {
  const buildingImages = [
    {
      src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
      alt: "Modern skyscraper architecture"
    },
    {
      src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop",
      alt: "Building construction site"
    },
    {
      src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
      alt: "Architectural blueprint design"
    },
    {
      src: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop",
      alt: "Construction crane and building"
    },
    {
      src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=800&auto=format&fit=crop",
      alt: "Modern glass facade"
    },
    {
      src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
      alt: "Construction workers on site"
    },
    {
      src: "https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a?q=80&w=800&auto=format&fit=crop",
      alt: "Steel structure framework"
    },
    {
      src: "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?q=80&w=800&auto=format&fit=crop",
      alt: "Concrete texture wall"
    },
    {
      src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
      alt: "GRC panel installation"
    },
    {
      src: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop",
      alt: "Interior construction work"
    },
    {
      src: "https://images.unsplash.com/photo-1504297050568-910d24c426d3?q=80&w=800&auto=format&fit=crop",
      alt: "Urban building development"
    },
    {
      src: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=800&auto=format&fit=crop",
      alt: "High-rise construction"
    },
    {
      src: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop",
      alt: "Building facade panels"
    },
    {
      src: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop",
      alt: "Modern architectural design"
    },
    {
      src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
      alt: "Modern skyscraper architecture"
    },
    {
      src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop",
      alt: "Building construction site"
    },
    {
      src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
      alt: "Architectural blueprint design"
    },
    {
      src: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=800&auto=format&fit=crop",
      alt: "Construction crane and building"
    },
    {
      src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=800&auto=format&fit=crop",
      alt: "Modern glass facade"
    },
    {
      src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
      alt: "Construction workers on site"
    },
    {
      src: "https://images.unsplash.com/photo-1429497419816-9ca5cfb4571a?q=80&w=800&auto=format&fit=crop",
      alt: "Steel structure framework"
    },
    {
      src: "https://images.unsplash.com/photo-1516216628859-9bccecab13ca?q=80&w=800&auto=format&fit=crop",
      alt: "Concrete texture wall"
    },
    {
      src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
      alt: "GRC panel installation"
    },
    {
      src: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop",
      alt: "Interior construction work"
    },
    {
      src: "https://images.unsplash.com/photo-1504297050568-910d24c426d3?q=80&w=800&auto=format&fit=crop",
      alt: "Urban building development"
    },
    {
      src: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?q=80&w=800&auto=format&fit=crop",
      alt: "High-rise construction"
    },
    {
      src: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop",
      alt: "Building facade panels"
    },
    {
      src: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop",
      alt: "Modern architectural design"
    },
    
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Title */}
      <div className="absolute top-24 left-12 max-w-sm z-10">
        <h1 className="text-lg md:text-xl font-bold text-muted-foreground mb-2 hover:text-glow">
          Gallery
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">
          Explore our collection of architectural projects and construction works
        </p>
      </div>

      {/* Dome Gallery */}
      <DomeGallery />

      {/* Info Overlay */}
      <div className="fixed bottom-16 sm:bottom-8 left-8 right-8 sm:left-1/2 sm:-translate-x-1/2 text-left sm:text-center z-40">
        <p className="text-foreground text-xs tracking-wider uppercase">
          Drag to rotate • Click to enlarge • GRC Artikon Gallery
        </p>
      </div>
    </div>
  );
};

export default Gallery;
