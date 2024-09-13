const aggregateFunction = {
    methods: {
        aggregateFunction:function(originallData,listData){
            return   originallData.replace(/\${(.*?)\)}|##(randomnanoid)##|##(randomnanoid(.*?))##/g,function(match,capture){
                if(match.indexOf('this()')>-1){
                    match=match.replace(/this\(\)/g,'##'+listData+'##')
                }
                if(match.indexOf('##')===-1){
                    return match
                }
                if(match.indexOf('##randomnanoid')===0){
                    capture = match.slice(2,-2)
                    if(capture.indexOf("randomnanoid(")>-1){
                        const regex = /randomnanoid\((.*?),(.*?)\)/;
                        const matches = capture.match(regex);
                        if (matches?.[1] && matches?.[2]) {
                            const replaced = capture.replace(regex, `randomnanoid('${matches[1]}','${matches[2]}')`);
                            capture = replaced
                        }
                    }else{
                        capture = "randomnanoid()"
                    }
                }else{
                    capture = match.slice(2,-1)
                    if(capture.includes('##randomnanoid')){
                        if(capture.indexOf("randomnanoid(")>-1){
                            const regex = /##randomnanoid\((.*?),(.*?)\)##/;
                            const matches = capture.match(regex);
                            if (matches?.[1] && matches?.[2]) {
                                const replaced = capture.replace(regex, `randomnanoid('${matches[1]}','${matches[2]}')`);
                                capture = replaced
                            }
                        }else{
                            capture = capture.replace(/##randomnanoid##/g, 'randomnanoid()');
                        }
                    }
                }
                if(capture.indexOf('getdata_dmobj')>-1){
                    capture = match;
                    return capture
                }
                capture=capture.replace(/'##(.*?)##'/g,'"##$1##"')
                capture=capture.replace(/\\\"##(.*?)##\\\"/g,'"##$1##"')
                capture=capture.replace(/\\\"(.*?)\\\"/g,'"$1"')
                
                let regex = /"([^"]*)"|'([^']*)'/g;

                capture = capture.replace(regex,function(newvalue){
                    newvalue = newvalue.replace(/##(.*?)##/g, function(match1,match2){
                        let value = jsonPath(listData,match2)
                        if(newvalue.indexOf('escape_json')==0 || newvalue.indexOf('encode_url')==0 || newvalue.indexOf('unescape_json')==0){
                            if(value[0]!=undefined){
                                value =  JSON.stringify(value[0]).slice(1,-1)
                            }
                        }
                        if(value === false || value == undefined || value[0] == undefined){
                            return match1;
                        }
                        return value
                    })

                    if(newvalue.indexOf('##')>-1){
                        for (var key in vm.flatRuntimeAttributes) {
                            if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                                newvalue = newvalue.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                            }
                        }
                    }

                    for(var key in vm.current.parent){
                        try {
                            newvalue = newvalue.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].replace(/[\r\n]+/g," "));
                        } catch (error) {
                        }
                    }
                    
                    if(newvalue.indexOf('##')>-1){
                        newvalue = newvalue.replace(/##(.*?)##/g,'')
                    }
                    return newvalue
                })
                capture = capture.replace(/##(.*?)##/g, function(match1,match2){
                    let value = jsonPath(listData,match2)
                    if(capture.indexOf('escape_json')==0 || capture.indexOf('encode_url')==0 || capture.indexOf('unescape_json')==0){
                        if(value[0]!=undefined){
                            value =  JSON.stringify(value[0]).slice(1,-1)
                        }
                    }
                    if(value === false || value == undefined || value[0] == undefined){
                        return match1;
                    }
                    return '"'+value+'"'
                })
                
                if(capture.indexOf('##')>-1){
                    for (var key in vm.flatRuntimeAttributes) {
                        if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                            capture = capture.replace(new RegExp('"##'+key+'##"','g'),"\""+vm.flatRuntimeAttributes[key].toString().replace(/[\r\n]+/g," ")+"\"");
                            capture = capture.replace(new RegExp('##'+key+'##','g'),"'"+vm.flatRuntimeAttributes[key].toString().replace(/[\r\n]+/g," ")+"'");
                        }
                    }
                }

                for(var key in vm.current.parent){
                    try {
                        capture = capture.replace(new RegExp('##'+key+'##','g'),'"'+vm.current.parent[key].replace(/[\r\n]+/g," ")+'"');
                    } catch (error) {
                    }
                }

                if(capture.indexOf('this()')>-1){
                    capture = capture.replace(/this\(\)/g,'\'""\'')
                }
                if(capture.indexOf('##')>-1){
                    capture = capture.replace(/##(.*?)##/g,'""')
                }
                try {
                    let func 
                    if(capture.indexOf("randomnanoid")>-1){
                        try {
                            func = eval(capture)
                        } catch (error) {
                            func = eval("randomnanoid()")
                        }
                    }else{
                        func = eval(capture)
                    }
                    if(func === 'error'){
                        func = "";
                    }
                    return func;
                } catch (error) {
                    return "";
                }
            })
        },
    }
  }