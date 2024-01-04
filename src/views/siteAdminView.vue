<script setup lang="ts">
import { postJson } from '@/src/services/apiService';
import { useToast } from '../components/ui/toast';
import { ref } from "vue";
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { League } from "@/types/league";
import { User } from "@auth0/auth0-vue";

defineProps<{
  activeLeague: League,
  user: User
}>();

const toast = useToast();
const userToInvite = ref("");
async function addInvitedUser() {
    const postBody = {id: userToInvite.value.toLowerCase()}
    const res = await postJson<any, any>("addInvitedUser", postBody)
    if(!res.success) {
        toast.toast({title: "Error", description: "Could not add user..."})
    } else {
        toast.toast({title: "Success", description: `Added user ${userToInvite.value} to list of invited users` })
        userToInvite.value = "";
    }
}
</script>
<template>
    <div>
        <h2>Add invited user</h2>
        <Input v-model="userToInvite"/>
        <Button @click="addInvitedUser">Add user</button>
    </div>
</template>