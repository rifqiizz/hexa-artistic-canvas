import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
        className="absolute sm:top-1/2 top-32 left-12 -translate-y-1/2 max-w-md z-10"
      >
        <h1 className="text-lg md:text-xl font-bold text-muted-foreground mb-4 hover:text-glow">
          Our Products
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mb-6">
          Experience cutting-edge technology with stunning visual design. 
          Our products blend innovation with artistic excellence.
        </p>
        <button
          onClick={() => navigate("/top-product")}
          className="group flex items-left gap-2 px-0 py-3 text-foreground text-xs md:text-sm rounded-lg hover:shadow-glow hover:bg-primary hover:text-primary-foreground hover:px-6 transition-all hover-lift"
        >
          Top Product
          <ArrowRight className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </button>
        
        
      </motion.div>

      {/* Gradient Overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent pointer-events-none" /> */}
    </div>
  );
};

export default Product;
