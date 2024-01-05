<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover'
import { cn } from "@/src/lib/utils"
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { Calendar } from '@/src/components/ui/calendar'
import { ref } from "vue";
import { Checkbox } from "@/src/components/ui/checkbox";

const emits = defineEmits<{
  (e: "formSubmit", name: string, amount: number, odds: number | null, expiryDate: string): void
  (e: "cancel"): void
}>();

const hasOdds = ref(false);
const formSchema = toTypedSchema(z.object({
  name: z.string().min(2).max(50),
  amount: z.number().positive(),
  odds: z.number().positive().optional(),
  expiryDate: z.date()
}))

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(({ name: name, amount, odds, expiryDate }) => {
  let err = false;
  if (hasOdds.value && (!odds || odds <= 0)) {
    err = true;
    form.setFieldError("odds", "Odds should be > 0")
  }

  if(!err) {emits(
    "formSubmit",
    name,
    amount,
    odds && odds > 0 ? odds : null,
    expiryDate.toLocaleDateString()
  )}
}
)

</script>
<template>
  <form @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem class="mt-4">
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input class="text-base" type="text" placeholder="Give your bet an identifiable name" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="amount">
      <FormItem class="mt-4">
        <FormLabel>Amount</FormLabel>
        <FormControl>
          <Input class="text-base" type="number" placeholder="Bet amount" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="odds">
      <FormItem class="mt-4">
        <FormLabel>Odds (if fixed odds)</FormLabel>

        <FormControl>
          <div class="flex flex-row gap-2 align-middle h-10">
            <Checkbox class="my-auto" v-model:checked="hasOdds" />
            <Input v-show="hasOdds" class="text-base my-auto" step="0.0000001" type="number" placeholder="Odds"
              v-bind="componentField" />
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>



    <FormField v-slot="{ componentField }" name="expiryDate">
      <FormItem class="mt-4">
        <FormLabel>Expires at</FormLabel>
        <Popover>
          <PopoverTrigger as-child>
            <FormControl>
              <Button class="text-base" :variant="'outline'" :class="cn(
                'justify-start text-left font-normal w-full',
                !componentField && 'text-muted-foreground',
              )">
                <CalendarIcon class="mr-2 h-4 w-4" />
                <span>{{ componentField.modelValue ? componentField.modelValue.toLocaleDateString() : "Select Date"
                }}</span>
              </Button>
            </FormControl>

          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <Calendar :masks="{ modelValue: 'YYYY-MM-DD' }" v-bind="componentField" />
          </PopoverContent>
        </Popover>
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