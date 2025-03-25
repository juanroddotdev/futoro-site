import { ref } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useScrollAnimation Composable
 * 
 * This composable provides scroll-based animation functionality for message elements.
 * It creates and manages GSAP ScrollTrigger instances to animate message visibility
 * based on scroll position.
 * 
 * Key features:
 * - Creates a GSAP timeline with ScrollTrigger
 * - Animates message elements based on scroll progress
 * - Handles typing indicators for selected messages
 * - Supports pinning the container during scroll
 * - Provides cleanup functionality to prevent memory leaks
 * 
 * @param containerRef - Reference to the container element
 * @param messages - Array of message objects to animate
 * @param showTypingFor - Array of message indices that should show typing indicators
 * @param sectionId - Unique ID for the section (used for DOM selection)
 * @param pinSettings - Configuration for GSAP ScrollTrigger pinning behavior
 * @returns Object with setup and cleanup functions
 */
export function useScrollAnimation(
  containerRef: any,
  messages: any[],
  showTypingFor: number[],
  sectionId: string,
  pinSettings: {
    enabled?: boolean;
    start?: string;
    end?: string;
    pinSpacing?: boolean;
    anticipatePin?: number;
  }
) {
  let timeline: gsap.core.Timeline;
  let scrollTriggerInstance: ScrollTrigger;

  /**
   * setupScrollAnimation - Creates and configures the ScrollTrigger animation
   * 
   * This function:
   * 1. Gets the container element from the ref
   * 2. Creates a GSAP timeline with ScrollTrigger
   * 3. Configures the ScrollTrigger with pin settings
   * 4. Sets up the onUpdate callback to animate messages based on scroll progress
   * 5. Stores the ScrollTrigger instance for later cleanup
   */
  const setupScrollAnimation = () => {
    const container = containerRef.value;
    if (!container) {
      return;
    }

    // Create timeline with ScrollTrigger
    timeline = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: pinSettings.start || 'top top',
        end: pinSettings.end || `+=${messages.length * 50}%`,
        scrub: 0.5,
        pin: pinSettings.enabled,
        pinSpacing: pinSettings.enabled ? pinSettings.pinSpacing : false,
        anticipatePin: pinSettings.enabled ? pinSettings.anticipatePin : 0,
        onEnter: () => {
          // Show first message only when scrolling begins
          if (messages.length > 0) {
            const sectionSelector = `#${sectionId}`;
            const firstGroup = `${sectionSelector} .message-group-1`;
            gsap.to(firstGroup, { opacity: 1, y: 0, duration: 0.3 });
          }
        },
        onUpdate: (self) => {
          // Calculate how many messages should be visible based on scroll progress
          const progress = self.progress;
          const totalMessages = messages.length;
          const messagesToShow = Math.floor(progress * totalMessages);
          
          // Update each message group's visibility
          for (let i = 1; i <= totalMessages; i++) {
            const sectionSelector = `#${sectionId}`;
            const messageGroup = document.querySelector(`${sectionSelector} .message-group-${i}`);
            const typingIndicator = document.querySelector(`${sectionSelector} .typing-indicator-${i}`);
            
            if (messageGroup) {
              // Show message if it should be visible based on scroll progress
              const shouldShow = i <= messagesToShow;
              gsap.to(messageGroup, {
                opacity: shouldShow ? 1 : 0,
                y: shouldShow ? 0 : 20,
                duration: 0.3
              });
              
              // Handle typing indicators
              if (typingIndicator && showTypingFor.includes(i - 1)) {
                const typingProgress = (progress * totalMessages) - (i - 1);
                const showTyping = typingProgress > 0 && typingProgress < 0.5;
                
                gsap.to(typingIndicator, {
                  opacity: showTyping ? 1 : 0,
                  duration: 0.2
                });
              }
            }
          }
        },
        immediateRender: true
      }
    });

    // Store the ScrollTrigger instance for cleanup
    scrollTriggerInstance = timeline.scrollTrigger;
  };

  /**
   * cleanupScrollAnimation - Cleans up the ScrollTrigger instance
   * 
   * This function:
   * 1. Checks if a ScrollTrigger instance exists
   * 2. Kills the ScrollTrigger to prevent memory leaks
   * 3. Sets the instance to null
   */
  const cleanupScrollAnimation = () => {
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
      scrollTriggerInstance = null;
    }
  };

  return {
    setupScrollAnimation,
    cleanupScrollAnimation
  };
}
