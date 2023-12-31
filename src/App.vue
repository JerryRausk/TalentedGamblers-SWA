<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavBar from '@/src/components/NavBar.vue';
import Toaster from '@/src/components/ui/toast/Toaster.vue'
</script>
 
<template>
    <NavBar class="mb-2"/>
    <RouterView />
    <Toaster />
</template>

<style scoped></style>
