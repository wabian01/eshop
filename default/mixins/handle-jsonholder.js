const jsonHolderData = {
    methods: {
        jsonHolderData(itemJSONString,type=null){
            try {
                if(type=='html_view'){
                    let data = JSON.parse(itemJSONString)
                    data.html_template = data.html_template.replace(/##jholder(.*?)##/g,function (match, capture) {
                        let arg = capture.split(".")  
                        if(arg.length == 3 && arg[2] == 'count'){
                            try {
                                return JSON.parse(vm.jsonHolder)[arg[1]].length    
                            } catch (error) {
                                return 0
                            }
                            
                        }else{
                            try {
                                let stringarray = ''
                                if(JSON.parse(vm.jsonHolder)[arg[1]].length!=undefined){
                                    let stringarray = ''
                                    JSON.parse(vm.jsonHolder)[arg[1]].map((value,index)=>{
                                        if(stringarray!==''){
                                            stringarray += ','
                                        }
                                        stringarray += JSON.stringify(value)
                                    })
                                    stringarray = '['+stringarray+']'
                                    
                                }
                                if(stringarray!==""){
                                    return stringarray
                                }else{
                                    return JSON.stringify(JSON.parse(vm.jsonHolder)[arg[1]])
                                }
                                
                            } catch (error) {
                                return JSON.stringify([])
                            }
                            
                        }   
                    });  
                    return JSON.stringify(data)
                }else if(type=='buttonGroup'){
                    itemJSONString = itemJSONString.replace(/##jholder(.*?)##/g,function (match, capture) {
                        let arg = capture.split(".")  
                        if(arg.length == 3 && arg[2] == 'count'){
                            try {
                                return JSON.parse(vm.jsonHolder)[arg[1]].length    
                            } catch (error) {
                                return 0
                            }
                            
                        }else{
                            try {
                                return JSON.stringify(JSON.parse(vm.jsonHolder)[arg[1]])
                            } catch (error) {
                                return JSON.stringify([])
                            }
                            
                        }   
                    });  
                    return itemJSONString
                }
            } catch (error) {
                return itemJSONString
            }
            
        },
    }
  }