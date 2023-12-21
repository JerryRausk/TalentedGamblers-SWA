<script setup lang="ts">
    import { FwbNavbar, FwbButton } from 'flowbite-vue'
    import { useAuth0 } from '@auth0/auth0-vue';

    const { loginWithRedirect, logout } = useAuth0();
    function logoutUser() {
        logout({ logoutParams: { returnTo: window.location.origin } });
    }
    function login()  {
        loginWithRedirect();
    }
    const { user, isAuthenticated } = useAuth0();
  </script>
<template>
    
    <fwb-navbar class="bg-black">
      <template #logo>
        Talented Gamblers 📈
      </template>
      <template #right-side v-if="isAuthenticated && user">
        {{ user.name ? user.name : user.nickname }}
        <FwbButton class="bg-transparent hover:bg-gray-950" size="xs" @click="logoutUser">❌</FwbButton>
      </template>
      <template #right-side v-if="!isAuthenticated">
        <FwbButton size="xs" @click="login">Logga in</FwbButton>
      </template>
    </fwb-navbar>
  </template>
  
  