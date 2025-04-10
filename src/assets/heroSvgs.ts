import { defineComponent, h } from 'vue'

// Define SVG components
export const HeroDecoration1 = defineComponent({
  name: 'HeroDecoration1',
  render() {
    return h('svg', {
      viewBox: '0 0 100 100',
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'hero-decoration-1'
    }, [
      h('path', {
        d: 'M10,50 Q30,10 50,50 T90,50',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2'
      })
    ])
  }
})

export const HeroDecoration2 = defineComponent({
  name: 'HeroDecoration2',
  render() {
    return h('svg', {
      viewBox: '0 0 100 100',
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'hero-decoration-2'
    }, [
      h('circle', {
        cx: '50',
        cy: '50',
        r: '40',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2'
      })
    ])
  }
})

// Add more SVG components as needed
export const HeroDecoration3 = defineComponent({
  name: 'HeroDecoration3',
  render() {
    return h('svg', {
      viewBox: '0 0 100 100',
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'hero-decoration-3'
    }, [
      h('rect', {
        x: '20',
        y: '20',
        width: '60',
        height: '60',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': '2',
        transform: 'rotate(45, 50, 50)'
      })
    ])
  }
})

// Export all components as a single object for convenience
export const HeroSvgs = {
  HeroDecoration1,
  HeroDecoration2,
  HeroDecoration3
} 
