import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import Home from './components/Home.vue'
import NewGame from './components/NewGame.vue'
import JoinGame from './components/JoinGame.vue'
import PlayGame from './components/PlayGame.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

const routes = [
  { path: '/', component: Home },
  { path: '/game/new', component: NewGame },
  { path: '/game/join', component: JoinGame },
  { path: '/game/join/:code', component: JoinGame },
  { path: '/game/play/:code', component: PlayGame },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')