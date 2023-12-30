import { defineStore } from "pinia";
import { ref } from "vue";
import { BetInvestment, Investment, InvestmentTypes, StockInvestment } from "../models/investments.js"

export const useInvestmentStore = defineStore('investments', () => {
  const cash = ref();
  const holdings = ref<(StockInvestment | BetInvestment)[]>([

  ])
  const investments = ref<Investment[]>([

  ]);

  async function addInvestment(investment: Investment) {
    //call api
    //if fail return false
    //else
    investments.value.push(investment)
    return true;
  }

  async function refreshInvestments() {
    investments.value = []
    holdings.value = []
    cash.value = 0;

    await new Promise(resolve => setTimeout(resolve, 1000));
    //call api
    investments.value = [{
      id: "guid1",
      userId: "Jerry.Rausk@gmail.com",
      leagueId: "LeagueGuid",
      date: "2023-12-26",
      verified: false,
      verifiedBy: null,
      data: {
        type: InvestmentTypes.Stock,
        buyPosition: true,
        ticker: "VOLV-B",
        price: 13,
        amount: 44
      }
    },
    {
      id: "guid2",
      userId: "Jerry.Rausk@gmail.com",
      leagueId: "LeagueGuid",
      date: "2023-12-26",
      verified: true,
      verifiedBy: "jerry.rausk@gmail.com",
      data: {
        type: InvestmentTypes.Stock,
        buyPosition: false,
        ticker: "VOLV-B",
        price: 15,
        amount: 40
      }
    },
    {
      id: "guid3",
      userId: "Jerry.Rausk@gmail.com",
      leagueId: "LeagueGuid",
      date: "2023-12-26",
      verified: true,
      verifiedBy: "jerry.rausk@gmail.com",
      data: {
        type: InvestmentTypes.Bet,
        odds: 3.5,
        amount: 44,
        expiryDate: "2023-12-30"
      }
    },]

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