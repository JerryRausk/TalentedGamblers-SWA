import { defineStore } from "pinia";
import { ref } from "vue";
import { Investment, AddInvestmentDTO, Holdings, LeagueInvestmentsDTO, SettleBetDTO } from "@/types/investments.js"
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

    _updateStoreData(res.data.leagueInvestments, investment.userId);

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
    _resetStoreData()
    const res = await postJson<any, LeagueInvestmentsDTO>("getLeagueInvestments", {
      leagueId
    })
    if(!res.success) {
      console.error("Ultra error not good when fetching league investments");
      return false;
    }
    
    _updateStoreData(res.data, userId)

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

  function _updateStoreData(leagueInvDto: LeagueInvestmentsDTO, userId: string) {
    leagueInvestments.value = leagueInvDto.investments;
    leagueHoldings.value = leagueInvDto.holdings;
    userHoldings.value = leagueInvDto.holdings.filter(h => h.userId === userId)[0];
    userInvestments.value = leagueInvDto.investments.filter(i => i.userId === userId);
  }
  
  function _resetStoreData() {
    leagueInvestments.value = [];
    leagueHoldings.value = null;
    userInvestments.value = [];
    userHoldings.value = null;
  }

  async function settleBet(investmentId: string, winAmount: number, userId: string) {
    const dto = {
      investmentId, winAmount    
    } satisfies SettleBetDTO

    const res = await postJson<SettleBetDTO, LeagueInvestmentsDTO>("addBetSettled", dto)
    
    if(!res.success) {
      console.error("Ultra error not good when settling bet");
      return false;
    }

    _updateStoreData(res.data, userId)
    return true;
  }
  return { userInvestments, leagueInvestments, leagueHoldings, addInvestment, userHoldings, refreshInvestments, refreshHoldings, refreshInvestmentData, settleBet }
})