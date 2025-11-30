import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const [animationData, setAnimationData] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Load the Lottie animation
    fetch("/Building_Build.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Error loading animation:", err));

    // Show preloader for longer to ensure visibility
    const timer = setTimeout(() => {
      setIsComplete(true);
      setTimeout(onComplete, 1000); // Delay for fade-out animation
    }, 4500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          {animationData && (
            <div className="w-96 h-96">
              <Lottie animationData={animationData} loop={true} />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
