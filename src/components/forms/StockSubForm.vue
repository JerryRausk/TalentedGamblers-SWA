<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import SwitchNoOff from '@/components/ui/switch/SwitchNoOff.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const emits = defineEmits<{
    (e: "formSubmit", buyPosition: boolean, ticker: string, amount: number, price: number): void
    (e: "cancel"): void
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

const onSubmit = form.handleSubmit((values) => {
    emits("formSubmit", values.buyPosition, values.ticker, values.amount, values.price)
})
</script>
<template>
    <form @submit="onSubmit">
        <FormField v-slot="{ value, handleChange }" name="buyPosition">
            <FormItem class="mt-4">
                <div class="flex row gap-4">
                    <FormLabel>
                        <p :class="value ? 'text-muted-foreground' : 'underline'">Sell</p>
                    </FormLabel>
                    <FormControl>
                        <SwitchNoOff :checked="value" @update:checked="handleChange" />
                    </FormControl>
                    <FormLabel>
                        <p :class="value ? 'underline' : 'text-muted-foreground'">Buy</p>
                    </FormLabel>
                </div>

            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="ticker">
            <FormItem class="mt-4 w-auto">
                <FormLabel>Ticker</FormLabel>
                <FormControl>
                    <Input placeholder="APL, VOLV-B, FING-B, etc..." v-bind.string="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>


        <FormField v-slot="{ componentField }" name="amount">
            <FormItem class="mt-4">
                <FormLabel>Amount</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="Number of stocks traded" v-bind="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <FormField v-slot="{ componentField }" name="price">
            <FormItem class="mt-4">
                <FormLabel>Price</FormLabel>
                <FormControl>
                    <Input step="0.01" type="number" placeholder="Traded price" v-bind.number="componentField" />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>
        <div class="flex flex-row justify-between mt-8">
            <Button class=" bg-green-200" type="submit">
                Add
            </Button>
            <Button variant="outline" @click="emits('cancel')">
                Cancel
            </Button>
        </div>

    </form>
</template>