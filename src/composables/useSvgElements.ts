import { ref } from 'vue'

interface SvgElements {
  navbar: {
    svg: SVGElement | null
    paths: SVGPathElement[]
    pencilDot: SVGElement | null
  }
  headline: {
    svg: SVGElement | null
    path: SVGPathElement | null
    pencilDot: SVGElement | null
  }
  subheadline: {
    svg: SVGElement | null
    path: SVGPathElement | null
    pencilDot: SVGElement | null
  }
}

export function useSvgElements() {
  const elements = ref<SvgElements>({
    navbar: {
      svg: null,
      paths: [],
      pencilDot: null
    },
    headline: {
      svg: null,
      path: null,
      pencilDot: null
    },
    subheadline: {
      svg: null,
      path: null,
      pencilDot: null
    }
  })

  const initializeElements = () => {
    // Initialize navbar elements
    const navbarSvg = document.getElementById('navbar-svg')
    if (navbarSvg instanceof SVGElement) {
      elements.value.navbar.svg = navbarSvg
    }
    elements.value.navbar.paths = Array.from(document.querySelectorAll('#navbar-svg path')).filter((el): el is SVGPathElement => el instanceof SVGPathElement)
    const pencilDot = document.querySelector('#navbar-svg .pencil-dot')
    if (pencilDot instanceof SVGElement) {
      elements.value.navbar.pencilDot = pencilDot
    }
    // Initialize headline elements
    const headlineSvg = document.getElementById('headline-svg')
    if (headlineSvg instanceof SVGElement) {
      elements.value.headline.svg = headlineSvg
    }
    const headlinePath = document.querySelector('#headline-svg .headline-line-1')
    if (headlinePath instanceof SVGPathElement) {
      elements.value.headline.path = headlinePath
    }
    const headlinePencilDot = document.querySelector('#headline-svg .headline-pencil-dot')
    if (headlinePencilDot instanceof SVGElement) {
      elements.value.headline.pencilDot = headlinePencilDot
    }
    // Initialize subheadline elements
    const subheadlineSvg = document.getElementById('subheadline-svg')
    if (subheadlineSvg instanceof SVGElement) {
      elements.value.subheadline.svg = subheadlineSvg
    }
    const subheadlinePath = document.querySelector('#subheadline-svg .sub-headline-line')
    if (subheadlinePath instanceof SVGPathElement) {
      elements.value.subheadline.path = subheadlinePath
    }
    const subheadlinePencilDot = document.querySelector('#subheadline-svg .subheadline-pencil-dot')
    if (subheadlinePencilDot instanceof SVGElement) {
      elements.value.subheadline.pencilDot = subheadlinePencilDot
    }
  }

  const hideAllPaths = () => {
    const allPaths = document.querySelectorAll('path')
    allPaths.forEach(path => {
      path.style.visibility = 'hidden'
    })
  }

  const showAllPaths = () => {
    const allPaths = document.querySelectorAll('path')
    allPaths.forEach(path => {
      path.style.visibility = 'visible'
    })
  }

  const validateElements = () => {
    return (
      elements.value.navbar.svg &&
      elements.value.navbar.paths.length > 0 &&
      elements.value.navbar.pencilDot &&
      elements.value.headline.svg &&
      elements.value.headline.path &&
      elements.value.headline.pencilDot &&
      elements.value.subheadline.svg &&
      elements.value.subheadline.path &&
      elements.value.subheadline.pencilDot
    )
  }

  return {
    elements,
    initializeElements,
    hideAllPaths,
    showAllPaths,
    validateElements
  }
} 