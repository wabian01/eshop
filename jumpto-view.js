const jumpToView = {
    methods: {
        jumpToSubmodule:function (code) {
            this.topBarModule=false;
            if(this.modules[code].hasOwnProperty('inner_buttons') && this.modules[code].inner_buttons.length>0){
                this.topBarModule=this.modules[code].inner_buttons;
            }
            this.tabModuleActive=code;
            this.activeModuleCode = code;
            this.listTabs[code] = {level:this.level,type:'jumpToSubmodule', label:this.modules[this.activeModuleCode].title, code:code}
            this.nav_items['module'] = {isActive:true, label:this.modules[this.activeModuleCode].title};
            this.subModules = this.getSubModules(code);
            this.level=1;
        },

        jumpToDetailModule:function (module_code){
            this.activeModuleCode = module_code;
            this.activeDetail = 1;
            this.nav_items['module'] = {isActive: true, label:this.modules[module_code].title};
            this.level = 1;
        },
        jumpToSubmoduleDetail:function (module_code,code) {
            vm.checkOneModule[module_code]=true;
            this.tabModuleActive=module_code;
            this.listTabs[module_code] = {level:this.level, type:'jumpToSubmoduleDetail',typeopen:code , label:this.modules[module_code].title, code:module_code}
            this.subModules = this.getSubModules(module_code);
            this.components = this.getAllComponents(module_code);
            this.objects = this.getAllObjects(module_code);
            this.activeModuleCode = module_code;
            this.activeSubModuleCode = code;
            if(this.activeSubModuleCode == 'all'){
                this.subModules = this.filterHiddenSubmodules(this.subModules);
                this.nav_items['module'] = {isActive:true, label:this.modules[module_code].title};
                this.nav_items['submodule'] = {isActive:true, label:'All Items'};
                this.activeColumn = -1;
                let count_sub = 0;
                Object.keys(this.subModules).map((key,index)=>{
                    if(this.subModules[key].filtered_visible){
                        count_sub += 1;
                    }
                    if(this.subModules[key].quickAccess == 1){
                        this.activeColumn = index;
                    }
                })
                if(count_sub > 1 && this.activeColumn == -1){
                    this.jumpToSubmodule(module_code)
                }else{
                    this.level=2;
                }
            }else{
                this.subModules = this.filterHiddenSubmodules(this.subModules);
                this.nav_items['submodule'] = {isActive:true, label:this.subModules[this.activeSubModuleCode].title};

                var activeColumn = this.subModules[this.activeSubModuleCode].filtered_index;
                this.activeColumn = activeColumn;
                this.level=2;
            }
        },
        jumpToComponent:function (code) {
            this.activeComponentCode = code;
            this.objects = this.getAllObjects(this.activeModuleCode);

        },
        jumpToScreen:function (previousScreenCode,code,item, object="") {
            if(object == "" && this.objects.hasOwnProperty(this.activeObjectCode) && this.objects[this.activeObjectCode].screens.hasOwnProperty(code) && this.activeTaskCode!==""){
                this.activeScreenCode = code;
                this.previousScreenCode = previousScreenCode;
                this.activeItemData = item;
                this.tasks[this.activeTaskCode].title = this.objects[this.activeObjectCode].screens[this.activeScreenCode].title;
                
                var object = this.objects[this.activeObjectCode];
            }else if(object == "" && this.objects.hasOwnProperty(this.activeObjectCode) && this.activeTaskCode!==""){
                this.activeScreenCode = this.objects[this.activeObjectCode].root_screen;
                this.previousScreenCode = previousScreenCode;
                this.activeItemData = item;
                this.tasks[this.activeTaskCode].title = this.objects[this.activeObjectCode].screens[this.activeScreenCode].title;
                var object = this.objects[this.activeObjectCode];
            }else if(object == "" && !this.objects.hasOwnProperty(this.activeObjectCode) && this.activeTaskCode!==""){
                this.activeScreenCode = code;
                this.previousScreenCode = previousScreenCode;
                this.activeItemData = item;
                try {
                    this.tasks[this.activeTaskCode].title = this.tasks[this.activeTaskCode].object.screens[this.activeScreenCode].title;
                    var object = this.tasks[this.activeTaskCode].object;
                } catch (error) {
                    
                }
            }

            for (var screen_code in object.screens) {
                if (object.screens.hasOwnProperty(screen_code)) {
                    if(screen_code==this.activeScreenCode){
                        for (var body_code in object.screens[screen_code]['body_area']) {
                            if (object.screens[screen_code]['body_area'].hasOwnProperty(body_code)) {
                                if((object.screens[screen_code]['body_area'][body_code].type=='listView' || object.screens[screen_code]['body_area'][body_code].type=='gridView') && object.screens[screen_code]['body_area'][body_code].hasOwnProperty('filters')){
                                    for(var f =0;f< object.screens[screen_code]['body_area'][body_code].filters.length;f++){
                                        var filter = object.screens[screen_code]['body_area'][body_code].filters[f];
                                        if(typeof(filter) === 'string' && filter.indexOf('lite_connection')>-1){
                                            let templite = filter;
                                            filter = {}
                                            filter.entries = [templite];
                                            filter.column = 'type2search'
                                        }
                                        filter.code = 'filter-'+makeElemId();
                                        filter.screen_code = screen_code;
                                        let check = true;
                                        if(vm.activeListFilters.length>0){
                                            vm.activeListFilters.map(ft=>{
                                                if(filter.screen_code === ft.screen_code && filter.column === ft.column){
                                                    check = false;
                                                    return;
                                                }
                                            })
                                            if(check){
                                                vm.activeListFilters.push(filter);
                                            }
                                        }else{
                                            vm.activeListFilters.push(filter);
                                        }
                                    }
                                }
                                else if(object.screens[screen_code]['body_area'][body_code].type=='tableView' && object.screens[screen_code]['body_area'][body_code].attributes.hasOwnProperty('filters')){
                                    for(var f =0;f< object.screens[screen_code]['body_area'][body_code].attributes.filters.length;f++){
                                        var filter = object.screens[screen_code]['body_area'][body_code].attributes.filters[f];
                                        filter.code = 'filter-'+makeElemId();
                                        filter.screen_code = screen_code;
                                        if(!filter.hasOwnProperty('entries')){
                                            filter.entries= [];
                                        }
                                        filter.table=object.screens[screen_code]['body_area'][body_code].code;
                                        let checkTable = true;
                                        if(vm.activeListFilters.length>0){
                                            vm.activeListFilters.map(ft=>{
                                                if(filter.screen_code === ft.screen_code && filter.column === ft.column){
                                                    checkTable = false;
                                                    return;
                                                }
                                            })
                                            if(checkTable){
                                                vm.activeListFilters.push(filter);
                                            }
                                        }else{
                                            vm.activeListFilters.push(filter);
                                        }
                                    
                                    }
                                }
                                else if(object.screens[screen_code]['body_area'][body_code].type=='chartView' && object.screens[screen_code]['body_area'][body_code].hasOwnProperty('filters')){
                                    let filter_full = object.screens[screen_code]['body_area'][body_code].filters
                                    for(var f =0;f< object.screens[screen_code]['body_area'][body_code].filters.length;f++){
                                        var filter = object.screens[screen_code]['body_area'][body_code].filters[f];
                                        filter.code = 'filter-'+makeElemId();
                                        filter.screen_code = screen_code;
                                        filter.chart=object.screens[screen_code]['body_area'][body_code].code;
                                        let checkFilter = true;
                                        if(vm.activeListFilters.length>0){
                                            vm.activeListFilters.map(ft=>{
                                                if(filter.screen_code === ft.screen_code){
                                                    checkFilter = false;
                                                    return;
                                                }
                                            })
                                            if(checkFilter){
                                            vm.activeListFilters = vm.activeListFilters.concat(filter_full);
                                            }
                                        }else{
                                            vm.activeListFilters = vm.activeListFilters.concat(filter_full);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        jumpToPreviousScreen:function (sub="") {
            if(sub!==""){
                let index = vm.activeScreenSub.indexOf(sub);
                vm.activeScreenSub=vm.activeScreenSub.splice(index+1,1)
                vm.activeScreenCom=vm.activeScreenComPre
            }
            this.jumpToScreen('',this.previousScreenCode)
        },
    }
  }