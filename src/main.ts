
import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'

import globalComponents from './plugins/globalComponents'

const app = createApp(App)

// Register AnimatedText as a global component
// Use the global components plugin
app.use(globalComponents)

app.mount('#app')
