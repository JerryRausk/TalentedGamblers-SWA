<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/toast/use-toast'
import { getText, getJson } from "../services/apiService"

const { user } = useAuth0();
const { toast } = useToast()

async function testauth() {
  const authRes = await getText("testauth");
  toast({
    title: authRes.success ? "Succé" : "Katastrof",
    description: authRes.data ?? "Something",   
  })
}


async function testleague() {
  const authRes = await getJson<any>("getLeagues");
  toast({
    title: authRes.success ? "Succé" : "Katastrof",
    description: authRes.data ?? "Something",   
  })
}

</script>

<template>
  <div class="justify-self-center p-5" v-if="user">
    <h1 class="text-center">{{user.name}}</h1>
    <h1 class="text-center">{{user.nickname}}</h1>
    <h1 class="text-center">{{user.email}}</h1>
    <Button class="mt-4" @click="testauth">Test Auth</Button>
    <Button class="ml-4" @click="testleague">Test League Endpoint</Button>
  </div>
</template>

<style scoped>
</style>
