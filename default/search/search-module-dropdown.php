<template id="search-module-dropdown">
    <div v-show="searchtext&&searchtext!=''" class="wrap-list-title">
        <div v-for="module in modules" v-show="search.indexOf(module.title)>-1" class="title-module-dropdown" v-on:click="handleJumpToSubmoduleDetail(module)">
            <div style="width:100%; height:37px;display:flex;align-items:center;">
                <span 
                    class="webapp-title uppercase webapp-title-dropdown" 
                    v-html="getTitle(searchtext, module.title)" 
                    style="color:#737373;font-size:14px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                </span>     
            </div> 
        </div>
        <div v-for="submodule in submodules" v-show="search.indexOf(submodule.title)>-1" class="title-module-dropdown" v-on:click="handleJumpToSubmoduleDetail1(submodule)">
            <div style="width:100%;height:37px;">
                <span 
                    class="webapp-title uppercase webapp-title-dropdown" 
                    v-html="getTitle(searchtext, submodule.title)" 
                    style="color:#737373;font-size:14px;padding-bottom:4px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
                </span>
                <span style="color:#bdbdbd;padding-top:4px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">in <span style="color:#bdbdbd;font-size:14px;padding-top:4px;" v-html="submodule.moduleTitle" ></span></span>
        
            </div>
        </div>
     
        <div  v-for="(object, code) in (objects)" v-if="object.moduleType != 'system'" v-show="search.indexOf(object.title)>-1" class="title-module-dropdown" v-on:click="handleOpenTask(object)">
        <div style="width:100%;height:37px;">
            <span 
                class="webapp-title uppercase webapp-title-dropdown" 
                v-html="getTitle(searchtext, object.title)" 
                style="color:#737373;font-size:14px;padding-bottom:4px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
            </span>
            <span style="color:#bdbdbd;padding-top:4px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">in <span style="color:#bdbdbd;font-size:14px;padding-top:4px;" v-html="object.submoduleTitle" ></span></span>
        </div>
        </div>
        <div v-show="showNoResult" style="display:flex; align-items:center; justify-content: center; height:60px; color:#737373;font-size:14px;padding:10px 16px;">
            <span>No Results Found</span>
        </div>

   
</template>
<style>
    .webapp-title-dropdown{
        padding:0;
    }
    .title-module-dropdown{
        display:flex;
        align-items: center;
        padding: 10px 16px;
        height: 60px;
    }
    .title-module-dropdown:hover{
        background: #e5f4f3;
        cursor: pointer;
    }
    .wrap-list-title{
        display: grid; 
        border-top:1px solid #bdbdbd;
        max-height:240px;
        overflow: auto;
        grid-column-gap: 2px;
        grid-template-columns: repeat(auto-fill, 
        minmax(200px,1fr));
    }
    .wrap-list-title:hover::-webkit-scrollbar {
        width: 5px !important;
        background-color: transparent;
        display: block !important;
    }
    .wrap-list-title:hover::-webkit-scrollbar-thumb {
        background-color: #bdbdbd !important; 
        width: 5px !important;
    }

</style>
<script type="text/javascript">
    Vue.component('search-module-dropdown', {
        template: '#search-module-dropdown',
        props: ['modules','search','searchtext'],
        data: function () {
            return {
                submodules:{},
                components:{},
                objects:{},
                "bgHeight":0,
                showNoResult: false,
            }
        },
        created: function () {
            this.getSubmodule(this.modules);
        },
        updated: function(){
            let count = 0;
                for(let i=0; i< $(".title-module-dropdown").length;i++){
                    if($(".title-module-dropdown")[i].style.display == "none"){
                        count++;
                    }
                }
                if(count == $(".title-module-dropdown").length){
                    this.showNoResult = true;
                } else this.showNoResult = false;
        },
        methods: {
            getTitle: function(keyWord, title){
                if(keyWord && title){
                    title = title.replaceAll("<br>"," ");
                    keyWord = keyWord.toUpperCase();
                    title= title.toUpperCase();
                    let arrSplitTitle = title.split(" ");
                    arrSplitTitle = arrSplitTitle.map((str)=>(
                        (str.indexOf(keyWord) == 0)? 
                        ("<b style='color:#000;'>"+str.substring(0,keyWord.length)+"</b>"+str.substring(keyWord.length)): 
                        str)
                    )
                    let finalStr = (arrSplitTitle.join(" "));
                    if(!finalStr.includes("<b style='color:#000;'>")&&title.indexOf(keyWord)==0){
                        finalStr =("<b style='color:#000;'>"+title.substring(0,keyWord.length)+"</b>"+title.substring(keyWord.length));
                    } else if(!finalStr.includes("<b style='color:#000;'>")&&(title.indexOf(keyWord)>0&&title.substring(title.indexOf(keyWord)-1,title.indexOf(keyWord))==" ")){
                        finalStr =title.substring(0,title.indexOf(keyWord))+("<b style='color:#000;'>"+title.substring(title.indexOf(keyWord),title.indexOf(keyWord)+keyWord.length)+"</b>"+title.substring(title.indexOf(keyWord)+keyWord.length));
                    }
                    return finalStr 
                }
            },
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
            getSubmodule: function(modules){
                let subModules={};
                Object.keys(modules).forEach(function(key1) {
                       let tmp_submodule=modules[key1].subModules;
                        Object.keys(tmp_submodule).forEach(function(key) {
                            subModules[key] = tmp_submodule[key]
                            subModules[key].modulitem=modules[key1].itemAppearance
                            subModules[key].moduleTitle=modules[key1].title
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
                            Components[key].submoduleTitle=subModules[key1].title;         
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
                            Objects[key].submoduleTitle=Components[key1].submoduleTitle;
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
         watch: {
            modules:  function(value){
                this.getSubmodule(value);
            },
         }
    });
</script>
