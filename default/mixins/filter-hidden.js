const filterHidden = {
    methods: {
        filterHiddenModules:function(modules){
            let index = 0;
            for(let code in modules){
                if(modules.hasOwnProperty(code)){
                    let module = modules[code];
                    module.filtered_index = index;
                    if( (!module.hasOwnProperty("power_needed")) || (!this.module_power.hasOwnProperty(module.code)) || (parseInt(this.module_power[module.code]) >= parseInt(module.power_needed))){
                        if(module.hasOwnProperty("functionCode") && (module.functionCode === 'SM_CLOUDPHONE' || module.functionCode === 'SM_RTMESSAGING' || module.functionCode === 'SM_EXIT' || module.functionCode === 'SM_HOMEVIEW' || module.functionCode === 'SM_UTILITIES' || module.functionCode === 'SM_BCARDS' || module.functionCode === 'SM_MCARDS')){
                            module.filtered_visible = false;
                        }else{
                            index++;
                            module.filtered_visible = true;
                            if(typeof this.stateHome !== "undefined"){
                                this.stateHome = "none"
                            }
                        }  
                    }else if((parseInt(this.module_power[module.code]) < parseInt(module.power_needed))){
                        if(module.unavailable_behavior == 'hide'){
                            module.filtered_visible = false;
                        }else if(module.unavailable_behavior == 'disable'){
                            index++;
                            module.filtered_visible = true;
                            module.not_power = true;
                            if(typeof this.stateHome !== "undefined"){
                                this.stateHome = "none"
                            }
                        }
                    }
                }
            }
            return modules;
        },

        filterHiddenSubmodules:function(submodules){
            var arr = [];
            for (var prop in submodules) {
                if (submodules.hasOwnProperty(prop)) {
                    var obj = {};
                    obj[prop] = submodules[prop];
                    obj.tempSortName = String(submodules[prop]['title']).toLowerCase();
                    arr.push(obj);
                }
            }

            arr.sort(function(a, b) {
                var at = a.tempSortName,
                    bt = b.tempSortName;
                return at > bt ? 1 : ( at < bt ? -1 : 0 );
            });

            var result = [];
            for (var i=0, l=arr.length; i<l; i++) {
                var obj = arr[i];
                delete obj.tempSortName;
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        var id = prop;
                    }
                }
                var item = obj[id];
                result.push(item);
            }
            submodules = {};
            result.forEach(element => {
               submodules[element.code] = element 
            });      
            let index = 0;
            let check = 0;
            let codesub;
            for(let code in submodules){
                if(submodules.hasOwnProperty(code)){
                    let submodule = submodules[code];
                    submodule.filtered_index = index;
                    index++;
                    if( (!submodule.hasOwnProperty("power_needed")) || (!this.module_power.hasOwnProperty(submodule.moduleCode)) || (parseInt(this.module_power[submodule.moduleCode]) >= parseInt(submodule.power_needed))){
                        submodule.filtered_visible = true;
                        check += 1;
                        codesub=submodule.code
                    }else if((parseInt(this.module_power[submodule.moduleCode]) < parseInt(submodule.power_needed))){
                        if(submodule.unavailable_behavior == 'hide'){
                            submodule.filtered_visible = false;
                        }else if(submodule.unavailable_behavior == 'disable'){
                            submodule.filtered_visible = true;
                            submodule.not_power = true;
                        }
                    }
                }
            }
            if(check === 1){
                submodules[codesub].showTab = true;
            }
            return submodules;
        },

        filterHiddenComponents:function(components){
            var arr = [];
            for (var prop in components) {
                if (components.hasOwnProperty(prop) && components[prop].hasOwnProperty('name') ) {
                    var obj = {};
                    obj[prop] = components[prop];
                    if(components[prop].name != null){
                        obj.tempSortName = components[prop]['name'].toLowerCase();
                    }
                    arr.push(obj);
                }
            }

            arr.sort(function(a, b) {
                var at = a.tempSortName!=="" && !(/\d/.test(a.tempSortName.split(" ")[0]))?a.tempSortName.match(/\b(\w)/g).join(' '):a.tempSortName,
                    bt = b.tempSortName!=="" && !(/\d/.test(b.tempSortName.split(" ")[0]))?b.tempSortName.match(/\b(\w)/g).join(' '):b.tempSortName;
                    if((/\d/.test(at.split(" ")[0])) && (/\d/.test(bt.split(" ")[0]))){
                        return parseFloat(at) > parseFloat(bt) ? 1 : ( parseFloat(at) < parseFloat(bt) ? -1 : 0 );
                    }else{
                        return at > bt ? 1 : ( at < bt ? -1 : 0 );
                    }
                
            });
            var result = [];
            let check = [];
            for (var i=0, l=arr.length; i<l; i++) {
                var obj = arr[i];
                delete obj.tempSortName;
                for (var prop in obj) {
                    if (obj.hasOwnProperty(prop)) {
                        var id = prop;
                    }
                }
                var item = obj[id];
                result.push(item);
            }
            if(result.length > 1){
                components = {};
                result.forEach(element => {
                    if(String(element?.visible).indexOf('##')>-1){
                        element.visible_tem = vm.aggregateFunction('${'+element.visible+'}',[])
                    }else if(element.visible){
                            try {
                                element.visible_tem = eval(element.visible)
                            } catch (error) {
                                element.visible_tem = false
                            }
                        }
                    if(element.hasOwnProperty('name') && element.name!=null && (!element.hasOwnProperty('isFirst') || !element.hasOwnProperty('filtered_visible')) && (!element.hasOwnProperty('visible') || String(element?.visible_tem)=='true')){
                        if(check.length===0){
                            element.isFirst=true;
                            check=check.concat(element.subModuleCode);
                        }else{
                            if(check.indexOf(element.subModuleCode)>-1 || element.is_header === 1){
                                element.isFirst=false;
                            }else{
                                element.isFirst=true;
                                check=check.concat(element.subModuleCode);
                            }
                        }
                    }
                    components[element.code] = element
                });
            }
            check = [];
            let index = 0;
            let isFirst = false;

            for(let code in components){
                if(components.hasOwnProperty(code)){
                    let component = components[code];
                    component.filtered_index = index;
                    if(vm.componentABactive != false){
                        delete component.isFirst;
                    }
                    if(vm.componentABactive == component.code){
                        component.isFirst = true;
                    }
                    if( (!component.hasOwnProperty("power_needed")) ||  (!this.module_power.hasOwnProperty(component.moduleCode)) || (parseInt(this.module_power[component.moduleCode]) >= parseInt(component.power_needed)) ){
                        index++;
                        component.filtered_visible = true;
                        if(check.indexOf(component.subModuleCode)>-1 && vm.componentABactive == false && (!component.hasOwnProperty('is_header') || (component.hasOwnProperty('is_header') && component.is_header!==1))){
                            component.isFirst = true;
                            check.splice(check.indexOf(component.subModuleCode), 1)
                        }
                        if(component.hasOwnProperty('visible_tem') && String(component?.visible_tem)!='true'){
                            component.filtered_visible = false;
                            component.isFirst = false;
                        }
                    }else if((parseInt(this.module_power[component.moduleCode]) < parseInt(component.power_needed))){
                        if(component.unavailable_behavior == 'hide'){
                            component.filtered_visible = false;
                            if(component.isFirst){
                                check = check.concat(component.subModuleCode);
                                component.isFirst = false;
                            }
                        }else if(component.unavailable_behavior == 'disable'){
                            component.filtered_visible = true;
                            component.not_power = true;
                            if(check.indexOf(component.subModuleCode)>-1){
                                component.isFirst = true;
                                check.splice(check.indexOf(component.subModuleCode), 1)
                            }
                        }else if(component.hasOwnProperty('visible_tem') && String(component?.visible_tem)!='true'){
                            component.filtered_visible = false;
                        }
                    }
                }
            }
            return components;
        },
        filterHiddenObjects:function(objects){

            let index = 0;
            for(let code in objects){
                if(objects.hasOwnProperty(code)){
                    let object = objects[code];
                    object.filtered_index = index;
                    if( (!object.hasOwnProperty("power_needed")) || (!this.module_power.hasOwnProperty(object.moduleCode)) || (parseInt(this.module_power[object.moduleCode]) >= parseInt(object.power_needed))){
                        index++;
                        object.filtered_visible = true;
                        if(String(object?.visible).indexOf('##')>-1){
                            object.visible_tem = vm.aggregateFunction('${'+object.visible+'}',[])
                        }else if(object.visible){
                            try {
                                object.visible_tem = eval(object.visible)
                            } catch (error) {
                                object.visible_tem = false
                            }
                        }
                        if(object.hasOwnProperty('visible_tem') && String(object?.visible_tem)!='true'){
                            object.filtered_visible = false;
                        }
                    }else if((parseInt(this.module_power[object.moduleCode]) < parseInt(object.power_needed))){
                        if(object.unavailable_behavior == 'hide'){
                            object.filtered_visible = false;
                        }else if(object.unavailable_behavior == 'disable'){
                            index++;
                            object.filtered_visible = true;
                            object.not_power = true;
                            this.components[object.componentCode].one_object_notpower = true;
                        }else if(object.hasOwnProperty('visible_tem') && String(object?.visible_tem)!='true'){
                            object.filtered_visible = false;
                        }
                    }
                }
            }
            return objects;
        },
    }
  }