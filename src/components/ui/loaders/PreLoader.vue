<template>
  <div class="mil-preloader" :class="{ 'mil-hidden': isHidden }">
    <div class="mil-preloader-animation">
      <div class="mil-pos-abs">
        <div class="mil-animation-1">
          <h3 class="mil-h3">Loading</h3>
          <h3 class="mil-h3">Please wait</h3>
        </div>
        <div class="mil-reveal-box"></div>
        <div class="mil-animation-2">
          <h3 class="mil-h3">Welcome</h3>
          <h3 class="mil-h3">to our site</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

export default {
  name: 'Preloader',
  setup() {
    const isHidden = ref(false)
    const timeline = ref(null)

    onMounted(() => {
      timeline.value = gsap.timeline()

      // Preloader animation sequence
      timeline.value
        .to('.mil-preloader-animation', {
          opacity: 1,
        })
        .fromTo(
          '.mil-animation-1 .mil-h3',
          {
            y: '30px',
            opacity: 0,
          },
          {
            y: '0px',
            opacity: 1,
            stagger: 0.4,
          }
        )
        .to(
          '.mil-animation-1 .mil-h3',
          {
            opacity: 0,
            y: '-30',
          },
          '+=.3'
        )
        .fromTo(
          '.mil-reveal-box',
          0.1,
          {
            opacity: 0,
          },
          {
            opacity: 1,
            x: '-30',
          }
        )
        .to(
          '.mil-reveal-box',
          0.45,
          {
            width: '100%',
            x: 0,
          },
          '+=.1'
        )
        .to('.mil-reveal-box', {
          right: '0',
        })
        .to('.mil-reveal-box', 0.3, {
          width: '0%',
        })
        .fromTo(
          '.mil-animation-2 .mil-h3',
          {
            opacity: 0,
          },
          {
            opacity: 1,
          },
          '-=.5'
        )
        .to(
          '.mil-animation-2 .mil-h3',
          0.6,
          {
            opacity: 0,
            y: '-30',
          },
          '+=.5'
        )
        .to(
          '.mil-preloader',
          0.8,
          {
            opacity: 0,
            ease: 'sine',
          },
          '+=.2'
        )
        .fromTo(
          '.mil-up',
          0.8,
          {
            opacity: 0,
            y: 40,
            scale: 0.98,
            ease: 'sine',
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            onComplete: () => {
              isHidden.value = true
            },
          },
          '-=1'
        )
    })

    return {
      isHidden
    }
  }
}
</script>

<style scoped>
.mil-preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.mil-preloader.mil-hidden {
  opacity: 0;
  pointer-events: none;
}

.mil-preloader-animation {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
}

.mil-pos-abs {
  position: absolute;
  width: 100%;
  text-align: center;
}

.mil-h3 {
  font-family: 'Outfit', sans-serif;
  font-size: 42px;
  color: #000;
  font-weight: 500;
  line-height: 120%;
  margin: 0;
}

.mil-reveal-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: #000;
  transform-origin: left;
}

.mil-animation-1,
.mil-animation-2 {
  position: relative;
  z-index: 1;
}

@media screen and (max-width: 768px) {
  .mil-h3 {
    font-size: 30px;
  }
}
</style> 