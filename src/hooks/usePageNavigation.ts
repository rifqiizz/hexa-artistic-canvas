import { useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const pages = [
  "/",           // Page 1: Home
  "/product",    // Page 2: Product
  "/top-product",// Page 3: Top Product
  "/about",      // Page 4: About
  "/project",    // Page 5: Project
  "/trial",      // Page 6: Trial
];

export const usePageNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentIndex = pages.indexOf(location.pathname);

  const goNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % pages.length;
    navigate(pages[nextIndex]);
  }, [currentIndex, navigate]);

  const goPrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + pages.length) % pages.length;
    navigate(pages[prevIndex]);
  }, [currentIndex, navigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        goNext();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  return { goNext, goPrev, currentIndex, totalPages: pages.length };
};
