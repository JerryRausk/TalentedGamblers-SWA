<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavBar from './components/NavBar.vue';
import Toaster from '@/components/ui/toast/Toaster.vue'
</script>
 
<template>
    <NavBar />
    <RouterView />
    <Toaster />
</template>

<style scoped></style>
