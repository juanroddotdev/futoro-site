import { watch, nextTick } from 'vue';
import { createComponentDebugger } from '@/utils/scroll/debug/ComponentDebugger';

export function usePhoneSectionDebug(config: any) {
  const { refs, state, methods, props, options } = config;
  
  // Create the debugger
  const componentDebugger = createComponentDebugger({
    componentName: 'PhoneSection',
    sectionId: `phone-section-${props.sectionId}`,
    enabled: options?.enabled ?? true,
    observeElements: {
      'container': {
        ref: refs.containerRef,
        threshold: 0.1,
        trackStyles: true
      },
      'messages': {
        ref: refs.messagesRef,
        threshold: 0.1,
        trackStyles: true,
        trackAttributes: ['class', 'data-visible']
      },
      // For the phone element, we need to ensure we're getting the DOM element
      // and not the component instance
      'phone': {
        // If floatingPhoneRef is a Vue component instance, we need to access its $el property
        // or ensure we're passing a ref to the actual DOM element
        ref: refs.phoneContainerRef || refs.floatingPhoneRef,
        threshold: 0.1,
        trackStyles: true
      }
    },
    trackAnimations: true,
    trackProps: true,
    props
  });
  
  const init = () => {
    componentDebugger.init();
    
    // Immediate console log for debugging
    console.log(`[PhoneSectionDebug] 🔍 Initializing debug for section: ${props.sectionId}`);
    
    // Track message visibility
    componentDebugger.log('Initializing message visibility tracking');
    
    // Helper function to check message visibility - DEFINE FIRST
    const checkMessageVisibility = (trigger: string) => {
      console.log(`[PhoneSectionDebug] 🔍 Running checkMessageVisibility(${trigger}) for ${props.sectionId}`);
      
      const sectionSelector = `#${props.sectionId}`;
      console.log(`[PhoneSectionDebug] 🔍 Looking for elements with selector: ${sectionSelector} .message-group`);
      
      const messageGroups = document.querySelectorAll(`${sectionSelector} .message-group`);
      console.log(`[PhoneSectionDebug] 🔍 Found ${messageGroups.length} message groups for ${props.sectionId}`);
      
      if (messageGroups.length === 0) {
        console.error(`[PhoneSectionDebug] ❌ No message groups found for section ${props.sectionId}`);
        componentDebugger.error(`No message groups found for section ${props.sectionId}`);
        return;
      }
      
      const firstGroup = document.querySelector(`${sectionSelector} .message-group-1`);
      if (firstGroup) {
        const opacity = window.getComputedStyle(firstGroup).opacity;
        console.log(`[PhoneSectionDebug] 🔍 [${trigger}] First message opacity: ${opacity} for ${props.sectionId}`);
        componentDebugger.log(`[${trigger}] First message opacity: ${opacity}`);
        
        // Track if messages are visible or hidden
        if (parseFloat(opacity) > 0) {
          console.log(`[PhoneSectionDebug] 🔍 [${trigger}] Messages are VISIBLE on initial view for ${props.sectionId}`);
          componentDebugger.log(`[${trigger}] Messages are VISIBLE on initial view`);
        } else {
          console.log(`[PhoneSectionDebug] 🔍 [${trigger}] Messages are HIDDEN on initial view for ${props.sectionId}`);
          componentDebugger.log(`[${trigger}] Messages are HIDDEN on initial view`);
        }
      } else {
        console.error(`[PhoneSectionDebug] ❌ Could not find first message group for opacity check (${trigger}) for ${props.sectionId}`);
        componentDebugger.error(`Could not find first message group for opacity check (${trigger})`);
      }
      
      // Log visibility of all message groups
      console.log(`[PhoneSectionDebug] 🔍 [${trigger}] Checking all ${messageGroups.length} message groups for ${props.sectionId}`);
      componentDebugger.log(`[${trigger}] Checking all ${messageGroups.length} message groups`);
      
      messageGroups.forEach((group, index) => {
        const opacity = window.getComputedStyle(group).opacity;
        const isVisible = parseFloat(opacity) > 0;
        console.log(`[PhoneSectionDebug] 🔍 [${trigger}] Message group ${index + 1}: ${isVisible ? 'VISIBLE' : 'HIDDEN'} (opacity: ${opacity}) for ${props.sectionId}`);
        componentDebugger.log(`[${trigger}] Message group ${index + 1}: ${isVisible ? 'VISIBLE' : 'HIDDEN'} (opacity: ${opacity})`);
      });
    };
    
    // NOW call the function after it's defined
    // Check initial message visibility IMMEDIATELY
    console.log(`[PhoneSectionDebug] 🔍 Checking message visibility immediately for ${props.sectionId}`);
    checkMessageVisibility('immediate');
    
    // Also check on nextTick
    nextTick(() => {
      console.log(`[PhoneSectionDebug] 🔍 Checking message visibility on nextTick for ${props.sectionId}`);
      checkMessageVisibility('page-load');
    });
    
    // Add a delayed check to catch any post-render changes
    setTimeout(() => {
      console.log(`[PhoneSectionDebug] 🔍 Checking message visibility after timeout (100ms) for ${props.sectionId}`);
      checkMessageVisibility('timeout-100ms');
    }, 100);
    
    // Add another delayed check with longer timeout
    setTimeout(() => {
      console.log(`[PhoneSectionDebug] 🔍 Checking message visibility after timeout (500ms) for ${props.sectionId}`);
      checkMessageVisibility('timeout-500ms');
    }, 500);
    
    // Track animation events
    if (methods.setupScrollAnimation) {
      const originalSetupAnimation = methods.setupScrollAnimation;
      methods.setupScrollAnimation = () => {
        componentDebugger.trackAnimation('main', 'setup-started');
        const result = originalSetupAnimation();
        componentDebugger.trackAnimation('main', 'setup-completed');
        
        // Check message visibility after animation setup
        setTimeout(() => {
          checkMessageVisibility('after-animation-setup');
        }, 100);
        
        return result;
      };
    }
    
    // Track scroll events if timeline exists
    if (state.timeline) {
      watch(() => state.timeline, (timeline) => {
        if (timeline) {
          componentDebugger.log('Timeline created', { 
            duration: timeline.duration(),
            progress: timeline.progress()
          });
          
          // Check message visibility after timeline creation
          setTimeout(() => {
            checkMessageVisibility('after-timeline-creation');
          }, 100);
        }
      });
    }
  };
  
  return {
    init,
    log: componentDebugger.log,
    error: componentDebugger.error,
    trackAnimation: (status: string, details?: any) => {
      componentDebugger.trackAnimation('main', status, details);
    },
    cleanup: componentDebugger.cleanup
  };
}
