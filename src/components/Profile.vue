<script setup lang="ts">
import {ref} from "vue";
import { useAuth0 } from '@auth0/auth0-vue';
const { user, getAccessTokenSilently } = useAuth0();
const userinfo = ref("");
async function testauth() {
  const t = await getAccessTokenSilently()
  const url = "/api/testauth"
  const headers = {'X-App-Authorization': `Bearer ${t}`}
  await fetch("/api/getLeagues", {headers})
  userinfo.value = await (await fetch(url, {headers})).text()
}
</script>

<template>
  <div class="justify-self-center" v-if="user">
    <h1 class="text-center">{{user.name}}</h1>
    <h1 class="text-center">{{user.nickname}}</h1>
    <h1 class="text-center">{{user.email}}</h1>
    <button @click="testauth">Test Auth</button>
    <div class="w-40">
      <p>{{ userinfo }}</p>
    </div>
  </div>
</template>

<style scoped>
</style>
