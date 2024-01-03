<script setup lang="ts">
import { useInvestmentStore } from '@/src/stores/InvestmentStore';
import { useLeagueStore } from '@/src/stores/LeagueStore';
import { watch, ref, computed } from 'vue';
import { Skeleton } from "@/src/components/ui/skeleton";
import InvestmentCard from "@/src/components/InvestmentCard.vue"
import { useRouter } from 'vue-router';

const investmentStore = useInvestmentStore();
const leagueStore = useLeagueStore();
const holdingsLoading = ref(true);
const investmentsLoading = ref(true);
const router = useRouter();
watch(() => leagueStore.activeLeague, async () => {
  if (leagueStore.activeLeague) {
    await investmentStore.refreshHoldings(leagueStore.activeLeague!.id);
    holdingsLoading.value = false;
    if(investmentStore.leagueInvestments.length === 0)
      await investmentStore.refreshLeagueInvestments(leagueStore.activeLeague.id, 0);
    investmentsLoading.value = false;
  }
}, { immediate: true })

const latestInvestments = computed(() => {
  if(!investmentStore.leagueInvestments) return []
  return investmentStore.leagueInvestments.slice(0, 3)
})
</script>

<template>
  <div class="flex flex-col p-2 gap-2">
    <div class="flex flex-row justify-center">
      <div class="w-4"></div>
      <h1 class="text-center text-xl mb-2">Dashboard</h1>
      <div class="w-4">
        </div>
    </div>
    <div class="flex flex-row gap-4">
      <div class="flex flex-col w-fit min-w-44">
        <div class="border-secondary border rounded p-2  gap-2 flex flex-col">
          <div class="flex flex-row justify-between">
            <h4>Leaderboard</h4>
            
          </div>
          
          <div class="text-sm" v-for="lh in investmentStore.leagueHoldings">
            <p>{{ lh.userId }}</p>
            <p class="text-xs text-muted-foreground">{{ lh.cashHoldings.toLocaleString() }} + {{ lh.stockHoldings.length }} different stocks</p>
          </div>
          <div class="mt-2 text-sm">
            <p class="text-blue-600">
              > Go to leaderboard
            </p>
          </div>
        </div>
      </div>
      <div class="flex flex-col border p-2 w-full rounded">
        <h4>Waiting for you</h4>
        <ul class="text-sm text-blue-600">
          <li>7 verifications</li>
          <li>2 bets has expired</li>
        </ul>
      </div>
    </div>
    <div class="flex flex-col border rounded p-2 gap-2">
      <h4>Investments</h4>
      <div v-for="li in latestInvestments">
        <InvestmentCard :investment="li" />
      </div>
      <div>
        <a @click="router.push('leagueInvestments')" class="text-blue-600 text-sm">> Go to all investments</a>
      </div>
    </div>
    <div v-if="investmentStore.holdings && !holdingsLoading" class="flex flex-col border rounded p-2">
      <div class="flex flex-row justify-between">
        <h4>Holdings</h4>
        <p class="text-sm">Cash: {{ investmentStore.holdings.cashHoldings.toLocaleString() }}</p>
      </div>
      <hr class="my-2">
      <div class="flex flex-row gap-2 flex-wrap">
        <div v-for="h in investmentStore.holdings.stockHoldings"
          class="flex flex-col border rounded p-1 align-middle justify-center text-center min-w-14">
          <p>{{ h.ticker }}</p>
          <p class="text-xs mt-2">{{ h.heldAmount }}</p>
        </div>
      </div>
    </div>
    <div v-else class="flex flex-col border rounded p-2">
      <div class="flex flex-row justify-between">
        <h4>Holdings</h4>
        <Skeleton class="w-20 h-6 rounded" />
      </div>
      <hr class="my-2">
      <div class="flex flex-row gap-2 flex-wrap">
        <Skeleton class="w-14 h-14 rounded" />
        <Skeleton class="w-14 h-14 rounded" />
        <Skeleton class="w-14 h-14 rounded" />
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
}
</style>
