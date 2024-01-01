<script setup lang="ts">
import { Button } from "@/src/components/ui/button"
import { useAuth0 } from '@auth0/auth0-vue';

const { loginWithPopup, isLoading } = useAuth0();

</script>
<template>
    <div class="flex flex-col mt-[30vh] text-center align-center justify-center mx-12 gap-8">
        <h1 class="mx-auto text-2xl">Talented Gamblers</h1>
        <h2 v-if="isLoading">Loading...</h2>
        <Button v-else @click="loginWithPopup">Log in with Google</Button>
    </div>
</template>