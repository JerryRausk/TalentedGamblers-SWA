<script setup lang="ts">
import { Button } from "@/src/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/src/components/ui/dialog'
import { ref, watch } from "vue";
import { useInvestmentStore } from "@/src/stores/InvestmentStore";
import { Input } from "@/src/components/ui/input";
import { postJson } from "@/src/services/apiService";
import { TickerSuggestion } from "@/types/dbTypes";

const investmentStore = useInvestmentStore();
const props = defineProps<{
  userId: string,
  leagueId: string,
  oldTicker: string
}>();
const open = ref(false);
const newTicker = ref("");
const suggestions = ref<TickerSuggestion[]>([]);
async function handleSubmit() {
  await investmentStore.updateStockTicker({
    oldTicker: props.oldTicker,
    newTicker: newTicker.value,
    userId: props.userId,
    leagueId: props.leagueId
  })
  open.value = false;
}
watch(open, async (newVal) => {
  if(newVal === false) return;
  const res = await postJson<{ticker: string}, TickerSuggestion[]>("getStockTickerSuggestions", {ticker: props.oldTicker})
  if(!res.success) return;
  suggestions.value = res.data;
});
</script>
<template>
  <div class="flex flex-col justify-between border rounded align-middle text-center min-w-28 bg-opacity-50 p-2 gap-2">
  <p>{{ oldTicker }}</p>
  <Dialog v-model:open="open">
    <DialogTrigger>
      <Button class="h-8">Fix</Button>
    </DialogTrigger>
    <DialogContent class="max-w-[90%] rounded flex flex-col">
      <DialogHeader>
        <DialogTitle class="text-2xl">Update stock ticker</DialogTitle>
        <DialogDescription>
          {{ oldTicker }} is invalid and needs to be updated
        </DialogDescription>
      </DialogHeader>
      <Input type="text" v-model="newTicker" placeholder="New ticker" list="tickerSuggestions"/>
      <datalist id="tickerSuggestions">
        <option v-for="s in suggestions" :value="s.ticker">{{ s.longName }} ({{ s.market }})</option>
      </datalist>
      <span class="text-xs">To find the correct ticker please visit <a class="text-blue-600" target="_blank" href="https://finance.yahoo.com/">Yahoo</a></span>
      <div class="flex justify-between mt-4">
      <Button class="font-bold bg-green-200 flex flex-col" @click="handleSubmit">
        <p>Fix</p>
      </Button>
      <Button class="font-bold" variant="outline" @click="open = false">
        Cancel
      </Button>
      </div>
    </DialogContent>
  </Dialog>
</div>

</template>