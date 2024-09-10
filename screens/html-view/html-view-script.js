    Vue.component('html-view', {
        template: '#html-view',
        props: ['body_area','item_data', 'object','task','bottom_area_code','json_holder','status_ref','list_data_object','update_theme_css'],
        data: function () {
            this.isForm = typeof this.object !== "undefined" && this.object !== null && (['fill-form','edit-form','instance','form','report'].indexOf(this.object.type) >= 0)
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
                getdata:false,
                loadURL:false,
            }
        },
        mounted(){
            let that = this;
            $('#'+this.id_random+' iframe').load(function() {
                that.stateUX = false;
            })
            try {
                setTimeout(() => {
                    $('#'+that.id_random).height($('#'+that.id_random).contents().find("html").height())
                }, 1000);
                } catch (error) {
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
            if(this.body_area.html_template.indexOf('https://')===0){
                    this.loadURL = true
            } 
            if(this.object.type == 'report'){
                this.stateUX = false
                this.item_content = this.body_area.html_template
                return
            }
            this.screen_item =  JSON.parse(JSON.stringify(this.body_area))
            // skip api to render htmlView screenTheme
            if (this.object.type == "act_open_html_screen") {
                this.handleContent(this.body_area);
                return;
            }
            if(this.screen_item.html_template.indexOf('<iframe') != -1 && this.screen_item.html_template.indexOf('webapp/webform/indexV2') != -1 && this.screen_item.html_template.indexOf('<script') < 0){
                this.handleReplacements();
            }
            else if(this.screen_item.html_template.indexOf('onUpdate(data)')>-1){
                this.visualizehtml = true
                var that = this
                if(this.object.dm_type == 'JsonHolder'){
                    setTimeout(() => {
                        this.loadCacheJsonHolder()
                        .then((value)=>{
                            let jsonholder = typeof(value) == 'string' ? JSON.parse(value) : value
                            if(jsonholder != null){
                                that.dataOnUpdate = vm.paramJsonHolder(jsonholder,that.task,that.object);
                                that.handleReplacements()
                            }
                        })
                    }, 100);
                    return
                }
                this.onUpdate();
            }
            else{
                this.getdata = true
            }       
            if(this.screen_item.hasOwnProperty('layout')){
                if(this.screen_item.layout.hasOwnProperty('height') && this.screen_item.layout.height !== '' && this.screen_item.layout.height != null && this.screen_item.layout.height != 'null'){
                    if(this.screen_item.layout.height.toString().indexOf('%')>-1){
                        this.layout += 'height:'+this.screen_item.layout.height.replace('%',"%")+';'
                        this.screen_item.layout.height = this.screen_item.layout.height.replace('%',"vh");
                        setTimeout(() => {
                            $("#"+this.$parent.id_random).css({'height': this.screen_item.layout.height });
                        }, 100);
                    }else if(!isNaN(this.screen_item.layout.height.toString()) && Number(this.screen_item.layout.height)>-1){
                        this.layout += 'height:'+this.screen_item.layout.height+'px;'
                        setTimeout(() => {
                            $("#"+this.$parent.id_random).css({'height': this.screen_item.layout.height+'px' });
                        }, 100);
                    }
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
            injectCSSVariables: function() {
                let iframe = document.getElementById(this.id_random);
                if (!iframe.contentDocument.querySelector('style[data-id="font-color"]')) {
                    let style = document.createElement('style');
                    style.setAttribute('data-id', 'font-color')
                    if(typeof fontColorTheme !== 'undefined'){
                        style.textContent = fontColorTheme
                    }
                    iframe.contentDocument.head.appendChild(style);
                }
                if(typeof cssTheme !== 'undefined'){
                    iframe.contentDocument.documentElement.style.cssText = cssTheme;
                }            
            },
            checkIframe: function(event){
                let that = this;
                // Iframe_update 
                this.injectCSSVariables();
                let iframe_update = document.getElementById(this.id_random);
                let observer = new MutationObserver(function(mutations) {
                    setTimeout(() => {
                        $('#'+that.id_random).height($('#'+that.id_random).contents().find("html").height())
                    }, 2000);
                });
                observer.observe(iframe_update.contentDocument.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    characterData: true
                });

                if(this.layout!==""){
                    let iframe = document.getElementById(this.id_random);
                    if(this.visualizehtml){
                        try {
                            document.getElementById(this.id_random).contentWindow.onUpdate(this.dataOnUpdate);
                        } catch (error) {}
                        
                    }
                    $(iframe.contentWindow).on('beforeunload', function(){
                        if(vm.previousScreenCode != "") {
                            vm['checkIframe']={0:false,'id':that.id_random};
                            return;
                        }
                    });
                    vm['checkIframe']={0:true};
                    return
                }

                try {
                    setTimeout(() => {
                        let heightEle = $('#'+that.id_random).contents().find("html").height();
                        if (heightEle == 0) {
                            const checkHeight = setInterval(() => {
                                let newHeightEle = $('#'+that.id_random).contents().find("html").height();
                                if (newHeightEle !== 0) {
                                    $('#'+that.id_random).height(newHeightEle);
                                    clearInterval(checkHeight);
                                }
                            }, 500);
                        } else {
                            $('#'+that.id_random).height(heightEle);
                        }
                    }, 1000);
                } catch (error) {
                }
                let iframe = document.getElementById(this.id_random);
                
                $('#'+that.id_random).contents().find('body').on('DOMSubtreeModified', function(){
                    setTimeout(() => {   
                        $('#'+that.id_random).height($('#'+that.id_random).contents().find("html").height())
                    }, 1000);
                })
                $('#'+that.id_random).contents().find('body').on("click", function(){
                    setTimeout(() => {   
                        if ((that.task.code === vm.activeTaskCode && that.screen_item.screenCode == vm.activeScreenCode) || that.task.code === 9999) {
                            $('#'+that.id_random).height($('#'+that.id_random).contents().find("html").height())
                        }
                    }, 1000);
                })
                if(this.visualizehtml){
                    try {
                        document.getElementById(that.id_random).contentWindow.onUpdate(this.dataOnUpdate);
                    } catch (error) {}
                    
                }
                $(iframe.contentWindow).on('beforeunload', function(){
                    if(vm.previousScreenCode != "") {
                        vm['checkIframe']={0:false,'id':that.id_random};
                        return;
                    }    
                });
                vm['checkIframe']={0:true};
            },
            checkUrlIframe: function() {
                this.loadURL = false
                setTimeout(() => {
                    let frameEle = document.getElementById('url-' + this.id_random);
                    frameEle.contentWindow.postMessage({
                        function: 'on_init',
                        initPlatform: 'webapp'
                    }, '*');
                }, 100);    
            },
            handleDataObject(){
                let that = this;
                let order = "";
                let where = 'true';
                let get = null;
                let elasticsearch = "";
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
                    data.map(value=>{
                        id = value[that.object.key_attribute]
                        vm.dmobj[that.object.alias] = {...vm.dmobj[that.object.alias],...{[id] : value}}
                    })
                    vm.saveToCache('dmobj',vm.dmobj)
                }
                $(".sk-circle").css({'display': 'none'  });
                if((that.screen_item.screenCode==vm.activeScreenCode || (that.task.code===9999 && vm.activeScreenCom[that.object.code]==that.screen_item.screenCode)) && vm.activeItemData == undefined){
                    that.item_data=data[0];
                    that.handleReplacements();
                }
            },
            handleReplacements: function () {
                const screen_item_fake = JSON.parse(JSON.stringify(this.screen_item));
                screen_item_fake.html_template = this.processTemplate(screen_item_fake.html_template);
                this.handleContent(screen_item_fake);
            },

            processTemplate: function(template) {
                let processedTemplate = vm.aggregateFunction(template, this.item_data);
                processedTemplate = this.replaceJsonPaths(processedTemplate);
                if(this.item_data){
                    processedTemplate = this.replaceItemData(processedTemplate);
                }
                processedTemplate = this.replaceRuntimeAttributes(processedTemplate);
                if(vm.current.parent){
                    processedTemplate = this.replaceParentAttributes(processedTemplate);
                }
                processedTemplate = this.applyFinalProcessing(processedTemplate);
                return processedTemplate;
            },

            replaceJsonPaths: function(template) {
                return template.replace(/##(\$.*?)##|##$##/g, (match, capture) => {
                    if(capture === '$'){
                        return typeof this.item_data === 'object' 
                        ? JSON.stringify(this.item_data)
                        : JSON.stringify([]);
                    }
                    const value = jsonPath(this.item_data, capture);
                    if (value === false || value === undefined) return match;
                    const processedValue = value[0] !== null ? value[0] : "";
                    return typeof processedValue === 'object' 
                        ? JSON.stringify(processedValue)
                        : processedValue.toString().replace(/\"/g, "\\\"").replace(/\s/g, " ");
                });
            },

            replaceItemData: function(template) {
                for (const [key, value] of Object.entries(this.item_data)) {
                    if (value === null) continue;
                    const replacement = typeof value === 'object'
                        ? JSON.stringify(value).replace(/[\r\n]+/g, " ")
                        : value.toString().replace(/[\r\n]+/g, " ");
                    template = template.replace(new RegExp(`##${key}##`, 'g'), replacement);
                }
                return template.replace(/"/g, '\"');
            },

            replaceRuntimeAttributes: function(template) {
                for (const [key, value] of Object.entries(vm.flatRuntimeAttributes)) {
                    template = template.replace(new RegExp(`##${key}##`, 'g'), value.toString().replace(/[\r\n\t]+/g, " "));
                }
                return template.replace(/"/g, '\"');
            },

            replaceParentAttributes: function(template) {
                for (const [key, value] of Object.entries(vm.current.parent)) {
                    if (value === null) continue;
                    let processedValue = String(value).includes('$') ? value.replace(/\$/g, '$$$$') : value;
                    template = template.replace(new RegExp(`##${key}##`, 'g'), processedValue.toString().replace(/[\r\n\t]+/g, " "));
                }
                return template.replace(/"/g, '\"');
            },

            applyFinalProcessing: function(template) {
                template = vm.jsonHolderData(template, 'html_view');
                if (template.includes('${getdata_dmobj')) {
                    template = vm.getDataDmobj(template);
                }
                if (template.includes('##source:dmobj')) {
                    template = vm.getSourceDmobj(template);
                }
                return template.replace(/##(.*?)##/g, "");
            },
            handleContent:function (screen_item) {
                this.item_content = screen_item.html_template;
                if(this.item_content.indexOf('<script')>-1){
                    if(typeof fontColorTheme === 'undefined'){
                        fontColorTheme = ""
                    }
                    if(typeof cssTheme === 'undefined'){
                        cssTheme = ""
                    }
                    let functionApp = `
                            <script>
                                class App{
                                    static callActionButton(json){
                                        let moduleCode = '`+this.object.moduleCode+`';
                                        let subModuleCode = '`+this.object.subModuleCode+`';
                                        let componentCode = '`+this.object.componentCode+`';
                                        let code = '`+this.object.code+`';
                                        let rawComponentCode = '`+this.object.rawComponentCode+`';
                                        window.parent.vm.callActionButton(json,moduleCode,subModuleCode,componentCode,code,rawComponentCode)
                                    }

                                    static close() {
                                        window.top.postMessage('closeWebpage', '*');
                                    }
                                }  
                                if(!document.querySelector('style[data-id="font-color"]')) {
                                    let style = document.createElement('style');
                                    style.setAttribute('data-id', 'font-color')
                                    style.textContent = ${JSON.stringify(fontColorTheme)};
                                    document.head.appendChild(style);
                                }
                                document.documentElement.style.cssText = ${JSON.stringify(cssTheme)};
                            <\/script>`
                    this.item_content = this.item_content + functionApp
                    if(this.updateData){
                        this.updateData = false
                        setTimeout(() => {
                            try {
                                document.getElementById(this.id_random).contentWindow.onUpdate(this.dataOnUpdate);
                            } catch (error) {}
                        }, 100);
                    }
                }
                if (!this.item_content.includes('<script') && this.item_content.includes('App.close()')) {
                    let jsClose = `<script>class App{static close(){window.top.postMessage('closeWebpage','*')}}<\/script>`
                    this.item_content = this.item_content + jsClose    
                }
                if(this.item_content.indexOf('https://')===0){
                    this.content_http = true
                }
                try {
                    setTimeout(() => {
                        $('#'+this.id_random).height($('#'+this.id_random).contents().find("html").height())
                    }, 1000);
                } catch (error) {}
            },
            onUpdate(){
                let that = this;
                let order = "";
                let where = 'true';
                let get = null;
                let elasticsearch = "";
                if (typeof  this.object.query_params != 'undefined' && this.object.query_params != null) {
                    if (typeof  this.object.query_params.where != 'undefined' && this.object.query_params.where != null) {
                        where = this.object.query_params.where;
                    }
                    if (typeof  this.object.query_params.get != 'undefined' && this.object.query_params.get != null) {
                        get = this.object.query_params.get;
                    }
                    if(typeof  this.object.query_params.post_body != 'undefined' && this.object.query_params.post_body != null){
                        elasticsearch = this.object.query_params.post_body;
                    }
                }
                if(this.task.hasOwnProperty('where') != -1 && this.task.where != null && this.task.where.length > 0){
                    if(where != 'true'){
                        where = '(' + where + ') AND ' + this.task.where
                    }
                    else{
                        where = this.task.where
                    }
                }
                if(this.task.hasOwnProperty('get') != -1 && this.task.get != null){
                    if(get != null){
                        Object.assign(get,this.task.get)
                    }
                    else{
                        get = this.task.get
                    }
                }
                if(this.task.hasOwnProperty('post') && this.task.post != null){
                    elasticsearch = this.task.post;
                }
                if(this.object.dm_type == "Elasticsearch" && get != null && get !== "" && typeof(get) == 'string'){
                    get=JSON.parse(get);
                }
                elasticsearch = elasticsearch.replace(/\/\*(.*?)\*\//g,"")
                elasticsearch = elasticsearch.replace(/\/\d\*(.*?)\*\d\//g,"")
                if(this.object.dm_type == "Elasticsearch" && elasticsearch != "" && typeof(elasticsearch) == 'string'){
                    elasticsearch=JSON.parse(elasticsearch)
                }
                if(this.screen_item.hasOwnProperty('filterConfig') && Object.keys(this.screen_item.filterConfig).length > 0){
                    if(this.screen_item.filterConfig.hasOwnProperty('sortCol')!=true){
                        this.screen_item.filterConfig['sortCol'] = this.object.key_attribute;
                    }
                    if(this.screen_item.filterConfig.hasOwnProperty('order')!=true){
                        this.screen_item.filterConfig['order'] = 'ASC';
                    }
                    order = "`"+this.screen_item.filterConfig['sortCol']+"` "+this.screen_item.filterConfig['order']+"";
                }
                else if(this.screen_item.hasOwnProperty('sort')){
                    order = "`"+this.screen_item.sort.column+"` "+this.screen_item.sort.order+"";
                }
                else{
                    order = "`"+this.object.key_attribute+"` ASC";
                }
                let api_normal
                if(that.object.dm_type=="Custom"){ 
                    api_normal = that.object.path_normal
                    for (var key in vm.flatRuntimeAttributes) {
                        if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                            api_normal = api_normal.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].toString().replace(/[\r\n\t]+/g," "));
                            api_normal = api_normal.replace('"','\"');
                        }
                    }
                    for (var key in vm.current.parent) {
                        if (vm.current.parent.hasOwnProperty(key)) {
                            api_normal = vm.current.parent[key] != null ? (api_normal.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].toString().replace(/[\r\n\t]+/g," "))) : api_normal;
                            api_normal = api_normal.replace('"','\"');
                        }
                    }
                    get = this.object.query_params.get ? this.object.query_params.get : ""
                    get = this.task.get ? this.task.get : get
                }
                $.ajax({
                    url:that.object.dm_host + (that.object.dm_type=="V1" ? '/api/download/query' : that.object.dm_type=="V2" ? "/api/dm/getData" : that.object.dm_type=="Chained" ? '/api/dm/getChainedData' : that.object.dm_type=="Custom" ? "/" + api_normal : "/" +that.object.dm_name + '/_search'),
                    headers: that.object.dm_type == "Custom" ? {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+vm.flatRuntimeAttributes['user.access_token']
                    }:false,
                    type: (that.object.dm_type == "Elasticsearch" &&  elasticsearch !="" ) ? 'POST' : 'GET',
                    dataType:'json',
                    contentType: (that.object.dm_type == "Elasticsearch" &&  elasticsearch != "" ) ? 'application/json' : false,
                    data: (that.object.dm_type=="V1" || that.object.dm_type=="V2") ? 
                    {
                        token:that.object.token,
                        dm_name:that.object.dm_name,
                        where:where,
                        download:0,
                        mode:'query',
                        format:'json',
                        order: order,
                        ...get
                    } : that.object.dm_type=="Chained" ?
                    {
                        chain_name:that.object.dm_name,
                        token:that.object.token,
                        type:'group',
                        begin_at:'root',
                        conditions:where,
                        ...get
                    } : that.object.dm_type=="Custom" ? 
                    {
                        page: 1,
                        perPage: 99999,
                        ...get
                    }: (that.object.dm_type == "Elasticsearch" &&  elasticsearch !="" ) ? JSON.stringify(elasticsearch) : {...get},
                    success: function(data){  
                        if( (that.object.dm_type=="Elasticsearch" && !that.object.hasOwnProperty('data_path')) || (that.object.dm_type=="Elasticsearch" && that.object.hasOwnProperty('data_path') && (that.object.data_path=='' || that.object.data_path==null))){
                            let elasticsearch_data=JSON.parse(JSON.stringify(data));
                            data=jsonPath(elasticsearch_data,'hits.hits[*]._source')
                        }
                        if(that.object.dm_type=="Elasticsearch" && that.object.hasOwnProperty('data_path') && that.object.data_path!='' && that.object.data_path!=null){
                            let elasticsearch_data=JSON.parse(JSON.stringify(data));
                            data=jsonPath(elasticsearch_data.aggregations,that.object.data_path)
                        }    
                        if(that.object.dm_type=="Custom"){
                            data=jsonPath(data,that.object.data_path)
                        }      
                        if(that.object.hasOwnProperty('rule') && that.object.rule.length>0 && data.length>0 && typeof(that.object.rule)=='object'){
                            vm.configRule(data,that.object.rule)
                        }
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
                        that.dataOnUpdate=data;
                        $(".sk-circle").css({'display': 'none'  });
                        if(that.screen_item.screenCode==vm.activeScreenCode || (that.task.code===9999 && vm.activeScreenCom[that.object.code]==that.screen_item.screenCode)){
                            that.handleReplacements();
                        }
                    },
                    error:function(error){
                        that.item_data=[];
                        $(".sk-circle").css({'display': 'none'  });
                        if(that.screen_item.screenCode==vm.activeScreenCode || (that.task.code===9999 && vm.activeScreenCom[that.object.code]==that.screen_item.screenCode)){
                            that.handleReplacements();
                        }
                    }
                })
            }
        },
        watch: {
            update_theme_css(){
                let iframe = document.querySelector("#"+this.id_random+" iframe")
                if(iframe){
                    iframe.contentWindow.postMessage('updateTheme','*')
                }
                this.injectCSSVariables();
            },
            list_data_object(list_data_object_new,list_data_object_old){
                if(list_data_object_old==="waiting_loading" || !list_data_object_old){
                    this.handleDataObject()
                }
            },
            status_ref(){
                if(this.visualizehtml){
                    this.updateData = true
                    this.onUpdate();
                }else{
                    this.handleDataObject()
                }
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
        }
    });
