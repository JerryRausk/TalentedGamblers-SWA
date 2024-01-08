<script setup lang="ts">
import { BetInvestment } from '@/types/investments';
import LeaderboardCard from "@/src/components/leaderboardCard.vue";
import { useInvestmentStore } from '@/src/stores/InvestmentStore.js';
import { ref, computed, onMounted } from "vue";
import { User } from '@auth0/auth0-vue';
import { League } from "@/types/league"
import { Skeleton } from "@/src/components/ui/skeleton"

const props = defineProps<{
  activeLeague: League,
  user: User
}>();
const investmentStore = useInvestmentStore();

const loading = ref(true);
const leaderBoardSorted = computed(() => {
  if (!investmentStore.leagueHoldings) return [];
  investmentStore.leagueHoldings.sort((a, b) => {
    const aHoldings = a.cashHoldings
      + a.betHoldings.reduce((acc, curr) => acc += (curr.data as BetInvestment).amount, 0)
      + a.otherInvestmentsHoldings.reduce((acc, curr) => acc += curr.buyPrice, 0)
      + a.stockHoldings.reduce((acc, curr) => acc += curr.averageBuyPrice * curr.heldAmount, 0)

    const bHoldings = b.cashHoldings
      + b.betHoldings.reduce((acc, curr) => acc += (curr.data as BetInvestment).amount, 0)
      + b.otherInvestmentsHoldings.reduce((acc, curr) => acc += curr.buyPrice, 0)
      + b.stockHoldings.reduce((acc, curr) => acc += curr.averageBuyPrice * curr.heldAmount, 0)

    return bHoldings - aHoldings
  })
  return investmentStore.leagueHoldings
});

onMounted(async () => {
    if(!props.user.email) {
      loading.value = false;
      return;
    }
    await investmentStore.refreshInvestmentData(props.activeLeague.id, props.user.email);
    loading.value = false;
})
</script>

<template>
    <div class="flex-row gap-4">
      <div class="flex-col w-full">
        <div class=" rounded p-2  gap-2 flex flex-col">
          <h4 class="text-sky-300">Leaderboard</h4>
          <div class="border-l pl-2">
            <ol class="text-sm list-decimal ml-4 flex flex-col gap-2">
              <Skeleton v-if="loading" v-for="_ in [1, 2, 3]" class="w-36 h-10 rounded ml-[-1rem]" />
              <li v-else v-for="lh in leaderBoardSorted">
                <LeaderboardCard :holdings="lh"/>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
</template> 