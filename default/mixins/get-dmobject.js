const getDmObject = {
    methods: {
        getDmObject: async function(){
            if(!this.statusGetDataBackground){
                this.statusGetDataBackground = true
                var data = ""
                for(let modulecode in this.modules){
                    let objects = this.getAllObjects(modulecode)
                    for (let object in objects) {
                        if((objects[object].hasOwnProperty('fetch_data_in_background') && objects[object].fetch_data_in_background == 1) || (objects[object].screens.length == 0)){
                            data = objects[object];
                            await this.getDataObject(data)
                        }
                    }
                }
                if(data != ""){
                
                }else{
                    this.renderHomeView = true;
                }
                this.statusGetDataBackground = false
            }
        },
        getDataObject(object_origin){
            if(!object_origin.hasOwnProperty('dm_host') || !object_origin.hasOwnProperty('dm_name') || !object_origin.hasOwnProperty('dm_type')) return
            return new Promise(function(resolve, reject) {
                try {
                    let object = JSON.parse(JSON.stringify(object_origin))
                    let flatRuntimeAttributes = JSON.parse(JSON.stringify(vm.flatRuntimeAttributes))
                    flatRuntimeAttributes['module.code'] = object['moduleCode']
                    flatRuntimeAttributes['module.component.code'] = object['componentCode']
                    flatRuntimeAttributes['module.object.code'] = object['code']
                    flatRuntimeAttributes['module.subModule.code'] = object['subModuleCode']
                    flatRuntimeAttributes['module.title'] = vm.modules[object['moduleCode']].title
                    flatRuntimeAttributes['module.title'] = vm.modules[object['moduleCode']].title

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

                    if(object.query_params != null && object.query_params.hasOwnProperty('where') &&  object.query_params.where != null){
                        var where = object.query_params.where;
                        if(where.indexOf("##") != -1){
                        for (var key in flatRuntimeAttributes) {
                                if (flatRuntimeAttributes.hasOwnProperty(key)) {
                                where = where.replace(new RegExp('##'+key+'##','g'),flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                                where = where.replace('"','\"');
                                }
                            }
                        }
                        if(where.indexOf('${getdata_dmobj')>-1){
                            where = vm.getDataDmobj(where)
                        }
                        if(where.indexOf('##source:dmobj')>-1){
                            where = vm.getSourceDmobj(where)
                        }    
                        object.query_params.where = where;
                    }
                    if(object.query_params != null && object.query_params.hasOwnProperty('get') &&  object.query_params.get != null){
                            var get = object.query_params.get;
                            if(get.indexOf("##") != -1){
                            for (var key in flatRuntimeAttributes) {
                                    if (flatRuntimeAttributes.hasOwnProperty(key)) {
                                    get = get.replace(new RegExp('##'+key+'##','g'),flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                                    get = get.replace('"','\"');
                                    }
                                }
                            }  
                            if(get.indexOf('${getdata_dmobj')>-1){
                                get = vm.getDataDmobj(get)
                            }
                            if(get.indexOf('##source:dmobj')>-1){
                                get = vm.getSourceDmobj(get)
                            }      
                            object.query_params.get = get;
                    }
                    if(object.query_params != null && object.query_params.hasOwnProperty('post_body') &&  object.query_params.post_body != null){
                            var post_body = object.query_params.post_body;
                            if(post_body.indexOf("##") != -1){
                            for (var key in flatRuntimeAttributes) {
                                    if (flatRuntimeAttributes.hasOwnProperty(key)) {
                                        post_body = post_body.replace(new RegExp('##'+key+'##','g'),flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                                        post_body = post_body.replace('"','\"');
                                    }
                                }
                            }  
                            if(post_body.indexOf('${getdata_dmobj')>-1){
                                post_body = vm.getDataDmobj(post_body)
                            }
                            if(post_body.indexOf('##source:dmobj')>-1){
                                post_body = vm.getSourceDmobj(post_body)
                            }      
                            object.query_params.post_body = post_body;
                    }
                    if (typeof  object.query_params != 'undefined' && object.query_params != null) {
                        if (typeof  object.query_params.where != 'undefined' && object.query_params.where != null) {
                            where = object.query_params.where;
                        }
                        if(typeof  object.query_params.get != 'undefined' && object.query_params.get != null){
                            get = object.query_params.get
                        }
                        if(typeof  object.query_params.post_body != 'undefined' && object.query_params.post_body != null){
                            elasticsearch = object.query_params.post_body;
                        }
                        if(typeof  object.query_params.where != 'undefined' && object.query_params.where != null){
                            whereChain = object.query_params.where;
                        }
                    }
                    if(object.dm_type == "Elasticsearch" && get != null && get !== "" && typeof(get) == 'string'){
                        get=JSON.parse(get);
                    }
                    if(object.dm_type == "Elasticsearch" && elasticsearch != "" && typeof(elasticsearch) == 'string'){
                        elasticsearch=JSON.parse(elasticsearch)
                    }
                    let order = "";
                    let api_normal
                    if(object.dm_type=="Custom"){ 
                        api_normal = object.path_normal
                        for (var key in flatRuntimeAttributes) {
                            if (flatRuntimeAttributes.hasOwnProperty(key)) {
                                api_normal = api_normal.replace(new RegExp('##'+key+'##','g'),flatRuntimeAttributes[key].toString().replace(/[\r\n\t]+/g," "));
                                api_normal = api_normal.replace('"','\"');
                            }
                        }
                        get = object.query_params.get ? object.query_params.get : ""
                    }
                    $.ajax({
                        url:object.dm_host + (object.dm_type=="V1" ? '/api/download/query' : object.dm_type=="V2" ? "/api/dm/getData" : object.dm_type=="Chained" ? '/api/dm/getChainedData' : object.dm_type=="Custom" ? "/" + api_normal : "/" +object.dm_name + '/_search'),
                        headers: object.dm_type == "Custom" ? {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer '+flatRuntimeAttributes['user.access_token']
                        }:false,
                        type: (object.dm_type == "Elasticsearch" &&  elasticsearch !="" ) ? 'POST' : 'GET',
                        dataType:'json',
                        contentType: (object.dm_type == "Elasticsearch" &&  elasticsearch != "" ) ? 'application/json' : false,
                        data: (object.dm_type=="V1" || object.dm_type=="V2") ? 
                        {
                            token:object.token,
                            dm_name:object.dm_name,
                            where:where,
                            download:0,
                            mode:'query',
                            format:'json',
                            order: order,
                            ...get
                        } : object.dm_type=="Chained" ?
                        {
                            chain_name:object.dm_name,
                            token:object.token,
                            type:'group',
                            begin_at:'root',
                            conditions:whereChain,
                            ...get
                        }: object.dm_type=="Custom" ? 
                        {
                            page: 1,
                            perPage: 99999,
                            ...get
                        } : (object.dm_type == "Elasticsearch" &&  elasticsearch !="" ) ? JSON.stringify(elasticsearch) : {...get},
                        success:function (json) {
                            if( (object.dm_type=="Elasticsearch" && !object.hasOwnProperty('data_path')) || (object.dm_type=="Elasticsearch" && object.hasOwnProperty('data_path') && (object.data_path=='' || object.data_path==null))){
                                let elasticsearch_data=JSON.parse(JSON.stringify(json));
                                json=jsonPath(elasticsearch_data,'hits.hits[*]._source')
                            }
                            if(object.dm_type=="Elasticsearch" && object.hasOwnProperty('data_path') && object.data_path!='' && object.data_path!=null){
                                let elasticsearch_data=JSON.parse(JSON.stringify(json));
                                json=jsonPath(elasticsearch_data.aggregations,object.data_path)
                            }
                            if(object.dm_type=="Custom"){
                                json=jsonPath(json,object.data_path)
                            }
                            if(object.hasOwnProperty('rule') && object.rule.length>0 && json.length>0 && typeof(object.rule)=='object' && w!=undefined){
                                w.postMessage([json,object.rule,flatRuntimeAttributes,vm.current.parent,vm.dmobj])
                                w.onmessage = function(e) {
                                    if(e.data[0]==="configrule"){
                                        json = e.data[1]
                                        if(json.length>0){
                                            w.postMessage(["saveToCache",json,object,vm.dmobj])
                                            w.onmessage = function(e) {
                                                if(e.data[0]==="saveToCache"){
                                                    vm.dmobj = e.data[1]
                                                    vm.saveToCache('dmobj',e.data[1])
                                                }
                                            };
                                        }
                                        vm.renderHomeView = true;
                                        resolve(true)
                                    }
                                };
                                return
                            }else if(object.hasOwnProperty('rule') && object.rule.length>0 && json.length>0 && typeof(object.rule)=='object'){
                                vm.configRule(json,object.rule,flatRuntimeAttributes)
                            }
                            let id
                            if(json.length>0 && w!=undefined){
                                w.postMessage(["saveToCache",json,object,vm.dmobj])
                                w.onmessage = function(e) {
                                    if(e.data[0]==="saveToCache"){
                                        vm.dmobj = e.data[1]
                                        vm.saveToCache('dmobj',e.data[1])
                                    }
                                    vm.renderHomeView = true;
                                    resolve(true)
                                };
                                return
                            }else if(json.length>0){
                                json.map(value=>{
                                    id = value[object.key_attribute]
                                    vm.dmobj[object.alias] = {...vm.dmobj[object.alias],...{[id] : value}}
                                })
                                vm.saveToCache('dmobj',vm.dmobj)
                            }
                            vm.renderHomeView = true;
                            resolve(true)
                        },
                        error:function(error){
                            vm.renderHomeView = true;
                            resolve(true)
                        }
                    })
                } catch (error) {
                    vm.renderHomeView = true;
                    resolve(true)
                }
            })
        },
    }
  }