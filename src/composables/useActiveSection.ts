import { ref, onMounted, onUnmounted } from 'vue'

export const useActiveSection = () => {
  const activeSection = ref<string>('hero')
  
  const sectionStyles = {
    hero: {
      background: 'transparent',
      textColor: 'text-white',
      border: 'border-transparent',
    },
    about: {
      background: 'bg-white/90',
      textColor: 'text-slate-800',
      border: 'border-slate-200',
    },
    services: {
      background: 'bg-slate-900/90',
      textColor: 'text-white',
      border: 'border-slate-700',
    },
    timeline: {
      background: 'bg-white/90',
      textColor: 'text-slate-800',
      border: 'border-slate-200',
    },
    contact: {
      background: 'bg-slate-900/90',
      textColor: 'text-white',
      border: 'border-slate-700',
    }
  }

  const observerCallback: IntersectionObserverCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        activeSection.value = entry.target.id
      }
    })
  }

  let observer: IntersectionObserver

  onMounted(() => {
    observer = new IntersectionObserver(observerCallback, {
      threshold: [0.5],
      rootMargin: '-50% 0px -50% 0px'
    })

    // Observe all sections
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section)
    })
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    activeSection,
    sectionStyles
  }
}