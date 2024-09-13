<template id="map-view">
    <div>
        <div class="loading-map" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); z-index:1000" >
            <img width="100px" src="https://cdn.rtworkspace.com/plugins/webapp/images/Spin-1s-200px-unscreen.gif"/>
        </div>
        <map-leaflet v-if="list_items.length > 0" :list_items_origin="list_items" :id_random='id_random' :body_area="body_area " :item_search_string = "item_search_string" :task="task" :object='object' :item_filter_attributes='item_filter_attributes' :refresh_rate="vm.refresh_rate" :update_map="vm.statusPopup"> </map-leaflet>
    </div>
</template>

<style>
    .modal-body {
        padding: 0!important;
    }
</style>

<script type="text/javascript">
    Vue.component('map-view', {
        template: '#map-view',
        props: ['object', 'body_area','item_search_string','item_filter_attributes','task','list_data_object'],
        data: function () {
            return {
                'list_items':[],
                'more':true,
                'limit':10,
            }
        },
        created: function () {      
            vm.activeBtnTheme = false;  
            if(this.body_area.attributes?.filters?.length > 0 && !this.body_area.hasOwnProperty('filters')){
                this.body_area.filters = this.body_area.attributes.filters
            }
            if(this.body_area.attributes?.filterConfig?.length > 0 && !this.body_area.hasOwnProperty('filterConfig')){
                this.body_area.filterConfig = this.body_area.attributes.filterConfig
            }
            if(this.body_area.hasOwnProperty('filters')){
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
                for(var f =0;f< this.body_area.filters.length;f++){
                    var filter = this.body_area.filters[f];
                    filter.code = 'filter-'+makeElemId();
                    filter.screen_code = this.body_area.screenCode;
                    if(!filter.hasOwnProperty('entries')) {
                        filter.entries = [];
                    }
                    filter.map = this.body_area.code;
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
                    } else {
                        vm.activeListFilters.push(filter);
                    }    
                }
            } 
        },
        mounted: function (){
            $(".sk-circle").css({'display': 'block'});
            var loadingMap = setInterval(function() {
                var childEle = $('.parents-map-leaflet').find(".leaflet-container");
                if(childEle.length > 0) {
                    $('.loading-map').fadeOut(1400);
                    clearInterval(loadingMap);
                }
            }, 500);     
        },
        methods: {
            handleDataObject(){
                var that = this;
                this.id_random=Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
                if(this.body_area.hasOwnProperty('sort') && Object.keys(this.body_area.sort).length > 0){
                    this.body_area['filterConfig']={
                        'sortCol':this.body_area.sort.column,
                        'order':this.body_area.sort.order
                    }
                }
                else if(this.body_area.hasOwnProperty('filterConfig') && Object.keys(this.body_area.filterConfig).length > 0){
                    if(this.body_area.filterConfig.hasOwnProperty('sortCol')!=true){
                        this.body_area.filterConfig['sortCol'] = this.object.key_attribute;
                    }
                    if(this.body_area.filterConfig.hasOwnProperty('order')!=true){
                        this.body_area.filterConfig['order'] = 'ASC';
                    }
                }
                else{
                    this.body_area['filterConfig']={
                        'sortCol':this.object.key_attribute,
                        'order':'ASC'
                    }
                }
                let data = JSON.parse(JSON.stringify(this.list_data_object));
                if(data==false){
                    data = ['notfound']
                }
                that.list_items = data;
                if(data.length > 0) {
                    let filterVM = vm.activeListFilters.map(function(filter,index) {
                        if(filter.screen_code===that.body_area.screenCode) {
                            if((filter.hasOwnProperty('entries') && filter.entries[0]!=undefined && filter.entries[0].indexOf('lite_connection')>-1 ) || filter.hasOwnProperty('check')) {
                                if(!filter.hasOwnProperty('check')) {
                                    filter['check'] = filter.entries[0];
                                } else {
                                    filter.entries = []
                                    filter.entries[0] = filter['check']
                                }
                                
                                let regExp = /\(([^)]+)\)/;
                                let matches = regExp.exec(filter.entries[0])[1];
                                if(that.object.lite_connection[matches]!=undefined) {
                                    vm.dynamicFilter(that.object.lite_connection[matches],index)
                                } else {
                                    filter.entries=[];
                                }
                            } else {
                                let entries =  data.map(d => jsonPath(d,filter.column)[0]);
                                if(filter.hasOwnProperty('entries') && filter.entries[0]!=undefined && (filter.entries[0]=='__daterange__' || filter.entries[0]=='__date__' || filter.entries[0]=='__userinput__' || filter.entries[0]=='__datelast__' || filter.entries[0]=='__daterecent__')){
                                    if(filter.entries[0]=='__datelast__' || filter.entries[0]=='__daterecent__') {
                                        filter.timeLast = new Date(Math.max.apply(null, data.map(function(e) {
                                            return new Date(e[filter.column]) == 'Invalid Date' ? 0 : new Date(e[filter.column]);
                                        })));
                                        return
                                    }
                                    filter.entries=[].concat(filter.entries[0])
                                } else {
                                    filter.entries=[]
                                }
                                filter.entries = filter.entries.concat(entries).filter((x, i, d) => d.indexOf(x) == i && x != '');
                            }            
                        }
                        return filter;        
                    });
                    that.filterforVM = JSON.stringify(filterVM)

                    if( that.body_area.hasOwnProperty('filterConfig') && Object.keys(that.body_area.filterConfig).length > 0){
                        if(that.body_area.filterConfig.hasOwnProperty('sortCol') && that.body_area.filterConfig.hasOwnProperty('order') && that.body_area.filterConfig.order=='DESC'){
                            data.sort(function(a, b) {
                                if(new Date(jsonPath(a,that.body_area.filterConfig.sortCol))!='Invalid Date' && isNaN(Number(jsonPath(a,that.body_area.filterConfig.sortCol))) ){
                                    return new Date(jsonPath(b,that.body_area.filterConfig.sortCol))-new Date(jsonPath(a,that.body_area.filterConfig.sortCol));
                                }else if(!isNaN(parseFloat(jsonPath(a,that.body_area.filterConfig.sortCol)))){
                                    return (parseFloat(jsonPath(b,that.body_area.filterConfig.sortCol)))-(parseFloat(jsonPath(a,that.body_area.filterConfig.sortCol)));
                                }else{
                                    return (String(jsonPath(b,that.body_area.filterConfig.sortCol))).localeCompare(String((jsonPath(a,that.body_area.filterConfig.sortCol))));
                                }
                            })
                        } else if (that.body_area.filterConfig.hasOwnProperty('sortCol') && that.body_area.filterConfig.hasOwnProperty('order') && that.body_area.filterConfig.order=='ASC') {
                            data.sort(function(b, a) {
                                if(new Date(jsonPath(a,that.body_area.filterConfig.sortCol))!='Invalid Date' && isNaN(Number(jsonPath(a,that.body_area.filterConfig.sortCol))) ){
                                    return new Date(jsonPath(b,that.body_area.filterConfig.sortCol))-new Date(jsonPath(a,that.body_area.filterConfig.sortCol));
                                }else if(!isNaN(parseFloat(jsonPath(b,that.body_area.filterConfig.sortCol)))){
                                    return (parseFloat(jsonPath(b,that.body_area.filterConfig.sortCol)))-(parseFloat(jsonPath(a,that.body_area.filterConfig.sortCol)));
                                }else{
                                    return (String(jsonPath(b,that.body_area.filterConfig.sortCol))).localeCompare(String((jsonPath(a,that.body_area.filterConfig.sortCol))));
                                }
                            })
                        }
                    }
                    if(that.$parent.$parent.$parent.hasOwnProperty('handleDataAB')){
                        that.$parent.$parent.$parent.handleDataAB(data[0])
                    }
                } else {
                    let filterVM = vm.activeListFilters.map(function(filter,index) {
                        if(filter.screen_code===that.body_area.screenCode) {
                            if((filter.hasOwnProperty('entries') && filter.entries[0]!=undefined && filter.entries[0].toString().indexOf('lite_connection')>-1 ) || filter.hasOwnProperty('check')) {
                                if(!filter.hasOwnProperty('check')) {
                                    filter['check'] = filter.entries[0];
                                } else {
                                    filter.entries = []
                                    filter.entries[0] = filter['check']
                                }
                                
                                let regExp = /\(([^)]+)\)/;
                                let matches = regExp.exec(filter.entries[0])[1];
                                if(that.object.lite_connection[matches]!=undefined) {
                                    vm.dynamicFilter(that.object.lite_connection[matches],index)
                                } else {
                                    filter.entries=[];
                                }
                            } else {
                                let entries = [];
                                if(filter.hasOwnProperty('entries') && filter.entries[0]!=undefined && (filter.entries[0]=='__daterange__' || filter.entries[0]=='__date__' || filter.entries[0]=='__userinput__' || filter.entries[0]=='__datelast__' || filter.entries[0]=='__daterecent__')){
                                    if(filter.entries[0]=='__datelast__' || filter.entries[0]=='__daterecent__') {
                                        filter.timeLast = new Date(Math.max.apply(null, data.map(function(e) {
                                            return new Date(e[filter.column]) == 'Invalid Date' ? 0 : new Date(e[filter.column]);
                                        })));
                                        return
                                    }
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
            }
        },
        watch: {
            list_data_object(list_data_object_new,list_data_object_old){
                if(list_data_object_old==="waiting_loading"){
                    this.handleDataObject()
                }
            },
        }
    });
</script>