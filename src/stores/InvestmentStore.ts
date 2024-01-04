import { defineStore } from "pinia";
import { ref } from "vue";
import { Investment, AddInvestmentDTO, Holdings, LeagueInvestmentsDTO } from "@/types/investments.js"
import { postJson } from "@/src/services/apiService.js";


export const useInvestmentStore = defineStore('investments', () => {
  const userHoldings = ref<Holdings | null>(null)
  const userInvestments = ref<Investment[]>([]);
  const leagueInvestments = ref<Investment[]>([]);
  const leagueHoldings = ref<Holdings[] | null>(null)

  async function addInvestment(investment: Investment) {
    const res = await postJson<Investment, AddInvestmentDTO>("addInvestment", investment);
    if(!res.success) {
      console.error("Ultra error not good when adding investment.")
      return false
    }
    console.log(res.data);
    userInvestments.value = res.data.leagueInvestments.investments.filter(i => i.userId === investment.userId)
    userHoldings.value = res.data.leagueInvestments.holdings.filter(h => h.userId === investment.userId)[0]
    leagueHoldings.value = res.data.leagueInvestments.holdings;
    leagueInvestments.value = res.data.leagueInvestments.investments;
    return true;
  }

  async function refreshInvestments(leagueId: string) {
    userInvestments.value = []
    
    const res = await postJson<any, Investment[]>("getInvestments", {leagueId})
    if(!res.success) {
      console.error("Ultra error not good when fetching investments");
      return false;
    }
    userInvestments.value = res.data;
    return true;
  }

  async function refreshInvestmentData(leagueId: string, userId: string) {
    leagueInvestments.value = [];
    leagueHoldings.value = null;
    userInvestments.value = [];
    userHoldings.value = null;
    const res = await postJson<any, LeagueInvestmentsDTO>("getLeagueInvestments", {
      leagueId
    })
    if(!res.success) {
      console.error("Ultra error not good when fetching league investments");
      return false;
    }
    leagueInvestments.value = res.data.investments;
    leagueHoldings.value = res.data.holdings;
    userHoldings.value = res.data.holdings.filter(h => h.userId === userId)[0];
    userInvestments.value = res.data.investments.filter(i => i.userId === userId);
    return true;
  }

  async function refreshHoldings(leagueId: string) {
    userHoldings.value = null;

    const res = await postJson<{leagueId: string}, Holdings>("getUserHoldings", {leagueId})
    if(!res.success) {
      console.error("Ultra error not good when fetching holdings");
      return false;
    }
    userHoldings.value = res.data;
  }
  return { investments: userInvestments, leagueInvestments, leagueHoldings, addInvestment, userHoldings, refreshInvestments, refreshHoldings, refreshInvestmentData }
})