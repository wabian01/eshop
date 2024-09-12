const handleDynamicButtons = {
    methods: {
        replaceABDynamic(data,indexbutton,dynamic_buttons){
            let that = this
            data=data.sort((a,b)=>a.orderNumber-b.orderNumber)
            data.forEach(dynamic_button => {
                if(dynamic_button.actionID!=""){
                    dynamic_buttons.splice(indexbutton, 0, dynamic_button)
                    indexbutton++;
                }
            })
            var itemJSONString = JSON.stringify(dynamic_buttons);
            for (var key in that.list_item) {
                if (that.list_item.hasOwnProperty(key)) {
                    if(that.list_item[key] == null){
                        that.list_item[key] = "";
                    }
                    itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),that.list_item[key].toString().replace(/[\r\n]+/g," "));
                    itemJSONString = itemJSONString.replace('"','\"');
                }
            }
            for (var key in vm.flatRuntimeAttributes) {
                if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                    itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                    itemJSONString = itemJSONString.replace('"','\"');
                }
            }                
            for(var key in vm.current.parent){
                try {
                    itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].replace(/[\r\n]+/g," "));
                } catch (error) {
                }
                itemJSONString = itemJSONString.replace('"','\"');
            }
            if(itemJSONString.indexOf('${getdata_dmobj')>-1){
                    itemJSONString = vm.getDataDmobj(itemJSONString)
            }
            if(itemJSONString.indexOf('##source:dmobj')>-1){
                itemJSONString = vm.getSourceDmobj(itemJSONString)
            }
            itemJSONString = vm.jsonHolderData(itemJSONString,'buttonGroup')
            if(itemJSONString.indexOf('##')>-1){
                itemJSONString = itemJSONString.replace(/\\\"##(.*?)##\\\"/g,"''");
                itemJSONString = itemJSONString.replace(/##(.*?)##/g,"''");
            }                
            that.item_buttons = JSON.parse(itemJSONString);
        },
        handleDynamicButtons: async function(){
            let that = this;
            let indexbutton = 0;
            let item_buttons = this.item_buttons.sort((a,b)=>a.orderNumber-b.orderNumber);
            let dynamic_buttons = JSON.parse(JSON.stringify(item_buttons));  
            let p = $.when();
            item_buttons.forEach((button,index) => {
                p = p.then(function() { 
                    if(button.type=="dynamic"){
                        if(indexbutton === 0){
                            indexbutton = index;
                        }
                        if(button.hasOwnProperty('payloadLifetime')){
                            if(vm.payloadLifetime.hasOwnProperty(hashCode(button.source))){
                                let timeCache = vm.payloadLifetime[hashCode(button.source)].time
                                let timePayload = button.payloadLifetime * 1000
                                let timeCurrent = (new Date()).getTime()
                                if(timeCurrent - timeCache < timePayload){
                                    let button_cache = vm.payloadLifetime[hashCode(button.source)].buttons;
                                    that.replaceABDynamic(button_cache,indexbutton,dynamic_buttons)
                                    indexbutton = indexbutton + button_cache.length
                                    return;
                                }
                            }
                        }
                        return $.ajax({
                            url: button.source.replace("./",window.location.origin+"/"),
                            type: "GET",
                            contentType: "application/json",
                            dataType: "json",
                            success: function (data) {
                                if(typeof(data[0])==='string') return;
                                if(button.hasOwnProperty('payloadLifetime')){
                                    vm.payloadLifetime[hashCode(button.source)] = {
                                        time: (new Date()).getTime(),
                                        buttons: data
                                    }
                                }
                                that.replaceABDynamic(data,indexbutton,dynamic_buttons)
                                indexbutton = indexbutton + data.length

                            }, error: function (error) {
                                toastr.error(error);
                            }
                        });
                    }                   
                })
            })     
        },
    }
  }