import { motion } from "framer-motion";
import TextureProjection from "@/components/TextureProjection";

const Product = () => {
  return (
    <div className="relative w-full h-full">
      <TextureProjection />
      
      {/* Overlay Content */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-1/2 left-12 -translate-y-1/2 max-w-md z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-glow">
          Our Products
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-6">
          Experience cutting-edge technology with stunning visual design. 
          Our products blend innovation with artistic excellence.
        </p>
        
        <div className="space-y-4">
          <div className="p-4 bg-card border border-border rounded-lg hover:shadow-glow transition-all hover-lift">
            <h3 className="text-xl font-semibold text-primary mb-2">
              3D Visualization
            </h3>
            <p className="text-muted-foreground">
              Advanced rendering techniques for immersive experiences
            </p>
          </div>
          
          <div className="p-4 bg-card border border-border rounded-lg hover:shadow-glow transition-all hover-lift">
            <h3 className="text-xl font-semibold text-primary mb-2">
              Interactive Design
            </h3>
            <p className="text-muted-foreground">
              Real-time interaction with complex 3D models
            </p>
          </div>
        </div>
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default Product;
