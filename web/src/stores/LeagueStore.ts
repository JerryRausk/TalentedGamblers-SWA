import { defineStore } from "pinia";
import { ref } from "vue";
//import { getJson } from "@/services/apiService.js"
import { League } from "@/types/league.js";
import { getJson } from "@/src/services/apiService";
export const useLeagueStore = defineStore('league', () => {
  const activeLeague = ref<League>();
  const availableLeageus = ref<League[]>([]);
  async function refreshLeagues() {
    const res = await getJson<League[]>("getLeagues");
    if(!res.success) return false;
    activeLeague.value = res.data[0];
    availableLeageus.value = res.data
  }
  return { activeLeague, availableLeageus, refreshLeagues }
})