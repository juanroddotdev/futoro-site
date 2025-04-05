import { ref } from 'vue'
import gsap from 'gsap'

interface AnimationState {
  isAnimating: boolean
  startTime: number | null
  isTransitioning: boolean
  spotlightProgress: number
}

export function useAnimationState() {
  const state = ref<AnimationState>({
    isAnimating: false,
    startTime: null,
    isTransitioning: false,
    spotlightProgress: 0
  })

  const startAnimation = () => {
    state.value.isAnimating = true
    state.value.startTime = Date.now()
  }

  const stopAnimation = () => {
    state.value.isAnimating = false
    state.value.startTime = null
  }

  const startTransition = () => {
    state.value.isTransitioning = true
  }

  const handleLTRStart = () => {
    state.value.startTime = Date.now()
  }

  const handleLTRUpdate = (progress: number) => {
    state.value.spotlightProgress = progress
  }

  const getAnimationDuration = () => {
    if (!state.value.startTime) return 0
    return Date.now() - state.value.startTime
  }

  return {
    state,
    startAnimation,
    stopAnimation,
    startTransition,
    handleLTRStart,
    handleLTRUpdate,
    getAnimationDuration
  }
} 