Vue.component('chart-view', {
    template: '#chart-view',
    props: ['object', 'body_area','task','item_filter_attributes','refresh_rate','skip_object','status_ref','list_data_object'],
    data: function () {
        return {
            chartCode: Math.random().toString(36).substring(10),
            listFilters:[],
            reset_filter:false,
            myChart:'',
            where: '',
            get:null,
            isFilter: false,
            reload_temp:'',
            filter_reload:"{}",
            filterTable_temp:{},
            ChainData:'',
            filterforVM:[],
            stateRule:false,
            apply_filter: false,
            lang:'en',
            quickfilter:{},
            cancel_filter:false,
        }
    },
    created: function () {
        this.lang = vm.lang
        if(this.object.hasOwnProperty('rule') && this.object.rule.length>0 && typeof(this.object.rule)=='object'){
            this.stateRule = true;
        }
        if(this.body_area.hasOwnProperty('filterConfig') && this.body_area.filterConfig.hasOwnProperty('quick')){
            this.quickfilter = {...this.body_area.filterConfig.quick}
        }
        if(this.task.code===9999){
            let object=this.object;
            for (var screen_code in object.screens) {
                    if (object.screens.hasOwnProperty(screen_code)) {
                        if(screen_code==this.body_area.screenCode){
                            for (var body_code in object.screens[screen_code]['body_area']) {
                                if (object.screens[screen_code]['body_area'].hasOwnProperty(body_code)) {
                                    if(object.screens[screen_code]['body_area'][body_code].type=='chartView' && object.screens[screen_code]['body_area'][body_code].hasOwnProperty('filters')){
                                        let filter_full = object.screens[screen_code]['body_area'][body_code].filters
                                        for(var f =0;f< object.screens[screen_code]['body_area'][body_code].filters.length;f++){
                                            var filter = object.screens[screen_code]['body_area'][body_code].filters[f];
                                            filter.code = 'filter-'+makeElemId();
                                            filter.screen_code = screen_code;
                                            if(!filter.hasOwnProperty('entries')){
                                                filter.entries= [];
                                            }
                                            filter.chart=object.screens[screen_code]['body_area'][body_code].code;
                                            let check = true;
                                            if(vm.activeListFilters.length>0){
                                                vm.activeListFilters.map(ft=>{
                                                    if(filter.screen_code === ft.screen_code){
                                                        check = false;
                                                        return;
                                                    }
                                                })
                                                if(check){
                                                    vm.activeListFilters = vm.activeListFilters.concat(filter_full);
                                                }
                                            }else{
                                                    vm.activeListFilters = vm.activeListFilters.concat(filter_full);
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
    mounted: function () {
        $('#task-modal-'+this.task.code+' .filter-button').hide();
        $('#task-modal-'+this.task.code+' .search-button').hide();
        if(this.task.code!==9999){
            
        }else{
            $('#'+this.object.componentCode+' .lds-spinner').css({'display':'block'})
        }
    },
    methods: {
        applyFilter: function(){
            this.apply_filter = !this.apply_filter;
            $('#'+this.chartCode).modal('hide');
        },
        cancelFilter: function(){
            $('#'+this.chartCode).modal('hide');
            this.cancel_filter = !this.cancel_filter;
        },
        filterEs:function(item_filter_attributes){
            let filter_attributes = JSON.parse(item_filter_attributes);
            let temp=[]
            let filter_query=[]
            let filter_query1=[]
            let time
            let json
            Object.keys(filter_attributes).map(function(key){
                if(filter_attributes[key]=='_all'){
                    return;
                }
                if(key.indexOf("date")>-1 || key.indexOf("time")>-1 || ((filter_attributes[key][0].length==24 || filter_attributes[key][0].length==40) && filter_attributes[key][0].indexOf("->")>-1) || filter_attributes[key][0].length==10 && new Date(filter_attributes[key][0])!='Invalid Date'){
                    if(filter_attributes[key][0].indexOf("->")>-1){   
                    filter_attributes[key]=filter_attributes[key][0].split(" -> ");
                    
                        filter_query.push('(moment(item.'+key+').unix()>=moment("'+filter_attributes[key][0]+'").unix() && moment(item.'+key+').unix()<=moment("'+filter_attributes[key][1]+'").unix())')
                    }
                    else if(filter_attributes[key][0].length==10 && moment(filter_attributes[key][0])!='Invalid Date'){
                        time='((0<=moment(item.'+key+').unix()-moment("'+filter_attributes[key][0]+'").unix() && moment(item.'+key+').unix()-moment("'+filter_attributes[key][0]+'").unix()<=86399 )'
                        for (let i = 1; i < filter_attributes[key].length; i++) {
                            time=time +'|| (0<=moment(item.'+key+').unix()-moment("'+filter_attributes[key][i]+'").unix() && moment(item.'+key+').unix()-moment("'+filter_attributes[key][i]+'").unix()<=86399 )'
                            
                        }
                        time=time +')';
                        filter_query.push(time);
                    }
                    else {
                        filter_query.push('(item.'+key+'=="'+filter_attributes[key].join('" || '+'item.'+key+'=="')+'")')
                    }
                }else{
                    filter_query.push('(item.'+key+'=="'+filter_attributes[key].join('" || '+'item.'+key+'=="')+'")')
                }
                
            })
            filter_query1.push(filter_query.join(' && '))
            if(filter_query1[0]==""){
                json=this.ChainData;
            }else{
                json=this.ChainData.filter(function(item) { return eval(filter_query1[0])});
                if(json.length==0){
                    if(this.body_area.layout.type === "bubbleChart"){
                        this.myChart.options.scales.xAxes[0].ticks.callback = function(value, index, values) {
                            return "";
                        }
                    }
                    this.reload_temp = "";
                    this.myChart.data.labels = [];
                    this.myChart.data.datasets = [];
                    this.myChart.update();
                    return;
                }
            }
            this.functionFilter(json)
        },
        functionFilter:function(json){
            $("."+this.chartCode+".parentload").css({'display': 'none'  });
            $("#rtaChart-"+this.chartCode).parent().css({'display': 'block'})
            let defaultColor = ["#2ecc71", "#3598DC", "#32C5D2", "#26C281", "#F3C200", "#F2784B", "#8E44AD", "#E7505A", "#8877A9", "#E5E5E5", "#1BA39C"]
            let data = this.getChartData(json, this.body_area.attributes);

            if(this.reload_temp == JSON.stringify(Object.assign({}, data))){
                return;
            }
            this.reload_temp=JSON.stringify(Object.assign({}, data));
            let labels = []
            for (let key in data) {
                for (let value of Object.keys(data[key])) {
                    if(!labels.includes(value)) {
                        labels.push(value)
                    }
                }
            }
            try {
                if(this.body_area.layout.xAxis.hasOwnProperty('sort')){
                    if(this.body_area.layout.xAxis.sort == 'desc'){
                        labels = labels.sort();
                        labels = labels.reverse();
                    }
                    if(this.body_area.layout.xAxis.sort == 'asc'){
                        labels = labels.sort();
                    }
                }else{
                        labels = labels.sort();
                        if(chartTypes[bodyArea.layout.type] === 'horizontalBar'){
                            labels = labels.reverse();
                        }
                }
            } catch (error) {}
            
            let idx = 0
            let datasets = []
            for (let key in data) {
                if(key==""){
                    continue;
                }
                let chartData1 = []
                for (let value of labels) {
                    
                    let val = data[key][value] !== undefined ? data[key][value] : null
                    chartData1.push(val)
                }
                datasets.push({
                    backgroundColor: defaultColor[idx],
                    label: (key == "Demo") ? "" : key,
                    data: chartData1
                })
                
                idx++
                
            }
            if(this.body_area.layout.type === "lineChart" || this.body_area.layout.type === "radarChart"){
                    for (let i = 0; i < datasets.length; i++) {
                        datasets[i]["borderColor"] = defaultColor[i]
                        datasets[i]["backgroundColor"] = "transparent"
                        // datasets[i]["fill"] = true
                    }
                } else if(this.body_area.layout.type === "pieChart"){
                    let backgroundColor = []
                    for (let i = 0; i < labels.length; i++) {
                        backgroundColor.push(defaultColor[i % defaultColor.length])
                    }
                    datasets[0]["backgroundColor"] = backgroundColor
                } else if(this.body_area.layout.type === "bubbleChart"){
                    datasets = []
                    let index = 0
                    let radiusData = data
                    for (let key in data) {
                        let arrVals = []
                        let idx = 0
                        for (let value of labels) {
                            arrVals.push({
                                x: idx,
                                y: data[key][value] ? data[key][value] : 0,
                                r: radiusData[key][value] ? 30 : 0
                            })
                            idx ++
                        }
                        datasets.push({
                            backgroundColor: defaultColor[index]+'4a',
                            borderColor: defaultColor[index],
                            borderWidth: 5,
                            label: key,
                            data: arrVals
                        })
                        index ++
                    }
                    this.myChart.options.scales.xAxes[0].ticks.callback = function(value, index, values) {
                        return labels[index];
                    }
                }
                this.myChart.data.labels = labels;
                this.myChart.data.datasets = datasets;
                this.myChart.update();
        },
        filterChart:function(item_filter_attributes,check=false){      
            Object.assign(this.filterTable_temp,JSON.parse(item_filter_attributes))
            item_filter_attributes = JSON.stringify(this.filterTable_temp)
            this.filter_reload=item_filter_attributes;
            if((this.task.code===vm.activeTaskCode || (vm.activeTaskCode ==="" && this.task.code===9999 ))){
                this.filterEs(item_filter_attributes);
            }
            else if(this.task.code===vm.activeTaskCode || (vm.activeTaskCode ==="" && this.task.code===9999 )){
                if(!check){
                    $("."+this.chartCode+".parentload").css({'display': 'block'  });
                    $("#rtaChart-"+this.chartCode).parent().css({'display': 'none'})
                }
                
                let token = "your_token_here";
                let dm_name = this.object.dm_name;
                let max_order = 0;
                let format = "json";
                let mode = "download";
                let host1 = this.object.dm_host;
                var that = this;
                let where = '';
                let get=null;
                let test=[];
                where = this.where;
                get = this.get;
                for (var i = 0; i < vm.activeListFilters.length; i++) {
                    var screen_code = vm.activeListFilters[i].screen_code;
                    var column = vm.activeListFilters[i].column;
                    if(screen_code!=this.body_area.screenCode){
                        continue;
                    }
                    test=test.concat(column);
                }
                let arrfilter1 = [];
                for (const [key, value] of Object.entries(JSON.parse(item_filter_attributes))) {
                    if(test.includes(key)===false){
                        continue;
                    }
                    let arrfilter = [];
                    for(var key1 in value){
                        let filter_query = '';

                        if(value[key1].toString() != '_all'){
                            if(value[key1].toString().indexOf('->') != -1){
                            filter_query = key +' BETWEEN \''+value[key1].replace('-> ',' 00:00:00\' AND \'') +" 23:59:59'";
                        }
                        else{
                            filter_query = key +' LIKE \"%'+ value[key1] +'%\"';
                        }
                        arrfilter.push(filter_query);
                        }
                    }
                    arrfilter = arrfilter.join(' OR ')
                    
                    if(arrfilter.length > 0){
                        arrfilter = '( '+arrfilter+ ' )';
                        arrfilter1.push(arrfilter);
                    }
                }
                
                if(arrfilter1.length > 0){
                    arrfilter1 = arrfilter1.join(' AND ')
                    arrfilter1 = '( '+arrfilter1+ ' )';
                }
                if((this.where != null || this.where != "" ) && arrfilter1.length > 0){
                    where = '( ' + this.where + ' ) AND ' + arrfilter1;
                    
                }else if(where.length == 0 || where == null){
                    
                    where = arrfilter1;
                }
                if(this.isFilter != false){
                    this.isFilter.abort();
                }
                this.isFilter = $.ajax({
                    url: host1+'/api/dm/getData',
                    data: {token:token, dm_name:dm_name, max_order:max_order,format:format,mode:mode,where,...get},
                    type: 'GET',
                    dataType: 'json'
                })
                .done(function (json) {
                    that.functionFilter(json)
                })
            } 
        },
        getChartData: function(datasets, attributes) {
            var valx = "", valy = "";
            let reg = new RegExp("<"+this.lang+">(.*)<\/"+this.lang+">","g");
            if(attributes.value_y.indexOf('count(') != -1 || attributes.value_x.indexOf('sum(') != -1 || attributes.value_x.indexOf('min(') != -1|| attributes.value_x.indexOf('max(') != -1|| attributes.value_x.indexOf('avg(')!= -1){
                for(var key in datasets){
                    for(var key1 in datasets[key]){
                        var regex = '('+key1+')';
                        if(attributes.value_x.indexOf(regex) != -1){
                           valx = key1;
                        }
                    }
                }                    
            }
            if(attributes.value_y.indexOf('count(') != -1 || attributes.value_y.indexOf('sum(') != -1 || attributes.value_y.indexOf('min(') != -1|| attributes.value_y.indexOf('max(') != -1|| attributes.value_y.indexOf('avg(')!= -1){
                for(var key in datasets){
                    for(var key1 in datasets[key]){
                        var regex = '('+key1+')';
                        if(attributes.value_y.indexOf(regex) != -1){
                           valy = key1;
                        }
                    }
                }                    
            }
            
            return datasets.reduce((result, row) => {
                if(attributes.value_x.indexOf('##') > -1){
                    attributes.value_x = attributes.value_x.replaceAll('##','')
                }
                if(attributes.value_y.indexOf('##') > -1){
                    attributes.value_y = attributes.value_y.replaceAll('##','')
                }
                if(valx != ""){
                    var valueX = row[valx]
                }
                else if(attributes.value_x.indexOf('$.') > -1){
                    if(jsonPath(row,attributes.value_x)===false){

                    }else{
                        var valueX = jsonPath(row,attributes.value_x)
                    }
                }
                else{
                   var valueX = row[attributes.value_x]
                }
                if(valy != ""){
                    var valueY = row[valy]
                }
                else if(attributes.value_y.indexOf('$.') > -1){
                    var valueY = jsonPath(row,attributes.value_y)
                }
                else{
                    var valueY = row[attributes.value_y]
                }
                let line = attributes.value_y
                if(attributes.value_line != ""){
                    if(attributes.value_line != undefined && attributes.value_line.indexOf('$.') > -1){
                        line = jsonPath(row,attributes.value_line)
                    }else{
                        line = row[attributes.value_line]
                    }
                    if (attributes.value_line == undefined) {
                        line = "Demo"
                    }
                    try {
                        line.toString().replace(reg,function(key1,key2){
                            line = key2;
                        })
                    } catch (error) {}
                }
                try {
                    valueX.toString().replace(reg,function(key1,key2){
                        valueX = key2;
                    })
                } catch (error) {}
                
                if(!result[line]) {
                    result[line] = {}
                }
                if(result[line].hasOwnProperty(valueX) && attributes.value_y.indexOf('count(')>-1){
                    result[line][valueX] += 1;
                }
                else if(result[line].hasOwnProperty(valueX) && attributes.value_y.indexOf('min(')>-1){
                    if(parseFloat(result[line][valueX]) > parseFloat(valueY)){
                        result[line][valueX] = parseFloat(valueY);
                    } 
                }
                else if(result[line].hasOwnProperty(valueX) && attributes.value_y.indexOf('max(')>-1){
                    if(parseFloat(result[line][valueX]) < parseFloat(valueY)){
                        result[line][valueX] = parseFloat(valueY);
                    } 
                }
                else if(result[line].hasOwnProperty(valueX)) {
                    result[line][valueX] = parseFloat(result[line][valueX]) + parseFloat(valueY)
                }
                else if(valueX!=undefined){
                    if(attributes.value_y.indexOf('count(')>-1){
                        result[line][valueX] = 1;
                    }
                    else{
                        result[line][valueX] = parseFloat(valueY);
                    }
                }
                return result
            }, [])
        },
        handleDataObject(){
            let _this = this
            let that = this
            let chartTypes = {
                "lineChart": "line",
                "barChart": "bar",
                "stackChart": "bar",
                "groupBarChart": "bar",
                "pieChart": "pie",
                "hBarChart": "horizontalBar",
                "radarChart": "radar",
                "bubbleChart": "bubble",
                "hStackChart": "horizontalBar",
                "hGroupBarChart": "horizontalBar",
            }
            let chartCode = this.chartCode
            let ctx = $("#rtaChart-"+chartCode)
            $("#rtaChart-"+chartCode).after('<div class="loading"></div>')
            let token = "your_token_here";
            let dm_name = this.object.dm_name;
            let max_order = 0;
            let format = "json";
            let mode = "download";
            let bodyArea = this.body_area
            let where = "";
            let get=null;
            let elasticsearch="";
            let json = JSON.parse(JSON.stringify(this.list_data_object));
            _this.ChainData=json;
               
                if(Object.keys(that.quickfilter).length>0 && json.length>0){
                    if(!that.quickfilter.hasOwnProperty('entries')){
                        that.quickfilter.entries = []
                        let entries =  json.map(d => jsonPath(d,that.quickfilter.column)[0]);
                        that.quickfilter.entries = that.quickfilter.entries.concat(entries).filter((x, i, d) => d.indexOf(x) == i && x != '');
                    }
                }
                if(json.length>0){
                    let filterVM = vm.activeListFilters.map(function(filter,index) {
                    if(filter.screen_code===that.body_area.screenCode){
                        if((filter.hasOwnProperty('entries') && filter.entries[0]!=undefined && filter.entries[0].indexOf('lite_connection')>-1 ) || filter.hasOwnProperty('check')){
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
                                    let entries =  json.map(d => jsonPath(d,filter.column)[0]);
                                    if(filter.hasOwnProperty('entries') && filter.entries[0]!=undefined && (filter.entries[0]=='__daterange__' || filter.entries[0]=='__date__' || filter.entries[0]=='__userinput__' || filter.entries[0]=='__datelast__' || filter.entries[0]=='__daterecent__')){
                                        if(filter.entries[0]=='__datelast__' || filter.entries[0]=='__daterecent__') {
                                            filter.timeLast = new Date(Math.max.apply(null, json.map(function(e) {
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
                    }else{
                        let filterVM = vm.activeListFilters.map(function(filter,index) {
                            if(filter.screen_code===that.body_area.screenCode){
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
                                    if(filter.hasOwnProperty('entries') && filter.entries[0]!=undefined && (filter.entries[0]=='__daterange__' || filter.entries[0]=='__date__' || filter.entries[0]=='__userinput__' || filter.entries[0]=='__datelast__' || filter.entries[0]=='__daterecent__')){
                                        if(filter.entries[0]=='__datelast__' || filter.entries[0]=='__daterecent__') {
                                            filter.timeLast = new Date(Math.max.apply(null, json.map(function(e) {
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
                let data = []
                try {
                    data = _this.getChartData(json, bodyArea.attributes)
                } catch (error) {}
                that.reload_temp=JSON.stringify(Object.assign({}, data));
                let defaultColor = ["#2ecc71", "#3598DC", "#32C5D2", "#26C281", "#F3C200", "#F2784B", "#8E44AD", "#E7505A", "#8877A9", "#E5E5E5", "#1BA39C"]
                let labels = []
                for (let key in data) {
                    for (let value of Object.keys(data[key])) {
                        if(!labels.includes(value) && value!='') {
                            labels.push(value)
                        }
                    }
                }
                if(new Date(labels[0])!='Invalid Date' && Number(labels[0])!=labels[0] && labels.length>2){
                    if(bodyArea.layout.type === 'hBarChart'){
                        labels = labels.sort()
                        labels = labels.reverse();
                    }
                    if(bodyArea.layout.type !== 'hBarChart'){
                        labels = labels.sort()
                    }
                }
                try {
                    if(that.body_area.layout.xAxis.hasOwnProperty('sort')){
                        if(that.body_area.layout.xAxis.sort == 'desc'){
                            labels = labels.sort();
                            labels = labels.reverse();
                        }
                        if(that.body_area.layout.xAxis.sort == 'asc'){
                            labels = labels.sort();
                        }
                    }else{
                        labels = labels.sort();
                        if(chartTypes[bodyArea.layout.type] === 'horizontalBar'){
                            labels = labels.reverse();
                        }
                    }
                } catch (error) {}
                
                let idx = 0
                let datasets = []
                for (let key in data) {
                    let chartData = []
                    for (let value of labels) {
                
                        let val = data[key][value] !== undefined ? data[key][value] : null
                        chartData.push(val)
                    }
                    let tempStatus = false;
                    chartData.forEach(itemChart => {
                        if(!isNaN(itemChart) && itemChart != null && itemChart != ""){           
                            tempStatus = true;                     
                        }
                    });
                    if(tempStatus == true){
                        datasets.push({
                            backgroundColor: defaultColor[idx],
                            label: (key == "Demo") ? "" : key,
                            data: chartData
                        })
                    }
                    
                    idx++
                }
                let maxRotationX
                let minRotationX
                let maxRotationY
                let minRotationY
                if(that.body_area.layout.hasOwnProperty('xAxis')){
                    if(that.body_area.layout.xAxis.hasOwnProperty('labelRotation') && chartTypes[bodyArea.layout.type] != 'horizontalBar'){
                        maxRotationX = minRotationX = that.body_area.layout.xAxis.labelRotation   
                    }else if(that.body_area.layout.xAxis.hasOwnProperty('labelRotation') && chartTypes[bodyArea.layout.type] == 'horizontalBar'){
                        if(Number(that.body_area.layout.xAxis.labelRotation) > 0 && Number(that.body_area.layout.xAxis.labelRotation)<90){
                            maxRotationY = minRotationY = -that.body_area.layout.xAxis.labelRotation
                        }else{
                            maxRotationY = minRotationY = that.body_area.layout.xAxis.labelRotation
                        }
                    }
                }
                let options = {
                    spanGaps: true,
                    elements: {
                        line: {
                            tension: 0
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        display: bodyArea.layout.legend.enable,
                        position: "bottom"
                    },
                    scales: {
                        xAxes: [{
                            ticks: {
                                beginAtZero: true,
                                maxTicksLimit: 20,
                                maxRotation: maxRotationX,
                                minRotation: minRotationX,
                                padding:10
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                maxTicksLimit: 20,
                                maxRotation: maxRotationY,
                                minRotation: minRotationY
                            }
                        }]
                    }
                }

                if(bodyArea.layout.type === "lineChart" || bodyArea.layout.type === "radarChart"){
                    for (let i = 0; i < datasets.length; i++) {
                        datasets[i]["borderColor"] = defaultColor[i]
                        datasets[i]["backgroundColor"] = "transparent"
                    }
                    if(bodyArea.layout.type === "radarChart"){
                        // Update options to work on chartjs 2.8.0 version
                        options = {
                            tooltips: {
                                callbacks: {
                                    label: function(tooltipItem, data) {
                                        return data.datasets[tooltipItem.datasetIndex].label + ": " + tooltipItem.yLabel;
                                    }
                                }
                            }
                        }
                    }
                } else if(bodyArea.layout.type === "pieChart"){
                    let backgroundColor = []
                    for (let i = 0; i < labels.length; i++) {
                        backgroundColor.push(defaultColor[i % defaultColor.length])
                    }
                    datasets[0]["backgroundColor"] = backgroundColor
                    options = {}
                } else if(bodyArea.layout.type === "bubbleChart"){
                    datasets = []
                    let index = 0
                    let radiusData = _this.getChartData(json, bodyArea.attributes);

                    for (let key in data) {
                        let arrVals = []
                        let idx = 0
                        for (let value of labels) {
                            arrVals.push({
                                x: idx,
                                y: data[key][value] ? data[key][value] : 0,
                                r: radiusData[key][value] ? 30 : 0
                            })
                            idx ++
                        }
                        datasets.push({
                            backgroundColor: defaultColor[index]+'4a',
                            borderColor: defaultColor[index],
                            borderWidth: 5,
                            label: key,
                            data: arrVals
                        })
                        index ++
                    }

                    options.scales = {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                maxRotation: maxRotationY,
                                minRotation: minRotationY
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                stepSize: 1,
                                min: 0,
                                max: labels.length - 1,
                                maxRotation: maxRotationX,
                                minRotation: minRotationX,
                                padding:10,
                                callback: function(value, index, values) {
                                    return labels[index];
                                }
                            }
                        }]
                    }
                } else if(bodyArea.layout.type === "stackChart"){
                    options.scales.xAxes[0].stacked= true
                    options.scales.yAxes[0].stacked= true
                }else if(bodyArea.layout.type === "hStackChart"){
                    options.scales.xAxes[0].stacked= true
                    options.scales.yAxes[0].stacked= true
                }
                
                that.myChart = new Chart(ctx, {
                    type: chartTypes[bodyArea.layout.type],
                    data: {
                        labels: labels,
                        datasets: datasets
                    },
                    options: options
                });
                if(bodyArea.layout.hasOwnProperty('height')){
                    let height_chart = bodyArea.layout.height;
                    if (height_chart != null && height_chart != undefined && height_chart != "" ) {
                        if(typeof height_chart == "number" && Number(height_chart)<0){
                            that.myChart.canvas.style.height = '600px';
                            that.myChart.canvas.style.width = '600px';
                            that.myChart.canvas.parentNode.style.width = '600px';
                        }else{
                            if (typeof height_chart == "number") height_chart = height_chart.toString();
                            // no units
                            if (!height_chart.includes('%') && !height_chart.includes('px')) {
                                height_chart = height_chart + 'px'; 
                            } else {
                                if (height_chart.includes('%')) {
                                    height_chart = height_chart.replace('%','vh');
                                }
                            }
                            that.myChart.canvas.style.height = height_chart;
                            that.myChart.canvas.style.width = height_chart;
                            that.myChart.canvas.parentNode.style.width = height_chart;
                        }
                    }
                }else{
                    that.myChart.canvas.style.height = '600px';
                    that.myChart.canvas.style.width = '600px';
                    that.myChart.canvas.parentNode.style.width = '600px';
                }
                $("#rtaChart-"+chartCode).next('.loading').remove()
                $('#'+that.object.componentCode+' .lds-spinner').css({'display':'none'})
        },
        refreshRate: function(){
                let that = this;
                let token = "your_token_here";
                let dm_name = this.object.dm_name;
                let max_order = 0;
                let format = "json";
                let mode = "download";
                let bodyArea = this.body_area
                let where = "";
                let get=null;
                let elasticsearch="";
                if(this.object.query_params != null && this.object.query_params.hasOwnProperty('where') &&  this.object.query_params.where != null){
                    where = this.object.query_params.where;
                }
                if(this.object.query_params != null && this.object.query_params.hasOwnProperty('get') &&  this.object.query_params.get != null){
                    get = this.object.query_params.get;
                }
                if(this.object.query_params != null && this.object.query_params.hasOwnProperty('post_body') &&  this.object.query_params.post_body != null){
                    elasticsearch = this.object.query_params.post_body;
                }
                if(this.task.hasOwnProperty('where') != -1 && this.task.where != null && this.task.where.length > 0){
                    if(where != ""){
                        where = '(' + where + ') AND ' + this.task.where
                    }
                    else{
                        where = this.task.where;
                    }
                }
                if(this.task.hasOwnProperty('get') != -1 && this.task.get != null){
                    if(get != null){
                        Object.assign(get,this.task.get)
                    }
                    else{
                        get = this.task.get;
                    }
                }
                this.where = where
                this.get = get
                let host = this.object.dm_host;
                if(this.task.hasOwnProperty('post') && this.task.post != null){
                    elasticsearch = this.task.post;
                }
                if(this.object.dm_type == "Elasticsearch" && get != null && get !== "" && typeof(get) == 'string'){
                    get=JSON.parse(get);
                }
                if(this.object.dm_type == "Elasticsearch" && elasticsearch != "" && typeof(elasticsearch) == 'string'){
                    elasticsearch=JSON.parse(elasticsearch)
                }
                let order = "";
           
                if(this.body_area.hasOwnProperty('filterConfig') && Object.keys(this.body_area.filterConfig).length > 0){
                    if(this.body_area.filterConfig.hasOwnProperty('sortCol')!=true){
                        this.body_area.filterConfig['sortCol'] = this.object.key_attribute;
                    }
                    if(this.body_area.filterConfig.hasOwnProperty('order')!=true){
                        this.body_area.filterConfig['order'] = 'ASC';
                    }
                    order = "`"+this.body_area.filterConfig['sortCol']+"` "+this.body_area.filterConfig['order']+"";
                }
                else if(this.body_area.hasOwnProperty('sort')){
                    order = "`"+this.body_area.sort.column+"` "+this.body_area.sort.order+"";
                    this.body_area['filterConfig']={
                        'sortCol':this.body_area.sort.column,
                        'order':this.body_area.sort.order
                    }
                }
                else{
                    order = "`"+this.object.key_attribute+"` ASC";
                    this.body_area['filterConfig']={
                        'sortCol':this.object.key_attribute,
                        'order':'ASC'
                    }
                }
                $.ajax({
                url:that.object.dm_host + (that.object.dm_type=="V1" ? '/api/download/query' : that.object.dm_type=="V2" ? "/api/dm/getData" : that.object.dm_type=="Chained" ? '/api/dm/getChainedData' :  "/" +that.object.dm_name + '/_search'),
                data: (that.object.dm_type=="V1" || that.object.dm_type=="V2") ? {token:token, dm_name:dm_name, max_order:max_order,format:format,mode:mode,where,...get} : that.object.dm_type=="Chained" ?
                {
                    chain_name:that.object.dm_name,
                    token:that.object.token,
                    type:'group',
                    begin_at:'root',
                    conditions:where,
                    ...get
                } : (that.object.dm_type == "Elasticsearch" &&  elasticsearch !="" ) ? JSON.stringify(elasticsearch) : {...get},
                type: (that.object.dm_type == "Elasticsearch" &&  elasticsearch !="" ) ? 'POST' : 'GET',
                dataType:'json',
                contentType: (that.object.dm_type == "Elasticsearch" &&  elasticsearch != "" ) ? 'application/json' : false,
            })
            .done(function (json) {
                if( (that.object.dm_type=="Elasticsearch" && !that.object.hasOwnProperty('data_path')) || (that.object.dm_type=="Elasticsearch" && that.object.hasOwnProperty('data_path') && (that.object.data_path=='' || that.object.data_path==null))){
                    let elasticsearch_data=JSON.parse(JSON.stringify(json));
                    json=jsonPath(elasticsearch_data,'hits.hits[*]._source')
                }
                if(that.object.dm_type=="Elasticsearch" && that.object.hasOwnProperty('data_path') && that.object.data_path!='' && that.object.data_path!=null){
                    let elasticsearch_data=JSON.parse(JSON.stringify(json));
                    json=jsonPath(elasticsearch_data.aggregations,that.object.data_path)
                }
                if(that.stateRule && json.length>0){
                    vm.configRule(json,that.object.rule)
                }
                
                that.ChainData=json;
              
                
                let filterVM = vm.activeListFilters.map(function(filter) {
                    if(filter.screen_code===that.body_area.screenCode){
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
                            let entries =  json.map(d => d[filter.column]);
                            if(filter.hasOwnProperty('entries') && filter.entries[0]!=undefined && (filter.entries[0]=='__daterange__' || filter.entries[0]=='__date__' || filter.entries[0]=='__userinput__' || filter.entries[0]=='__datelast__' || filter.entries[0]=='__daterecent__')){
                                if(filter.entries[0]=='__datelast__' || filter.entries[0]=='__daterecent__') {
                                    filter.timeLast = new Date(Math.max.apply(null, json.map(function(e) {
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
                that.filterEs(that.filter_reload);
                    
                });
        }
    },
    watch: {
        list_data_object(list_data_object_new,list_data_object_old){
            if(list_data_object_old==="waiting_loading"){
                this.handleDataObject()
            }
        },
        status_ref(value){
            
        },
        refresh_rate:  function(){
            if(this.task.code===vm.activeTaskCode ){
                vm.activeListFilters = JSON.parse(this.filterforVM);
              
            }
        },
    }
});