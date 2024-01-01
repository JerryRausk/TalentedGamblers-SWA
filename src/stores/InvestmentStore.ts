import { defineStore } from "pinia";
import { ref } from "vue";
import { Investment, AddInvestmentDTO, Holdings } from "@/types/investments.js"
import { postJson } from "@/src/services/apiService.js";


export const useInvestmentStore = defineStore('investments', () => {
  const holdings = ref<Holdings | null>(null)
  const investments = ref<Investment[]>([]);

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
  return { investments, addInvestment, holdings, refreshInvestments, refreshHoldings }
})