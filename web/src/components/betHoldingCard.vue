<script setup lang="ts">
import { Investment, InvestmentTypes } from "@/types/investments";
import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/src/components/ui/dialog'
import { ref } from "vue";
import { useInvestmentStore } from "@/src/stores/InvestmentStore";
import { Input } from "@/src/components/ui/input";
const investmentStore = useInvestmentStore();
const props = defineProps<{
  investment: Investment
  showActions: boolean
}>();

async function handleLost() {
  const res = await investmentStore.settleBet(props.investment.id, 0, props.investment.userId);
  if (!res) {
    console.error("aint closing modal since error");
    return;
  }
  open.value = false;
}

async function handleWin() {
  // Bet with odds
  if (props.investment.data.type === InvestmentTypes.Bet && props.investment.data.odds) {
    const res = await investmentStore.settleBet(props.investment.id, props.investment.data.odds * props.investment.data.amount, props.investment.userId);
    if (!res) {
      console.error("aint closing modal since error");
      return;
    }
    open.value = false;
    return;
  }

  // Bet without odds
  if(winAmount.value === 0) {
    winAmountError.value = "Should be > 0"
    return;
  }
  const res = await investmentStore.settleBet(props.investment.id, winAmount.value, props.investment.userId);
  if (!res) {
      console.error("aint closing modal since error");
      return;
    }
    open.value = false;
    return;
}
const open = ref(false);
const winAmount = ref(0);
const winAmountError = ref("");
</script>
<template>
  <div v-if="investment.data.type === InvestmentTypes.Bet"
    class="flex flex-col justify-between border rounded align-middle text-center min-w-28 bg-opacity-50 p-2">
    <p>Bet</p>
    <div>
      <p v-if="investment.data.odds" class="text-xs text-muted-foreground">odds: {{ investment.data.odds }}</p>
      <p class="text-sm">amount: {{ investment.data.amount }}</p>
    </div>
    <div v-if="showActions === true" class="flex flex-col gap-3 mt-2">
      <Dialog v-model:open="open">
        <DialogTrigger>
          <Button class="h-8">Settle</Button>
        </DialogTrigger>
        <DialogContent class="max-w-[90%] rounded flex flex-col">
          <DialogHeader>
            <DialogTitle class="text-2xl">Settle bet</DialogTitle>
            <DialogDescription>

            </DialogDescription>
          </DialogHeader>
          Settle bet "{{ investment.data.name }}" of {{ investment.data.amount }} {{ investment.data.odds ? `with odds
          ${investment.data.odds}` : "" }}?
          <p v-if="investment.data.odds">Potential win {{ investment.data.odds * investment.data.amount }}</p>
          <div v-else>
            <p :class="winAmountError ? 'text-red-500' : ''">Win amount </p>
            <p v-if="winAmountError" class="text-xs text-red-500">{{ winAmountError }}</p>
            <Input type="number" step="0.01" v-model.number="winAmount" />
          </div>
          <div class="flex justify-between mt-4">
            <div class="flex gap-4">

              <Button class="font-bold bg-green-200 flex flex-col" @click="handleWin">
                <p>Won</p>
              </Button>
              <Button class="bg-red-200 font-bold" @click="handleLost">Lost</Button>
            </div>

            <Button class="font-bold" variant="outline" @click="open = false">
              Cancel
            </Button>
          </div>

        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>