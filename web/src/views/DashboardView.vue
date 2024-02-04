<script setup lang="ts">
import { useInvestmentStore } from '@/src/stores/InvestmentStore';
import { useLeagueStore } from '@/src/stores/LeagueStore';
import { watch, ref, computed } from 'vue';
import { Skeleton } from "@/src/components/ui/skeleton";
import InvestmentCard from "@/src/components/InvestmentCard.vue"
import { useRouter } from 'vue-router';
import { User } from '@auth0/auth0-vue';
import { League } from "@/types/league"
import StockHoldingCard from "@/src/components/stockHoldingCard.vue"
import BetHoldingCard from "@/src/components/betHoldingCard.vue";
import LeaderboardCard from "@/src/components/leaderboardCard.vue";
import OtherInvestmentHoldingCard from '../components/otherInvestmentHoldingCard.vue';
import { BetInvestment } from '@/types/investments';
import AdjustStockTicker from "@/src/components/adjustStockTickerCard.vue"
const props = defineProps<{
  activeLeague: League,
  user: User
}>();

const investmentStore = useInvestmentStore();
const leagueStore = useLeagueStore();
const router = useRouter();

const loading = ref(true);
const expiringBets = computed(() => {
  if (!investmentStore.userHoldings) return []
  return investmentStore.userHoldings.betHoldings.filter(b =>
    (new Date((b.data as BetInvestment).expiryDate).getTime() - new Date().getTime()) / 1000 / 60 / 60 / 24 < 1
  ).sort((a, b) => new Date((a.data as BetInvestment).expiryDate).getTime() - new Date((b.data as BetInvestment).expiryDate).getTime())
})

watch(() => leagueStore.activeLeague, async () => {
  if (leagueStore.activeLeague && props.user.email) {
    if (!investmentStore.leagueHoldings || !investmentStore.userHoldings)
      await investmentStore.refreshInvestmentData(leagueStore.activeLeague.id, props.user.email);
      loading.value = false;
      await investmentStore.refreshInvalidStockTickers();
  }
}, { immediate: true })

const latestInvestments = computed(() => {
  if (!investmentStore.leagueInvestments) return []
  return [...investmentStore.leagueInvestments].sort((a, b) => a.date < b.date ? 1 : -1).slice(0, 3)
})

const top3LeaderBoardSorted = computed(() => {
  if (!investmentStore.leagueHoldings) return [];
  [...investmentStore.leagueHoldings].sort((a, b) => {
    const aHoldings = a.cashHoldings
      + a.betHoldings.reduce((acc, curr) => acc += (curr.data as BetInvestment).amount, 0)
      + a.otherInvestmentsHoldings.reduce((acc, curr) => acc += curr.buyPrice, 0)
      + a.stockHoldings.reduce((acc, curr) => acc += curr.averageBuyPrice * curr.heldAmount, 0)

    const bHoldings = b.cashHoldings
      + b.betHoldings.reduce((acc, curr) => acc += (curr.data as BetInvestment).amount, 0)
      + b.otherInvestmentsHoldings.reduce((acc, curr) => acc += curr.buyPrice, 0)
      + b.stockHoldings.reduce((acc, curr) => acc += curr.averageBuyPrice * curr.heldAmount, 0)

    return bHoldings - aHoldings
  })
  return investmentStore.leagueHoldings.slice(0, 3)
});

const invalidStockTickers = computed(() => {
  if(!investmentStore.invalidTickers || !investmentStore.userHoldings) return [];
  return investmentStore.invalidTickers.filter(it => investmentStore.userHoldings?.stockHoldings.map(sh => sh.ticker).includes(it))
})
</script>

<template>
  <div class="flex flex-col p-2 gap-2">
    <div class="flex-row gap-4">
      <div class="flex-col w-full">
        <div class=" rounded p-2  gap-2 flex flex-col">
          <h4 class="font-bold">Top 3 investors</h4>
          <div class="border-l pl-2">
            <ol class="text-sm list-decimal ml-4 flex flex-col gap-2">
              <Skeleton v-if="loading" v-for="_ in [1, 2, 3]" class="w-36 h-10 rounded ml-[-1rem]" />
              <li v-for="lh in top3LeaderBoardSorted">
                <LeaderboardCard :holdings="lh" />
              </li>
            </ol>
          </div>
          <a @click="router.push('leagueLeaderboard')" class="text-blue-600 text-sm">> Go to leaderboard</a>
        </div>
      </div>
    </div>

    <div v-if="expiringBets.length > 0" class="flex flex-col p-2 w-full">
      <h4 class="font-bold">Bets to close</h4>
      <div class="flex flex-row flex-wrap gap-2">
        <BetHoldingCard v-for="b in expiringBets" :show-actions="true" :investment="b" />
      </div>
    </div>

    <div v-if="invalidStockTickers.length > 0 && user.email" class="flex flex-col p-2 w-full">
      <h4 class="font-bold">Invalid stock tickers</h4>
      <div class="flex flex-row flex-wrap gap-2">
        <div v-for="i in invalidStockTickers">
          <AdjustStockTicker :old-ticker="i" :user-id="user.email" :league-id="activeLeague.id" />
        </div>
      </div>
    </div>

    <div class="flex flex-col rounded p-2 gap-2">
      <h4 class="font-bold">Investments</h4>
      <Skeleton v-if="loading" v-for="_ in [1, 2, 3]" class="w-full h-14 rounded" />
      <div v-for="li in latestInvestments">
        <InvestmentCard :investment="li" />
      </div>
      <div>
        <a @click="router.push('leagueInvestments')" class="text-blue-600 text-sm">> Go to all investments</a>
      </div>
    </div>
    <div v-if="investmentStore.userHoldings !== null && !loading" class="flex flex-col rounded p-2">
      <div class="flex flex-row justify-between">
        <h4 class="font-bold">My holdings</h4>
        <p class="text-sm">Cash: {{ investmentStore.userHoldings.cashHoldings.toLocaleString() }}</p>
      </div>
      <hr class="my-2">
      <div class="flex flex-row gap-2 flex-wrap">
        <StockHoldingCard v-for="h in investmentStore.userHoldings.stockHoldings" :stock-holding="h" />
        <BetHoldingCard v-for="b in investmentStore.userHoldings.betHoldings" :investment="b" :show-actions="false" />
        <OtherInvestmentHoldingCard v-for="o in investmentStore.userHoldings.otherInvestmentsHoldings"
          :other-holding="o" />
      </div>
    </div>
    <div v-else class="flex flex-col border rounded p-2">
      <div class="flex flex-row justify-between">
        <h4 class="font-bold">Holdings</h4>
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
