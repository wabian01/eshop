const DMCloudPhone = {
    methods: {
        replacePlaceholders: function(template, data) {
            return template.replace(/##(.*?)##/g, function(match, placeholder) {
                let value = jsonPath(data, placeholder);
                if (value === false) {
                    value = "";
                } else {
                    value = value[0] !== null ? value[0] : "";
                }
                value = value.toString().replace(/\"/g, "\\\"").replace(/\s/g, " ");
                return value;
            });
        },
        replaceRuntimeAttributes: function(template, runtimeAttributes) {
            for (var key in runtimeAttributes) {
                if (runtimeAttributes.hasOwnProperty(key)) {
                    template = template.replace(new RegExp('##' + key + '##', 'g'), runtimeAttributes[key].replace(/[\r\n]+/g, " "));
                    template = template.replace('"', '\"');
                }
            }
            return template;
        },
        DMCloudPhone: function(event){
            const message = event.data.message;
            if(message === 'OpenDMCP'){
                vm.checkScreenCP.push(vm.tasks.length)
                let html_template = event.data.html_view.body_area[event.data.body_number].html_template;
                event.data.html_view.body_area[event.data.body_number].type="htmlCloudphone";

                html_template = this.replacePlaceholders(html_template,event.data.value2)
                html_template = this.replaceRuntimeAttributes(html_template,vm.flatRuntimeAttributes)
                
                event.data.html_view.body_area[event.data.body_number].html_template=html_template
                let id_random=event.data.html_view.code
                let object_temp = JSON.parse(JSON.stringify(event.data.value))
                object_temp.screens = {}
                object_temp.screens[id_random] = event.data.html_view
                vm.openTask(object_temp,"tabs", "center|start","center|start",null,null,null,null,null,id_random)
                
            }else if(message === 'OpenDMCPRecent'){
                let object = event.data.value
                vm.checkScreenCP.push(vm.tasks.length)
                vm.openTask(object, "tabs", "center|start","center|start")
            }else if(message === 'DMNull'){
                toastr.error(translations['Screen definition not found']);
            }else if(message === "OpenDMCPES"){
                vm.checkScreenCP.push(vm.tasks.length)
                let object = event.data.object
                let screen_item_new=event.data.screen_item_new;
                let list_item=event.data.list_item;
                let itemJSONString=JSON.stringify(screen_item_new);
                for (var key in list_item) {
                    if (list_item.hasOwnProperty(key) && list_item[key] != null ) {
                        if(list_item[key].toString().search("##") != -1){
                            list_item[key] = list_item[key].replace(new RegExp('^(##).*(##)','gm'),'null')
                        }
                        itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),list_item[key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                    }
                }

                itemJSONString = this.replaceRuntimeAttributes(itemJSONString,vm.flatRuntimeAttributes)

                screen_item_new=JSON.parse(itemJSONString)
                this.taskCP={
                        code: vm.tasks.length,
                        comitem: null,
                        get: null,
                        html_content: "",
                        isDeleted: false,
                        layout: "tabs",
                        object: {
                            moduleCode:object.moduleCode,
                            subModuleCode:object.subModuleCode,
                            componentCode:object.componentCode,
                            code:object.code,
                            rawComponentCode:object.rawComponentCode
                        },
                        openFromAB: "",
                        post: null,
                        subitem: null,
                        title: null,
                        where: null}
                if (screen_item_new.hasOwnProperty('item_onclick')) {
                    for (let i = 0; i < screen_item_new.item_onclick.length; i++) {
                        if(screen_item_new.item_onclick[i].hasOwnProperty('column') && screen_item_new.item_onclick[i].hasOwnProperty('value')){
                            if(list_item[screen_item_new.item_onclick[i].column] !== screen_item_new.item_onclick[i].value){
                                continue;
                            }
                        }
                        if(screen_item_new.item_onclick[i].type=='navigate' && object.screens.hasOwnProperty(screen_item_new.item_onclick[i].target_screen_id)){
                            let screen_html = object.screens[screen_item_new.item_onclick[i].target_screen_id].body_area
                            let html_template=""
                            let key_t = ""
                            Object.keys(screen_html).map(function(key, index) {
                                if(screen_html[key].type=='htmlView'){
                                    html_template=screen_html[key].html_template
                                    screen_html[key].type="htmlCloudphone";
                                    key_t=key
                                }
                            })

                            html_template = this.replacePlaceholders(html_template,list_item)
                            html_template = this.replaceRuntimeAttributes(html_template,vm.flatRuntimeAttributes)

                            screen_html[key_t].html_template=html_template
                            let id_random=screen_item_new.item_onclick[i].target_screen_id
                            let object_temp = JSON.parse(JSON.stringify(object))
                            object_temp.screens = {}
                            object_temp.screens[id_random] = object.screens[screen_item_new.item_onclick[i].target_screen_id]
                            vm.openTask(object_temp,"tabs", "center|start","center|start",null,null,null,null,null,id_random)
                        }
                        else if(screen_item_new.item_onclick[i].type == 'detail'){
                            try{
                                var temp = lang;
                            }
                            catch(err){
                                if(String(err).indexOf('en is not defined')){
                                    var lang = 'en'
                                }
                                else if(String(err).indexOf('vi is not defined')){
                                    var lang = 'vi'
                                }
                            }
                            lang = 'vi';
                            if(lang == 'en'){
                                var title = 'Detail';
                                var layout = screen_item_new.item_onclick[i].layout.split("<en>");
                                html_template = "<en>"+layout[1];
                            }
                            else{
                                var title = 'CHI TIẾT';
                                var layout = screen_item_new.item_onclick[i].layout.split("<en>");
                                html_template = layout[0];
                            }

                            id_random=Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
                            for (var key in list_item) {
                                if (list_item.hasOwnProperty(key) && list_item[key] != null ) {
                                    html_template = html_template.replace(new RegExp('##'+key+'##','g'),list_item[key].toString().replace(/[\r\n]+/g," "));
                                    html_template = html_template.replace('"','\"');
                                }
                            }

                            html_template = this.replaceRuntimeAttributes(html_template,vm.flatRuntimeAttributes)

                            let realTask = JSON.parse(JSON.stringify(object))
                            realTask.screen = {}
                            realTask.screens[id_random] = {
                                "code": id_random,
                                "title": title,
                                "top_area": [

                                ],
                                "body_area": [
                                    {
                                        "code": id_random,
                                        "screenCode": id_random,
                                        "type": "htmlCloudphone",
                                        "html_template": html_template,
                                    }
                                ],
                                "bottom_area": [

                                ]
                            }
                            vm.openTask(realTask,"tabs", "center|start","center|start",null,null,null,null,null,id_random)
                        
                        }
                        else if(screen_item_new.item_onclick[i].type == 'action_button'){
                            $(event.target).closest(".webapp-popup").find('.minimize-button button').click()
                            if(screen_item_new.item_onclick[i].button.type === 'act_call_cloudphone'){
                                this.$refs.actionbuttonCP.callCloudPhone(screen_item_new.item_onclick[i].button);
                            }
                            else if(screen_item_new.item_onclick[i].button.type === 'act_fill_form'){
                                this.$refs.actionbuttonCP.openFillForm(screen_item_new.item_onclick[i].button);
                            }
                            else if(screen_item_new.item_onclick[i].button.type === 'act_report'){
                                this.$refs.actionbuttonCP.openReportView(screen_item_new.item_onclick[i].button);
                            }
                            else if(screen_item_new.item_onclick[i].button.type === 'act_dm_view'){
                                if(screen_item_new.item_onclick[i].button.hasOwnProperty('alias')){
                                    screen_item_new.item_onclick[i].button.alias = screen_item_new.item_onclick[i].button.alias.replace(/##alias##/,list_item['alias'])
                                }
                                this.$refs.actionbuttonCP.openDataModalViews(screen_item_new.item_onclick[i].button);
                            }
                            else if(screen_item_new.item_onclick[i].button.type === 'act_gps'){
                                this.$refs.actionbuttonCP.openMapView(screen_item_new.item_onclick[i].button);
                            }
                        }
                        else{
                                toastr.error(translations['Screen definition not found']);
                        }
                    }
                }
            }
        },
    }
  }