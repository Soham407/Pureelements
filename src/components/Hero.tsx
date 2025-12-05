
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Slide } from '../types';
import ImageWithFallback from './ImageWithFallback';

interface HeroProps {
  slides: Slide[];
}

const Hero: React.FC<HeroProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [slides.length, isPlaying]);

  const toggleAutoPlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const nextSlide = () => {
     setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
     setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden group">
      
      {/* Slides Container */}
      <div 
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="w-full h-full flex-shrink-0 relative"
          >
            {/* Background Image */}
            <ImageWithFallback
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
              decoding={index === 0 ? "sync" : "async"}
              width={1200}
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
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="md:w-6 md:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all md:opacity-0 md:group-hover:opacity-100 z-10"
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="md:w-6 md:h-6" />
      </button>

      {/* Dots & Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-4 z-10">
        {/* Dots */}
        <div className="flex space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'bg-white w-8' : 'bg-white/50 w-2'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
              aria-current={idx === currentSlide ? 'true' : 'false'}
            />
          ))}
        </div>
        
        {/* Play/Pause Toggle */}
        <button 
          onClick={toggleAutoPlay}
          className="text-white/70 hover:text-white transition-colors"
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
      </div>
    </div>
  );
};

export default Hero;