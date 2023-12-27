<script setup lang="ts">
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ref } from "vue";
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { cn } from "@/lib/utils"
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import StockSubForm from './StockSubForm.vue';


const transactionType = ref("stock");
const transactionDate = ref(new Date().toLocaleDateString("sv-SE"));
function handleStockTransaction(buyPosition: boolean, ticker: string, amount: number, price: number) {
    console.log("Handling stock form");
    console.log(transactionType.value);
    console.log(transactionDate.value);
    console.log({buyPosition})
    console.log({ticker})
    console.log({amount})
    console.log({price})

}
</script>

<template>
    <Card class="max-w-[360px] mx-auto mt-4">
        <CardHeader>
            <CardTitle>Add transaction</CardTitle>
        </CardHeader>
        <CardContent>
            <div class="flex row justify-between gap-10">
                <Select v-model="transactionType">
                    <SelectTrigger>
                        <SelectValue placeholder="Type of transaction" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="stock">
                            Stock
                        </SelectItem>
                        <SelectItem value="other">
                            Other
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Popover>
                    <PopoverTrigger as-child>
                        <Button :variant="'outline'" :class="cn(
                            'w-[280px] justify-start text-left font-normal',
                            !transactionDate && 'text-muted-foreground',
                        )">
                            <CalendarIcon class="mr-2 h-4 w-4" />
                            <span>{{ transactionDate }}</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                        <Calendar :masks="{modelValue: 'YYYY-MM-DD'}" v-model.string="transactionDate" />
                    </PopoverContent>
                </Popover>
            </div>
            <StockSubForm v-if="transactionType==='stock'" @form-submit="handleStockTransaction"/>
        </CardContent>
        <CardFooter>
        </CardFooter>

    </Card>
</template>