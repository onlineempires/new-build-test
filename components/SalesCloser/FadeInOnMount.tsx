import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface FadeInOnMountProps {
  children: React.ReactNode;
}

export const FadeInOnMount: React.FC<FadeInOnMountProps> = ({ children }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      gsap.fromTo(
        elementRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  return <div ref={elementRef}>{children}</div>;
};
