import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createAuth0, authGuard } from '@auth0/auth0-vue';
import MeatHeadPreviewVue from './components/MeatHeadPreview.vue';
import ProfileVue from './components/Profile.vue';
import { createWebHashHistory, createRouter, RouteRecordRaw } from "vue-router";
import leagueViewVue from './components/leagueView.vue';
import { createPinia } from 'pinia'

const auth0 = createAuth0({
    domain: "talented-gamblers.eu.auth0.com",
    clientId: "WIboaHPJD7U0AVYuaJM9DmNqBHSLZ8Wo",
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  });

const routes: RouteRecordRaw[] = [
  { path: '/', component: MeatHeadPreviewVue },
  { path: '/profile', component: ProfileVue, beforeEnter: authGuard },
  { path: '/league', component: leagueViewVue, beforeEnter: authGuard }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes, 
})

const pinia = createPinia()
  
createApp(App).use(pinia).use(auth0).use(router).mount('#app')
