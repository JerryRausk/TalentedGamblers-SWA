<script setup lang="ts">
import InvestmentCard from "@/components/InvestmentCard.vue";
import InvestmentForm from "./forms/InvestmentForm.vue";
import { useInvestmentStore } from "../stores/InvestmentStore.js";
import { Investment } from "@/models/investments";
import { onMounted, ref } from "vue";
import { Skeleton } from "@/components/ui/skeleton";
const investmentStore = useInvestmentStore();
const loading = ref(true);
async function addInvestment(investment: Investment) {
    const res = await investmentStore.addInvestment(investment);
    if (!res) {
        console.error("Show banner of failed investment")
    }
}
onMounted(async () => {
    await investmentStore.refreshInvestments();
    loading.value = false;
})

const people = [
    {
        name: "Jerry Rausk",
        cash: 500,
        invested: 790
    },
    {
        name: "Dino Gazibegovic",
        cash: 0,
        invested: 1240
    },
    {
        name: "Richard Persson",
        cash: 0,
        invested: 240
    },
]
</script>
<template>
    <div class="px-2">
        <div>
            <div v-for="p of people">
                <h3>{{ p.name }}</h3>
            </div>
        </div>
        <!--Skeleton stuff-->
        <div v-if="loading" class="flex flex-col gap-2">
            <div class="p-2 animate-pulse rounded-md border-solid border-2 border-secondary h-[70px]">
                <Skeleton class="w-[200px] h-[20px] rounded-full" />
                <Skeleton class="w-[100px] h-[15px] rounded-full mt-2" />
            </div>
            <div class="p-2 animate-pulse rounded-md border-solid border-2 border-secondary h-[70px]">
                <Skeleton class="w-[200px] h-[20px] rounded-full" />
                <Skeleton class="w-[100px] h-[15px] rounded-full mt-2" />
            </div>
            <div class="p-2 animate-pulse rounded-md border-solid border-2 border-secondary h-[70px]">
                <Skeleton class="w-[200px] h-[20px] rounded-full" />
                <Skeleton class="w-[100px] h-[15px] rounded-full mt-2" />
            </div>
        </div>
        <div v-else>
            <!-- Investment list -->
            <div class="flex flex-col gap-2 pt-2">
                <InvestmentCard v-for="investment in investmentStore.investments" :investment="investment" />
            </div>
            <!-- Investment form -->
            <InvestmentForm @new-investment="addInvestment" />
        </div>
    </div>
</template>