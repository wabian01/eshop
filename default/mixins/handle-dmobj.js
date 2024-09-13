const getDataDmobj = {
    methods: {
        getDataDmobj(itemJSONString){
            if(itemJSONString.indexOf('[\"${getdata_dmobj')>-1){
                itemJSONString = itemJSONString.replace(/\[\"\${getdata_dmobj(.*?)}/g,function (match, capture) {
                    let temp = capture.match(/,(.*),/)[0]
                    if(/^((?!('|\")).)*$/.test(temp)){
                        capture = capture.replace(/,(.*),/g,',"$1",')
                    }
                    let func = 'vm.getdata_dmobj' + capture.replace(/\\"/g,'"')
                    let result = ""
                    try {
                        result = eval(func)
                        if(result.constructor === Array){
                            let temarray = result.toString().split(',').map(x => "\"" + x + "\"").toString();
                            result = temarray.substr(1,temarray.length - 2)
                            return '[\"'+result;
                        }
                    } catch (error) {}
                    return '[\"'+result;
                })
            }
            if(itemJSONString.indexOf('[\\\"${getdata_dmobj')>-1){
                itemJSONString = itemJSONString.replace(/\[\\\"\${getdata_dmobj(.*?)}/g,function (match, capture) {
                    let temp = capture.match(/,(.*),/)[0]
                    if(/^((?!('|\")).)*$/.test(temp)){
                        capture = capture.replace(/,(.*),/g,',"$1",')
                    }
                    let func = 'vm.getdata_dmobj' + capture.replace(/\\"/g,'"')
                    let result = ""
                    try {
                        result = eval(func)
                        if(result.constructor === Array){
                            let temarray = result.toString().split(',').map(x => "\\\"" + x + "\\\"").toString();
                            result = temarray.substr(2,temarray.length - 4)
                            return '[\\\"'+result;
                        }
                    } catch (error) {}
                    return '[\\\"'+result;
                })
            }
            itemJSONString = itemJSONString.replace(/\${getdata_dmobj(.*?)}/g,function (match, capture) {
                let temp = capture.match(/,(.*),/)[0]
                if(/^((?!('|\")).)*$/.test(temp)){
                    capture = capture.replace(/,(.*),/g,',"$1",')
                }
                let func = 'vm.getdata_dmobj' + capture.replace(/\\"/g,'"')
                let result = ""
                try {
                    result = eval(func)
                } catch (error) {}
                return result;
            })
            return itemJSONString
        },
        getSourceDmobj(itemJSONString){
            itemJSONString = itemJSONString.replace(/##source:(.*?)##/g,function (match, capture) {
                let func = 'vm.' + capture.replace(/\[(.*?)\]/g, '["$1"]')
                let result = ""
                try {
                    result = eval(func)
                } catch (error) {}
                return result;

            })
            return itemJSONString
        },
        getdata_dmobj(alias="",id="",attribute=""){
            if(this.dmobj.hasOwnProperty(alias)){
                if(this.dmobj[alias].hasOwnProperty(id)){
                    if(this.dmobj[alias][id].hasOwnProperty(attribute)){
                        return this.dmobj[alias][id][attribute]
                    }else{
                        return ""
                    }
                }else{
                    return ""
                }
            }else{
                return ""
            }
        },
    }
  }