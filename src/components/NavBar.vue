<script setup lang="ts">
    import { useAuth0 } from '@auth0/auth0-vue';
    import { RouterLink } from "vue-router";
    const { logout, loginWithPopup } = useAuth0();
    function logoutUser() {
        logout({ logoutParams: { returnTo: window.location.origin } });
    }
    function login()  {
      loginWithPopup();
    }
    const { user, isAuthenticated } = useAuth0();
  </script>
<template>
    <div id="nav">
      <div id="nav-left">
        <RouterLink to="/">Talented Gamblers</RouterLink>
      </div>
      
      <div id="nav-right">
        <RouterLink v-if="isAuthenticated" to="/profile">{{ user?.name ?? user?.nickname }}</RouterLink>
        <a v-if="!isAuthenticated" @click="login">Logga in</a>
        <a v-else @click="logoutUser">Logout</a>
      </div>
      
    </div>
  </template>
  <style scoped>
  #nav {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-inline: 16px;
    padding-block: 8px;
    background: rgba(0, 0, 0, 0.202);
    width: 100%;
  }
  #nav-right > a, #nav-left > a {
    margin-inline: 8px;
  }
</style>
  
  