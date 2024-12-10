const configRule = {
    methods: {
        configRule:function(data,rules,flatRuntimeAttributes=null){
            if(flatRuntimeAttributes){
                flatRuntimeAttributes = vm.flatRuntimeAttributes
            }
            return  data.map(item=>{
                    rules.map(rule=>{
                        if(rule.hasOwnProperty('if')){
                            this.processIfRule(item, rule, flatRuntimeAttributes)
                        }else if(rule.hasOwnProperty('function')){
                            let func = rule.function
                            let string = this.isString(func)
                            if (func.indexOf('this()') > -1) {
                                func = func.replace(/this\(\)/g, '##' + rule.key + '##')
                            }

                            func = this.handleConditionRuleQuotes(func,item,flatRuntimeAttributes, vm.current.parent, string)
                            func = this.handleConditionRuleNotQuote(func,item,flatRuntimeAttributes, vm.current.parent)

                            func = func.replace(/'_'/g,'_')
                            
                            if(func.indexOf('getdata_dmobj')>-1){
                                func = vm.getDataDmobj('${'+func+'}')
                                item[rule.key]=func.toString().replace(/'/g,"")
                                return;    
                            }

                            try {
                                let funccheck=eval(func)
                                if(funccheck==='error'){
                                    if(rule.hasOwnProperty('default')){
                                        item[rule.key]=rule.default
                                    }
                                }else{
                                    item[rule.key]=funccheck.toString()
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
        handleConditionRuleQuotes(condition, item, flatRuntimeAttributes, parent, string = false) {
            const regex = string ? /"(.*)"/g : /"([^"]*)"|'([^']*)'/g;
            
            return condition.replace(regex, (data) => {
                let processedData = data.replace(/##(.*?)##/g, (match, capture) => {
                    const value = jsonPath(item, capture);
                    return !value ? match : (value[0] || "");
                });

                if(processedData.includes('##')){
                    for (let key in flatRuntimeAttributes) {
                        if (flatRuntimeAttributes.hasOwnProperty(key)) {
                            processedData = processedData.replace(new RegExp('##'+key+'##','g'),flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                        }
                    }
                }
        
                for(let key in parent){
                    try {
                        processedData = processedData.replace(new RegExp('##'+key+'##','g'),parent[key].replace(/[\r\n]+/g," "));
                    } catch (error) {
                    }
                }

                return processedData.includes('##') ? processedData.replace(/##(.*?)##/g, '') : processedData;
            });
        },
        handleConditionRuleNotQuote(condition, item, flatRuntimeAttributes, parent) {
            let processedCondition = condition.replace(/##(.*?)##/g, (match, capture) => {
                const value = jsonPath(item, capture);
                return !value?.[0] ? match : `"${value}"`;
            });

            if (processedCondition.includes('##')) {
                for (let key in flatRuntimeAttributes) {
                    if (flatRuntimeAttributes.hasOwnProperty(key)) {
                        processedCondition = processedCondition.replace(new RegExp('##'+key+'##','g'),'"'+flatRuntimeAttributes[key].toString().replace(/[\r\n]+/g," ")+'"');
                    }
                }
            }

            for(let key in parent){
                try {
                    processedCondition = processedCondition.replace(new RegExp('##'+key+'##','g'),'"'+parent[key].replace(/[\r\n]+/g," ")+'"');
                } catch (error) {
                }
            }

            return processedCondition.includes('##') ? 
                processedCondition.replace(/##(.*?)##/g, '""') : 
                processedCondition;
        },
        isString(text){
            if (text.startsWith("\"") && text.endsWith("\"")) {
                return true
            } else {
                return false
            }
        },
        isTrueBoolean(item, rule, flatRuntimeAttributes){
            let checkfunc = rule.function.replace(/this\(\)/g, '##' + rule.key + '##')
            
            if (checkfunc.indexOf('##') > -1) {
                checkfunc = this.handleConditionRuleQuotes(checkfunc,item,flatRuntimeAttributes, vm.current.parent)
                checkfunc = this.handleConditionRuleNotQuote(checkfunc,item,flatRuntimeAttributes, vm.current.parent)
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
        },
        isFalseBoolean(item, rule, flatRuntimeAttributes){
            if(rule.hasOwnProperty('else')){
                let checkfunc = rule.else.replace(/this\(\)/g, '##' + rule.key + '##')
                
                if (checkfunc.indexOf('##') > -1) {
                    checkfunc = this.handleConditionRuleQuotes(checkfunc,item,flatRuntimeAttributes, vm.current.parent)
                    checkfunc = this.handleConditionRuleNotQuote(checkfunc,item,flatRuntimeAttributes, vm.current.parent)
                    
                    if(checkfunc.indexOf('getdata_dmobj')>-1){
                        checkfunc = vm.getDataDmobj('${'+checkfunc+'}')
                        item[rule.key]=checkfunc.toString().replace(/'/g,"")
                        return;
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
        },
        itemDefault(item, rule){
            if(rule.hasOwnProperty('default')){
                item[rule.key]=rule.default
            }
        },
        processIfRule(item, rule, flatRuntimeAttributes){
            let check = rule.if.replace(/this\(\)/g, '##' + rule.key + '##')

            check = this.handleConditionRuleQuotes(check,item,flatRuntimeAttributes, vm.current.parent)
            check = this.handleConditionRuleNotQuote(check,item,flatRuntimeAttributes, vm.current.parent)

            try {    
                let checked = eval(check);
                if(typeof(checked)==='boolean' && checked){

                    this.isTrueBoolean(item, rule, flatRuntimeAttributes)
                        
                }else if(typeof(checked)==='boolean' && !checked){
                    this.isFalseBoolean(item, rule, flatRuntimeAttributes)
                }else if(typeof(checked)!=='boolean'){
                    this.itemDefault(item, rule)
                }   
            } catch (error) {
                this.itemDefault(item, rule)
            }
        },
    }
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { configRule };
}
