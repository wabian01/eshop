const modulesHeader = {
    methods: {
        processViews(view){
            let components = this.getAllComponents(view);
            let check = 0;
            let ABcom = {};
            for (let code in components) {
                if(components.hasOwnProperty(code)){
                    let component = components[code];
                    if( (!component.hasOwnProperty("power_needed")) ||  (!this.module_power.hasOwnProperty(component.moduleCode)) || (parseInt(this.module_power[component.moduleCode]) >= parseInt(component.power_needed)) ){
                            check++;
                            ABcom = components[code];
                    }else if((parseInt(this.module_power[component.moduleCode]) < parseInt(component.power_needed))){
                        if(component.unavailable_behavior == 'disable'){
                            check++;
                        }
                    }
                }
            }
            if (check === 1 && ABcom.quick_view_object === 1) {
                let AB = {
                    destinationCode: ABcom.code,
                    destinationType: "component",
                    label: ABcom.title,
                    type: "act_open_module"
                };
                this.callActionButton(JSON.stringify(AB));
            } else {
                vm.jumpToSubmoduleDetail(view,'all');
            }
        },
        openUtility(){
            this.processViews(vm.utilityModule)
        },
        openBCards(){
            this.processViews(vm.bcardsModule)
        },
        openMCards(){
            this.processViews(vm.mcardsModule)
        },
    }
  }