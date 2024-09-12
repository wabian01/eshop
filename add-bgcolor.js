const addBgColor = {
    methods: {
        addBgColor(type,body_area_bg){
            if (typeof body_area_bg.background_color === 'string' && body_area_bg.background_color.includes('##')) {
                for (let key in vm.flatRuntimeAttributes) {
                    if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                        const replacement = vm.flatRuntimeAttributes[key]?.toString().replace(/[\r\n]+/g, ' ');
                        body_area_bg.background_color = body_area_bg.background_color.replace(new RegExp('##' + key + '##', 'g'), replacement);
                        body_area_bg.background_color = body_area_bg.background_color.replace(/"/g, '\\"');
                    }
                }
                for (let key in vm.current.parent) {
                    if (vm.current.parent.hasOwnProperty(key)) {
                        const parentValue = vm.current.parent[key]?.toString().replace(/[\r\n\t]+/g, ' ');
                        body_area_bg.background_color = parentValue !== null ? body_area_bg.background_color.replace(new RegExp('##' + key + '##', 'g'), parentValue) : body_area_bg.background_color;
                        body_area_bg.background_color = body_area_bg.background_color.replace(/"/g, '\\"');
                    }
                }
                body_area_bg.background_color = body_area_bg.background_color.replace(/##(.*?)##/g, '');
            }
            if (body_area_bg.background_color !== undefined && 
                body_area_bg.background_color !== null && 
                body_area_bg.background_color !== ""
            ) {
                if (body_area_bg.background_color.length == 7 && body_area_bg.background_color.startsWith("#")) {
                    this.bgColor = "background-color: "+body_area_bg.background_color+";"; 
                } else if (!body_area_bg.background_color.startsWith("#")) {
                    this.bgColor = "background-color: "+body_area_bg.background_color+";"; 
                } else {
                    // have # but length !== 7
                    this.bgColor = "";
                }   
                
                if(vm.modules[this.object.moduleCode].functionCode === "SM_HOMEVIEW"){
                    vm.bgcolorHomeview = "background-color: "+body_area_bg.background_color+type; 
                }
            } 
        },
    }
  }