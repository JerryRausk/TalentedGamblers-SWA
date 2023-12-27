<script setup lang="ts">
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
const mockData = [
  {
    type: "stock",
    position: "buy",
    reference: "ASSA",
    aPrice: 13,
    amount: 44,
    date: "2023-12-26",
    verified: true,
    verifiedBy: "jerry.rausaaaaaaaaaaaaaaaak@gmail.com"
  },
  {
    type: "stock",
    position: "sell",
    reference: "ASSA",
    aPrice: 15,
    amount: 44,
    date: "2023-12-28",
    verified: false,
    verifiedBy: null
  },
]
</script>

<template>
  <div class="ps-1 pe-3 flex flex-col gap-2 pt-2">
    <Card class="" v-for="d of mockData">
      <CardHeader class="py-2">
        <CardTitle class="text-lg my-auto">{{ d.position }} {{ d.amount }} <a
            class="text-blue-600 hover:text-blue-800 visited:text-purple-600"
            :href="`http://www.google.com/search?q=AVANZA+${d.reference}&btnI`" target="_blank">{{ d.reference }}</a> at
          {{ d.aPrice }}</CardTitle>
      </CardHeader>
      <CardFooter class="text-xs pb-2 text-gray-500 flex flex-row justify-between">
        <p>
          {{ d.date }}
        </p>
        <p class="max-w-64 truncate">
          {{ d.verified ? `Verified by ${d.verifiedBy}` : "Not verified" }}
        </p>
      </CardFooter>
    </Card>
  </div>
</template>