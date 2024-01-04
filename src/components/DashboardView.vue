<script setup lang="ts">
import { useInvestmentStore } from '@/src/stores/InvestmentStore';
import { useLeagueStore } from '@/src/stores/LeagueStore';
import { watch, ref, computed } from 'vue';
import { Skeleton } from "@/src/components/ui/skeleton";
import InvestmentCard from "@/src/components/InvestmentCard.vue"
import { useRouter } from 'vue-router';
import { Holdings } from '@/types/investments';

const investmentStore = useInvestmentStore();
const leagueStore = useLeagueStore();
const holdingsLoading = ref(true);
const investmentsLoading = ref(true);
const router = useRouter();
watch(() => leagueStore.activeLeague, async () => {
  if (leagueStore.activeLeague) {
    await investmentStore.refreshHoldings(leagueStore.activeLeague!.id);
    holdingsLoading.value = false;
    if (investmentStore.leagueInvestments.length === 0)
      await investmentStore.refreshLeagueInvestments(leagueStore.activeLeague.id, 0);
    investmentsLoading.value = false;
  }
}, { immediate: true })

const latestInvestments = computed(() => {
  if (!investmentStore.leagueInvestments) return []
  return investmentStore.leagueInvestments.slice(0, 3)
})

function leaderboardDetailsText(leagueHoldings: Holdings) {
  let holdingTexts = []

  if (leagueHoldings.cashHoldings > 0) holdingTexts.push(`${leagueHoldings.cashHoldings.toLocaleString()} in cash`)
  
  if (leagueHoldings.notSettledBets.length > 0) {
    holdingTexts.push(`${leagueHoldings.notSettledBets.reduce((acc, curr) => acc += curr.amount, 0).toLocaleString()} in bets`)
  }

  if (leagueHoldings.stockHoldings.length > 0) {
    holdingTexts.push(`${leagueHoldings.stockHoldings.length} stock${leagueHoldings.stockHoldings.length > 1 ? "s" : ""}`)
  }


  if (leagueHoldings.otherInvestmentsHoldings.length > 0) {
    holdingTexts.push(`${leagueHoldings.otherInvestmentsHoldings.length} other investment${leagueHoldings.otherInvestmentsHoldings.length > 1 ? "s" : ""}`)
  }

  return holdingTexts
}
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
      <div class="flex flex-col w-full">
        <div class="border-secondary border rounded p-2  gap-2 flex flex-col">
          <h4>Leaderboard</h4>
          <ol class="text-sm list-decimal ml-4 flex flex-col gap-2">
            <li v-for="lh in investmentStore.leagueHoldings">
              <p>{{ lh.userId.split("@")[0] }}</p>
              <p class="text-xs text-muted-foreground">{{ leaderboardDetailsText(lh).join(", ") }}</p>
            </li>
          </ol>
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
        <div v-for="bet in investmentStore.holdings.notSettledBets"
          class="flex flex-col border rounded p-1 align-middle justify-center text-center min-w-14">
          <p>Bet</p>
          <p class="text-xs mt-2">{{ bet.amount }} @ {{ bet.odds }}</p>
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

<style scoped></style>
