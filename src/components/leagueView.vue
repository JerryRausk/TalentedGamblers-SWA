<script setup lang="ts">
import InvestmentCard from "@/src/components/InvestmentCard.vue";
import InvestmentForm from "./forms/InvestmentForm.vue";
import { useInvestmentStore } from "../stores/InvestmentStore.js";
import { useLeagueStore } from "@/src/stores/LeagueStore";
import { watch, ref } from "vue";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useAuth0 } from '@auth0/auth0-vue';

const { user } = useAuth0();

const investmentStore = useInvestmentStore();
const leagueStore = useLeagueStore();
const loading = ref(true);


watch(() => leagueStore.activeLeague, () => {
  console.log("Watch active league triggered")
  if(leagueStore.activeLeague){
    investmentStore.refreshInvestments(leagueStore.activeLeague!.id)
  }
}, {immediate: true})

const people = [
    {
        name: "Jerry Rausk",
        cash: 500,
        invested: 790
    },
    {
        name: "Dino Gazibegovic",
        cash: 0,
        invested: 1240
    },
    {
        name: "Richard Persson",
        cash: 0,
        invested: 240
    },
]
</script>
<template>
    <div class="px-2" v-if="user && user.email">
        <div>
            <div v-for="p of people">
                <h3>{{ p.name }}</h3>
            </div>
        </div>
        <!--Skeleton stuff-->
        <div v-if="loading" class="flex flex-col gap-2">
            <div class="p-2 animate-pulse rounded-md border-solid border-2 border-secondary h-[70px]">
                <Skeleton class="w-[200px] h-[20px] rounded-full" />
                <Skeleton class="w-[100px] h-[15px] rounded-full mt-2" />
            </div>
            <div class="p-2 animate-pulse rounded-md border-solid border-2 border-secondary h-[70px]">
                <Skeleton class="w-[200px] h-[20px] rounded-full" />
                <Skeleton class="w-[100px] h-[15px] rounded-full mt-2" />
            </div>
            <div class="p-2 animate-pulse rounded-md border-solid border-2 border-secondary h-[70px]">
                <Skeleton class="w-[200px] h-[20px] rounded-full" />
                <Skeleton class="w-[100px] h-[15px] rounded-full mt-2" />
            </div>
        </div>
        <div v-else>
            <!-- Investment list -->
            <div class="flex flex-col gap-2 pt-2">
                <InvestmentCard v-for="investment in investmentStore.investments" :investment="investment" />
            </div>
            <!-- Investment form -->
            <InvestmentForm :user-email="user.email" league-id="LeagueGuid" />
        </div>
    </div>
    <div class="m-auto" v-else>
        Could not read user email, please loug out and then log in again.
    </div>
</template>