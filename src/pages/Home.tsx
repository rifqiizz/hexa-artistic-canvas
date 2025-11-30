import { motion } from "framer-motion";
import CubemapScene from "@/components/CubemapScene";
import { ArrowDown } from "lucide-react";
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
        className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center z-10"
      >
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4 text-glow">
          Hexa Integra
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8">
          Artistic Innovation in 3D Space
        </p>
        
        <button
          onClick={() => navigate("/product")}
          className="group flex items-center gap-2 mx-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:shadow-glow transition-all hover-lift"
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

export default Home;
