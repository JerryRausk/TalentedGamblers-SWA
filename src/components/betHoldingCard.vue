<script setup lang="ts">
import { NotSettledBetInvestMent } from "@/types/investments";

defineProps<{
  notSettledBet: NotSettledBetInvestMent
}>();
</script>
<template>
  <div class="flex flex-col border rounded p-1 align-middle justify-center text-center min-w-14">
    <p>Bet</p>
    <p class="text-xs mt-2">{{ notSettledBet.amount }} @ {{ notSettledBet.odds }}</p>
  </div>
</template>