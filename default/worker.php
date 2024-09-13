<script>
    var codeString = "(" + function() {
        var dmobj = [];
        var vm = {}
        function configRule(data, rules, flatRuntimeAttributes, parent) {
            return data.map(item => {
                rules.map(rule => {
                    if (rule.hasOwnProperty('if')) {
                        if (rule.if.indexOf('this()') > -1) {
                            rule.if = rule.if.replace(/this\(\)/g, '##' + rule.key + '##')
                        }
                        if (rule.function.indexOf('this()') > -1) {
                            rule.function = rule.function.replace(/this\(\)/g, '##' + rule.key + '##')
                        }
                        if (rule.if.indexOf('"##') > -1) {
                            rule.if = rule.if.replace(/"##(.*?)##"/g, '##$1##')
                        }
                        let check = rule.if.replace(/##(.*?)##/g, function(match, capture) {
                            let value = jsonPath(item, capture);

                            if (value === false) {
                                value = '##' + capture + '##'
                            } else {
                                value = value[0] !== null ? "'" + value[0] + "'" : "''"
                            }
                            value = value.toString().replace(/\"/g, "\\\"").replace(/\s/g, ' ')
                            return value;
                        });


                        for (var key in flatRuntimeAttributes) {
                            if (flatRuntimeAttributes.hasOwnProperty(key)) {
                                check = check.replace(new RegExp('"##' + key + '##"', 'g'), "'\"" + flatRuntimeAttributes[key].replace(/[\r\n]+/g, " ") + "\"'");
                                check = check.replace(new RegExp('"##' + key + '##', 'g'), "\"" + flatRuntimeAttributes[key].replace(/[\r\n]+/g, " "));
                                check = check.replace(new RegExp('##' + key + '##"', 'g'), flatRuntimeAttributes[key].replace(/[\r\n]+/g, " ") + "\"");
                                check = check.replace(new RegExp('##' + key + '##', 'g'), "'" + flatRuntimeAttributes[key].replace(/[\r\n]+/g, " ") + "'");
                            }
                        }
                        for (var key in parent) {
                            try {
                                check = check.replace(new RegExp('"##' + key + '##"', 'g'), "'\"" + parent[key].replace(/[\r\n]+/g, " ") + "\"'");
                                check = check.replace(new RegExp('"##' + key + '##', 'g'), "\"" + parent[key].replace(/[\r\n]+/g, " "));
                                check = check.replace(new RegExp('##' + key + '##"', 'g'), parent[key].replace(/[\r\n]+/g, " ") + "\"");
                                check = check.replace(new RegExp('##' + key + '##', 'g'), "'" + parent[key].replace(/[\r\n]+/g, " ") + "'");
                            } catch (error) {}
                        }
                        if (check.indexOf('##') > -1) {
                            check = check.replace(/##(.*?)##/g, '""')
                        }
                        try {
                            let checked = eval(check);
                            if (typeof(checked) === 'boolean' && checked) {
                                if (rule.function.indexOf('##') > -1) {
                                    if (rule.function.indexOf('"##') > -1) {
                                        rule.function = rule.function.replace(/"##(.*?)##"/g, '##$1##')
                                    }
                                    let checkfunc = rule.function.replace(/##(.*?)##/g, function(match, capture) {
                                        let valuefun = jsonPath(item, capture);
                                        if (valuefun === false) {
                                            valuefun = match
                                        } else {
                                            valuefun = valuefun[0] !== null ? '"' + valuefun[0] + '"' : '""'
                                        }
                                        valuefun = valuefun.toString().replace(/\"/g, "\\\"").replace(/\s/g, ' ')

                                        return valuefun;
                                    });
                                    for (var key in flatRuntimeAttributes) {
                                        if (flatRuntimeAttributes.hasOwnProperty(key)) {
                                            checkfunc = checkfunc.replace(new RegExp('"##' + key + '##"', 'g'), "'\"" + flatRuntimeAttributes[key].replace(/[\r\n]+/g, " ") + "\"'");
                                            checkfunc = checkfunc.replace(new RegExp('"##' + key + '##', 'g'), "\"" + flatRuntimeAttributes[key].replace(/[\r\n]+/g, " "));
                                            checkfunc = checkfunc.replace(new RegExp('##' + key + '##"', 'g'), flatRuntimeAttributes[key].replace(/[\r\n]+/g, " ") + "\"");
                                            checkfunc = checkfunc.replace(new RegExp('##' + key + '##', 'g'), "'" + flatRuntimeAttributes[key].replace(/[\r\n]+/g, " ") + "'");
                                        }
                                    }
                                    for (var key in parent) {
                                        try {
                                            checkfunc = checkfunc.replace(new RegExp('"##' + key + '##"', 'g'), "'\"" + parent[key].replace(/[\r\n]+/g, " ") + "\"'");
                                            checkfunc = checkfunc.replace(new RegExp('"##' + key + '##', 'g'), "\"" + parent[key].replace(/[\r\n]+/g, " "));
                                            checkfunc = checkfunc.replace(new RegExp('##' + key + '##"', 'g'), parent[key].replace(/[\r\n]+/g, " ") + "\"");
                                            checkfunc = checkfunc.replace(new RegExp('##' + key + '##', 'g'), "'" + parent[key].replace(/[\r\n]+/g, " ") + "'");
                                        } catch (error) {}
                                    }
                                    if (checkfunc.indexOf('getdata_dmobj') > -1) {
                                        checkfunc = getDataDmobj('${' + checkfunc + '}')
                                        // if(checkfunc !== ''){
                                        item[rule.key] = checkfunc.toString().replace(/'/g, "")
                                        return;
                                        // }
                                    }
                                    if (checkfunc.indexOf('##') > -1) {
                                        checkfunc = checkfunc.replace(/##(.*?)##/g, '""')
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
                                    item[rule.key] = checkfunc
                                } else {
                                    try {
                                        item[rule.key] = eval(rule.function)
                                    } catch (error) {
                                        if (typeof(rule.function) === 'string' && rule.function.indexOf('"') === 0) {
                                            item[rule.key] = rule.function.replace(/\\\"/g, "")
                                        } else {
                                            item[rule.key] = rule.function
                                        }
                                    }
                                }

                            } else if (typeof(checked) === 'boolean' && !checked) {
                                if (rule.hasOwnProperty('else')) {
                                    if (rule.else.indexOf('this()') > -1) {
                                        rule.else = rule.else.replace(/this\(\)/g, '##' + rule.key + '##')
                                    }
                                    if (rule.else.indexOf('##') > -1) {
                                        if (rule.else.indexOf('"##') > -1) {
                                            rule.else = rule.else.replace(/"##(.*?)##"/g, '##$1##')
                                        }
                                        let checkfunc = rule.else.replace(/##(.*?)##/g, function(match, capture) {
                                            let valuefun = jsonPath(item, capture);
                                            if (valuefun === false) {
                                                valuefun = match
                                            } else {
                                                valuefun = valuefun[0] !== null ? '"' + valuefun[0] + '"' : '""'
                                            }
                                            valuefun = valuefun.toString().replace(/\"/g, "\\\"").replace(/\s/g, ' ')

                                            return valuefun;
                                        });
                                        for (var key in flatRuntimeAttributes) {
                                            if (flatRuntimeAttributes.hasOwnProperty(key)) {
                                                checkfunc = checkfunc.replace(new RegExp('"##' + key + '##"', 'g'), "'\"" + flatRuntimeAttributes[key].replace(/[\r\n]+/g, " ") + "\"'");
                                                checkfunc = checkfunc.replace(new RegExp('"##' + key + '##', 'g'), "\"" + flatRuntimeAttributes[key].replace(/[\r\n]+/g, " "));
                                                checkfunc = checkfunc.replace(new RegExp('##' + key + '##"', 'g'), flatRuntimeAttributes[key].replace(/[\r\n]+/g, " ") + "\"");
                                                checkfunc = checkfunc.replace(new RegExp('##' + key + '##', 'g'), "'" + flatRuntimeAttributes[key].replace(/[\r\n]+/g, " ") + "'");
                                            }
                                        }
                                        for (var key in parent) {
                                            try {
                                                checkfunc = checkfunc.replace(new RegExp('"##' + key + '##"', 'g'), "'\"" + parent[key].replace(/[\r\n]+/g, " ") + "\"'");
                                                checkfunc = checkfunc.replace(new RegExp('"##' + key + '##', 'g'), "\"" + parent[key].replace(/[\r\n]+/g, " "));
                                                checkfunc = checkfunc.replace(new RegExp('##' + key + '##"', 'g'), parent[key].replace(/[\r\n]+/g, " ") + "\"");
                                                checkfunc = checkfunc.replace(new RegExp('##' + key + '##', 'g'), "'" + parent[key].replace(/[\r\n]+/g, " ") + "'");
                                            } catch (error) {}
                                        }
                                        if (checkfunc.indexOf('getdata_dmobj') > -1) {
                                            checkfunc = getDataDmobj('${' + checkfunc + '}')
                                            // if(checkfunc !== ''){
                                            item[rule.key] = checkfunc.toString().replace(/'/g, "")
                                            return;
                                            // }
                                        }
                                        if (checkfunc.indexOf('##') > -1) {
                                            checkfunc = checkfunc.replace(/##(.*?)##/g, '""')
                                        }

                                        try {
                                            checkfunc = checkfunc.replace(/\\"/g, "\"")
                                            checkfunc = eval(checkfunc)
                                        } catch (error) {
                                            checkfunc = checkfunc.replace(/\\"/g, "").replace(/"/g, "")
                                        }
                                        item[rule.key] = checkfunc
                                    } else {
                                        if (typeof(rule.else) === 'string' && rule.else.indexOf('"') === 0) {
                                            item[rule.key] = rule.else.replace(/"/g, "")
                                        } else {
                                            item[rule.key] = rule.else
                                        }
                                    }
                                }
                            } else if (typeof(checked) !== 'boolean') {
                                if (rule.hasOwnProperty('default')) {
                                    item[rule.key] = rule.default
                                }
                            }

                        } catch (error) {
                            if (rule.hasOwnProperty('default')) {
                                item[rule.key] = rule.default
                            }
                        }
                    } else if (rule.hasOwnProperty('function')) {
                        let string = false
                        let text = rule.function
                        if (text.startsWith("\"") && text.endsWith("\"")) {
                            string = true
                        } else {
                            string = false
                        }
                        if (rule.function.indexOf('this()') > -1) {
                            rule.function = rule.function.replace(/this\(\)/g, '##' + rule.key + '##')
                        }
                        if (rule.function.indexOf('"##') > -1 && !string) {
                            rule.function = rule.function.replace(/"##(.*?)##"/g, '##$1##')
                        }
                        let func = rule.function.replace(/##(.*?)##/g, function(match, capture) {
                            let value = jsonPath(item, capture);
                            if (value === false) {
                                value = '##' + capture + '##'
                            } else if ((value.constructor === Array && value.length > 1 && value != null && value != undefined) || (value[0] != null && value[0] != undefined && value[0].constructor === Array && value[0].length > 1)) {
                                item[rule.key] = value
                                return value
                            } else {
                                if(string){
                                    value=value[0]!==null?value[0]:''
                                }else{
                                    value = value[0] !== null ? "'" + value[0] + "'" : "''"
                                }
                            }
                            value = value.toString().replace(/\"/g, "\\\"").replace(/\s/g, ' ').replace(/\\"/g, "")
                            return value;
                        });
                        func = func.replace(/'_'/g, '_')
                        for (var key in flatRuntimeAttributes) {
                            if (flatRuntimeAttributes.hasOwnProperty(key)) {
                                func = func.replace(new RegExp('"##' + key + '##"', 'g'), "'\"" + flatRuntimeAttributes[key].replace(/[\r\n]+/g, " ") + "\"'");
                                func = func.replace(new RegExp('"##' + key + '##', 'g'), "\"" + flatRuntimeAttributes[key].replace(/[\r\n]+/g, " "));
                                func = func.replace(new RegExp('##' + key + '##"', 'g'), flatRuntimeAttributes[key].replace(/[\r\n]+/g, " ") + "\"");
                                func = func.replace(new RegExp('##' + key + '##', 'g'), "'" + flatRuntimeAttributes[key].replace(/[\r\n]+/g, " ") + "'");
                            }
                        }
                        for (var key in parent) {
                            try {
                                func = func.replace(new RegExp('"##' + key + '##"', 'g'), "'\"" + parent[key].replace(/[\r\n]+/g, " ") + "\"'");
                                func = func.replace(new RegExp('"##' + key + '##', 'g'), "\"" + parent[key].replace(/[\r\n]+/g, " "));
                                func = func.replace(new RegExp('##' + key + '##"', 'g'), parent[key].replace(/[\r\n]+/g, " ") + "\"");
                                func = func.replace(new RegExp('##' + key + '##', 'g'), "'" + parent[key].replace(/[\r\n]+/g, " ") + "'");
                            } catch (error) {}
                        }
                        if (func.indexOf('getdata_dmobj') > -1) {
                            func = getDataDmobj('${' + func + '}')
                            // if(func !== ''){
                            item[rule.key] = func.toString().replace(/'/g, "")
                            return;
                            // }
                        }
                        if (func.indexOf('##') > -1) {
                            func = func.replace(/##(.*?)##/g, '""')
                        }
                        try {
                            // if(func.indexOf('escape_json')==0){
                            //     func =  'escape_json(\''+JSON.stringify(func.slice(13,-2)).slice(1,-1)+'\')'
                            // }
                            let funccheck = eval(func)
                            if (funccheck === 'error') {
                                if (rule.hasOwnProperty('default')) {
                                    item[rule.key] = rule.default
                                }
                            } else {
                                item[rule.key] = funccheck.toString().replace(/'/g, "").replace(/"/g, "")
                            }
                            if (isNaN(funccheck) && typeof(funccheck) != 'string') {
                                item[rule.key] = func.toString().replace(/'/g, "")
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
        }

        onmessage = (e) => {
            if (e.data[0] === "saveToCache") {
                let json = e.data[1];
                let object = e.data[2];
                dmobj = e.data[3];
                json.map(value => {
                    id = value[object.key_attribute]
                    dmobj[object.alias] = {
                        ...dmobj[object.alias],
                        ...{
                            [id]: value
                        }
                    }
                })
                postMessage(["saveToCache", dmobj]);
                return
            }
            dmobj = e.data[4]
            vm.lang = e.data[5]
            let data
            try {
                data = configRule(e.data[0], e.data[1], e.data[2], e.data[3])                  
            } catch (error) {
                data = e.data[0]
            }
            postMessage(["configrule", data]);
        }

        function jsonPath(obj, expr, arg) {
            var P = {
                resultType: arg && arg.resultType || "VALUE",
                result: [],
                normalize: function(expr) {
                    var subx = [];
                    return expr.replace(/[\['](\??\(.*?\))[\]']/g, function($0, $1) {
                            return "[#" + (subx.push($1) - 1) + "]";
                        })
                        .replace(/'?\.'?|\['?/g, ";")
                        .replace(/;;;|;;/g, ";..;")
                        .replace(/;$|'?\]|'$/g, "")
                        .replace(/#([0-9]+)/g, function($0, $1) {
                            return subx[$1];
                        });
                },
                asPath: function(path) {
                    var x = path.split(";"),
                        p = "$";
                    for (var i = 1, n = x.length; i < n; i++)
                        p += /^[0-9*]+$/.test(x[i]) ? ("[" + x[i] + "]") : ("['" + x[i] + "']");
                    return p;
                },
                store: function(p, v) {
                    if (p) P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v;
                    return !!p;
                },
                trace: function(expr, val, path) {
                    if (expr) {
                        var x = expr.split(";"),
                            loc = x.shift();
                        x = x.join(";");
                        if (val && val.hasOwnProperty(loc))
                            P.trace(x, val[loc], path + ";" + loc);
                        else if (loc === "*")
                            P.walk(loc, x, val, path, function(m, l, x, v, p) {
                                P.trace(m + ";" + x, v, p);
                            });
                        else if (loc === "..") {
                            P.trace(x, val, path);
                            P.walk(loc, x, val, path, function(m, l, x, v, p) {
                                typeof v[m] === "object" && P.trace("..;" + x, v[m], p + ";" + m);
                            });
                        } else if (/,/.test(loc)) { // [name1,name2,...]
                            for (var s = loc.split(/'?,'?/), i = 0, n = s.length; i < n; i++)
                                P.trace(s[i] + ";" + x, val, path);
                        } else if (/^\(.*?\)$/.test(loc)) // [(expr)]
                            P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";") + 1)) + ";" + x, val, path);
                        else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
                            P.walk(loc, x, val, path, function(m, l, x, v, p) {
                                if (P.eval(l.replace(/^\?\((.*?)\)$/, "$1"), v[m], m)) P.trace(m + ";" + x, v, p);
                            });
                        else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
                            P.slice(loc, x, val, path);
                    } else
                        P.store(path, val);
                },
                walk: function(loc, expr, val, path, f) {
                    if (val instanceof Array) {
                        for (var i = 0, n = val.length; i < n; i++)
                            if (i in val)
                                f(i, loc, expr, val, path);
                    } else if (typeof val === "object") {
                        for (var m in val)
                            if (val.hasOwnProperty(m))
                                f(m, loc, expr, val, path);
                    }
                },
                slice: function(loc, expr, val, path) {
                    if (val instanceof Array) {
                        var len = val.length,
                            start = 0,
                            end = len,
                            step = 1;
                        loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function($0, $1, $2, $3) {
                            start = parseInt($1 || start);
                            end = parseInt($2 || end);
                            step = parseInt($3 || step);
                        });
                        start = (start < 0) ? Math.max(0, start + len) : Math.min(len, start);
                        end = (end < 0) ? Math.max(0, end + len) : Math.min(len, end);
                        for (var i = start; i < end; i += step)
                            P.trace(i + ";" + expr, val, path);
                    }
                },
                eval: function(x, _v, _vname) {
                    try {
                        return $ && _v && eval(x.replace(/@/g, "_v"));
                    } catch (e) {
                        throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/@/g, "_v").replace(/\^/g, "_a"));
                    }
                }
            };

            var $ = obj;
            if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) {
                P.trace(P.normalize(expr).replace(/^\$;/, ""), obj, "$");
                return P.result.length ? P.result : false;
            }
        }

        function getDataDmobj(itemJSONString) {
            if (itemJSONString.indexOf('[\"${getdata_dmobj') > -1) {
                itemJSONString = itemJSONString.replace(/\[\"\${getdata_dmobj(.*?)}/g, function(match, capture) {
                    let temp = capture.match(/,(.*),/)[0]
                    if (/^((?!('|\")).)*$/.test(temp)) {
                        capture = capture.replace(/,(.*),/g, ',"$1",')
                    }
                    let func = 'getdata_dmobj' + capture.replace(/\\"/g, '"')
                    let result = ""
                    try {
                        result = eval(func)
                        if (result.constructor === Array) {
                            let temarray = result.toString().split(',').map(x => "\"" + x + "\"").toString();
                            result = temarray.substr(1, temarray.length - 2)
                            return '[\"' + result;
                        }
                    } catch (error) {}
                    return '[\"' + result;
                })
            }
            if (itemJSONString.indexOf('[\\\"${getdata_dmobj') > -1) {
                itemJSONString = itemJSONString.replace(/\[\\\"\${getdata_dmobj(.*?)}/g, function(match, capture) {
                    let temp = capture.match(/,(.*),/)[0]
                    if (/^((?!('|\")).)*$/.test(temp)) {
                        capture = capture.replace(/,(.*),/g, ',"$1",')
                    }
                    let func = 'getdata_dmobj' + capture.replace(/\\"/g, '"')
                    let result = ""
                    try {
                        result = eval(func)
                        if (result.constructor === Array) {
                            let temarray = result.toString().split(',').map(x => "\\\"" + x + "\\\"").toString();
                            result = temarray.substr(2, temarray.length - 4)
                            return '[\\\"' + result;
                        }
                    } catch (error) {}
                    return '[\\\"' + result;
                })
            }
            itemJSONString = itemJSONString.replace(/\${getdata_dmobj(.*?)}/g, function(match, capture) {
                let temp = capture.match(/,(.*),/)[0]
                if (/^((?!('|\")).)*$/.test(temp)) {
                    capture = capture.replace(/,(.*),/g, ',"$1",')
                }
                let func = 'getdata_dmobj' + capture.replace(/\\"/g, '"')
                let result = ""
                try {
                    result = eval(func)
                } catch (error) {}
                return result;
            })
            return itemJSONString
        }

        function getdata_dmobj(alias = "", id = "", attribute = "") {
            if (dmobj.hasOwnProperty(alias)) {
                if (dmobj[alias].hasOwnProperty(id)) {
                    if (dmobj[alias][id].hasOwnProperty(attribute)) {
                        return dmobj[alias][id][attribute]
                    } else {
                        return ""
                    }
                } else {
                    return ""
                }
            } else {
                return ""
            }
        }
        function matches(regex, arg)
            {
                //matches all arg with regex. Ex: matches("[0-9]+","13123") -> true
                let matches = arg.match(new RegExp( regex, 'g' ));
                if(matches && matches[0] == arg){
                    return  true;
                }
                return false;
            }
            function hash(s) {
                /* Simple hash function. */
                var a = 1, c = 0, h, o;
                if (s) {
                    a = 0;
                    /*jshint plusplus:false bitwise:false*/
                    for (h = s.length - 1; h >= 0; h--) {
                        o = s.charCodeAt(h);
                        a = (a<<6&268435455) + o + (o<<14);
                        c = a & 266338304;
                        a = c!==0?a^c>>21:a;
                    }
                }
                return String(a);
            }
            function number(number){
                if(number===''){return 'error';}
                var num = Number(number);
                if(isNaN(num)) {return 'error';}
                return num;
            }
            function boolean(arg){
                if(arg === '' || typeof(arg) === 'string') return false;
                var boo = Boolean(arg);
                return boo;
            }
            function eq(var1,var2){
                if(typeof(var1) !== typeof(var2)){
                    if(var1==var2 && (var1!=='' || var2!=='')){
                        return false;
                    }
                    // else{
                    //     return false
                    // }
                    return "error";
                }
                if(var1 === var2){
                    return true;
                }
                else{
                    return false;
                }
            }
            function replace(arg1,regex,arg2){
            //   arg1 = arg1.replace(eval('/'+regex+'/g'),arg2);
                arg1 = arg1.replace(new RegExp(regex,'g'),arg2)
                return arg1;
        }

            function isEmpty(arg){
                if(arg.length > 0){
                    return true;
                }
                else{
                    return false;
                }
            }
            function is_number(arg){        
                if(!isNaN(arg) && arg!==''){
                    return true;
                }
                else{
                    return false;
                }
            }
            function gt(arg1,arg2){
                if(arg1==='' || arg2==='' || isNaN(arg1) || isNaN(arg2)) return "error";
                // if(typeof(arg1) === 'string' || typeof(arg2) === 'string') return false;
                if(Number(arg1) > Number(arg2)){
                    return true;
                }
                else{
                    return false;
                }
            }
            function lt(arg1,arg2){
                if(arg1==='' || arg2==='' || isNaN(arg1) || isNaN(arg2)) return "error";
                // if(typeof(arg1) === 'string' || typeof(arg2) === 'string') return false;
                if(Number(arg1) < Number(arg2)){
                    return true;
                }
                else{
                    return false;
                }
            }
            function sum() {
                var i;
                var sum = 0;
                for(i = 0; i < arguments.length; i++) {
                    if((isNaN(arguments[i]) && arguments[i]!=='') ||arguments[i]===''){ return 'error';}
                    sum += Number(arguments[i]);
                }
                return sum;
            }
            function is_empty(){
                if(arguments[0] != undefined && arguments[0].toString().length > 0){
                    return false;
                }
                else{
                    return true;
                }
                
            }
            function avg() {
                var i;
                var sum = 0;
                for(i = 0; i < arguments.length; i++) {
                    if((isNaN(arguments[i]) && arguments[i]!=='') ||arguments[i]===''){ return 'error';}
                    sum += Number(arguments[i]);
                }
                var avg = sum / arguments.length;
                return avg;
            }
            function min() {
                var arr = [];
                for(var i = 0; i < arguments.length; i++) {
                    if((isNaN(arguments[i]) && arguments[i]!=='') ||arguments[i]===''){ return 'error';}
                    arr.push(Number(arguments[i]))
                }
                var min = Math.min.apply (Math, arr)
                return min;
            }
            function multiple() {
                var multi = 1;
                for(var i = 0; i < arguments.length; i++) {
                    if((isNaN(arguments[i]) && arguments[i]!=='') ||arguments[i]===''){ return 'error';}
                    multi*=Number(arguments[i])
                }
                return multi;
            }
            function max() {
                var arr = [];
                for(var i = 0; i < arguments.length; i++) {
                    if((isNaN(arguments[i]) && arguments[i]!=='') ||arguments[i]===''){ return 'error';}
                    arr.push(Number(arguments[i]))
                }
                var max = Math.max.apply (Math, arr)
                return max;
            }
            function and(){
                var boo = 0;
                for(var i = 0; i < arguments.length; i++) {
                    if(arguments[i] == false || arguments[i]!=true){
                        boo = 1;
                    }
                }
                if(boo == 0){
                    return true;
                }
                else{
                    return false;
                }
                
            }
            function or(){
                var boo = 0;
                for(var i = 0; i < arguments.length; i++) {
                    if(arguments[i] == true){
                        boo = 1;
                    }
                }
                if(boo == 1){
                    return true;
                }
                else{
                    return false;
                }
                
            }
            function abs(arg){
                if((isNaN(arg) && arg!=='') || arg==='' || arg===-'') return 'error';
                return Math.abs(arg);
            }
            function number_format(format, arg1){
                if(format==='' || format===null || format==='null') return 'error';
                let value = new DecimalFormat(arg1).format(format)
                return value;
            }
            function string_format(){
                let string = arguments[0];
                let index = 0;
                let temp = arguments
                string = string.replace(/%S|%s/g, function(matched){
                    index+=1;
                    return matched === '%S' ? temp[index].toUpperCase() : temp[index];
                })
                return string;
            }
            function guest_mode(){
                return false;
            }
            function str_which(){
                let string = arguments[0];
                let pattern = arguments[1];
                let regex = eval('/'+pattern+'/g')
                return regex.test(string)
            }
            function str_count(){
                let string = arguments[0];
                let pattern = arguments[1]; 
                let regex = eval('/'+pattern+'/g')
                let splitChart= string.match(regex)
                let a = 0
                if(splitChart){
                    return (splitChart.length).toFixed(1);
                } else return a.toFixed(1)
            }
            function str_sub(){
                let string = arguments[0];
                let string_temp = arguments.length == 3 ? 
                    string.substring(arguments[1],arguments[2]+1) : 
                        string.substr(arguments[1])
                return string_temp
            }
            function str_extract(){
                let string = arguments[0];
                let pattern = arguments[1]; 
                let found = string.match(pattern);
                let string_temp =""
                if(found){
                    string_temp = arguments.length == 3 ? found[arguments[2]] : found[0]
                }
                return string_temp ? string_temp : ""
            }
            function str_length(){
                let string = arguments[0];
                return string.length.toFixed(1)
            }
            function str_trim(){
                let string = arguments[0];
                let side = arguments[1]
                switch (side) {
                    case "left":
                        string = string.trimStart()
                        break;
                    case "right":
                        string = string.trimEnd()
                    break;
                    default:
                        string = string.trim()
                        break;
                }
                return string
            }
            function str_to_lower(){
                let string = arguments[0];
                return string.toLowerCase() 
            }
            function str_to_upper(){
                let string = arguments[0];
                return string.toUpperCase() 
            }
            function str_locate (){
                let string = arguments[0];
                let pattern = arguments[1]; 
                let regex = eval('/'+pattern+'/g')
                let locate = string.search(regex)
                if(locate >=0){
                    return locate.toFixed(1)
                }
                return ""
                // let a = 0
                // return a.toFixed(1)
            }

            function module_exists(code){
                if(vm.modules.hasOwnProperty(code)){
                    return true;
                }else{
                    return false;
                }
            }

            function module_granted(code){
                if(vm.modules.hasOwnProperty(code) && vm.modules[code].hasOwnProperty('power_needed') && parseInt(vm.module_power[code]) >= parseInt(vm.modules[code].power_needed)){
                    return true;
                }else if(vm.modules.hasOwnProperty(code) && !vm.modules[code].hasOwnProperty('power_needed')){
                    return true;
                }else{
                    return false;
                }
            }

            function now(){
                return (new Date()).getTime();
            }

            function convertTimestampToISO8601(timestamp) {
                const date = new Date(Number(timestamp));
                const year = date.getFullYear();
                const month = ("0" + (date.getMonth() + 1)).slice(-2);
                const day = ("0" + date.getDate()).slice(-2);
                const hours = ("0" + date.getHours()).slice(-2);
                const minutes = ("0" + date.getMinutes()).slice(-2);
                const seconds = ("0" + date.getSeconds()).slice(-2);
                const milliseconds = ("00" + date.getMilliseconds()).slice(-3);
                const offsetHours = -Math.floor(date.getTimezoneOffset() / 60);
                const offsetMinutes = date.getTimezoneOffset() % 60;
                const offsetSign = offsetHours >= 0 ? "+" : "-";
                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetSign}${("0" + Math.abs(offsetHours)).slice(-2)}:${("0" + offsetMinutes).slice(-2)}`;
            }

            function time_format(unixtime, format="") {
                if(format===""){
                    return convertTimestampToISO8601(unixtime)
                }
                var dateO = new Date(Number(unixtime)),
                    date = dateO,
                    result = format.toString(),
                    intPad = function(num, l) {
                        var str = num.toString(),
                            zeros = l - str.length;
                        for (var j = 0; j < zeros; j++) {
                        str = '0' + str;
                        }
                        return str;
                    },
                    props;

                if (isNaN(date.getTime())) {
                    return date.toString();
                }

                props = {
                    'Y': date.getFullYear(),
                    'y': date.getFullYear().toString().substring(2, 4),
                    'm': intPad((date.getMonth() + 1), 2),
                    'n': date.getMonth() + 1,
                    'b': vm.lang === "en" ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()] : ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"][date.getMonth()],
                    'd': intPad(date.getDate(), 2),
                    'e': date.getDate(),
                    'H': intPad(date.getHours(), 2),
                    'h': date.getHours(),
                    'M': intPad(date.getMinutes(), 2),
                    'S': intPad(date.getSeconds(), 2),
                    '3': intPad(date.getMilliseconds(), 3),
                    'a': vm.lang === "en" ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()] : ["CN", "T.2", "T.3", "T.4", "T.5", "T.6", "T.7"][date.getDay()]
                };

                for (var prop in props) {
                    result = result.replace('%' + prop, props[prop]);
                }

                return result;
            }

            function str_to_time(timestring){
                return (new Date(timestring)).getTime();
            }
            
            function difftime(time1, time2, format){
                if(/^\d{13}$/.test(time1)){
                    time1 = Number(time1)
                }
                if(/^\d{13}$/.test(time2)){
                    time2 = Number(time2)
                }
                const date1 = new Date(time1);
                const date2 = new Date(time2);

                let diff = Math.abs(date1 - date2);

                switch (format) {
                
                    case "secs":
                        diff = diff/1000;
                        break;

                    case "mins":
                        diff = diff/60000;
                        break;

                    case "hours":
                        diff = diff/3600000;
                        break;

                    case "auto":
                    case "days":
                        diff = diff/86400000;
                        break;

                    case "weeks":
                        diff = diff/604800000;
                        break;

                    default:
                        return "Invalid format";
                }
                diff = diff.toFixed(2)
                if(format == "auto"){
                    let day = vm.lang === "en" ? " days" : " ngÃ y"
                    diff = diff+day
                }
                return diff
            }

            function call_function_base64(function_base64){
                return eval(window.atob(function_base64))
            }

            function encode_url(data){
                return encodeURIComponent(data)
            }
            
            function escape_json(data){
                return JSON.stringify(data).slice(1,-1)
            }

            function decode_base64(data){
                return window.atob(data)
            }

            function unescape_json(data){
                data = data.replace(/\\\\/g, "\\")
                        .replace(/\\\\n/g, "\\n")
                    .replace(/\\\\'/g, "\\'")
                    .replace(/\\\\"/g, '\\"')
                    .replace(/\\\\&/g, "\\&")
                    .replace(/\\\\r/g, "\\r")
                    .replace(/\\\\t/g, "\\t")
                    .replace(/\\\\b/g, "\\b")
                    .replace(/\\\\f/g, "\\f");
                return data
            }

            function if_else(bool, valueTrue="", valueFalse=""){
                return bool ? valueTrue : valueFalse
            }
            function randomnanoid(t=21){
                t = t > 50 ? 50 : t
                t = t === 0 ? 21 : t
                return crypto.getRandomValues(new Uint8Array(t)).reduce(((t,e)=>t+=(e&=63)<36?e.toString(36):e<62?(e-26).toString(36).toUpperCase():e>62?"-":"_"),"");
            }

            function div(a, b) {
                return a / b;
            }
            function DecimalFormat(formatStr)
                {
                    this.prefix = '';
                    this.suffix = '';
                    this.comma = 0;
                    this.minInt = 1;
                    this.minFrac = 0;
                    this.maxFrac = 0;
                    
                    // get prefix
                    for (var i=0; i<formatStr.length; i++) {
                        if (formatStr.charAt(i) == '#' || formatStr.charAt(i) == '0') {
                            this.prefix = formatStr.substring(0,i);
                            formatStr = formatStr.substring(i);
                            break;
                        }
                    }
                    
                    // get suffix
                    this.suffix = formatStr.replace(/[#]|[0]|[,]|[.]/g , '');

                    // get number as string
                    var numberStr = formatStr.replace(/[^0#,.]/g , '');
                    
                    var intStr = '';
                    var fracStr = '';
                    var point = numberStr.indexOf('.');
                    if (point != -1) {
                        intStr = numberStr.substring(0,point);
                        fracStr = numberStr.substring(point+1);
                    }
                    else {
                        intStr = numberStr;
                    }
                    
                    var commaPos = intStr.lastIndexOf(',');
                    if (commaPos != -1) {
                        this.comma = intStr.length - 1 - commaPos;
                    }
                    
                    intStr = intStr.replace(/[,]/g , ''); // remove commas

                    fracStr = fracStr.replace(/[,]|[.]+/g , '');

                    this.maxFrac = fracStr.length;
                    var tmp = intStr.replace(/[^0]/g , ''); // remove all except zero
                    if (tmp.length > this.minInt)
                    this.minInt = tmp.length;
                    tmp = fracStr.replace(/[^0]/g , '');
                    this.minFrac = tmp.length;
                }
            
                DecimalFormat.prototype.format = function(numStr) { // 1223.06 --> $1,223.06
                    // remove prefix, suffix and commas
                    var numberStr = this.formatBack(numStr).toLowerCase();
                    
                    // do not format if not a number
                    if (isNaN(numberStr) || numberStr.length == 0)
                    return numStr;
                    
                    //scientific numbers
                    if (i = numberStr.indexOf("e") != -1) {
                    var n = Number(numberStr);
                    if (n=="Infinity" || n=="-Infinity") return numberStr;
                    numberStr = n+"";
                    if(numberStr.indexOf('e') != -1) return numberStr;
                    }

                    var negative = false;
                    // remove sign
                    if (numberStr.charAt(0) == '-') {
                    negative = true;
                    numberStr = numberStr.substring(1);
                    }
                    else if (numberStr.charAt(0) == '+') {
                    numberStr = numberStr.substring(1);
                    }

                    var point = numberStr.indexOf('.'); // position of point character
                    var intStr = '';
                    var fracStr = '';
                    if (point != -1) {
                        intStr = numberStr.substring(0,point);
                        fracStr = numberStr.substring(point+1);
                    }
                    else {
                        intStr = numberStr;
                    }
                    fracStr = fracStr.replace(/[.]/ , ''); // remove other point characters
                    
                    var isPercentage = this.suffix && this.suffix.charAt(0) === '%';
                    // if percentage, number will be multiplied by 100.
                    var minInt = this.minInt, minFrac = this.minFrac, maxFrac = this.maxFrac;
                    if (isPercentage) {
                    minInt -= 2;
                    minFrac += 2;
                    maxFrac += 2;
                    }
                    
                    if (fracStr.length > maxFrac) { // round
                        //case 6143
                        var num = new Number('0.' + fracStr);
                        num = (maxFrac == 0)? Math.round(num) : num.toFixed(maxFrac);
                        // toFixed method has bugs on IE (0.7 --> 0)
                        fracStr = num.toString(10).substr(2);
                        var c = (num>=1)? 1:0; //carry
                        var x, i=intStr.length-1;
                        while (c) { //increment intStr
                        if (i==-1) {
                            intStr = '1'+intStr;
                            break;
                        }
                        else {
                            x = intStr.charAt(i);
                            if (x==9) {x='0'; c=1;}
                            else {x = (++x)+''; c=0;}
                            intStr = intStr.substring(0,i) + x + intStr.substring(i+1,intStr.length);
                            i--;
                        }
                        }
                    }
                    for (var i=fracStr.length; i<minFrac; i++) { // if minFrac=4 then 1.12 --> 1.1200
                        fracStr = fracStr + '0';
                    }
                    while (fracStr.length > minFrac && fracStr.charAt(fracStr.length-1) == '0') { // if minInt=4 then 00034 --> 0034)
                        fracStr = fracStr.substring(0,fracStr.length-1);
                    }
                    
                    for (var i=intStr.length; i<minInt; i++) { // if minInt=4 then 034 --> 0034
                        intStr = '0' + intStr;
                    }
                    while (intStr.length > minInt && intStr.charAt(0) == '0') { // if minInt=4 then 00034 --> 0034)
                        intStr = intStr.substring(1);
                    }
                    
                    if (isPercentage) { // multiply by 100
                    intStr += fracStr.substring(0,2);
                    fracStr = fracStr.substring(2);
                    }
                    
                    var j = 0;
                    for(var i=intStr.length; i>0; i--) { // add commas
                        if (j != 0 && j%this.comma == 0) {
                            intStr = intStr.substring(0,i) + ',' + intStr.substring(i);
                            j = 0;
                        }
                        j++;
                    }

                    var formattedValue;
                    if (fracStr.length > 0)
                        formattedValue = this.prefix + intStr + '.' + fracStr + this.suffix;
                    else
                        formattedValue = this.prefix + intStr + this.suffix;
                        
                    if (negative) {
                        formattedValue = '-' + formattedValue;
                    }
                    
                    return formattedValue;
                }
                DecimalFormat.prototype.formatBack = function(fNumStr) { // $1,223.06 --> 1223.06
                fNumStr += ''; //ensure it is string
                if (!fNumStr) return ''; //do not return undefined or null
                if (!isNaN(fNumStr)) return this.getNumericString(fNumStr);
                var fNumberStr = fNumStr;
                var negative = false;
                if (fNumStr.charAt(0) == '-') {
                    fNumberStr = fNumberStr.substr(1);
                    negative = true;
                }
                var pIndex = fNumberStr.indexOf(this.prefix);
                var sIndex = (this.suffix == '')? fNumberStr.length : fNumberStr.indexOf(this.suffix, this.prefix.length+1);
                if (pIndex == 0 && sIndex > 0) {
                    // remove suffix
                    fNumberStr = fNumberStr.substr(0,sIndex);
                    // remove prefix
                    fNumberStr = fNumberStr.substr(this.prefix.length);
                    // remove commas
                    fNumberStr = fNumberStr.replace(/,/g , '');
                    if (negative)
                    fNumberStr = '-' + fNumberStr;
                    if (!isNaN(fNumberStr))
                    return this.getNumericString(fNumberStr);
                }
                return fNumStr;
                }
                DecimalFormat.prototype.getNumericString = function(str){
                    //first convert to number
                    var num = new Number(str);
                    //check if there is a missing dot
                    var numStr = num + '';
                    if (str.indexOf('.')>-1 && numStr.indexOf('.')<0){
                        //check if original string has all zeros after dot or not
                        for (var i=str.indexOf('.')+1;i<str.length;i++){
                            //if not, this means we lost precision
                            if (str.charAt(i) !== '0') return str;
                        }
                        return numStr;
                    }
                    return str;
                }
    }.toString() + ")()";

    // Tạo tệp worker từ chuỗi
    var blob = new Blob([codeString], { type: "application/javascript" });
    var workerURL = URL.createObjectURL(blob)
</script>
