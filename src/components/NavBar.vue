<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import { RouterLink } from "vue-router";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from '@/src/components/ui/navigation-menu'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from '@/src/components/ui/dropdown-menu'
import { Button } from "@/src/components/ui/button"
import { useLeagueStore } from "@/src/stores/LeagueStore"
import InvestMentForm from './forms/InvestmentForm.vue';
import { onMounted, ref } from 'vue';
import { Skeleton } from "@/src/components/ui/skeleton";
import { useUserStore } from '../stores/UserStore';

const leagueStore = useLeagueStore();
const userStore = useUserStore();
const leagueLoading = ref(true);
const { logout, loginWithPopup, user, isAuthenticated } = useAuth0();

function logoutUser() {
  logout({ logoutParams: { returnTo: window.location.origin } });
}

function login() {
  loginWithPopup();
}

onMounted(async () => {
  await leagueStore.refreshLeagues();
  leagueLoading.value = false;
  userStore.refreshUser();
})
</script>
<template>
  <NavigationMenu class="min-w-full flex flex-row justify-between">
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuLink v-if="isAuthenticated" :as="RouterLink" to="/" :class="navigationMenuTriggerStyle()">
          TG
        </NavigationMenuLink>
        <NavigationMenuLink v-else="" :as="RouterLink" to="/" :class="navigationMenuTriggerStyle()">
          TG
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
    <div v-if="!leagueLoading">
      <div v-if="user && user.email && leagueStore.activeLeague">
        <DropdownMenu>
          <DropdownMenuTrigger>
            ▾ {{ leagueStore.activeLeague.name }}
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-48 me-1">
            <DropdownMenuLabel class="font-normal flex">
              <div class="flex flex-col space-y-1">
                <p class="text-sm font-medium leading-none">
                  Switch league
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem class="cursor-pointer h-12">
              League 2
            </DropdownMenuItem>
            <DropdownMenuItem class="cursor-pointer h-12">
              League 3
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem class="cursor-pointer h-12">
              Create new
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <InvestMentForm :user-email="user.email" :league="leagueStore.activeLeague" />
      </div>
      <div v-else>
        User/League error
      </div>
    </div>
    <div v-else>
      <Skeleton class="w-[150px] h-[25px] rounded" />
    </div>

    <NavigationMenuList>
      <NavigationMenuItem v-if="!isAuthenticated">
        <NavigationMenuLink class="cursor-pointer" @click="login" :class="navigationMenuTriggerStyle()">
          Logga in
        </NavigationMenuLink>
      </NavigationMenuItem>
      <DropdownMenu v-if="isAuthenticated && user">
        <DropdownMenuTrigger as-child>
          <Button variant="ghost">
            {{ user.name ? user.name.split(" ").map(s => s[0]).join("") : "??" }}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-48 me-1">
          <DropdownMenuItem class="cursor-pointer h-12" :as="RouterLink" to="/profile">
            <div class="flex flex-col space-y-1">
              <p class="text-sm font-medium leading-none">
                {{ user.name ?? "" }}
              </p>
              <p class="text-xs leading-none text-muted-foreground">
                {{ user.email }}
              </p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuGroup v-if="leagueStore.activeLeague">
            <DropdownMenuItem class="cursor-pointer h-12" :as="RouterLink" to="/">
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem v-if="userStore.isSiteAdmin" class="cursor-pointer h-12" :as="RouterLink" to="/leagueAdmin">
              League Admin
            </DropdownMenuItem>
            <DropdownMenuItem class="cursor-pointer h-12" :as="RouterLink" to="/leagueInvestments">
              League Investments
            </DropdownMenuItem>
            <DropdownMenuItem class="cursor-pointer h-12" :as="RouterLink" to="/">
              Activities
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <div v-if="userStore.isSiteAdmin">
            <DropdownMenuSeparator />
            <DropdownMenuItem class="cursor-pointer h-12" :as="RouterLink" to="/siteAdmin">
              Site Admin
            </DropdownMenuItem>
          </div>

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
  
  