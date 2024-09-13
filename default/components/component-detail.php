<template id="component-detail">
    <div :style="uiObject">
        <com-object v-show="object.filtered_visible && (component.show_content == false || !component.hasOwnProperty('show_content'))" :not_power="not_power" v-if="object.componentCode == component.code && object.moduleType != 'system'"  v-for="(object, code) in vm.filterHiddenObjects(objects)" :object="object" :layout="layout" :subitem="subitem" :comitem="component.itemAppearance" :key="object.code"
        ></com-object>
        <system-fill-form-object v-show="(object.title != '' && object.title != null && object.title != undefined && (object.title.toLowerCase()).includes(keyword)) ? true : false" v-if="object.componentCode == component.code && object.moduleType == 'system' && object.type == 'fill-form' && vm.objectLevel == 0 && (object.visible != 0)"  v-for="(object, code) in objects" :object="object" :layout="layout" :subitem="subitem" :comitem="component.itemAppearance" :key="object.code"
        ></system-fill-form-object>
        <system-edit-form-object v-if="object.componentCode == component.code && object.moduleType == 'system' && object.type == 'edit-form' && vm.objectLevel == 0 && object.visible != 0"  v-for="(object, code) in objects" :object="object" :layout="layout" :subitem="subitem" :comitem="component.itemAppearance" :key="object.code"
        ></system-edit-form-object>
        <system-report-object v-if="object.componentCode == component.code && object.moduleType == 'system' && object.type == 'report' && vm.objectLevel == 0 && object.visible != 0"  v-for="(object, code) in objects" :object="object" :layout="layout" :subitem="subitem" :comitem="component.itemAppearance" :key="object.code"
        ></system-report-object>
        <div v-if=" typeof objects[vm.activeObjectCode] != 'undefined'">
        <system-instance-object v-if="instance.componentCode == component.code && instance.moduleType == 'system' && instance.type == 'instance' && vm.objectLevel == 1"  v-for="(instance, code) in objects[vm.activeObjectCode].instances" :instance="instance" :layout="layout" :subitem="subitem" :comitem="component.itemAppearance" :key="instance.keyCode"
        ></system-instance-object>
    </div>

    </div>
</template>

<script type="text/javascript">
    Vue.component('component-detail', {
        template: '#component-detail',
        props: ['component','objects', 'layout', 'subitem', 'comitem','not_power','keyword'],
        data: function () {
            return {
                uiObject:'',
            }
        },
        created: function () {
            vm.componentABactive = false
        },
        methods: {
            handleClickOnComponent: function () {

                if(
                    (!vm.module_power.hasOwnProperty(this.component.moduleCode)) ||
                    (!this.component.hasOwnProperty('power_needed')) ||
                    (parseInt(vm.module_power[this.component.moduleCode]) >= parseInt(this.component.power_needed) ) ||
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