import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { authGuard } from '@auth0/auth0-vue';
import DashboardView from './components/DashboardView.vue';
import ProfileView from './components/ProfileView.vue';
import { createWebHashHistory, createRouter, RouteRecordRaw } from "vue-router";
import LeagueView from './components/leagueView.vue';
import { createPinia } from 'pinia'
import {auth0} from "./auth0.js"

const routes: RouteRecordRaw[] = [
  { path: '/', component: DashboardView },
  { path: '/profile', component: ProfileView, beforeEnter: authGuard },
  { path: '/league', component: LeagueView, beforeEnter: authGuard }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes, 
})

const pinia = createPinia()
  
createApp(App).use(pinia).use(auth0).use(router).mount('#app')
