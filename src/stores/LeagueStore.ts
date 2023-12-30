import { defineStore } from "pinia";
import { ref } from "vue";
//import { getJson } from "@/services/apiService.js"
import { League } from "@/models/league.js";
export const useLeagueStore = defineStore('league', () => {
  const activeLeague = ref<League>();
  const availableLeageus = ref<League[]>();
  async function refreshLeagues() {
    //const res = await getJson<League[]>("getLeagues");
    //if(!res.success) return false;
    await new Promise(resolve => setTimeout(resolve, 1000));
    activeLeague.value = {
      id: "string",
      name: "Meatheads 2024"
    };
    availableLeageus.value = [{
      id: "string",
      name: "Meatheads 2024"
    }];
  }
  return { activeLeague, refreshLeagues }
})