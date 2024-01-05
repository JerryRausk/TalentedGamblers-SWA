<script setup lang="ts">
import { InvestmentTypes, Investment } from "@/types/investments.js";
defineProps<{
  investment: Investment
}>();
</script>

<template>
  <div class="border border-secondary p-2 rounded" v-if="investment.data.type === InvestmentTypes.Stock">
    <div class="flex flex-row justify-between mb-2">
      <p class="text-md">
        {{ investment.userId.split("@")[0] }}
      </p>
      <p class="text-muted-foreground text-xs">{{ investment.date }}</p>
    </div>

    <p class="text-sm">
      {{ investment.data.buyPosition ? "Bought" : "Sold" }} {{ investment.data.amount }} of {{ investment.data.ticker }}
      at {{
        investment.data.price.toLocaleString() }}, totaling {{ (investment.data.price *
    investment.data.amount).toLocaleString() }}
    </p>
  </div>
  <div class="border border-secondary p-2 rounded" v-if="investment.data.type === InvestmentTypes.Bet">
    <div class="flex flex-row justify-between mb-2">
      <p class="text-md">
        {{ investment.userId.split("@")[0] }}
      </p>
      <p class="text-muted-foreground text-xs">{{ investment.date }}</p>
    </div>

    <p class="text-sm">
      Bet {{ investment.data.amount }} with odds {{ investment.data.odds }}, expires {{ investment.data.expiryDate }}
    </p>
  </div>
  <div class="border border-secondary p-2 rounded" v-if="investment.data.type === InvestmentTypes.Other">
    <div class="flex flex-row justify-between mb-2">
      <p class="text-md">
        {{ investment.userId.split("@")[0] }}
      </p>
      <p class="text-muted-foreground text-xs">{{ investment.date }}</p>
    </div>

    <p class="text-sm">
      {{ investment.data.buyPosition ? "Bought" : "Sold" }} {{ investment.data.name }} for {{ investment.data.price.toLocaleString() }}
    </p>
  </div>
</template>