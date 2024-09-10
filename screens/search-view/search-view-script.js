    Vue.component('search-view', {
        template: '#search-view',
        props: ['object','task','body_area','screen'],
        data: function () {
            return {
                list_items:[],
                post_body:'',
                data_temp:[],
                page:1,
                value:'',
                scroll:false,
                notfound:'',
                lang:'en',
                scrollOff:false,
                list_items_temp:[],
                searchAdvance:false,
                valueAdvace:[],
                filterCode: Math.random().toString(36).substring(10),
                valuecheck:"",
                hint:"<vi>Tìm kiếm</vi><en>Search</en>",
                showQR:false,
                html5QrcodeScanner:"",
                turnCameraQR: false,
                stateSearchRule:false,
                dataSave:[] ,
                currentSearch:[],
                showMore: true,
                listinput:[],
                inputsearch:[],
                quickfilter:{},
                valueQuick:[],
                getStatus:"",
                bgColor:"",
                bgSearchBar:"",
                searchBarCorner:"",
                searchBarShadow:"",
                leftRightPadding:"",
                topSearches:"",
                heightrow:"",
                paddingNewInput:"",
                paddingNewItem:"",
                re_render_tem:true,
                dynamicTemplate:false,
                typeSelected:'',
                body_area_temp:{},
                listJS: false,
            }
        },
        mounted(){
            let that = this;
            if(this.body_area.hasOwnProperty('qrscan') && this.body_area.qrscan){
                var html5QrcodeScanner = new Html5QrcodeScanner(
                    "reader-"+this.filterCode, { fps: 10, qrbox: 250 });
                this.html5QrcodeScanner = html5QrcodeScanner;
                html5QrcodeScanner.render(onScanSuccess);
                function onScanSuccess(decodedText, decodedResult) {
                    that.qrScanCode(decodedText);
                    that.turnCameraQR = false;
                    $('#qrcode-'+that.filterCode).modal('hide');
                    html5QrcodeScanner.cameraStop();
                }

                $('#qrcode-'+this.filterCode).on('hide.bs.modal', function (e) {
                    if($('#reader-'+that.filterCode+'__scan_region').children('img').length>0){
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        return false; 
                    }else{
                        that.turnCameraQR = false;
                        that.html5QrcodeScanner.cameraStop();
                    }
                });

            }

            if(this.body_area.hasOwnProperty('autofocus') && this.body_area.autofocus){
                setTimeout(() => {
                    this.actionFocus();
                }, 1000);
            }
            
            // Checking currentListViewStyle is availble
            if (localStorage.getItem("currentSearchViewStyle/"+this.screen.code) !== null) {
                this.typeSelected = localStorage.getItem("currentSearchViewStyle/"+this.screen.code)
                setTimeout(() => {
                    this.switchType(this.typeSelected);
                }, 200);
            } else {
                // Render active default icon
                if (this.body_area.item_template.template_default.type == 'article') {
                    this.typeSelected = 'article'
                } else if (this.body_area.item_template.template_default.type == 'gallery') {
                    this.typeSelected = 'gallery'
                } else if (this.body_area.item_template.template_default.type == 'gallery2') {
                    this.typeSelected = 'gallery2'
                } else {
                    // some other types: html, divkit, ...
                }
            }
            
        },
        created: function () {
            this.body_area_temp = JSON.parse(JSON.stringify(this.body_area))
            this.$parent.$parent.list_data_object =  false
            if(this.$parent.skip_object){
                setTimeout(() => {
                    let height_tem = $("#"+this.$parent.id_random).parent().parent().parent().height()
                    this.heightrow = height_tem + "px"
                    if (this.body_area.layout && this.body_area.layout.height) {
                        this.heightrow = this.body_area.layout.height;
                    }
                    this.heightrow = typeof this.heightrow === "number" ? this.heightrow + "px" : this.heightrow;
                    if (this.heightrow.includes('%')) {
                        this.heightrow = height_tem*(parseInt(this.heightrow)/100) + "px"
                    }
                    this.heightrow = `height: ${this.heightrow};`;
                }, 10);
            }
            if(vm.newtemplate){
                this.paddingNewInput = 'padding: 0.5em 0px 0.5em 10px !important;'
                this.paddingNewItem = 'padding: 0 10px !important;'
                setTimeout(() => {
                    this.heightrow1 = 100 + "%"
                    if (this.body_area.layout && this.body_area.layout.height) {
                        this.heightrow1 = this.body_area.layout.height;
                    }
                    this.heightrow1 = typeof this.heightrow1 === "number" ? this.heightrow1 + "px" : this.heightrow1;
                    if (this.heightrow1.includes('%')) {
                        this.heightrow1 = this.heightrow1.replace('%','vh')
                    }
                    $("#"+this.$parent.id_random).css('height', this.heightrow1);
                }, 10);
            }
            let that = this;
            let lang = "<?php echo explode("_", Yii::app()->language)[0]; ?>";

            let body_area_bg = JSON.parse(JSON.stringify(this.body_area));

            if (typeof body_area_bg.background_color === 'string' && body_area_bg.background_color.includes('##')) {
                body_area_bg.background_color = this.handleBgColor(body_area_bg.background_color);
            }
            if (typeof body_area_bg.search_bar_bg_color === 'string' && body_area_bg.search_bar_bg_color.includes('##')) {
                body_area_bg.search_bar_bg_color = this.handleBgColor(body_area_bg.search_bar_bg_color);
            }

            if (body_area_bg.background_color !== undefined && 
                body_area_bg.background_color !== null && 
                body_area_bg.background_color !== ""
            ) {
                if (body_area_bg.background_color.length == 7 && body_area_bg.background_color.startsWith("#")) {
                    this.bgColor = "background-color: "+body_area_bg.background_color+";"; 
                } else if (!body_area_bg.background_color.startsWith("#")) {
                    this.bgColor = "background-color: "+body_area_bg.background_color+";"; 
                } else {
                    // have # but length !== 7
                    this.bgColor = "";
                }   
            }

            if (body_area_bg.search_bar_bg_color !== undefined && 
                body_area_bg.search_bar_bg_color !== null && 
                body_area_bg.search_bar_bg_color !== ""
            ) {
                this.bgSearchBar = "background-color: "+body_area_bg.search_bar_bg_color+";"; 
            }
            
            if (this.body_area.hasOwnProperty('search_bar_corner') && this.body_area.search_bar_corner == "round") {
                this.searchBarCorner = "border-radius: 6px !important;"
                this.leftRightPadding = "padding: 4px 4px 0 4px !important;"
            }

            if (this.body_area.hasOwnProperty('search_bar_shadow') && (this.body_area.search_bar_shadow == true || this.body_area.search_bar_shadow == "true")) {
                this.searchBarShadow = "box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;"
                if (!this.body_area.hasOwnProperty('search_bar_bg_color') || (this.body_area.hasOwnProperty('search_bar_bg_color') && (this.body_area.search_bar_bg_color == "" || !this.body_area.search_bar_bg_color.includes("#"))) ) {
                    this.leftRightPadding = "padding: 4px 4px 0 4px !important;"
                }    
            }

            if(this.body_area.hasOwnProperty('hint')){
                this.hint = this.body_area.hint
            }
            if(lang==='vi'){
                this.lang = 'vi';
                this.hint.replace(/<vi>(.*)<\/vi>/,function(key1,key2){
                    that.hint = key2;
                })
            }else{
                this.lang = 'en';
                this.hint.replace(/<en>(.*)<\/en>/,function(key1,key2){
                    that.hint = key2;
                })
            }
            if(this.body_area.hasOwnProperty('qrscan') && this.body_area.qrscan){
                this.showQR = true;
            }
            if(this.body_area.hasOwnProperty('advanced') && this.body_area.advanced.length>0){
                this.body_area.advanced.map((filter,index)=>{
                    if((filter.hasOwnProperty('suggestion') && filter.suggestion[0]!=undefined && filter.suggestion[0].toString().indexOf('__lite_connection')>-1 )|| filter.hasOwnProperty('check')){
                        if(!filter.hasOwnProperty('check')){
                            filter['check'] = filter.suggestion[0];
                        }else{
                            filter.suggestion = []
                            filter.suggestion[0] = filter['check']
                        }
                        
                        let regExp = /\(([^)]+)\)/;
                        let matches = regExp.exec(filter.suggestion[0])[1];
                        if(that.object.lite_connection && that.object.lite_connection[matches]!=undefined){
                            that.dynamicFilter(that.object.lite_connection[matches],index)
                        }else{
                            filter.suggestion=[];
                        }
                    }
                })
                this.searchAdvance = true;
            }
            if(this.body_area.hasOwnProperty('search_rules') && this.body_area.search_rules.length>0){
                this.stateSearchRule = true;
            }
            if(this.body_area.hasOwnProperty('default_search')){

                let langVi = (this.body_area.default_search.__input__).includes("<vi>");
                let langEn = (this.body_area.default_search.__input__).includes("<en>");
                if (langVi && langEn) {
                    if(lang === 'vi') {
                        this.body_area.default_search.__input__.replace(/<vi>(.*)<\/vi>/, function(key1,key2) {
                            that.body_area.default_search.__input__ = key2;
                        })
                    } else {
                        this.body_area.default_search.__input__.replace(/<en>(.*)<\/en>/, function(key1,key2) {
                            that.body_area.default_search.__input__ = key2;
                        })
                    }   
                } else if (langEn && !langVi) {
                    this.body_area.default_search.__input__.replace(/<en>(.*)<\/en>/, function(key1,key2) {
                        that.body_area.default_search.__input__ = key2;
                    })
                } else if (langVi && !langEn) {
                    if(lang === 'vi') {
                        this.body_area.default_search.__input__.replace(/<vi>(.*)<\/vi>/, function(key1,key2) {
                            that.body_area.default_search.__input__ = key2;
                        })
                    } else {
                        that.body_area.default_search.__input__ = this.body_area.default_search.__input__;  
                    } 
                }
                this.valuecheck = this.body_area.default_search.__input__
                setTimeout(() => {      
                    this.defaulSearch()
                }, 10);
                
            }
            this.dataSave = localStorage.getItem("currentSearch/"+this.screen.code) ? JSON.parse(localStorage.getItem("currentSearch/"+this.screen.code)) : []
            this.currentSearch = this.dataSave

            if(this.body_area.hasOwnProperty('filterConfig') && this.body_area.filterConfig.hasOwnProperty('quick')){
                if((this.body_area.filterConfig.quick.hasOwnProperty('entries') && this.body_area.filterConfig.quick.entries[0]!=undefined && this.body_area.filterConfig.quick.entries[0].indexOf('__lite_connection')>-1 )|| this.body_area.filterConfig.quick.hasOwnProperty('check')){
                        if(!this.body_area.filterConfig.quick.hasOwnProperty('check')){
                            this.body_area.filterConfig.quick['check'] = this.body_area.filterConfig.quick.entries[0];
                        }else{
                            this.body_area.filterConfig.quick.entries = []
                            this.body_area.filterConfig.quick.entries[0] = this.body_area.filterConfig.quick['check']
                        }
                        
                        let regExp = /\(([^)]+)\)/;
                        let matches = regExp.exec(this.body_area.filterConfig.quick.entries[0])[1];
                        if(that.object.lite_connection[matches]!=undefined){
                            that.dynamicFilterQuick(that.object.lite_connection[matches])
                        }else{
                            this.body_area.filterConfig.quick.entries=[];
                            this.quickfilter = {...this.body_area.filterConfig.quick}
                        }
                        
                }else{
                    this.quickfilter = {...this.body_area.filterConfig.quick}
                }
                
            }
            
            // Dynamic_style
            if (!this.body_area.hasOwnProperty('dynamic_style') &&
                (this.body_area.item_template?.template_default?.attributes?.thumbnail || this.body_area.item_template?.template_default?.attributes?.image) &&
                (this.body_area.item_template.template_default.type == 'article' || 
                this.body_area.item_template.template_default.type == 'gallery'  || 
                this.body_area.item_template.template_default.type == 'gallery2')
            ) {
                this.dynamicTemplate = true;
            } else if (
                this.body_area.dynamic_style.template === "dynamic" &&
                (this.body_area.item_template?.template_default?.attributes?.thumbnail || this.body_area.item_template?.template_default?.attributes?.image) &&
                (this.body_area.item_template.template_default.type == 'article' || 
                this.body_area.item_template.template_default.type == 'gallery'  || 
                this.body_area.item_template.template_default.type == 'gallery2')
            ) {
                this.dynamicTemplate = true;
            } else {
                this.dynamicTemplate = false;
            }
        },
        watch:{
            valuecheck(valuecheck){
                if(valuecheck === ""){
                    this.valueAdvace = [];
                    this.listinput = [];
                    this.remove();
                }
            },
            notfound(notfound){
                if(notfound!==""){
                    if(this.body_area.hasOwnProperty('when_empty')){
                        if(this.body_area.when_empty == 'hide_view'){
                            this.notfound = ''
                            return;
                        }else{
                            this.handleHideView()
                            return;
                        }
                    }
                }
            },
        },
        beforeDestroy: function(){
            this.html5QrcodeScanner.clear();
        },
        methods: {
            handleBgColor(data){
                for (let key in vm.flatRuntimeAttributes) {
                    if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                        const replacement = vm.flatRuntimeAttributes[key]?.toString().replace(/[\r\n]+/g, ' ');
                        data = data.replace(new RegExp('##' + key + '##', 'g'), replacement);
                        data = data.replace(/"/g, '\\"');
                    }
                }

                for (let key in vm.current.parent) {
                    if (vm.current.parent.hasOwnProperty(key)) {
                        const parentValue = vm.current.parent[key]?.toString().replace(/[\r\n\t]+/g, ' ');
                        data = parentValue !== null ? data.replace(new RegExp('##' + key + '##', 'g'), parentValue) : data;
                        data = data.replace(/"/g, '\\"');
                    }
                }

                data = data.replace(/##(.*?)##/g, '');
                return data
            },
            switchType(type) {
                localStorage.setItem("currentSearchViewStyle/"+this.screen.code, type);
                this.typeSelected = type;
                this.re_render_tem = false
                this.body_area_temp.item_template.template_default.type = type
                if (type === 'article') {
                    let ar = this.body_area_temp?.item_template?.template_default?.attributes?.image
                    ar ? this.body_area_temp.item_template.template_default.attributes.thumbnail = ar : ''
                } else {
                    let gv = this.body_area_temp?.item_template?.template_default?.attributes?.thumbnail 
                    gv ? this.body_area_temp.item_template.template_default.attributes.image = gv : ''
                }
                setTimeout(() => {
                    this.re_render_tem = true
                }, 100);
            },
            handleHideView(){
                    let itemJSONString = this.body_area.when_empty
                    for (var key in this.flatRuntimeAttributes) {
                        if (this.flatRuntimeAttributes.hasOwnProperty(key)) {
                            itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),this.flatRuntimeAttributes[key].replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                        }
                    }
                    for(var key in vm.current.parent){
                        try {
                            itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                        } catch (error) {
                        }
                    }
                    if(itemJSONString.indexOf('<script')>-1){
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
                                    }}  
                            <\/script>`
                        itemJSONString = itemJSONString + functionApp
                        this.listJS = true;
                    }
                    this.notfound = itemJSONString;
            },
            checkIframe:function(){
                this.retryHeight($(event.target)[0])
                this.retryIfHeight()
            },
            retryHeight(iframe){
                let count=0
                let retryIframe = setInterval(() => {
                    if(count>5){
                        clearInterval(retryIframe);
                    }
                    try {
                        if(iframe.contentWindow.document.documentElement.scrollHeight>0){
                            count++
                            iframe.style.height=iframe.contentWindow.document.documentElement.scrollHeight +'px';
                        } 
                    } catch (error) {}
                }, 1000);
            },
            searchInput(event,index,filter){
                this.inputsearch['__advanced_'+index+'__'] = $(event.target).val().toLowerCase()
                this.$forceUpdate();
            },
            removeTag(option,index){
                if(this.valueAdvace.hasOwnProperty('__advanced_'+index+'__')){
                    const indexInArray = this.valueAdvace['__advanced_'+index+'__'].indexOf(option);
                    if(indexInArray>-1 && indexInArray!=undefined){
                        if(typeof(this.valueAdvace['__advanced_'+index+'__']) === 'object'){
                            this.valueAdvace['__advanced_'+index+'__'].splice(indexInArray, 1);
                            this.listinput['__advanced_'+index+'__'].splice(indexInArray, 1);
                            if(this.valueAdvace['__advanced_'+index+'__'].length==0){
                                delete this.valueAdvace['__advanced_'+index+'__'];
                            }
                        }else{
                            this.valueAdvace['__advanced_'+index+'__'] = ""
                            if(this.valueAdvace['__advanced_'+index+'__'] === ""){
                                delete this.valueAdvace['__advanced_'+index+'__'];
                            }
                            this.listinput['__advanced_'+index+'__'] = []
                        }
                        
                    }
                }
                this.$forceUpdate();
            },
            checkExist(option,index,filter){
                if(filter.hasOwnProperty('select_one') && String(filter.select_one) === "true"){
                    if(this.valueAdvace.hasOwnProperty('__advanced_'+index+'__') && this.valueAdvace['__advanced_'+index+'__'] == option){
                        this.valueAdvace['__advanced_'+index+'__'] = ""
                        this.listinput['__advanced_'+index+'__'] = []
                    }else{
                        this.valueAdvace['__advanced_'+index+'__'] = option
                        this.listinput['__advanced_'+index+'__'] = [].concat(option)
                    }
                    if(this.valueAdvace['__advanced_'+index+'__'] === ""){
                        delete this.valueAdvace['__advanced_'+index+'__'];
                    }
                    try {
                        $(event.target).val('')
                        $(event.target).parent().prev().val('')
                        this.inputsearch['__advanced_'+index+'__'] = ''
                    } catch (error) {}
                    this.$forceUpdate();
                    return;
                }
                if(!this.valueAdvace.hasOwnProperty('__advanced_'+index+'__')){
                    this.valueAdvace['__advanced_'+index+'__']=[]
                    this.listinput['__advanced_'+index+'__'] = []
                }
                if(this.valueAdvace.hasOwnProperty('__advanced_'+index+'__')){
                    const indexInArray = this.valueAdvace['__advanced_'+index+'__'].indexOf(option);
                    if(indexInArray>-1 && indexInArray!=undefined){
                        this.valueAdvace['__advanced_'+index+'__'].splice(indexInArray, 1);
                        this.listinput['__advanced_'+index+'__'].splice(indexInArray, 1);
                    }else{
                        this.valueAdvace['__advanced_'+index+'__'] = this.valueAdvace['__advanced_'+index+'__'].concat(option)
                        this.listinput['__advanced_'+index+'__'] = this.listinput['__advanced_'+index+'__'].concat(option)
                    }
                }
                if(this.valueAdvace['__advanced_'+index+'__'].length==0){
                    delete this.valueAdvace['__advanced_'+index+'__'];
                }
                try {
                    $(event.target).val('')
                    $(event.target).parent().prev().val('')
                    this.inputsearch['__advanced_'+index+'__'] = ''
                } catch (error) {}
                this.$forceUpdate();
            },
            checkExistQuick(option){
                let filter = this.body_area.filterConfig.quick
                if(filter.hasOwnProperty('select_one') && String(filter.select_one) === "true"){
                    if(this.valueQuick.hasOwnProperty('__quick__') && this.valueQuick['__quick__'].indexOf(option) > -1){
                        $(event.target).removeClass('active')
                        this.valueQuick['__quick__'] = ""
                    }else{
                        $(event.target).parent().children().removeClass('active')
                        $(event.target).addClass('active')
                        this.valueQuick['__quick__'] = option
                    }
                    if(this.valueQuick['__quick__'] === ""){
                        delete this.valueQuick['__quick__'];
                    }
                    setTimeout(() => {
                        this.page = 1;
                        this.list_items=[];
                        this.searchData(this.valuecheck)
                    }, 10);
                    return;
                }
                if(!this.valueQuick.hasOwnProperty('__quick__')){
                    this.valueQuick['__quick__']=[]
                }
                if(this.valueQuick.hasOwnProperty('__quick__')){
                    const indexInArray = this.valueQuick['__quick__'].indexOf(option);
                    if(indexInArray>-1 && indexInArray!=undefined){
                        $(event.target).removeClass('active')
                        this.valueQuick['__quick__'].splice(indexInArray, 1);
                    }else{
                        $(event.target).addClass('active')
                        this.valueQuick['__quick__'] = this.valueQuick['__quick__'].concat(option)
                    }
                }
                if(this.valueQuick['__quick__'].length==0){
                    delete this.valueQuick['__quick__'];
                }
                setTimeout(() => {
                    this.page = 1;
                    this.list_items=[];
                    this.searchData(this.valuecheck)
                }, 10);
                
                setTimeout(() => {
                    if (this.typeSelected == 'article' || this.typeSelected == 'gallery' || this.typeSelected == 'gallery2') {
                        this.switchType(this.typeSelected);    
                    }
                }, 100);

            },
            defaulSearch(){
                let itemJSONString = JSON.stringify(this.body_area.default_search);
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
                if(itemJSONString.indexOf('##')>-1){
                    itemJSONString = itemJSONString.replace(/##(.*?)##/g,"");
                }
                let dataSearch = JSON.parse(itemJSONString);  
                this.valuecheck = dataSearch.__input__;
                this.topSearches = dataSearch.__input__;
                setTimeout(() => {
                    this.$refs.searchView.value = dataSearch.__input__;
                    this.page = 1;
                    let delimiter = undefined;
                    for (let key in dataSearch) {
                        if(key.indexOf('advanced')>-1){
                            try {
                                if(!this.body_area.advanced.hasOwnProperty(key.match(/\d+/)[0])){
                                    continue;
                                }
                            } catch (error) {}
                            if(!dataSearch[key].hasOwnProperty('values')){
                                continue;
                            }else if(dataSearch[key].hasOwnProperty('values') && typeof(dataSearch[key].values) == 'string' && !dataSearch[key].hasOwnProperty('delimiter')){
                                continue;
                            }
                            if(dataSearch[key].hasOwnProperty('delimiter')){
                                delimiter = dataSearch[key].delimiter
                                this.valueAdvace[key] = dataSearch[key].values.split(delimiter)
                                this.listinput[key] = dataSearch[key].values.split(delimiter) 
                                try {
                                    if(this.body_area.advanced[key.match(/\d+/)[0]].hasOwnProperty('select_one') && String(this.body_area.advanced[key.match(/\d+/)[0]].select_one) === 'true'){
                                        let value_temp = dataSearch[key].values.split(delimiter)
                                        this.valueAdvace[key] = value_temp[value_temp.length - 1]
                                        this.listinput[key] = [value_temp[value_temp.length - 1]]
                                    } 
                                } catch (error) {}
                            }else{
                                this.valueAdvace[key] = dataSearch[key].values.slice()
                                this.listinput[key] = dataSearch[key].values.slice()
                                try {
                                    if(this.body_area.advanced[key.match(/\d+/)[0]].hasOwnProperty('select_one') && String(this.body_area.advanced[key.match(/\d+/)[0]].select_one) === 'true'){
                                        if(typeof(this.valueAdvace[key]) === 'object'){
                                            this.valueAdvace[key] = dataSearch[key].values[dataSearch[key].values.length - 1]
                                            this.listinput[key] = [dataSearch[key].values[dataSearch[key].values.length - 1]]
                                        }else{
                                            this.valueAdvace[key] = dataSearch[key].values.toString()
                                            this.listinput[key] = [dataSearch[key].values.toString()]
                                        }
                                    } 
                                } catch (error) {}
                            }
                        }else if(key.indexOf('__quick__')>-1){
                            if(!dataSearch[key].hasOwnProperty('values')){
                                continue;
                            }else if(dataSearch[key].hasOwnProperty('values') && typeof(dataSearch[key].values) == 'string' && !dataSearch[key].hasOwnProperty('delimiter')){
                                continue;
                            }
                            if(dataSearch[key].hasOwnProperty('delimiter')){
                                delimiter = dataSearch[key].delimiter
                                this.valueQuick[key] = dataSearch[key].values.split(delimiter)
                                try {
                                    if(this.body_area.filterConfig.quick.hasOwnProperty('select_one') && String(this.body_area.filterConfig.quick.select_one) === 'true'){
                                        let value_temp = dataSearch[key].values.split(delimiter)
                                        this.valueQuick[key] = value_temp[value_temp.length - 1]
                                    } 
                                } catch (error) {}
                            }else{
                                this.valueQuick[key] = dataSearch[key].values
                                try {
                                    if(this.body_area.filterConfig.quick.hasOwnProperty('select_one') && String(this.body_area.filterConfig.quick.select_one) === 'true'){
                                        if(typeof(this.valueQuick[key]) === 'object'){
                                            this.valueQuick[key] = dataSearch[key].values[dataSearch[key].values.length - 1]
                                        }else{
                                            this.valueQuick[key] = dataSearch[key].values.toString()
                                        }
                                    } 
                                } catch (error) {}
                            }
                        }
                    }
                    this.list_items=[];   
                    this.searchData(dataSearch.__input__)
                }, 10);
            },
            dynamicFilter(data,index){
                try {
                    let that = this;
                    let datastring = JSON.stringify(data);
                    for (var key in vm.flatRuntimeAttributes) {
                        if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                            datastring = datastring.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                            datastring = datastring.replace('"','\"');
                        }
                    }  
                    if(datastring.indexOf('##')>-1){
                        datastring = datastring.replace(/##(.*?)##/g,"");
                    }
                    data = JSON.parse(datastring)

                    if(data.hasOwnProperty('request')){
                        $.ajax({
                            url: data.url,
                            type: data.request.method != undefined ? data.request.method: 'GET',
                            data: (data.request.method != undefined && data.request.method.toLowerCase() == 'get') ? JSON.parse(data.request.body) : data.request.body ,
                            contentType: (data.request.method != undefined && data.request.method.toLowerCase() == 'post')? 'application/json' : false,
                            dataType: "json",
                            success: function (json) {
                                if(data.hasOwnProperty('jsonpath')){
                                    json=jsonPath(json,data.jsonpath)
                                }

                                if(json.length > 0){
                                    if(that.body_area.advanced[index].suggestion[0].indexOf('userinput____lite_connection')>-1){
                                        json.unshift('__userinput__')
                                        that.body_area.advanced[index].suggestion = json;
                                    }else{
                                        that.body_area.advanced[index].suggestion = json;
                                    }
                                }else{
                                    if(that.body_area.advanced[index].suggestion[0].indexOf('userinput____lite_connection')>-1){
                                        let jsontem = []
                                        jsontem.unshift('__userinput__')
                                        that.body_area.advanced[index].suggestion = jsontem;
                                    }else{
                                        that.body_area.advanced[index].suggestion = [];
                                    }
                                }
                            }, error: function (error) {
                                if(that.body_area.advanced[index].suggestion[0].indexOf('userinput____lite_connection')>-1){
                                    let jsontem = []
                                    jsontem.unshift('__userinput__')
                                    that.body_area.advanced[index].suggestion = jsontem;
                                }else{
                                    that.body_area.advanced[index].suggestion = [];
                                }
                            }
                        });
                    }else{
                        
                        $.ajax({
                            url: data.url,
                            type: 'GET',
                            dataType: "json",
                            success: function (json) {
                                if(data.hasOwnProperty('jsonpath')){
                                    json=jsonPath(json,data.jsonpath)
                                }
                                that.body_area.advanced[index].suggestion = json;
                            }, error: function (error) {
                            }
                        });
                    }
                   
                } catch (error) {
                    if(this.body_area.advanced[index].suggestion[0].indexOf('userinput____lite_connection')>-1){
                        let jsontem = []
                        jsontem.unshift('__userinput__')
                        this.body_area.advanced[index].suggestion = jsontem;
                    }else{
                        this.body_area.advanced[index].suggestion = [];
                    }
                }
            },
            dynamicFilterQuick(data){
                try {
                    let that = this;
                    let datastring = JSON.stringify(data);
                    for (var key in vm.flatRuntimeAttributes) {
                        if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                            datastring = datastring.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                            datastring = datastring.replace('"','\"');
                        }
                    }  
                    if(datastring.indexOf('##')>-1){
                        datastring = datastring.replace(/##(.*?)##/g,"");
                    }
                    data = JSON.parse(datastring)

                    if(data.hasOwnProperty('request')){
                        $.ajax({
                            url: data.url,
                            type: data.request.method != undefined ? data.request.method: 'GET',
                            data: (data.request.method != undefined && data.request.method.toLowerCase() == 'get') ? JSON.parse(data.request.body) : data.request.body ,
                            contentType: (data.request.method != undefined && data.request.method.toLowerCase() == 'post')? 'application/json' : false,
                            dataType: "json",
                            success: function (json) {
                                if(data.hasOwnProperty('jsonpath')){
                                    json=jsonPath(json,data.jsonpath)
                                }
                                
                                if(that.body_area.filterConfig.quick.entries[0].indexOf('userinput____lite_connection')>-1){
                                    json.unshift('__userinput__')
                                    that.body_area.filterConfig.quick.entries = json;
                                }else{
                                    that.body_area.filterConfig.quick.entries = json;
                                }
                                that.quickfilter = {...that.body_area.filterConfig.quick}
                            }, error: function (error) {
                                if(that.body_area.filterConfig.quick.entries[0].indexOf('userinput____lite_connection')>-1){
                                    let jsontem = []
                                    jsontem.unshift('__userinput__')
                                    that.body_area.filterConfig.quick.entries = jsontem;
                                }else{
                                    that.body_area.filterConfig.quick.entries = [];
                                }
                                that.quickfilter = {...that.body_area.filterConfig.quick}
                            }
                        });
                    }else{
                        
                        $.ajax({
                            url: data.url,
                            type: 'GET',
                            dataType: "json",
                            success: function (json) {
                                if(data.hasOwnProperty('jsonpath')){
                                    json=jsonPath(json,data.jsonpath)
                                }
                                that.body_area.filterConfig.quick.entries = json;
                                that.quickfilter = {...that.body_area.filterConfig.quick}
                            }, error: function (error) {
                            }
                        });
                    }
                   
                } catch (error) {
                    
                }
            },
            turnOnCamera(){
                if(!this.turnCameraQR){
                    this.html5QrcodeScanner.cameraStop();
                    this.turnCameraQR = true;
                    this.html5QrcodeScanner.cameraStart();
                }
            },
            actionFocus(){
                this.$refs.searchView.focus();
            },
            qrScanCode(value){
                this.$refs.searchView.value = value;
                this.valuecheck = value;
                this.page = 1;
                this.list_items=[];
                this.searchData(value)
                if(localStorage.getItem("currentSearch/"+this.screen.code)==null || 
                    localStorage.getItem("currentSearch/"+this.screen.code)){
                    
                    if(this.dataSave.length >= 20){
                        this.dataSave.pop()
                    }
                    this.dataSave = this.dataSave.filter((item) =>{
                        return item != value.trim()
                    })
                    this.dataSave.unshift(value.trim())
                    localStorage.setItem("currentSearch/"+this.screen.code,JSON.stringify(this.dataSave))
                    this.currentSearch = JSON.parse(localStorage.getItem("currentSearch/"+this.screen.code))
                }
            },
            applyFilter(type){
                if(type){
                    this.valueAdvace = [];
                    this.listinput = [];
                    $('#'+this.filterCode+' span').removeClass('active')
                }
                $('#'+this.filterCode).modal('hide');
                this.page = 1;
                this.list_items=[];
                this.scroll=false
                this.searchData(this.valuecheck)
            },
            addFilterAdvance(option,index,filter){
                if(filter.hasOwnProperty('select_one') && String(filter.select_one) === "true"){
                    if(this.valueAdvace.hasOwnProperty('__advanced_'+index+'__') && this.valueAdvace['__advanced_'+index+'__'].indexOf(option) > -1){
                        $(event.target).removeClass('active')
                        this.valueAdvace['__advanced_'+index+'__'] = ""
                    }else{
                        $(event.target).parent().children().removeClass('active')
                        $(event.target).addClass('active')
                        this.valueAdvace['__advanced_'+index+'__'] = option
                    }
                    if(this.valueAdvace['__advanced_'+index+'__'] === ""){
                        delete this.valueAdvace['__advanced_'+index+'__'];
                    }
                    return;
                }
                if(!this.valueAdvace.hasOwnProperty('__advanced_'+index+'__')){
                    this.valueAdvace['__advanced_'+index+'__']=[]
                }
                if(this.valueAdvace.hasOwnProperty('__advanced_'+index+'__')){
                    const indexInArray = this.valueAdvace['__advanced_'+index+'__'].indexOf(option);
                    if(indexInArray>-1 && indexInArray!=undefined){
                        $(event.target).removeClass('active')
                        this.valueAdvace['__advanced_'+index+'__'].splice(indexInArray, 1);
                    }else{
                        $(event.target).addClass('active')
                        this.valueAdvace['__advanced_'+index+'__'] = this.valueAdvace['__advanced_'+index+'__'].concat(option)
                    }
                }
                if(this.valueAdvace['__advanced_'+index+'__'].length==0){
                    delete this.valueAdvace['__advanced_'+index+'__'];
                }
            },
            remove(){
                this.listinput = []
                this.valuecheck="";
                this.value="";
                this.page = 1;
                this.list_items=[];
                this.$refs.searchView.value='';
                this.notfound="";
                this.valueAdvace = [];
                this.valueQuick = [];
            },
            searchDataV1:function(e){
                this.listJS = false;
                this.valuecheck = $(e.target).val();
                if(e.keyCode == 13){
                    if($(e.target).val() == this.value || 
                       $(e.target).val() && $(e.target).val().trim().length == 0 || 
                       $(e.target).val().trim().length < 3 )
                    {
                        if( $( '#currentSearch' + this.filterCode ).hasClass( "open" ) && ( $(e.target).val() == this.value) ) {
                            $( '#currentSearch' + this.filterCode ).removeClass( "open" )
                        }
                        return;
                    }
                    if(localStorage.getItem("currentSearch/"+this.screen.code)==null || 
                        localStorage.getItem("currentSearch/"+this.screen.code)){
                        this.dataSave = this.dataSave.filter((item) =>{
                            return item != $(e.target).val().trim()
                        })
                        if(this.dataSave.length >= 20){
                            this.dataSave.pop()
                        }
                        this.dataSave.unshift($(e.target).val().trim())
                        localStorage.setItem("currentSearch/"+this.screen.code,JSON.stringify(this.dataSave))
                        this.currentSearch = JSON.parse(localStorage.getItem("currentSearch/"+this.screen.code))
                    }

                    this.page = 1;
                    this.list_items=[];
                    this.searchData($(e.target).val())
                    if($( '#currentSearch' + this.filterCode ).hasClass( "open" )){
                        $( '#currentSearch' + this.filterCode ).removeClass( "open" )
                        this.showMore = false;
                        this.$refs.searchView.blur();
                    }

                } else if(JSON.parse(localStorage.getItem("currentSearch/"+this.screen.code))){
                    let temp = JSON.parse(localStorage.getItem("currentSearch/"+this.screen.code))
                    this.currentSearch = temp.filter((item) =>{
                        return item.indexOf($(e.target).val()) > -1
                    })
                }
                
                setTimeout(() => {
                    if (this.typeSelected == 'article' || this.typeSelected == 'gallery' || this.typeSelected == 'gallery2') {
                        this.switchType(this.typeSelected);        
                    }
                }, 100);
                
            },
            handleScrollListView(event){
                if(($(event.target).prop('scrollHeight')-($(event.target).scrollTop()+$(event.target).prop('clientHeight'))<=($(event.target).prop('scrollHeight')/3)) && this.scroll){
                    if(this.scrollOff){
                        this.ScrollListViewOffline()
                        return;
                    }
                    this.scroll=false
                    let to = 50*this.page;
                    this.page = this.page+1;
                    this.searchData(this.value,"?size=50&from="+to)
                }
            },
            searchData:function(valuesearch,scroll="?size=50"){
                setTimeout(() => {
                    $("#"+this.$parent.id_random).click()
                }, 10);
                valuesearch = valuesearch.toString();
                this.value = valuesearch;
                if(valuesearch.length<3) return;
                if(this.stateSearchRule){
                    let data_tem = [{
                        '__input__':valuesearch
                    }]
                    vm.configRule(data_tem,this.body_area.search_rules)
                    valuesearch = data_tem[0]['__input__'];
                }
                let that = this;
                if (typeof  this.object.query_params != 'undefined' && this.object.query_params != null) {
                    if(typeof  this.object.query_params.post_body != 'undefined' && this.object.query_params.post_body != null){
                        this.post_body = this.object.query_params.post_body;
                    }
                }
                if(this.task.hasOwnProperty('post') && this.task.post != null){
                    this.post_body = this.task.post;
                }
                let post_temp = this.post_body
                let binderSearch = {}
                binderSearch.__input__ = valuesearch
                if(this.searchAdvance){
                    let valueAdvace_temp = {...this.valueAdvace}
                    let valueQuick_temp = {...this.valueQuick}
                    if(this.stateSearchRule){
                        this.configRuleSV(valueAdvace_temp,this.body_area.search_rules)
                        this.configRuleSV(valueQuick_temp,this.body_area.search_rules)
                    }
                    binderSearch = $.extend({}, binderSearch, valueAdvace_temp,valueQuick_temp);
                    if(Object.keys(valueAdvace_temp).length>0){
                        Object.keys(valueAdvace_temp).map(key=>{  
                            let data_replace = key
                            if(valueAdvace_temp[key].length>0 && typeof(valueAdvace_temp[key]) === 'object'){
                                data_replace = JSON.stringify(valueAdvace_temp[key])
                            }else{
                                data_replace = valueAdvace_temp[key]
                            }
                            post_temp = post_temp.replace(key,data_replace)    
                        })
                    }
                    if(Object.keys(valueQuick_temp).length>0){
                        Object.keys(valueQuick_temp).map(key=>{
                            let data_replace = key
                            if(valueQuick_temp[key].length>0 && typeof(valueQuick_temp[key]) === 'object'){
                                data_replace = JSON.stringify(valueQuick_temp[key])
                            }else{
                                data_replace = valueQuick_temp[key]
                            }
                            post_temp = post_temp.replace(key,data_replace)     
                        })
                    }
                    post_temp = post_temp.replace(/\/\d\*(.*?)\*\d\//g,function(mat,cat){
                        if(/__advanced_\d*__/.test(cat)){
                            return "";
                        }else if(/__quick__/.test(cat)){
                            return "";
                        }else{
                            return mat;
                        }
                    })
                }    
                post_temp = post_temp.replace(/\/\*(.*?)\*\//g,"$1").replace(/__input__/g,valuesearch)
                post_temp = post_temp.replace(/\/\d\*(.*?)\*\d\//g,"$1")
                if(this.object.dm_type == "Elasticsearch" && post_temp != "" && typeof(post_temp) == 'string'){
                    try {
                        post_temp=JSON.parse(post_temp)
                    } catch (error) {
                        that.notfound = "<div style='text-align: center;' ><h1 style='font-weight: 600;color: #797575;'>"+(that.lang === 'en' ? 'No Results Found':'Không tìm thấy kết quả' )+"</h1><div style='color: #878181;'>"+(that.lang === 'en' ? 'Try a different search':'Thử tìm kiếm lại')+"</div></div>"
                        return;
                    }
                    
                }
                this.body_area_temp = JSON.parse(JSON.stringify(this.body_area))
                let string = JSON.stringify(this.body_area)
                if(string.indexOf('##__input__##')>-1 || string.indexOf('##__quick__##')>-1 || string.indexOf('##__advanced_')>-1){
                    this.binderValues(this.body_area_temp,binderSearch)
                }
                if(this.getStatus!= ""){
                    this.getStatus.abort();
                }
                let status_size = true
                if(that.object.data_path != undefined && that.object.data_path != null && that.object.data_path != ""){
                    status_size = false
                }
                let path_search
                let get = ""
                if(that.object.dm_type=="Custom"){ 
                    path_search = that.object.path_search
                    for (var key in vm.flatRuntimeAttributes) {
                        if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                            path_search = path_search.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].toString().replace(/[\r\n\t]+/g," "));
                            path_search = path_search.replace('"','\"');
                        }
                    }
                    for (var key in vm.current.parent) {
                        if (vm.current.parent.hasOwnProperty(key)) {
                            path_search = vm.current.parent[key] != null ? (path_search.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].toString().replace(/[\r\n\t]+/g," "))) : path_search;
                            path_search = path_search.replace('"','\"');
                        }
                    }
                    path_search = path_search.replace(/__input__/g,valuesearch)
                    get = this.object.query_params.get ? this.object.query_params.get : ""
                    get = this.task.get ? this.task.get : get
                }
                this.getStatus = $.ajax({
                    url:that.object.dm_host + (that.object.dm_type=="Custom" ? "/" + path_search  : "/" +that.object.dm_name + '/_search'+(status_size ? scroll : "")),
                    type: that.object.dm_type == "Custom" ? 'GET' : 'POST',
                    dataType:'json',
                    contentType: 'application/json',
                    headers: that.object.dm_type == "Custom" ? {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+vm.flatRuntimeAttributes['user.access_token']
                    }:false,
                    data: that.object.dm_type=="Custom" ? {
                        page: that.page,
                        perPage: 10,
                        ...get
                    } : JSON.stringify(post_temp),
                    success:function (data) {
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
                        that.$parent.$parent.list_data_object = data
                        if(data.length>50){
                            that.scrollOff = true;
                            that.searchOffline(data);
                            return;
                        }
                        if(data.length>0){
                            let status_scroll = true
                            if(data.length<50 && that.object.dm_type!=="Custom"){
                                status_scroll=false
                            }
                            if(that.object.hasOwnProperty('key_attribute') && (that.object.key_attribute != "" || that.object.key_attribute != null)){
                                let keyid = that.object.key_attribute;
                                data = data.filter((thing, index) => {
                                    const _thing = thing[keyid];
                                    return index === data.findIndex(obj => {
                                        return obj[keyid] === _thing;
                                    });
                                });
                            }
                            that.list_items = that.list_items.concat(data);
                            that.scroll=true
                            that.notfound=""
                            if(!status_scroll){
                                that.scroll=false
                            }
                        }else{
                            that.scroll=false
                            if(scroll==="?size=50"){
                                that.notfound = "<div style='text-align: center;' ><h1 style='font-weight: 600;color: #797575;'>"+(that.lang === 'en' ? 'No Results Found':'Không tìm thấy kết quả' )+"</h1><div style='color: #878181;'>"+(that.lang === 'en' ? 'Try a different search':'Thử tìm kiếm lại')+"</div></div>"
                            }
                        }
                    },
                    error(error){
                        that.scroll=false
                        if(scroll==="?size=50"){
                            that.notfound = "<div style='text-align: center;' ><h1 style='font-weight: 600;color: #797575;'>"+(that.lang === 'en' ? 'No Results Found':'Không tìm thấy kết quả' )+"</h1><div style='color: #878181;'>"+(that.lang === 'en' ? 'Try a different search':'Thử tìm kiếm lại')+"</div></div>"
                        }
                    }
                })
            },
            searchOffline(data){
                this.scroll = true;
                this.list_items_temp = data;
                this.list_items = data.slice(0,50)
            },
            ScrollListViewOffline(){
                this.page = this.page+1;
                this.list_items = this.list_items_temp.slice(0,50*this.page)
            },
            deleteItem(value){
                this.currentSearch = this.currentSearch.filter(function(item) {
                    return item !== value
                })
                this.dataSave = this.currentSearch
                localStorage.setItem("currentSearch/"+this.screen.code,JSON.stringify(this.dataSave))
                        
            },
            deleteAllItem(){
                localStorage.removeItem("currentSearch/"+this.screen.code)
                this.dataSave = []
                this.currentSearch = []
                this.topSearches = ''
            },
            seletedItem(value){
                this.listJS = false;
                // Ref at: searchDataV1:function(e)
                if(localStorage.getItem("currentSearch/"+this.screen.code)==null || localStorage.getItem("currentSearch/"+this.screen.code)) {
                    this.dataSave = this.dataSave.filter((item) =>{
                        return item != value.trim()
                    })
                    this.dataSave.unshift(value.trim())
                    localStorage.setItem("currentSearch/"+this.screen.code,JSON.stringify(this.dataSave))
                    this.currentSearch = JSON.parse(localStorage.getItem("currentSearch/"+this.screen.code))
                }
                
                this.page = 1;
                this.list_items=[];
                this.$refs.searchView.value='';
                this.notfound="";
                
                setTimeout(() =>{
                    this.valuecheck = value
                    this.searchData(value) 
                    this.$refs.searchView.value = value       
                    if($( '#currentSearch' + this.filterCode ).hasClass( "open" )){
                        $( '#currentSearch' + this.filterCode ).removeClass( "open" )
                        this.showMore = false;
                    }
                },10) 
                
                setTimeout(() => {
                    if (this.typeSelected == 'article' || this.typeSelected == 'gallery' || this.typeSelected == 'gallery2') {
                        this.switchType(this.typeSelected);    
                    }
                }, 100);
            },
            checkDropdownOpen(){
                setTimeout(() =>{
                    if(!$( '#currentSearch' + this.filterCode ).hasClass( "open" )){
                        $( '#currentSearch' + this.filterCode ).addClass( "open" )
                        this.showMore = true;
                    }
                },10) 
            },
            configRuleSV(data,rules){
                rules.map(rule=>{
                    if(data.hasOwnProperty(rule.key)){
                        if(typeof(data[rule.key]) === 'object'){
                            let array = []
                            data[rule.key].map(advance=>{
                                let advance_tem = [{
                                    [rule.key] : advance
                                }]
                                vm.configRule(advance_tem,rules)
                                array = array.concat(advance_tem[0][rule.key])
                            })
                            data[rule.key] = array
                        }else{
                            let array = []
                            let advance_tem = [{
                                [rule.key] : data[rule.key]
                            }]
                            vm.configRule(advance_tem,rules)
                            data[rule.key] = advance_tem[0][rule.key]
                        }
                    }
                })
            },
            binderValues(object, data) {
                for (var key in object) {
                    if (object.hasOwnProperty(key)) {
                        var value = object[key];
                        if (typeof value === "string") {
                            if(Object.keys(data).length>0){
                                Object.keys(data).map(key=>{
                                        let data_replace = key
                                        if(data[key].length>0 && typeof(data[key]) === 'object'){
                                            data_replace = JSON.stringify(data[key])
                                        }else{
                                            data_replace = data[key]
                                        }
                                        value = value.replace(new RegExp('##'+key+'##','g'),data_replace)
                                })
                            }
                            value = value.replace(/##__input__##|##__quick__##|##__advanced_\d+__##/g, "")
                            object[key] = value;
                        }
                        else if (typeof value === "object") {
                            this.binderValues(value, data);
                        }
                    }
                }
            },
        }
    })
