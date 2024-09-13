const configRule = {
    methods: {
        configRule:function(data,rules,flatRuntimeAttributes=null){
            let that = this;
            if(flatRuntimeAttributes==null){
                flatRuntimeAttributes = vm.flatRuntimeAttributes
            }
            return  data.map(item=>{
                    rules.map(rule=>{
                        if(rule.hasOwnProperty('if')){
                            if(rule.if.indexOf('this()')>-1){
                                rule.if=rule.if.replace(/this\(\)/g,'##'+rule.key+'##')
                            }
                            if(rule.function.indexOf('this()')>-1){
                                rule.function=rule.function.replace(/this\(\)/g,'##'+rule.key+'##')
                            }
                            if(rule.if.indexOf('"##')>-1){
                                rule.if=rule.if.replace(/"##(.*?)##"/g,'##$1##')
                            }
                            let check = this.handleConditionRuleQuotes(rule.if,item,flatRuntimeAttributes)
                            try {    
                                let checked = eval(check);
                                if(typeof(checked)==='boolean' && checked){
                                    if(rule.function.indexOf('##')>-1){
                                        if(rule.function.indexOf('"##')>-1){
                                            rule.function=rule.function.replace(/"##(.*?)##"/g,'##$1##')
                                        }
                                        let checkfunc = this.handleConditionRuleQuotes(rule.function,item,flatRuntimeAttributes)
                                        if(checkfunc.indexOf('getdata_dmobj')>-1){
                                            checkfunc = vm.getDataDmobj('${'+checkfunc+'}')
                                            item[rule.key]=checkfunc.toString().replace(/'/g,"")
                                            return;  
                                        }
                                        try {
                                            if(String(checkfunc).indexOf('\\"')===0){
                                                checkfunc = checkfunc.replace(/\\"/g,"").replace(/"/g,"")
                                            }else{
                                                checkfunc = checkfunc.replace(/\\"/g,"\"")
                                                checkfunc = eval(checkfunc)
                                            }
                                        } catch (error) {
                                            checkfunc = checkfunc.replace(/\\"/g,"").replace(/"/g,"")
                                        }
                                        item[rule.key]=checkfunc
                                    }else{
                                        try {
                                            item[rule.key] = eval(rule.function)
                                        } catch (error) {
                                            if(typeof(rule.function)==='string' && rule.function.indexOf('"')===0){
                                                item[rule.key]=rule.function.replace(/\\\"/g,"")
                                            }else{
                                                item[rule.key]=rule.function
                                            }
                                        }
                                    }
                                        
                                }else if(typeof(checked)==='boolean' && !checked){
                                    if(rule.hasOwnProperty('else')){
                                        if(rule.else.indexOf('this()')>-1){
                                            rule.else=rule.else.replace(/this\(\)/g,'##'+rule.key+'##')
                                        }
                                        if(rule.else.indexOf('##')>-1){
                                            if(rule.else.indexOf('"##')>-1){
                                                rule.else=rule.else.replace(/"##(.*?)##"/g,'##$1##')
                                            }
                                            let checkfunc = rule.else.replace(/##(.*?)##/g,function (match, capture) {
                                                let valuefun=jsonPath(item,capture);
                                                    if(valuefun===false){
                                                        valuefun=match
                                                    }else{
                                                        valuefun=valuefun[0]!==null?'"'+valuefun[0]+'"':'""'
                                                    }
                                                    valuefun=valuefun.toString().replace(/\"/g,"\\\"").replace(/\s/g,' ')
                                                
                                                    return valuefun;
                                            });
                                            for (var key in flatRuntimeAttributes) {
                                                if (flatRuntimeAttributes.hasOwnProperty(key)) {
                                                    checkfunc = checkfunc.replace(new RegExp('"##'+key+'##"','g'),"'\""+flatRuntimeAttributes[key].replace(/[\r\n]+/g," ")+"\"'");
                                                    checkfunc = checkfunc.replace(new RegExp('"##'+key+'##','g'),"\""+flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                                                    checkfunc = checkfunc.replace(new RegExp('##'+key+'##"','g'),flatRuntimeAttributes[key].replace(/[\r\n]+/g," ")+"\"");
                                                    checkfunc = checkfunc.replace(new RegExp('##'+key+'##','g'),"'"+flatRuntimeAttributes[key].replace(/[\r\n]+/g," ")+"'");
                                                }
                                            }
                                            for (var key in vm.current.parent) {
                                                try {
                                                    checkfunc = checkfunc.replace(new RegExp('"##'+key+'##"','g'),"'\""+vm.current.parent[key].replace(/[\r\n]+/g," ")+"\"'");
                                                    checkfunc = checkfunc.replace(new RegExp('"##'+key+'##','g'),"\""+vm.current.parent[key].replace(/[\r\n]+/g," "));
                                                    checkfunc = checkfunc.replace(new RegExp('##'+key+'##"','g'),vm.current.parent[key].replace(/[\r\n]+/g," ")+"\"");
                                                    checkfunc = checkfunc.replace(new RegExp('##'+key+'##','g'),"'"+vm.current.parent[key].replace(/[\r\n]+/g," ")+"'");
                                                } catch (error) {
                                                }
                                            }
                                            if(checkfunc.indexOf('getdata_dmobj')>-1){
                                                checkfunc = vm.getDataDmobj('${'+checkfunc+'}')
                                                item[rule.key]=checkfunc.toString().replace(/'/g,"")
                                                return;
                                            }
                                            if(checkfunc.indexOf('##')>-1){
                                                checkfunc = checkfunc.replace(/##(.*?)##/g,'""')
                                            }
                                        
                                            try {
                                                checkfunc = checkfunc.replace(/\\"/g,"\"")
                                                checkfunc = eval(checkfunc)
                                            } catch (error) {
                                                checkfunc = checkfunc.replace(/\\"/g,"").replace(/"/g,"")
                                            }
                                            item[rule.key]=checkfunc
                                        }else{
                                            if(typeof(rule.else)==='string' && rule.else.indexOf('"')===0){
                                                item[rule.key]=rule.else.replace(/"/g,"")
                                            }else{
                                                item[rule.key]=rule.else
                                            }
                                        }
                                    }
                                }else if(typeof(checked)!=='boolean'){
                                    if(rule.hasOwnProperty('default')){
                                        item[rule.key]=rule.default
                                    }
                                }
                                
                            } catch (error) {
                                if(rule.hasOwnProperty('default')){
                                    item[rule.key]=rule.default
                                }
                            }
                        }else if(rule.hasOwnProperty('function')){
                            let string = false
                            let text = rule.function
                            if (text.startsWith("\"") && text.endsWith("\"")) {
                                string = true
                            } else {
                                string = false
                            }
                            if(rule.function.indexOf('this()')>-1){
                                rule.function=rule.function.replace(/this\(\)/g,'##'+rule.key+'##')
                            }
                            if(rule.function.indexOf('"##')>-1 && !string){
                                rule.function=rule.function.replace(/"##(.*?)##"/g,'##$1##')
                            }
                            let func=rule.function.replace(/##(.*?)##/g,function (match, capture) {
                                let value=jsonPath(item,capture);
                                if(value===false){
                                    value='##'+capture+'##'
                                }else if((value.constructor === Array && value.length>1 && value != null && value != undefined) || (value[0] != null && value[0] != undefined && value[0].constructor === Array && value[0].length>1)){
                                    item[rule.key] = value
                                    return value
                                }
                                else{
                                    if(string){
                                        value=value[0]!==null?value[0]:''
                                    }else{
                                        value=value[0]!==null?'"'+value[0]+'"':'""'
                                    }
                                }
                                value=value.toString().replace(/\s/g,' ')
                                return value;
                            });
                            func = func.replace(/'_'/g,'_')
                            for (var key in flatRuntimeAttributes) {
                                if (flatRuntimeAttributes.hasOwnProperty(key)) {
                                    func = func.replace(new RegExp('"##'+key+'##"','g'),"'\""+flatRuntimeAttributes[key].replace(/[\r\n]+/g," ")+"\"'");
                                    func = func.replace(new RegExp('"##'+key+'##','g'),"\""+flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                                    func = func.replace(new RegExp('##'+key+'##"','g'),flatRuntimeAttributes[key].replace(/[\r\n]+/g," ")+"\"");
                                    func = func.replace(new RegExp('##'+key+'##','g'),"'"+flatRuntimeAttributes[key].replace(/[\r\n]+/g," ")+"'");
                                }
                            }
                            for (var key in vm.current.parent) {
                                try {
                                    func = func.replace(new RegExp('"##'+key+'##"','g'),"'\""+vm.current.parent[key].replace(/[\r\n]+/g," ")+"\"'");
                                    func = func.replace(new RegExp('"##'+key+'##','g'),"\""+vm.current.parent[key].replace(/[\r\n]+/g," "));
                                    func = func.replace(new RegExp('##'+key+'##"','g'),vm.current.parent[key].replace(/[\r\n]+/g," ")+"\"");
                                    func = func.replace(new RegExp('##'+key+'##','g'),"'"+vm.current.parent[key].replace(/[\r\n]+/g," ")+"'");
                                } catch (error) {
                                }
                            }
                            if(func.indexOf('getdata_dmobj')>-1){
                                func = vm.getDataDmobj('${'+func+'}')
                                item[rule.key]=func.toString().replace(/'/g,"")
                                return;    
                            }
                            if(func.indexOf('##')>-1){
                                func = func.replace(/##(.*?)##/g,'""')
                            }
                            try {
                                let funccheck=eval(func)
                                if(funccheck==='error'){
                                    if(rule.hasOwnProperty('default')){
                                        item[rule.key]=rule.default
                                    }
                                }else{
                                    item[rule.key]=funccheck.toString().replace(/'/g,"").replace(/"/g,"")
                                }
                                if(isNaN(funccheck) && typeof(funccheck) != 'string'){
                                    item[rule.key]=func.toString().replace(/'/g,"")
                                }
                            } catch (error) {
                                if(error.message.includes('Unexpected identifier')){
                                    item[rule.key]=func.toString().slice(1, -1);
                                }else{
                                    if(rule.hasOwnProperty('default')){
                                        item[rule.key]=rule.default
                                    }
                                    else if(error.message == 'Unexpected string'){
                                        item[rule.key]=func.toString().replace(/'/g,"")
                                    }
                                }
                            }
                        }
                    })
                    return item;
            })   
        },
        handleConditionRuleQuotes(condition,item,flatRuntimeAttributes){
            condition = condition.replace(/##(.*?)##/g,function (match, capture) {
                let value=jsonPath(item,capture);

                    if(value===false){
                        value='##'+capture+'##'
                    }else{
                        value=value[0]!==null?"'"+value[0]+"'":"''"
                    }
                    value=value.toString().replace(/\"/g,"\\\"").replace(/\s/g,' ')
                    return value;
            }); 
            
            
            for (var key in flatRuntimeAttributes) {
                if (flatRuntimeAttributes.hasOwnProperty(key)) {
                    condition = condition.replace(new RegExp('"##'+key+'##"','g'),"'\""+flatRuntimeAttributes[key].replace(/[\r\n]+/g," ")+"\"'");
                    condition = condition.replace(new RegExp('"##'+key+'##','g'),"\""+flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                    condition = condition.replace(new RegExp('##'+key+'##"','g'),flatRuntimeAttributes[key].replace(/[\r\n]+/g," ")+"\"");
                    condition = condition.replace(new RegExp('##'+key+'##','g'),"'"+flatRuntimeAttributes[key].replace(/[\r\n]+/g," ")+"'");
                }
            }
            for (var key in vm.current.parent) {
                try {
                    condition = condition.replace(new RegExp('"##'+key+'##"','g'),"'\""+vm.current.parent[key].replace(/[\r\n]+/g," ")+"\"'");
                    condition = condition.replace(new RegExp('"##'+key+'##','g'),"\""+vm.current.parent[key].replace(/[\r\n]+/g," "));
                    condition = condition.replace(new RegExp('##'+key+'##"','g'),vm.current.parent[key].replace(/[\r\n]+/g," ")+"\"");
                    condition = condition.replace(new RegExp('##'+key+'##','g'),"'"+vm.current.parent[key].replace(/[\r\n]+/g," ")+"'");
                } catch (error) {
                }
            }
            if(condition.indexOf('##')>-1){
                condition = condition.replace(/##(.*?)##/g,'""')
            }
            return condition;
        },
    }
  }