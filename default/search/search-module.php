<template id="search-module">
            <div  style="display: grid;
            grid-column-gap: 2px;
            grid-template-columns: repeat(auto-fill, minmax(200px,1fr));">
        <div v-for="module in modules"   v-show="search.indexOf(module.title)>-1" >
                <div class="webapp-item"
                 v-on:click="handleJumpToSubmoduleDetail(module)" >
                <div class="webapp-background" :style="{ 'background-image': 'url(' + module.background + ')', 'background-size':'100% 100%', 'padding-bottom':'80%','background-position': 'center','background-repeat': 'no-repeat'}">
                </div>  
                <div class="overlay-style">
                    <div class="col-md-12">
                        <span class="webapp-title uppercase"  v-html="module.title" style="font-weight:bolder;padding-left:15px"></span>    
                    </div>                          
                </div>           
            </div>
        </div>
        <div v-for="submodule in submodules"  v-show="search.indexOf(submodule.title)>-1">
                <div class="webapp-item"
                    v-on:click="handleJumpToSubmoduleDetail1(submodule)" >
                    <div class="webapp-background" :style="{ 'background-image': 'url(' + submodule.background + ')', 'background-size':'100% 100%', 'padding-bottom':'80%','background-position': 'center','background-repeat': 'no-repeat'}">
                    </div>  
                    <div class="overlay-style">
                        <div class="col-md-12" :class="addClassAppearance(submodule.modulitem,'submodule')">
                            <span class="webapp-title uppercase" v-html="submodule.title"></span>                        
                        </div>                        
                    </div>           
                </div>
        </div>
     
        <div  v-for="(object, code) in (objects)" v-if="object.moduleType != 'system'" v-show="search.indexOf(object.title)>-1">
                 <div class="webapp-item"  v-on:click="handleOpenTask(object)" >
                    <div class="webapp-background" ref="divBg" :style="{'height':'' + bgHeight + 'px', 'background-image': 'url(' + object.background + ')', 'background-size':'cover', 'padding-bottom':'80%', 'background-position': 'center','background-repeat': 'no-repeat','background-size': '100% 100%'}">
                        <div v-if="object.layout == 'tiles'" :class="addClassAppearance(object.subitem,'object')" >
                            <span class="object-title" v-html="object.title" style="font-weight:bolder"></span>
                        </div>
                        <div v-else="object.layout == 'tabs'" :class="addClassAppearance(object.comitem,'object')" >
                            <span class="object-title"  v-html="object.title" style="font-weight:bolder"></span>
                        </div>
                    </div>
                    <div class="overlay-style">

                    </div>
                </div>
        </div>

   
</template>

<script type="text/javascript">
    Vue.component('search-module', {
        template: '#search-module',
        props: ['modules','search'],
        data: function () {
            return {
                submodules:{},
                components:{},
                objects:{},
                "bgHeight":0
            }
        },
        created: function () {
            this.getSubmodule(this.modules)
            
        },
        methods: {
            handleOpenTask: function (object) {
                this.resetValueSearch();
                vm.objects[object.code]=object;
                if(
                    (!vm.module_power.hasOwnProperty(object.moduleCode)) ||
                    (!object.hasOwnProperty('power_needed')) ||
                    (parseInt(vm.module_power[object.moduleCode]) >= parseInt(object.power_needed)) ||
                    (object.unavailable_behavior != 'disable')
                ){
                    vm.openTask(object, object.layout, object.subitem, object.comitem)
                }else{
                    toastr.error('You do not have enough power to use this item.');
                }
            },
            setDivBgSize:function(){
                let bgWidth = this.$refs.divBg.offsetWidth;
                this.bgHeight = (bgWidth/3.125);
            },
            addClassAppearance: function(itemAppearance,name){
                if(itemAppearance !== null){
                    classNameObject = itemAppearance.replace(/[^A-Z0-9]/ig, '');
                    return classNameObject + name;
                }
            },
            getSubmodule: function(modules){
                let subModules={};
                Object.keys(modules).forEach(function(key1) {
                       let tmp_submodule=modules[key1].subModules;
                        Object.keys(tmp_submodule).forEach(function(key) {
                            subModules[key] = tmp_submodule[key]
                            subModules[key].modulitem=modules[key1].itemAppearance
                    });
                });
                this.submodules=subModules;
                this.getComponents(subModules);
              
            },
            getComponents: function(subModules){
                let Components={};
                Object.keys(subModules).forEach(function(key1) {
                       let tmp_components=subModules[key1].components;
                        Object.keys(tmp_components).forEach(function(key) {
                            Components[key] = tmp_components[key]
                            Components[key].layout=subModules[key1].layout;
                            Components[key].subitem=subModules[key1].itemAppearance;         
                    });
                });
                this.components=Components;
                this.getObjects(Components);
               
            },
            getObjects: function(Components){
                let Objects={};
                Object.keys(Components).forEach(function(key1) {
                       let tmp_objects=Components[key1].objects;
                        Object.keys(tmp_objects).forEach(function(key) { 
                            Objects[key] = tmp_objects[key]
                            Objects[key].comitem=Components[key1].itemAppearance;
                            Objects[key].layout=Components[key1].layout;
                            Objects[key].subitem=Components[key1].subitem;
                    });
                });
              
                this.objects=Objects;
             
                
            },
            handleJumpToSubmoduleDetail: function (module) {
                this.resetValueSearch();
                if(
                    (!vm.module_power.hasOwnProperty(module.code)) ||
                    (!module.hasOwnProperty('power_needed')) ||
                    (vm.module_power[module.code] >= module.power_needed) ||
                    (module.unavailable_behavior != 'disable')
                ){
                    vm.jumpToSubmoduleDetail(module.code,'all');
                }else{
                    toastr.error('You do not have enough power to use this item.');
                }
            },
            handleJumpToSubmoduleDetail1: function (submodule) {
                this.resetValueSearch();
                if(
                    (!vm.module_power.hasOwnProperty(submodule.moduleCode)) ||
                    (!submodule.hasOwnProperty('power_needed')) ||
                    (parseInt(vm.module_power[submodule.moduleCode]) >= parseInt(submodule.power_needed)) ||
                    (submodule.unavailable_behavior != 'disable')
                ){
                    vm.jumpToSubmoduleDetail(submodule.moduleCode, submodule.code);
                }else{
                    toastr.error('You do not have enough power to use this item.');
                }
            },
            resetValueSearch: function(){
                vm.searchModuleValue=[];
                vm.inputSearchModule='';
                $('.search_module').val('');
                $('.dropdown.dropdown-search-module').removeClass('open');
            },
         },
    });
</script>
