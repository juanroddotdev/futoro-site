/**
 * ScrollTracker Package
 * A flexible, extensible scroll tracking utility for web applications
 * 
 * This file exports all public APIs from the package
 */

// Core exports
export { ScrollTracker } from './core/ScrollTracker';
export type { 
  ScrollPosition, 
  ElementPosition, 
  TrackerOptions,
  Plugin 
} from './core/ScrollTracker';

// Plugins
export { VisualizationPlugin } from './plugins/VisualizationPlugin';
export { AnimationPlugin } from './plugins/AnimationPlugin';

// Utilities
export { 
  throttle, 
  debounce, 
  rafThrottle 
} from './utils/performance';

// Version info
export const VERSION = '0.1.0';