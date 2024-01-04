<script setup lang="ts">
import { Holdings } from '@/types/investments';
import { ref } from "vue";
import StockHoldingCard from "@/src/components/stockHoldingCard.vue";
import BetHoldingCard from "@/src/components/betHoldingCard.vue";

defineProps<{
  holdings: Holdings
}>();

const isOpen = ref(false);
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
  <div>
    <div @click="isOpen = !isOpen">
      <p>{{ holdings.userId.split("@")[0] }}</p>
      <p class="text-xs text-muted-foreground">{{ leaderboardDetailsText(holdings).join(", ") }}</p>
    </div>
    <div @click="isOpen=false" class="flex flex-row flex-wrap gap-2 mt-3 pb-2 border-b" v-if="isOpen">
      <StockHoldingCard v-for="h in holdings.stockHoldings" :stock-holding="h" />
      <BetHoldingCard v-for="b in holdings.notSettledBets" :not-settled-bet="b" />
    </div>
  </div>
</template>