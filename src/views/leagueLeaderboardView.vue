<script setup lang="ts">
import { BetInvestment, Investment } from '@/types/investments';
import LeaderboardCard from "@/src/components/leaderboardCard.vue";
import { useInvestmentStore } from '@/src/stores/InvestmentStore.js';
import { ref, computed, onMounted, watch } from "vue";
import { User } from '@auth0/auth0-vue';
import { League } from "@/types/league"
import { Skeleton } from "@/src/components/ui/skeleton"
import Chart, { ChartItem } from 'chart.js/auto'
import { calculateTotalHoldingValue } from "@/shared/calculator.js"

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

const userColors: any = {
  hardColors: ["orange", "yellow", "green"],
  getColor (user: string): string {
    if(!Object.keys(this).includes(user)) {
      const color = this.hardColors.pop() ?? "#" + Math.floor(Math.random()*16777215).toString(16);
      this[user] = color
    }
    return this[user] as string;
  }
}

const dates = [0, 1, 2, 3, 4].map(i => new Date(new Date().getTime() - i * 86400000).toISOString().substring(0, 10)).reverse()
async function getUserHoldingsForDate(userId: string, date: string, investments: Investment[]) {
  const i = investments.filter(i => i.userId === userId && new Date(i.date) <= new Date(date))
  const h = await calculateTotalHoldingValue(i)
  return h;
} 

let staticChart: Chart | null = null;

async function renderData(labels: string[], datasets: any, chart: Chart) {
  chart.data.labels = labels
  chart.data.datasets = datasets
  chart.update()
}

watch(() => investmentStore.leagueInvestments, async () => {
  if(!investmentStore.leagueHoldings || !investmentStore.leagueInvestments || !staticChart) return;
  const uniqueUsers = investmentStore.leagueHoldings.map(h => h.userId);
  const t = await Promise.all(uniqueUsers.map(async userId => {
    return {
      label: userId,
      data: await Promise.all(dates.map(d => getUserHoldingsForDate(userId, d, investmentStore.leagueInvestments))),
      borderColor: userColors.getColor(userId)
    }
  }))
 
  await renderData(dates, t, staticChart)
}, {immediate: true})

onMounted(async () => {
  staticChart = new Chart(
    document.getElementById('leaderboard')! as ChartItem,
    {
      type: 'line',
      options: {
        elements: {
          line: {
            borderWidth: 1,
          },
          point: {
            borderWidth: 1,
            radius: 2
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      },
      data: {
        labels: [] as string[],
        datasets: []
      }
    }
  );
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
          <div><canvas id="leaderboard"></canvas></div>
          <div class="border-l pl-2">
            <ol class="text-sm list-decimal ml-4 flex flex-col gap-2">
              <Skeleton v-if="loading" v-for="_ in [1, 2, 3]" class="w-36 h-10 rounded ml-[-1rem]" />
              <li v-else v-for="lh in leaderBoardSorted">
                <LeaderboardCard :holdings="lh" :accent-color="userColors.getColor(lh.userId)"/>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
</template> 