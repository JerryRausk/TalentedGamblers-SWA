<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/toast/use-toast'

const { user, getAccessTokenSilently } = useAuth0();
const { toast } = useToast()

async function testauth() {
  const t = await getAccessTokenSilently()
  const url = "/api/testauth"
  const headers = {'X-App-Authorization': `Bearer ${t}`}
  await fetch("/api/getLeagues", {headers})
  const res = await fetch(url, {headers});
  const resText = await res.text()
  toast({
    title: res.status === 200 ? "Succé" : "Katastrof",
    description: resText   
  })
}

</script>

<template>
  <div class="justify-self-center" v-if="user">
    <h1 class="text-center">{{user.name}}</h1>
    <h1 class="text-center">{{user.nickname}}</h1>
    <h1 class="text-center">{{user.email}}</h1>
    <Button @click="testauth">Test Auth</Button>
  </div>
</template>

<style scoped>
</style>
