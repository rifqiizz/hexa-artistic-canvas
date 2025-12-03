import { motion } from "framer-motion";
import CubemapScene from "@/components/CubemapScene";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full">
      <CubemapScene />
      
      {/* Overlay Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-1/2 left-12 -translate-y-1/2 max-w-md z-10"
      >
        <h1 className="text-lg md:text-xl font-bold text-muted-foreground mb-4 hover:text-glow">
          GRC Artikon
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mb-6">
          Artistic Innovation in 3D Space
        </p>
        
        <button
          onClick={() => navigate("/product")}
          className="group flex items-left gap-2 px-0 py-3 text-foreground text-xs md:text-sm rounded-lg hover:shadow-glow hover:bg-primary hover:text-primary-foreground hover:px-6 transition-all hover-lift"
        >
          Explore Products
          <ArrowRight className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </button>
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default Home;
