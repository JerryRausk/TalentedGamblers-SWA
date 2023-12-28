<script setup lang="ts">
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { InvestmentTypes, Investment } from "../models/investments.js";
defineProps<{
  investment: Investment
}>();

function getVerifiedText(investment: Investment) {
  if(investment.data.type === InvestmentTypes.Stock && investment.data.buyPosition === false) {
    return investment.verified ? `Verified by ${investment.verifiedBy}` : "Not verified"
  }
  return "";
}
</script>

<template>
    <Card>
      <CardHeader class="py-2">
        <CardTitle v-if="investment.data.type === InvestmentTypes.Stock" class="text-lg my-auto">
          {{ investment.data.buyPosition ? "Bought" : "Sold" }} {{ investment.data.amount }} <a
            class="text-blue-600 hover:text-blue-800 visited:text-purple-600"
            :href="`http://www.google.com/search?q=AVANZA+${investment.data.ticker}&btnI`" target="_blank">{{ investment.data.ticker }}</a> at
          {{ investment.data.price }}
        </CardTitle>
        <CardTitle v-if="investment.data.type === InvestmentTypes.Bet" class="text-lg my-auto">
          Bet {{ investment.data.amount }} at odds {{ investment.data.odds }}, expires at {{ investment.data.expiryDate }}
        </CardTitle>
      </CardHeader>
      <CardFooter class="text-xs pb-2 text-gray-500 flex flex-row justify-between">
        <p>
          {{ investment.date }}
        </p>
        <p class="max-w-64 truncate">
          {{getVerifiedText(investment)}}
        </p>
      </CardFooter>
    </Card>
</template>