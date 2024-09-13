<template id="divkit-view">
    <div style="height: 100%;">
       <div :id="'root-'+id_random"></div>
    </div>
</template>

<script type="text/javascript">
    Vue.component('divkit-view', {
        template: '#divkit-view',
        props: ['body_area','item_data', 'object','task','bottom_area_code','json_holder','status_ref','list_data_object'],
        data: function () {
            return {
                item_content:"",
                'limit':10,
                'page':1,
                id_random: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10) ,
                stateUX: true,
                screen_item:'',
                visualizehtml:false,
                dataOnUpdate:[],
                updateData:false,
                content_http:false,
                layout:"",
            }
        },
        mounted(){},
        created: function () { 
            this.screen_item =  JSON.parse(JSON.stringify(this.body_area))
                // this.getData();
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
            handleDataObject(){
                let that = this;
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
                if(that.object.alias != "" && data.length>0){
                    let id
                    if(vm.flatRuntimeAttributes[that.object.key_attribute] != undefined){
                        id = vm.flatRuntimeAttributes[that.object.key_attribute]
                    }else{
                        id = data[0][that.object.key_attribute]
                    }
                    vm.dmobj[that.object.alias] = {[id] : data[0]}
                    vm.saveToCache('dmobj',vm.dmobj)
                }
                $(".sk-circle").css({'display': 'none'  });
                if((that.screen_item.screenCode==vm.activeScreenCode || (that.task.code===9999 && vm.activeScreenCom[that.object.code]==that.screen_item.screenCode)) && vm.activeItemData == undefined){
                    that.item_data=data[0];
                    that.handleReplacements();
                }
            },
            handleReplacements:function () {
                let screen_item_fake = JSON.parse(JSON.stringify(this.screen_item))
                let itemJSONString = JSON.stringify(screen_item_fake);
                itemJSONString = vm.aggregateFunction(itemJSONString,this.item_data)
                let that=this
                itemJSONString=itemJSONString.replace(/##(\$.*?)##/g,function (match, capture) {
                    let value=jsonPath(that.item_data,capture);
                    if(value===false || value === undefined){
                        value=match
                    }else{
                        value=value[0]!==null?value[0]:""
                    }
                    value=value.toString().replace(/\"/g,"\\\"").replace(/\s/g," ")
                    return value;
                });               
                                    
                for (var key in this.item_data) {
                    if(this.item_data[key]==null){
                        this.item_data[key]='';
                    }
                    if (this.item_data.hasOwnProperty(key) && this.item_data[key]!==null ) {
                        if(typeof(this.item_data[key]) == 'object'){
                            itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),JSON.stringify(this.item_data[key]).toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                        }else{
                            itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),this.item_data[key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                        }
                        itemJSONString = itemJSONString.replace('"','\"');
                    }
                }
                for (var key in vm.flatRuntimeAttributes) {
                    if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {

                        itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].toString().replace(/[\r\n\t]+/g," "));
                        itemJSONString = itemJSONString.replace('"','\"');
                    }
                }
                for (var key in vm.current.parent) {
                    if (vm.current.parent.hasOwnProperty(key)) {
                        itemJSONString = vm.current.parent[key] != null ? (itemJSONString.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].toString().replace(/[\r\n\t]+/g," "))) : itemJSONString;
                        itemJSONString = itemJSONString.replace('"','\"');
                    }
                }
                
                if(itemJSONString.indexOf('##source:dmobj')>-1){
                    itemJSONString = vm.getSourceDmobj(itemJSONString)
                }
                if(itemJSONString.indexOf('##')>-1){
                    itemJSONString = itemJSONString.replace(/##(.*?)##/g,"");
                }
                this.handleContent(JSON.parse(itemJSONString));
            },
            handleContent:function (screen_item) {
                let that = this
                let schema = screen_item
                let schema_lang = schema.schema
                let lang = "<?php echo explode("_", Yii::app()->language)[0]; ?>";
                if(schema.hasOwnProperty('schema_by_locale')){
                    if(schema.schema_by_locale.hasOwnProperty(lang)){
                        schema_lang = schema.schema_by_locale[lang]
                    }
                }
                if(screen_item.type == "adaptiveCardView"){
                    let host_config = schema.host_config
                    var adaptiveCard = new AdaptiveCards.AdaptiveCard();
                    adaptiveCard.hostConfig = new AdaptiveCards.HostConfig(host_config);
                    adaptiveCard.onExecuteAction = function(action) { 
                        if(action._processedData!=undefined){
                            vm.callActionButton(JSON.stringify(action._processedData),"","","","","")
                        }
                    }
                    adaptiveCard.parse(schema_lang);
                    var renderedCard = adaptiveCard.render();
                    setTimeout(() => {
                        document.getElementById('root-'+this.id_random).innerHTML = ""
                        document.getElementById('root-'+this.id_random).appendChild(renderedCard)
                    }, 1);
                }
                if(screen_item.type == "divkitView"){
                    document.getElementById('root-'+this.id_random).innerHTML = ""
                    setTimeout(() => {
                        let divkit =  window.Ya.Divkit.render({
                        id: 'smth',
                        target: document.querySelector('#root-'+that.id_random)==null?document.querySelector('#root'):document.querySelector('#root-'+that.id_random),
                        json: {
                            card: schema_lang.card,
                            templates: schema_lang.templates
                        },

                        onError(details) {
                            
                        },
                        onStat(details) {
                            if(details.hasOwnProperty('action') && details.action.url.indexOf("div-action://rtab?")>-1){
                                let paramurl = details.action.url.replace("div-action://rtab?","");
                                let urlParams = new URLSearchParams(paramurl);
                                let params = Object.fromEntries(urlParams);
                                vm.callActionButton(JSON.stringify(params),"","","","","")
                            }
                        }
                    });
                    }, 1);
                }

            },
        },
        watch: {
            list_data_object(list_data_object_new,list_data_object_old){
                if(list_data_object_old==="waiting_loading"){
                    this.handleDataObject()
                }
            },
            status_ref(){
                
            },
            item_data: function() { // watch it
                if(this.task.code===vm.activeTaskCode && this.screen_item.screenCode==vm.activeScreenCode && vm.activeItemData != undefined){
                    this.handleReplacements();
                }
            },
            json_holder(json_holder){
                let temp = typeof(json_holder) == 'string' ? JSON.parse(json_holder) : json_holder
                if(temp.hasOwnProperty(this.object.dm_name)){
                    this.dataOnUpdate = vm.paramJsonHolder(temp,this.task,this.object);
                    this.handleReplacements();
                    if(this.visualizehtml){
                        document.getElementById(this.id_random).contentWindow.onUpdate(this.dataOnUpdate);
                    }
                }
            },
        },
    });
</script>