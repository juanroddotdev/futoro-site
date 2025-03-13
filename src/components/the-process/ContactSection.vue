<script setup lang="ts">
import { onMounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const email = 'juan@juanrod.dev';

onMounted(() => {
  const content = document.querySelector('.contact-process__content');
  
  // Set initial state of content
  gsap.set(content, { opacity: 0, y: 50 });

  // Create scroll trigger for content fade in
  gsap.to(content, {
    scrollTrigger: {
      trigger: '.contact-process',
      start: 'top center',
      toggleActions: 'play none none reverse'
    },
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power2.out'
  });
});
</script>

<template>
  <section class="contact-process">
    <!-- Animated background shapes -->
    <div class="contact-process__background">
      <div class="shape shape--1"></div>
      <div class="shape shape--2"></div>
      <div class="shape shape--3"></div>
    </div>

    <div class="contact-process__content">
      <h2 class="contact-process__heading">
        Let's create something
        <span class="gradient-text">extraordinary</span>
        together
      </h2>
      
      <p class="contact-process__subheading">
        Ready to transform your digital presence? Let's start a conversation about your next project.
      </p>
      
      <div class="contact-process__cta">
        <a 
          :href="`mailto:${email}`" 
          class="contact-process__email"
        >
          {{ email }}
        </a>
        
        <div class="contact-process__buttons">
          <a 
            :href="`mailto:${email}`" 
            class="contact-process__button contact-process__button--primary"
          >
            Start Your Project
          </a>
          
          <a 
            :href="`mailto:${email}?subject=Quick Question`" 
            class="contact-process__button contact-process__button--secondary"
          >
            Ask a Question
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.contact-process {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  // Modern gradient background
  background: linear-gradient(
    135deg,
    #4F46E5 0%,    // Indigo
    #7C3AED 50%,   // Purple
    #EC4899 100%   // Pink
  );

  &__background {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;

    .shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      filter: blur(60px);
      animation: float 20s infinite;

      &--1 {
        width: 400px;
        height: 400px;
        top: -100px;
        left: -100px;
        animation-delay: 0s;
      }

      &--2 {
        width: 300px;
        height: 300px;
        top: 50%;
        right: -50px;
        animation-delay: -5s;
      }

      &--3 {
        width: 250px;
        height: 250px;
        bottom: -50px;
        left: 30%;
        animation-delay: -10s;
      }
    }
  }

  &__content {
    position: relative;
    z-index: 1;
    max-width: 90rem;
    width: 100%;
    text-align: center;
    padding: 0 2rem;
  }

  &__heading {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 4rem;
    font-weight: 700;
    color: white;
    margin-bottom: 1.5rem;
    line-height: 1.2;

    .gradient-text {
      background: linear-gradient(to right, #FDE68A, #FCA5A5);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      position: relative;
      display: inline-block;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(to right, #FDE68A, #FCA5A5);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.3s ease;
      }

      &:hover::after {
        transform: scaleX(1);
      }
    }
  }

  &__subheading {
    font-family: 'Raleway', sans-serif;
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 3rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  &__email {
    display: block;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.5rem;
    color: white;
    margin-bottom: 2rem;
    transition: all 0.3s ease;
    
    &:hover {
      color: rgba(255, 255, 255, 0.8);
      transform: translateY(-2px);
    }
  }

  &__buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  &__button {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 600;
    padding: 1rem 2rem;
    border-radius: 0.75rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    
    &--primary {
      background: white;
      color: #4F46E5;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
      }
    }
    
    &--secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-2px);
      }
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: 0.5s;
    }

    &:hover::before {
      left: 100%;
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(10px, -10px);
  }
  50% {
    transform: translate(-5px, 5px);
  }
  75% {
    transform: translate(-10px, -5px);
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .contact-process {
    &__heading {
      font-size: 2.5rem;
    }

    &__subheading {
      font-size: 1rem;
    }

    &__email {
      font-size: 1.25rem;
    }

    &__buttons {
      flex-direction: column;
    }

    &__button {
      width: 100%;
    }
  }
}
</style>