/**
 * Particle effect creators and animators
 * Each effect has two functions:
 * - createXParticle: Creates and styles a particle DOM element
 * - animateXParticle: Defines the animation for that particle type
 */

/**
 * Creates an ember particle that floats upward
 */
export const createEmberParticle = (container, props) => {
  const ember = document.createElement('div');
  ember.className = 'ember-particle';
  
  // Random ember styling
  const size = 3 + Math.random() * 5;
  const color = props.colors[Math.floor(Math.random() * props.colors.length)];
  
  Object.assign(ember.style, {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color,
    borderRadius: '50%',
    boxShadow: `0 0 ${size * 2}px ${color}`,
    opacity: 0.8 + Math.random() * 0.2,
    left: `${props.originX - 10 + Math.random() * 20}%`,
    top: `${props.originY - 10 + Math.random() * 20}%`,
    pointerEvents: 'none'
  });
  
  container.appendChild(ember);
  return ember;
};

export const animateEmber = (ember, timeline, props) => {
  timeline.to(ember, {
    y: -50 - Math.random() * 100,
    x: (Math.random() - 0.5) * 50,
    opacity: 0,
    duration: 0.5 + Math.random() * props.duration,
    ease: 'power1.out',
    delay: Math.random() * 0.5,
    onComplete: () => ember.remove()
  }, 0);
};

/**
 * Creates a firework particle that explodes outward
 */
export const createFireworkParticle = (container, props) => {
  const particle = document.createElement('div');
  particle.className = 'firework-particle';
  
  const size = 2 + Math.random() * 6;
  const color = props.colors[Math.floor(Math.random() * props.colors.length)];
  
  Object.assign(particle.style, {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color,
    borderRadius: '50%',
    boxShadow: `0 0 ${size * 2}px ${color}`,
    opacity: 0.8 + Math.random() * 0.2,
    left: `${props.originX}%`,
    top: `${props.originY}%`,
    pointerEvents: 'none'
  });
  
  container.appendChild(particle);
  return particle;
};

export const animateFirework = (particle, timeline, props) => {
  const angle = Math.random() * Math.PI * 2;
  const distance = 50 + Math.random() * 150;
  
  timeline.to(particle, {
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    opacity: 0,
    duration: 0.5 + Math.random() * props.duration,
    ease: 'power2.out',
    delay: Math.random() * 0.2,
    onComplete: () => particle.remove()
  }, 0);
};

/**
 * Creates a spark particle that falls with gravity
 */
export const createSparkParticle = (container, props) => {
  const spark = document.createElement('div');
  spark.className = 'spark-particle';
  
  const size = 1 + Math.random() * 3;
  const color = props.colors[Math.floor(Math.random() * props.colors.length)];
  
  Object.assign(spark.style, {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: 'white',
    borderRadius: '50%',
    boxShadow: `0 0 ${size * 3}px ${color}`,
    opacity: 0.9 + Math.random() * 0.1,
    left: `${props.originX - 5 + Math.random() * 10}%`,
    top: `${props.originY - 5 + Math.random() * 10}%`,
    pointerEvents: 'none'
  });
  
  container.appendChild(spark);
  return spark;
};

export const animateSpark = (spark, timeline, props) => {
  timeline.to(spark, {
    y: 50 + Math.random() * 100,
    x: (Math.random() - 0.5) * 80,
    opacity: 0,
    duration: 0.3 + Math.random() * props.duration,
    ease: 'power1.in',
    delay: Math.random() * 0.3,
    onComplete: () => spark.remove()
  }, 0);
};

/**
 * Creates a rain particle that falls straight down
 */
export const createRainParticle = (container, props) => {
  const drop = document.createElement('div');
  drop.className = 'rain-particle';
  
  const width = 1 + Math.random() * 2;
  const height = 5 + Math.random() * 15;
  const color = props.colors[Math.floor(Math.random() * props.colors.length)];
  
  Object.assign(drop.style, {
    position: 'absolute',
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: color,
    borderRadius: '40%',
    boxShadow: `0 0 ${width}px ${color}`,
    opacity: 0.6 + Math.random() * 0.4,
    left: `${Math.random() * 100}%`,
    top: `${props.originY}%`,
    pointerEvents: 'none'
  });
  
  container.appendChild(drop);
  return drop;
};

export const animateRain = (drop, timeline, props) => {
  timeline.to(drop, {
    y: 100 + Math.random() * 50,
    opacity: 0,
    duration: 0.5 + Math.random() * props.duration,
    ease: 'none',
    delay: Math.random() * 1,
    onComplete: () => drop.remove()
  }, 0);
};

/**
 * Effect registry - maps effect types to their create/animate functions
 */
export const effectTypes = {
  ember: {
    create: createEmberParticle,
    animate: animateEmber
  },
  firework: {
    create: createFireworkParticle,
    animate: animateFirework
  },
  spark: {
    create: createSparkParticle,
    animate: animateSpark
  },
  rain: {
    create: createRainParticle,
    animate: animateRain
  }
};