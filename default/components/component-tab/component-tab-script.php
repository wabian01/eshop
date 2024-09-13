<script type="text/javascript">
    Vue.component('component-tab', {
        template: '#component-tab',
        props: ['task','webpublic'],
        data: function () {
            return {
                reset_filter:false,
                showSearch:false,
                item_buttons:[],
                icon_button:"",
                show_button:false,
                show_filter: false,
                apply_filter: false,
                stateSort: false,
                orderSort: 'ASC',
                check_filter: false
            };
        },
        created: function () {
            if(vm.topBar.hasOwnProperty(this.task.code) && vm.topBar[this.task.code].length>0){
                this.item_buttons=vm.topBar[this.task.code][0].buttons;
                let AB = JSON.stringify(this.item_buttons)
                for (var key in vm.flatRuntimeAttributes) {
                    if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                        AB = AB.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                        AB = AB.replace('"','\"');
                    }
                }  
                this.item_buttons = JSON.parse(AB);
                this.show_button=true;
                let button = vm.topBar[this.task.code][0].buttons
                if(button.length>1){
                    this.icon_button='<i style="transform: rotate(90deg);" class="fas fa-ellipsis-h"></i>';
                }else{
                    if(button[0].type=="act_fill_form" || button[0].type=="act_get_instance"){
                        this.icon_button='<i class="fa fa-calendar-plus-o"></i>';
                    }
                    else if(button[0].type=="act_call_cloudphone"){
                        this.icon_button='<i class="fa fa-phone"></i>';
                    }
                    else if(button[0].type=="act_call_api"){
                        this.icon_button='<i class="fa fa-cloud-download"></i>';
                    }
                    else if(button[0].type=="act_gps"){
                        this.icon_button='<i class="fa fa-map-marker"></i>';
                    }
                    else if(button[0].type=="act_report"){
                        this.icon_button='<i class="flaticon-diagram"></i>';
                    }
                    else if(button[0].type=="act_dm_view"){
                        this.icon_button='<i class="fa fa-bar-chart"></i>';
                    }
                    else if(button[0].type=="act_call" || button[0].type=="act_sms"){
                        this.show_button=false;
                    }
                    if(button[0].hasOwnProperty('imageUrl')){
                            this.icon_button = '<img src="'+button[0].imageUrl+'" style="width:1rem;">'
                    }
                }
            }
        },
        mounted: function (){
            $(".modal").on("shown.bs.modal", function () {
                if ($(".modal-backdrop").length > 1) {
                    $(".modal-backdrop").not(':first').remove();
                }
            })
        },
        methods: {
            handleObject(object) {
                if( (!vm.module_power.hasOwnProperty(object.moduleCode)) ||
                    (!object.hasOwnProperty('power_needed')) ||
                    (parseInt(vm.module_power[object.moduleCode]) >= parseInt(object.power_needed)) ||
                    (parseInt(vm.module_power[object.moduleCode]) < parseInt(object.power_needed) && (object.moduleCode !== 'bscrd' && object.moduleCode !== 'mbcrd')) ||
                    ((object.unavailable_behavior != 'disable' && object.unavailable_behavior != 'hide')) 
                ) {
                    return true
                } else {
                    return false
                }
            },
            createTaskVirtual:function(object){
                vm.activeScreenCom[object.code]=object.root_screen
                let task={
                    code: 9999,
                    comitem: null,
                    get: null,
                    html_content: "",
                    isDeleted: false,
                    layout: "tabs",
                    object: object,
                    openFromAB: "",
                    post: null,
                    subitem: null,
                    title: object.modalTitle,
                    where: null}
                    return task;
            },
            hideFilter:function(){
                this.reset_filter = !this.reset_filter
                this.show_filter =  !this.show_filter
                this.apply_filter = !this.apply_filter
            },
            previousScreenIframe:function(){
                if((vm['checkIframe'] != undefined && vm['checkIframe'][0]) || vm['checkIframe'] == undefined){
                    vm.jumpToPreviousScreen();
                }else{
                    try {
                        $('#'+vm['checkIframe'].id).get(0).contentDocument.location.href = "about:srcdoc";
                    } catch (error) {
                        window.history.back();
                    }
                }
            },
            closeSearch:function(){
                this.showSearch=false;
                this.$refs.searchInput.value='';
                vm.itemSearchString='';
                
            },
            clearSearch:function(){
                this.$refs.searchInput.value='';
                vm.itemSearchString='';
            },
            handleSearch:function (event) {
                vm.itemSearchString = $(event.target).val();
            },
            resizeModal: function(){
                $('.dm-table-view').DataTable().columns.adjust();
                if(vm.hasOwnProperty('mapLeaflet')){
                    vm.mapLeaflet.invalidateSize()
                }
            },
            handleOpenSearch:function(event){
                this.showSearch=true;
                this.$nextTick(function () {
                    this.$refs.searchInput.focus();
                });
            },
            sortFilter(){
                if(vm.sortFilter[this.task.code].order == "ASC"){
                    vm.sortFilter[this.task.code].order = "DESC";
                }else{
                    vm.sortFilter[this.task.code].order = "ASC";
                }
                this.orderSortChange(vm.sortFilter[this.task.code].order);
                vm.stateSortFilter = !vm.stateSortFilter;
            },
            orderSortChange(value){
                this.orderSort = value;
            },
            downloadDM:function (dm) {
                var url = '';
                var dm_host = dm.dm_host;
                var token = localStorage.getItem('mx_access_token');
                if(Object.entries(dm).length !== 0){
                    for (const [key, value] of Object.entries(dm.screens)) {
                        if(value.top_area.length !== 0){
                            if(value.top_area[0].hasOwnProperty('buttons')){
                                if(value.top_area[0].buttons.length !== 0 && value.top_area[0].buttons[0].hasOwnProperty('url')){
                                    var BaseUrl = value.top_area[0].buttons[0].url;
                                    if(BaseUrl.indexOf('##')>-1){
                                        for (var key1 in vm.flatRuntimeAttributes) {
                                            if (vm.flatRuntimeAttributes.hasOwnProperty(key1)) {
                                            BaseUrl = BaseUrl.replace(new RegExp('##'+key1+'##','g'),vm.flatRuntimeAttributes[key1].replace(/[\r\n]+/g," "));
                                            BaseUrl = BaseUrl.replace('"','\"');
                                            }
                                        }
                                    }
                                    var str = BaseUrl.substring(BaseUrl.indexOf('api/dm'))
                                    url = dm_host + '/' + str
                                    url = url.replace("sqlite", "csv");
                                    url = url.replace("your_token_here", token);
                                }
                            }
                        }
                    }
                }
                return url;
            }
        },
    });
    
    var initTooltip = function(el) {
        var skin = el.data('skin') ? 'tooltip-' + el.data('skin') : '';
        var width = el.data('width') == 'auto' ? 'tooltop-auto-width' : '';
        var triggerValue = el.data('trigger') ? el.data('trigger') : 'hover';
        var placement = el.data('placement') ? el.data('placement') : 'left';

        el.tooltip({
            trigger: triggerValue,
            template: '<div class="tooltip ' + skin + ' ' + width + '" role="tooltip">\
                    <div class="arrow"></div>\
                    <div class="tooltip-inner"></div>\
                </div>'
        });
    }

    var initTooltips = function() {
        $('[data-toggle="kt-tooltip"]').each(function() {
            initTooltip($(this));
        });
    }
</script>