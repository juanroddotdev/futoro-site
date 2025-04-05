import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import type { Ref } from 'vue'
import type Vivus from 'vivus'

gsap.registerPlugin(MotionPathPlugin)

interface VivusInstances {
  navbar?: Vivus
  headline?: Vivus
  subheadline?: Vivus
}

export function useAnimationTimelines() {
  const createNavbarTimeline = (
    startTime: number,
    paths: SVGPathElement[],
    pencilDot: SVGElement,
    animatePencilAlongPath: (path: SVGPathElement, dot: SVGElement) => void,
    onComplete: () => void
  ) => {
    const tl = gsap.timeline({
      onComplete
    })

    paths.forEach((path, index) => {
      const start = Number(path.getAttribute('data-start')) || 0
      const duration = Number(path.getAttribute('data-duration')) || 200

      tl.to(path, {
        duration: duration / 1000,
        strokeDashoffset: 0,
        ease: 'none',
        onStart: () => {
          path.style.visibility = 'visible'
          animatePencilAlongPath(path, pencilDot)
        }
      }, start / 1000)
    })

    return tl
  }

  const createHeadlineTimeline = (
    vivus: Vivus,
    path: SVGPathElement,
    pencilDot: SVGElement,
    startTime: number,
    animatePencilAlongPath: (path: SVGPathElement, dot: SVGElement) => void
  ) => {
    const tl = gsap.timeline()

    tl.to(path, {
      duration: 0.3,
      strokeDashoffset: 0,
      ease: 'none',
      onStart: () => {
        path.style.visibility = 'visible'
        animatePencilAlongPath(path, pencilDot)
      }
    })

    return tl
  }

  const createSubheadlineTimeline = (
    vivus: Vivus,
    path: SVGPathElement,
    pencilDot: SVGElement,
    startTime: number,
    animatePencilAlongPath: (path: SVGPathElement, dot: SVGElement) => void
  ) => {
    const tl = gsap.timeline()

    tl.to(path, {
      duration: 0.3,
      strokeDashoffset: 0,
      ease: 'none',
      onStart: () => {
        path.style.visibility = 'visible'
        animatePencilAlongPath(path, pencilDot)
      }
    })

    return tl
  }

  return {
    createNavbarTimeline,
    createHeadlineTimeline,
    createSubheadlineTimeline
  }
} 