import { defineStore } from "pinia";
import { ref } from "vue";
import { Investment, BetInvestment, InvestmentTypes, StockInvestment } from "@/types/investments.js"
import { postJson } from "@/src/services/apiService.js";


export const useInvestmentStore = defineStore('investments', () => {
  const cash = ref();
  const holdings = ref<(StockInvestment | BetInvestment)[]>([])
  const investments = ref<Investment[]>([]);

  async function addInvestment(investment: Investment) {
    const res = await postJson<Investment, any>("addInvestment", investment);
    if(!res.success) {
      return false
    }
    console.log(res.data);
    investments.value.push(investment)
    return true;
  }

  async function refreshInvestments(leagueId: string) {
    investments.value = []
    holdings.value = []
    cash.value = 0;
    
    const res = await postJson<any, Investment[]>("getInvestments", {leagueId})
    if(!res.success) {
      console.error("Ultra error not good when fetching investments");
      return false;
    }
    investments.value = res.data;
    holdings.value = [
      {
        type: InvestmentTypes.Stock,
        buyPosition: true,
        ticker: "VOLV-B",
        price: 13,
        amount: 2
      }, {
        type: InvestmentTypes.Bet,
        odds: 3.5,
        amount: 44,
        expiryDate: "2023-12-30"
      }]

    cash.value = 200;
  }
  return { investments, addInvestment, cash, holdings, refreshInvestments }
})