import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createAuth0 } from '@auth0/auth0-vue';

const auth0 = createAuth0({
    domain: "talented-gamblers.eu.auth0.com",
    clientId: "WIboaHPJD7U0AVYuaJM9DmNqBHSLZ8Wo",
    authorizationParams: {
      redirect_uri: window.location.origin
    }
  });
  
createApp(App).use(auth0).mount('#app')
