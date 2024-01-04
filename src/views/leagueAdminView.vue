<script setup lang="ts">
import { postJson } from '@/src/services/apiService';
import { useToast } from '../components/ui/toast';
import { ref } from "vue";
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { LeagueMembership, LeagueMembershipTypes } from '@/types/league';
import { User } from '@auth0/auth0-vue';
import { League } from "@/types/league";

const props = defineProps<{
  activeLeague: League,
  user: User
}>();

const toast = useToast();

const userToInvite = ref(""); 

async function addUserToLeague() {
    const leagueMembership = {
        id: "",
        userId: userToInvite.value,
        leagueId: props.activeLeague.id,
        leagueMembershipType: LeagueMembershipTypes.Member
    } satisfies LeagueMembership

    const res = await postJson<LeagueMembership, LeagueMembership | null>("addLeagueMembership", leagueMembership)
    if(!res.success) {
        toast.toast({title: "Error", description: "Could not add user..."})
    } else {
        toast.toast({title: "Success", description: `Added user ${userToInvite.value} to league ${props.activeLeague.name}` })
        userToInvite.value = "";
    }
}

</script>
<template>
    <div>
        <h2>Invite user to league {{ activeLeague.name }}</h2>
        <Input v-model="userToInvite"/>
        <Button @click="addUserToLeague" >Invite user</button>
    </div>
</template>