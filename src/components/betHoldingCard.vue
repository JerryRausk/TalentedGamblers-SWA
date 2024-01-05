<script setup lang="ts">
import { NotSettledBetInvestMent } from "@/types/investments";

defineProps<{
  notSettledBet: NotSettledBetInvestMent
}>();
</script>
<template>
  <div class="flex flex-col justify-between border rounded p-1 align-middle text-center min-w-28 bg-red-950 bg-opacity-50">
    <p>Bet</p>
    <div>
      <p v-if="notSettledBet.odds" class="text-xs text-muted-foreground mt-2">odds: {{ notSettledBet.odds }}</p>
      <p class="text-sm">amount: {{ notSettledBet.amount }}</p>
    </div>
  </div>
</template>