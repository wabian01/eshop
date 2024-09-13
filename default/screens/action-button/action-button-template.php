<template id="action-button">
    <span 
        v-if="button_content != ''" 
        :id="randomID" 
        class="action-button" 
        :style="hasBorder + hasBadgeIcon + tracking" 
        v-on:click="handleClick" 
        v-html="button_content" 
        v-bind:class="[activeClass,isBigIcon,overflow_menu]"
    >
    </span>
</template>