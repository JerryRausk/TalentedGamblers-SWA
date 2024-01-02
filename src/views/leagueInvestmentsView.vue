<script setup lang="ts">
import InvestmentCard from "@/src/components/InvestmentCard.vue"
import { useInvestmentStore } from '@/src/stores/InvestmentStore.js';
import { useLeagueStore } from "@/src/stores/LeagueStore.js";
import { ref, onMounted } from "vue";

const investmentStore = useInvestmentStore();
const leagueStore = useLeagueStore();
const investmentsLoading = ref(true);
onMounted(async () => {
    if (!leagueStore.activeLeague) return; //TODO: Display error or something here....
    await investmentStore.refreshLeagueInvestments(leagueStore.activeLeague.id, 0);
    investmentsLoading.value = false;
})
</script>

<template>
    <div class="p-2 flex flex-col gap-2">
        <div v-for="li in investmentStore.leagueInvestments">
            <InvestmentCard :investment="li" />
        </div>
    </div>
</template> 