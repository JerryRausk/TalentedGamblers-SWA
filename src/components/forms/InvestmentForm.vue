<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { Button } from '@/src/components/ui/button'
import { ref } from "vue";
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { cn } from "@/src/lib/utils"
import { Calendar } from '@/src/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover'
import StockSubForm from './StockSubForm.vue';
import { InvestmentTypes } from '@/types/investments';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/ui/dialog'
import { useInvestmentStore } from "@/src/stores/InvestmentStore";

const investmentStore = useInvestmentStore();

const props = defineProps<{
    userEmail: string,
    leagueId: string
}>();

const investmentType = ref("stock");
const investmentDate = ref(new Date().toLocaleDateString("sv-SE"));
const open = ref(false);

function handleStockInvestment(buyPosition: boolean, ticker: string, amount: number, price: number) {
    investmentStore.addInvestment({
        id: "",
        userId: props.userEmail,
        leagueId: props.leagueId,
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
    open.value = false;
}

</script>

<template>
    <Dialog v-model:open="open">
        <DialogTrigger>
            <Button class="text-xl" variant="ghost">+</Button>
        </DialogTrigger>
        <DialogContent class="max-w-[95%] rounded" aria-describedby="undefined">
            <DialogHeader>
                <DialogTitle>Add investment</DialogTitle>
            </DialogHeader>
            <div class="max-w-[310px] mx-auto mt-4 flex justify-between gap-10">
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
            <StockSubForm v-if="investmentType === 'stock'" @form-submit="handleStockInvestment" @cancel="open = false" />
        </DialogContent>
    </Dialog>
</template>