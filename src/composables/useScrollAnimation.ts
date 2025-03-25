import { ref } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
          // Calculate which messages to show based on scroll progress
          const progress = self.progress;
          const totalMessages = messages.length;
          const messagesToShow = Math.ceil(progress * totalMessages);
          
          // Get all message groups
          const sectionSelector = `#${sectionId}`;
          for (let i = 1; i <= totalMessages; i++) {
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

  const cleanupScrollAnimation = () => {
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }
    if (timeline) {
      timeline.kill();
    }
  };

  return {
    setupScrollAnimation,
    cleanupScrollAnimation
  };
}
