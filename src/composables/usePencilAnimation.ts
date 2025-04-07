import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

export function usePencilAnimation() {
  const animatePencilAlongPath = (path: SVGPathElement, dot: SVGCircleElement) => {
    gsap.set(dot, { opacity: 1 });
    
    gsap.to(dot, {
      duration: 2,
      motionPath: {
        path: path,
        align: path,
        alignOrigin: [0.5, 0.5],
        autoRotate: true
      },
      ease: "none",
      onComplete: () => {
        gsap.set(dot, { opacity: 0 });
      }
    });
  };

  return {
    animatePencilAlongPath
  };
} 