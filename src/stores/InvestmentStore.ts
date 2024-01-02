import { defineStore } from "pinia";
import { ref } from "vue";
import { Investment, AddInvestmentDTO, Holdings, LeagueInvestmentsDTO } from "@/types/investments.js"
import { postJson } from "@/src/services/apiService.js";


export const useInvestmentStore = defineStore('investments', () => {
  const holdings = ref<Holdings | null>(null)
  const investments = ref<Investment[]>([]);
  const leagueInvestments = ref<Investment[]>([]);
  const leagueHoldings = ref<Holdings[] | null>(null)

  async function addInvestment(investment: Investment) {
    const res = await postJson<Investment, AddInvestmentDTO>("addInvestment", investment);
    if(!res.success) {
      console.error("Ultra error not good when adding investment.")
      return false
    }
    console.log(res.data);
    investments.value.push(res.data.addedInvestment);
    holdings.value = res.data.holdingsAfterInvestment;
    return true;
  }

  async function refreshInvestments(leagueId: string) {
    investments.value = []
    
    const res = await postJson<any, Investment[]>("getInvestments", {leagueId})
    if(!res.success) {
      console.error("Ultra error not good when fetching investments");
      return false;
    }
    investments.value = res.data;
    return true;
  }

  async function refreshLeagueInvestments(leagueId: string, latestN: number) {
    leagueInvestments.value = [];

    const res = await postJson<any, LeagueInvestmentsDTO>("getLeagueInvestments", {
      leagueId,
      latestN
    })
    if(!res.success) {
      console.error("Ultra error not good when fetching league investments");
      return false;
    }
    leagueInvestments.value = res.data.investments;
    leagueHoldings.value = res.data.holdings;
    return true;
  }

  async function refreshHoldings(leagueId: string) {
    holdings.value = null;

    const res = await postJson<{leagueId: string}, Holdings>("getUserHoldings", {leagueId})
    if(!res.success) {
      console.error("Ultra error not good when fetching holdings");
      return false;
    }
    holdings.value = res.data;
  }
  return { investments, leagueInvestments, leagueHoldings, addInvestment, holdings, refreshInvestments, refreshHoldings, refreshLeagueInvestments }
})