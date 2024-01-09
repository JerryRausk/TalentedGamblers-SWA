<script setup lang="ts">
import { InvestmentTypes, Investment } from "@/types/investments.js";
defineProps<{
  investment: Investment
}>();
</script>

<template>
  <div class="border border-secondary p-2 rounded">
    <div class="flex flex-row justify-between mb-2">
      <p class="text-md">
        {{ investment.userId.split("@")[0] }}
      </p>
      <p class="text-muted-foreground text-xs">{{ investment.date }}</p>
    </div>

    <!--Stocks-->
    <div v-if="investment.data.type === InvestmentTypes.Stock">
      <p class="text-sm">
        {{ investment.data.buyPosition ? "Bought" : "Sold" }} {{ investment.data.amount }} of {{ investment.data.ticker }}
        at {{
          Math.round(investment.data.price / investment.data.amount * 10000) / 10000 }}, totaling {{ investment.data.price.toLocaleString() }}
      </p>
    </div>

    <!--Bets-->
    <div v-if="investment.data.type === InvestmentTypes.Bet">
      <p class="text-sm" v-if="investment.data.open">
        Created bet "{{ investment.data.name }}" of {{ investment.data.amount }}{{ investment.data.odds ? ` with odds ${investment.data.odds}` : "" }}
      </p>
      <p class="text-sm" v-else>
        Settled bet "{{ investment.data.name }}" with winnings of {{ investment.data.amount }}
      </p>
    </div>

    <!--Others-->
    <div v-if="investment.data.type === InvestmentTypes.Other">
      <p class="text-sm">
        {{ investment.data.buyPosition ? "Bought" : "Sold" }} {{ investment.data.name }} for {{
          investment.data.price.toLocaleString() }}
      </p>
    </div>
  </div>
</template>