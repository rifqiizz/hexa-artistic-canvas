import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import TextureProjection from "@/components/TextureProjection";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const navigate = useNavigate();
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
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-glow">
          Our Products
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-6">
          Experience cutting-edge technology with stunning visual design. 
          Our products blend innovation with artistic excellence.
        </p>
        <button
          onClick={() => navigate("/about")}
          className="group flex items-left gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-glow transition-all hover-lift"
        >
          About Us
          <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </button>
        
        
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default Product;
