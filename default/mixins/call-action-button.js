const callActionButton = {
    methods: {
        callActionButton(json,moduleCode,subModuleCode,componentCode,code,rawComponentCode,jsonData){
            let button = JSON.parse(json);
            this.taskcallAB={
                code: this.tasks.length,
                comitem: null,
                get: null,
                html_content: "",
                isDeleted: false,
                layout: "tabs",
                object: {
                    moduleCode:moduleCode ? moduleCode : "undefined",
                    subModuleCode:subModuleCode ? subModuleCode : "undefined",
                    componentCode:componentCode ? componentCode : "undefined",
                    code:code ? code : "undefined",
                    rawComponentCode:rawComponentCode ? rawComponentCode : "undefined",
                    activeTaskCode: vm.activeTaskCode 
                },
                openFromAB: "",
                post: null,
                subitem: null,
                title: null,
                where: null
            }
            if(button.type != "act_share" && button.type != "act_jholder_remove" && button.type != "act_jholder_add" && button.type != "act_call" && button.type != "act_sms"){
                let typeTheme = ['popup-center','popup-dynamic','popup-bottom']
                let screenTheme = button?.screenTheme;
                if (!screenTheme || !typeTheme.includes(screenTheme)) {
                    $('#task-modal-'+vm.activeTaskCode).find('.minimize-button button').click()
                }
            }
            if(jsonData){
                this.jsonDataParent = JSON.parse(jsonData)
                setTimeout(() => {
                    if(button.type == 'act_call_cloudphone'){
                        this.$refs.callABForm.callCloudPhone(button);
                    }
                    else if(button.type == 'act_fill_form'){
                        this.$refs.callABForm.openFillForm(button);
                    }
                    else if(button.type == 'act_report'){
                        this.$refs.callABForm.openReportView(button);
                    }
                    else if(button.type == 'act_dm_view'){
                        this.$refs.callABForm.openDataModalViews(button);
                    }
                    else if(button.type == 'act_gps'){
                        this.$refs.callABForm.openMapView(button);
                    }
                    else if (button.type == "act_open_module"){
                        this.$refs.callABForm.openModule(button);
                    } 
                    else if (button.type == "act_share"){
                        this.$refs.callABForm.handleActionShare(button);
                    }
                    else if (button.type == "act_jholder_add"){
                        this.$refs.callABForm.addJsonHolder(button);
                    }
                    else if (button.type == "act_jholder_remove"){
                        this.$refs.callABForm.removeJsonHolder(button);
                    }  
                    else if (button.type == "act_open_html_screen"){
                        this.$refs.callABForm.openHtmlViewScreenTheme(button);
                    }                                  
                    else{
                        toastr.error(translations['Screen definition not found']);
                    }
                }, 10);
            }else {
                setTimeout(() => {
                    if(button.type == 'act_call_cloudphone'){
                        this.$refs.callAB.callCloudPhone(button);
                    }
                    else if(button.type == 'act_fill_form'){
                        this.$refs.callAB.openFillForm(button);
                    }
                    else if(button.type == 'act_get_instance'){
                        this.$refs.callAB.getInstance(button);
                    }
                    else if(button.type == 'act_report'){
                        this.$refs.callAB.openReportView(button);
                    }
                    else if(button.type == 'act_dm_view'){
                        this.$refs.callAB.openDataModalViews(button);
                    }
                    else if(button.type == 'act_gps'){
                        this.$refs.callAB.openMapView(button);
                    }
                    else if (button.type == "act_open_module"){
                        this.$refs.callAB.openModule(button);
                    }
                    else if (button.type == "act_share"){
                        this.$refs.callAB.handleActionShare(button);
                    }
                    else if (button.type == "act_jholder_add"){
                        this.$refs.callABForm.addJsonHolder(button);
                    }
                    else if (button.type == "act_jholder_remove"){
                        this.$refs.callABForm.removeJsonHolder(button);
                    } 
                    else if (button.type == "act_open_html_screen"){
                        this.$refs.callABForm.openHtmlViewScreenTheme(button);
                    }
                    else if (button.type == "act_exit"){
                        vm.closeTask(vm.tasks[vm.activeTaskCode])
                    }
                    else if (button.type == "act_open_chat"){
                        this.$refs.callAB.handleActionOpenChat(button);
                    }
                    else{
                        toastr.error(translations['Screen definition not found']);
                    }
                }, 10);
            }
        },
    }
  }