<script setup lang="ts">
import { postJson } from '@/src/services/apiService';
import { useToast } from '../components/ui/toast';
import { ref } from "vue";
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { useLeagueStore } from "@/src/stores/LeagueStore"
import { LeagueMembership, LeagueMembershipTypes } from '@/types/league';

const toast = useToast();
const leagueStore = useLeagueStore();

const userToInvite = ref(""); 

async function addUserToLeague() {
    if(!leagueStore.activeLeague) return;
    const leagueMembership = {
        id: "",
        userId: userToInvite.value,
        leagueId: leagueStore.activeLeague.id,
        leagueMembershipType: LeagueMembershipTypes.Member
    } satisfies LeagueMembership

    const res = await postJson<LeagueMembership, LeagueMembership | null>("addLeagueMembership", leagueMembership)
    if(!res.success) {
        toast.toast({title: "Error", description: "Could not add user..."})
    } else {
        toast.toast({title: "Success", description: `Added user ${userToInvite.value} to league ${leagueStore.activeLeague.name}` })
        userToInvite.value = "";
    }
}

</script>
<template>
    <div v-if="leagueStore.activeLeague">
        <h2>Invite user to league {{ leagueStore.activeLeague.name }}</h2>
        <Input v-model="userToInvite"/>
        <Button @click="addUserToLeague" >Invite user</button>
    </div>
</template>