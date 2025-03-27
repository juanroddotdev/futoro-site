
import { createApp } from 'vue'
import './scss/main.scss'
import AppWithRouter from './AppWithRouter.vue'
import router from './router'
import globalComponents from './plugins/globalComponents'

const app = createApp(AppWithRouter)

// Register global components
app.use(globalComponents)
// Use the router
app.use(router)

app.mount('#app')
