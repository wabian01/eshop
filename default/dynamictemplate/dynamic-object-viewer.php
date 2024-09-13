<template id="dynamic-object-viewer">
    <div class="">
        <div class="autofit_subdetail" style="columns: unset;"  :id="object.componentCode">
            <div v-if="statetitle" class="new-header" style="min-height: 35px;height: 35px;padding:6px;position: sticky;top: 0px;background-color: #f5f5f5e6;z-index: 3;border-bottom: 1px solid rgb(230, 222, 222);">
                <div>
                    <span  v-if="vm.activeScreenComPre[object.code]!=undefined && vm.activeScreenComPre[object.code] != vm.activeScreenCom[object.code]"><i style="color:#737373;padding: 7px; cursor: pointer;" class="fas fa-arrow-left" v-on:click="backScreen(object.subModuleCode)" ></i></span>
                    <span v-if="vm.activeScreenComPre[object.code]==undefined || vm.activeScreenComPre[object.code] == vm.activeScreenCom[object.code]" style="color: #009688; font-weight:600;text-transform: uppercase;" v-html="vm.funcReplaceTitleAndName(object.title)"></span>
                    <span v-if="vm.activeScreenComPre[object.code]!=undefined && vm.activeScreenComPre[object.code] != vm.activeScreenCom[object.code]" style="text-transform: uppercase;color: #009688;font-weight: 600;" v-html="vm.funcReplaceTitleAndName(object.screens[vm.activeScreenCom[object.code]].title)"></span>
                </div>
            </div>
            <div style="overflow: auto;width:100%;">
                <div style="position: relative">
                    <screen v-if="Object.keys(object).length>0"  v-for="(screen, code) in object.screens" :screen="screen" :object="object" :task="task" :newwebapp="true">
                    </screen>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
    Vue.component('dynamic-object-viewer', {
        template: '#dynamic-object-viewer',
        props: ['object','statetitle','task'],
        data: function () {
            return {
                showSearchInput:false,
            }
        },
        methods:{
            backScreen(code){
                if((vm['checkIframe'] != undefined && vm['checkIframe'][0]) || vm['checkIframe'] == undefined){
                    this.jumpToPreviousScreen(code)
                }else{
                    try {
                        $('#'+vm['checkIframe'].id).get(0).contentDocument.location.href = "about:srcdoc";
                    } catch (error) {
                        window.history.back();
                    }
                }
            },
            jumpToPreviousScreen:function (sub="") {
                if(sub!==""){
                    let index = vm.activeScreenSub.indexOf(sub);
                    vm.activeScreenSub=vm.activeScreenSub.splice(index+1,1)
                    let activeScreen = {...vm.activeScreenCom}
                    activeScreen[this.object.code] = vm.activeScreenComPre[this.object.code]
                    vm.activeScreenCom={...activeScreen};
                }
                vm.jumpToScreen('',vm.previousScreenCode)
            },
            handleSearchCom:function (event) {
                vm.activeTaskCode='';
                vm.itemSearchString = $(event.target).val();
            },
            clearSearch:function(){
                this.$refs.searchInput.value='';
                vm.itemSearchString='';
                this.$nextTick(function () {
                    this.$refs.searchInput.focus();
                });
            },
            currentCom:function (code) {
                this.showSearchInput=!this.showSearchInput;
                if(this.showSearchInput){
                    this.$nextTick(function () {
                    this.$refs.searchInput.focus();
                    });
                } else{
                    this.$refs.searchInput.value='';
                    vm.itemSearchString='';
                }
            },
        }
    });
</script>