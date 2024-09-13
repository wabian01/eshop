const handleButtonVisible = {
    methods: {
        handleButtonVisible(screen_item_new_temp,list_item){
            screen_item_new_temp.forEach(element => {                    
                for(let key in element){
                    if(key === 'name'){
                        element[key] = vm.aggregateFunction(element[key],list_item)
                    }
                    for(let key1 in list_item){
                        if(key == 'visible' && element[key].toString().indexOf(key1)>-1 && element[key] != null && list_item[key1] !=null ){
                            element[key] = element[key].toString().replace(new RegExp('"##'+key1+'##"','g'),'"'+(this.list_item[key1].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+'"');
                            element[key] = element[key].toString().replace(new RegExp('\'##'+key1+'##\'','g'),"'"+(this.list_item[key1].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                            element[key] = element[key].toString().replace(new RegExp('##'+key1+'##','g'),"'"+(this.list_item[key1].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");           
                        }
                    }
                    for (let key2 in vm.flatRuntimeAttributes) {
                        if (vm.flatRuntimeAttributes.hasOwnProperty(key2)) {
                            if(key == 'visible' && element[key].toString().indexOf(key2)>-1 && element[key] != null && vm.flatRuntimeAttributes[key2] !=null ){
                                let hasMatches = element[key].match(/matches\((.*?)\)/g) 
                                
                                if( !(hasMatches && hasMatches[0] && hasMatches[0].indexOf("##")) && element[key].indexOf('"##')<0 && element[key].indexOf('\'##')<0){
                                    element[key] = element[key].toString().replace(new RegExp('##'+key2+'##','g'),"'"+(vm.flatRuntimeAttributes[key2].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                                }
                                else{
                                    element[key] = element[key].toString().replace(new RegExp('##'+key2+'##','g'),vm.flatRuntimeAttributes[key2].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                                }
                            }
                        }
                    }
                    for(let key3 in vm.current.parent){
                        if(key == 'visible' && element[key].toString().indexOf(key3)>-1 && element[key] != null && vm.current.parent[key3] !=null ){
                                if( element[key].indexOf('"##')<0 && element[key].indexOf('\'##')<0){
                                    element[key] = element[key].toString().replace(new RegExp('##'+key3+'##','g'),"'"+(vm.current.parent[key3].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                                }
                                else{
                                    element[key] = element[key].toString().replace(new RegExp('##'+key3+'##','g'),vm.current.parent[key3].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                                }
                            }
                    }
                    if(key == 'visible' && element[key].toString().indexOf('##')>-1){
                        if( element[key].indexOf('"##')<0 && element[key].indexOf('\'##')<0){
                            element[key] = element[key].toString().replace(/##(.*?)##/g,'""')
                        }
                        else{
                            element[key] = element[key].toString().replace(/##(.*?)##/g,'')
                        }
                    }
                }
            });
            return screen_item_new_temp;
        },
    }
  }