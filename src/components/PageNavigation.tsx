import { ChevronLeft, ChevronRight, ArrowRightFromLine, ArrowLeftFromLine } from "lucide-react";
import { usePageNavigation } from "@/hooks/usePageNavigation";
import { motion } from "framer-motion";

const PageNavigation = () => {
  const { goNext, goPrev } = usePageNavigation();

  return (
    <>
      {/* Left Arrow */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={goPrev}
        className="fixed right-24 bottom-6 -translate-y-1/2 z-40 p-3 rounded-none hover:backdrop-blur-sm hover:border hover:border-border hover:bg-secondary transition-colors hover-lift"
        aria-label="Previous page"
      >
        <ArrowLeftFromLine className="w-6 h-6 text-foreground" />
      </motion.button>

      {/* Right Arrow */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={goNext}
        className="fixed right-8 bottom-6 -translate-y-1/2 z-40 p-3 rounded-none hover:backdrop-blur-sm hover:border hover:border-border hover:bg-secondary transition-colors hover-lift"
        aria-label="Next page"
      >
        <ArrowRightFromLine className="w-6 h-6 text-foreground" />
      </motion.button>
    </>
  );
};

export default PageNavigation;
