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
      gsap.set(secondPart, {
        x: elementWidth * 2,
        opacity: 1,
        visibility: 'visible',
        zIndex: 2
      });

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
        if (this.container && secondPart) {
          const firstPartRect = firstPart.getBoundingClientRect();
          const secondPartRect = secondPart.getBoundingClientRect();
          const containerRect = this.container.getBoundingClientRect();
          const firstPartRightFromContainerLeft = firstPartRect.right - containerRect.left;
          const targetX = firstPartRightFromContainerLeft - secondPartRect.width;

          // Simple animation - slide in from the right and stop at firstPart's edge
          gsap.to(secondPart, {
            x: targetX,
            duration: 2.5,
            ease: "none", // Linear movement
            onComplete: () => {
              // After second part reaches its position, slide both parts left together
              gsap.to([firstPart, secondPart], {
                x: '-=100',
                duration: 1,
                ease: "power2.out",
                onComplete: () => {
                  // Find the span containing "Frustration"
                  const wordSpan = firstPart.querySelector('.word-effect');
                  if (wordSpan) {
                    const frustrationText = wordSpan.textContent || '';
                    const lastLetter = frustrationText.charAt(frustrationText.length - 1);
                    const secondLastLetter = frustrationText.charAt(frustrationText.length - 2);
                    const thirdLastLetter = frustrationText.charAt(frustrationText.length - 3);
                    const fourthLastLetter = frustrationText.charAt(frustrationText.length - 4);
                    const fifthLastLetter = frustrationText.charAt(frustrationText.length - 5);
                    const sixthLastLetter = frustrationText.charAt(frustrationText.length - 6);
                    const seventhLastLetter = frustrationText.charAt(frustrationText.length - 7);
                    const eighthLastLetter = frustrationText.charAt(frustrationText.length - 8);
                    const ninthLastLetter = frustrationText.charAt(frustrationText.length - 9);
                    const tenthLastLetter = frustrationText.charAt(frustrationText.length - 10);
                    const eleventhLastLetter = frustrationText.charAt(frustrationText.length - 11);
                    
                    // Create wrappers for all eleven letters
                    const lastLetterWrapper = document.createElement('div');
                    const secondLastLetterWrapper = document.createElement('div');
                    const thirdLastLetterWrapper = document.createElement('div');
                    const fourthLastLetterWrapper = document.createElement('div');
                    const fifthLastLetterWrapper = document.createElement('div');
                    const sixthLastLetterWrapper = document.createElement('div');
                    const seventhLastLetterWrapper = document.createElement('div');
                    const eighthLastLetterWrapper = document.createElement('div');
                    const ninthLastLetterWrapper = document.createElement('div');
                    const tenthLastLetterWrapper = document.createElement('div');
                    const eleventhLastLetterWrapper = document.createElement('div');
                    
                    // Create spans for all letters
                    const lastLetterSpan = document.createElement('span');
                    const secondLastLetterSpan = document.createElement('span');
                    const thirdLastLetterSpan = document.createElement('span');
                    const fourthLastLetterSpan = document.createElement('span');
                    const fifthLastLetterSpan = document.createElement('span');
                    const sixthLastLetterSpan = document.createElement('span');
                    const seventhLastLetterSpan = document.createElement('span');
                    const eighthLastLetterSpan = document.createElement('span');
                    const ninthLastLetterSpan = document.createElement('span');
                    const tenthLastLetterSpan = document.createElement('span');
                    const eleventhLastLetterSpan = document.createElement('span');
                    
                    // Set up all letters with same styling
                    [
                      { span: lastLetterSpan, text: lastLetter },
                      { span: secondLastLetterSpan, text: secondLastLetter },
                      { span: thirdLastLetterSpan, text: thirdLastLetter },
                      { span: fourthLastLetterSpan, text: fourthLastLetter },
                      { span: fifthLastLetterSpan, text: fifthLastLetter },
                      { span: sixthLastLetterSpan, text: sixthLastLetter },
                      { span: seventhLastLetterSpan, text: seventhLastLetter },
                      { span: eighthLastLetterSpan, text: eighthLastLetter },
                      { span: ninthLastLetterSpan, text: ninthLastLetter },
                      { span: tenthLastLetterSpan, text: tenthLastLetter },
                      { span: eleventhLastLetterSpan, text: eleventhLastLetter }
                    ].forEach(({ span, text }) => {
                      span.textContent = text;
                      span.className = wordSpan.className;
                      span.style.background = window.getComputedStyle(wordSpan).background;
                      span.style.border = 'none'; // Remove borders
                    });
                    
                    // Style all wrappers
                    [lastLetterWrapper, secondLastLetterWrapper, thirdLastLetterWrapper, fourthLastLetterWrapper, fifthLastLetterWrapper, sixthLastLetterWrapper, seventhLastLetterWrapper, eighthLastLetterWrapper, ninthLastLetterWrapper, tenthLastLetterWrapper, eleventhLastLetterWrapper].forEach(wrapper => {
                      wrapper.style.display = 'inline-block';
                      wrapper.style.position = 'relative';
                      wrapper.style.zIndex = '3';
                    });
                    
                    // Add spans to their wrappers
                    lastLetterWrapper.appendChild(lastLetterSpan);
                    secondLastLetterWrapper.appendChild(secondLastLetterSpan);
                    thirdLastLetterWrapper.appendChild(thirdLastLetterSpan);
                    fourthLastLetterWrapper.appendChild(fourthLastLetterSpan);
                    fifthLastLetterWrapper.appendChild(fifthLastLetterSpan);
                    sixthLastLetterWrapper.appendChild(sixthLastLetterSpan);
                    seventhLastLetterWrapper.appendChild(seventhLastLetterSpan);
                    eighthLastLetterWrapper.appendChild(eighthLastLetterSpan);
                    ninthLastLetterWrapper.appendChild(ninthLastLetterSpan);
                    tenthLastLetterWrapper.appendChild(tenthLastLetterSpan);
                    eleventhLastLetterWrapper.appendChild(eleventhLastLetterSpan);
                    
                    // Update the original word without the last eleven letters
                    wordSpan.textContent = frustrationText.slice(0, -11);
                    
                    // Insert all wrappers after the word span in correct order
                    wordSpan.parentNode?.insertBefore(lastLetterWrapper, wordSpan.nextSibling);
                    wordSpan.parentNode?.insertBefore(secondLastLetterWrapper, lastLetterWrapper);
                    wordSpan.parentNode?.insertBefore(thirdLastLetterWrapper, secondLastLetterWrapper);
                    wordSpan.parentNode?.insertBefore(fourthLastLetterWrapper, thirdLastLetterWrapper);
                    wordSpan.parentNode?.insertBefore(fifthLastLetterWrapper, fourthLastLetterWrapper);
                    wordSpan.parentNode?.insertBefore(sixthLastLetterWrapper, fifthLastLetterWrapper);
                    wordSpan.parentNode?.insertBefore(seventhLastLetterWrapper, sixthLastLetterWrapper);
                    wordSpan.parentNode?.insertBefore(eighthLastLetterWrapper, seventhLastLetterWrapper);
                    wordSpan.parentNode?.insertBefore(ninthLastLetterWrapper, eighthLastLetterWrapper);
                    wordSpan.parentNode?.insertBefore(tenthLastLetterWrapper, ninthLastLetterWrapper);
                    wordSpan.parentNode?.insertBefore(eleventhLastLetterWrapper, tenthLastLetterWrapper);

                    const tl = gsap.timeline();
                    
                    // Initial movement of last letter
                    tl.to(lastLetterWrapper, {
                      x: '-=25',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // First compression: move last two letters together
                    .to([secondLastLetterWrapper, lastLetterWrapper], {
                      x: '-=10',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // Second compression: add third letter and increase movements
                    .to([thirdLastLetterWrapper, secondLastLetterWrapper, lastLetterWrapper], {
                      x: '-=12',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // Third compression: add fourth letter and increase movements
                    .to([fourthLastLetterWrapper, thirdLastLetterWrapper, secondLastLetterWrapper, lastLetterWrapper], {
                      x: '-=15',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // Fourth compression: add fifth letter and increase movements
                    .to([fifthLastLetterWrapper, fourthLastLetterWrapper, thirdLastLetterWrapper, secondLastLetterWrapper, lastLetterWrapper], {
                      x: '-=18',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // Fifth compression: add sixth letter and increase movements
                    .to([sixthLastLetterWrapper, fifthLastLetterWrapper, fourthLastLetterWrapper, thirdLastLetterWrapper, secondLastLetterWrapper, lastLetterWrapper], {
                      x: '-=20',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // Sixth compression: add seventh letter and increase movements
                    .to([seventhLastLetterWrapper, sixthLastLetterWrapper, fifthLastLetterWrapper, fourthLastLetterWrapper, thirdLastLetterWrapper, secondLastLetterWrapper, lastLetterWrapper], {
                      x: '-=22',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // Seventh compression: add eighth letter and increase movements
                    .to([eighthLastLetterWrapper, seventhLastLetterWrapper, sixthLastLetterWrapper, fifthLastLetterWrapper, fourthLastLetterWrapper, thirdLastLetterWrapper, secondLastLetterWrapper, lastLetterWrapper], {
                      x: '-=25',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // Eighth compression: add ninth letter and increase movements
                    .to([ninthLastLetterWrapper, eighthLastLetterWrapper, seventhLastLetterWrapper, sixthLastLetterWrapper, fifthLastLetterWrapper, fourthLastLetterWrapper, thirdLastLetterWrapper, secondLastLetterWrapper, lastLetterWrapper], {
                      x: '-=28',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // Ninth compression: add tenth letter and increase movements
                    .to([tenthLastLetterWrapper, ninthLastLetterWrapper, eighthLastLetterWrapper, seventhLastLetterWrapper, sixthLastLetterWrapper, fifthLastLetterWrapper, fourthLastLetterWrapper, thirdLastLetterWrapper, secondLastLetterWrapper, lastLetterWrapper], {
                      x: '-=30',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // Tenth compression: add eleventh letter and increase movements
                    .to([eleventhLastLetterWrapper, tenthLastLetterWrapper, ninthLastLetterWrapper, eighthLastLetterWrapper, seventhLastLetterWrapper, sixthLastLetterWrapper, fifthLastLetterWrapper, fourthLastLetterWrapper, thirdLastLetterWrapper, secondLastLetterWrapper, lastLetterWrapper], {
                      x: '-=32',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // Final tight squeeze: all letters move together
                    .to([eleventhLastLetterWrapper, tenthLastLetterWrapper, ninthLastLetterWrapper, eighthLastLetterWrapper, seventhLastLetterWrapper, sixthLastLetterWrapper, fifthLastLetterWrapper, fourthLastLetterWrapper, thirdLastLetterWrapper, secondLastLetterWrapper, lastLetterWrapper], {
                      x: '-=50',
                      duration: 0.15,
                      ease: "power2.in"
                    });

                    // Create a pushing effect with "To Fantastic"
                    const pushTl = gsap.timeline();
                    
                    // Initial push
                    pushTl.to(secondPart, {
                      x: '-=5',
                      duration: 0.1,
                      ease: "power2.in"
                    })
                    // Stronger push during first compression
                    .to(secondPart, {
                      x: '-=8',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // Even stronger push during second compression
                    .to(secondPart, {
                      x: '-=10',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // Maximum push during third compression
                    .to(secondPart, {
                      x: '-=12',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // Final push during fourth compression
                    .to(secondPart, {
                      x: '-=15',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // Final push during fifth compression
                    .to(secondPart, {
                      x: '-=20',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // Final push during sixth compression
                    .to(secondPart, {
                      x: '-=25',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // Final push during seventh compression
                    .to(secondPart, {
                      x: '-=30',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // Final push during eighth compression
                    .to(secondPart, {
                      x: '-=35',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // Final push during ninth compression
                    .to(secondPart, {
                      x: '-=40',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // Final push during tenth compression
                    .to(secondPart, {
                      x: '-=45',
                      duration: 0.2,
                      ease: "power2.in"
                    })
                    // Final squeeze push
                    .to(secondPart, {
                      x: '-=50',
                      duration: 0.15,
                      ease: "power2.in"
                    });

                    // Move second part along with the squeeze
                    gsap.to(secondPart, {
                      x: '-=50',
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