<template id="component-tab-content">
    <li v-on:click="handleJumpToComponent($event)">
        <a  style="
                color: black;
                /* background-color: rgb(0 150 136 / 10%); */
                cursor: pointer;
                border: none;
                background-color: transparent;
                padding: 2px 15px;
                font-weight: 800;"  
            :href="'#' + component.code" 
            :data-toggle="handleOpenTab()?'tab':''" 
            v-html="vm.funcReplaceTitleAndName(component.name)">
        </a>
    </li>
</template>
<script type="text/javascript">
    Vue.component('component-tab-content', {
        template: '#component-tab-content',
        props: ['component'],
        data: function () {
            return {}
        },
        created: function () {
        },
        methods: {
            handleJumpToComponent: function (event) {
                this.$parent.closeSearch(this.component.code);
                vm.activeTaskCode='';
                vm.itemSearchString = '';
                vm.activeScreenCom=[];
                if(
                    (!vm.module_power.hasOwnProperty(this.component.moduleCode)) ||
                    (!this.component.hasOwnProperty('power_needed')) ||
                    (parseInt(vm.module_power[this.component.moduleCode]) >= parseInt(this.component.power_needed)) ||
                    (this.component.unavailable_behavior != 'disable')
                ){
                    vm.jumpToComponent(this.component.code);
                }else{
                    toastr.error('You do not have enough power to use this item.');
                    event.preventDefault();
                    return;
                }
            },
            handleOpenTab: function (event) {
                if(
                    (!vm.module_power.hasOwnProperty(this.component.moduleCode)) ||
                    (!this.component.hasOwnProperty('power_needed')) ||
                    (parseInt(vm.module_power[this.component.moduleCode]) >= parseInt(this.component.power_needed)) ||
                    (this.component.unavailable_behavior != 'disable')
                ){
                    return true;
                }else{
                    return false;
                }
            },
        },
    });
</script>
<style>
    .tab-content li:hover a{
        color:#009688 !important;
        background-color: rgba(0, 150, 136, 0.1);
    }
    .tab-content li:hover{
        background-color: rgba(0, 150, 136, 0.1);
    }
    .tab-content li.active a{
        color:#009688 !important
    }
    .tab-content li.active{
        background-color: rgba(0, 150, 136, 0.1);
    }
    .tab-content li{
        background-color: rgba(0, 0, 0, 0.05);
    }
</style>