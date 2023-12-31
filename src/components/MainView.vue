<script setup lang="ts">
import { InvestmentTypes } from '@/types/investments.js';
import { useInvestmentStore } from '@/src/stores/InvestmentStore';
import { useLeagueStore } from '@/src/stores/LeagueStore';
import { watch } from 'vue';

const investmentStore = useInvestmentStore();
const leagueStore = useLeagueStore();
watch(() => leagueStore.activeLeague, () => {
  console.log("Watch active league triggered")
  if(leagueStore.activeLeague){
    investmentStore.refreshInvestments(leagueStore.activeLeague!.id)
  }
}, {immediate: true})
</script>

<template>
  <div class="flex flex-col p-2 gap-2">
    <div class="flex flex-row gap-4">
      <div class="flex flex-col w-fit min-w-44">
        <div class="border-secondary border rounded p-2 text-sm gap-2 flex flex-col">
          <div>
            <p>1. Jerry Rausk</p>
            <p class="text-xs text-muted-foreground">1103 (403💵 + 700💎)</p>
          </div>
          <div>
            <p>2. Oskar Söderbom</p>
            <p class="text-xs text-muted-foreground">902 (300💵 + 602💎)</p>
          </div>
          <div>
            <p>3. Richard Persson</p>
            <p class="text-xs text-muted-foreground">340 (340💎)</p>
          </div>
          <div class="mt-2">
            <p class="text-blue-600">
              > Go to leaderboard
            </p>
          </div>
        </div>
      </div>
      <div class="flex flex-col border p-2 w-full h-fit rounded">
        <h4>Waiting for you</h4>
        <ul class="text-sm text-blue-600">
          <li>7 verifications</li>
          <li>2 bets has expired</li>
        </ul>
      </div>
    </div>
    <div class="flex flex-col border rounded p-2">
      <h4>Activities</h4>
      <ul class="text-sm list-disc list-outside px-6">
        <li class="mt-1">Richard Persson verified Oskar Söderbom sold 2 FING-B at 0,13</li>
        <li class="mt-1">Oskar Söderbom sold 2 FING-B at 0,13</li>
        <li class="mt-1">Jerry Rausk settled bet with win 999</li>
        <li class="mt-2 text-blue-600">> See all activities for Meatheads 2024</li>
      </ul>
    </div>
    <div class="flex flex-col border rounded p-2">
      <div class="flex flex-row justify-between">
        <h4>Holdings</h4>
        <p class="text-sm">Cash: 333</p>
      </div>
      <hr class="my-2">
      <div class="flex flex-row gap-2">
        <div v-for="i in investmentStore.investments" class="flex flex-col border rounded p-1 align-middle justify-center text-center">
          <p>{{ i.data.type === InvestmentTypes.Stock ? i.data.ticker : "BET" }}</p>
          <p class="text-xs mt-2">{{ i.data.amount }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
table {
  width: 100%;
}

.table-wrapper {
  min-width: 20rem;
  max-width: 40rem;
  margin-top: 1rem;
  border: 1px solid black;
  border-radius: 8px;
}

th,
td {
  padding: 0.25rem;
  vertical-align: middle;
}

.profile-pic {
  height: 3rem;
  width: 3rem;
  border-radius: 100%;
}</style>
