<template>
  <div class="hero-section-chat">
    <TwoColumnSection :layout="layout" :customClass="customClass">
      <template #headline>
        <h1
          class="heading--accent mb-4 mt-2 heading-responsive-large theme-text--gradient-animated gradient-shine"
        >
          <TextAnimation
            :firstPart="heroContent.headline"
            animation="fadeUp"
            :useGradient="true"
            :duration="3"
            :initiallyHidden="true"
            :triggerOnVisible="true"
            :restartOnVisible="true"
          />
        </h1>
      </template>
      <template #subheadline>
        <p class="mb-8 subheading-responsive heading--highlight">
          <TextAnimation
            :firstPart="heroContent.subheadline"
            animation="fade"
            :useGradient="true"
            :duration="3"
            :initiallyHidden="true"
            :triggerOnVisible="true"
            :restartOnVisible="true"
          />
        </p>
      </template>
      <template #content>
        <div class="flex gap-4">
          <a
            :href="primaryCtaLink"
            class="btn-round--secondary btn-round--large cta"
          >
            {{ heroContent.cta }}
          </a>
          <a :href="secondaryCtaLink" class="btn-round-large-outline-secondary">
            {{ secondaryCtaText }}
          </a>
        </div>
      </template>
      <template #right-content>
        <div class="right-content-placeholder">
          <div class="svg-animation-container">
            <div ref="svgBackgroundRef" class="svg-layer svg-layer--background">
              <SvgBackground />
            </div>
            <div ref="svgNavRef" class="svg-layer svg-layer--nav">
              <SvgNav />
              <!-- <div ref="svgNavPullRef" class="svg-layer svg-pull-graphic">
                <SvgNavPull />
              </div> -->
            </div>
            <div ref="svgLeftsideRef" class="svg-layer svg-layer--leftside">
              <SvgLeftside />
              <div ref="svgPreheaderRef" class="svg-layer"><SvgPreheader /></div>
              <div ref="svgHeaderRef" class="svg-layer"><SvgHeader /></div>
              <div ref="svgSubheaderRef" class="svg-layer"><SvgSubheader /></div>
              <div ref="svgButtonRef" class="svg-layer svg-layer--button"><SvgButton /></div>
            </div>
            <div ref="svgRightSideRef" class="svg-layer svg-layer--rightside">
              <SvgRightSide />
            </div>
          </div>
        </div>
      </template>
    </TwoColumnSection>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from "vue";
import { gsap } from "gsap"; // Import GSAP
import { getInitialConversation } from "@/data/chatSections";
import { HeroContent, getRandomHeroContent } from "@/data/heroContentData";
import { calculateContainerHeight } from "@/utils/containerHeightUtils";
import TextAnimation from "../text/TextAnimation.vue";
import TwoColumnSection from "@/components/sections/TwoColumnSection.vue";
import SvgBackground from "@/assets/svg/SvgBackground.vue";
import SvgLeftside from "@/assets/svg/SvgLeftside.vue";
import SvgSubheader from "@/assets/svg/SvgSubheader.vue";
import SvgNav from "@/assets/svg/SvgNav.vue";
import SvgPreheader from "@/assets/svg/SvgPreheader.vue";
import SvgRightSide from "@/assets/svg/SvgRightSide.vue";
import SvgButton from "@/assets/svg/SvgButton.vue";
import SvgHeader from "@/assets/svg/SvgHeader.vue";
import FullLayout from "@/assets/svg/FullLayout.vue";
import SvgNavPull from "@/assets/svg/SvgNavPull.vue"; // Import SvgNavPull

// --- Animation Configuration Object ---
const animationConfig = reactive({
  defaults: {
    ease: "power3.out",
    rotationY: -10, // Keep consistent rotation
  },
  background: {
    from: {
      opacity: 0,
      z: -50,
      filter: "drop-shadow(2px 4px 2px rgba(0,0,0,0))",
      scale: 1.8, // Add initial scale
    },
    to: {
      opacity: 1,
      z: 0,
      filter: "drop-shadow(8px 15px 10px rgba(0,0,0,0.3))",
      scale: 1, // Animate to default scale
    },
    duration: 1.2,
    startTime: 0,
  },
  nav: {
    from: {
      opacity: 0,
      z: -70,
      filter: "drop-shadow(1px 2px 1px rgba(0,0,0,0))",
      yPercent: 0,
      scale: 1.8, // Add initial scale
    },
    to: {
      opacity: 1,
      z: 55,
      filter: "drop-shadow(4px 8px 6px rgba(0,0,0,0.25))",
      yPercent: -38,
      scale: 1, // Animate to default scale
    },
    duration: 1.0,
    startTime: "<0.2",
  },
  leftSide: {
    from: {
      opacity: 0,
      z: -70,
      filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0))",
      yPercent: 1,
      xPercent: -25,
      scale: 1.8, // Add initial scale
    },
    to: {
      opacity: 1,
      z: 40,
      filter: "drop-shadow(3px 6px 4px rgba(0,0,0,0.2))",
      yPercent: 1,
      xPercent: -22,
      scale: 1, // Animate to default scale
    },
    duration: 0.9,
    startTime: "<0.2",
  },
  rightSide: {
    from: {
      opacity: 0,
      z: -70,
      filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0))",
      yPercent: 1,
      xPercent: 0,
      scale: 1.8, // Add initial scale
    },
    to: {
      opacity: 1,
      z: 55,
      filter: "drop-shadow(3px 6px 4px rgba(0,0,0,0.2))",
      yPercent: 1,
      xPercent: 25,
      scale: 1, // Animate to default scale
    },
    duration: 0.9,
    startTime: "<",
  },
  preheader: {
    from: {
      opacity: 0,
      z: -80,
      filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0))",
      yPercent: 0,
      xPercent: 0,
      scale: 1.8, // Add initial scale
    },
    to: {
      opacity: 1,
      z: 45,
      filter: "drop-shadow(2px 4px 3px rgba(0,0,0,0.15))",
      yPercent: -23,
      xPercent: 0,
      scale: 1, // Animate to default scale
    },
    duration: 0.8,
    startTime: "<0.2",
  },
  header: {
    from: {
      opacity: 0,
      z: -85,
      filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0))",
      yPercent: 0,
      xPercent: 0,
      scale: 1.8, // Add initial scale
    },
    to: {
      opacity: 1,
      z: 47,
      filter: "drop-shadow(2px 4px 3px rgba(0,0,0,0.18))",
      yPercent: -3,
      xPercent: 0,
      scale: 1, // Animate to default scale
    },
    duration: 0.7,
    startTime: "<0.2",
  },
  subheader: {
    from: {
      opacity: 0,
      z: -105,
      filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0))",
      yPercent: 0,
      xPercent: 0,
      scale: 1.8, // Add initial scale
    },
    to: {
      opacity: 1,
      z: 17,
      filter: "drop-shadow(2px 4px 3px rgba(0,0,0,0.18))",
      yPercent: 18,
      xPercent: 0,
      scale: 1, // Animate to default scale
    },
    duration: 0.6,
    startTime: "<0.2",
  },
  button: {
    from: {
      opacity: 0,
      z: -105,
      filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0))",
      yPercent: 0,
      xPercent: 0,
      scale: 1.8, // Add initial scale
    },
    to: {
      opacity: 1,
      z: 17,
      filter: "drop-shadow(2px 4px 3px rgba(0,0,0,0.18))",
      yPercent: 28,
      xPercent: -12,
      scale: 1, // Animate to default scale
    },
    duration: 0.5,
    startTime: "<0.2",
  }
  
  // Add subheader and button later if needed
});

// Define Refs for SVG wrappers
const svgBackgroundRef = ref<HTMLDivElement | null>(null);
const svgLeftsideRef = ref<HTMLDivElement | null>(null);
const svgSubheaderRef = ref<HTMLDivElement | null>(null);
const svgNavRef = ref<HTMLDivElement | null>(null);
const svgPreheaderRef = ref<HTMLDivElement | null>(null);
const svgRightSideRef = ref<HTMLDivElement | null>(null);
const svgButtonRef = ref<HTMLDivElement | null>(null);
const svgHeaderRef = ref<HTMLDivElement | null>(null);
const svgNavPullRef = ref<HTMLDivElement | null>(null); // Add ref for SvgNavPull

// Define props with defaults
const props = withDefaults(
  defineProps<{
    heroContent?: HeroContent;
    layout?: "content-left" | "content-right" | "content-top";
    sectionId?: string;
    debug?: boolean;
    customClass?: string;
    primaryCtaLink?: string;
    secondaryCtaLink?: string;
    secondaryCtaText?: string;
    messages?: any[];
  }>(),
  {
    heroContent: undefined,
    layout: "content-left",
    sectionId: "hero-section",
    debug: false,
    customClass: "dark-theme",
    primaryCtaLink: "#contact",
    secondaryCtaLink: "#services",
    secondaryCtaText: "Our Services",
    messages: undefined,
  }
);

// Use provided hero content or get random one
const heroContent = computed(() => props.heroContent || getRandomHeroContent());

// Use provided messages or get default ones
const heroMessages = computed(() => props.messages || getInitialConversation());

// Calculate container height based on message count
const calculateHeroContainerHeight = (messageCount: number) => {
  return calculateContainerHeight(messageCount, {
    baseHeight: 100, // Increased base height
    itemHeight: 30, // Increased item height
    padding: 150, // Increased padding
    heightMultiplier: 1.5, // Increased multiplier
  });
};

// Define emits
const emit = defineEmits<{
  (e: "mounted"): void;
}>();

// Emit mounted event and setup GSAP timeline
onMounted(() => {
  // Ensure refs are available before animating
  if (
    svgBackgroundRef.value &&
    svgNavRef.value &&
    svgLeftsideRef.value &&
    svgRightSideRef.value &&
    svgPreheaderRef.value &&
    svgHeaderRef.value &&
    svgSubheaderRef.value 
    // svgButtonRef.value
  ) {
    // Explicitly set initial states using GSAP
    gsap.set(svgBackgroundRef.value, { ...animationConfig.background.from, rotationY: animationConfig.defaults.rotationY });
    gsap.set(svgNavRef.value, { ...animationConfig.nav.from, rotationY: animationConfig.defaults.rotationY });
    gsap.set(svgLeftsideRef.value, { ...animationConfig.leftSide.from, rotationY: animationConfig.defaults.rotationY });
    gsap.set(svgRightSideRef.value, { ...animationConfig.rightSide.from, rotationY: animationConfig.defaults.rotationY });
    gsap.set(svgPreheaderRef.value, { ...animationConfig.preheader.from, rotationY: animationConfig.defaults.rotationY });
    gsap.set(svgHeaderRef.value, { ...animationConfig.header.from, rotationY: animationConfig.defaults.rotationY });
    gsap.set(svgSubheaderRef.value, { ...animationConfig.subheader.from, rotationY: animationConfig.defaults.rotationY });
    gsap.set(svgButtonRef.value, { ...animationConfig.button.from, rotationY: animationConfig.defaults.rotationY });

    // Initialize GSAP timeline
    const tl = gsap.timeline({ 
      defaults: { 
        ease: animationConfig.defaults.ease, 
        rotationY: animationConfig.defaults.rotationY 
      } 
    });

    // --- SVG Animation Sequence using Config ---
    // Animate SvgBackground
    tl.fromTo(
      svgBackgroundRef.value,
      animationConfig.background.from,
      { ...animationConfig.background.to, duration: animationConfig.background.duration },
      animationConfig.background.startTime
    );

    // Animate SvgNav
    tl.fromTo(
      svgNavRef.value,
      animationConfig.nav.from,
      { ...animationConfig.nav.to, duration: animationConfig.nav.duration },
      animationConfig.nav.startTime
    );

    // Animate SvgLeftside
    tl.fromTo(
      svgLeftsideRef.value,
      animationConfig.leftSide.from,
      { ...animationConfig.leftSide.to, duration: animationConfig.leftSide.duration },
      animationConfig.leftSide.startTime
    );

    // Animate SvgRightSide
    tl.fromTo(
      svgRightSideRef.value,
      animationConfig.rightSide.from,
      { ...animationConfig.rightSide.to, duration: animationConfig.rightSide.duration },
      animationConfig.rightSide.startTime
    );

    // Animate SvgPreheader (inside SvgLeftside)
    tl.fromTo(
      svgPreheaderRef.value,
      animationConfig.preheader.from,
      { ...animationConfig.preheader.to, duration: animationConfig.preheader.duration },
      animationConfig.preheader.startTime
    );

    // Animate SvgHeader (inside SvgLeftside)
    tl.fromTo(
      svgHeaderRef.value,
      animationConfig.header.from,
      { ...animationConfig.header.to, duration: animationConfig.header.duration },
      animationConfig.header.startTime
    );

    // Animate SvgSubheader (inside SvgLeftside)
    tl.fromTo(
      svgSubheaderRef.value,
      animationConfig.subheader.from,
      { ...animationConfig.subheader.to, duration: animationConfig.subheader.duration },
      animationConfig.subheader.startTime
      );

    // Animate SvgButton (inside SvgLeftside)
    tl.fromTo(
      svgButtonRef.value,
      animationConfig.button.from,
      { ...animationConfig.button.to, duration: animationConfig.button.duration },
      animationConfig.button.startTime
    );

    // Set initial state for SvgNav mask and pull graphic
    const navMaskRect = svgNavRef.value?.querySelector('.reveal-mask-rect');
    console.log('Found navMaskRect:', navMaskRect); // Debugging log
    gsap.set(svgNavPullRef.value, { opacity: 0, x: "0%" }); 
    if (navMaskRect) { 
      gsap.set(navMaskRect, { scaleX: 1, transformOrigin: 'right center' }); 
    }
    // Add initial states for other masks
    const leftSideMaskRect = svgLeftsideRef.value?.querySelector('.reveal-mask-rect');
    if (leftSideMaskRect) { gsap.set(leftSideMaskRect, { scaleX: 1, transformOrigin: 'right center' }); }
    const rightSideMaskRect = svgRightSideRef.value?.querySelector('.reveal-mask-rect');
    if (rightSideMaskRect) { gsap.set(rightSideMaskRect, { scaleX: 1, transformOrigin: 'right center' }); }
    const preheaderMaskRect = svgPreheaderRef.value?.querySelector('.reveal-mask-rect');
    if (preheaderMaskRect) { gsap.set(preheaderMaskRect, { scaleX: 1, transformOrigin: 'right center' }); }
    const headerMaskRect = svgHeaderRef.value?.querySelector('.reveal-mask-rect');
    if (headerMaskRect) { gsap.set(headerMaskRect, { scaleX: 1, transformOrigin: 'right center' }); }
    const subheaderMaskRect = svgSubheaderRef.value?.querySelector('.reveal-mask-rect');
    if (subheaderMaskRect) { gsap.set(subheaderMaskRect, { scaleX: 1, transformOrigin: 'right center' }); }
    const buttonMaskRect = svgButtonRef.value?.querySelector('.reveal-mask-rect');
    if (buttonMaskRect) { gsap.set(buttonMaskRect, { scaleX: 1, transformOrigin: 'right center' }); }

    // Animate SvgNav Mask Reveal and Pull Graphic (Moved to the end)
    /* Uncomment reveal animations */
    const revealDuration = 0.8;
    const revealEase = 'power2.inOut';

    if (navMaskRect && svgNavPullRef.value) {
      // Animate mask scaleX from 1 to 0 (reveals left-to-right)
      tl.to(navMaskRect, 
        { scaleX: 0, duration: revealDuration, ease: revealEase }, 
        ">+=0.1" // Start 0.1s AFTER main sequence ends
      );
      // Animate pull graphic simultaneously - COMMENTED OUT FOR NOW
      // tl.to(svgNavPullRef.value, { 
      //   opacity: 1, 
      //   x: "100%", 
      //   duration: revealDuration, 
      //   ease: revealEase 
      // }, "<"); 
    }

    // Add other mask animations
    if (leftSideMaskRect) {
      tl.to(leftSideMaskRect, { scaleX: 0, duration: revealDuration, ease: revealEase }, "<");
    }
    if (rightSideMaskRect) {
      tl.to(rightSideMaskRect, { scaleX: 0, duration: revealDuration, ease: revealEase }, "<");
    }
    if (preheaderMaskRect) {
      tl.to(preheaderMaskRect, { scaleX: 0, duration: revealDuration, ease: revealEase }, "<");
    }
    if (headerMaskRect) {
      tl.to(headerMaskRect, { scaleX: 0, duration: revealDuration, ease: revealEase }, "<");
    }
    if (subheaderMaskRect) {
      tl.to(subheaderMaskRect, { scaleX: 0, duration: revealDuration, ease: revealEase }, "<");
    }
    if (buttonMaskRect) {
      tl.to(buttonMaskRect, { scaleX: 0, duration: revealDuration, ease: revealEase }, "<");
    }
    
    /* End uncomment */

    // Slow down the animation for debugging
    tl.timeScale(0.2); // Restore slow speed

    // --- Add Subheader and Button Animations Here using config if re-enabled ---
    /*
    // Example for Subheader (if re-enabled)
    if (svgSubheaderRef.value) {
      tl.fromTo(
        svgSubheaderRef.value,
        animationConfig.subheader.from,
        animationConfig.subheader.to,
        animationConfig.subheader.startTime
      ).duration(animationConfig.subheader.duration);
    }

    // Example for Button (if re-enabled)
    if (svgButtonRef.value) {
      tl.fromTo(
        svgButtonRef.value,
        animationConfig.button.from,
        animationConfig.button.to,
        animationConfig.button.startTime
      ).duration(animationConfig.button.duration);
    }
    */

    // --- Old constant-based animations (to be removed) ---
    /*
    const rotationValue = -10; // Keep rotation constant
    const bgInitialZ = -50;
    const bgFinalZ = 0;
    const bgShadowStart = "drop-shadow(2px 4px 2px rgba(0,0,0,0))";
    const bgShadowEnd = "drop-shadow(8px 15px 10px rgba(0,0,0,0.3))";
    tl.fromTo(...);
    const navInitialZ = -70;
    const navFinalZ = 20;
    const navShadowStart = "drop-shadow(1px 2px 1px rgba(0,0,0,0))";
    const navShadowEnd = "drop-shadow(4px 8px 6px rgba(0,0,0,0.25))";
    const navYPercent = -24;
    tl.fromTo(...);
    const sideInitialZ = -90; // Start further back
    const sideFinalZ = 10;   // End slightly behind nav
    const sideShadowStart = "drop-shadow(1px 1px 1px rgba(0,0,0,0))";
    const sideShadowEnd = "drop-shadow(3px 6px 4px rgba(0,0,0,0.2))";
    const sideYPercent = 1;  // Position below nav
    const sideXPercent = -25; // Increased magnitude for more separation
    const sideDuration = 0.9;
    const sideStartTime = "+=0.2"; // Start after nav starts animating
    tl.fromTo(svgLeftsideRef.value, ...);
    tl.fromTo(svgRightSideRef.value, ...);
    const preheaderInitialZ = sideInitialZ - 10; 
    const preheaderFinalZ = sideFinalZ + 5;   
    const preheaderShadowStart = "drop-shadow(1px 1px 1px rgba(0,0,0,0))";
    const preheaderShadowEnd = "drop-shadow(2px 4px 3px rgba(0,0,0,0.15))";
    const preheaderYPercent = 0; 
    const preheaderXPercent = 0; 
    const preheaderDuration = 0.8;
    const preheaderStartTime = sideStartTime + 0.1; 
    tl.fromTo(svgPreheaderRef.value, ...);
    const headerInitialZ = preheaderInitialZ - 5; 
    const headerFinalZ = preheaderFinalZ + 2;   
    const headerShadowStart = "drop-shadow(1px 1px 1px rgba(0,0,0,0))";
    const headerShadowEnd = "drop-shadow(2px 4px 3px rgba(0,0,0,0.18))";
    const headerYPercent = 0; 
    const headerXPercent = 0; 
    const headerDuration = 0.7;
    const headerStartTime = preheaderStartTime + 0.1; 
    tl.fromTo(svgHeaderRef.value, ...);
    const subheaderInitialZ = headerInitialZ - 5; 
    const subheaderFinalZ = headerFinalZ + 2;   
    const subheaderShadowStart = "drop-shadow(1px 1px 1px rgba(0,0,0,0))";
    const subheaderShadowEnd = "drop-shadow(2px 4px 3px rgba(0,0,0,0.21))";
    const subheaderYPercent = 0; 
    const subheaderXPercent = 0; 
    const subheaderDuration = 0.6;
    const subheaderStartTime = headerStartTime + 0.1; 
    tl.fromTo(svgSubheaderRef.value, ...);
    const buttonInitialZ = subheaderInitialZ - 5; 
    const buttonFinalZ = subheaderFinalZ + 2;   
    const buttonShadowStart = "drop-shadow(1px 1px 1px rgba(0,0,0,0))";
    const buttonShadowEnd = "drop-shadow(2px 4px 3px rgba(0,0,0,0.24))";
    const buttonYPercent = 0; 
    const buttonXPercent = 0; 
    const buttonDuration = 0.5;
    const buttonStartTime = subheaderStartTime + 0.1; 
    tl.fromTo(svgButtonRef.value, ...);
    */
  } else {
    console.error("GSAP Animation Error: One or more required SVG refs not found on mount.");
  }

  emit("mounted"); // Emit mounted after setup
});
</script>

<style lang="scss" scoped>
.hero-section-chat {
  height: 100vh;
  width: 100%;
  display: flex; /* Keep flex for potential future use, but remove alignment */
  /* align-items: center; */ /* REMOVE THIS */
  position: relative;
  z-index: 1;
  perspective: 1000px; /* Add perspective for 3D children */

  :deep(.heading--accent) {
    position: relative;
    z-index: 10;
    transform: translateZ(20px); /* Bring text forward */
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
  }

  :deep(.heading--highlight) {
    position: relative;
    z-index: 10;
    transform: translateZ(20px); /* Bring text forward */
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2); /* Subtle shadow for depth */
  }

  :deep(.content-area) {
    position: relative;
    z-index: 10;

    /* Ensure text within the left column wraps */
    h1.heading--accent,
    p.heading--highlight {
      // word-wrap: break-word; /* Legacy */
      // overflow-wrap: break-word; /* Standard */
      white-space: normal; /* Ensure it's not set to nowrap */
      // hyphens: auto; /* Optional: improve wrapping appearance */
    }
  }
}

.right-content-placeholder {
  position: absolute;
  top: 50%; /* Position top edge at vertical center */
  right: 5%; /* Adjust horizontal position as needed */
  width: 50vw; /* Match SvgBackground width relative to viewport */
  height: calc(50vw * 1024 / 1440); /* Maintain SvgBackground aspect ratio */
  transform: translateY(-50%); /* Shift up by half its height for true centering */
  
  /* Keep perspective for 3D */
  perspective: 1000px;
  
  /* Remove old properties */
  /* z-index: -1; */
  /* min-height: 400px; */
  /* display: flex; */
  /* align-items: center; */
  /* justify-content: center; */
  overflow: visible; /* Still allow potential overflow from transforms */
}

.svg-animation-container {
  position: relative;
  width: 100%; /* Fill the absolutely positioned placeholder */
  height: 100%; /* Fill the absolutely positioned placeholder */
  transform-style: preserve-3d;
  /* z-index: -10; */ /* REMOVE THIS */
  /* Add a mask to fade in from the left */
  // -webkit-mask-image: linear-gradient(to right, transparent 0%, #1A1B26 30%);
  /* Adjust transparency start/end points (e.g., black 50%) as needed */
  
  /* Scale up and shift */
  // transform: scale(1.4) translateX(-18%);
  transform: scale(1.1) translateX(-18%) translateY(-50px)
  
  /* Adjust scale(1.x) and translateX(y%) as needed */
}

.svg-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* opacity: 0; */ /* REMOVE THIS - Let GSAP handle initial state */
  /* Start hidden */
  pointer-events: none;
  /* Prevent layers from blocking interactions unless needed */

  /* Optional: Center SVG within the layer */
  display: flex;
  align-items: center;
  justify-content: center;
  /* z-index: -10; */ /* REMOVE THIS */

  /* Base style for contained SVGs */
  > :deep(svg) {
    /* Remove max-width/max-height to allow viewport sizing */
    /* max-width: 100%; */
    /* max-height: 100%; */
    object-fit: contain; /* Keep this for aspect ratio */
    height: auto; /* Ensure height scales with width */
  }

  transform-origin: center center;
  /* Ensure rotation happens around the center */
}

/* Specific sizing for inner SVGs via CSS using viewport width */
.svg-layer--background :deep(svg) {
  width: 50vw; /* Example: 50% of viewport width */
  /* z-index: -10; */ /* REMOVE THIS */
}

.svg-layer--nav {
  position: relative; /* Make this the positioning context for children */
}

.svg-layer--nav :deep(svg) {
  width: 45vw; /* Example: ~75% of 50vw */
}

.svg-layer--leftside :deep(svg),
.svg-layer--rightside :deep(svg) {
  width: 20vw; /* Example: ~40% of 50vw */
}

.svg-layer--button :deep(svg) {
  width: 8vw; /* Adjust as needed */
  height: 8vw;
}

.svg-pull-graphic {
  /* Inherits position:absolute from .svg-layer */
  /* Positioned relative to .svg-layer--nav now */
  display: flex;
  align-items: center;
  justify-content: flex-start; /* Align icon to the start (left) */
  left: 26px;
  top: 1px;
  /* transform: translateX(-100%); */ /* GSAP handles initial transform */
  /* width: auto; */ /* REMOVE - Inherit width: 100% from .svg-layer */
  height: 100%; 
  pointer-events: none; 
}

.svg-pull-graphic :deep(svg) {
  width: 3.4vw; /* Width relative to main nav size */
  height: auto; /* Maintain aspect ratio */
}
</style>
