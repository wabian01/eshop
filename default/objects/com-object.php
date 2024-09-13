<template id="com-object">
<!-- margin-top: 8px;flex: 0 0 33.333333%; -->
<div style="position: relative;" :id="object.code" v-if="!object.code.includes('undefined-undefined')"> 
    <div class="webapp-item" v-on:click="handleOpenTask" >
        <div class="webapp-background" ref="divBg" :style="{'-webkit-filter':''+((not_power||object.hasOwnProperty('not_power'))?'grayscale(100%)':'none'), 'background-image': 'url(' + object.background + ')', 'background-size':'100% 100%', 'padding-bottom':'32%','background-repeat': 'no-repeat'}">
            
        </div>
        
        <div class="overlay-style">
            <div v-if="layout == 'tiles'" :class="addClassAppearance(subitem)" >
                <span class="object-title" v-html="object.title" style="font-weight:bolder"></span>
            </div>
            <div v-else="layout == 'tabs'" :class="addClassAppearance(comitem)" >
                <span class="object-title"  v-html="object.title" style="font-weight:bolder"></span>
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
    right: 10px;
    " class="dropdown toparea1">
    <!-- <button class="btn btn-primary " type="button" data-toggle="dropdown">Dropdown Example
    <span class="caret"></span></button> -->
    <div data-toggle="dropdown" style="z-index: 3;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;" class="dropdown-toggle" v-html="icon_button"></div>
    <div class="dropdown-menu pull-right module_button" style="overflow: auto;max-height: 40vh; border-radius: 4px !important; box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 8px;">
        <action-button v-for="(item_button,index) in item_buttons" :indexsearch="true" :end="index==item_buttons.length-1" :item_button="item_button" :task="task"> </action-button>
    </div>
  </div>      
</div>
</template>
<style type="text/css">
    .object-title{
        margin-left: 5px;
        margin-top: 5px;
        color: #ffffff;
        font-size: 12px;
    }
    .webapp-item{
        margin-bottom: 2px !important;
    }
    .centerendobject, .endcenterobject{
        text-align: center;
        position: absolute;
        z-index: 3;
        width: 50%;
        top: 50%;
        transform: translateY(-50%);
    }
    .startcenterobject, .centerstartobject{
        width: 50%;
        top: 50%;
        transform: translateY(-50%);
        position: absolute;
        right: 0px;
        text-align: center;
    }
    .rightstartobject,.startrightobject{
        width: 50%;
        top: 50%;
        transform: translateY(-50%);
        position: absolute;
        right: 0px;
        text-align: right;
        padding-right: 5px;
    }
    .leftstartobject, .startleftobject{
        width: 50%;
        top: 50%;
        transform: translateY(-50%);
        position: absolute;
        right: 0px;
        text-align: left;
    }
    .leftendobject, .endleftobject{
        text-align: left;
        position: absolute;
        z-index: 3;
        width: 50%;
        top: 50%;
        transform: translateY(-50%);
    }
    .rightendobject,.endrightobject{
        text-align: right;
        position: absolute;
        z-index: 3;
        width: 50%;
        top: 50%;
        transform: translateY(-50%);
    }
    .topleftobject, .lefttopobject{
        position: absolute;
        z-index: 3;
    }
    .toprightobject,.righttopobject{
        text-align: right;
        width: 100%;
        padding-right: 5px;
    }
    .topcenterobject,.centertopobject{
        text-align: center;
        width: 100%;
    }
    .bottomleftobject, .leftbottomobject,.bottomobject{
        position: absolute;
        width: 100%;
        text-align: left;
        padding: 5px;
        bottom: 0;
    }
    .centerobject{
        text-align: center;
        position: absolute;
        z-index: 3;
        width: 50%;
        left: 55%;
        top: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
    .bottomcenterobject,.centerbottomobject{
        position: absolute;
        bottom: 0;
        text-align: center;
        width: 100%;
        padding: 5px;
    }
    .bottomrightobject,.rightbottomobject{
        position: absolute;
        width: 100%;
        text-align: right;
        padding: 5px;
        bottom: 0;
    }
</style>

<script type="text/javascript">
    Vue.component('com-object', {
        template: '#com-object',
        props: ['object','layout', 'subitem', 'comitem','not_power'],
        data: function () {
            return {
                "bgHeight":0,
                item_buttons:[],
                task:"",
                icon_button:"",
                show_button:false,
            }

        },
        mounted: function () {
            let that = this;
            $(window).on('resize', function(){
                that.setDivBgSize();
            });
            that.setDivBgSize();
            (function($) {
                $.fn.hasScrollBar = function() {
                    return this.get(0).scrollHeight > this.height();
                }
            })(jQuery);
            setTimeout(() => {
                if($('#'+this.object.componentCode).hasScrollBar()){
                    $('#'+this.object.componentCode).css('overflow-y','auto')
                }else{
                    $('#'+this.object.componentCode).css('overflow-y','unset')
                }
                if($('#'+this.object.componentCode).parent('.tab-content').hasScrollBar()){
                    $('#'+this.object.componentCode).parent('.tab-content').css('overflow-y','auto')
                }else{
                    $('#'+this.object.componentCode).parent('.tab-content').css('overflow-y','unset')
                }
            }, 10);
            $(document).on("shown.bs.dropdown", ".toparea1", function () {
                var $ul = $(this).children(".dropdown-menu");
                if($ul.children().length<=1){
                    $ul.css({'display':'none'});
                    $ul.children().click();
                }
                var $button = $(this).children(".dropdown-toggle");
                var ulOffset = $button.offset();
                if (ulOffset.top+$ul.height()+$button.height()>=$(window).height()){
                    $(this).addClass("dropup");
                }
            }).on("hidden.bs.dropdown", ".toparea1", function() {
                $(this).removeClass("dropup");
            });
        },
        created: function () {
            // this.$parent.uiObject = 'display: flex;flex-wrap: wrap;'
            this.$parent.uiObject = 'display: grid; gap: 8px; grid-template-columns: repeat(auto-fill, minmax(30%, 1fr));'
//         	let that = this;
//             $(window).on('resize', function(){
//                 that.setDivBgSize();
//             });
            if(this.object.hasOwnProperty('buttons') && this.object.buttons.length>0){
                let task={
                        code: 9999,
                        comitem: null,
                        get: null,
                        html_content: "",
                        isDeleted: false,
                        layout: "tabs",
                        object: {
                            moduleCode:this.object.moduleCode,
                            subModuleCode:this.object.subModuleCode,
                            componentCode:this.object.componentCode,
                            code:this.object.code,
                            rawComponentCode:this.object.rawComponentCode
                        },
                        openFromAB: "",
                        post: null,
                        subitem: null,
                        title: null,
                        where: null}
                this.task=task;
                this.item_buttons=this.object.buttons;
                let AB = JSON.stringify(this.item_buttons)
                for (var key in vm.flatRuntimeAttributes) {
                    if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                        AB = AB.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                        AB = AB.replace('"','\"');
                    }
                }  
                this.item_buttons = JSON.parse(AB);
                this.show_button=true;
                if(this.object.buttons.length>1){
                    this.icon_button='<i style="transform: rotate(90deg);font-size: 16px;" class="fas fa-ellipsis-h"></i>';
                }else{
                    if(this.object.buttons[0].type=="act_fill_form" || this.object.buttons[0].type=="act_get_instance"){
                        this.icon_button='<i class="fa fa-calendar-plus-o"></i>';
                    }
                    else if(this.object.buttons[0].type=="act_call_cloudphone"){
                        this.icon_button='<i class="fa fa-phone"></i>';
                    }
                    else if(this.object.buttons[0].type=="act_call_api"){
                        this.icon_button='<i class="fa fa-cloud-download"></i>';
                    }
                    else if(this.object.buttons[0].type=="act_gps"){
                        this.icon_button='<i class="fa fa-map-marker"></i>';
                    }
                    else if(this.object.buttons[0].type=="act_report"){
                        this.icon_button='<i class="flaticon-diagram"></i>';
                    }
                    else if(this.object.buttons[0].type=="act_dm_view"){
                        this.icon_button='<i class="fa fa-bar-chart"></i>';
                    }
                    else if(this.object.buttons[0].type=="act_call" || this.object.buttons[0].type=="act_sms"){
                        this.show_button=false;
                    }
                    if(this.object.buttons[0].hasOwnProperty('imageUrl')){
                        this.icon_button = '<img src="'+this.object.buttons[0].imageUrl+'" style="width:1rem;">'
                    }
                }
            }
        },
        methods: {
            handleOpenTask: function () {
                if(this.not_power){
                    toastr.error('You do not have enough power to use this item.');
                    return;
                }

                // Support dismissParent(screenTheme) when click com-object
                if (this.object.hasOwnProperty('dismissParent') && this.object.dismissParent === true) {
                    this.object.dependView = vm.activeTaskCode; 
                    this.object.dismissPr = true;
                } else {
                    this.object.dependView = vm.activeTaskCode; 
                    this.object.dismissPr = false;
                }

                if(
                    (!vm.module_power.hasOwnProperty(this.object.moduleCode)) ||
                    (!this.object.hasOwnProperty('power_needed')) ||
                    (parseInt(vm.module_power[this.object.moduleCode]) >= parseInt(this.object.power_needed)) ||
                    (this.object.unavailable_behavior != 'disable')
                ){
                    vm.current={};
                    vm.openTask(this.object, this.layout, this.subitem, this.comitem)
                }else{
                    toastr.error('You do not have enough power to use this item.');
                }
            },
            setDivBgSize:function(){
                let bgWidth = this.$refs.divBg.offsetWidth;
                this.bgHeight = (bgWidth/3.125);
            },
            addClassAppearance: function(itemAppearance){
                if(itemAppearance !== null){
                    classNameObject = itemAppearance.replace(/[^A-Z0-9]/ig, '');
                    return classNameObject + "object";
                }
            }
        },
    });
</script>