Vue.component('floating_button', {
    template: '#floating_button',
    props: ['object','screen','task','json_holder','refresh_rate'],
    created: function () {
        var that = this
        if(this.object.dm_type == 'JsonHolder'){
            setTimeout(() => {
                this.loadCacheJsonHolder()
                .then((value)=>{
                    let jsonholder = typeof(value) == 'string' ? JSON.parse(value) : value
                    if(jsonholder != null){
                        vm.jsonHolder = typeof(value) == 'string' ? value : JSON.stringify(value)
                        that.handleChangeData()
                    }
                })
            }, 100);
            return
        }
        this.handleReplace()
    },
    data: function () {
        return {
            'list_items':[]
        }
    },
    watch: {
        json_holder(json_holder){
            let temp = typeof(json_holder) == 'string' ? JSON.parse(json_holder) : json_holder
            if(temp.hasOwnProperty(this.object.dm_name)){
                this.handleChangeData()
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
                            that.handleChangeData()
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
        handleChangeData(){
            try {
                let AB = JSON.stringify(this.screen.floating_buttons.actions)
                for (var key in vm.flatRuntimeAttributes) {
                    if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                        AB = AB.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                        AB = AB.replace('"','\"');
                    }
                }  
                for (var key in vm.current.parent) {
                    if (vm.current.parent.hasOwnProperty(key)) {
                        AB = vm.current.parent[key] != null ? (AB.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].toString().replace(/[\r\n\t]+/g," "))) : AB;
                        AB = AB.replace('"','\"');
                    }
                }
                AB = vm.jsonHolderData(AB,'buttonGroup')
                if(AB.indexOf('##')>-1){
                    AB = AB.replace(/##(.*?)##/g,"");
                }
                this.list_items = JSON.parse(AB);
            } catch (error) {}
        },
        handleReplace:function(){
            var floating_buttons_replace = JSON.stringify(JSON.parse(JSON.stringify(this.screen.floating_buttons.actions)))
            var that = this;
            var order = "";
            var where = 'true';
            var get=null;
            var elasticsearch="";
            if (typeof  this.object.query_params != 'undefined' && this.object.query_params != null) {
                if (typeof  this.object.query_params.where != 'undefined' && this.object.query_params.where != null) {
                    where = this.object.query_params.where;
                }
                if(typeof  this.object.query_params.get != 'undefined' && this.object.query_params.get != null){
                     get = this.object.query_params.get
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
            if(this.screen.body_area.hasOwnProperty('filterConfig') && Object.keys(this.screen.body_area.filterConfig).length > 0){
                if(this.screen.body_area.filterConfig.hasOwnProperty('sortCol')!=true){
                    this.screen.body_area.filterConfig['sortCol'] = this.object.key_attribute;
                }
                if(this.screen.body_area.filterConfig.hasOwnProperty('order')!=true){
                    this.screen.body_area.filterConfig['order'] = 'ASC';
                }
                order = "`"+this.screen.body_area.filterConfig['sortCol']+"` "+this.screen.body_area.filterConfig['order']+"";
            }
            else if(this.screen.body_area.hasOwnProperty('sort')){
                order = "`"+this.screen.body_area.sort.column+"` "+this.screen.body_area.sort.order+"";
            }
            else{
                order = "`"+this.object.key_attribute+"` ASC";
            }
            $.ajax({
                url:that.object.dm_host + (that.object.dm_type=="V1" ? '/api/download/query' : that.object.dm_type=="V2" ? "/api/dm/getData" : that.object.dm_type=="Chained" ? '/api/dm/getChainedData' :  "/" +that.object.dm_name + '/_search'),
                type: (that.object.dm_type == "Elasticsearch" &&  elasticsearch !="" ) ? 'POST' : 'GET',
                dataType:'json',
                contentType: (that.object.dm_type == "Elasticsearch" &&  elasticsearch != "" ) ? 'application/json' : false,
                data: (that.object.dm_type=="V1" || that.object.dm_type=="V2") ? 
                {
                    token:that.object.token,
                    dm_name:that.object.dm_name,
                    limit:that.limit,
                    offset:that.limit*(that.page-1),
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
                } : (that.object.dm_type == "Elasticsearch" &&  elasticsearch !="" ) ? JSON.stringify(elasticsearch) : {...get},
                success: function(data){   
                    if( (that.object.dm_type=="Elasticsearch" && !that.object.hasOwnProperty('data_path')) || (that.object.dm_type=="Elasticsearch" && that.object.hasOwnProperty('data_path') && (that.object.data_path=='' || that.object.data_path==null))){
                        let elasticsearch_data=JSON.parse(JSON.stringify(data));
                        data=jsonPath(elasticsearch_data,'hits.hits[*]._source')
                    }
                    if(that.object.dm_type=="Elasticsearch" && that.object.hasOwnProperty('data_path') && that.object.data_path!='' && that.object.data_path!=null){
                        let elasticsearch_data=JSON.parse(JSON.stringify(data));
                        data=jsonPath(elasticsearch_data.aggregations,that.object.data_path)
                    }    
                    for(var key in data[0]){
                        if(data[0].hasOwnProperty(key) && data[0][key] != null){
                            floating_buttons_replace = floating_buttons_replace.toString().replace(new RegExp('\'##'+key+'##\'','g'),"'"+(data[0][key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                            floating_buttons_replace = floating_buttons_replace.toString().replace(new RegExp('##'+key+'##','g'),"'"+(data[0][key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                        }
                    }
                    floating_buttons_replace = floating_buttons_replace.replace(/\\"'(.*?)'\\"/g,'\\"$1\\"')
                    for (var key in vm.flatRuntimeAttributes) {
                                if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                                    floating_buttons_replace = floating_buttons_replace.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                                    floating_buttons_replace = floating_buttons_replace.replace('"','\"');
                                }
                            }  
                    for(var key in vm.current.parent){
                        try {
                            floating_buttons_replace = floating_buttons_replace.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].replace(/[\r\n]+/g," "));
                        } catch (error) {
                        }
                        floating_buttons_replace = floating_buttons_replace.replace('"','\"');
                    }
                    if(floating_buttons_replace.indexOf('##')>-1){
                        floating_buttons_replace = floating_buttons_replace.replace(/##(.*?)##/g,"");
                    }
                    that.list_items = JSON.parse(floating_buttons_replace);
                    that.list_items.forEach(element => {                    
                        for(var key in element){
                            if(key === 'name'){
                                element[key] = vm.aggregateFunction(element[key],data[0])
                            }
                            for(var key1 in data[0]){
                                if(key == 'visible' && element[key].toString().indexOf(key1)>-1 && element[key] != null && data[0][key1] !=null ){
                                    if( element[key].indexOf('"##')<0){
                                        element[key] = element[key].toString().replace(new RegExp('"##'+key1+'##"','g'),"'"+(data[0][key1].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                                    }
                                    else{
                                        element[key] = element[key].toString().replace(new RegExp('##'+key1+'##','g'),data[0][key1].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                                    }
                                }
                            }
                        }
                    });
                },error: function(error){
                    that.handleChangeData()
                }
            })                
        }
    }
})