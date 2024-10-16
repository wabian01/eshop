    Vue.component('list-view', {
        template: '#list-view',
        props: ['object','body_area','item_search_string','item_filter_attributes','task','screen','refresh_rate','status_ref','status_sort','json_holder','list_data_object'],
        mixins: [addBgColor],
        data: function () {
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
                bgColor: "",
                quick_tem:{},
                re_render_tem:true,
                dynamicTemplate:false,
                hasColumn: false,
                valColumn: [],
                selectedValue:'',
                typeSelected:'',
            }
        },
        created: function () {
            this.screen_item = JSON.parse(JSON.stringify(this.body_area))
            if(this.screen_item.hasOwnProperty('sort') && Object.keys(this.screen_item.sort).length > 0){
                if(this.screen_item.sort.hasOwnProperty('show_control') && this.screen_item.sort.show_control){
                    vm.sortFilter[this.task.code] = JSON.parse(JSON.stringify(this.screen_item.sort));
                    if(this.task.code == 9999){
                        try {
                            this.$parent.$parent.$parent.$parent.stateSort = true;
                            this.$parent.$parent.$parent.$parent.orderSort = vm.sortFilter[this.task.code].order;
                        } catch (error) {}
                    }else{
                        try {
                            this.$parent.$parent.$parent.stateSort = true;
                            this.$parent.$parent.$parent.orderSort = vm.sortFilter[this.task.code].order;
                        } catch (error) {}
                    }
                }else{
                    if(this.task.code == 9999){
                        try {
                            this.$parent.$parent.$parent.$parent.stateSort = false;
                        } catch (error) {}
                    }
                }
            }else{
                if(this.task.code == 9999){
                    try {
                        this.$parent.$parent.$parent.$parent.stateSort = false;
                    } catch (error) {}
                    
                }
            }
            let numCol = this.screen_item.numCol;
            if(this.screen_item.hasOwnProperty('numCol') && this.screen_item.numCol.toString().indexOf('|')>-1){
                if(screen.width<481){
                    numCol = this.screen_item.numCol.split('|')[0]
                }else{
                    numCol = this.screen_item.numCol.split('|')[1]
                }
            }
            if(this.object.hasOwnProperty('rule') && this.object.rule.length>0 && typeof(this.object.rule)=='object'){
                this.stateRule = true;
            }
            if(this.screen_item.type == "listView" && this.screen_item.hasOwnProperty('layout') && this.screen_item.layout.hasOwnProperty('orientation') && this.screen_item.layout.orientation=="horizontal"){
                this.checkHorizontal = true;
                let width = '100%';
                if(this.screen_item.layout.hasOwnProperty('width')){
                    if (this.screen_item.layout.width.toString().includes('-')) {
                        // when setting width: -1
                        width = '100%';
                    } else {
                        width = this.screen_item.layout.width;
                        if(!isNaN(Number(width))){
                            width = String(width) + 'px';
                        }
                    }    
                }
                this.styleHorizontal = (vm.newtemplate ?'':'border: 1px solid #0000002b;box-shadow: 0 0 2px 0px #0000001a;line-height: 1.1;padding: 10px 0px !important;border-radius: 10px !important;margin: 0px 6px 6px 0px;') + 'overflow: hidden;flex: 0 0 '+width+';width:'+width+';';

            }else if(this.screen_item.type == "gridView" && this.screen_item.hasOwnProperty('layout') && this.screen_item.layout.hasOwnProperty('orientation') && this.screen_item.layout.orientation=="horizontal"){
                this.noHorizontal = false;
                this.checkHorizontal = true;
                let width = '100%';
                if(this.screen_item.layout.hasOwnProperty('width')){
                    if (this.screen_item.layout.width.toString().includes('-')) {
                        // when setting width: -1
                        width = '100%';
                    } else {
                        width = this.screen_item.layout.width;
                        if(!isNaN(Number(width))){
                            width = String(width) + 'px';
                        }
                    }    
                }
                if(this.screen_item.hasOwnProperty('numCol')){
                    this.numberCol = numCol
                }
                this.styleHorizontal = (vm.newtemplate ?'':'border: 1px solid #0000002b;box-shadow: 0 0 2px 0px #0000001a;margin-bottom: 6px;padding: 10px !important;border-radius: 10px !important;') + 'overflow: hidden; height:120%;';
                this.widthGridView = 'width:'+width+';padding: 0px 3px;flex: 0 0 '+width+';';
            }
            if(this.screen_item.type === 'gridView' && this.noHorizontal){
                if(this.screen_item.hasOwnProperty('numCol')){
                    this.limit = this.limit*numCol;
                    let auto="";
                    let gap = (6*(numCol-1))/numCol
                    for (let i = 0; i < numCol; i++) {
                        auto += "calc("+(100/numCol)+"% - "+gap+"px) ";
                    }
                    this.styleGridView="gap:6px;display:grid;grid-template-columns:"+auto+";";
                }
            }
            vm.itemSearchString = '';
            vm.itemFilterAttributes="{}";
            if(this.screen_item.hasOwnProperty('filterConfig') && this.screen_item.filterConfig.hasOwnProperty('quick')){
                this.quickfilter = {...this.screen_item.filterConfig.quick}
            }
            if(this.body_area?.filterConfig?.typeFilter == 2){
                let json_filter = {
                    column: '__typeFilter2__',
                    entries: this.body_area?.filters ?? [],
                    screen_code: this.body_area.screenCode,
                    title: vm.lang==='vi'?'Từ khóa thông dụng':'Most popular keyworks',
                    type: 'typeFilter2'
                }
                this.body_area.filterConfig.typeFilter = 1
                vm.activeListFilters.push(json_filter)
            }
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
            let body_area_bg = JSON.parse(JSON.stringify(this.screen_item));

            this.addBgColor("",body_area_bg)

            // Change column with other types in default case (empty dynamic_style. except: articel/gallery/gallery2).
            if (this.screen_item.type === "gridView" && !this.screen_item.hasOwnProperty('dynamic_style')) {
                const columnDefault = "1,2,3,4";
                this.hasColumn = true;
                this.valColumn = columnDefault.split('|')[0].split(',');

                this.selectedValueLocal()
            }

            // Dynamic_style (with articel/gallery/gallery2)
            if (!this.screen_item.hasOwnProperty('dynamic_style') && !this.screen_item.hasOwnProperty('button_description') &&
                (this.screen_item.item_template?.template_default?.attributes?.thumbnail || this.screen_item.item_template?.template_default?.attributes?.image) &&
                (this.screen_item.item_template.template_default.type == 'article' ||
                this.screen_item.item_template.template_default.type == 'gallery'  ||
                this.screen_item.item_template.template_default.type == 'gallery2')
            ) {
                this.dynamicTemplate = true;
                if (this.screen_item.type === "gridView") {
                    const columnDefault = "1,2,3,4";
                    this.hasColumn = true;
                    this.valColumn = columnDefault.split('|')[0].split(',');
                }
            } else if (
                this.screen_item?.dynamic_style?.template === "dynamic" &&
                (this.screen_item.item_template?.template_default?.attributes?.thumbnail || this.screen_item.item_template?.template_default?.attributes?.image) &&
                (this.screen_item.item_template.template_default.type == 'article' ||
                this.screen_item.item_template.template_default.type == 'gallery'  ||
                this.screen_item.item_template.template_default.type == 'gallery2')
            ) {
                this.dynamicTemplate = true;

                if (
                    this.screen_item.type === "gridView" &&
                    this.screen_item.dynamic_style.column !== "" &&
                    this.screen_item.dynamic_style.column !== null &&
                    this.screen_item.dynamic_style.column !== undefined
                ) {
                    this.hasColumn = true;
                    if (this.screen_item.dynamic_style.column.includes('|')) {
                        this.valColumn = this.screen_item.dynamic_style.column.split('|')[1].split(',');
                    } else {
                        this.valColumn = this.screen_item.dynamic_style.column.split(',');
                    }
                }
            } else {
                this.dynamicTemplate = false;
                // Grid View - Only change column
                if (this.screen_item.type === "gridView" && this.screen_item.dynamic_style.column !== "") {
                    this.hasColumn = true;
                    if (this.screen_item.dynamic_style.column.includes('|')) {
                        this.valColumn = this.screen_item.dynamic_style.column.split('|')[1].split(',');
                    } else {
                        this.valColumn = this.screen_item.dynamic_style.column.split(',');
                    }
                }
            }
            // Setting default value column 
            this.selectedValueLocal()

        },
        mounted: function (){
            if(this.list_data_object == "waiting_loading"){
                    if(this.task.code!==9999){
                    $("#task-modal-"+vm.activeTaskCode+" .sk-circle").css({'display': 'block'});
                }else{
                    $('#'+this.object.componentCode+' .lds-spinner').css({'display':'block'})
                    $('#'+this.object.componentCode+' .nothing-display').css({'display':'none'})
                }
            }
            
            // Checking currentListViewStyle is availble
            if (localStorage.getItem("currentListViewStyle/"+this.screen.code) !== null) {
                this.typeSelected = localStorage.getItem("currentListViewStyle/"+this.screen.code);
                this.switchType(this.typeSelected);
            } else {
                // Render active default icon
                if (this.screen_item.item_template?.template_default?.type == 'article') {
                    this.typeSelected = 'article'
                } else if (this.screen_item.item_template?.template_default?.type == 'gallery') {
                    this.typeSelected = 'gallery'
                } else if (this.screen_item.item_template?.template_default?.type == 'gallery2') {
                    this.typeSelected = 'gallery2'
                } else {
                    // some other types: html, divkit, ...
                }
            }
            
        },
        methods: {
            selectedValueLocal(){
                if(localStorage.getItem("currentSelectedValue/"+this.screen.code) !== null && localStorage.getItem("currentSelectedValue/"+this.screen.code) !== "") {
                    this.selectedValue = localStorage.getItem("currentSelectedValue/"+this.screen.code);

                    // change column when using "orientation": "horizontal"
                    if (this.screen_item.type === "gridView" && 
                        this.screen_item.hasOwnProperty('layout') && 
                        this.screen_item.layout.hasOwnProperty('orientation') && 
                        this.screen_item.layout.orientation === "horizontal"
                    ) {
                        this.numberCol = localStorage.getItem("currentSelectedValue/"+this.screen.code);
                    }
                } else if (this.screen_item.numCol !== null && this.screen_item.numCol !== undefined && this.screen_item.numCol !== "") {
                    if (this.screen_item.numCol.toString().includes('|')) {
                        // using syntax x|y, the mobile screen takes x, and the desktop screen takes y.
                        this.selectedValue = this.screen_item.numCol.toString().split('|')[1];
                    } else {
                        this.selectedValue = this.screen_item.numCol.toString();
                    } 
                } else {
                    this.selectedValue = "1";
                }
            },
            displayValue: function(number) {
                if (this.screen_item.type === "gridView" && 
                    this.screen_item.hasOwnProperty('layout') && 
                    this.screen_item.layout.hasOwnProperty('orientation') && 
                    this.screen_item.layout.orientation === "horizontal"
                ) {
                    this.numberCol = number;
                }

                this.selectedValue = number;
                
                if (this.dynamicTemplate) {
                    this.switchType(this.typeSelected);
                } else {
                    this.re_render_tem = false
                    setTimeout(() => {
                        this.re_render_tem = true
                    }, 100);
                }

                localStorage.setItem("currentSelectedValue/"+this.screen.code, number)
            },
            switchType(type) {
                this.typeSelected = type;
                this.re_render_tem = false
                this.screen_item.item_template.template_default.type = type
                if (type === 'article') {
                    let ar = this.screen_item?.item_template?.template_default?.attributes?.image
                    ar ? this.screen_item.item_template.template_default.attributes.thumbnail = ar : ''
                } else {
                    let gv = this.screen_item?.item_template?.template_default?.attributes?.thumbnail 
                    gv ? this.screen_item.item_template.template_default.attributes.image = gv : ''
                }
                setTimeout(() => {
                    this.re_render_tem = true
                }, 100);
                
                localStorage.setItem("currentListViewStyle/"+this.screen.code, type)
            },
            loadCacheJsonHolder: async function () {
                const temp = await this.getFromCache('jsonHolder');
                return temp;        
            },
            getFromCache: async function(key){
                if ( typeof(Storage) !== 'undefined') {
                    // get sessionStorage
                    const value = await localforage.getItem(key)
                    return value;
                } else {
                    console.log('Your browser does not support localStorage');
                }
                return {};
            },
            handleDataObject: function () {

                this.initializeSearchChainData();
                this.setupFilterConfig();

                if (this.isJsonHolder()) {
                    this.handleJsonHolderData();
                    return;
                }

                let data = this.prepareData();
                if (data.length > 0) {
                    this.processDataFilters(data);
                    this.handleDataPresence(data);
                } else {
                    this.handleEmptyData();
                }
            },

            initializeSearchChainData: function() {
                if (this.searchChainData === '') {
                    this.searchChainData = this.buildSearchChainData();
                }
            },

            buildSearchChainData: function() {
                let column_list = [];
                let key_temp = Object.keys(vm.flatRuntimeAttributes);

                this.addAttributesToColumnList(column_list, this.screen_item?.item_template?.template_default?.attributes);
                this.addTemplateAttributesToColumnList(column_list, this.screen_item?.item_template?.templates);

                let template_temp = JSON.stringify(this.screen_item.item_template);
                template_temp.replace(/##(.*?)##/g, (_, to) => column_list.push(to));

                return column_list.filter(x => !key_temp.includes(x) && x !== '').filter((x, i, d) => d.indexOf(x) === i);
            },

            addAttributesToColumnList: function(column_list, attributes) {
                if (attributes) {
                    for (let key in attributes) {
                        if (typeof attributes[key] === 'string' && !attributes[key].includes('##') && !attributes[key].trim().includes(' ')) {
                            column_list.push(attributes[key]);
                        }
                    }
                }
            },

            addTemplateAttributesToColumnList: function(column_list, templates) {
                if (templates) {
                    templates.forEach(element => {
                        this.addAttributesToColumnList(column_list, element?.layout?.attributes);
                    });
                }
            },

            setupFilterConfig: function() {
                if (this.screen_item.hasOwnProperty('sort') && Object.keys(this.screen_item.sort).length > 0) {
                    this.screen_item.filterConfig = {
                        sortCol: this.screen_item.sort.column,
                        order: this.screen_item.sort.order
                    };
                } else if (this.screen_item.hasOwnProperty('filterConfig') && Object.keys(this.screen_item.filterConfig).length > 0) {
                    if (!this.screen_item.filterConfig.hasOwnProperty('sortCol')) {
                        this.screen_item.filterConfig.sortCol = this.object.key_attribute;
                    }
                    if (!this.screen_item.filterConfig.hasOwnProperty('order')) {
                        this.screen_item.filterConfig.order = 'ASC';
                    }
                } else {
                    this.screen_item.filterConfig = {
                        sortCol: this.object.key_attribute,
                        order: 'ASC'
                    };
                }
            },

            isJsonHolder: function() {
                return this.object.dm_type === 'JsonHolder';
            },

            handleJsonHolderData: function() {
                vm.refresh_rate = !vm.refresh_rate;
                this.list_items = {0:'notfound'};
                setTimeout(() => {
                    this.loadCacheJsonHolder()
                    .then((value) => {
                        let jsonholder = typeof(value) === 'string' ? JSON.parse(value) : value;
                        if (jsonholder != null) {
                            vm.jsonHolder = value;
                            if (jsonholder[this.object.dm_name] === undefined || jsonholder[this.object.dm_name].length === 0) {
                                this.list_items = {0:'notfound'};
                            } else {
                                this.list_items = vm.paramJsonHolder(jsonholder, this.task, this.object);
                            }
                        }
                        this.updateUIAfterDataLoad();
                    });
                }, 100);
            },

            prepareData: function() {
                return JSON.parse(JSON.stringify(this.list_data_object));
            },

            processDataFilters: function(data) {
                this.addQuickFilter(data);
                data = this.removeDuplicates(data);
                this.updateActiveListFilters(data);
            },

            addQuickFilter: function(data) {
                if (Object.keys(this.quickfilter).length > 0 && !this.quickfilter.hasOwnProperty('entries')) {
                    this.quickfilter.entries = [];
                    let entries = data.map(d => jsonPath(d, this.quickfilter.column)[0]);
                    this.quickfilter.entries = this.quickfilter.entries.concat(entries).filter((x, i, d) => d.indexOf(x) === i && x !== '');
                }
            },

            removeDuplicates: function(data) {
                if (this.object.hasOwnProperty('key_attribute') && this.object.key_attribute !== "") {
                    let keyid = this.object.key_attribute;
                    return data.filter((thing, index) => {
                        const _thing = thing[keyid];
                        return index === data.findIndex(obj => obj[keyid] === _thing);
                    });
                }
                return data;
            },

            updateActiveListFilters: function(data) {
                let that = this;
                let filterVM = vm.activeListFilters.map(function(filter, index) {
                    if (filter.screen_code === that.screen_item.screenCode && !filter.hasOwnProperty('type')) {
                        that.handleNonTypeFilter(filter, data, index);
                    } else if (filter.screen_code === that.screen_item.screenCode && filter.hasOwnProperty('type')) {
                        that.handleTypeFilter(filter, data);
                    }
                    return filter;
                });
                that.filterforVM = JSON.stringify(filterVM);
            },

            handleNonTypeFilter: function(filter, data, index) {
                if (this.isLiteConnectionFilter(filter)) {
                    this.handleLiteConnectionFilter(filter, index);
                } else {
                    this.handleFilter(filter, data);
                }
            },

            isLiteConnectionFilter: function(filter) {
                return (filter.hasOwnProperty('entries') && filter.entries[0] != undefined && filter.entries[0].toString().indexOf('lite_connection') > -1) || filter.hasOwnProperty('check');
            },

            handleLiteConnectionFilter: function(filter, index) {
                if (!filter.hasOwnProperty('check')) {
                    filter.check = filter.entries[0];
                } else {
                    filter.entries = [filter.check];
                }
                
                let regExp = /\(([^)]+)\)/;
                let matches = regExp.exec(filter.entries[0])[1];
                if (this.object.lite_connection[matches] != undefined) {
                    vm.dynamicFilter(this.object.lite_connection[matches], index);
                } else {
                    filter.entries = [];
                }
            },

            handleFilter: function(filter, data) {
                let entries = this.getFilterEntries(filter, data);
                
                if (this.isSpecialFilterType(filter)) {
                    this.handleSpecialFilterType(filter, data);
                } else {
                    filter.entries = [];
                }
                
                filter.entries = filter.entries.concat(entries).filter((x, i, d) => d.indexOf(x) === i && x !== '');
            },

            getFilterEntries: function(filter, data) {
                if (filter.column === undefined || filter.column === null) {
                    return data.map(d => d);
                } else {
                    return data.map(d => jsonPath(d, filter.column)[0]);
                }
            },

            isSpecialFilterType: function(filter) {
                return filter.hasOwnProperty('entries') && filter.entries[0] != undefined && 
                       ['__daterange__', '__date__', '__userinput__', '__datelast__', '__daterecent__'].includes(filter.entries[0]);
            },

            handleSpecialFilterType: function(filter, data) {
                if (filter.entries[0] === '__datelast__' || filter.entries[0] === '__daterecent__') {
                    filter.timeLast = new Date(Math.max.apply(null, data.map(function(e) {
                        return new Date(e[filter.column]) == 'Invalid Date' ? 0 : new Date(e[filter.column]);
                    })));
                    return;
                }
                filter.entries = [].concat(filter.entries[0]);
            },

            handleTypeFilter: function(filter, data) {
                filter.entries = filter.entries.map(value => {
                    const count = data.filter(obj => {
                        return Object.keys(obj).some(key => String(obj[key]).includes(value));
                    }).length;
                    return `${value} (${count})`;
                });
            },

            handleDataPresence: function(data) {
                if (data.length > 0) {
                    this.processValidData(data);
                } else {
                    this.handleEmptyData();
                }
            },

            processValidData: function(data) {
                this.removeEmptyElements(data);
                this.list_items = data;
                this.sortData();
                this.updateUIAfterDataLoad();
                this.page++;
                this.updateCache(data);
                this.callParentHandlers();
            },

            removeEmptyElements: function(data) {
                data.forEach((element, index) => {
                    if (Object.values(element).every(value => value === "")) {
                        data.splice(index, 1);
                    }
                });
            },

            sortData: function() {
                if (this.screen_item.hasOwnProperty('filterConfig') && Object.keys(this.screen_item.filterConfig).length > 0 && this.screen_item.sort?.column !== 'RANDOM()') {
                    this.sortListItems();
                } else {
                    this.ChainData = this.list_items;
                    this.list_items = this.ChainData.slice(0, 19);
                }
            },

            sortListItems: function() {
                const { sortCol, order } = this.screen_item.filterConfig;
                if (sortCol && order) {
                    this.list_items.sort((a, b) => this.compareValues(a, b, sortCol, order));
                    this.ChainData = this.list_items;
                    this.list_items = this.ChainData.slice(0, 19);
                }
            },

            compareValues: function(a, b, sortCol, order) {
                const aValue = jsonPath(a, sortCol);
                const bValue = jsonPath(b, sortCol);
                
                if (new Date(aValue) != 'Invalid Date' && isNaN(Number(aValue))) {
                    return order === 'DESC' ? new Date(bValue) - new Date(aValue) : new Date(aValue) - new Date(bValue);
                } else if (!isNaN(parseFloat(aValue))) {
                    return order === 'DESC' ? parseFloat(bValue) - parseFloat(aValue) : parseFloat(aValue) - parseFloat(bValue);
                } else {
                    return order === 'DESC' ? String(bValue).localeCompare(String(aValue)) : String(aValue).localeCompare(String(bValue));
                }
            },

            updateUIAfterDataLoad: function() {
                $("#task-modal-" + this.task.code + " .sk-circle").css({'display': 'none'});
                $('.loadingItem').css({'display': 'none'});
                $("#task-modal-" + this.task.code + ' .' + this.screen_item.screenCode).css({'display': 'none'});
                $('#' + this.object.componentCode + ' .lds-spinner').css({'display': 'none'});
                $('#' + this.object.componentCode + ' .nothing-display').css({'display': 'block'});
            },

            updateCache: function(data) {
                if (this.object.alias !== "" && data.length > 0) {
                    data.forEach(value => {
                        let id = value[this.object.key_attribute];
                        vm.dmobj[this.object.alias] = {...vm.dmobj[this.object.alias], ...{[id]: value}};
                    });
                    vm.saveToCache('dmobj', vm.dmobj);
                }
            },

            callParentHandlers: function() {
                if (this.$parent.$parent.$parent.hasOwnProperty('handleDataAB')) {
                    this.$parent.$parent.$parent.handleDataAB(this.ChainData[0]);
                }
                if (this.$parent.$parent.$parent.$parent.hasOwnProperty('handleDataAB')) {
                    this.$parent.$parent.$parent.$parent.handleDataAB(this.ChainData[0]);
                }
            },

            handleEmptyData: function() {
                if (this.page === 1) {
                    this.list_items = {0: 'notfound'};
                }
                this.updateUIAfterDataLoad();
                this.more = false;
            },
            handleScrollListView: function (event) {
                if(this.list_items[0] == 'notfound'){
                    return;
                }
                if(this.task.code===9999){
                    vm.activeFilterAndSearchCom['submodule']=this.object.subModuleCode
                    vm.activeFilterAndSearchCom['component']=this.object.componentCode
                }else{
                    vm.activeFilterAndSearchCom=[]
                }
                if(this.checkHorizontal){
                    if ($(event.target).scrollLeft() + $(event.target).width() >= $(event.target).prop('scrollWidth') - 100) {
                        this.scroll_to_end = true;
                    }
                    else{
                        this.scroll_to_end = false;
                    }
                    return;
                }
                if ($(event.target).scrollTop() + $(event.target).innerHeight() >= ($(event.target).prop('scrollHeight') -100) && this.more == true) {
                    $('.loadingItem').has('div.'+this.screen_item.screenCode).css({'display':'inline-block'})
                    this.scroll_to_end = true;
                }
                else{
                    this.scroll_to_end = false;
                }
                
            },
            fuSearchAndFilter: function(quick = "") {
                if (quick !== "") {
                    return this.handleQuickFilter(quick);
                }

                this.updateFilterAttributes();
                this.resetPagination();
                this.clearPreviousSearchAndFilter();

                const filter_attributes = JSON.parse(this.item_filter_attributes);
                const [filter_query, statusfilter, valuefilter] = this.buildFilterQuery(filter_attributes);
                
                this.updateFilterVisibility(filter_attributes, statusfilter, valuefilter);
                
                this.seachAndFilter = setTimeout(() => {
                    this.performSearchAndFilter(filter_query);
                }, 500);
            },

            handleQuickFilter: function(quick) {
                this.quick_tem = JSON.parse(quick);
                let quick_temp = JSON.parse(this.filter_temp);
                Object.assign(quick_temp, JSON.parse(quick));
                vm.itemFilterAttributes = JSON.stringify(quick_temp);
            },

            updateFilterAttributes: function() {
                let quick_and_normal = Object.assign(JSON.parse(this.item_filter_attributes), this.quick_tem);
                this.item_filter_attributes = JSON.stringify(quick_and_normal);
                vm.itemFilterAttributes = this.item_filter_attributes;
                this.filter_temp = this.item_filter_attributes;
                this.search_temp = this.item_search_string;
            },

            resetPagination: function() {
                this.page = 2;
            },

            clearPreviousSearchAndFilter: function() {
                if (this.seachAndFilter !== '') {
                    clearTimeout(this.seachAndFilter);
                }
            },

            buildFilterQuery: function(filter_attributes) {
                let filter_query = [];
                let statusfilter = 0;
                let valuefilter = '';

                if (filter_attributes.hasOwnProperty('__qr_scan__')) {
                    filter_query = this.handleQRScanFilter(filter_attributes, filter_query);
                }

                if (!filter_attributes.hasOwnProperty('__typeFilter2__')) {
                    [filter_query, statusfilter, valuefilter] = this.handleRegularFilter(filter_attributes, filter_query);
                } else {
                    [filter_query, statusfilter] = this.handleTypeFilter2(filter_attributes, filter_query);
                }

                return [filter_query, statusfilter, valuefilter];
            },

            handleQRScanFilter: function(filter_attributes, filter_query) {
                if (this.body_area?.filterConfig?.qr_scan) {
                    let qr_scan = this.body_area.filterConfig.qr_scan;
                    if (filter_attributes.__qr_scan__ !== '_all') {
                        filter_query.push(`jsonPath(item,"${qr_scan}") == "${filter_attributes.__qr_scan__}"`);
                    }
                    delete filter_attributes.__qr_scan__;
                }
                return filter_query;
            },

            handleRegularFilter: function(filter_attributes, filter_query) {
                let statusfilter = 0;
                let valuefilter = '';
                Object.keys(filter_attributes).forEach(key => {
                    if (this.ChainData[0].hasOwnProperty(key)) {
                        if (filter_attributes[key][0] === '_all') {
                            statusfilter++;
                            return;
                        }
                        valuefilter = key;
                        filter_query.push(this.createFilterFunction(key, filter_attributes[key]));
                    }
                });
                return [filter_query, statusfilter, valuefilter];
            },

            handleTypeFilter2: function(filter_attributes, filter_query) {
                let statusfilter = 0;
                if (filter_attributes['__typeFilter2__'] === '_all') {
                    statusfilter++;
                } else {
                    let new_key_tem = filter_attributes['__typeFilter2__'];
                    let pattern = /^([^(\s]+)/;
                    let new_key = new_key_tem.map(key => {
                        let match = pattern.exec(key);
                        return match[1];
                    });
                    filter_query.push(`Object.keys(item).some(key => {
                            let keyword = ${JSON.stringify(new_key)}
                            return keyword.some(value => String(item[key]).includes(value))
                        });`);
                }
                return [filter_query, statusfilter];
            },

            createFilterFunction: function(key, values) {
                if (this.isDateOrTimeFilter(key, values[0])) {
                    return this.createDateOrTimeFilterFunction(key, values);
                }
                return `(jsonPath(item,"${key}")=="${values.join('" || jsonPath(item,"'+key+'")=="')}")`;
            },

            isDateOrTimeFilter: function(key, value) {
                return key.includes("date") || key.includes("time") || 
                       ((value.length === 24 || value.length === 40) && value.includes("->")) || 
                       (value.length === 10 && new Date(value) != 'Invalid Date');
            },

            createDateOrTimeFilterFunction: function(key, values) {
                if (values[0].includes("->")) {
                    let [start, end] = values[0].split(" -> ");
                    return `(moment(jsonPath(item,"${key}")[0]).unix()>=moment("${start}").unix() && moment(jsonPath(item,"${key}")[0]).unix()<=moment("${end}").unix())`;
                } else if (values[0].length === 10 && moment(values[0]) !== 'Invalid Date') {
                    let time = values.map(value => 
                        `(0<=moment(jsonPath(item,"${key}")[0]).unix()-moment("${value}").unix() && moment(jsonPath(item,"${key}")[0]).unix()-moment("${value}").unix()<=86399)`
                    ).join(' || ');
                    return `(${time})`;
                }
                return `(jsonPath(item,"${key}")=="${values.join('" || jsonPath(item,"'+key+'")=="')}")`;
            },

            updateFilterVisibility: function(filter_attributes, statusfilter, valuefilter) {
                const shouldHideFilter = this.shouldHideFilter(filter_attributes, statusfilter, valuefilter);
                $(`#task-modal-${vm.activeTaskCode} .check_filter`).toggle(!shouldHideFilter);
                if (this.task.code === 9999) {
                    $('.autofit_subdetail .check_filter').toggle(!shouldHideFilter);
                }
            },

            shouldHideFilter: function(filter_attributes, statusfilter, valuefilter) {
                return statusfilter === Object.keys(filter_attributes).length || 
                       (statusfilter + 1 === Object.keys(filter_attributes).length && this.quickfilter.hasOwnProperty('column') && this.quickfilter.column === valuefilter) || 
                       (Object.keys(filter_attributes).length === 1 && this.quickfilter.hasOwnProperty('column') && this.quickfilter.column === valuefilter);
            },

            performSearchAndFilter: function(filter_query) {
                this.dataApiTemp = true;
                let search_query = this.searchChainData.map(field => `String(jsonPath(item,"${field}")).toLowerCase().includes("${this.item_search_string.toLowerCase()}")`).join(' || ');
                
                // NOSONAR: The use of eval in this context is necessary for dynamic filtering based on user input.
                if (this.item_search_string === '' && filter_query.length === 0) {
                    this.list_items = this.ChainData.slice(0, 19);
                } else if (search_query && this.item_search_string !== '' && filter_query.length === 0) {
                    this.dataApiTemp = this.ChainData.filter(item => eval("eval(search_query)"));
                    this.list_items = this.dataApiTemp.slice(0, 19);
                } else if (this.item_search_string === '' && filter_query.length > 0) {
                    this.dataApiTemp = this.ChainData.filter(item => eval("eval(filter_query.join(' && '))"));
                    this.list_items = this.dataApiTemp.slice(0, 19);
                } else {
                    this.dataApiTemp = this.ChainData.filter(item => eval("eval(filter_query.join(' && ')) && eval(search_query)"));
                    this.list_items = this.dataApiTemp.slice(0, 19);
                }

                if (this.dataApiTemp.length === 0 || this.ChainData.length === 0) {
                    this.list_items = {0: 'notfound'};
                }
            },
            
        },
        watch: {
            list_data_object(list_data_object_new,list_data_object_old){
                if(list_data_object_old==="waiting_loading"){
                    this.handleDataObject()
                }
            },
            json_holder(data){
                let temp = typeof(data) == 'string' ? JSON.parse(data) : data
                if(temp.hasOwnProperty(this.object.dm_name)){
                    if(temp[this.object.dm_name] == undefined || temp[this.object.dm_name].length==0){
                        this.list_items = {0:'notfound'};
                    }else{
                        this.list_items = vm.paramJsonHolder(temp,this.task,this.object);
                    }
                }else if(this.object.dm_type==='JsonHolder'){
                    this.list_items = {0:'notfound'};
                }
            },
            status_ref(){
                this.handleDataObject();
            },
            refresh_rate:  function(value){
                var that = this
                if(this.task.code===vm.activeTaskCode && this.task.code!=9999){
                    vm.itemFilterAttributes = this.filter_temp;
                    vm.itemSearchString = this.search_temp;
                }
                if(this.object.dm_type == 'JsonHolder'){
                    setTimeout(() => {
                        this.loadCacheJsonHolder()
                        .then((value)=>{
                            let jsonholder = typeof(value) == 'string' ? JSON.parse(value) : value
                            if(jsonholder != null){
                                vm.jsonHolder = typeof(value) == 'string' ? value : JSON.stringify(value)
                                if(jsonholder.hasOwnProperty(this.object.dm_name)){
                                    that.list_items = vm.paramJsonHolder(jsonholder,that.task,that.object);
                                }else{
                                    that.list_items = []
                                }
                            }
                        })
                    }, 100);
                    return
                }
            },
            scroll_to_end: function(scroll_to_end,item_search_string) { // watch it
               if((this.task.code===vm.activeTaskCode || (this.task.code===9999 && vm.activeFilterAndSearchCom.submodule==this.object.subModuleCode && vm.activeFilterAndSearchCom.component==this.object.componentCode))){
                    if(scroll_to_end&&this.dataApiTemp!=true){
                        this.page++
                        this.list_items=this.dataApiTemp.slice(0,9*this.page);
                        return false;
                    }else if(scroll_to_end&&this.dataApiTemp){
                        this.page++
                        this.list_items=this.ChainData.slice(0,9*this.page);
                        return false;
                    }
                    
                }
                var filter_attributes = JSON.parse(this.item_filter_attributes);
                if(scroll_to_end&&this.more){ 
                    this.getDMItems(false,this.item_search_string,filter_attributes);
                    $('.'+this.screen_item.screenCode).css({'display':'inline-block'})
                }
            },
            item_search_string: function(item_search_string) { // watch it
            if((this.task.code===vm.activeTaskCode || (vm.activeTaskCode ==="" && this.task.code===9999 && vm.activeFilterAndSearchCom.submodule==this.object.subModuleCode && vm.activeFilterAndSearchCom.component==this.object.componentCode))){
                    if(this.item_search_string == this.search_temp){
                            return;
                    }
                    this.fuSearchAndFilter()
                }else{
                    this.more = true;
                    if(this.task.code===vm.activeTaskCode || (vm.activeTaskCode ==="" && this.task.code===9999 && vm.activeFilterAndSearchCom.submodule==this.object.subModuleCode && vm.activeFilterAndSearchCom.component==this.object.componentCode)){
                        if(this.item_search_string == this.search_temp){
                            return;
                        }
                        this.search_temp = item_search_string;
                        $('#task-modal-'+vm.activeTaskCode+" .sk-circle").css({'display': 'block'  });
                        $('#'+this.object.componentCode+' .lds-spinner').css({'display':'block'})
                        $('#'+this.object.componentCode+' .nothing-display').css({'display':'none'})
                        this.getDMItems(true,item_search_string);
                    }
                }
                
            },
            item_filter_attributes: function(item_filter_attributes) { // watch it
                if(item_filter_attributes.indexOf('type2search')>-1){
                    let filter_type2 = JSON.parse(item_filter_attributes);
                    if(filter_type2.type2search[0] == '_all'){
                        vm.itemSearchString =''
                        return;
                    }
                    vm.itemSearchString = filter_type2.type2search[0]
                }
                if((this.task.code===vm.activeTaskCode || (vm.activeTaskCode ==="" && this.task.code===9999 && vm.activeFilterAndSearchCom.submodule==this.object.subModuleCode && vm.activeFilterAndSearchCom.component==this.object.componentCode))){
                    if(this.item_filter_attributes == this.filter_temp){
                            return;
                    }
                    this.fuSearchAndFilter()
                }else{
                    this.more = true;
                    let _this=this;
                    if(this.task.code===vm.activeTaskCode || (vm.activeTaskCode ==="" && this.task.code===9999 && vm.activeFilterAndSearchCom.submodule==this.object.subModuleCode && vm.activeFilterAndSearchCom.component==this.object.componentCode)){
                        if(this.item_filter_attributes == this.filter_temp){
                            return;
                        }
                        this.filter_temp = item_filter_attributes;
                        var filter_attributes = JSON.parse(item_filter_attributes);
                        $(".sk-circle").css({'display': 'block'  });
                        $('#'+this.object.componentCode+' .lds-spinner').css({'display':'block'})
                        $('#'+this.object.componentCode+' .nothing-display').css({'display':'none'})
                        this.getDMItems(true,this.item_search_string,filter_attributes);
                    }
                }
                
            },
            status_sort(sort){
                let that = this;
                if((this.task.code===vm.activeTaskCode || (vm.activeTaskCode ==="" && this.task.code===9999 && vm.activeFilterAndSearchCom.submodule==this.object.subModuleCode && vm.activeFilterAndSearchCom.component==this.object.componentCode))){
                    if(vm.sortFilter[this.task.code].hasOwnProperty('entries') && vm.sortFilter[this.task.code].entries.length>0){
                        if(vm.sortFilter[this.task.code].order=='DESC'){
                            this.ChainData.sort(function(a, b) {
                                if(new Date(jsonPath(a,vm.sortFilter[that.task.code].column))!='Invalid Date' && isNaN(Number(jsonPath(a,vm.sortFilter[that.task.code].column))) ){
                                    return new Date(jsonPath(b,vm.sortFilter[that.task.code].column))-new Date(jsonPath(a,vm.sortFilter[that.task.code].column));
                                }else if(!isNaN(parseFloat(jsonPath(a,vm.sortFilter[that.task.code].column)))){
                                    return (parseFloat(jsonPath(b,vm.sortFilter[that.task.code].column)))-(parseFloat(jsonPath(a,vm.sortFilter[that.task.code].column)));
                                }else{
                                    return (String(jsonPath(b,vm.sortFilter[that.task.code].column))).localeCompare(String((jsonPath(a,vm.sortFilter[that.task.code].column))));
                                }
                            })
                            this.fuSearchAndFilter()   
                        }else if(vm.sortFilter[this.task.code].order=='ASC'){
                            this.ChainData.sort(function(b, a) {
                                if(new Date(jsonPath(a,vm.sortFilter[that.task.code].column))!='Invalid Date' && isNaN(Number(jsonPath(a,vm.sortFilter[that.task.code].column))) ){
                                    return new Date(jsonPath(b,vm.sortFilter[that.task.code].column))-new Date(jsonPath(a,vm.sortFilter[that.task.code].column));
                                }else if(!isNaN(parseFloat(jsonPath(b,vm.sortFilter[that.task.code].column)))){
                                    return (parseFloat(jsonPath(b,vm.sortFilter[that.task.code].column)))-(parseFloat(jsonPath(a,vm.sortFilter[that.task.code].column)));
                                }else{
                                    return (String(jsonPath(b,vm.sortFilter[that.task.code].column))).localeCompare(String((jsonPath(a,vm.sortFilter[that.task.code].column))));
                                }
                            })
                            this.fuSearchAndFilter()
                        }
                    }else{
                        this.ChainData = this.ChainData.reverse()
                        this.fuSearchAndFilter()
                    }
                    $('#'+this.screen.code+' div div').scrollTop(0);
                }
            },
            list_items(list_items){
                if(list_items[0] == 'notfound'){
                    $("#"+this.$parent.id_random).css({'height': 'auto'  });
                }else{
                    this.$parent.setHeightBody();
                }
            },

        }
    });
