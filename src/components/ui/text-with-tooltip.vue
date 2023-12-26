<script setup lang="ts">
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
defineProps<{ text: string, tooltip: string }>();
</script>
<template>
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger class="cursor-default">
                <p>{{ text }}</p>
            </TooltipTrigger>
            <TooltipContent>
                <p>{{ tooltip }}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
</template>