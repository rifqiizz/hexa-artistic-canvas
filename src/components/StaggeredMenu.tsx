import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const menuItems = [
  { label: "Home", path: "/" },
  { label: "Product", path: "/product" },
  { label: "Top Product", path: "/top-product" },
  { label: "Project", path: "/project" },
  { label: "About", path: "/about" },
  { label: "Trial", path: "/trial" },
];

const StaggeredMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    closed: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: { 
      opacity: 0, 
      x: 50,
      transition: {
        duration: 0.3,
      }
    },
    open: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
      }
    },
  };

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={toggleMenu}
        className="p-3 rounded-lg bg-card border border-border hover:bg-secondary transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-foreground" />
        ) : (
          <Menu className="w-6 h-6 text-foreground" />
        )}
      </button>

      {/* Menu Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="absolute top-16 right-0 bg-card border border-border rounded-lg overflow-hidden shadow-elegant min-w-[200px]"
          >
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.div key={item.path} variants={itemVariants}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`
                      block px-6 py-4 text-lg font-medium transition-colors
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-secondary"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaggeredMenu;
