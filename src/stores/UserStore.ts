import { defineStore } from "pinia";
import { ref } from "vue";
import { getJson } from "../services/apiService";
import { UserDetails } from "@/types/dbTypes"
//import { getJson } from "@/services/apiService.js"
export const useUserStore = defineStore('user', () => {
  const isSiteAdmin = ref(false);

  async function refreshUser() {
    const res = await getJson<UserDetails>("getUserDetails");
    if(res.success) {
        isSiteAdmin.value = res.data.isSiteAdmin;
        return true;
    }
    return false;
  }
  return { isSiteAdmin, refreshUser }
})