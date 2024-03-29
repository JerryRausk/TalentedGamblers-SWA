<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import SwitchNoOff from '@/src/components/ui/switch/SwitchNoOff.vue'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Holdings, MarketSuffix } from '@/types/investments'
import { ref } from "vue";
import { postJson } from "@/src/services/apiService"
import { Checkbox } from "@/src/components/ui/checkbox"

const INVALID_TICKER_ERROR = "Ticker is not valid"

const emits = defineEmits<{
  (e: "formSubmit", buyPosition: boolean, ticker: string, amount: number, price: number): void
  (e: "cancel"): void
}>();

const props = defineProps<{
  holdings: Holdings
}>();

const generalError = ref([] as string[]);
const forceTicker = ref(false);
const formSchema = toTypedSchema(z.object({
  market: z.string().default(".ST"),
  ticker: z.string().min(2).max(50),
  buyPosition: z.boolean().default(true),
  amount: z.number().int().positive(),
  price: z.number().positive()
}))

const form = useForm({
  validationSchema: formSchema,
})

async function isTickerValid(internationalTicker: string) {
  const res = await postJson<Record<string,string>, boolean>("validateStockTicker", {ticker: internationalTicker})
  if(!res.success) return false;
  if(!res.data) return false;
  return true;
}

const onSubmit = form.handleSubmit(async ({ buyPosition, ticker, amount, price, market }) => {
  generalError.value = [];
  let err = false;

  if (buyPosition && price > props.holdings.cashHoldings) {
    err = true;
    form.setFieldError("price", "You can't afford that")
  }

  if (!buyPosition) {
    const heldOfSelected = props.holdings.stockHoldings.filter(s => s.ticker === ticker)[0].heldAmount
    if (amount > heldOfSelected) {
      err = true;
      form.setFieldError("amount", "You don't own that many")
    }
  }

  if(!market) {
    err = true;
    generalError.value.push("Select a market")
  }

  if(err) return; // We dont want to make calls to external api's if we are not sure that the data is sane.

  const reFormattedBuyTicker = (ticker + market).trim();
  if (buyPosition && !forceTicker.value) {
    const tickerIsValid = await isTickerValid(reFormattedBuyTicker);
    if(!tickerIsValid) {
      err = true;
      generalError.value.push(INVALID_TICKER_ERROR)
    }
  }

  if (!err) {
    emits(
      "formSubmit",
      buyPosition,
      buyPosition ? reFormattedBuyTicker.toUpperCase() : ticker.toUpperCase(),
      amount,
      price
    )
  }
})
</script>
<template>
  <form @submit="onSubmit">
    <FormField v-slot="{ value, handleChange }" name="buyPosition">
      <FormItem class="mt-4">
        <div class="flex row gap-4 justify-center">
          <FormLabel>
            <p class="text-base" :class="value ? 'text-muted-foreground' : 'underline'">Sell</p>
          </FormLabel>
          <FormControl>
            <SwitchNoOff :disabled="holdings.stockHoldings.length === 0" :checked="value" @update:checked="handleChange" />
          </FormControl>
          <FormLabel>
            <p class="text-base" :class="value ? '' : 'text-muted-foreground'">
              <span :class="value ? 'underline' : ''">Buy</span>
              <span class="text-xs ml-2">( {{ holdings.cashHoldings.toLocaleString() }} available )</span>
            </p>
          </FormLabel>
        </div>
      </FormItem>
    </FormField>

    <div class="flex flex-row gap-4">
      <FormField v-if="form.values.buyPosition === true" v-slot="{ componentField }" name="market" >
      <FormItem class="mt-4">
        <FormLabel>Market</FormLabel>
        <FormControl>
          <Select v-bind="componentField" >
            <SelectTrigger>
              <SelectValue placeholder="Market" class="text-left w-24" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="[k, v] in Object.entries(MarketSuffix)" :value="v">
                {{ k }}
              </SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="ticker">
      <FormItem class="mt-4 w-full">
        <FormLabel>Ticker</FormLabel>
        <FormControl>
          <Input class="text-base" v-if="form.values.buyPosition === true" placeholder="AAPL etc."
            v-bind.string="componentField" />
          <Select v-else v-bind="componentField" class="w-full">
            <SelectTrigger>
              <SelectValue placeholder="Choose stock to sell" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="holding in holdings.stockHoldings" :value="holding.ticker">
                {{ holding.ticker }} (holding {{ holding.heldAmount }})
              </SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    </div>
    <div class="mt-2">
      <span class="text-sm text-muted-foreground" v-if="form.values.market && form.values.ticker && form.values.buyPosition === true">Derived int. ticker {{ form.values.ticker.toUpperCase() + form.values.market }}</span>
    </div>
    

    <FormField v-slot="{ componentField }" name="amount">
      <FormItem class="mt-4">
        <FormLabel>Amount</FormLabel>
        <FormControl>
          <Input class="text-base" type="number" placeholder="Number of stocks traded" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="price">
      <FormItem class="mt-4">
        <FormLabel>Price with fees</FormLabel>
        <FormControl>
          <Input class="text-base" step="0.01" type="number" placeholder="Total price" v-bind.number="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <span class="text-sm text-muted-foreground" v-if="form.values.price && form.values.amount">Price per unit {{ Math.round(form.values.price / Number(form.values.amount) * 10000) / 10000 }}
    </span>
    <div class="mt-4">
      <span v-for="err in generalError" class="text-destructive text-base">- {{ err }}</span>
    </div>
    <div class="mt-2" v-if="generalError.includes(INVALID_TICKER_ERROR)">
      <Checkbox v-model:checked="forceTicker" />
      <span class="text-sm ml-2 align-text-top">Override ticker validation</span>
    </div>
    <div class="flex flex-row justify-between mt-8">
      <Button class="font-bold bg-green-200" type="submit">
        Add
      </Button>
      <Button class="font-bold" variant="outline" @click="emits('cancel')">
        Cancel
      </Button>
    </div>

  </form>
</template>