const getModuleCloudPhone = {
    methods: {
        getModuleCloudPhone:function(){
            if(typeof(show_module)!=='undefined' && show_module!==""){
                vm.jumpToSubmoduleDetail(show_module,'all');
                $(".splash-screen").addClass("display-none");  
                $(".covered-screen").removeClass("display-none");  
            }
            this.getDmObject();
        
            let modules = this.modules;
            let subModules = {};
            let components = {};
            let objects = {};
            let screens = {};
            let body_areas={};
            let object_type={};
            let checkCP=false;
            let count = 0;
            this.getDatabaseWebform()
                    Object.keys(modules).forEach(function(key) {
                        if(modules[key].hasOwnProperty('functionCode') && modules[key].functionCode == 'SM_CLOUDPHONE'){
                            checkCP=true;
                        }else{
                            checkCP=false;
                        }
                        if(modules[key].hasOwnProperty('functionCode') && modules[key].functionCode == 'SM_UTILITIES' && vm.utilityModule===""){
                            vm.utilityModule = modules[key].code
                            $('#utilityModule').html('<a href="javascript:;" onclick="vm.openUtility()"  class="dropdown-toggle" style="display: block;" title="Utility"><img src="data:image/png;base64,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" height="26px"></a>')
                        }
                        if(modules[key].hasOwnProperty('functionCode') && modules[key].functionCode == 'SM_BCARDS' && vm.bcardsModule===""){
                            vm.bcardsModule = modules[key].code
                            $('#bcardsModule').html('<a href="javascript:;" onclick="vm.openBCards()"  class="dropdown-toggle" style="display: block;" title="Business Cards"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAAAXNSR0IArs4c6QAABQhJREFUeF7tnUmoHUUUhr/jPGJQcFgoiFMgBBI1GseNIKIiOOAuMUIGjYsQcS3oXsGFGgdwXDpsXIjgRlTEESdwFhRHVIw4xPHIedRNyva97r5Nd597u09BNrnddar+r05Vdd+6/xOiuCogrtEjOAHAeRAEgADgrIBz+MiAAOCsgHP4yIAA4KyAc/jIgADgrIBz+MiAAOCsgHP4yIAA4KyAc/jGGaCq+wCHAQcD+zv3wyv8H8DPwE4R+atJI6YGkIQ/DbgEOBM4HjgC2KtJA+b4nn+A74FPgVeAp4BXpwUxFYAk/i3AtcCRwN5zLGCbTTcY3wAPATeLyJ91K68NQFWPAu4FLqtb+Uivs0zYJCJf1+l/LQCqeihwG7AB2LdOxSO+xkb/I8CNIrKzSoe6AK5O6XVAoUIL9kL691tVsIF9fiBwDnA2sF+hb7uAzSJiIEpLJQBVNdHfAU7IarI5711gq4g8XxVkyJ+rqkG4E1hZ2Ih8DiwXkV/L+l8HwJXAY4VKbNVfLyLvDVncun1T1VOAB4G1hXtMo9IsqAPAVvb1WcVG9CbgHhGxTBh9UVXbgtvO8I70XDTR5HERuapxBqiqAXoNWJ1V8gVwsYi8lVecGmHTVSXUOSemwK7i4FPV5cAzwLFZ/2yaXl22LS0VK83/b9hcllX6CXCeiHw5+b/0fHBdAjX0BzLLetNkR/7QpaqHAy8BJ2VafQCcUbYbagLgY+DcfJ+rqhcBTwLFXdKcD/Ylm2+7nMtF5OlsEC4DXi4A+DAB+HGpmtoCsDXtBIYq+GL9ukFE7goAfsgDgJ/2C5EDQABICqjqRuA+Z0H6Dm8v3O6flTXguPRO3F5Rj6F8C6wRkc9mAoA1QlWPAc5f5MXU0IDYt2DPichXhQdRv23o0BRu0h9VDQBNhGvrngDQlpIN6wkADYVr67YA0JaSDesJAA2Fa+u2ANCWkg3rCQANhWvrtq4AHGKnvQD7znNSPgLOEpHv2mr8EOrpCkCjh4shCDptHwLAtIq1fH0AaFnQaatzB6CqdjBp1QgO7P4NvLnIqZBG03XVd8K1KlXVE4FnATsZMIZjKT8AF4iIbUgWimsGqKodSbl72rSd8+uvF5EdswIgTkV09Dq67hQUAAJA7xNaL6ciIgOW5hoAeh/z/w0YAALAnj1wLMKxCPeeDzEF9S55rAHOkgeAAGAK/O9XH6oai3Aswr1nRyzCvUsea4Cz5AEgAMQivGcMxBrgnA8BIADEy7jOf6hd9wsZsyp4AjATozEUM6e6og+rArOlNP+DkzNV7Ul4rYjY0YyFksw6tgCnjsA90cw6Xk92PbutKrsy6zB/OHMGWZEBMCeoC4tmTWFX04FdTRrd5pZlrlmT8guwDXggDJt2zwDdGDYlAOuAhwsTu/nibBCR98cw4Vf1scSybJ2IPFp2f+UxQlU9CDBvuNwJyubBt5NhhbkmjrZ0btqXZYGZthYNmexX4y+GbWWHtpUJgO2GbgdsOgrj1vJ8nxi3bheRn6qmhsopKNtqHp0cUS6tqnTkn7dvXZxBsNF/K3ANYF7SQzfoqzuWbE00BxXzDu3GvLvw0HU6YJmwJuzre7Svz4dD9gcc7JeURe/kuiNn3q/7HbDnov7+gMO8KzZr7a+9CM9aw4fSngDgTDIABABnBZzDRwYEAGcFnMNHBgQAZwWcw0cGBABnBZzDRwYEAGcFnMNHBgQAZwWcw/8LNympjpM0mhcAAAAASUVORK5CYII=" height="26px"></a>')
                        }
                        if(modules[key].hasOwnProperty('functionCode') && modules[key].functionCode == 'SM_MCARDS' && vm.mcardsModule===""){
                            vm.mcardsModule = modules[key].code
                            $('#mcardsModule').html('<a href="javascript:;" onclick="vm.openMCards()"  class="dropdown-toggle" style="display: block;" title="Membership Cards"><img src="data:image/png;base64,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" height="26px"></a>')
                        }
                        subModules = modules[key].subModules
                        Object.keys(subModules).forEach(function(key1){
                                var tmp_components = subModules[key1].components;
                                Object.keys(tmp_components).forEach(function(key2, value){
                                    var object_tem = tmp_components[key2].objects;
                                    Object.keys(object_tem).forEach(function(key3) {
                                            if(object_tem[key3].type==="datamodel"){
                                                if(checkCP){
                                                    count++;
                                                    if(count==2){
                                                        object_tem[key3].checkCP = true;
                                                        object_type['SM_CLOUDPHONE'] = Object.assign(object_type['SM_CLOUDPHONE'],{searchView: object_tem[key3]})
                                                    }else if(count==1){
                                                        object_type['SM_CLOUDPHONE']={
                                                            object_full: object_tem[key3],
                                                        }
                                                    }
                                                }
                                                objects[key3] = object_tem[key3];
                                            }
                                    });
                                });
                            });
                    });
                    Object.keys(objects).forEach(function(key1) {
                        var object=objects[key1];
                        let checkSearchView=false;
                    if(object.checkCP && object.hasOwnProperty('checkCP')){
                        checkSearchView = true;
                    }
                    for (var screen_code in object.screens) {
                        if (object.screens.hasOwnProperty(screen_code)) {
                                for (var body_code in object.screens[screen_code]['body_area']) {
                                    if (object.screens[screen_code]['body_area'].hasOwnProperty(body_code)) {
                                        if(object.screens[screen_code]['body_area'][body_code].type=='searchView' && checkSearchView){
                                            var item_template=object.screens[screen_code]['body_area'][body_code].item_template;
                                            try {
                                                if(typeof(item_template)==='string'){
                                                    item_template=JSON.parse(item_template);
                                                    if (item_template.template_default.type==='contact') {
                                                        if(object.screens[screen_code]['body_area'][body_code].hasOwnProperty('search_rules')){
                                                            object_type['SM_CLOUDPHONE'].searchView.SearchRule = object.screens[screen_code]['body_area'][body_code].search_rules;
                                                        }
                                                        object_type['SM_CLOUDPHONE'].searchView.Esname=item_template.template_default.attributes.name
                                                        object_type['SM_CLOUDPHONE'].searchView.Esphone=item_template.template_default.attributes.phone
                                                    }
                                                }else if(typeof(item_template)==='object'){
                                                    if (item_template.template_default.type==='contact') {
                                                        if(object.screens[screen_code]['body_area'][body_code].hasOwnProperty('search_rules')){
                                                            object_type['SM_CLOUDPHONE'].searchView.SearchRule = object.screens[screen_code]['body_area'][body_code].search_rules;
                                                        }
                                                        object_type['SM_CLOUDPHONE'].searchView.Esname=item_template.template_default.attributes.name
                                                        object_type['SM_CLOUDPHONE'].searchView.Esphone=item_template.template_default.attributes.phone
                                                    }
                                                }
                                            } catch (error) {
                                                
                                            }
                                        }
                                        if(object.screens[screen_code]['body_area'][body_code].type=='listView'){
                                            var item_template=object.screens[screen_code]['body_area'][body_code].item_template;
                                            try {
                                                if(typeof(item_template)==='string'){
                                                    item_template=JSON.parse(item_template);
                                                    if (item_template.template_default.type==='contact') {
                                                        object_type[key1]={
                                                            dm_host: object.dm_host,
                                                            dm_type: object.dm_type,
                                                            token: object.token,
                                                            dm_name: object.dm_name,
                                                            where: object.query_params.where,
                                                            name: item_template.template_default.attributes.name,
                                                            phone: item_template.template_default.attributes.phone,
                                                            title: object.title,
                                                            id: object.code,
                                                            object_full: object,
                                                            };
                                                    }
                                                }else if(typeof(item_template)==='object'){
                                                    if (item_template.template_default.type==='contact') {
                                                        object_type[key1]={
                                                            dm_host: object.dm_host,
                                                            dm_type: object.dm_type,
                                                            token: object.token,
                                                            dm_name: object.dm_name,
                                                            where: object.query_params!==null && object.query_params.hasOwnProperty('where') &&  object.query_params.where != null ? object.query_params.where: null,
                                                            name: item_template.template_default.attributes.name,
                                                            phone: item_template.template_default.attributes.phone,
                                                            title: object.title,
                                                            id: object.code,
                                                            object_full: object,
                                                            };
                                                    }
                                                }

                                            } catch (error) {
                                                
                                            }

                                        }
                                    }
                                }
                        }
                    }
                });
                StringeeSoftPhone.dataModule(object_type)
        },
    }
  }