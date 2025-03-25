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
        immediateRender: true
      }
    });

    // Store the ScrollTrigger instance for cleanup
    scrollTriggerInstance = timeline.scrollTrigger as ScrollTrigger;

    // Modify selectors to be scoped to this section
    const sectionSelector = `#${sectionId}`;
    
    // Check if messages exist before creating animations
    if (messages.length === 0) {
      return;
    }

    const MESSAGE_OFFSET = 100;

    messages.forEach((_, idx) => {
      const currentGroup = `${sectionSelector} .message-group-${idx + 1}`;
      // Check if element exists before animating
      const currentGroupEl = document.querySelector(currentGroup);
      if (!currentGroupEl) {
        return; // Skip this animation if element doesn't exist
      }

      if (idx > 0) {
        const previousGroups = [];
        // Collect only existing elements
        for (let i = 0; i < idx; i++) {
          const el = document.querySelector(`${sectionSelector} .message-group-${i + 1}`);
          if (el) previousGroups.push(el);
        }

        if (previousGroups.length > 0) {
          timeline.to(previousGroups, {
            y: `-=${MESSAGE_OFFSET}`,
            duration: 0.3,
            ease: "power2.out",
            stagger: {
              amount: 0.1,
              ease: "power1.in"
            }
          });
        }
      }

      if (showTypingFor.includes(idx)) {
        const typingContainer = `${sectionSelector} .typing-container-${idx + 1}`;
        // Check if typing container exists
        const typingEl = document.querySelector(typingContainer);
        if (typingEl) {
          timeline
            .to(typingEl, {
              opacity: 1,
              duration: 0.15,
              ease: "power1.out"
            })
            .to({}, { duration: 0.3 })
            .to(typingEl, {
              opacity: 0,
              duration: 0.15,
              ease: "power1.in"
            });
        }
      }

      timeline.to(currentGroupEl, {
        opacity: 1,
        duration: 0.2,
        ease: "power1.out"
      })
        .to({}, { duration: 0.3 });
    });
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
