<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import SwitchNoOff from '@/src/components/ui/switch/SwitchNoOff.vue'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Holdings } from '@/types/investments'

const emits = defineEmits<{
  (e: "formSubmit", buyPosition: boolean, ticker: string, amount: number, price: number): void
  (e: "cancel"): void
}>();

const props = defineProps<{
  holdings: Holdings
}>();
const formSchema = toTypedSchema(z.object({
  ticker: z.string().min(2).max(50),
  buyPosition: z.boolean().default(true),
  amount: z.number().int().positive(),
  price: z.number().positive()
}))

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(({ buyPosition, ticker, amount, price }) => {
  let err = false;
  if (buyPosition && amount * price > props.holdings.cashHoldings) {
    err = true;
    form.setFieldError("amount", "You can't afford this.")
  }

  if (!buyPosition) {
    const heldOfSelected = props.holdings.stockHoldings.filter(s => s.ticker === ticker)[0].heldAmount
    if (amount > heldOfSelected) {
      err = true;
      form.setFieldError("amount", "You don't own that many")
    }
  }

  if (!err) {
    emits(
      "formSubmit",
      buyPosition,
      ticker.toUpperCase(),
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

    <FormField v-slot="{ componentField }" name="ticker">
      <FormItem class="mt-4 w-auto">
        <FormLabel>Ticker</FormLabel>
        <FormControl>
          <Input class="text-base" v-if="form.values.buyPosition === true" placeholder="APL, VOLV-B, FING-B, etc..."
            v-bind.string="componentField" />
          <Select v-else v-bind="componentField">
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
        <FormLabel>Price</FormLabel>
        <FormControl>
          <Input class="text-base" step="0.01" type="number" placeholder="Traded price" v-bind.number="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

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