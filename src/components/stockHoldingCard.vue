<script setup lang="ts">
import { StockHolding } from "@/types/investments"
defineProps<{
  stockHolding: StockHolding
}>();
</script>
<template>
  <div class="flex flex-col border rounded p-1 align-middle justify-center text-center min-w-14">
    <p>{{ stockHolding.ticker }}</p>
    <p class="text-xs mt-2">{{ stockHolding.heldAmount }}</p>
  </div>
</template>