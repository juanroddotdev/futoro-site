import { App } from 'vue'
import PaperGridBackground from '@/components/ui/backgrounds/PaperGridBackground.vue'
import TextAnimation from '@/components/text/TextAnimation.vue'

export default {
  install: (app: App) => {
    // Register global components
    app.component('PaperGridBackground', PaperGridBackground)
    app.component('TextAnimation', TextAnimation)
    
    // Add more global components here
  }
}
