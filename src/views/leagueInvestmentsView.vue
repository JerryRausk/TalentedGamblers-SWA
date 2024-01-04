<script setup lang="ts">
import InvestmentCard from "@/src/components/InvestmentCard.vue"
import { useInvestmentStore } from '@/src/stores/InvestmentStore.js';
import { ref, onMounted } from "vue";
import { User } from '@auth0/auth0-vue';
import { League } from "@/types/league"

const props = defineProps<{
  activeLeague: League,
  user: User
}>();

const investmentStore = useInvestmentStore();
const investmentsLoading = ref(true);

onMounted(async () => {
    await investmentStore.refreshInvestmentData(props.activeLeague.id, props.user.email!);
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