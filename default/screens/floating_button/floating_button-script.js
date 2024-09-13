    Vue.component('floating_button', {
        template: '#floating_button',
        props: ['object','screen','task','json_holder','refresh_rate','list_data_object'],
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
        },
        data: function () {
            return {
                'list_items':[]
            }
        },
        watch: {
            list_data_object(list_data_object_new,list_data_object_old){
                if(list_data_object_old==="waiting_loading" || !list_data_object_old){
                    this.handleDataObject()
                }
            },
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
            handleDataObject(){
                let that = this
                let floating_buttons_replace = JSON.stringify(JSON.parse(JSON.stringify(this.screen.floating_buttons.actions)))
                let data = JSON.parse(JSON.stringify(this.list_data_object));
                for(let key in data[0]){
                    if(data[0].hasOwnProperty(key) && data[0][key] != null){
                        floating_buttons_replace = floating_buttons_replace.toString().replace(new RegExp('\'##'+key+'##\'','g'),"'"+(data[0][key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                        floating_buttons_replace = floating_buttons_replace.toString().replace(new RegExp('##'+key+'##','g'),"'"+(data[0][key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                    }
                }
                floating_buttons_replace = floating_buttons_replace.replace(/\\"'(.*?)'\\"/g,'\\"$1\\"')
                for (let key in vm.flatRuntimeAttributes) {
                            if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                                floating_buttons_replace = floating_buttons_replace.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                                floating_buttons_replace = floating_buttons_replace.replace('"','\"');
                            }
                        }  
                for(let key in vm.current.parent){
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
            },
        }
    })