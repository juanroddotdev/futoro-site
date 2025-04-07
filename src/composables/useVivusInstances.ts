import Vivus from 'vivus'
import { ref } from 'vue'

interface VivusOptions {
  duration: number
  type: 'delayed' | 'sync' | 'oneByOne' | 'script' | 'scenario' | 'scenario-sync'
  start: 'manual' | 'autostart' | 'inViewport'
  onReady?: () => void
  onStart?: () => void
  onComplete?: () => void
}

export function useVivusInstances() {
  const instances = ref<Vivus[]>([])

  const createVivusInstance = (element: SVGElement, options: VivusOptions) => {
    const vivus = new Vivus(element as unknown as HTMLElement, options)
    instances.value.push(vivus)
    return vivus
  }

  return {
    instances,
    createVivusInstance
  }
} 