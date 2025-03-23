import gsap from 'gsap';

export type LoadingDotsAnimationStyle = 'bounce' | 'pulse' | 'flash' | 'collide' | 'elastic';

export interface LoadingDotsOptions {
  container: HTMLElement;
  dots?: number;
  duration?: number;
  delay?: number;
  dotSize?: number;
  dotColor?: string;
  dotSpacing?: number;
  yOffset?: number;
  loop?: boolean;
  onComplete?: () => void;
  animationStyle?: LoadingDotsAnimationStyle;
}

export const createLoadingDots = (options: LoadingDotsOptions) => {
  const {
    container,
    dots = 3,
    duration = 0.6,
    delay = 0,
    dotSize = 4,
    dotColor = 'currentColor',
    dotSpacing = 4,
    yOffset = 3,
    loop = true,
    onComplete,
    animationStyle = 'bounce'
  } = options;

  // Clear any existing dots
  container.innerHTML = '';
  
  // Create dots container
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'loading-dots';
  dotsContainer.style.display = 'flex';
  dotsContainer.style.alignItems = 'center';
  dotsContainer.style.gap = `${dotSpacing}px`;
  
  // Create dots
  const dotElements: HTMLElement[] = [];
  for (let i = 0; i < dots; i++) {
    const dot = document.createElement('span');
    dot.className = 'loading-dot';
    dot.style.width = `${dotSize}px`;
    dot.style.height = `${dotSize}px`;
    dot.style.backgroundColor = dotColor;
    dot.style.borderRadius = '50%';
    dot.style.display = 'inline-block';
    
    dotsContainer.appendChild(dot);
    dotElements.push(dot);
  }
  
  container.appendChild(dotsContainer);
  
  // Create animation timeline
  const tl = gsap.timeline({
    delay,
    repeat: loop ? -1 : 0,
    onComplete: loop ? undefined : onComplete
  });
  
  // Apply the selected animation style
  switch (animationStyle) {
    case 'bounce':
      animateBounce(dotElements, tl, duration, yOffset);
      break;
    case 'pulse':
      animatePulse(dotElements, tl, duration);
      break;
    case 'flash':
      animateFlash(dotElements, tl, duration);
      break;
    case 'collide':
      animateCollide(dotElements, tl, duration, dotSpacing);
      break;
    case 'elastic':
      animateElastic(dotElements, tl, duration, yOffset);
      break;
    default:
      animateBounce(dotElements, tl, duration, yOffset);
  }
  
  return {
    timeline: tl,
    stop: () => {
      tl.kill();
      container.innerHTML = '';
    },
    pause: () => tl.pause(),
    resume: () => tl.resume(),
    setColor: (color: string) => {
      dotElements.forEach(dot => {
        dot.style.backgroundColor = color;
      });
    }
  };
};

// Animation styles

function animateBounce(dots: HTMLElement[], timeline: gsap.core.Timeline, duration: number, yOffset: number) {
  dots.forEach((dot, index) => {
    timeline.to(dot, {
      y: -yOffset,
      duration: duration / 2,
      ease: 'power2.out',
    }, index * 0.1)
    .to(dot, {
      y: 0,
      duration: duration / 2,
      ease: 'power2.in',
    });
  });
}

function animatePulse(dots: HTMLElement[], timeline: gsap.core.Timeline, duration: number) {
  dots.forEach((dot, index) => {
    timeline.to(dot, {
      scale: 1.5,
      opacity: 1,
      duration: duration / 2,
      ease: 'sine.out',
    }, index * 0.1)
    .to(dot, {
      scale: 1,
      opacity: 0.5,
      duration: duration / 2,
      ease: 'sine.in',
    });
  });
}

function animateFlash(dots: HTMLElement[], timeline: gsap.core.Timeline, duration: number) {
  dots.forEach((dot, index) => {
    // Set initial opacity
    gsap.set(dot, { opacity: 0.3 });
    
    timeline.to(dot, {
      opacity: 1,
      duration: duration / 4,
      ease: 'power1.inOut',
    }, index * 0.1)
    .to(dot, {
      opacity: 0.3,
      duration: duration / 4,
      ease: 'power1.inOut',
    });
  });
}

function animateCollide(dots: HTMLElement[], timeline: gsap.core.Timeline, duration: number, spacing: number) {
  if (dots.length < 2) return;
  
  const center = dots.length / 2;
  const moveDistance = spacing * 0.7;
  
  dots.forEach((dot, index) => {
    const isLeftSide = index < center;
    const distanceFromCenter = isLeftSide ? center - index - 1 : index - center;
    const delay = distanceFromCenter * 0.05;
    const moveX = isLeftSide ? moveDistance : -moveDistance;
    
    timeline.to(dot, {
      x: moveX,
      duration: duration / 2,
      ease: 'power2.out',
      delay: delay
    }, 0)
    .to(dot, {
      x: 0,
      duration: duration / 2,
      ease: 'elastic.out(1, 0.3)',
    }, duration / 2 + delay);
  });
}

function animateElastic(dots: HTMLElement[], timeline: gsap.core.Timeline, duration: number, yOffset: number) {
  dots.forEach((dot, index) => {
    timeline.to(dot, {
      y: -yOffset,
      duration: duration / 3,
      ease: 'power2.out',
    }, index * 0.1)
    .to(dot, {
      y: 0,
      duration: duration * 2/3,
      ease: 'elastic.out(1, 0.3)',
    });
  });
}
