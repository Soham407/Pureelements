
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    image: "https://picsum.photos/id/292/1920/1080",
    subtitle: "NEW LAUNCH",
    title: "Kumkumadi \nFace Cleanser",
    description: "Goodness of Saffron for Cleaner & Brighter Skin.",
    buttonText: "Shop Now"
  },
  {
    id: 2,
    image: "https://picsum.photos/id/432/1920/1080", 
    subtitle: "LUXURY COLLECTION",
    title: "Signature \nPerfumes",
    description: "Indulge in the essence of togetherness.",
    buttonText: "Explore Collection"
  },
  {
    id: 3,
    image: "https://picsum.photos/id/668/1920/1080", 
    subtitle: "PURE & NATURAL",
    title: "Ayurvedic \nBody Care",
    description: "Ancient wisdom for modern wellness.",
    buttonText: "Discover More"
  }
];

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
     setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
     setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden group">
      
      {/* Slides Container */}
      <div 
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <div
            key={slide.id}
            className="w-full h-full flex-shrink-0 relative"
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 md:bg-gradient-to-r md:from-black/40 md:to-transparent"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center md:items-start text-center md:text-left container mx-auto px-4 md:px-20">
                <span className="text-white italic font-serif text-lg md:text-2xl mb-2 drop-shadow-md animate-fade-in-up">
                  {slide.subtitle}
                </span>
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-3 md:mb-4 drop-shadow-md whitespace-pre-line animate-fade-in-up [animation-delay:200ms] leading-tight">
                  {slide.title}
                </h1>
                <p className="text-white text-base md:text-xl font-light mb-6 md:mb-8 drop-shadow-md animate-fade-in-up [animation-delay:400ms] max-w-xs md:max-w-none">
                  {slide.description}
                </p>
                <button className="bg-brand-primary text-white px-6 py-2.5 md:px-8 md:py-3 uppercase tracking-widest text-xs md:text-sm font-semibold hover:bg-brand-dark transition-all duration-300 animate-fade-in-up [animation-delay:600ms]">
                  {slide.buttonText}
                </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all md:opacity-0 md:group-hover:opacity-100 z-10"
      >
        <ChevronLeft size={20} className="md:w-6 md:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all md:opacity-0 md:group-hover:opacity-100 z-10"
      >
        <ChevronRight size={20} className="md:w-6 md:h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
