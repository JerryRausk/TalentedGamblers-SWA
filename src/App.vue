<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavBar from '@/src/components/NavBar.vue';
import Toaster from '@/src/components/ui/toast/Toaster.vue'
import { useAuth0 } from '@auth0/auth0-vue';
import Landing from "@/src/components/Landing.vue";
const { isAuthenticated } = useAuth0();

</script>
 
<template>
    <NavBar v-if="isAuthenticated" class="mb-2"/>
    <RouterView v-if="isAuthenticated" />
    <Landing v-else />
    <Toaster />
</template>

<style scoped></style>
