const sendFinalizedInstances = {
    methods: {
        sendFinalizedInstances: function () {
            var that = this;
            let selectedInstances = this.selectedInstances;
            for (var instanceID in selectedInstances) {
                if (selectedInstances.hasOwnProperty(instanceID)) {
                    if(selectedInstances[instanceID] === false){
                        continue;
                    }
                    $.ajax({
                        url: "/webapp/webform/sendFinalizedInstance",
                        type: "POST",
                        data:{instanceID:instanceID,username: username},
                        dataType: "json",
                        success: function (data) {

                            if(data.status=="success") {
                                if(that.selectedInstances.hasOwnProperty(instanceID)){
                                    delete that.selectedInstances[instanceID];
                                }
                                toastr.success("Send successfully");

                                if(that.modules.hasOwnProperty(that.activeModuleCode)){
                                    if(that.modules[that.activeModuleCode].hasOwnProperty("functionCode")){
                                        that.getSystemModule(that.modules[that.activeModuleCode].functionCode);
                                    }
                                }
                            }else{
                                toastr.error(data.msg);
                            }
                        },
                        error: function (error) {
                            toastr.error(error);
                        }
                    });
                }
            }
        },
    }
  }