import { App } from 'vue'
import GridPaperOverlay from '@/components/ui/backgrounds/GridPaperOverlay.vue'
import AnimatedText from '@/components/text/AnimatedText.vue'

export default {
  install: (app: App) => {
    // Register global components
    app.component('GridPaperOverlay', GridPaperOverlay)
    app.component('AnimatedText', AnimatedText)
    
    // Add more global components here
  }
}
