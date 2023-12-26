<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import { RouterLink } from "vue-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'
const { logout, loginWithPopup } = useAuth0();
function logoutUser() {
  logout({ logoutParams: { returnTo: window.location.origin } });
}
function login() {
  loginWithPopup();
}
const { user, isAuthenticated } = useAuth0();
</script>
<template>
  <NavigationMenu>
    <NavigationMenuList>
      <RouterLink to="/">
        <NavigationMenuItem>
          <NavigationMenuLink :class="navigationMenuTriggerStyle()">
            Talented Gamblers
          </NavigationMenuLink>
        </NavigationMenuItem>
      </RouterLink>

      <RouterLink v-if="isAuthenticated" to="/profile">
        <NavigationMenuItem>
          <NavigationMenuLink :class="navigationMenuTriggerStyle()">
            {{ user?.name ?? user?.nickname }}
          </NavigationMenuLink>
        </NavigationMenuItem>
      </RouterLink>

      <RouterLink v-if="isAuthenticated" to="/league">
        <NavigationMenuItem>
          <NavigationMenuLink :class="navigationMenuTriggerStyle()">
            League
          </NavigationMenuLink>
        </NavigationMenuItem>
      </RouterLink>

      <NavigationMenuItem v-if="isAuthenticated">
        <NavigationMenuLink class="cursor-pointer" @click="logoutUser" :class="navigationMenuTriggerStyle()">
          Logga ut
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem v-else>
        <NavigationMenuLink class="cursor-pointer" @click="login" :class="navigationMenuTriggerStyle()">
          Logga in
        </NavigationMenuLink>
      </NavigationMenuItem>

    </NavigationMenuList>
  </NavigationMenu>
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

#nav-right>a,
#nav-left>a {
  margin-inline: 8px;
}
</style>
  
  