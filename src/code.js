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
    }
  }
  