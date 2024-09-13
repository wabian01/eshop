<template id="component">
    <li v-on:click="handleJumpToComponent($event)">
        <a   :href="'#' + component.code" :data-toggle="handleOpenTab()?'tab':''" v-html="vm.funcReplaceTitleAndName(component.name)" @click="scrollFunc(component.code +'-scroll')" :id="component.code +'-scroll'"></a>
    </li>
</template>

<script type="text/javascript">
    Vue.component('component', {
        template: '#component',
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
                // vm.itemFilterAttributes="{}";
                (function($) {
                $.fn.hasScrollBar = function() {
                    return this.get(0).scrollHeight > this.height();
                }
                })(jQuery);
                setTimeout(() => {
                    if($('#'+this.component.code).hasScrollBar()){
                        $('#'+this.component.code).css('overflow-y','auto')
                    }else{
                        $('#'+this.component.code).css('overflow-y','unset')
                    }
                }, 10);
                
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
            scrollFunc(id) {  
                let obj = $("#"+id);
                let childPos = obj.offset();
                let parentPos = obj.parents(':eq(2)').offset();
                let childOffset = childPos.left - parentPos.left;
                let centerObj =  obj.width()/2 + childOffset;
                let centerParent = obj.parents(':eq(2)').width()/2;
                let rangeChildParent = centerObj >= centerParent ? centerObj - centerParent : -(centerParent - centerObj);
                let leftScrollBar = (obj.parents(':eq(1)').offset()).left -  parentPos.left ;
                leftScrollBar = leftScrollBar < 0 ? -leftScrollBar : leftScrollBar;
                obj.parents(':eq(2)').animate({scrollLeft:(leftScrollBar + rangeChildParent)}, 200);  
            },
        },

    });
</script>