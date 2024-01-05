<script setup lang="ts">
import {OtherInvestmentHolding} from "@/types/investments";
defineProps<{
    otherHolding: OtherInvestmentHolding
}>();
</script>
<template>
<div class="flex flex-col justify-between border rounded p-1 align-middle text-center min-w-24 bg-violet-950 bg-opacity-50">
    <p>{{ otherHolding.name }}</p>
    <p class="mt-2">{{ otherHolding.buyPrice.toLocaleString() }}</p>
  </div>
</template>