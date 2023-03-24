import '@next/core/dist/style.css'
import App from './App.vue'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia).mount('#app')
