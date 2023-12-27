<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import { RouterLink } from "vue-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import {
  Button
} from "@/components/ui/button"
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
  <NavigationMenu class="min-w-full flex flex-row justify-between">
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuLink :as="RouterLink" to="/" :class="navigationMenuTriggerStyle()">
          TG
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
    <NavigationMenuList >
      <NavigationMenuItem v-if="!isAuthenticated">
        <NavigationMenuLink class="cursor-pointer" @click="login" :class="navigationMenuTriggerStyle()">
          Logga in
        </NavigationMenuLink>
      </NavigationMenuItem>
      <DropdownMenu v-if="isAuthenticated && user">
        <DropdownMenuTrigger as-child>
          <Button variant="ghost">
            {{ user?.name ?? user?.nickname }}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-48 me-1" align="center">
          <DropdownMenuLabel class="font-normal flex">
            <div class="flex flex-col space-y-1">
              <p class="text-sm font-medium leading-none">
                {{user.name ?? ""}}
              </p>
              <p class="text-xs leading-none text-muted-foreground">
                {{ user.email }}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem class="cursor-pointer h-12" :as="RouterLink" to="/profile" >
                  Profile
            </DropdownMenuItem>
            <DropdownMenuItem class="cursor-pointer h-12" :as="RouterLink" to="/league">
                  League
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="cursor-pointer h-12" @click="logoutUser">
                Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    
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
  
  