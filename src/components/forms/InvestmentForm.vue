<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'
import { Button } from '@/src/components/ui/button'
import { ref } from "vue";
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { cn } from "@/src/lib/utils"
import { Calendar } from '@/src/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/ui/popover'
import StockSubForm from './StockSubForm.vue';
import BetSubForm from './BetSubForm.vue';
import { InvestmentTypes } from '@/types/investments';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/src/components/ui/dialog'
import { useInvestmentStore } from "@/src/stores/InvestmentStore";
import { League } from "@/types/league"
import { useToast } from '@/src/components/ui/toast/use-toast'

const investmentStore = useInvestmentStore();
const {toast} = useToast();
const props = defineProps<{
    userEmail: string,
    league: League
}>();

const investmentType = ref("stock");
const investmentDate = ref(new Date().toLocaleDateString("sv-SE"));
const open = ref(false);

async function handleStockInvestment(buyPosition: boolean, ticker: string, amount: number, price: number) {
    const invRes = await investmentStore.addInvestment({
        id: "",
        userId: props.userEmail,
        leagueId: props.league.id,
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
    if(!invRes) {
        toast({title: "Failed to submit new investment", description: "Try again or try something else", variant: "destructive"})
    } else {
        open.value = false;
    }
}

async function handleBetInvestment(uniqueId: string, amount: number, odds: number, expiryDate: string) {
    console.log(uniqueId, amount, odds, expiryDate)
}

</script>

<template>
    <Dialog  v-model:open="open">
        <DialogTrigger>
            <Button class="text-xl" variant="ghost">+</Button>
        </DialogTrigger>
        <DialogContent class="max-w-[90%] rounded flex flex-col">
            <DialogHeader>
                <DialogTitle class="text-2xl">Add investment</DialogTitle>
                <DialogDescription>
                    {{ league.name }}
                </DialogDescription>
            </DialogHeader>
            <div aria-describedby="Investment form" class="mx-auto mt-4 flex justify-between w-full">
                <Select v-model="investmentType">
                    <SelectTrigger class="w-32 text-base">
                        <SelectValue placeholder="Type of investment" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="stock">
                            Stock
                        </SelectItem>
                        <SelectItem value="bet">
                            Bet
                            </SelectItem>
                        <SelectItem value="other">
                            Other
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Popover>
                    <PopoverTrigger as-child>
                        <Button class="text-base" :variant="'outline'" :class="cn(
                            'justify-start text-left font-normal',
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
            <StockSubForm v-if="investmentType === 'stock' && investmentStore.holdings" :holdings="investmentStore.holdings"  @form-submit="handleStockInvestment" @cancel="open = false" />
            <BetSubForm v-if="investmentType === 'bet'" @form-submit="handleBetInvestment" />
        </DialogContent>
    </Dialog>
</template>