import { motion } from "framer-motion";
import CubemapSceneConcrete from "@/components/CubemapSceneConcrete";
import { ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Trial = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full">
      <CubemapSceneConcrete />
      
      {/* Overlay Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-20 left-16 z-10"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-glow">
          GRC Artikon Concrete Material
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Artistic Innovation in 3D Space
        </p>
        
        <button
          onClick={() => navigate("/product")}
          className="group flex items-left gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-glow transition-all hover-lift"
        >
          Explore Products
          <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </button>
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default Trial;
