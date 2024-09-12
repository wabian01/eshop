Vue.component('button-group', {
        template: '#button-group',
        props: ['object','body_area','task','status_ref','item_data','json_holder','refresh_rate','list_data_object'],    
        mixins: [handleButtonVisible,addBgColor],  
        data: function(){
            return{
                statusButton:false,
                id_random:Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10),
                showButton:true,
                countAB:0,
                checkDataResfesh:"",
                data_button:"",
                list_item:[],
                bgColor:"",
                body_area_temp:"",
            }
        },
        created: function () {
            if (this.object.hasOwnProperty('tempListItem') && 
                this.object.tempListItem != null && 
                this.object.tempListItem != undefined
            ) {
                setTimeout(() => {
                    vm.activeItemData = this.object.tempListItem  
                }, 10);
            }
            var that = this
            if(this.object.dm_type == 'JsonHolder'){
                setTimeout(() => {
                    this.loadCacheJsonHolder()
                    .then((value)=>{
                        let jsonholder = typeof(value) == 'string' ? JSON.parse(value) : value
                        if(jsonholder != null){
                            vm.jsonHolder = typeof(value) == 'string' ? value : JSON.stringify(value)
                            that.handleJsonHolder()
                        }else{
                            that.handleJsonHolder()
                        }
                    })
                }, 100);
                return
            }

            let body_area_bg = JSON.parse(JSON.stringify(this.body_area));

            this.addBgColor("",body_area_bg)
        },
        watch: {
            list_data_object(list_data_object_new,list_data_object_old){
                if(list_data_object_old==="waiting_loading" || !list_data_object_old){
                    this.countAB = 0;
                    this.showButton = true;
                    this.handleDataObject()
                }
            },
            status_ref(value){
                this.countAB = 0;
                this.showButton = true;
                this.handleDataObject();
            },
            item_data(item_data){
                if(item_data != undefined && this.task.code===vm.activeTaskCode && this.body_area.screenCode==vm.activeScreenCode){
                    this.countAB = 0;
                    this.showButton = true;
                    this.buttonData();
                }
            },
            json_holder(json_holder){
                let temp = typeof(json_holder) == 'string' ? JSON.parse(json_holder) : json_holder
                if(temp.hasOwnProperty(this.object.dm_name)){
                    this.countAB = 0
                    this.showButton = true
                    this.handleJsonHolder()
                }
            },
            refresh_rate(){
                var that = this
                if(this.object.dm_type == 'JsonHolder'){
                    setTimeout(() => {
                        this.loadCacheJsonHolder()
                        .then((value)=>{
                            let jsonholder = typeof(value) == 'string' ? JSON.parse(value) : value
                            if(jsonholder != null){
                                vm.jsonHolder = typeof(value) == 'string' ? value : JSON.stringify(value)
                                that.countAB = 0
                                that.showButton = true
                                that.handleJsonHolder()
                            }
                        })
                    }, 100);
                    return
                }
            }
        },
        methods: {
            loadCacheJsonHolder: async function () {
                const temp = await this.getFromCache('jsonHolder');
                return temp;        
            },
            getFromCache: async function(key){
                if ( typeof(Storage) !== 'undefined') {
                    // get sessionStorage
                    const value = await localforage.getItem(key)
                    return value;
                } else {
                    console.log('Your browser does not support localStorage');
                }
                return {};
            },
            handleJsonHolder(){
                let body_area_replace = JSON.stringify(JSON.parse(JSON.stringify(this.body_area)))
                for(var key in this.item_data){
                    if(this.item_data.hasOwnProperty(key) && this.item_data[key] != null){
                        body_area_replace = body_area_replace.toString().replace(new RegExp('"##'+key+'##"','g'),'"'+(this.item_data[key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+'"');
                        body_area_replace = body_area_replace.toString().replace(new RegExp('\'##'+key+'##\'','g'),"'"+(this.item_data[key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                        body_area_replace = body_area_replace.toString().replace(new RegExp('##'+key+'##','g'),"'"+(this.item_data[key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                    }
                }
                body_area_replace = body_area_replace.replace(/\\"'(.*?)'\\"/g,'\\"$1\\"')
                for (var key in vm.flatRuntimeAttributes) {
                            if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                                body_area_replace = body_area_replace.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                                body_area_replace = body_area_replace.replace('"','\"');
                            }
                    }  
                for(var key in vm.current.parent){
                    try {
                        body_area_replace = body_area_replace.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].replace(/[\r\n]+/g," "));
                    } catch (error) {
                    }
                    body_area_replace = body_area_replace.replace('"','\"');
                }
                if(body_area_replace.indexOf('${getdata_dmobj')>-1){
                        body_area_replace = vm.getDataDmobj(body_area_replace)
                }
                if(body_area_replace.indexOf('##source:dmobj')>-1){
                    body_area_replace = vm.getSourceDmobj(body_area_replace)
                }
                body_area_replace = vm.jsonHolderData(body_area_replace,'buttonGroup')
                if(body_area_replace.indexOf('##')>-1){
                    body_area_replace = body_area_replace.replace(/##(.*?)##/g,"");
                }
                this.body_area_temp = JSON.parse(body_area_replace);
            },
            buttonData(){
                let body_area_replace = JSON.stringify(JSON.parse(JSON.stringify(this.body_area)))
                for(var key in this.item_data){
                    if(this.item_data.hasOwnProperty(key) && this.item_data[key] != null){
                        body_area_replace = body_area_replace.toString().replace(new RegExp('"##'+key+'##"','g'),'"'+(this.item_data[key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+'"');
                        body_area_replace = body_area_replace.toString().replace(new RegExp('\'##'+key+'##\'','g'),"'"+(this.item_data[key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                        body_area_replace = body_area_replace.toString().replace(new RegExp('##'+key+'##','g'),"'"+(this.item_data[key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                    }
                }
                body_area_replace = body_area_replace.replace(/\\"'(.*?)'\\"/g,'\\"$1\\"')
                for (var key in vm.flatRuntimeAttributes) {
                            if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                                body_area_replace = body_area_replace.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                                body_area_replace = body_area_replace.replace('"','\"');
                            }
                        }  
                for(var key in vm.current.parent){
                    try {
                        body_area_replace = body_area_replace.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].replace(/[\r\n]+/g," "));
                    } catch (error) {
                    }
                    body_area_replace = body_area_replace.replace('"','\"');
                }
                if(body_area_replace.indexOf('${getdata_dmobj')>-1){
                        body_area_replace = vm.getDataDmobj(body_area_replace)
                }
                if(body_area_replace.indexOf('##source:dmobj')>-1){
                    body_area_replace = vm.getSourceDmobj(body_area_replace)
                }
                body_area_replace = vm.jsonHolderData(body_area_replace,'buttonGroup')
                if(body_area_replace.indexOf('##')>-1){
                    body_area_replace = body_area_replace.replace(/##(.*?)##/g,"");
                }
                this.body_area_temp = JSON.parse(body_area_replace);
                this.handleDynamicButtons();
            },
            handleShowButton: function(check){
                if(check == false){
                    this.countAB = this.countAB + 1;
                }
                if(this.body_area_temp.buttons.length == this.countAB){
                    this.showButton = false;
                }
            },
            replaceABDynamic(data,indexbutton,dynamic_buttons,type=""){
                let that = this
                data=data.sort((a,b)=>a.orderNumber-b.orderNumber)
                data.forEach(dynamic_button => {
                    if(dynamic_button.actionID!=""){
                        dynamic_buttons.splice(indexbutton, 0, dynamic_button)
                        indexbutton++;
                    }
                })
                var itemJSONString = JSON.stringify(dynamic_buttons);
                for (var key in that.data_button) {
                    if (that.data_button.hasOwnProperty(key)) {
                        if(that.data_button[key] == null){
                            that.data_button[key] = "";
                        }
                        itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),that.data_button[key].toString().replace(/[\r\n]+/g," "));
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
                if(itemJSONString.indexOf('##') > -1) {
                    itemJSONString = itemJSONString.replace(/##(.*?)##/g,"");
                }  
                that.body_area_temp.buttons = JSON.parse(itemJSONString);
            },
            handleDynamicButtons: async function(){
                let that = this;
                let indexbutton = 0;
                let item_buttons = this.body_area_temp.buttons.sort((a,b)=>a.orderNumber-b.orderNumber);
                let dynamic_buttons = JSON.parse(JSON.stringify(item_buttons));  
                dynamic_buttons.forEach((dynamic_button,index) => {
                    if(dynamic_button.type == "dynamic"){
                        indexbutton = index;
                    }
                })
                let p = $.when();
                item_buttons.forEach(button => {
                    p = p.then(function() { 
                        if(button.type=="dynamic"){
                            this.statusButton = true;
                            if(button.hasOwnProperty('payloadLifetime')){
                                if(vm.payloadLifetime.hasOwnProperty(hashCode(button.source))){
                                    let timeCache = vm.payloadLifetime[hashCode(button.source)].time
                                    let timePayload = button.payloadLifetime * 1000
                                    let timeCurrent = (new Date()).getTime()
                                    if(timeCurrent - timeCache < timePayload){
                                        let button_cache = vm.payloadLifetime[hashCode(button.source)].buttons;
                                        that.replaceABDynamic(button_cache,indexbutton,dynamic_buttons)
                                        indexbutton = indexbutton + button_cache.length
                                        that.statusButton = false
                                        return;
                                    }
                                }
                            }
                        return  $.ajax({
                                url: button.source.replace("./","<?php echo AppEnv::BASE_URL ?>"+"/"),
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
                                    data=data.sort((a,b)=>a.orderNumber-b.orderNumber)
                                    data.forEach(dynamic_button => {
                                        if(dynamic_button.actionID!=""){
                                            dynamic_buttons.splice(indexbutton, 0, dynamic_button)
                                            indexbutton++;
                                        }
                                    })
                                    
                                    var itemJSONString = JSON.stringify(dynamic_buttons);
                                    for (var key in that.data_button) {
                                        if (that.data_button.hasOwnProperty(key)) {
                                            if(that.data_button[key] == null){
                                                that.data_button[key] = "";
                                            }
                                            itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),that.data_button[key].toString().replace(/[\r\n]+/g," "));
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
                                    if(itemJSONString.indexOf('##') > -1) {
                                        itemJSONString = itemJSONString.replace(/##(.*?)##/g,"");
                                    }  
                                    that.body_area_temp.buttons = JSON.parse(itemJSONString);
                                    that.statusButton = false;

                                }, error: function (error) {
                                    that.statusButton = false;
                                    toastr.error(error);
                                }
                            });
                        }                   
                    }) 
                });  
                
            },
            handleDataObject:function(){
                if (this.object.hasOwnProperty('tempListItem')) {
                    return; 
                }
                
                var body_area_replace = JSON.stringify(JSON.parse(JSON.stringify(this.body_area)))
                var that = this;
                var order = "";
                var where = 'true';
                var get=null;
                var elasticsearch="";
                let data = JSON.parse(JSON.stringify(this.list_data_object));
                
                try {
                    data.sort(function(b, a) {
                        if(new Date(jsonPath(a,that.object.key_attribute))!='Invalid Date' && isNaN(Number(jsonPath(a,that.object.key_attribute))) ){
                            return new Date(jsonPath(b,that.object.key_attribute))-new Date(jsonPath(a,that.object.key_attribute));
                        }else if(!isNaN(parseFloat(jsonPath(a,that.object.key_attribute)))){
                            return (parseFloat(jsonPath(b,that.object.key_attribute)))-(parseFloat(jsonPath(a,that.object.key_attribute)));
                        }else{
                            return (String(jsonPath(b,that.object.key_attribute))).localeCompare(String((jsonPath(a,that.object.key_attribute))));
                        }
                    })
                } catch (error) {}               
                if(that.$parent.$parent.$parent.hasOwnProperty('handleDataAB')){
                    that.$parent.$parent.$parent.handleDataAB(data[0])
                }
                that.checkDataResfesh = JSON.stringify(data[0]);
                that.data_button = data[0]
                that.list_item = data[0]
                body_area_replace = JSON.parse(body_area_replace)
                body_area_replace.buttons = that.handleButtonVisible(body_area_replace.buttons,data[0])
                body_area_replace = JSON.stringify(body_area_replace)

                body_area_replace=body_area_replace.replace(/##(\$.*?)##/g,function (match, capture) {
                        let value=jsonPath(data[0],capture);
                        if(value===false || value === undefined){
                            value=match
                        }else{
                            value=value[0]!==null?value[0]:""
                        }
                        value=value.toString().replace(/\"/g,"\\\"").replace(/\s/g," ")
                        return value;
                });  
                
                for(var key in data[0]){
                    if(data[0].hasOwnProperty(key) && data[0][key] != null){
                        body_area_replace = body_area_replace.toString().replace(new RegExp('"##'+key+'##"','g'),'"'+(data[0][key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+'"');
                        body_area_replace = body_area_replace.toString().replace(new RegExp('\'##'+key+'##\'','g'),"'"+(data[0][key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                        body_area_replace = body_area_replace.toString().replace(new RegExp('##'+key+'##','g'),(data[0][key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"')));
                    }
                }
                body_area_replace = body_area_replace.replace(/\\"'(.*?)'\\"/g,'\\"$1\\"')
                for (var key in vm.flatRuntimeAttributes) {
                            if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                                body_area_replace = body_area_replace.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                                body_area_replace = body_area_replace.replace('"','\"');
                            }
                        }  
                for(var key in vm.current.parent){
                    try {
                        body_area_replace = body_area_replace.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].replace(/[\r\n]+/g," ").replace(/[\"]+/g,'\\"'));
                    } catch (error) {
                    }
                    body_area_replace = body_area_replace.replace('"','\"');
                }
                if(body_area_replace.indexOf('${getdata_dmobj')>-1){
                    body_area_replace = vm.getDataDmobj(body_area_replace)
                }
                if(body_area_replace.indexOf('##source:dmobj')>-1){
                    body_area_replace = vm.getSourceDmobj(body_area_replace)
                }
                if(body_area_replace.indexOf('##')>-1){
                    body_area_replace = body_area_replace.replace(/##(.*?)##/g,"");
                }
                that.body_area_temp = JSON.parse(body_area_replace);
                that.handleDynamicButtons();           
            },
        }
    })