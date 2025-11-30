import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "https://grc-artikon-xi.vercel.app/assets/grc-installation-Dk_QjazK.jpg",
  "https://grc-artikon-xi.vercel.app/assets/gallery-2-T3Dx8iRn.jpg",
  "https://grc-artikon-xi.vercel.app/assets/grc-texture-2-CCOA-iYh.jpg",
];

const TypingText = () => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentSection, setCurrentSection] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const textSections = [
    "PRODUSEN GRC PANEL TERBAIK DI INDONESIA",
    "Kami adalah produsen terkemuka panel GRC (Glass Reinforced Concrete) di Indonesia, menyediakan solusi arsitektur berkualitas premium untuk berbagai proyek konstruksi. Dengan pengalaman lebih dari 15 tahun, kami telah melayani ratusan proyek di seluruh Indonesia.\n\nProduk kami dibuat dengan teknologi terkini dan material berkualitas tinggi, memastikan daya tahan, estetika, dan efisiensi biaya yang optimal untuk setiap proyek arsitektur modern."
  ];

  useEffect(() => {
    if (currentSection >= textSections.length) {
      setIsComplete(true);
      return;
    }

    const currentText = textSections[currentSection];
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex <= currentText.length) {
        setDisplayedText(currentText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentSection((prev) => prev + 1);
          setDisplayedText("");
        }, 800);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [currentSection]);

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {currentSection === 0 && displayedText && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-3xl md:text-5xl font-bold text-foreground"
          >
            {displayedText}
            <span className="animate-pulse">|</span>
          </motion.h1>
        )}
        {currentSection === 1 && displayedText && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line"
          >
            {displayedText}
            <span className="animate-pulse">|</span>
          </motion.p>
        )}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              {textSections[0]}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
              {textSections[1]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg border border-border shadow-elegant">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`GRC Panel ${currentIndex + 1}`}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Navigation Controls */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border hover:bg-card transition-colors"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6 text-foreground" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border hover:bg-card transition-colors"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6 text-foreground" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "bg-primary w-8"
                : "bg-muted hover:bg-muted-foreground"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const About = () => {
  return (
    <div className="relative w-full h-full overflow-y-auto">
      <div className="container mx-auto px-8 py-20 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-160px)]">
          {/* Left: Typing Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <TypingText />
          </motion.div>

          {/* Right: Image Slider */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ImageSlider />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
