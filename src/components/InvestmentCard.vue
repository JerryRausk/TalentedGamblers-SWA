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
        {{ investment.userId }}
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
</template>