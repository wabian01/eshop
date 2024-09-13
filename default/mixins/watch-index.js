const watchIndex = {
    watch: {
        topBarModule: function(buttons){
            if(buttons!=false){
                let task={
                        code: 9999,
                        comitem: null,
                        get: null,
                        html_content: "",
                        isDeleted: false,
                        layout: "tabs",
                        object: {
                            moduleCode:this.modules[this.activeModuleCode].code,
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
                this.item_buttons=buttons;
                let AB = JSON.stringify(this.item_buttons)
                for (var key in vm.flatRuntimeAttributes) {
                    if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                        AB = AB.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                        AB = AB.replace('"','\"');
                    }
                }  
                this.item_buttons = JSON.parse(AB);
                if(buttons.length>1){
                    this.icon_button='<i style="transform: rotate(90deg);font-size: 16px;" class="fas fa-ellipsis-h"></i>';
                }else{
                    if(buttons[0].type=="act_fill_form" || buttons[0].type=="act_get_instance"){
                        this.icon_button='<i class="fa fa-calendar-plus-o"></i>';
                    }
                    else if(buttons[0].type=="act_call_cloudphone"){
                        this.icon_button='<i class="fa fa-phone"></i>';
                    }
                    else if(buttons[0].type=="act_call_api"){
                        this.icon_button='<i class="fa fa-cloud-download"></i>';
                    }
                    else if(buttons[0].type=="act_gps"){
                        this.icon_button='<i class="fa fa-map-marker"></i>';
                    }
                    else if(buttons[0].type=="act_report"){
                        this.icon_button='<i class="flaticon-diagram"></i>';
                    }
                    else if(buttons[0].type=="act_dm_view"){
                        this.icon_button='<i class="fa fa-bar-chart"></i>';
                    }
                    else if(buttons[0].type=="act_call" || buttons[0].type=="act_sms"){
                        this.show_button=false;
                    }
                }
            }
        },
        activeModuleCode: function (newActiveModuleCode, oldActiveModuleCode) {
            console.log('timer',this.systemModuleTimer);
            if(this.systemModuleTimer != null){
                clearInterval(this.systemModuleTimer);
            }
            var that = this;
            if(this.modules[newActiveModuleCode].type == "system"){
                this.getSystemModule(this.modules[newActiveModuleCode].functionCode);
                this.systemModuleTimer = setInterval(function () {
                    that.getSystemModule(that.modules[newActiveModuleCode].functionCode);
                }, 60000);
            }
        },
        level: function (newLevel, oldLevel) {
            if(newLevel==0){
                this.objectLevel=0;
                this.objectSearchString="";
                this.previousScreenCode = "";

                setTimeout(() => {
                    heighthome = $('.home-view').width()
                    heightcontent = $('.home-view div').outerHeight() - 25;
                    if(heighthome>0 && heightcontent!=undefined){
                        this.renderUIHomeView(heightcontent)
                    }
                }, 100);
                if(w!=undefined){
                    vm.getDmObject()
                }
            }else if(newLevel==2){
                $("#webapp_workspace").scrollTop(0)
            }
        },
        objectSearchString: function (newObjectSearchString, oldObjectSearchString) {
            if(this.modules.hasOwnProperty(this.activeModuleCode)){
                if(this.modules[this.activeModuleCode].hasOwnProperty("functionCode")){
                    this.getSystemModule(this.modules[this.activeModuleCode].functionCode);
                }
            }
        }
    }
  }