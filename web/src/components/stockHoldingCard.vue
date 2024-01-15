<script setup lang="ts">
import { StockHolding } from "@/types/investments"
defineProps<{
  stockHolding: StockHolding
}>();
</script>
<template>
  <div class="flex flex-col justify-between border rounded p-1 align-middle  text-center min-w-24 bg-green-950 bg-opacity-50">
    <p>{{ stockHolding.ticker }}</p>
    <div>
      <p class="text-xs text-muted-foreground mt-2">({{ stockHolding.heldAmount }} * {{ Math.round(stockHolding.averageBuyPrice * 10000) / 10000 }}</p>
      <p class="text-sm">{{ (stockHolding.heldAmount * stockHolding.averageBuyPrice).toLocaleString() }}</p>

    </div>
  </div>
</template>