<template id="submodule">
    <div style="position: relative;" :id="submodule.code">
        <div class="webapp-item"
                v-on:click="handleJumpToSubmoduleDetail" >
                <div class="webapp-background" :style="{'-webkit-filter':''+(submodule.hasOwnProperty('not_power')?'grayscale(100%)':'none'), 'background-image': 'url(' + submodule.background + ')', 'background-size':'100% 100%', 'padding-bottom':'100%','background-position': 'center','background-repeat': 'no-repeat', 'background-color': vm.flatRuntimeAttributes['primaryAppColor']}">
                </div>  
                <div class="overlay-style">
                    <div :class="addClassAppearance(modulitem)" 
                        style="
                            padding: 8px;
                            height: calc(100%/4);
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        "
                    >
                        <!-- <span class="webapp-title" v-html="submodule.title" style="font-weight:bolder;padding-top:0;"></span>                   -->
                        <span v-if="show_button" class="webapp-title " v-html="submodule.title" style="font-weight:bolder; padding-top:0; word-break: break-word;"></span> 
                        <span v-else  class="webapp-title" v-html="submodule.title" style="font-weight:bolder;padding-top:0;"></span>          
                    </div>                        
                </div>           
        </div>
        <div v-if="show_button" style="
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
        " class="dropdown toparea">
        <!-- <button class="btn btn-primary " type="button" data-toggle="dropdown">Dropdown Example
        <span class="caret"></span></button> -->
        <div data-toggle="dropdown" style="z-index: 3;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;" v-html="icon_button"></div>
        <div class="dropdown-menu pull-right module_button" style="overflow: auto;max-height: 40vh; border-radius: 4px !important; box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 8px;">
            <action-button v-for="(item_button,index) in item_buttons" :indexsearch="true" :end="index==item_buttons.length-1" :item_button="item_button" :task="task"> </action-button>
        </div>
    </div>
    </div>   
</template>

<script type="text/javascript">
    Vue.component('submodule', {
        template: '#submodule',
        props: ['submodule','modulitem'],
        data: function () {
            return {
                item_buttons:[],
                task:"",
                icon_button:"",
                show_button:false,
                styleTitle:"",
            }
        },
        created: function () {
            console.log('submodules',this.submodule);
            if (this.submodule.title == null || this.submodule.title == undefined) {
                this.submodule.title = ""
            }
            // clearParam(this.trigger,['name','type','skip_to','status_trigger']);
            if(this.submodule.hasOwnProperty('buttons') && this.submodule.buttons.length>0){
                let task={
                code: 9999,
                comitem: null,
                get: null,
                html_content: "",
                isDeleted: false,
                layout: "tabs",
                object: {
                    moduleCode:this.submodule.moduleCode,
                    subModuleCode:this.submodule.code,
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
                this.item_buttons=this.submodule.buttons;
                let AB = JSON.stringify(this.item_buttons)
                for (var key in vm.flatRuntimeAttributes) {
                    if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                        AB = AB.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                        AB = AB.replace('"','\"');
                    }
                }  
                this.item_buttons = JSON.parse(AB);
                if(this.submodule.buttons.length>1){
                    this.icon_button='<i style="transform: rotate(90deg);font-size: 16px;" class="fas fa-ellipsis-h"></i>';
                }else{
                    if(this.submodule.buttons[0].type=="act_fill_form" || this.submodule.buttons[0].type=="act_get_instance"){
                        this.icon_button='<i class="fa fa-calendar-plus-o"></i>';
                    }
                    else if(this.submodule.buttons[0].type=="act_call_cloudphone"){
                        this.icon_button='<i class="fa fa-phone"></i>';
                    }
                    else if(this.submodule.buttons[0].type=="act_call_api"){
                        this.icon_button='<i class="fa fa-cloud-download"></i>';
                    }
                    else if(this.submodule.buttons[0].type=="act_gps"){
                        this.icon_button='<i class="fa fa-map-marker"></i>';
                    }
                    else if(this.submodule.buttons[0].type=="act_report"){
                        this.icon_button='<i class="flaticon-diagram"></i>';
                    }
                    else if(this.submodule.buttons[0].type=="act_dm_view"){
                        this.icon_button='<i class="fa fa-bar-chart"></i>';
                    }
                    else if(this.submodule.buttons[0].type=="act_call" || this.submodule.buttons[0].type=="act_sms"){
                        this.show_button=false;
                    }
                    if(this.submodule.buttons[0].hasOwnProperty('imageUrl')){
                        this.icon_button = '<img src="'+this.submodule.buttons[0].imageUrl+'" style="width:1rem;">'
                    }
                }
            }
        },
        methods: {
            handleJumpToSubmoduleDetail: function () {
                vm.backToModule[this.submodule.moduleCode] = [1]
                if(
                    (!vm.module_power.hasOwnProperty(this.submodule.moduleCode)) ||
                    (!this.submodule.hasOwnProperty('power_needed')) ||
                    (parseInt(vm.module_power[this.submodule.moduleCode]) >= parseInt(this.submodule.power_needed)) ||
                    (this.submodule.unavailable_behavior != 'disable')
                ){
                    vm.jumpToSubmoduleDetail(this.submodule.moduleCode, this.submodule.code);
                }else{
                    toastr.error('You do not have enough power to use this item.');
                }
            },
            addClassAppearance: function(itemAppearance){
                // if(itemAppearance !== null){
                //     classNameObject = itemAppearance.replace(/[^A-Z0-9]/ig, '');
                //     return classNameObject + "submodule";
                // }
                let position = itemAppearance.split('|')
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
                        this.styleTitle = position[0] + 'submodule ' + position[1] + 'submodule'
                        return;
                    }
                    if(position[1] == 'center' && array_t.indexOf(position[0])<0){
                        if(position[1] == 'center'){
                            position[1] = 'onecenter'
                        }
                        this.styleTitle = position[0] + 'submodule ' + position[1] + 'submodule'
                        return;
                    }
                    this.styleTitle = position[0] + 'submodule ' + position[1] + 'submodule'
                }else if(position.length == 1){
                    if(position[0] == 'center'){
                        this.styleTitle = 'one' +position[0] + 'submodule'
                        return;
                    }
                    this.styleTitle = position[0] + 'submodule'
                }
                return this.styleTitle;
            },

        },

    });
</script>
<style>
.bottomleftsubmodule, .leftbottomsubmodule{
    position: absolute !important;
    bottom: 15px;
}
/* App setting */
.bottomsubmodule{
    position: absolute;
    bottom: 0;
    width: 100%
}
.leftsubmodule{
    text-align: left !important;
}
.rightsubmodule{
    text-align: right !important;
}
.centersubmodule{
    text-align: center;
}
.endsubmodule{
    width: 65%;
    top: 50%;
    transform: translateY(-50%);
    position: absolute;
}
.startsubmodule{
    width: 65%;
    top: 50%;
    transform: translateY(-50%);
    position: absolute;
    right: 0px;
}
.onecentersubmodule{
    width: 100%;
    position: absolute;
    text-align: center;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
}
/* i {
    font-size: 16px;
} */
/* End App setting */
</style>
