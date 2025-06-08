import { createApp } from 'vue'
import './style.css'
import './assets/main.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { vuetify } from './plugins/vuetify'
import router from './router'
import './assets/tailwind.css'
import '@fontsource/roboto/latin.css'
import '@fontsource/prompt/thai.css'
import '@mdi/font/css/materialdesignicons.min.css'

const app = createApp(App)
app.use(createPinia())
app.use(vuetify)
app.use(router)
// app.use(createRouter({
//   history: createWebHistory(),
//   routes
// }))
app.mount('#app')
