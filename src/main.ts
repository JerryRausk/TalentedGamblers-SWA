import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { authGuard } from '@auth0/auth0-vue';
import DashboardView from './components/DashboardView.vue';
import ProfileView from './components/ProfileView.vue';
import { createWebHashHistory, createRouter, RouteRecordRaw } from "vue-router";
import LeagueAdminView from './views/leagueAdminView.vue';
import { createPinia } from 'pinia'
import {auth0} from "./auth0.js"
import siteAdminView from './views/siteAdminView.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', component: DashboardView },
  { path: '/profile', component: ProfileView, beforeEnter: authGuard },
  { path: '/leagueAdmin', component: LeagueAdminView, beforeEnter: authGuard },
  { path: '/siteAdmin', component: siteAdminView, beforeEnter: authGuard }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes, 
})

const pinia = createPinia()
  
createApp(App).use(pinia).use(auth0).use(router).mount('#app')
