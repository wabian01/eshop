const handleLocalForage = {
    methods: {
        loadCacheModules: async function () {
            const module_power = await this.getFromCache(module_power_view);
            this.module_power = module_power;
            const modules = await this.getFromCache(module_view);
            this.modules = modules;
            
        },
        saveToCache: async function(key,value){
            if ( typeof(Storage) !== 'undefined') {
                await localforage.setItem(key,JSON.stringify(value))
            } else {
                console.log('Your browser does not support localStorage');
            }
        },
        getFromCache: async function(key){
            if ( typeof(Storage) !== 'undefined') {
                const value = await localforage.getItem(key)
                return JSON.parse(value?value:'{}');
            } else {
                console.log('Your browser does not support localStorage');
            }
            return {};
        },
        openMultiObjectAB:function(object){
            vm.openTask(object,"tabs", "center|start","center|start",null,object.objectwhere,object.objectpost,object.objectget,[true,object.objecttask],object.objectscreen)
            $('#multiObject').modal('hide');
        },
        removeModules:function () {
            let modules = {...this.modules}
            let module_power = {...this.module_power}
            this.moduleList.oldModules.forEach(code => {    
                if(modules.hasOwnProperty(code)){
                    delete modules[code]
                }
                if(module_power.hasOwnProperty(code)){
                    delete module_power[code]
                }
            })
            this.modules = modules
            this.module_power = module_power
            this.saveToCache(module_view,this.modules);
            this.saveToCache(module_power_view,this.module_power);
        },
        removeModule:function (code) {
            let modules = {...this.modules}
            let module_power = {...this.module_power}
            if(modules.hasOwnProperty(code)){
                delete modules[code]
                this.modules = modules
            }
            if(module_power.hasOwnProperty(code)){
                delete module_power[code]
                this.module_power = module_power
            }
        },
        openInstanceList:function (object) {
            this.activeObjectCode = object.code;
            this.objectLevel=1;
        },
        backToFormList:function () {
            this.activeObjectCode = "";
            this.objectLevel=0;
            this.selectedInstances={};
        },
        showWarningTask:function (message) {
            $('#task-bar-icon-err-'+message.taskCode +' span').css('display','flex')
            toastr.error(translations['Your work cannot be saved!'],'');
        },
    }
  }