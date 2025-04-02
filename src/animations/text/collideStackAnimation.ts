import gsap from 'gsap';
import { TextAnimationOptions } from './textAnimations';

export class CollideStackAnimation {
  private tl: gsap.core.Timeline;
  private elements: HTMLElement[];
  private options: TextAnimationOptions;
  private container: HTMLElement | null = null;

  constructor(timeline: gsap.core.Timeline, elements: HTMLElement[], options?: TextAnimationOptions) {
    this.tl = timeline;
    this.elements = elements;
    this.options = options || {};
    
    // Find the parent container
    if (elements.length > 0 && elements[0].parentElement) {
      this.container = elements[0].parentElement;
    }
  }

  public animate(): gsap.core.Timeline {
    const [firstPart, secondPart] = this.elements;
    const duration = this.options.duration || 1;
    const ease = this.options.ease || 'power2.out';
    
    // Add special classes to the container for collide-stack specific styling
    if (this.container) {
      this.container.classList.add('collide-stack-container', 'animating-first-part');
    }

    // Set initial states
    gsap.set(firstPart, { 
      x: -window.innerWidth * 0.3, // Start further off-screen
      opacity: 0,
      transformOrigin: 'center center'
    });

    if (secondPart) {
      // Log the element's dimensions
      const elementWidth = secondPart.offsetWidth;
      const elementRect = secondPart.getBoundingClientRect();
      console.log('SecondPart dimensions:', {
        offsetWidth: elementWidth,
        boundingRect: {
          width: elementRect.width,
          right: elementRect.right,
          left: elementRect.left
        }
      });

      // Position it one full element width outside viewport
      gsap.set(secondPart, {
        x: elementWidth * 2, // Start two widths away to ensure visibility
        opacity: 1,
        visibility: 'visible',
        zIndex: 2 // Ensure it's above the first part
      });

      // Also set z-index on first part
      gsap.set(firstPart, {
        zIndex: 1
      });
    }

    // First part animation - slides to center
    this.tl.to(firstPart, {
      x: 0,
      opacity: 1,
      duration: duration * 0.6,
      ease: ease,
      onComplete: () => {
        console.log('First part animation complete, preparing secondPart');
        
        if (this.container && secondPart) {
          // Calculate the right edge position of firstPart
          const firstPartRect = firstPart.getBoundingClientRect();
          const secondPartRect = secondPart.getBoundingClientRect();
          const containerRect = this.container.getBoundingClientRect();
          
          // Calculate how far from the container's left edge the first part's right edge is
          const firstPartRightFromContainerLeft = firstPartRect.right - containerRect.left;
          
          // Subtract the second part's width to align right edges
          const targetX = firstPartRightFromContainerLeft - secondPartRect.width;
          
          console.log('Animation measurements:', {
            firstPartRight: firstPartRect.right,
            containerLeft: containerRect.left,
            secondPartWidth: secondPartRect.width,
            targetX
          });

          // Simple animation - slide in from the right and stop at firstPart's edge
          gsap.to(secondPart, {
            x: targetX,
            duration: 2.5,
            ease: "none", // Linear movement
            onStart: () => {
              console.log('SecondPart animation started');
            },
            onUpdate: function() {
              const progress = gsap.getProperty(secondPart, 'x');
              const currentX = progress as number;
            },
            onComplete: () => {
              console.log('SecondPart animation complete');
              
              // After second part reaches its position, slide both parts left together
              gsap.to([firstPart, secondPart], {
                x: '-=100',
                duration: 1,
                ease: "power2.out",
                onStart: () => {
                  console.log('Both parts slide left started');
                },
                onComplete: () => {
                  console.log('Both parts slide left complete');
                  
                  // Find the span containing "Frustration"
                  const wordSpan = firstPart.querySelector('.word-effect');
                  if (wordSpan) {
                    const frustrationText = wordSpan.textContent || '';
                    const lastLetter = frustrationText.charAt(frustrationText.length - 1);
                    const secondLastLetter = frustrationText.charAt(frustrationText.length - 2);
                    const thirdLastLetter = frustrationText.charAt(frustrationText.length - 3);
                    
                    // Create wrappers for all three letters
                    const lastLetterWrapper = document.createElement('div');
                    const secondLastLetterWrapper = document.createElement('div');
                    const thirdLastLetterWrapper = document.createElement('div');
                    
                    // Create spans for all letters
                    const lastLetterSpan = document.createElement('span');
                    const secondLastLetterSpan = document.createElement('span');
                    const thirdLastLetterSpan = document.createElement('span');
                    
                    // Set up all letters with same styling
                    [
                      { span: lastLetterSpan, text: lastLetter },
                      { span: secondLastLetterSpan, text: secondLastLetter },
                      { span: thirdLastLetterSpan, text: thirdLastLetter }
                    ].forEach(({ span, text }) => {
                      span.textContent = text;
                      span.className = wordSpan.className;
                      span.style.background = window.getComputedStyle(wordSpan).background;
                    });
                    
                    // Style all wrappers
                    [lastLetterWrapper, secondLastLetterWrapper, thirdLastLetterWrapper].forEach(wrapper => {
                      wrapper.style.display = 'inline-block';
                      wrapper.style.position = 'relative';
                      wrapper.style.zIndex = '3';
                    });
                    
                    // Add spans to their wrappers
                    lastLetterWrapper.appendChild(lastLetterSpan);
                    secondLastLetterWrapper.appendChild(secondLastLetterSpan);
                    thirdLastLetterWrapper.appendChild(thirdLastLetterSpan);
                    
                    // Update the original word without the last three letters
                    wordSpan.textContent = frustrationText.slice(0, -3);
                    
                    // Insert all wrappers after the word span in correct order
                    wordSpan.parentNode?.insertBefore(lastLetterWrapper, wordSpan.nextSibling);
                    wordSpan.parentNode?.insertBefore(secondLastLetterWrapper, lastLetterWrapper);
                    wordSpan.parentNode?.insertBefore(thirdLastLetterWrapper, secondLastLetterWrapper);
                    
                    // Animate all letters with increasing compression
                    const tl = gsap.timeline();
                    
                    // Initial movement of last letter
                    tl.to(lastLetterWrapper, {
                      x: '-=15', // Start with bigger movement
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // First compression: move second last letter and continue last letter
                    .to(secondLastLetterWrapper, {
                      x: '-=5',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    .to(lastLetterWrapper, {
                      x: '-=5', // Additional squeeze
                      duration: 0.2,
                      ease: "power2.in"
                    }, "<") // At same time as second last letter
                    // Second compression: increase movements
                    .to(secondLastLetterWrapper, {
                      x: '-=5',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    .to(lastLetterWrapper, {
                      x: '-=5',
                      duration: 0.2,
                      ease: "power2.in"
                    }, "<")
                    .to(thirdLastLetterWrapper, {
                      x: '-=3',
                      duration: 0.2,
                      ease: "power2.in"
                    }, "<")
                    // Final tight squeeze
                    .to(secondLastLetterWrapper, {
                      x: '-=5',
                      duration: 0.1,
                      ease: "power2.in"
                    })
                    .to(lastLetterWrapper, {
                      x: '-=5',
                      duration: 0.1,
                      ease: "power2.in"
                    }, "<")
                    .to(thirdLastLetterWrapper, {
                      x: '-=4',
                      duration: 0.1,
                      ease: "power2.in"
                    }, "<");
                    
                    // Move second part along with the squeeze
                    gsap.to(secondPart, {
                      x: '-=10',
                      duration: 0.5,
                      ease: "power2.out"
                    });
                  }
                }
              });
            }
          });
        }
      }
    });

    return this.tl;
  }
} 