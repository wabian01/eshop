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
            this.initializeTempListItem();
            this.checkUrlAndReport();
            
            if (this.object.type === 'report') {
                return;
            }

            this.screen_item = JSON.parse(JSON.stringify(this.body_area));

            if (this.object.type === "act_open_html_screen") {
                this.handleContent(this.body_area);
                return;
            }

            this.handleTemplateProcessing();
            this.processLayout();
        },

        methods: {
            initializeTempListItem() {
                if (this.object.hasOwnProperty('tempListItem') && 
                    this.object.tempListItem != null && 
                    this.object.tempListItem != undefined
                ) {
                    setTimeout(() => {
                        vm.activeItemData = this.object.tempListItem;
                    }, 10);
                }
            },
            checkUrlAndReport() {
                if (this.body_area.html_template.indexOf('https://') === 0) {
                    this.loadURL = true;
                }

                if (this.object.type === 'report') {
                    this.stateUX = false;
                    this.item_content = this.body_area.html_template;
                }
            },

            handleTemplateProcessing() {
                const hasIframe = this.screen_item.html_template.indexOf('<iframe') !== -1;
                const hasWebform = this.screen_item.html_template.indexOf('webapp/webform/indexV2') !== -1;
                const hasNoScript = this.screen_item.html_template.indexOf('<script') < 0;

                if (hasIframe && hasWebform && hasNoScript) {
                    this.handleReplacements();
                    return;
                }

                if (this.screen_item.html_template.indexOf('onUpdate(data)') > -1) {
                    this.handleOnUpdateData();
                    return;
                }

                this.getdata = true;
            },

            handleOnUpdateData() {
                this.visualizehtml = true;
                if (this.object.dm_type === 'JsonHolder') {
                    this.processJsonHolder();
                }
            },

            async processJsonHolder() {
                setTimeout(async () => {
                    const value = await this.loadCacheJsonHolder();
                    const jsonholder = typeof(value) === 'string' ? JSON.parse(value) : value;
                    if (jsonholder != null) {
                        this.dataOnUpdate = vm.paramJsonHolder(jsonholder, this.task, this.object);
                        this.handleReplacements();
                    }
                }, 100);
            },

            processLayout() {
                if (!this.screen_item.hasOwnProperty('layout')) {
                    return;
                }

                const layout = this.screen_item.layout;
                if (!this.isValidHeight(layout.height)) {
                    return;
                }

                this.applyLayoutHeight(layout.height);
            },

            isValidHeight(height) {
                return height !== '' && height != null && height != 'null';
            },

            applyLayoutHeight(height) {
                const heightStr = height.toString();
                if (heightStr.includes('%')) {
                    this.applyPercentageHeight(heightStr);
                } else if (this.isValidNumericHeight(heightStr)) {
                    this.applyPixelHeight(heightStr);
                }
            },

            applyPercentageHeight(height) {
                this.layout += 'height:' + height.replace('%', '%') + ';';
                this.screen_item.layout.height = height.replace('%', 'vh');
                setTimeout(() => {
                    $("#" + this.$parent.id_random).css({'height': this.screen_item.layout.height});
                }, 100);
            },

            applyPixelHeight(height) {
                if (!isNaN(height) && Number(height) > -1) {
                    this.layout += 'height:' + height + 'px;';
                    setTimeout(() => {
                        $("#" + this.$parent.id_random).css({'height': height + 'px'});
                    }, 100);
                }
            },

            isValidNumericHeight(height) {
                return !isNaN(height) && Number(height) > -1;
            },

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
            setupMutationObserver: function() {
                let iframe_update = document.getElementById(this.id_random);
                let observer = new MutationObserver(() => {
                    this.updateIframeHeight(2000);
                });
                observer.observe(iframe_update.contentDocument.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    characterData: true
                });
            },

            updateIframeHeight: function(delay = 1000) {
                setTimeout(() => {
                    $('#' + this.id_random).height($('#' + this.id_random).contents().find("html").height());
                }, delay);
            },

            handleLayoutCase: function() {
                let iframe = document.getElementById(this.id_random);
                if (this.visualizehtml) {
                    this.tryUpdateIframeContent();
                }
                this.setupBeforeUnload(iframe);
                vm['checkIframe'] = {0: true};
                return true;
            },

            setupHeightCheck: function() {
                setTimeout(() => {
                    let heightEle = $('#' + this.id_random).contents().find("html").height();
                    if (heightEle === 0) {
                        this.pollForHeight();
                    } else {
                        $('#' + this.id_random).height(heightEle);
                    }
                }, 1000);
            },

            pollForHeight: function() {
                const checkHeight = setInterval(() => {
                    let newHeightEle = $('#' + this.id_random).contents().find("html").height();
                    if (newHeightEle !== 0) {
                        $('#' + this.id_random).height(newHeightEle);
                        clearInterval(checkHeight);
                    }
                }, 500);
            },

            setupContentListeners: function() {
                $('#' + this.id_random).contents().find('body').on('DOMSubtreeModified', () => {
                    this.updateIframeHeight();
                });

                $('#' + this.id_random).contents().find('body').on("click", () => {
                    if (this.isActiveScreen()) {
                        this.updateIframeHeight();
                    }
                });
            },

            isActiveScreen: function() {
                return (this.task.code === vm.activeTaskCode && 
                        this.screen_item.screenCode == vm.activeScreenCode) || 
                        this.task.code === 9999;
            },

            tryUpdateIframeContent: function() {
                try {
                    document.getElementById(this.id_random).contentWindow.onUpdate(this.dataOnUpdate);
                } catch (error) {
                    // Silent catch as per original code
                }
            },

            setupBeforeUnload: function(iframe) {
                $(iframe.contentWindow).on('beforeunload', () => {
                    if (vm.previousScreenCode !== "") {
                        vm['checkIframe'] = {0: false, 'id': this.id_random};
                    }
                });
            },

            checkIframe: function(event) {
                this.injectCSSVariables();
                this.setupMutationObserver();

                if (this.layout !== "") {
                    return this.handleLayoutCase();
                }

                try {
                    this.setupHeightCheck();
                } catch (error) {
                    // Silent catch as per original code
                }

                let iframe = document.getElementById(this.id_random);
                this.setupContentListeners();

                if (this.visualizehtml) {
                    this.tryUpdateIframeContent();
                }

                this.setupBeforeUnload(iframe);
                vm['checkIframe'] = {0: true};
            },
            checkUrlIframe: function() {
                this.loadURL = false
                setTimeout(() => {
                    let frameEle = document.getElementById('url-' + this.id_random);
                    frameEle.contentWindow.postMessage({
                        function: 'on_init',
                        initPlatform: 'webapp'
                    });
                }, 100);    
            },
            sortDataObject(data){
                try {
                    data.sort(function(b, a) {
                        if(new Date(jsonPath(a,this.object.key_attribute))!='Invalid Date' && isNaN(Number(jsonPath(a,this.object.key_attribute))) ){
                            return new Date(jsonPath(b,this.object.key_attribute))-new Date(jsonPath(a,this.object.key_attribute));
                        }else if(!isNaN(parseFloat(jsonPath(a,this.object.key_attribute)))){
                            return (parseFloat(jsonPath(b,this.object.key_attribute)))-(parseFloat(jsonPath(a,this.object.key_attribute)));
                        }else{
                            return (String(jsonPath(b,this.object.key_attribute))).localeCompare(String((jsonPath(a,this.object.key_attribute))));
                        }
                    })
                } catch (error) {}
                return data;
            },
            handleDataObject(){
                let that = this;
                let data = JSON.parse(JSON.stringify(this.list_data_object));
                data = this.sortDataObject(data)
                that.dataOnUpdate = data;  
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
            handleContent: function (screen_item) {
                this.item_content = screen_item.html_template;
                
                this.addMethodApp()

                if (!this.item_content.includes('<script') && this.item_content.includes('App.close()')) {
                    let jsClose = `<script>class App{static close(){window.top.postMessage('closeWebpage','*')}}</script>`
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
            addMethodApp(){
                if (this.item_content.includes('<script') || this.item_content.includes('<link')) {
                    let fontColorThemeTemp = typeof fontColorTheme === 'string' ? fontColorTheme : "";
                    let cssThemeTemp = typeof cssTheme === 'string' ? cssTheme : "";
                    
                    let functionApp = `
                        <script>
                            class App {
                                static callActionButton(json) {
                                    let moduleCode = '${this.object.moduleCode}';
                                    let subModuleCode = '${this.object.subModuleCode}';
                                    let componentCode = '${this.object.componentCode}';
                                    let code = '${this.object.code}';
                                    let rawComponentCode = '${this.object.rawComponentCode}';
                                    window.parent.vm.callActionButton(json, moduleCode, subModuleCode, componentCode, code, rawComponentCode);
                                }

                                static close() {
                                    window.top.postMessage('closeWebpage', '*');
                                }
                            }

                            function injectStyles() {
                                if (!document.querySelector('style[data-id="font-color"]')) {
                                    let style = document.createElement('style');
                                    style.setAttribute('data-id', 'font-color');
                                    style.textContent = ${JSON.stringify(fontColorThemeTemp)};
                                    document.head.appendChild(style);
                                }
                                document.documentElement.style.cssText = ${JSON.stringify(cssThemeTemp)};
                            }

                            injectStyles();
                        </script>`;
                    
                    this.item_content += functionApp;

                    if (this.updateData) {
                        this.updateData = false;
                        setTimeout(() => {
                            try {
                                document.getElementById(this.id_random).contentWindow.onUpdate(this.dataOnUpdate);
                            } catch (error) {}
                        }, 100);
                    }
                }
            },
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
                    this.handleDataObject();
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
