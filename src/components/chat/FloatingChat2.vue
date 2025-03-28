<template>
  <div ref="containerRef" class="chat-container" :id="sectionId">
    <div ref="messagesRef" class="messages-wrapper">
      <div class="messages-container">
        <div 
          v-for="(message, idx) in messages" 
          :key="`message-${idx}`"
          :class="['message-group', `message-group-${idx + 1}`, message.type]"
          :data-index="idx"
        >
          <div class="message-content">{{ message.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Message {
  text: string
  type: 'sent' | 'received'
}

interface Props {
  messages: Message[]
  sectionId: string
}

const props = defineProps<Props>()
const containerRef = ref<HTMLElement | null>(null)
const messagesRef = ref<HTMLElement | null>(null)
const scrollTriggerInstance = ref<ScrollTrigger | null>(null)

const initializeAnimation = () => {
  const container = containerRef.value
  if (!container) return

  // First, set initial state
  const messageGroups = container.querySelectorAll('.message-group')
  const messages = Array.from(messageGroups)
  
  // Set initial state
  gsap.set(messages, {
    autoAlpha: 0,
    y: 50
  })

  // Create ScrollTrigger
  scrollTriggerInstance.value = ScrollTrigger.create({
    trigger: container,
    start: 'top 80%',
    end: 'bottom 20%',
    markers: true,
    onEnter: () => {
      console.log('Trigger entered')
      gsap.to(messages, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.15,
        ease: 'back.out(1.2)',
        clearProps: 'transform'
      })
    },
    onLeaveBack: () => {
      console.log('Trigger left backwards')
      gsap.to(messages, {
        autoAlpha: 0,
        y: 50,
        duration: 0.3,
        stagger: 0.1,
        ease: 'power2.in'
      })
    }
  })
}

onMounted(() => {
  // Hide messages immediately
  const container = containerRef.value
  if (container) {
    const messages = container.querySelectorAll('.message-group')
    gsap.set(messages, { autoAlpha: 0, y: 50 })
  }
  
  // Initialize animation after a brief delay
  setTimeout(() => {
    initializeAnimation()
  }, 100)
})

onBeforeUnmount(() => {
  if (scrollTriggerInstance.value) {
    scrollTriggerInstance.value.kill()
  }
})
</script>

<style lang="scss" scoped>
.chat-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  min-height: 600px;
}

.messages-wrapper {
  position: relative;
  width: 100%;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}

.message-group {
  visibility: hidden; /* Initial state */
  padding: 12px 20px;
  border-radius: 16px;
  max-width: 80%;
  
  &.sent {
    margin-left: auto;
    background-color: rgba(144, 202, 249, 0.2);
  }
  
  &.received {
    margin-right: auto;
    background-color: rgba(129, 199, 132, 0.2);
  }
}

.message-content {
  color: white;
  font-size: 1rem;
  line-height: 1.5;
}
</style> 