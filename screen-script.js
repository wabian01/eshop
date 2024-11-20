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
                timeStart: (new Date).toISOString(),
                requestTimetamp:"",
                requestRemoveLocal:"",
                timeOutTimetamp:"",
                timeOutRemoveLocal:"",
                timeRemove:"",
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
                    this.cancelRequest()
                    this.statusRefresh = !this.statusRefresh;
                    this.refreshContent = true
                    this.running = false
                    this.updateObject()
                }
            }, 10);
        },
        deactivated(){
            this.cancelRequest()
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
            updateObject() {
                this.object_temp = JSON.parse(JSON.stringify(this.object));
                this.updateQueryParams();
                this.updateDmName();
                this.fetchData();
            },

            updateQueryParams() {
                const params = ['where', 'get', 'post_body'];
                params.forEach(param => {
                    if (this.object_temp?.query_params?.[param]) {
                        this.object_temp.query_params[param] = this.processParam(this.object_temp.query_params[param], param);
                    }
                });
            },

            processParam(value, paramType) {
                if (typeof value === 'object' && paramType === 'get') {
                    value = JSON.stringify(value);
                }
                value = this.replaceTemplateVariables(value);
                value = this.processDmobjReferences(value);
                if (paramType === 'get' && typeof value === 'string') {
                    try {
                        value = JSON.parse(value);
                    } catch (error) {}
                }
                return value;
            },

            replaceTemplateVariables(str) {
                if (typeof str !== 'string' || !str.includes('##')) return str;

                const sources = [vm.flatRuntimeAttributes, vm.current.parent, vm.paramPublicView];
                sources.forEach(source => {
                    if (!source) return;
                    Object.keys(source).forEach(key => {
                        const value = source[key];
                        if (value != null) {
                            const regex = new RegExp('##' + key + '##', 'g');
                            str = str.replace(regex, value.toString().replace(/[\r\n\t]+/g, " "));
                        }
                    });
                });

                return str;
            },

            processDmobjReferences(str) {
                if (typeof str !== 'string') return str;
                if (str.includes('${getdata_dmobj')) {
                    str = vm.getDataDmobj(str);
                }
                if (str.includes('##source:dmobj')) {
                    str = vm.getSourceDmobj(str);
                }
                return str;
            },

            updateDmName() {
                if (typeof this.object_temp.dm_name === 'string') {
                    this.object_temp.dm_name = this.replaceTemplateVariables(this.object_temp.dm_name);
                    this.object_temp.dm_name = this.processDmobjReferences(this.object_temp.dm_name);
                }
            },

            fetchData() {
                if (this.object.dm_host && this.object.dm_type !== 'JsonHolder' && this.object.dm_host !== 'localhost' && this.object.dm_host !== null && this.object.dm_host !== "") {
                    this.getDataOrigin();
                } else {
                    setTimeout(() => {
                        this.list_data_object = false;
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
                    if(that.object_temp.data_path){
                        data = jsonPath(data, that.object_temp.data_path);
                    }                 
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
                if(data == undefined){
                    data = { 0: [] }
                }
                this.list_data_object = data;
                this.checkDataRe = JSON.stringify(data);
                if (this.refreshContent && this.object_temp.refresh_rate > 0) {
                    this.timeoutId = setTimeout(() => {
                        this.running = false;
                        this.checkIfSupportsTimestamp();
                    }, this.object_temp.refresh_rate * 1000);
                }
            },
            checkIfSupportsTimestamp(){
                if(this.checkDataRe.includes('__system_update_timestamp__')){
                    this.getLastSyncTimestamp(this.list_data_object)
                    this.initializeQueryObject()
                    this.checkForRemovals()
                }else{
                    this.getDataOrigin();
                }
            },
            getLastSyncTimestamp(data){
                this.timeStart = data.reduce((max, item) => {
                    const timestamp = item['__system_update_timestamp__'];
                    return timestamp > max ? timestamp : max;
                }, "");
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
            handleQueryTime(time,queryTime){
                const timestampQuery = {
                    "query": {
                        "bool": {
                            "must": [{
                                "range": {
                                    "__system_update_timestamp__": {
                                        "gt": time
                                    }
                                }
                            }]
                        }
                    }
                };

                if (!queryTime.hasOwnProperty("query")) {
                    queryTime.query = timestampQuery.query;
                } else {
                    
                    if (!queryTime.query.hasOwnProperty("bool")) {
                        queryTime.query.bool = {};
                    }
                    
                    if (!queryTime.query.bool.hasOwnProperty("must")) {
                        queryTime.query.bool.must = [];
                    }
                
                    queryTime.query.bool.must.push(...timestampQuery.query.bool.must);
                }

                return queryTime
            },
            checkForRemovals() {
                let that = this
                let objectTem = structuredClone(this.object_temp)
                let timeCheckRemove

                if(this.timeRemove === ""){
                    timeCheckRemove = this.timeStart
                }else{
                    timeCheckRemove = this.timeRemove
                }

                if (!objectTem.removal_check_url) {
                    return;
                }
                
                let bodyPost = objectTem.removal_check_body ?? {}

                if(typeof bodyPost === "string"){
                    bodyPost = JSON.parse(bodyPost)
                }

                bodyPost = this.handleQueryTime(timeCheckRemove, bodyPost)

                const requestConfig = {
                    url: objectTem.removal_check_url,
                    type: 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify(bodyPost)
                };

                this.requestRemoveLocal = $.ajax({
                    ...requestConfig,
                    success: (data) => {
                        
                        if (!objectTem.removal_check_datapath || objectTem.removal_check_datapath === '') {
                            data = jsonPath(data, 'hits.hits[*]._source');
                        }else{
                            data  = jsonPath(data.aggregations, objectTem.removal_check_datapath);
                        } 
                        if(Object.keys(data).length>0 && Object.keys(that.list_data_object).length>0){
                            that.removeDuplicates(data)
                        }
                        if (that.refreshContent && that.object_temp.refresh_rate > 0) {
                            that.timeOutRemoveLocal = setTimeout(() => {
                                that.checkForRemovals();
                            }, that.object_temp.refresh_rate * 1000);
                        }
                    },
                    error: () => {}
                });
            },

            removeDuplicates(dataRemove) {
                let id = this.object_temp.key_attribute
                
                let oldData = structuredClone(this.list_data_object)

                const parsedIds = new Set(dataRemove.map(item => item[id]));
            
                const filteredData = oldData.filter(item => !parsedIds.has(item[id]));

                if (filteredData.length < oldData.length){
                    this.list_data_object = filteredData;
                    this.statusRefresh = !this.statusRefresh;
                }
            },

            updateDataWithNewTimestamps(newData, oldData) {

                let id = this.object_temp.key_attribute

                const oldDataMap = oldData.reduce((map, obj) => {
                    const key = obj[id];
                    map[key] = obj;
                    return map;
                }, {});
                
                newData.forEach(newObj => {

                    const key = newObj[id];
                    const oldObj = oldDataMap[key];

                    if (oldObj && new Date(newObj.__system_update_timestamp__) > new Date(oldObj.__system_update_timestamp__)) {
                        Object.assign(oldObj, newObj);
                    } else if (!oldObj) {
                        oldData.push(newObj);
                    }
                });
                return oldData;
            },

            buildQueryParameters() {
                let queryGet = null;
                let queryElasticsearch = "";

                if (this.object_temp.query_params) {
                    const { get, post_body } = this.object_temp.query_params;
                    queryGet = get || null;
                    queryElasticsearch = post_body || "";
                }

                if (this.task.get) {
                    queryGet = queryGet ? Object.assign(queryGet, this.task.get) : this.task.get;
                }

                if (this.task.post) {
                    queryElasticsearch = this.task.post;
                }

                return { queryGet, queryElasticsearch };
            },

            buildMergedQuery(queryGet, queryElasticsearch) {
                let mergedQuery = {};

                if (queryGet && typeof queryGet === 'string') {
                    mergedQuery = JSON.parse(queryGet);
                }

                const cleanElasticsearch = queryElasticsearch.replace(/\/\*(.*?)\*\//g, "").replace(/\/\d\*(.*?)\*\d\//g, "");
                if (cleanElasticsearch && typeof cleanElasticsearch === 'string') {
                    mergedQuery = JSON.parse(cleanElasticsearch);
                }

                mergedQuery = this.handleQueryTime(this.timeStart, mergedQuery)

                return mergedQuery;
            },

            processQueryResponse(data) {
                if (!this.object_temp.data_path || this.object_temp.data_path === '') {
                    return jsonPath(data, 'hits.hits[*]._source');
                }
                return jsonPath(data.aggregations, this.object_temp.data_path);
            },

            scheduleNextUpdate() {
                if (this.refreshContent && this.object_temp.refresh_rate > 0) {
                    this.timeOutTimetamp = setTimeout(() => {
                        this.running = false;
                        this.initializeQueryObject();
                    }, this.object_temp.refresh_rate * 1000);
                }
            },

            initializeQueryObject() {
                if (this.running) return;
                this.running = true;
                const { queryGet, queryElasticsearch } = this.buildQueryParameters();
                const mergedQuery = this.buildMergedQuery(queryGet, queryElasticsearch);
                const objectTemp = this.object_temp;

                const requestConfig = {
                    url: `${objectTemp.dm_host}/${objectTemp.dm_name}/_search`,
                    type: (objectTemp.dm_type === "Elasticsearch" && queryElasticsearch !== "") ? 'POST' : 'GET',
                    dataType: 'json',
                    contentType: (objectTemp.dm_type === "Elasticsearch" && queryElasticsearch !== "") ? 'application/json' : false,
                    data: (objectTemp.dm_type === "Elasticsearch" && queryElasticsearch !== "") ? JSON.stringify(mergedQuery) : { ...mergedQuery }
                };

                this.requestTimetamp = $.ajax({
                    ...requestConfig,
                    success: (data) => {
                        const newData = this.processQueryResponse(data);
                        
                        if (Array.isArray(newData) && Array.isArray(this.list_data_object)) {
                            this.handleNewData(newData);
                        }
                        
                        this.scheduleNextUpdate();
                    },
                    error: () => {}
                });
            },
            handleNewData(newData){
                this.getLastSyncTimestamp(newData)
                if(this.object_temp.rule && this.object_temp.rule.length > 0 && typeof this.object_temp.rule === 'object'){
                    vm.configRule(newData,this.object_temp.rule)
                }
                this.list_data_object = this.updateDataWithNewTimestamps(newData, this.list_data_object);
                this.statusRefresh = !this.statusRefresh
            },
            cancelRequest(){
                try {
                    this.request.abort()
                    clearTimeout(this.timeoutId);
                    this.requestTimetamp.abort()
                    clearTimeout(this.timeOutTimetamp);
                    this.requestRemoveLocal.abort()
                    clearTimeout(this.timeOutRemoveLocal);
                } catch (error) {}
            }
        },
    });
