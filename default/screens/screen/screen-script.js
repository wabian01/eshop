    Vue.component('screen', {
        template: '#screen',
        props: ['screen', 'object', 'task','showtab','skip_object','checkcompo','refresh_rate','newwebapp'],
        mixins: [addBgColor],
        data: function () {
            return {
                classNameLoad: 'lds-ellipsis '+this.screen.code,
                scroll_to_end: false,
                bottom_area: this.screen.hasOwnProperty('bottom_area') ? this.screen.bottom_area : [],
                refreshContent:true,
                time_reload:"",
                checkDataRe:"",
                statusRefresh:true,
                object_temp:'',
                bgColor:"",
                running:false,
                list_data_object:"waiting_loading",
                request:"",
                timeoutId:"",
                current_save:"",
                flatRuntimeAttributes_save:"",
                statusBottom:false,
                styleFloat:{
                    position: this.task.code === 9999 && !this.showtab ? 'absolute' : 'fixed',
                    bottom: `10px`,
                    right: '4%',
                    zIndex: 3
                },
            }
        },
        mounted() {
            if(this.bottom_area.length>0){
                this.setupResizeObserver();
            }
        },
        created: function () {
            if(vm.paramPublicView!=undefined){
                if(!vm.current.hasOwnProperty('parent')){
                    vm.current['parent'] = {}
                }
                for(var key in vm.paramPublicView){
                    if(vm.paramPublicView[key] == null){
                        vm.paramPublicView[key] = ""
                    }
                    vm.current['parent']['current.args.'+key] = vm.paramPublicView[key]
                }
            }
            if(Object.keys(profile).length>0){
                if(!vm.current.hasOwnProperty('parent')){
                    vm.current['parent'] = {}
                }
                for(var key in profile){
                    if(profile[key] == null){
                        profile[key] = ""
                    }
                    vm.current['parent']['jwt.'+key] = profile[key]
                }
            }
            $("#root").empty();
            let body_area_bg = JSON.parse(JSON.stringify(this.screen));

            this.addBgColor(" !important;",body_area_bg)

            this.object_temp = JSON.parse(JSON.stringify(this.object));
                    vm.flatRuntimeAttributes['module.code'] = this.object_temp['moduleCode']
                    vm.flatRuntimeAttributes['module.component.code'] = this.object_temp['componentCode']
                    vm.flatRuntimeAttributes['module.object.code'] = this.object_temp['code']
                    vm.flatRuntimeAttributes['module.subModule.code'] = this.object_temp['subModuleCode']
                    vm.flatRuntimeAttributes['module.title'] = vm.modules[this.object_temp['moduleCode']].title
                    vm.flatRuntimeAttributes['module.subModule.title'] = vm.modules[this.object_temp['moduleCode']].subModules[this.object_temp['subModuleCode']].title                   

            if ((this.object_temp.root_screen.indexOf(this.screen.code) > -1 && vm.activeScreenCode == '') || vm.activeScreenCode.indexOf(this.screen.code) > -1) {
                this.task.title = this.screen.title;
            }   
            this.updateObject()

            this.current_save = {...vm.current}
            this.flatRuntimeAttributes_save = {...vm.flatRuntimeAttributes}
        },
        beforeDestroy: function(){
            this.refreshContent=false;
        },
        watch: {
            checkDataRe(newvalue,oldvalue){
              if(oldvalue==""){
                return;
              }
              this.statusRefresh = !this.statusRefresh;
            },
            refresh_rate:  function(value){
                if(this.task.code===vm.activeTaskCode && this.task.code!=9999){
                    vm.flatRuntimeAttributes = {...this.flatRuntimeAttributes_save}
                    vm.current = {...this.current_save}
                }
            },
        },
        activated(){
            setTimeout(() => {
                if(!this.refreshContent){
                    this.statusRefresh = !this.statusRefresh;
                    this.refreshContent = true
                    this.updateObject()
                }
            }, 10);
        },
        deactivated(){
            clearTimeout(this.timeoutId);
            this.refreshContent=false;
        },
        methods: {
            setupResizeObserver() {
                let that = this
                this.resizeObserver = new ResizeObserver(entries => {
                    for (let entry of entries) {
                        if (entry.target === this.$refs.bottomArea) {
                            that.floatingButtonStyle(entry.contentRect.height + 10)
                        }
                    }
                });
                this.resizeObserver.observe(this.$refs.bottomArea);
            },
            floatingButtonStyle(bottomPosition) {
                this.styleFloat = {
                    position: this.task.code === 9999 && !this.showtab ? 'absolute' : 'fixed',
                    bottom: `${bottomPosition}px`,
                    right: '4%',
                    zIndex: 3
                };
            },
            scrollContentBottom(e){
                e.preventDefault();
                if(e.deltaY<0){
                    if($(e.target).css('max-height') == '50%'){
                        this.statusBottom=!this.statusBottom
                    }else{
                        $(e.target).css('max-height','50%')
                    }
                }else{
                    $(e.target).css('max-height','100%')
                }
            },
            updateObject(){
                this.object_temp = JSON.parse(JSON.stringify(this.object)); 
                if(this.object_temp.query_params != null && this.object_temp.query_params.hasOwnProperty('where') &&  this.object_temp.query_params.where != null){
                        var where = this.object_temp.query_params.where;
                        if(where.indexOf("##") != -1){
                            for (var key in vm.flatRuntimeAttributes) {
                                    if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                                    where = where.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                                    where = where.replace('"','\"');
                                    }
                            }
                            for (var key in vm.current.parent) {
                                if (vm.current.parent.hasOwnProperty(key)) {
                                    where = vm.current.parent[key] != null ? (where.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].toString().replace(/[\r\n\t]+/g," "))) : where;
                                    where = where.replace('"','\"');
                                }
                            }
                            if(vm.paramPublicView!=undefined){
                                for (var key in vm.paramPublicView) {
                                    if (vm.paramPublicView.hasOwnProperty(key)) {
                                        where = vm.paramPublicView[key] != null ? (where.replace(new RegExp('##'+key+'##','g'),vm.paramPublicView[key].toString().replace(/[\r\n\t]+/g," "))) : where;
                                        where = where.replace('"','\"');
                                    }
                                }
                            }
                        }        
                        if(where.indexOf('${getdata_dmobj')>-1){
                            where = vm.getDataDmobj(where)
                        }
                        if(where.indexOf('##source:dmobj')>-1){
                            where = vm.getSourceDmobj(where)
                        }
                        this.object_temp.query_params.where = where;
                }
                if(this.object_temp.query_params != null && this.object_temp.query_params.hasOwnProperty('get') &&  this.object_temp.query_params.get != null){
                        var get = this.object_temp.query_params.get;
                        let parse = false
                        try {
                            if(get && typeof(get) === 'object'){
                                parse = true
                                get = JSON.stringify(get)
                            }
                        } catch (error) {}
                        if(get.indexOf("##") != -1){
                            for (var key in vm.flatRuntimeAttributes) {
                                    if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                                    get = get.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                                    get = get.replace('"','\"');
                                    }
                            }
                            for (var key in vm.current.parent) {
                                if (vm.current.parent.hasOwnProperty(key)) {
                                    get = vm.current.parent[key] != null ? (get.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].toString().replace(/[\r\n\t]+/g," "))) : get;
                                    get = get.replace('"','\"');
                                }
                            }
                            if(vm.paramPublicView!=undefined){
                                for (var key in vm.paramPublicView) {
                                    if (vm.paramPublicView.hasOwnProperty(key)) {
                                        get = vm.paramPublicView[key] != null ? (get.replace(new RegExp('##'+key+'##','g'),vm.paramPublicView[key].toString().replace(/[\r\n\t]+/g," "))) : get;
                                        get = get.replace('"','\"');
                                    }
                                }
                            }
                        }   
                        if(get.indexOf('${getdata_dmobj')>-1){
                            get = vm.getDataDmobj(get)
                        }
                        if(get.indexOf('##source:dmobj')>-1){
                            get = vm.getSourceDmobj(get)
                        }     
                        if(parse){
                            try {
                                get = JSON.parse(get)
                            } catch (error) {}
                        }
                        this.object_temp.query_params.get = get;
                }
                if(this.object_temp.query_params != null && this.object_temp.query_params.hasOwnProperty('post_body') &&  this.object_temp.query_params.post_body != null){
                        var post_body = this.object_temp.query_params.post_body;
                        if(post_body.indexOf("##") != -1){
                            for (var key in vm.flatRuntimeAttributes) {
                                    if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                                    post_body = post_body.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                                    post_body = post_body.replace('"','\"');
                                    }
                            }
                            for (var key in vm.current.parent) {
                                if (vm.current.parent.hasOwnProperty(key)) {
                                    post_body = vm.current.parent[key] != null ? (post_body.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].toString().replace(/[\r\n\t]+/g," "))) : post_body;
                                    post_body = post_body.replace('"','\"');
                                }
                            }
                            if(vm.paramPublicView!=undefined){
                                for (var key in vm.paramPublicView) {
                                    if (vm.paramPublicView.hasOwnProperty(key)) {
                                        post_body = vm.paramPublicView[key] != null ? (post_body.replace(new RegExp('##'+key+'##','g'),vm.paramPublicView[key].toString().replace(/[\r\n\t]+/g," "))) : post_body;
                                        post_body = post_body.replace('"','\"');
                                    }
                                }
                            }
                        }     
                        if(post_body.indexOf('${getdata_dmobj')>-1){
                            post_body = vm.getDataDmobj(post_body)
                        }
                        if(post_body.indexOf('##source:dmobj')>-1){
                            post_body = vm.getSourceDmobj(post_body)
                        }   
                        this.object_temp.query_params.post_body = post_body;
                }
                if(typeof(this.object_temp.dm_name) === 'string' && this.object_temp.dm_name.indexOf('##')>-1){
                    for (var key in vm.flatRuntimeAttributes) {
                        if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                            this.object_temp.dm_name = this.object_temp.dm_name.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                            this.object_temp.dm_name = this.object_temp.dm_name.replace('"','\"');
                        }
                    }
                    for (var key in vm.current.parent) {
                        if (vm.current.parent.hasOwnProperty(key)) {
                            this.object_temp.dm_name = vm.current.parent[key] != null ? (this.object_temp.dm_name.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].toString().replace(/[\r\n\t]+/g," "))) : this.object_temp.dm_name;
                            this.object_temp.dm_name = this.object_temp.dm_name.replace('"','\"');
                        }
                    }
                }
                if(typeof(this.object_temp.dm_name) === 'string' && this.object_temp.dm_name.indexOf('${getdata_dmobj')>-1){
                        this.object_temp.dm_name = vm.getDataDmobj(this.object_temp.dm_name)
                }
                if(typeof(this.object_temp.dm_name) === 'string' && this.object_temp.dm_name.indexOf('##source:dmobj')>-1){
                        this.object_temp.dm_name = vm.getSourceDmobj(this.object_temp.dm_name)
                }   
                if(this.object.dm_type != 'JsonHolder' && this.object.dm_host !== 'localhost' && this.object.dm_host !== null && this.object.dm_host !== ""){
                    this.getDataOrigin()   
                }else{
                    setTimeout(() => {
                        this.list_data_object = false
                    }, 1);
                }  
            },
            getDataOrigin(){
                if (this.running) return;
                this.running = true;

                const that = this;
                let queryWhere = "true";
                let queryGet = null;
                let queryElasticsearch = "";
                let queryWhereChain = "true";

                if (this.object_temp.query_params) {
                    const { where, get, post_body } = this.object_temp.query_params;
                    
                    if (where) {
                        queryWhere = queryWhere === "true" ? where : ` AND ${where}`;
                        queryWhereChain = where;
                    }
                    
                    if (get) queryGet = get;
                    if (post_body) queryElasticsearch = post_body;
                }

                if (this.task.where) {
                    queryWhereChain = queryWhereChain !== "true" ? `(${queryWhereChain}) AND ${this.task.where}` : this.task.where;
                    queryWhere = queryWhere !== "true" ? `(${queryWhere}) AND ${this.task.where}` : this.task.where;
                }

                if (this.task.get) {
                    queryGet = queryGet ? Object.assign(queryGet, this.task.get) : this.task.get;
                }

                if (this.task.post) {
                    queryElasticsearch = this.task.post;
                }

                if (this.object_temp.dm_type === "Elasticsearch") {
                    if (queryGet && typeof queryGet === 'string') {
                        queryGet = JSON.parse(queryGet);
                    }
                    queryElasticsearch = queryElasticsearch.replace(/\/\*(.*?)\*\//g, "").replace(/\/\d\*(.*?)\*\d\//g, "");
                    if (queryElasticsearch && typeof queryElasticsearch === 'string') {
                        queryElasticsearch = JSON.parse(queryElasticsearch);
                    }
                }

                let apiNormal = "";
                if (this.object_temp.dm_type === "Custom") {
                    if (this.object_temp.hasOwnProperty('path_normal') && this.object_temp.path_normal) {
                        apiNormal = that.object_temp.path_normal
                        for (var key in vm.flatRuntimeAttributes) {
                            if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                                apiNormal = apiNormal.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].toString().replace(/[\r\n\t]+/g," "));
                                apiNormal = apiNormal.replace('"','\"');
                            }
                        }
                        for (var key in vm.current.parent) {
                            if (vm.current.parent.hasOwnProperty(key)) {
                                apiNormal = vm.current.parent[key] != null ? (apiNormal.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].toString().replace(/[\r\n\t]+/g," "))) : apiNormal;
                                apiNormal = apiNormal.replace('"','\"');
                            }
                        }
                    }
                    queryGet = this.object_temp.query_params.get ? this.object_temp.query_params.get : ""
                    queryGet = this.task.get ? this.task.get : queryGet
                    if (queryGet !== "" && typeof queryGet === 'string') {
                        try {
                            queryGet = JSON.parse(queryGet);
                        } catch (e) {}
                    }
                }

                const requestUrl = this.buildRequestUrl(that.object_temp, apiNormal);
                const requestHeaders = this.buildRequestHeaders(that.object_temp);
                const requestData = this.buildRequestData(that.object_temp, queryWhere, queryWhereChain, queryGet, queryElasticsearch);

                this.request = $.ajax({
                    url: requestUrl,
                    headers: requestHeaders,
                    type: (that.object_temp.dm_type === "Elasticsearch" && queryElasticsearch !== "") ? 'POST' : 'GET',
                    dataType: 'json',
                    contentType: (that.object_temp.dm_type === "Elasticsearch" && queryElasticsearch !== "") ? 'application/json' : false,
                    data: requestData,
                    success: function(data) {
                        that.running = false;
                        that.processSuccessResponse(data);
                    },
                    error: function(error) {
                        that.running = false;
                        that.processErrorResponse();
                    }
                });
            },
            buildRequestUrl(objectTemp, apiNormal) {
                const baseUrl = objectTemp.dm_host;
                switch (objectTemp.dm_type) {
                    case "V1": return `${baseUrl}/api/download/query`;
                    case "V2": return `${baseUrl}/api/dm/getData`;
                    case "Chained": return `${baseUrl}/api/dm/getChainedData`;
                    case "Custom": return `${baseUrl}/${apiNormal}`;
                    default: return `${baseUrl}/${objectTemp.dm_name}/_search`;
                }
            },
            buildRequestHeaders(objectTemp) {
                return objectTemp.dm_type === "Custom" ? {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${vm.flatRuntimeAttributes['user.access_token']}`
                } : false;
            },
            buildRequestData(objectTemp, where, whereChain, get, elasticsearch) {
                switch (objectTemp.dm_type) {
                    case "V1":
                    case "V2":
                        return {
                            token: objectTemp.token,
                            dm_name: objectTemp.dm_name,
                            where: where,
                            download: 0,
                            mode: 'query',
                            format: 'json',
                            order: "",
                            ...get
                        };
                    case "Chained":
                        return {
                            chain_name: objectTemp.dm_name,
                            token: objectTemp.token,
                            type: 'group',
                            begin_at: 'root',
                            conditions: whereChain,
                            ...get
                        };
                    case "Custom":
                        return {
                            page: 1,
                            perPage: 99999,
                            ...get
                        };
                    default:
                        return (objectTemp.dm_type === "Elasticsearch" && elasticsearch !== "") ? JSON.stringify(elasticsearch) : { ...get };
                }
            },
            processSuccessResponse(data) {
                const that = this;
                if (that.object_temp.dm_type === "Chained") {
                    data = data.reverse().filter((thing, index, self) =>
                        index === self.findIndex((t) => JSON.stringify(t) === JSON.stringify(thing))
                    );
                }
                if (that.object_temp.dm_type === "Elasticsearch") {
                    data = this.processElasticsearchData(data);
                }
                if (that.object_temp.dm_type === "Custom") {
                    data = jsonPath(data, that.object_temp.data_path);
                }
                if (that.object_temp.rule && that.object_temp.rule.length > 0 && data.length > 0 && typeof that.object_temp.rule === 'object' && typeof w !== 'undefined') {
                    return new Promise(resolve => {
                        const worker = new Worker(workerURL);
                        worker.postMessage([data, that.object_temp.rule, vm.flatRuntimeAttributes, vm.current.parent, vm.dmobj, vm.lang]);
                        worker.onmessage = (e) => {
                            if (e.data[0] === "configrule") {
                                that.updateDataAndScheduleRefresh(e.data[1]);
                                worker.terminate();
                                URL.revokeObjectURL(worker.scriptURL);
                                resolve();
                            }
                        };
                    });
                } else {
                    that.updateDataAndScheduleRefresh(data);
                }
            },
            processElasticsearchData(data) {
                const elasticsearchData = JSON.parse(JSON.stringify(data));
                if (!this.object_temp.data_path || this.object_temp.data_path === '') {
                    return jsonPath(elasticsearchData, 'hits.hits[*]._source');
                } else {
                    return jsonPath(elasticsearchData.aggregations, this.object_temp.data_path);
                }
            },
            updateDataAndScheduleRefresh(data) {
                this.list_data_object = data;
                this.checkDataRe = JSON.stringify(data);
                if (this.refreshContent && this.object_temp.refresh_rate > 0) {
                    this.timeoutId = setTimeout(() => {
                        this.running = false;
                        this.getDataOrigin();
                    }, this.object_temp.refresh_rate * 1000);
                }
            },
            processErrorResponse() {
                const emptyData = { 0: [] };
                this.list_data_object = emptyData;
                this.checkDataRe = JSON.stringify(emptyData);
                if (this.refreshContent && this.object_temp.refresh_rate > 0) {
                    this.timeoutId = setTimeout(() => {
                        this.running = false;
                        this.getDataOrigin();
                    }, this.object_temp.refresh_rate * 1000);
                }
            },

        },

    });