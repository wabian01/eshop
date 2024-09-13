<script type="text/javascript">
    Vue.component('taskmodal', {
        template: '#taskmodal',
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
                check_filter: false,
                cancel_filter:false,
                sumAB:0,
                list_item:[],
                classVideo: 'qr' + this.task.code + 'video',
                codeQR: '',
                showCodeQr: false,
            };
        },
        created: function () {
            if(vm.topBar.hasOwnProperty(this.task.code) && vm.topBar[this.task.code].length>0){
                this.item_buttons=JSON.parse(JSON.stringify(vm.topBar[this.task.code][0].buttons));
                let AB = JSON.stringify(this.item_buttons)
                for (var key in vm.flatRuntimeAttributes) {
                    if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                        AB = AB.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                        AB = AB.replace('"','\"');
                    }
                }  
                this.item_buttons = JSON.parse(AB);
                this.show_button=true;
                this.handleDynamicButtons()
                this.renderIconButton()
            }
        },
        mounted: function (){
            let that = this
            $(".modal").on("shown.bs.modal", function () {
                if ($(".modal-backdrop").length > 1) {
                    $(".modal-backdrop").not(':first').remove();
                }
            })
            $('#task-modal-'+this.task.code+' #qr_scan').on("hidden.bs.modal", function () {
                that.stopCamera()
            })
        },
        methods: {
            closeQR(){
                this.showCodeQr = false;
                let filter_attributes = JSON.parse(vm.itemFilterAttributes);
                filter_attributes['__qr_scan__'] = '_all'
                vm.itemFilterAttributes = JSON.stringify(filter_attributes);
            },
            stopCamera(){
                video = document.getElementById(this.classVideo);
                video.srcObject.getTracks().forEach(track => track.stop());
                $('#task-modal-'+this.task.code+' #qr_scan').modal('hide')
            },
            scanQRCode() {
                video = document.getElementById(this.classVideo);
                canvas = document.createElement('canvas');
                context = canvas.getContext('2d');
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    if (code) {
                        this.showCodeQr = true
                        this.codeQR = code.data
                        let filter_attributes = JSON.parse(vm.itemFilterAttributes);
                        filter_attributes['__qr_scan__'] = code.data
                        vm.itemFilterAttributes = JSON.stringify(filter_attributes);
                        video.srcObject.getTracks().forEach(track => track.stop());
                        $('#task-modal-'+this.task.code+' #qr_scan').modal('hide')
                    }
                }

                requestAnimationFrame(this.scanQRCode);
            },
            openCamera(){
                var that = this
                if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                    return;
                }
                video = document.getElementById(this.classVideo);
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then(function(stream) {
                    video.srcObject = stream;
                    video.play();

                    requestAnimationFrame(that.scanQRCode);
                    })
                    .catch(function(error) {
                    console.error('Lỗi truy cập camera: ', error);
                });
            },
            handleDataAB(data){
                if(vm.topBar.hasOwnProperty(this.task.code) && vm.topBar[this.task.code].length>0){
                    this.list_item = data
                    this.item_buttons=JSON.parse(JSON.stringify(vm.topBar[this.task.code][0].buttons));
                    let itemJSONString = JSON.stringify(this.item_buttons);
                    for(var key in this.list_item){
                        try {
                            itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),this.list_item[key].replace(/[\r\n]+/g," "));
                        } catch (error) {
                        }
                        itemJSONString = itemJSONString.replace('"','\"');
                    }

                    for (var key in vm.flatRuntimeAttributes) {
                        if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                            itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                            itemJSONString = itemJSONString.replace('"','\"');
                        }
                    }                
                    for(var key in vm.current.parent){
                        try {
                            itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].replace(/[\r\n]+/g," "));
                        } catch (error) {
                        }
                        itemJSONString = itemJSONString.replace('"','\"');
                    }
                                    
                    if(itemJSONString.indexOf('##') > -1) {
                        itemJSONString = itemJSONString.replace(/##(.*?)##/g,"");
                    }  
                    this.item_buttons = JSON.parse(itemJSONString);
                    this.handleDynamicButtons()
                    this.renderIconButton()
                }
            },
            replaceABDynamic(data,indexbutton,dynamic_buttons,count_button){
                let that = this
                data=data.sort((a,b)=>a.orderNumber-b.orderNumber)
                data.forEach(dynamic_button => {
                    if(dynamic_button.actionID!=""){
                        dynamic_buttons.splice(indexbutton, 0, dynamic_button)
                        indexbutton++;
                    }
                })
                var itemJSONString = JSON.stringify(dynamic_buttons);
                
                for(var key in this.list_item){
                    try {
                        itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),this.list_item[key].replace(/[\r\n]+/g," "));
                    } catch (error) {
                    }
                    itemJSONString = itemJSONString.replace('"','\"');
                }

                for (var key in vm.flatRuntimeAttributes) {
                    if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                        itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                        itemJSONString = itemJSONString.replace('"','\"');
                    }
                }                
                for(var key in vm.current.parent){
                    try {
                        itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].replace(/[\r\n]+/g," "));
                    } catch (error) {
                    }
                    itemJSONString = itemJSONString.replace('"','\"');
                }
                                
                if(itemJSONString.indexOf('##') > -1) {
                    itemJSONString = itemJSONString.replace(/##(.*?)##/g,"");
                }  
                that.item_buttons = JSON.parse(itemJSONString);
                that.renderIconButton(count_button);
            },
            handleDynamicButtons: async function(){
                let that = this;
                let indexbutton = 0;
                let item_buttons = this.item_buttons.sort((a,b)=>a.orderNumber-b.orderNumber);
                let dynamic_buttons = JSON.parse(JSON.stringify(item_buttons));  
                let count_button = 0
                let p = $.when();
                item_buttons.forEach((button,index) => {
                    p = p.then(function() { 
                        if(button.type=="dynamic"){
                            count_button++
                            if(indexbutton === 0){
                                indexbutton = index;
                            }
                            if(button.hasOwnProperty('payloadLifetime')){
                                if(vm.payloadLifetime.hasOwnProperty(hashCode(button.source))){
                                    let timeCache = vm.payloadLifetime[hashCode(button.source)].time
                                    let timePayload = button.payloadLifetime * 1000
                                    let timeCurrent = (new Date()).getTime()
                                    if(timeCurrent - timeCache < timePayload){
                                        let button_cache = vm.payloadLifetime[hashCode(button.source)].buttons;
                                        that.replaceABDynamic(button_cache,indexbutton,dynamic_buttons,count_button)
                                        indexbutton = indexbutton + button_cache.length
                                        return;
                                    }
                                }
                            }
                        return  $.ajax({
                                url: button.source.replace("./","<?php echo AppEnv::BASE_URL ?>"+"/"),
                                type: "GET",
                                contentType: "application/json",
                                dataType: "json",
                                success: function (data) {
                                    if(typeof(data[0])==='string') return;
                                    if(button.hasOwnProperty('payloadLifetime')){
                                        vm.payloadLifetime[hashCode(button.source)] = {
                                            time: (new Date()).getTime(),
                                            buttons: data
                                        }
                                    }
                                    that.replaceABDynamic(data,indexbutton,dynamic_buttons,count_button)
                                    indexbutton = indexbutton + data.length
                                }, error: function (error) {}
                            });
                        }                   
                    })
                })   
                
            },
            renderIconButton(count_button=0){
                let button_temp = this.item_buttons
                let button = []
                if(button.length - count_button === 1){
                    button[0] = button_temp[0]
                }else{
                    button = button_temp
                }
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
            },
            countSumAB(button){
                if(button.type === "dynamic") return
                this.sumAB++
                setTimeout(() => {
                    if(this.sumAB === 1){
                        if(button.type=="act_fill_form" || button.type=="act_get_instance"){
                            this.icon_button='<i class="fa fa-calendar-plus-o"></i>';
                        }
                        else if(button.type=="act_call_cloudphone"){
                            this.icon_button='<i class="fa fa-phone"></i>';
                        }
                        else if(button.type=="act_call_api"){
                            this.icon_button='<i class="fa fa-cloud-download"></i>';
                        }
                        else if(button.type=="act_gps"){
                            this.icon_button='<i class="fa fa-map-marker"></i>';
                        }
                        else if(button.type=="act_report"){
                            this.icon_button='<i class="flaticon-diagram"></i>';
                        }
                        else if(button.type=="act_dm_view"){
                            this.icon_button='<i class="fa fa-bar-chart"></i>';
                        }
                        else if(button.type=="act_call" || button.type=="act_sms"){
                            this.show_button=false;
                        }
                        if(button.hasOwnProperty('imageUrl')){
                                this.icon_button = '<img src="'+button.imageUrl+'" style="width:1rem;">'
                        }
                    }
                }, 100);
                
            },
            getHeightContent(){
                if(this.webpublic && this.task.object.type === 'form'){
                    return 'height:calc(100vh - 0px);'
                }else if(this.webpublic){
                    return ""
                }else{
                    let height = 0
                    if(this.task.object.type === 'form'){
                        height = 3
                        if ($(".rta.page-header").length) {
                            if ($(".rta.page-header").is(":visible")) {
                                height = 35
                            } 
                        } 
                        return 'height:calc(100vh - '+height+'px);'
                    }else{
                        height = 40
                        if ($(".rta.page-header").length) {
                            if ($(".rta.page-header").is(":visible")) {
                                height += 50
                            } 
                        } 
                        return 'height:calc(100vh - '+height+'px);'
                    }
                }
            },
            cancelFilter:function(){
                this.show_filter =  !this.show_filter
                this.cancel_filter = !this.cancel_filter;
            },
            cancelFilterOutSide:function(){
                this.cancel_filter = !this.cancel_filter;
                this.check_filter = !this.check_filter;
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