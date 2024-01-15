import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { authGuard } from '@auth0/auth0-vue';
import DashboardView from './views/DashboardView.vue';
import ProfileView from "./views/ProfileView.vue";
import { createWebHashHistory, createRouter, RouteRecordRaw } from "vue-router";
import LeagueAdminView from './views/leagueAdminView.vue';
import { createPinia } from 'pinia'
import {auth0} from "./auth0.js"
import siteAdminView from './views/siteAdminView.vue';
import leagueInvestmentView from "./views/leagueInvestmentsView.vue"
import leagueLeaderboard from "./views/leagueLeaderboardView.vue"

const routes: RouteRecordRaw[] = [
  { path: '/', component: DashboardView },
  { path: '/profile', component: ProfileView, beforeEnter: authGuard },
  { path: '/leagueAdmin', component: LeagueAdminView, beforeEnter: authGuard },
  { path: '/siteAdmin', component: siteAdminView, beforeEnter: authGuard },
  { path: '/leagueInvestments', component: leagueInvestmentView, beforeEnter: authGuard },
  { path: '/leagueLeaderboard', component: leagueLeaderboard, beforeEnter: authGuard }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes, 
})

const pinia = createPinia()
  
createApp(App).use(pinia).use(auth0).use(router).mount('#app')
