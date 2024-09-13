<template id="module">  
<!--        <md v-if="module.type != 'system'">      -->

    <div style="position: relative;" :id="module.code">
        <div class="webapp-item" v-on:click="handleJumpToSubmoduleDetail" >
            <?php if(Yii::app()->params['platform'] == "rtSurvey") { ?>
                <div 
                    class="webapp-background" 
                    :style="{
                        '-webkit-filter':''+(module.hasOwnProperty('not_power') ? 'grayscale(100%)' : 'none'), 
                        'background-image': 'url(' + module.background + ')', 
                        'background-color':  
                            (module.background_color != '' && 
                            module.background_color != null && 
                            module.background_color != undefined && 
                            module.background_color.includes('#') && (module.background_color.length == 7 || module.background_color.length == 4)
                            ) 
                            ? module.background_color 
                            : (vm.flatRuntimeAttributes['primaryAppColor'] != '' && 
                            vm.flatRuntimeAttributes['primaryAppColor'] != null && 
                            vm.flatRuntimeAttributes['primaryAppColor'] != undefined && 
                            (vm.flatRuntimeAttributes['primaryAppColor'].includes('#') && (vm.flatRuntimeAttributes['primaryAppColor'].length == 7 || vm.flatRuntimeAttributes['primaryAppColor'].length == 4) || 
                            vm.flatRuntimeAttributes['primaryAppColor'] === 'var(--color-theme-primary)')
                            ) 
                            ? vm.flatRuntimeAttributes['primaryAppColor']
                            : '#0f4c81',
                        'background-size':'100% 100%', 
                        'padding-bottom':'76%',
                        'background-position': 'center',
                        'background-repeat': 'unset'
                    }"
                >
                </div>
            <?php } else if(Yii::app()->params['platform_branch'] == 'rtHome') { ?>
                <div 
                    class="webapp-background" 
                    :style="{
                        '-webkit-filter':''+(module.hasOwnProperty('not_power') ? 'grayscale(100%)' : 'none'), 
                        'background-image': 'url(' + module.background + ')', 
                        'background-color':  
                            (module.background_color != '' && 
                            module.background_color != null && 
                            module.background_color != undefined && 
                            module.background_color.includes('#') && (module.background_color.length == 7 || module.background_color.length == 4)
                            ) 
                            ? module.background_color 
                            : (vm.flatRuntimeAttributes['primaryAppColor'] != '' && 
                            vm.flatRuntimeAttributes['primaryAppColor'] != null && 
                            vm.flatRuntimeAttributes['primaryAppColor'] != undefined && 
                            (vm.flatRuntimeAttributes['primaryAppColor'].includes('#') && (vm.flatRuntimeAttributes['primaryAppColor'].length == 7 || vm.flatRuntimeAttributes['primaryAppColor'].length == 4) || 
                            vm.flatRuntimeAttributes['primaryAppColor'] === 'var(--color-theme-primary)')
                            ) 
                            ? vm.flatRuntimeAttributes['primaryAppColor']
                            : '#4caf50',
                        'background-size':'100% 100%', 
                        'padding-bottom':'76%',
                        'background-position': 'center',
                        'background-repeat': 'unset'
                    }"
                >
                </div>
            <?php } else { ?>
                <div 
                    class="webapp-background" 
                    :style="{
                        '-webkit-filter':''+(module.hasOwnProperty('not_power') ? 'grayscale(100%)' : 'none'), 
                        'background-image': 'url(' + module.background + ')', 
                        'background-color':  
                            (module.background_color != '' && 
                            module.background_color != null && 
                            module.background_color != undefined && 
                            module.background_color.includes('#') && (module.background_color.length == 7 || module.background_color.length == 4)
                            ) 
                            ? module.background_color 
                            : (vm.flatRuntimeAttributes['primaryAppColor'] != '' && 
                            vm.flatRuntimeAttributes['primaryAppColor'] != null && 
                            vm.flatRuntimeAttributes['primaryAppColor'] != undefined && 
                            (vm.flatRuntimeAttributes['primaryAppColor'].includes('#') && (vm.flatRuntimeAttributes['primaryAppColor'].length == 7 || vm.flatRuntimeAttributes['primaryAppColor'].length == 4) || 
                            vm.flatRuntimeAttributes['primaryAppColor'] === 'var(--color-theme-primary)')
                            ) 
                            ? vm.flatRuntimeAttributes['primaryAppColor']
                            : '#009688',
                        'background-size':'100% 100%', 
                        'padding-bottom':'76%',
                        'background-position': 'center',
                        'background-repeat': 'unset'
                    }"
                >
                </div>
            <?php } ?>
            
            <div class="overlay-style">
                <div class="webapp-icon-module" 
                    v-on:click="handleJumpToSubmoduleDetail" 
                    v-if="(module.background && /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(module.background) && module.icon)"
                    :style="{
                    '-webkit-filter':''+(module.hasOwnProperty('not_power')?'grayscale(100%)':'none'),
                    'width':'100%',
                    'height':'100%', 
                    'position':'absolute',
                    'display':'flex', 
                    'align-items':'center', 
                    'justify-content':'center',
                    'flex-flow':''+(module.itemAppearance && module.itemAppearance.indexOf('bottom') > -1 || (setting_title && setting_title.indexOf('bottom') > -1)?'column-reverse':'column')}">
                    <div style="flex-basis:calc(100%/3);width:100%;"></div>
                    <div :style="{
                    'flex-grow':'1',
                    'width': '100%',
                    'display': 'flex',
                    'justify-content': 'center', 
                    'align-items':''+(module.itemAppearance && module.itemAppearance.indexOf('bottom') > -1 || (setting_title && setting_title.indexOf('bottom') > -1)?'flex-end':'flex-start')}">
                    <div :style="{'width':'40%','height':'0px','background-image': 'url(' + module.icon + ')', 'background-size':'100% 100%', 'padding-bottom':'40%','background-position': 'center','background-repeat': 'no-repeat'}">        
                    </div>
                    </div>
                </div>
                <div :class="styleTitle" style="padding: 8px;height: calc(100%/3);
                    display: flex;
                    justify-content: center;
                    align-items: center;"
                >
                    <span v-if="show_button" class="webapp-title " v-html="module.title" style="font-weight:bolder; padding-top:0; word-break: break-word;"></span> 
                    <span v-else class="webapp-title "  v-html="module.title" style="font-weight:bolder;padding-top:0;"></span>    
                </div>

                <!-- Note to test go-sup button -->
                <!-- <div 
                    href="javascript:;" 
                    class="go-sub" 
                    style="
                        background-color: rgba(51, 51, 51, 0.36); 
                        border-radius: 50% !important; 
                        height: 32px; 
                        width: 32px; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        color: rgb(255, 255, 255); 
                        cursor: pointer; 
                        font-size: 14px;
                    "
                >
                    <i class="icon-login"></i>
                </div> -->
                <!-- End note to test go-sup button -->

                <div v-if="module.type != 'system' && showIconSub" class="go-sub" href="javascript:;" style="background-color: #3333335c;
                    border-radius: 50% !important;
                    height: 32px;
                    width: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    cursor: pointer;font-size: 14px;"
                    v-on:click.stop="handleJumpToSubmodule" >
                    <i class="icon-login"></i>
                </div>
            </div>
            <!-- <div v-if="show_button" v-on:click.stop="showButton" style="background-color: rgba(51, 51, 51, 0.36);
                border-radius: 50% !important;
                height: 30px;
                width: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: rgb(255, 255, 255);
                cursor: pointer;
                font-size: 14px;
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 4;
                /* transform: rotate(90deg); */
                " >
                                <div v-html="icon_button"></div>
                                <div style="position: absolute;
                top: 30px;
                right: 0;
                background-color: #ffffff;
                padding: 10px 7px;">
                                    
                                </div>
                                
                
                                    
                            </div>     -->
        </div>

        <!-- Note to test dropdown button -->
        <!-- <div class="dropdown toparea" style="background-color: rgba(51, 51, 51, 0.36);border-radius: 50% !important;display: flex;align-items: center;justify-content: center;color: rgb(255, 255, 255);cursor: pointer;font-size: 10px;position: absolute;top: 10px;right: 8px;">
            <div data-toggle="dropdown" style="z-index: 3; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;" aria-expanded="false">
                <i style="transform: rotate(90deg);" class="fas fa-ellipsis-h"></i>
            </div>
            <div class="dropdown-menu pull-right module_button" style="overflow: auto; max-height: 40vh; border-radius: 4px !important; box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 8px;">
                <span class="action-button" style="min-height: 35px;">
                <button type="button" style="padding: 3px 9px !important; margin: 0 5px -15px 0 !important; border-radius: 2px !important;" class="btn default">
                    <i class="isShowIcon fa fa-map-marker"></i> 4. Show Location </button>
                </span>
                <span class="action-button" style="min-height: 35px;">
                <button type="button" style="padding: 3px 9px !important; margin: 0 5px -15px 0 !important; border-radius: 2px !important;" class="btn default">
                    <i class="isShowIcon flaticon-diagram" aria-hidden="true" style="color:#00c5dc"></i> 6. View report </button>
                </span>
                <span class="action-button" style="min-height: 35px;">
                <button type="button" style="padding: 3px 9px !important; margin: 0 5px -15px 0 !important; border-radius: 2px !important;" class="btn default">
                    <i class="isShowIcon fa fa-calendar-plus-o"></i>7. Buttons Module </button>
                </span>
                <span class="action-button" style="min-height: 35px;">
                <button type="button" style="padding: 3px 9px !important; margin: 0 5px -15px 0 !important; border-radius: 2px !important;" class="btn default">
                    <i class="isShowIcon fa fa-bar-chart" aria-hidden="true" style="color:#00c5dc"></i> 8. Show datamodel view </button>
                </span>
                <span class="action-button" style="min-height: 35px;">
                <button type="button" style="padding: 3px 9px !important; margin: 0 5px -15px 0 !important; border-radius: 2px !important;" class="btn default">
                    <i class="isShowIcon fa fa-cloud-download" style="color:#716aca"></i> 9. Download datamodel a1 </button>
                </span>
                <span class="action-button" style="min-height: 35px;">
                <button type="button" style="padding: 3px 9px !important; margin: 0 5px -15px 0 !important; border-radius: 2px !important;" class="btn default">
                    <i class="isShowIcon fa fa-calendar-plus-o"></i> 10. Get Last Original Instance </button>
                </span>
            </div>
        </div> -->
        <!-- END note to test dropdown button -->

        <div v-if="show_button" v-on:click="showButton" 
            style="
                background-color: rgba(51, 51, 51, 0.36);
                border-radius: 50% !important;
                display: flex;
                align-items: center;
                justify-content: center;
                color: rgb(255, 255, 255);
                cursor: pointer;
                font-size: 10px;
                position: absolute;
                top: 10px;
                right: 8px;
                /* top: 15px;
                right: 10px; */
            " 
            class="dropdown toparea"
        >
            <!-- <button class="btn btn-primary " type="button" data-toggle="dropdown">Dropdown Example
                <span class="caret"></span></button> -->
            <div data-toggle="dropdown" style="z-index: 3;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;" v-html="icon_button">
            </div>
            <div class="dropdown-menu pull-right module_button" style="overflow: auto;max-height: 40vh; border-radius: 4px !important; box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 8px;">
                <action-button v-for="(item_button,index) in item_buttons" :key="item_buttons" :indexsearch="true" :end="index==item_buttons.length-1" :item_button="item_button" :task="task"> </action-button>
            </div>
        </div>
    </div>

<!--        </md>-->
<!--        <md v-else>-->
<!--            <div class="webapp-item"-->
<!--                 v-on:click="vm.jumpToSubmoduleDetail(module.code,'all')" >-->
<!--                <div class="webapp-background" :style="{ 'background-image': 'url(' + module.background + ')', 'background-size':'cover', 'padding-bottom':'80%','background-position': 'center','background-repeat': 'no-repeat'}">-->
<!--                </div>  -->
<!--                <div class="overlay-style">-->
<!--                    <div class="col-md-12">-->
<!--                        <span class="webapp-title uppercase" v-html="module.title"></span>   -->
<!--                    </div>                          -->
<!--                </div>           -->
<!--            </div>-->
<!--        </md>-->
</template>

<script type="text/javascript">
    Vue.component('module', {
        template: '#module',
        props: ['module','setting_title'],
        data: function () {
            return {
                item_buttons:[],
                task:"",
                icon_button:"",
                show_button:false,
                styleTitle:"",
                showIconSub:true,
            }
        },
        watch:{
            setting_title(value){
                this.renderAppSetting(value);
            },
        },
        created: function () {
            
            setTimeout(() => {
                let check = 0;
                for(let code in this.module.subModules){
                    if(this.module.subModules.hasOwnProperty(code)){
                            let submodule = this.module.subModules[code];
                            if( (!submodule.hasOwnProperty("power_needed")) || (!vm.module_power.hasOwnProperty(submodule.moduleCode)) || (parseInt(vm.module_power[submodule.moduleCode]) >= parseInt(submodule.power_needed))){
                                check += 1;
                            }
                        }
                }
                if(check == 1){
                    this.showIconSub = false
                }
            }, 100);
            if(this.setting_title!=""){
                this.renderAppSetting(this.setting_title);
            }
            if(this.module.hasOwnProperty('buttons') && this.module.buttons.length>0){
                let task={
                        code: 9999,
                        comitem: null,
                        get: null,
                        html_content: "",
                        isDeleted: false,
                        layout: "tabs",
                        object: {
                            moduleCode:this.module.code,
                            subModuleCode:"undefined",
                            componentCode:"undefined-undefined",
                            code:'undefined-undefined-undefined',
                            rawComponentCode:"undefined"
                        },
                        openFromAB: "",
                        post: null,
                        subitem: null,
                        title: null,
                        where: null}
                this.task=task;
                this.show_button=true;
                if(this.module.buttons.length>1){
                    this.icon_button='<i style="transform: rotate(90deg);font-size: 16px;" class="fas fa-ellipsis-h"></i>';
                }else{
                    if(this.module.buttons[0].type=="act_fill_form" || this.module.buttons[0].type=="act_get_instance"){
                        this.icon_button='<i class="fa fa-calendar-plus-o"></i>';
                    }
                    else if(this.module.buttons[0].type=="act_call_cloudphone"){
                        this.icon_button='<i class="fa fa-phone"></i>';
                    }
                    else if(this.module.buttons[0].type=="act_call_api"){
                        this.icon_button='<i class="fa fa-cloud-download"></i>';
                    }
                    else if(this.module.buttons[0].type=="act_gps"){
                        this.icon_button='<i class="fa fa-map-marker"></i>';
                    }
                    else if(this.module.buttons[0].type=="act_report"){
                        this.icon_button='<i class="flaticon-diagram"></i>';
                    }
                    else if(this.module.buttons[0].type=="act_dm_view"){
                        this.icon_button='<i class="fa fa-bar-chart"></i>';
                    }
                    else if(this.module.buttons[0].type=="act_call" || this.module.buttons[0].type=="act_sms"){
                        this.show_button=false;
                    }
                    if(this.module.buttons[0].hasOwnProperty('imageUrl')){
                        this.icon_button = '<img src="'+this.module.buttons[0].imageUrl+'" style="width:1rem;">'
                    }
                }
            }
        },
        mounted(){
            setTimeout(() => {
                this.item_buttons=this.module.buttons;
                this.showButton()
            }, 100);
        },
        methods: {
            renderAppSetting(value){
                let valueCheck = value
                let checkAppSetting = ['left','right','end','start']
                if( 
                        this.module.background && 
                        /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/.test(this.module.background) && 
                        this.module.icon && this.module.icon.length >0 && 
                        valueCheck
                    ){
                        if(valueCheck.indexOf("center")>-1){
                            let temp = valueCheck.split('|')
                            if(temp.length == 2){
                                if(checkAppSetting.indexOf(temp[0])>-1 || checkAppSetting.indexOf(temp[1])>-1){
                                    valueCheck = valueCheck.replace("center","top")
                                }
                                if(valueCheck=="center|center"){
                                    valueCheck = "center|top"
                                }
                            } else if(temp.length == 1){
                                valueCheck = valueCheck.replace("center","center|top")
                            }
                        } else{
                            if(valueCheck.indexOf("start")>-1){
                                valueCheck = "top|right"
                            } else if(valueCheck.indexOf("end")>-1){
                                valueCheck = "top|left"
                            }
                        }
                }
                let position = valueCheck.split('|')
                let array_t = ['top','bottom','end','start']
                let array_check = ['top','bottom','end','start','left','right','center']
                if(position.length == 2){
                    if(array_check.indexOf(position[0])<0 || array_check.indexOf(position[1])<0){
                        this.styleTitle = ""
                        return;
                    }
                    if(position[0] == 'center' && array_t.indexOf(position[1])<0){
                        if(position[0] == 'center'){
                            position[0] = 'onecenter'
                        }
                        this.styleTitle = position[0] + 'module ' + position[1] + 'module'
                        return;
                    }
                    if(position[1] == 'center' && array_t.indexOf(position[0])<0){
                        if(position[1] == 'center'){
                            position[1] = 'onecenter'
                        }
                        this.styleTitle = position[0] + 'module ' + position[1] + 'module'
                        return;
                    }
                    this.styleTitle = position[0] + 'module ' + position[1] + 'module'
                }else if(position.length == 1){
                    if(position[0] == 'center'){
                        this.styleTitle = 'one' +position[0] + 'module'
                        return;
                    }
                    this.styleTitle = position[0] + 'module'
                }
            },
            showButton(){
                let AB = JSON.stringify(this.item_buttons)
                for (var key in vm.flatRuntimeAttributes) {
                    if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                        AB = AB.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                        AB = AB.replace('"','\"');
                    }
                }  
                this.item_buttons = JSON.parse(AB);
            },
            handleJumpToSubmoduleDetail: function () {
                if(Object.keys(this.module.subModules).length===1){
                    vm.checkOneModule[this.module.code]=true;
                }else{
                    vm.checkOneModule[this.module.code]=false;
                }
                vm.activeScreenCom={}
                vm.activeComponentCode=""
                vm.activeFilterAndSearchCom=[]
                if(
                    (!vm.module_power.hasOwnProperty(this.module.code)) ||
                    (!this.module.hasOwnProperty('power_needed')) ||
                    (parseInt(vm.module_power[this.module.code]) >= parseInt(this.module.power_needed)) ||
                    (this.module.unavailable_behavior != 'disable')
                ){
                    vm.jumpToSubmoduleDetail(this.module.code,'all');
                }else{
                    toastr.error('You do not have enough power to use this item.');
                }
            },
            handleJumpToSubmodule: function () {
                vm.backToModule[this.module.code] = [1]
                if(
                    (!vm.module_power.hasOwnProperty(this.module.code)) ||
                    (parseInt(vm.module_power[this.module.code]) >= parseInt(this.module.power_needed)) ||
                    (this.module.unavailable_behavior != 'disable')
                ){
                    vm.jumpToSubmodule(this.module.code)
                }else{
                    toastr.error('You do not have enough power to use this item.');
                }
            }
        },

    });

</script>
<style>
.module_button .btn{
    margin: 0px !important;
    background-color: transparent !important;
    border: 0px !important;
}
.module_button i.isShowIcon{
    display: none !important;
}
.action-button:hover button {
    color: #000000 !important;
    font-weight: 500 !important;
}
/* .action-button:hover  {
    background-color: #e5f4f3;
} */
/* i {
    font-size: 16px;
} */
.module_button .action-button img{
    display: none !important;
}
.module_button .action-button span{
    padding: 0px !important;
}
.module_button span{
    display: block;
}
.module_button span:hover {
    display: block;
    background-color: #e5f4f3;
}
/* App setting */
.bottommodule{
    position: absolute;
    bottom: 0;
    width: 100%
}
.leftmodule{
    text-align: left !important;
}
.rightmodule{
    text-align: right !important;
}
.centermodule{
    text-align: center;
}
.endmodule{
    width: 65%;
    top: 50%;
    transform: translateY(-50%);
    position: absolute;
}
.startmodule{
    width: 65%;
    top: 50%;
    transform: translateY(-50%);
    position: absolute;
    right: 0px;
}
.onecentermodule{
    width: 100%;
    position: absolute;
    text-align: center;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
}
/* End App setting */
</style>
