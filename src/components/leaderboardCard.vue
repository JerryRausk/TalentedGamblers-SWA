<script setup lang="ts">
import { Holdings, BetInvestment } from '@/types/investments';
import { ref } from "vue";
import StockHoldingCard from "@/src/components/stockHoldingCard.vue";
import BetHoldingCard from "@/src/components/betHoldingCard.vue";
import OtherHoldingCard from "@/src/components/otherInvestmentHoldingCard.vue";

defineProps<{
  holdings: Holdings
}>();

const isOpen = ref(false);

function leaderboardDetailsText(holdings: Holdings) {
  const texts = []
  
  if(holdings.cashHoldings > 0) texts.push(`${holdings.cashHoldings.toLocaleString()} in cash`)
  
  let invested = 0;
  if (holdings.betHoldings.length > 0) invested += holdings.betHoldings.reduce((acc, curr) => acc += (curr.data as BetInvestment).amount, 0);
  
  if (holdings.stockHoldings.length > 0) invested += holdings.stockHoldings.reduce((acc, curr) => acc += curr.averageBuyPrice * curr.heldAmount, 0);
  
  if (holdings.otherInvestmentsHoldings.length > 0) invested += holdings.otherInvestmentsHoldings.reduce((acc, curr) => acc += curr.buyPrice, 0)
  
  if(invested > 0) texts.push(`${invested} invested`)
  
  return texts
}

function sumHoldings(holdings: Holdings) {
  return holdings.cashHoldings 
    + holdings.stockHoldings.reduce((acc, curr) => acc += curr.heldAmount * curr.averageBuyPrice,0) 
    + holdings.betHoldings.reduce((acc, curr) => acc += (curr.data as BetInvestment).amount, 0) 
    + holdings.otherInvestmentsHoldings.reduce((acc, curr) => acc += curr.buyPrice, 0)
}
</script>
<template>
  <div>
    <div @click="isOpen = !isOpen">
      <p>{{ holdings.userId.split("@")[0] }} <span class="ml-2">{{ sumHoldings(holdings) }}</span></p>
      <p class="text-xs text-muted-foreground">{{ leaderboardDetailsText(holdings).join(", ") }}</p>
    </div>
    <div @click="isOpen=false" class="flex flex-row flex-wrap gap-2 mt-3 pb-2 border-b" v-if="isOpen">
      <StockHoldingCard v-for="h in holdings.stockHoldings" :stock-holding="h" />
      <BetHoldingCard v-for="b in holdings.betHoldings" :investment="b" :show-actions="false"/>
      <OtherHoldingCard v-for="o in holdings.otherInvestmentsHoldings" :other-holding="o" />
    </div>
  </div>
</template>