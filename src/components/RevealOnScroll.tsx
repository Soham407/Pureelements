import React, { useEffect, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  threshold?: number; // 0 to 1, how much of the element must be visible
  delay?: number; // ms
}

const RevealOnScroll: React.FC<Props> = ({ children, threshold = 0.1, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Create observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          // Add a small delay if requested
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          // Unobserve after triggering
          if (entry.target) {
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: threshold,
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before the element is fully in view
      }
    );

    observerRef.current = observer;

    // Observe the element
    try {
      observer.observe(element);
    } catch (error) {
      console.error('Error observing element:', error);
    }

    return () => {
      // Cleanup: disconnect observer
      if (observerRef.current) {
        try {
          observerRef.current.disconnect();
        } catch (error) {
          console.error('Error disconnecting observer:', error);
        }
        observerRef.current = null;
      }
    };
  }, [threshold, delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;