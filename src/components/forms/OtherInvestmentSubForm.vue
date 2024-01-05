<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import SwitchNoOff from '@/src/components/ui/switch/SwitchNoOff.vue'
import { Holdings } from '@/types/investments'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'

const emits = defineEmits<{
    (e: "formSubmit", name: string, amount: number, buyPosition: boolean): void
    (e: "cancel"): void
}>();
const props = defineProps<{
    holdings: Holdings
}>();

const formSchema = toTypedSchema(z.object({
    name: z.string().min(2).max(50),
    price: z.number().positive(),
    buyPosition: z.boolean().default(true),
}))

const form = useForm({
    validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(({ name, price, buyPosition }) => {
    let err = false;
    if (buyPosition && price > props.holdings.cashHoldings) {
        err = true;
        form.setFieldError("price", "You can't afford this.")
    }

    if (!err) {
        emits(
            "formSubmit",
            name,
            price,
            buyPosition
        )
    }
}
)

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
                        <SwitchNoOff :disabled="holdings.otherInvestmentsHoldings.length === 0" :checked="value" @update:checked="handleChange" />
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

        <FormField v-slot="{ componentField }" name="name">
            <FormItem class="mt-4">
                <FormLabel>Name</FormLabel>
                <FormControl>
                    <Input v-if="form.values.buyPosition === true" class="text-base" type="text"
                        placeholder="Give your investment an identifiable name" v-bind="componentField" />
                    <Select v-else v-bind="componentField">
                        <SelectTrigger>
                            <SelectValue placeholder="Choose investment to sell" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="holding in holdings.otherInvestmentsHoldings" :value="holding.name">
                                {{ holding.name }} (bought for {{ holding.buyPrice }})
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="price">
            <FormItem class="mt-4">
                <FormLabel>Price</FormLabel>
                <FormControl>
                    <Input class="text-base" type="number" placeholder="Invested amount" v-bind="componentField" />
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