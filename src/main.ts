import { createApp } from 'vue'
import './scss/main.scss'
import AppWithRouter from './AppWithRouter.vue'
import router from './router'
import globalComponents from './plugins/globalComponents'
import vivusPlugin from './plugins/vivus'

const app = createApp(AppWithRouter)

// Register global components
app.use(globalComponents)
// Use the router
app.use(router)
// Register Vivus plugin
app.use(vivusPlugin)

app.mount('#app')
