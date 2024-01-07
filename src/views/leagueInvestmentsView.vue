<script setup lang="ts">
import InvestmentCard from "@/src/components/InvestmentCard.vue"
import { useInvestmentStore } from '@/src/stores/InvestmentStore.js';
import { ref, onMounted, computed } from "vue";
import { User } from '@auth0/auth0-vue';
import { League } from "@/types/league";
import { Skeleton } from "@/src/components/ui/skeleton";

const props = defineProps<{
  activeLeague: League,
  user: User
}>();

const investmentStore = useInvestmentStore();
const investmentsLoading = ref(true);
const sortedInvestments = computed(() => {
  return investmentStore.leagueInvestments.sort((a, b) => a.date < b.date ? 1 : -1)
})
onMounted(async () => {
  await investmentStore.refreshInvestmentData(props.activeLeague.id, props.user.email!);
  investmentsLoading.value = false;
})
</script>

<template>
  <div class="p-2 flex flex-col gap-2">
    
    <Skeleton v-if="investmentsLoading" v-for="_ in [1, 2, 3, 4, 5]" class="w-full h-10 rounded" />
    <div v-else>
      <div v-if="sortedInvestments.length === 0">
        <p class="text-center">No investments in {{ activeLeague.name }} yet</p>
      </div>
      <div v-else v-for="li in sortedInvestments">
        <InvestmentCard :investment="li" />
      </div>
    </div>

  </div>
</template> 