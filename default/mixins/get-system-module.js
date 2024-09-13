const getSystemModule = {
    methods: {
        getSystemModule:function (function_code) {
            var that = this;
            $.ajax({
                url: "/webapp/default/getSystemModule?functionCode="+function_code,
                type: "GET",
                contentType: "application/json",
                dataType: "json",
                success: function (data) {

                    if(data.sttCode=="S1001") {

                        if(that.objectLevel == 1){
                            if(data.modules.hasOwnProperty(that.activeModuleCode)){
                                let willBackToFormList = true;
                                for (var componentKey in data.modules[that.activeModuleCode]["subModules"][that.activeModuleCode+"-sub"]["components"]) {
                                    if (data.modules[that.activeModuleCode]["subModules"][that.activeModuleCode+"-sub"]["components"].hasOwnProperty(componentKey)) {
                                        willBackToFormList = willBackToFormList && !data.modules[that.activeModuleCode]["subModules"][that.activeModuleCode+"-sub"]["components"][componentKey]["objects"].hasOwnProperty(vm.activeObjectCode);
                                    }
                                }
                                if(willBackToFormList){
                                    that.backToFormList();
                                }
                            }
                        }
                        Object.assign(that.modules,data.modules);
                        that.subModules = that.getSubModules(Object.keys(data.modules)[0]);
                        that.components = that.getAllComponents(Object.keys(data.modules)[0]);
                        that.objects = that.getAllObjects(Object.keys(data.modules)[0]);

                        if(that.objectSearchString!=""){
                            let objectSearchString = stringToASCII(that.objectSearchString.toLowerCase());
                            const filteredObjects = {};
                            for (let objectKey in that.objects) {
                                if (that.objects.hasOwnProperty(objectKey)) {
                                    if(stringToASCII(that.objects[objectKey].title.toLowerCase()).indexOf(objectSearchString)>=0 || objectKey.indexOf(objectSearchString)>=0){
                                        that.objects[objectKey].visible = 1;
                                    }else{
                                        that.objects[objectKey].visible = 0;
                                    }
                                }
                            }
                        }

                    };
                }, error: function (error) {
                    toastr.error(error);
                }
            });
        },
    }
  }