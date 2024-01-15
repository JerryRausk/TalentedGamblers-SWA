<script setup lang="ts">
import { User } from '@auth0/auth0-vue';
import { League } from "@/types/league";

defineProps<{
  activeLeague: League,
  user: User
}>();

</script>

<template>
  <div class="justify-self-center p-5">
    <h1 class="text-center">{{user.name}}</h1>
    <h1 class="text-center">{{user.nickname}}</h1>
    <h1 class="text-center">{{user.email}}</h1>
  </div>
</template>

<style scoped>
</style>
