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
const router = useRouter();

const holdingsLoading = ref(true);
const investmentsLoading = ref(true);
const expiringBets = computed(() => {
  if (!investmentStore.holdings) return []
  console.log(new Date(investmentStore.holdings.notSettledBets[0].expiryDate).getTime() - new Date().getTime())
  return investmentStore.holdings.notSettledBets.filter(b => 
  (new Date(b.expiryDate).getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24 < 1
  ).sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
})
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
    <div class="flex-row gap-4">
      <div class="flex-col w-full">
        <div class=" rounded p-2  gap-2 flex flex-col">
          <h4 class="text-sky-300">Leaderboard</h4>
          <div class="border-l pl-2">
            <ol class="text-sm list-decimal ml-4 flex flex-col gap-2">
            <li v-for="lh in investmentStore.leagueHoldings">
              <p>{{ lh.userId.split("@")[0] }}</p>
              <p class="text-xs text-muted-foreground">{{ leaderboardDetailsText(lh).join(", ") }}</p>
            </li>
          </ol>
          </div>
        </div>
      </div>

    </div>
    <div v-if="expiringBets.length > 0" class="flex flex-col p-2 w-full">
      <h4 class="text-sky-300">Bets to close</h4>
      <div class="flex flex-row flex-wrap gap-2">
        <div v-for="b in expiringBets" class=" text-center max-w-[40%] border rounded p-2">
        <p class="line-clamp-1">{{ b.name }}</p>
        <hr class="my-1">
        <p class="text-sm">{{ b.amount }} @ {{ b.odds }}</p>
        <p class="text-sm">{{ b.expiryDate }}</p>
      </div>
      </div>
      
    </div>
    <div class="flex flex-col rounded p-2 gap-2">
      <h4 class="text-sky-300">Investments</h4>
      <div v-for="li in latestInvestments">
        <InvestmentCard :investment="li" />
      </div>
      <div>
        <a @click="router.push('leagueInvestments')" class="text-blue-600 text-sm">> Go to all investments</a>
      </div>
    </div>
    <div v-if="investmentStore.holdings && !holdingsLoading" class="flex flex-col rounded p-2">
      <div class="flex flex-row justify-between">
        <h4 class="text-sky-300">Holdings</h4>
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
        <h4 class="text-sky-300">Holdings</h4>
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
