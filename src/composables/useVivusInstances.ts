import { ref } from 'vue'
import Vivus from 'vivus'

interface VivusInstances {
  navbar: Vivus | null
  headline: Vivus | null
  subheadline: Vivus | null
  finalHeadline: Vivus | null
  finalSubheadline: Vivus | null
}

export function useVivusInstances() {
  const instances = ref<VivusInstances>({
    navbar: null,
    headline: null,
    subheadline: null,
    finalHeadline: null,
    finalSubheadline: null
  })

  const createVivusInstance = (
    element: SVGElement,
    options: Vivus.VivusOptions
  ) => {
    return new Vivus(element as unknown as HTMLElement, options)
  }

  return {
    instances,
    createVivusInstance
  }
} 