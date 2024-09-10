    Vue.component('slider-view', {
        template: '#slider-view',
        props: ['object','body_area','screen','task','list_data_object'],
        data(){
            return {
                'list_items':[],
                'page':1,
                'more':true,
                'limit':10,
                'scroll_to_end':false,
                'getStatus':"",
                'items_temp':[],
                'time_reload':"",
                'filter_temp':'{}',
                'search_temp':'',
                'ChainData':{},
                'searchChainData':'',
                'seachAndFilter':'',
                'dataApiTemp':true,
                'styleGridView':'',
                'filterforVM':[],
                'stateRule': false,
                styleHorizontal:"",
                checkHorizontal:false,
                noHorizontal:true,
                widthGridView:"",
                numberCol:1,
                checkRefesh:"",
                quickfilter:{},
                screen_item:{},
                random: 'myCarousel-'+Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10),
            }
        },
        watch: {
            list_data_object(list_data_object_new,list_data_object_old){
                if(list_data_object_old==="waiting_loading"){
                    this.handleDataObject()
                }
            },
        },
        created: function () {
            this.screen_item = JSON.parse(JSON.stringify(this.body_area))
            if(this.task.code===9999){
                let object=this.object;
                for (var screen_code in object.screens) {
                    if (object.screens.hasOwnProperty(screen_code)) {
                        if(screen_code==this.screen_item.screenCode){
                            for (var body_code in object.screens[screen_code]['body_area']) {
                                if (object.screens[screen_code]['body_area'].hasOwnProperty(body_code)) {
                                    if((object.screens[screen_code]['body_area'][body_code].type=='listView' || object.screens[screen_code]['body_area'][body_code].type=='gridView') && object.screens[screen_code]['body_area'][body_code].hasOwnProperty('filters')){
                                        for(var f =0;f< object.screens[screen_code]['body_area'][body_code].filters.length;f++){
                                            var filter = object.screens[screen_code]['body_area'][body_code].filters[f];
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
                                }
                            }
                        }
                    }
                }
            }
        },
        methods: {
            handleDataObject(reset=false,item_search_string='',item_filter_attributes=[]){
                item_search_string = item_search_string.replace(/[&\/\\#,+()@$~%.'":*?<>{}]/g,'');
                let temp = vm.activeScreenCode
                if(temp != ''){
                    if((this.screen_item.screenCode.indexOf(temp) == -1 && this.task.code !== 9999) || this.more == false){
                        return;
                    }
                }
                else{
                    if((this.screen_item.screenCode!=vm.activeScreenCode && this.task.code !== 9999) || this.more == false){
                        return;
                    }
                }
                
                var that = this;
                var where = "true";
                var get=null;
                var elasticsearch="";
                let whereChain="true";
                if(reset){
                    this.list_items =[];
                    this.page = 1;
                }
                var search_query = [];
                var filter_query = [];
                var column_list = [];
                var start = 0;
                let jsonItemTemplate = "";    
                let key_temp = [];
                if(typeof this.screen_item.item_template == 'string'){             
                        this.screen_item.item_template.replace(/##(.*?)##/g,function(me,to){
                            column_list.push(to)
                        })
                }
                else if(this.screen_item.item_template.hasOwnProperty('template_default') && typeof this.screen_item.item_template.template_default=='string'){
                    this.screen_item.item_template.template_default.replace(/##(.*?)##/g,function(me,to){
                            column_list.push(to)
                        })
                }
                else{                    
                    jsonItemTemplate = JSON.parse(JSON.stringify(this.screen_item.item_template));
                    if(jsonItemTemplate.hasOwnProperty('template_default')){
                        if(jsonItemTemplate.template_default.type == "web-page"){
                            jsonItemTemplate.template_default.attributes.content.replace(/##(.*?)##/g,function(me,to){
                                column_list.push(to)
                            })
                        }else{
                            for(var key in jsonItemTemplate.template_default.attributes){
                                if(jsonItemTemplate.template_default.type == 'article' && key == 'thumbnail'){
                                    
                                }
                                else{
                                    column_list.push(jsonItemTemplate.template_default.attributes[key])
                                }
                            }
                        }    
                    }
                    if(this.screen_item.item_template.hasOwnProperty('templates')){
                        this.screen_item.item_template.templates.forEach(element => {
                            if(!element.hasOwnProperty('html')){
                                return;
                            }
                        var start = 0;
                        if(element.hasOwnProperty('html')){
                            element.html.replace(/##(.*?)##/g,function(me,to){
                                column_list.push(to)
                            })
                        }
                    });
                    }
                }
                Object.keys(vm.flatRuntimeAttributes).map(key=>{
                    key_temp.push(key);
                })       
                column_list = column_list.filter(x => !key_temp.includes(x));
                this.searchChainData=column_list;
                var order = "";
                if(this.screen_item.hasOwnProperty('sort') && Object.keys(this.screen_item.sort).length > 0){
                    order = "`"+this.screen_item.sort.column+"` "+this.screen_item.sort.order+"";
                    this.screen_item['filterConfig']={
                        'sortCol':this.screen_item.sort.column,
                        'order':this.screen_item.sort.order
                    }
                }
                else if(this.screen_item.hasOwnProperty('filterConfig') && Object.keys(this.screen_item.filterConfig).length > 0){
                    if(this.screen_item.filterConfig.hasOwnProperty('sortCol')!=true){
                        this.screen_item.filterConfig['sortCol'] = this.object.key_attribute;
                    }
                    if(this.screen_item.filterConfig.hasOwnProperty('order')!=true){
                        this.screen_item.filterConfig['order'] = 'ASC';
                    }
                    order = "`"+this.screen_item.filterConfig['sortCol']+"` "+this.screen_item.filterConfig['order']+"";
                }
                else{
                    order = "`"+this.object.key_attribute+"` ASC";
                    this.screen_item['filterConfig']={
                        'sortCol':this.object.key_attribute,
                        'order':'ASC'
                    }
                }
                
                if(this.object.dm_type == 'JsonHolder'){
                    
                    that.list_items = {0:'notfound'};
                    setTimeout(() => {
                        this.loadCacheJsonHolder()
                        .then((value)=>{
                            let jsonholder = typeof(value) == 'string' ? JSON.parse(value) : value
                            if(jsonholder != null){
                                vm.jsonHolder = value
                                if(jsonholder[that.object.dm_name] == undefined || jsonholder[that.object.dm_name].length==0){
                                    that.list_items = {0:'notfound'};
                                }else{
                                    that.list_items = vm.paramJsonHolder(jsonholder,that.task,that.object);
                                }
                            }
                            $("#task-modal-"+that.task.code+" .sk-circle").css({'display': 'none'  });
                            $('.loadingItem').css({'display':'none'});
                            $("#task-modal-"+that.task.code+' .'+that.screen_item.screenCode).css({'display':'none'})
                            $('#'+that.object.componentCode+' .lds-spinner').css({'display':'none'})
                            $('#'+that.object.componentCode+' .nothing-display').css({'display':'block'})
                            that.more = false
                        })
                    }, 100);
                    return
                }
                let data = JSON.parse(JSON.stringify(this.list_data_object));
                if(data.length>0){
                            if(Object.keys(that.quickfilter).length>0){
                                if(!that.quickfilter.hasOwnProperty('entries')){
                                    that.quickfilter.entries = []
                                    let entries =  data.map(d => jsonPath(d,that.quickfilter.column)[0]);
                                    that.quickfilter.entries = that.quickfilter.entries.concat(entries).filter((x, i, d) => d.indexOf(x) == i && x != '');
                                }
                            }
                            if(that.object.hasOwnProperty('key_attribute') && (that.object.key_attribute != "" || that.object.key_attribute != null)){
                                let keyid = that.object.key_attribute;
                                data = data.filter((thing, index) => {
                                    const _thing = thing[keyid];
                                    return index === data.findIndex(obj => {
                                        return obj[keyid] === _thing;
                                    });
                                });
                            }
                            let filterVM = vm.activeListFilters.map(function(filter,index) {
                                if(filter.screen_code===that.screen_item.screenCode){
                                    if((filter.hasOwnProperty('entries') && filter.entries[0]!=undefined && filter.entries[0].toString().indexOf('lite_connection')>-1 ) || filter.hasOwnProperty('check')){
                                            if(!filter.hasOwnProperty('check')){
                                                filter['check'] = filter.entries[0];
                                            }else{
                                                filter.entries = []
                                                filter.entries[0] = filter['check']
                                            }
                                            
                                            let regExp = /\(([^)]+)\)/;
                                            let matches = regExp.exec(filter.entries[0])[1];
                                            if(that.object.lite_connection[matches]!=undefined){
                                                vm.dynamicFilter(that.object.lite_connection[matches],index)
                                            }else{
                                                filter.entries=[];
                                            }
                                    }
                                    else{
                                        let entries =  data.map(d => jsonPath(d,filter.column)[0]);
                                        if(filter.hasOwnProperty('entries') && filter.entries[0]!=undefined && (filter.entries[0]=='__daterange__' || filter.entries[0]=='__date__' || filter.entries[0]=='__userinput__')){
                                            filter.entries=[].concat(filter.entries[0])
                                        }else{
                                            filter.entries=[]
                                        }
                                        filter.entries = filter.entries.concat(entries).filter((x, i, d) => d.indexOf(x) == i && x != '');
                                    }
                                    
                                }
                                return filter;
                                
                            });
                            that.filterforVM = JSON.stringify(filterVM)
                        }else{
                            let filterVM = vm.activeListFilters.map(function(filter,index) {
                                if(filter.screen_code===that.screen_item.screenCode){
                                    if((filter.hasOwnProperty('entries') && filter.entries[0]!=undefined && filter.entries[0].toString().indexOf('lite_connection')>-1 ) || filter.hasOwnProperty('check')){
                                            if(!filter.hasOwnProperty('check')){
                                                filter['check'] = filter.entries[0];
                                            }else{
                                                filter.entries = []
                                                filter.entries[0] = filter['check']
                                            }
                                            
                                            let regExp = /\(([^)]+)\)/;
                                            let matches = regExp.exec(filter.entries[0])[1];
                                            if(that.object.lite_connection[matches]!=undefined){
                                                vm.dynamicFilter(that.object.lite_connection[matches],index)
                                            }else{
                                                filter.entries=[];
                                            }
                                    }else{
                                        let entries =  [];
                                        if(filter.hasOwnProperty('entries') && filter.entries[0]!=undefined && (filter.entries[0]=='__daterange__' || filter.entries[0]=='__date__' || filter.entries[0]=='__userinput__')){
                                            filter.entries=[].concat(filter.entries[0])
                                        }else{
                                            filter.entries=[]
                                        }
                                        filter.entries = filter.entries.concat(entries).filter((x, i, d) => d.indexOf(x) == i && x != '');
                                    }  
                                }
                                return filter;
                                
                            });
                            that.filterforVM = JSON.stringify(filterVM)
                        }
                        var flag = 0;
                        if(typeof data !='undefined') {
                            if (data.length > 0) {
                                if(data.length == 1){
                                    let check = 0;
                                    for(var key in data[0]){                                        
                                        if(data[0][key] != undefined && data[0][key] != null && data[0][key] != ""){
                                            check = 1;
                                        }
                                    }
                                    if(check == 0){
                                        that.more = false;
                                    }
                                }
                                data.forEach(element => {
                                    for(let key in element){
                                        if(element[key] !== ""){
                                            flag = 1;
                                        }                
                                    }
                                    if(flag == 0 ) {
                                        data.splice( data.indexOf(element), 1 );
                                    }
                                });

                                that.list_items = that.list_items.concat(data);
                                if( that.screen_item.hasOwnProperty('filterConfig') && Object.keys(that.screen_item.filterConfig).length > 0){
                                    if(that.screen_item.filterConfig.hasOwnProperty('sortCol') && that.screen_item.filterConfig.hasOwnProperty('order') && that.screen_item.filterConfig.order=='DESC'){
                                            that.list_items.sort(function(a, b) {
                                                if(new Date(jsonPath(a,that.screen_item.filterConfig.sortCol))!='Invalid Date' && isNaN(Number(jsonPath(a,that.screen_item.filterConfig.sortCol))) ){
                                                    return new Date(jsonPath(b,that.screen_item.filterConfig.sortCol))-new Date(jsonPath(a,that.screen_item.filterConfig.sortCol));
                                                }else if(!isNaN(parseFloat(jsonPath(a,that.screen_item.filterConfig.sortCol)))){
                                                    return (parseFloat(jsonPath(b,that.screen_item.filterConfig.sortCol)))-(parseFloat(jsonPath(a,that.screen_item.filterConfig.sortCol)));
                                                }else{
                                                    return (String(jsonPath(b,that.screen_item.filterConfig.sortCol))).localeCompare(String((jsonPath(a,that.screen_item.filterConfig.sortCol))));
                                                }
                                            })
                                            that.ChainData=that.list_items
                                            that.list_items=that.ChainData.slice(0,19)
                                    }else if(that.screen_item.filterConfig.hasOwnProperty('sortCol') && that.screen_item.filterConfig.hasOwnProperty('order') && that.screen_item.filterConfig.order=='ASC'){
                                            that.list_items.sort(function(b, a) {
                                                if(new Date(jsonPath(a,that.screen_item.filterConfig.sortCol))!='Invalid Date' && isNaN(Number(jsonPath(a,that.screen_item.filterConfig.sortCol))) ){
                                                    return new Date(jsonPath(b,that.screen_item.filterConfig.sortCol))-new Date(jsonPath(a,that.screen_item.filterConfig.sortCol));
                                                }else if(!isNaN(parseFloat(jsonPath(b,that.screen_item.filterConfig.sortCol)))){
                                                    return (parseFloat(jsonPath(b,that.screen_item.filterConfig.sortCol)))-(parseFloat(jsonPath(a,that.screen_item.filterConfig.sortCol)));
                                                }else{
                                                    return (String(jsonPath(b,that.screen_item.filterConfig.sortCol))).localeCompare(String((jsonPath(a,that.screen_item.filterConfig.sortCol))));
                                                }
                                            })
                                            that.ChainData=that.list_items
                                            that.list_items=that.ChainData.slice(0,19)
                                    }else{
                                            that.ChainData=that.list_items
                                            that.list_items=that.ChainData.slice(0,19)
                                    }
                                }else {
                                    that.ChainData=that.list_items
                                    that.list_items=that.ChainData.slice(0,19)
                                }

                                if(that.list_items.length == 0){
                                    Swal.fire({
                                        icon: 'info',
                                        title: 'Data not found',
                                        html: that.item_search_string ? "Not found any item match to <b>"+that.item_search_string+"</b>" : "Please make sure your account assigned data!",
                                        confirmButtonColor: '#009688',
                                        confirmButtonText: 'OK!'
                                        })
                                        .then((result) => {
                                        if (result.value) {
                                            that.page = 1;
                                            $(".sk-circle").css({'display': 'block'  });
                                            if(item_search_string != "" || Object.entries(item_filter_attributes).length > 0){
                                                that.getDMItems();
                                                that.item_search_string = "";
                                                $(".filter-button .reset_filter").click();
                                            }
                                            else{
                                                $(".sk-circle").css({'display': 'none'  });
                                            }
                                        }
                                    })
                                    $(".swal2-container").css({'z-index': '1000000'  });                            
                                }
                                $("#task-modal-"+that.task.code+" .sk-circle").css({'display': 'none'  });
                                $('.loadingItem').css({'display':'none'});
                                $("#task-modal-"+that.task.code+' .'+that.screen_item.screenCode).css({'display':'none'})
                                $('#'+that.object.componentCode+' .lds-spinner').css({'display':'none'})
                                $('#'+that.object.componentCode+' .nothing-display').css({'display':'block'})
                                that.page++;
                            } else {
                                if(that.page === 1 || reset){
                                    that.list_items = {0:'notfound'}
                                }
                                $('#'+that.object.componentCode+' .lds-spinner').css({'display':'none'})
                                $('#'+that.object.componentCode+' .nothing-display').css({'display':'block'})
                                $('.loadingItem').css({'display':'none'});
                                $("#task-modal-"+that.task.code+" .sk-circle").css({'display': 'none'  });
                                that.more = false;
                            }
                        }
                        that.animationSlide();
            },
            animationSlide(){
                if(this.body_area.hasOwnProperty('animation')){
                    let that = this
                    if(this.body_area.animation.enable && this.body_area.animation.delay > -1){
                        setTimeout(() => {
                            $("#"+that.random).carousel({
                                interval : that.body_area.animation.delay,
                                pause: false
                            });
                        }, 1000);
                    }
                }
            },
        },
        mounted: function(){
            let that = this
            setTimeout(() => {
                if(this.body_area.hasOwnProperty('layout') && this.body_area.layout.hasOwnProperty('height') && this.body_area.layout.height != ""){
                    if(String(this.body_area.layout.height).indexOf('px')>-1){
                        let height = String(Number(this.body_area.layout.height.replace('px','')) + 62) + 'px';
                        $("#"+this.$parent.id_random).css({'max-height': height });
                        $("#"+this.$parent.id_random).css({'overflow': 'auto' });   
                    }
                }
            }, 10);
            $("#"+this.random).on('slide.bs.carousel', function (e) {
                if($("#"+that.random+":visible").length == 0){
                    $("#"+that.random).carousel($(e.relatedTarget).index())
                }
                if($(e.relatedTarget).index()>=(that.page*9 - 1)){
                    if(that.list_items.length < that.ChainData.length){
                        that.page++
                        that.list_items = that.ChainData.slice(0,9*that.page)
                    }
                }
            })
        }
    })
