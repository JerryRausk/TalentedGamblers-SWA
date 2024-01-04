<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavBar from '@/src/components/NavBar.vue';
import Toaster from '@/src/components/ui/toast/Toaster.vue'
import { useAuth0 } from '@auth0/auth0-vue';
import Landing from "@/src/components/Landing.vue";
import { useLeagueStore} from "@/src/stores/LeagueStore.js";
import { watch } from 'vue';

const { isAuthenticated, user, isLoading } = useAuth0();
const leagueStore = useLeagueStore();
watch([isLoading, leagueStore.activeLeague], () => {
    // Done loading auth stuff but no active league yet
    if(!isLoading && !leagueStore.activeLeague) {
        leagueStore.refreshLeagues();
    }
}) 
</script>
 
<template>
    <NavBar v-if="isAuthenticated" class="mb-2"/>
    <RouterView v-if="isAuthenticated && leagueStore.activeLeague" :user="user" :activeLeague="leagueStore.activeLeague"/>
    <Landing v-if="!isAuthenticated" />
    <Toaster />
</template>

<style scoped></style>
