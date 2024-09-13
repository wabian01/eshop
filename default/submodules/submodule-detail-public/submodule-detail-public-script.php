<script type="text/javascript">
    Vue.component('submodule-detail-public', {
        template: '#submodule-detail-public',
        props: ['submodule','components','objects', 'layout', 'subitem','check_filter'],
        data: function () {
            return {
                checkedCheckbox:true,
                showSearch:false,
                showSearchInput:false,
                activeComponentContent:"",
                reset_filter:false,
                showTab:false,
                showMultiOneObject:false,
                item_buttons:[],
                task:"",
                icon_button:"",
                show_button:false,
                showABTiles:false,
                show_filter: false,
                apply_filter: false,
                orderSort: 'ASC',
                stateSort: false,
                check_filter: false,
                showSearchInputSystem: false,
                showBackToModule:false,
                statusABactive:true,
                nameComponentAB:'',
                keyword:'',
            };
        },
        mounted: function () {
            let that = this;
            this.resizeSearchInput();
            $(window).resize(function() {
                setTimeout(() => {
                    that.resizeSearchInput();    
                }, 300);
            });

            if( $("#s-com-title").children().length === 0 ) {
                $("#s-com-title").css({"display": "none"});
            }
            
        },
        created: function () {
            if(vm.componentABactive != false){
                this.statusABactive = false
                this.nameComponentAB = vm.componentABactive
            }
            if(vm.backToModule.hasOwnProperty(this.submodule.moduleCode) && vm.backToModule[this.submodule.moduleCode][0] === 1){
                this.showBackToModule = true;
                vm.backToModule[this.submodule.moduleCode].push(vm.level)
            }
            vm.activeScreenSub=[]
            vm.activeScreenCom=[]
            if(this.statusABactive){
                vm.current={}
            }
        },
        watch: {
            activeComponentContent:function(code){
                setTimeout(() => {
                    this.reset_filter = !this.reset_filter;
                    let com=this.submodule.components[code];
                    this.item_buttons = [];
                    this.show_button = false;
                    if(this.submodule.hasOwnProperty('inner_buttons') && this.submodule.inner_buttons.length>0){
                            this.item_buttons=this.submodule.inner_buttons;
                    }
                    if(this.submodule.layout=='tabs' && com.hasOwnProperty('buttons') && com.buttons.length>0){
                            this.item_buttons=this.item_buttons.concat(com.buttons);
                    }
                    if(this.showTab && vm.topBar.hasOwnProperty(9999) && vm.topBar[9999][0]!=undefined){
                        this.item_buttons=this.item_buttons.concat(vm.topBar[9999]);
                    }
                    if(this.item_buttons.length>0){
                        let task={
                                code: 9999,
                                comitem: null,
                                get: null,
                                html_content: "",
                                isDeleted: false,
                                layout: "tabs",
                                object: {
                                    moduleCode:this.submodule.moduleCode,
                                    subModuleCode:this.submodule.code,
                                    componentCode:"undefined-undefined",
                                    code:'undefined-undefined-undefined',
                                    rawComponentCode:"undefined"
                                },
                                openFromAB: "",
                                post: null,
                                subitem: null,
                                title: null,
                                where: null}
                        this.task=task;
                        this.show_button=true;
                        let AB = JSON.stringify(this.item_buttons)
                        for (var key in vm.flatRuntimeAttributes) {
                            if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                                AB = AB.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                                AB = AB.replace('"','\"');
                            }
                        }  
                        this.item_buttons = JSON.parse(AB);
                        if(this.item_buttons.length>1){
                            this.icon_button='<i style="transform: rotate(90deg);" class="fas fa-ellipsis-h"></i>';
                        }else{
                            if(this.item_buttons[0].type=="act_fill_form" || this.item_buttons[0].type=="act_get_instance"){
                                this.icon_button='<i class="fa fa-calendar-plus-o"></i>';
                            }
                            else if(this.item_buttons[0].type=="act_call_cloudphone"){
                                this.icon_button='<i class="fa fa-phone"></i>';
                            }
                            else if(this.item_buttons[0].type=="act_call_api"){
                                this.icon_button='<i class="fa fa-cloud-download"></i>';
                            }
                            else if(this.item_buttons[0].type=="act_gps"){
                                this.icon_button='<i class="fa fa-map-marker"></i>';
                            }
                            else if(this.item_buttons[0].type=="act_report"){
                                this.icon_button='<i class="flaticon-diagram"></i>';
                            }
                            else if(this.item_buttons[0].type=="act_dm_view"){
                                this.icon_button='<i class="fa fa-bar-chart"></i>';
                            }
                            else if(this.item_buttons[0].type=="act_call" || this.item_buttons[0].type=="act_sms"){
                                this.show_button=false;
                            }
                            if(this.item_buttons[0].hasOwnProperty('imageUrl')){
                                this.icon_button = '<img src="'+this.item_buttons[0].imageUrl+'" style="width:1rem;">'
                            }
                        }
                    }
                }, 100);
            }
        },
        methods: {
            hideFilter:function(){
                this.reset_filter = !this.reset_filter
                this.show_filter =  !this.show_filter
                this.apply_filter = !this.apply_filter
            },
            resizeSearchInput: function() {
                let searchInput = $(".searchInput");

                let searchInputLeft = ($(".submodule-wrapper").width() - 42 - 10) * -1;
                let searchInputWidth = $(".submodule-wrapper").width() - 20;

                searchInput.css({
                    "left": searchInputLeft + "px",
                    "width": searchInputWidth + "px",
                })
            },
            componentContent:  function(component){
                let showMultiObject = false;
                let showMultiOneObject = false;
                if(!component.hasOwnProperty('quick_view_object') || (component.hasOwnProperty('quick_view_object') && component.quick_view_object !== 0)){
                    showMultiObject = true;
                }
                let check = 0;
                let objectComActive=null;
                let type_object=false;
                let check_typeallobject=true;
                vm.filterHiddenObjects(component.objects)
                Object.keys(component.objects).map(object=>{
                        if(component.objects[object].filtered_visible && component.objects[object].hasOwnProperty('filtered_visible')){
                            if(component.objects[object].type==='datamodel'){
                                type_object=true;
                            }else{
                                check_typeallobject=false;
                            }
                            check+=1;
                            objectComActive=component.objects[object].root_screen
                        }
                        if(check>1){
                            type_object=false;
                            objectComActive=""
                            return;
                        }
                })
                if(((check === 1 && type_object) || (showMultiObject && check_typeallobject)) && this.submodule.layout === "tabs"){
                    if(check !== 1){
                        this.showMultiOneObject = !showMultiOneObject;
                    }else{
                        this.showMultiOneObject = showMultiOneObject;
                    }
                    if((vm.checkOneModule[this.submodule.moduleCode] || this.submodule.showTab) && !component.hasOwnProperty('one_object_notpower')){
                        $('.autofit_subdetail').css('column-width','auto')
                        $('.autofit_subdetail .item').css('margin-bottom','-1px')
                        this.showTab=true;
                    }else{
                        $('.autofit_subdetail').css('column-width','auto')
                        $('.autofit_subdetail .item').css('margin-bottom','-1px')
                        this.showTab=false;
                    }
                    if(component.isFirst && this.activeComponentContent===""){
                        this.activeComponentContent=component.code
                    }
                    this.showSearch = true;
                    component.show_content = true;
                    component.screen_objectCom=objectComActive
                    return true;
                }else{
                    if(!this.showTab){
                        $('.autofit_subdetail').css('column-width','auto')
                        $('.autofit_subdetail .item').css('margin-bottom','-1px')

                    }
                    if(component.isFirst && this.activeComponentContent===""){
                        this.activeComponentContent=component.code
                    }
                    component.show_content = false;
                    this.showTab=false;
                    return false;
                }
                
            },
            handleSearch:function (event) {
                this.keyword = $(event.target).val().toLowerCase();
            },
            handleSearchCom:function (event) {
                vm.activeTaskCode='';
                vm.itemSearchString = $(event.target).val();
            },
            clearSearch:function(){
                this.$refs.searchInput.value='';
                vm.itemSearchString='';
                this.$nextTick(function () {
                    this.$refs.searchInput.focus();
                });
            },
            clearSearch2:function(){
                this.$refs.searchInputSystem.value='';
                vm.objectSearchString='';
                this.$nextTick(function () {
                    this.$refs.searchInputSystem.focus();
                });
                this.keyword = "";
            },
            closeSearch:function(code){
                if(code!==""){
                    this.activeComponentContent=code
                    vm.jumpToPreviousScreen(this.submodule.code)
                }
                this.showSearchInput=false;
                this.$refs.searchInput.value='';
                vm.itemSearchString='';
            },
            currentCom:function (code) {
                this.showSearchInput=!this.showSearchInput;
                if(this.showSearchInput){
                    this.$nextTick(function () {
                    this.$refs.searchInput.focus();
                    });
                    this.addComponentActive();
                } else{
                    this.$refs.searchInput.value='';
                    vm.itemSearchString='';
                }
            },
            currentCom2:function (code) {
                this.showSearchInputSystem=!this.showSearchInputSystem;
                if(this.showSearchInputSystem){
                    this.$nextTick(function () {
                    this.$refs.searchInputSystem.focus();
                    });
                } else{
                    this.$refs.searchInputSystem.value='';
                }
                this.keyword = "";
            },
            addComponentActive:function(){
                this.check_filter = !this.check_filter
                vm.refresh_rate=!vm.refresh_rate;
                vm.activeTaskCode='';
                vm.activeFilterAndSearchCom['submodule']=this.submodule.code
                vm.activeFilterAndSearchCom['component']=vm.activeComponentCode
                if(vm.activeComponentCode===""){
                    let compo = this.submodule.components
                    Object.keys(compo).map(component=>{
                        if(compo[component].isFirst){
                            vm.activeFilterAndSearchCom['component']=compo[component].code;
                            return;
                        }
                    })
                }
                vm.activeScreenCode=this.submodule.components[vm.activeFilterAndSearchCom['component']].screen_objectCom;
            },
            zoomTask:function(){
                let that=this
                this.$refs.zoomTask1.map(key=>{
                    if(key.component.code===that.activeComponentContent){
                        key.zoomTaskFromComponent()
                    }
                })
            },
            selectAllInstance:function () {
                if($(".checkbox-instance").prop("checked") == this.checkedCheckbox){
                    this.checkedCheckbox = !this.checkedCheckbox
                }
                this.checkedCheckbox = !this.checkedCheckbox;
                $(".checkbox-instance").prop("checked",this.checkedCheckbox);
                $(".checkbox-instance").trigger("click");

                if($(".checkbox-instance").prop("checked")){
                    $(".rta-button-send-instances").removeClass("rta-btn-disable")
                } else {
                    $(".rta-button-send-instances").addClass("rta-btn-disable")
                }
            },
            actionBacktoScreen(){
                if((vm['checkIframe'] != undefined && vm['checkIframe'][0]) || vm['checkIframe'] == undefined){
                    vm.jumpToPreviousScreen(this.submodule.code)
                }else{
                    try {
                        $('#'+vm['checkIframe'].id).get(0).contentDocument.location.href = "about:srcdoc";
                    } catch (error) {
                        window.history.back();
                    }
                }
               
                if ( ($(document).find("audio")).length > 0 ) {
                    $( "audio" ).trigger( "pause" );
                }
            },
            convertABComponent:function(button,type){
                if(type=='task'){
                    let task={
                            code: 9999,
                            comitem: null,
                            get: null,
                            html_content: "",
                            isDeleted: false,
                            layout: "tabs",
                            object: {
                                moduleCode:button.moduleCode,
                                subModuleCode:button.subModuleCode,
                                componentCode:button.code,
                                code:'undefined-undefined-undefined',
                                rawComponentCode:"undefined"
                            },
                            openFromAB: "",
                            post: null,
                            subitem: null,
                            title: null,
                            where: null}
                    return task;
                }
                if(type=='buttons'){
                    let AB = JSON.stringify(button)
                    for (var key in vm.flatRuntimeAttributes) {
                        if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                            AB = AB.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                            AB = AB.replace('"','\"');
                        }
                    }  
                    return JSON.parse(AB);
                }
                if(type=='icon_button'){
                    this.showABTiles=true;
                    let icon="";
                    if(button.length>1){
                        icon='<i style="transform: rotate(90deg);" class="fas fa-ellipsis-h"></i>';
                    }else{
                        if(button[0].type=="act_fill_form" || button[0].type=="act_get_instance"){
                            icon='<i class="fa fa-calendar-plus-o"></i>';
                        }
                        else if(button[0].type=="act_call_cloudphone"){
                            icon='<i class="fa fa-phone"></i>';
                        }
                        else if(button[0].type=="act_call_api"){
                            icon='<i class="fa fa-cloud-download"></i>';
                        }
                        else if(button[0].type=="act_gps"){
                            icon='<i class="fa fa-map-marker"></i>';
                        }
                        else if(button[0].type=="act_report"){
                            icon='<i class="flaticon-diagram"></i>';
                        }
                        else if(button[0].type=="act_dm_view"){
                            icon='<i class="fa fa-bar-chart"></i>';
                        }
                        else if(button[0].type=="act_call" || button[0].type=="act_sms"){
                            this.showABTiles=false;
                        }
                    }
                    return icon;
                }
            },
            sortFilter(){
                this.addComponentActive();
                if(vm.sortFilter[9999].order == "ASC"){
                    vm.sortFilter[9999].order = "DESC";
                }else{
                    vm.sortFilter[9999].order = "ASC";
                }
                this.orderSortChange(vm.sortFilter[9999].order);
                vm.stateSortFilter = !vm.stateSortFilter;
            },
            orderSortChange(value){
                this.orderSort = value;
            },
            backToModule(){
                vm.backToModule[this.submodule.moduleCode].pop()
                vm.listTabs[this.submodule.moduleCode].type = 'jumpToSubmodule'
                vm.level = 1;
            },
        },


    });
</script>