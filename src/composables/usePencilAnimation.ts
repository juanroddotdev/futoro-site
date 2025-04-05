import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

export function usePencilAnimation() {
  const animatePencilAlongPath = (path: SVGPathElement, dot: SVGElement) => {
    gsap.set(dot, { opacity: 1 });

    gsap.to(dot, {
      duration: 0.3,
      motionPath: {
        path: path,
        align: path,
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
      },
      ease: 'none',
      onComplete: () => {
        gsap.to(dot, {
          duration: 0.3,
          opacity: 0
        });
      }
    });
  };

  return {
    animatePencilAlongPath
  };
} 