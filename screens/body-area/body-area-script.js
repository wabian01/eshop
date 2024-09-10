    Vue.component('body-area', {
        template: '#body-area',
        props: ['body_area', 'screen', 'object', 'task','skip_object','status_ref','list_data_object'],
        data: function () {
                return {
                      id_random: this.body_area.code + '-' +Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10),
                      classNameLoad: 'lds-ellipsis '+this.screen.code,
                      nonehide_view:'',  
                      height_searchView: "", 
                      height_blankView:"" ,
                      bgColor_blankView:"",
                      re_render_button_group:true,
                      re_render_map:true,
                      firstRender:true,
                      re_render_searchview:true,
                }
        },
        activated(){
                if(!this.re_render_map){
                        this.re_render_map = true
                }  
                if(!this.re_render_button_group){
                        this.re_render_button_group = true
                }
                this.re_render_searchview = false
                setTimeout(() => {
                        this.re_render_searchview = true
                }, 10); 
                if(this.firstRender){
                        this.firstRender = false
                }else{
                        $('#'+this.object.componentCode+' .lds-spinner').css({'display':'none'})
                        this.handleIcon()
                }
        },
        deactivated(){
                if(this.task.code===9999){
                        $('.autofit_subdetail .filterdisplay').hide();
                }
                vm.checkFilterSkipObject = 0
        },
        created: function () {
                if(this.skip_object && (this.body_area.type=='listView'|| this.body_area.type=='gridView')){
                        vm.checkFilterSkipObject = vm.checkFilterSkipObject + 1;
                }

                if (this.body_area.type === 'searchView') {
                        if (!this.body_area.hasOwnProperty('layout') || 
                        (this.body_area.hasOwnProperty('layout') && !this.body_area.layout.hasOwnProperty('height')) ||  
                        (this.body_area.hasOwnProperty('layout') && this.body_area.layout.hasOwnProperty('height') && this.body_area.layout.height == "")) {
                                this.height_searchView = "height: 100%;";
                        } else if (typeof (this.body_area.layout.height) === "string") {
                                this.height_searchView = "height: "+this.body_area.layout.height+";";      
                        } else if (typeof (this.body_area.layout.height) === "number" && this.body_area.layout.height > 0) {
                                this.height_searchView = "height: "+(this.body_area.layout.height + 200)+"px;";
                        } else {
                                
                        }
                }
                // Has blankView 
                if (this.body_area.type === 'blankView') {    
                        let body_area_bg = JSON.parse(JSON.stringify(this.body_area));
                        let screen_bg = JSON.parse(JSON.stringify(this.screen));

                        if (typeof body_area_bg.background_color === 'string' && body_area_bg.background_color.includes('##')) {
                                body_area_bg = this.handleBgColor(body_area_bg)
                        }
                        if (typeof screen_bg.background_color === 'string' && screen_bg.background_color.includes('##')) {
                                screen_bg = this.handleBgColor(screen_bg)
                        }
                        if (( body_area_bg.background_color !== undefined &&
                              body_area_bg.background_color !== null &&
                              body_area_bg.background_color !== "" ) &&
                              body_area_bg.background_color.length == 7 &&
                              body_area_bg.background_color.includes("#")) {
                              this.bgColor_blankView = "background-color: "+body_area_bg.background_color+";"; 
                        } else if (screen_bg.background_color !== "") {
                                this.bgColor_blankView = "background-color: "+screen_bg.background_color+";"; 
                        } else {
                                this.bgColor_blankView = "background-color: transparent;";
                        }

                        if (typeof (this.body_area.height) === "string") {
                                if ( !this.body_area.height.includes('px')  && 
                                     !this.body_area.height.includes('%')   &&
                                     !this.body_area.height.includes('rem') && 
                                     !this.body_area.height.includes('em')  &&
                                     !this.body_area.height.includes('vh') )
                                {
                                        this.height_blankView = "height: "+this.body_area.height+"px;"; 
                                } else {
                                        let height_tem = this.body_area.height.includes('%') ? this.body_area.height.replace('%','vh') : this.body_area.height;
                                        this.height_blankView = `height: ${height_tem};`;
                                }
                        } else if (typeof (this.body_area.height) === "number") {
                                this.height_blankView = "height: "+this.body_area.height+"px;";
                        } else {
                                this.height_blankView = "height: 10px;";
                        }
                }
        },
        mounted: function(){                
                this.setHeightBody()
                if(this.body_area?.filterConfig?.qr_scan){
                        if(vm.activeScreenCode===this.body_area.screenCode){
                                        $('#task-modal-'+this.task.code+' .codeQRdisplay').show();
                                }
                }
                if((this.body_area.hasOwnProperty('filters') && this.body_area.filters.length>0) && (this.body_area.type=='listView' || this.body_area.type=='gridView' || this.body_area.type=='mapView')){
                        if(this.task.code===9999){
                                $('.autofit_subdetail .filterdisplay').show();
                                if(vm.checkFilterSkipObject>1){
                                        $('.autofit_subdetail .filterdisplay').hide();
                                }
                        }else{
                                if(vm.activeScreenCode===this.body_area.screenCode){
                                        $('#task-modal-'+this.task.code+' .filterdisplay').show();
                                }
                        }
                }
                if(((this.body_area.hasOwnProperty('search_enable') && this.body_area.search_enable) || !this.body_area.hasOwnProperty('search_enable')) && (this.body_area.type=='listView' || this.body_area.type=='gridView')){
                        if(this.task.code===9999){
                                $('.autofit_subdetail .searchdisplay').show();
                                if(vm.checkFilterSkipObject>1){
                                        $('.autofit_subdetail .searchdisplay').hide();
                                }
                        }else{
                                if(vm.activeScreenCode===this.body_area.screenCode){
                                        $('#task-modal-'+this.task.code+' .searchdisplay').show();
                                } 
                        }
                }
        },
        methods: {
                handleIcon(){
                        if(this.skip_object && (this.body_area.type=='listView'|| this.body_area.type=='gridView')){
                                vm.checkFilterSkipObject = vm.checkFilterSkipObject + 1;
                        }
                        if(this.body_area?.filterConfig?.qr_scan){
                                if(vm.activeScreenCode===this.body_area.screenCode){
                                                $('#task-modal-'+this.task.code+' .codeQRdisplay').show();
                                        }
                        }
                        if((this.body_area.hasOwnProperty('filters') && this.body_area.filters.length>0) && (this.body_area.type=='listView' || this.body_area.type=='gridView' || this.body_area.type=='mapView')){
                                if(this.task.code===9999){
                                        $('.autofit_subdetail .filterdisplay').show();
                                        if(vm.checkFilterSkipObject>1){
                                                $('.autofit_subdetail .filterdisplay').hide();
                                        }
                                }else{
                                        if(vm.activeScreenCode===this.body_area.screenCode){
                                                $('#task-modal-'+this.task.code+' .filterdisplay').show();
                                        }
                                }
                        }
                        if(((this.body_area.hasOwnProperty('search_enable') && this.body_area.search_enable) || !this.body_area.hasOwnProperty('search_enable')) && (this.body_area.type=='listView' || this.body_area.type=='gridView')){
                                if(this.task.code===9999){
                                        $('.autofit_subdetail .searchdisplay').show();
                                        if(vm.checkFilterSkipObject>1){
                                                $('.autofit_subdetail .searchdisplay').hide();
                                        }
                                }else{
                                        if(vm.activeScreenCode===this.body_area.screenCode){
                                                $('#task-modal-'+this.task.code+' .searchdisplay').show();
                                        } 
                                }
                        }
                },
                handleBgColor(data){
                        for (let key in vm.flatRuntimeAttributes) {
                                if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                                        const replacement = vm.flatRuntimeAttributes[key]?.toString().replace(/[\r\n]+/g, ' ');
                                        data.background_color = data.background_color.replace(new RegExp('##' + key + '##', 'g'), replacement);
                                        data.background_color = data.background_color.replace(/"/g, '\\"');
                                }
                        }

                        for (let key in vm.current.parent) {
                                if (vm.current.parent.hasOwnProperty(key)) {
                                        const parentValue = vm.current.parent[key]?.toString().replace(/[\r\n\t]+/g, ' ');
                                        data.background_color = parentValue !== null ? data.background_color.replace(new RegExp('##' + key + '##', 'g'), parentValue) : data.background_color;
                                        data.background_color = data.background_color.replace(/"/g, '\\"');
                                }
                        }

                        data.background_color = data.background_color.replace(/##(.*?)##/g, '');

                        return data
                },
                setHeightBody(){
                        if((( this.body_area.type=='listView' || this.body_area.type=='gridView' || this.body_area.type=='sliderView' || this.object.type == 'form' || this.object.type == 'instance' || this.object.type == 'fill-form' || this.object.type == 'report'))){
                                if(this.body_area.hasOwnProperty('layout') && this.body_area.layout.hasOwnProperty('height') && this.body_area.layout.height != ""){
                                        if (this.body_area.layout.height.toString().includes('-')) {
                                                // when setting height: -1
                                                $("#"+this.id_random).css({'height': '100%'  });
                                        } else {
                                                if(!isNaN(Number(this.body_area.layout.height))){
                                                        this.body_area.layout.height = String(this.body_area.layout.height) + 'px';
                                                }
                                                if(this.skip_object){
                                                        $("#"+this.id_random).css({'height': this.body_area.layout.height.indexOf('%')>-1? this.body_area.layout.height.replace('%','vh'):this.body_area.layout.height});
                                                }else{
                                                        if(this.body_area.type=='sliderView'){
                                                                $("#"+this.id_random).css({'max-height': this.body_area.layout.height });
                                                                $("#"+this.id_random).css({'overflow': 'auto' });
                                                        }else{
                                                                $("#"+this.id_random).css({'height': this.body_area.layout.height });
                                                        }
                                                }
                                        }        
                                }
                                else{
                                        if(this.skip_object){
                                                $("#"+this.id_random).css({'height': '100vh'  });
                                        }else{
                                                $("#"+this.id_random).css({'height': '100%'  });
                                                if(vm.newtemplate){
                                                        $("#"+this.id_random).css({'height': '100vh'  });
                                                }
                                        }
                                }
                        }
                }
        },

    });
