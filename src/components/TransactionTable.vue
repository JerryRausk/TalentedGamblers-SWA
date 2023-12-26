<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import toolTippedText from "@/components/ui/text-with-tooltip.vue"
const mockData = [
    {
        type: "stock",
        position: "buy",
        reference: "ASSA",
        aPrice: 13,
        amount: 44,
        date: "2023-12-26",
        verified: true,
        verifiedBy: "namn@person.se"
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
  <Table>
    <TableCaption>A list of your recent invoices.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead class="w-[125px]">
          Date
        </TableHead>
        <TableHead class="w-[50px]">
          Pos
        </TableHead>
        <TableHead class="text-center">Verified</TableHead>
        <TableHead>Reference</TableHead>
        <TableHead class="text-right">
          Amount
        </TableHead>
        <TableHead>Price</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="d of mockData">
        <TableCell class="font-medium">
          {{d.date}}
        </TableCell>
        <TableCell>{{d.position.toUpperCase()}}</TableCell>
        <TableCell class="text-center">
          <toolTippedText :text="d.verified ? '✅' : '❌'" :tooltip="d.verifiedBy ?? 'Not yet verified'" /> 
        </TableCell>
        <TableCell>{{d.reference}}</TableCell>
        <TableCell class="text-right">
          {{d.amount}}
        </TableCell>
        <TableCell class="text-right">
          {{d.aPrice}}
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>