import { motion } from "framer-motion";
import CubemapSceneConcrete from "@/components/CubemapSceneConcrete";
import { ArrowRight } from "lucide-react";
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
        className="absolute top-32 left-12 -translate-y-1/2 sm:top-1/2 max-w-md z-10"
      >
        <h1 className="text-lg md:text-xl font-bold text-muted-foreground mb-4 hover:text-glow">
          GRC Artikon Concrete Material
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mb-6">
          As the leading GRC panel concrete manufacturer in Indonesia, we know no limits in our ability to consistently provide you with the best possible service.
        </p>
        
        <button
          onClick={() => navigate("/")}
          className="group flex items-left gap-2 px-0 py-3 text-foreground text-xs md:text-sm rounded-lg hover:shadow-glow hover:bg-primary hover:text-primary-foreground hover:px-6 transition-all hover-lift"
        >
          Back to Home
          <ArrowRight className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </button>
      </motion.div>

      {/* Gradient Overlay */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" /> */}
    </div>
  );
};

export default Trial;
