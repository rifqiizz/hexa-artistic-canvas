import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ParticleCubeScene from "@/components/ParticleCubeScene";
import { useNavigate } from "react-router-dom";

const TopProduct = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full">
      <ParticleCubeScene />

      {/* Overlay Content */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-1/2 left-12 -translate-y-1/2 max-w-md z-10"
      >
        <h1 className="text-lg md:text-xl font-bold text-muted-foreground mb-4 hover:text-glow">
          Top Products
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mb-6">
          Our inspiration comes from your dreams, transforming your vision into a truly artistic product. 
        </p>
        <button
          onClick={() => navigate("/about")}
          className="group flex items-left gap-2 px-0 py-3 text-foreground text-xs md:text-sm rounded-lg hover:shadow-glow hover:bg-primary hover:text-primary-foreground hover:px-6 transition-all hover-lift"
        >
          About Us
          <ArrowRight className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </button>
        
        
      </motion.div>
    </div>
  );
};

export default TopProduct;
