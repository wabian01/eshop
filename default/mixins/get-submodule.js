const getSubModules = {
    methods: {
        getSubModules: function(moduleCode) {
            var modules = this.modules;
            var subModules = {};
            let that=this;
            Object.keys(modules).forEach(function(key) {
                if (key == moduleCode){
                    subModules = modules[key].subModules; 
                }
            });
            return subModules;
        },
        getAllComponents: function(moduleCode) {
            var modules = this.modules;
            var components = {};
            Object.keys(modules).forEach(function(key) {
                if (key == moduleCode) {
                    var subModules = modules[key].subModules;
                    Object.keys(subModules).forEach(function(key1){
                        var tmp_components = subModules[key1].components;
                        Object.keys(tmp_components).forEach(function(key2, value){
                            components[key2] = tmp_components[key2];
                        });
                    });
                }
            });
            return components;
        },
        getAllObjects: function(moduleCode) {
            var components = this.getAllComponents(moduleCode);
            var objects = {};
            Object.keys(components).forEach(function(key) {
                var tmp_objects = components[key].objects;
                Object.keys(tmp_objects).forEach(function(key2){
                    objects[key2] = tmp_objects[key2];
                });
            });
            return objects;
        },
        processModules(that, data) {
            let oldModules = []
            let newModules = []

            if(typeof that.modules == "object" && Object.keys(that.modules).length > 0){
                for (let moduleCode in that.modules) {
                    if (!data.modules.hasOwnProperty(moduleCode)) {
                        oldModules.push(moduleCode)
                        continue
                    }
                    if(!that.modules[moduleCode].hasOwnProperty("sync_date")){
                        newModules.push(moduleCode)
                    }else{
                        if(that.modules[moduleCode].sync_date < data.modules[moduleCode].sync_date){
                            newModules.push(moduleCode)
                        }
                    }
                }
            }else{
                that.modules = {}
            }

            for (let moduleCode in data.modules) {
                if (!that.modules.hasOwnProperty(moduleCode)) {
                    newModules.push(moduleCode)
                }
            }
            

            that.moduleList.oldModules = oldModules
            that.moduleList.newModules = newModules

            that.removeModules()
        },
    }
  }