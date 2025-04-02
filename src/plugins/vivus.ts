import type { App } from 'vue'
import Vivus from 'vivus'

export default {
  install: (app: App) => {
    app.config.globalProperties.$vivus = Vivus
    console.log('[VivusPlugin] Installed')
  }
} 