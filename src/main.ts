
import { createApp } from 'vue'
// import './style.scss'
import App from './App.vue'
import router from './router'
import './scss/main.scss'
import AnimatedText from '@/components/export-to-main/animatedText/AnimatedText.vue'

const app = createApp(App)

// Register AnimatedText as a global component
app.component('AnimatedText', AnimatedText)
app.use(router)
app.mount('#app')
