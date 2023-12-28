<script setup lang="ts">
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ref } from "vue";
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { cn } from "@/lib/utils"
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import StockSubForm from './StockSubForm.vue';
import { Investment, InvestmentTypes } from '@/models/investments';

const emits = defineEmits<{
    (e: "newInvestment", investment: Investment): void;
}>();
const investmentType = ref("stock");
const investmentDate = ref(new Date().toLocaleDateString("sv-SE"));
function handleStockInvestment(buyPosition: boolean, ticker: string, amount: number, price: number) {
    emits("newInvestment", {
        id: "",
        date: investmentDate.value, 
        verified: false, 
        verifiedBy: null, 
        data: {
            type: InvestmentTypes.Stock,
            amount,
            price,
            buyPosition, ticker
        }
    });
}
</script>

<template>
    <Card class="max-w-[360px] mx-auto mt-4">
        <CardHeader>
            <CardTitle>Add transaction</CardTitle>
        </CardHeader>
        <CardContent>
            <div class="flex row justify-between gap-10">
                <Select v-model="investmentType">
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
                            !investmentDate && 'text-muted-foreground',
                        )">
                            <CalendarIcon class="mr-2 h-4 w-4" />
                            <span>{{ investmentDate }}</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                        <Calendar :masks="{ modelValue: 'YYYY-MM-DD' }" v-model.string="investmentDate" />
                    </PopoverContent>
                </Popover>
            </div>
            <StockSubForm v-if="investmentType === 'stock'" @form-submit="handleStockInvestment" />
        </CardContent>
        <CardFooter>
        </CardFooter>

    </Card>
</template>