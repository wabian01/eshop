    Vue.component('search-option', {
        template: '#search-option',
        props: ['filter','reset_filter','taskcode','chartcode','show_all_object','show_filter','apply_filter','check_filter','cancel_filter'],
        data: function () {
            return {
                html_tests:[],
                html_range:'',
                isActive: false,
                activeDate: false,
                applyFilterHeader: false,
                drop:0,
                drop1:0,
                id:'',
                chartview:'{}',
                scrollData:'',
                scrollDataCurent:'',
                more:1,
                fuSeach:'',
                dataSort: '',
                html_tag_search: [],
                html_save_temp:[],
                val_saving_temp:[],
                val_saving_temp1:[],
                language:{
                        vi:{second:"giây",mitute:"phút",hour:"giờ",day:"ngày",month:"tháng",year:"năm"},
                        en:{second:"second",mitute:"mitute",hour:"hour",day:"day",month:"month",year:"year"}
                    },
                lang:vm.lang,
                timeLast:'',
                checktime:'',
            }
        },
        created: function () {
            if(!['table-view','chart-view'].includes(this.$parent.$vnode.componentOptions.Ctor.options.name)){
                this.applyFilterHeader = true
            }
            this.lang = this.language[this.lang]
            if(this.filter.entries[0]==='__datelast__'){
                this.timeLast = this.filter.timeLast
            }
            let id =  Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
            this.id = id;
            this.sortData()
        },
        methods: {
            addDataLast(data){
                if(this.checktime == data){
                    this.checktime = ''
                    this.html_tests=[].concat('_all');
                    return;
                }
                this.checktime = data
                let arg = data.split(' ')
                let time
                let timelast
                let options = {  
                            hour12 : false
                        };  
                switch (arg[1]) {
                    case "second":
                        time = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        time = time.toLocaleString("en-us", options).replace(',','')
                        timelast = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        timelast.setSeconds(timelast.getSeconds() - Number(arg[0]))
                        timelast = timelast.toLocaleString("en-us", options).replace(',','')
                        this.convertTime(timelast+' -> '+time)
                        break;
                    case "mitute":
                        time = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        time = time.toLocaleString("en-us", options).replace(',','')
                        timelast = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        timelast.setMinutes(timelast.getMinutes() - Number(arg[0]))
                        timelast = timelast.toLocaleString("en-us", options).replace(',','')
                        this.convertTime(timelast+' -> '+time)
                        break;
                    case "hour":
                        time = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        time = time.toLocaleString("en-us", options).replace(',','')
                        timelast = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        timelast.setHours(timelast.getHours() - Number(arg[0]))
                        timelast = timelast.toLocaleString("en-us", options).replace(',','')
                        this.convertTime(timelast+' -> '+time)
                        break;
                    case "day":
                        time = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        time = time.toLocaleString("en-us", options).replace(',','')
                        timelast = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        timelast.setDate(timelast.getDate() - Number(arg[0]))
                        timelast = timelast.toLocaleString("en-us", options).replace(',','')
                        this.convertTime(timelast+' -> '+time)
                        break;
                    case "month":
                        time = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        time = time.toLocaleString("en-us", options).replace(',','')
                        timelast = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        timelast.setMonth(timelast.getMonth() - Number(arg[0]))
                        timelast = timelast.toLocaleString("en-us", options).replace(',','')
                        this.convertTime(timelast+' -> '+time)
                        break;
                    case "year":
                        time = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        time = time.toLocaleString("en-us", options).replace(',','')
                        timelast = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        timelast.setFullYear(timelast.getFullYear() - Number(arg[0]))
                        timelast = timelast.toLocaleString("en-us", options).replace(',','')
                        this.convertTime(timelast+' -> '+time)
                        break;
                    default:
                        break;
                }
            },
            addDataRecent(data){
                if(this.checktime == data){
                    this.checktime = ''
                    this.html_tests=[].concat('_all');
                    return;
                }
                this.checktime = data
                let arg = data.split(' ')
                let now
                let nowrecent
                let options = {  
                            hour12 : false
                        };  
                switch (arg[1]) {
                    case "second":
                        now = new Date()
                        now = now.toLocaleString("en-us", options).replace(',','')
                        nowrecent = new Date()
                        nowrecent.setSeconds(nowrecent.getSeconds() - Number(arg[0]))
                        nowrecent = nowrecent.toLocaleString("en-us", options).replace(',','')
                        this.convertTime(nowrecent+' -> '+now)
                        break;
                    case "mitute":
                        now = new Date()
                        now = now.toLocaleString("en-us", options).replace(',','')
                        nowrecent = new Date()
                        nowrecent.setMinutes(nowrecent.getMinutes() - Number(arg[0]))
                        nowrecent = nowrecent.toLocaleString("en-us", options).replace(',','')
                        this.convertTime(nowrecent+' -> '+now)
                        break;
                    case "hour":
                        now = new Date()
                        now = now.toLocaleString("en-us", options).replace(',','')
                        nowrecent = new Date()
                        nowrecent.setHours(nowrecent.getHours() - Number(arg[0]))
                        nowrecent = nowrecent.toLocaleString("en-us", options).replace(',','')
                        this.convertTime(nowrecent+' -> '+now)
                        break;
                    case "day":
                        now = new Date()
                        now = now.toLocaleString("en-us", options).replace(',','')
                        nowrecent = new Date()
                        nowrecent.setDate(nowrecent.getDate() - Number(arg[0]))
                        nowrecent = nowrecent.toLocaleString("en-us", options).replace(',','')
                        this.convertTime(nowrecent+' -> '+now)
                        break;
                    case "month":
                        now = new Date()
                        now = now.toLocaleString("en-us", options).replace(',','')
                        nowrecent = new Date()
                        nowrecent.setMonth(nowrecent.getMonth() - Number(arg[0]))
                        nowrecent = nowrecent.toLocaleString("en-us", options).replace(',','')
                        this.convertTime(nowrecent+' -> '+now)
                        break;
                    case "year":
                        now = new Date()
                        now = now.toLocaleString("en-us", options).replace(',','')
                        nowrecent = new Date()
                        nowrecent.setFullYear(nowrecent.getFullYear() - Number(arg[0]))
                        nowrecent = nowrecent.toLocaleString("en-us", options).replace(',','')
                        this.convertTime(nowrecent+' -> '+now)
                        break;
                    default:
                        break;
                }
            },
            convertTime(time){
                if(time.indexOf("->")>-1 && this.html_range!=''){
                    const index = this.html_tests.indexOf(this.html_range);
                    if (index > -1) {
                        this.html_tests.splice(index, 1);
                        this.html_tests=this.html_tests;
                    }
                }
                if(this.html_tests.includes('_all')){
                        let all = this.html_tests.indexOf('_all');
                        this.html_tests.splice(all, 1);
                        this.html_tests=this.html_tests;
                    }
                if(this.html_tests.includestime  || time==''){
                    this.html_tests=this.html_tests;
                }else{
                    this.html_tests=[].concat(time);
                }
                this.html_range=time;
            },
            addDataScroll:function(){
                if(this.more==1 || $(event.target).val()==""){
                    this.more=1;
                    if(this.dataSort.length <= 2){
                        this.sortData()
                    }
                    this.scrollData=this.dataSort.slice(0,9);
                }
                this.isActive=true;
                this.$refs.dropdownWrapSelect.classList.add('open');
            },
            close:function(){
                setTimeout(() => {
                    this.isActive=false;
                    this.$refs.dropdownWrapSelect.classList.remove('open');
                }, 222);
            },
            scrollDataDown:function(event){
                if(this.scrollDataCurent.length==0){
                    if(this.dataSort.length <= 2){
                        this.sortData()
                    }
                    this.scrollDataCurent=this.dataSort;
                }
                if ($(event.target).scrollTop() + $(event.target).innerHeight() >= ($(event.target).prop('scrollHeight') -30)) {
                    this.more=this.more+1;
                    this.scrollData=this.scrollDataCurent.slice(0,9*this.more)
                }

            },
            testSearch: function(event){
                if(this.fuSeach!=''){
                    clearTimeout(this.fuSeach);
                }
                this.fuSeach= setTimeout(() => {
                    let dem=0;
                    let temp=[];
                    if(this.dataSort.length <= 2){
                        this.sortData()
                    }
                    this.dataSort.map(function(search){
                        if(search==null){return;}
                        if(dem<10000 && search.toString().toLowerCase().indexOf($(event.target).val().toLowerCase())>-1){
                            dem++;
                            temp=temp.concat(search);
                        }
                    })
                    this.scrollDataCurent=temp;
                    this.scrollData=temp.slice(0,9);
                    this.more=2;
                }, 500);        
            },
            replaceOption(option){
                return option.replaceAll('"',"'");
            },
            removeTag:function(value){
                const index = this.html_tests.indexOf(value);
                    if(this.html_tag_search.indexOf(this.html_tests[index]) >-1){
                        this.html_tag_search = []
                    }
                    if (index > -1) {
                        this.html_tests.splice(index, 1);
                        this.html_tests=this.html_tests;
                    }
                    if (this.html_tests=='') {
                        this.html_tests=this.html_tests.concat('_all');
                    }
                    if(this.html_save_temp.indexOf(value)==-1){
                        this.html_save_temp = [...this.html_save_temp,value]
                    }
                    
                    value = value.replaceAll('"',"'"); 
                    if($('.wrap-list-options label input:checkbox[value="'+value+'"]')){
                        $('.wrap-list-options label input:checkbox[value="'+value+'"]').removeAttr('checked');
                    }                
            },
            createTag:function (event) {
                if(($(event.target).val()).indexOf("->")>-1 && this.html_range!=''){
                    const index = this.html_tests.indexOf(this.html_range);
                    if (index > -1) {
                        this.html_tests.splice(index, 1);
                        this.html_tests=this.html_tests;
                    }
                }
                if(this.html_tests.includes('_all')){
                        let all = this.html_tests.indexOf('_all');
                        this.html_tests.splice(all, 1);
                        this.html_tests=this.html_tests;
                    }
                if(this.html_tests.includes($(event.target).val())  || $(event.target).val()==''){
                    this.html_tests=this.html_tests;
                }else{
                    this.html_tests=this.html_tests.concat($(event.target).val());
                    this.html_tag_search = this.scrollDataCurent.concat($(event.target).val())
                }
                this.html_range=$(event.target).val();
                $(event.target).val('');
                this.isActive=false;
                this.$refs.dropdownWrapSelect.classList.remove('open');
                this.activeDate=false;  
                this.$refs.searchTagInput.blur()
            },
            handleFilter2:function(value){
                var filter_attributes = JSON.parse(vm.itemFilterAttributes);
                if (this.applyFilterHeader == true) {
                    filter_attributes[this.filter.column]=value;
                    vm.itemFilterAttributes=JSON.stringify(filter_attributes);
                }
                
                if(this.filter.chart!==undefined || this.filter.table!==undefined){
                    let charttemp = JSON.parse('{}');
                    charttemp[this.filter.column]=value
                    this.chartview=JSON.stringify(charttemp)
                }
            },
            createTag1:function (event) {
                    if(this.html_tests.includes('_all')){
                        let all = this.html_tests.indexOf('_all');
                        this.html_tests.splice(all, 1);
                        this.html_tests=this.html_tests;
                    }
                    if(this.html_tests.includes(event)){
                        const index = this.html_tests.indexOf(event);
                        this.html_tests.splice(index, 1);
                        this.html_tests=this.html_tests;
                        if (this.html_tests=='') {
                        this.html_tests=this.html_tests.concat('_all');
                       
                        }
                    }else{
                        this.html_tests=this.html_tests.concat(event);
                       
                    }
                    this.isActive=false;
                    this.$refs.dropdownWrapSelect.classList.remove('open');
                    if(this.$refs.searchTagInput && this.$refs.searchTagInput.value){
                        this.$refs.searchTagInput.value = '';
                    }
                
            },
            handleFilter:function (event) {
                var filter_attributes = JSON.parse(vm.itemFilterAttributes);
                filter_attributes[this.filter.column]=$(event.target).val();
                vm.itemFilterAttributes=JSON.stringify(filter_attributes);
                if(this.filter.chart!==undefined || this.filter.table!==undefined){
                    let charttemp = JSON.parse('{}');
                    charttemp[this.filter.column]=value
                    this.chartview=JSON.stringify(charttemp)
                }
            },
            sortData: function(){
                if(this.filter.entries.length > 2 && this.filter.entries[0]=='__userinput__' || this.filter.entries[0]=='__daterange__' || this.filter.entries[0]=='__date__' || this.filter.entries[0]=='__datelast__' || this.filter.entries[0]=='__daterecent__'){
                    let first = this.filter.entries.shift()
                    this.filter.entries = this.filter.entries.sort()
                    this.filter.entries = [first].concat(this.filter.entries)
                } else if(this.filter.entries.length > 2){
                    this.filter.entries = this.filter.entries.sort()
                }
                this.dataSort = this.filter.entries
            }
        },
        watch:{
            cancel_filter:function(cancel_filter){
                if(this.filter.screen_code===vm.activeScreenCode || (this.show_all_object && Object.keys(vm.activeScreenCom).map((e)=> { return vm.activeScreenCom[e];}).indexOf(this.filter.screen_code) >-1)){
                    this.html_tests = [...this.val_saving_temp]
                    this.checktime = this.val_saving_temp1
                    this.html_save_temp = this.html_tests
                }
            },
            reset_filter:function(reset_filter){
                if(this.filter.screen_code===vm.activeScreenCode || (this.show_all_object && Object.keys(vm.activeScreenCom).map((e)=> { return vm.activeScreenCom[e];}).indexOf(this.filter.screen_code) >-1)){
                    this.html_save_temp = this.html_tests
                    this.html_tests=[];
                    this.checktime = '';
                    this.html_tag_search = [];
                    this.html_tests=this.html_tests.concat('_all');
                    $('.wrap-list-options label input:checkbox').removeAttr('checked');
                    let today = new Date();
                    if($('#daterange_'+this.id).data('daterangepicker')){
                        today = (today.getMonth()+1)+"/"+today.getDate()+"/"+today.getFullYear();
                        $('#daterange_'+this.id).data('daterangepicker').setStartDate(today);
                        $('#daterange_'+this.id).data('daterangepicker').setEndDate(today);
                    }
                    if($('#date_'+this.id).data('daterangepicker')){
                        today = (today.getMonth()+1)+"/"+today.getDate()+"/"+today.getFullYear();
                        $('#date_'+this.id).data('daterangepicker').setStartDate(today);
                        $('#date_'+this.id).data('daterangepicker').setEndDate(today);
                    }
                    
                }
                if(this.$refs.searchTagInput && this.$refs.searchTagInput.value){
                    this.$refs.searchTagInput.value = '';
                } 
            },
            chartview:function(chartview){
                if(this.filter.chart!==undefined || this.filter.table!==undefined){
                    this.$emit('filter_chartview', chartview)
                }
            },
            show_filter:function(show_filter){
                this.html_save_temp = []
                $(".btn-group.btn-theme-panel.filterdisplay").removeClass("open");
            },
            apply_filter:function(apply_filter){
                let that = this
                if(this.filter.screen_code===vm.activeScreenCode || (this.show_all_object && Object.keys(vm.activeScreenCom).map((e)=> { return vm.activeScreenCom[e];}).indexOf(this.filter.screen_code) >-1)){
                    let dataFilter = this.html_tag_search.length > 0 ? this.html_tests.concat(this.html_tag_search) : this.html_tests
                    this.val_saving_temp = [...this.html_tests]
                    this.val_saving_temp1 = this.checktime
                    if(dataFilter.length >0 ){
                        this.html_save_temp = []
                        this.handleFilter2(dataFilter);
                        $(".btn-group.btn-theme-panel.filterdisplay").removeClass("open");
                    }

                }   
            },
            check_filter: function(check_filter){
               this.sortData()
               const index = this.html_tests.indexOf('_all');
                if (index > -1) {
                    this.html_tests.splice(index, 1);
                }
                let temp = this.html_tests.concat(this.html_save_temp.filter((item) => this.html_tests.indexOf(item) < 0))
                this.html_tests = temp
            }
        },
        mounted(){
            if(this.filter.chart!==undefined || this.filter.table!==undefined){
                var that=this;
                if($('#daterange_'+that.id).offset()!=undefined){
                    $("#"+that.chartcode).css('display','block')
                    if($('#daterange_'+that.id).offset().top>50){
                        that.drop=$('#daterange_'+that.id).offset().top;
                    }
                    $("#"+that.chartcode).css('display','none')

                $('#daterange_'+that.id).daterangepicker({
                    autoUpdateInput: false,
                    showDropdowns: true,
                    drops:that.drop<=100 ? 'down' : 'up',
                    opens: "left",
                    locale: { applyLabel: 'OK' } 
                
                });

                $('#daterange_'+that.id).on('apply.daterangepicker', function(ev, picker) {
                    $(this).parent().next().val(picker.startDate.format('YYYY-MM-DD') + ' -> ' + picker.endDate.format('YYYY-MM-DD'))
                    $('.myBtn').trigger('click');
                });

                $('#daterange_'+that.id).on('cancel.daterangepicker', function(ev, picker) {
                    $(this).parent().next().val('')
                });
                $(".daterangepicker").click( function(e) {
                    e.stopPropagation();
                });
                $(".daterangepicker").css({'z-index':'99999', 'overflow':'hidden','border': 'none',"box-shadow": "rgb(36 35 35 / 28%) 2px 2px 5px 1px"});
                $(".daterangepicker").addClass( " datepicker-rta" );
                $(".daterangepicker .ranges").remove();
                }


                if($('#date_'+that.id).offset()!=undefined){
                    $("#"+that.chartcode).css('display','block')
                    if($('#date_'+that.id).offset().top>100){
                        that.drop1=$('#date_'+that.id).offset().top;
                    }
                    $("#"+that.chartcode).css('display','none')
                
                $('#date_'+that.id).daterangepicker({
                    singleDatePicker: true,
                    autoUpdateInput: false,
                    showDropdowns: true,
                    drops:that.drop1<=200 ? 'down' : 'up',
                    opens: "left",
                    locale: { applyLabel: 'OK' }
                
                });
                $('#date_'+that.id).on('apply.daterangepicker', function(ev, picker) {
                    $(this).parent().next().val(picker.startDate.format('YYYY-MM-DD'))
                    $('.myBtn').trigger('click');
                });

                $(".daterangepicker").click( function(e) {
                    e.stopPropagation();
                });
                $(".daterangepicker").css({'z-index':'99999', 'overflow':'hidden','border': 'none',"box-shadow": "rgb(36 35 35 / 28%) 2px 2px 5px 1px"});
                $(".daterangepicker").addClass( " datepicker-rta" );
                $(".daterangepicker .ranges").remove();
            }
            }
        },
        beforeUpdate(){
            
        },
        updated(){
                if(this.filter.entries[0]==='__datelast__'){
                    this.timeLast = this.filter.timeLast
                }
                if((this.taskcode===vm.activeTaskCode || this.taskcode===9999) && (this.filter.entries[0]==='__daterange__' || this.filter.entries[0]==='__date__')){
                    var that=this;
                    if($('#daterange_'+that.id).offset()!=undefined && (vm.itemFilterAttributes==='{}' || $('#daterange_'+that.id).offset().top<3)){
                        if($('#daterange_'+that.id).offset().top>100){
                            that.drop=$('#daterange_'+that.id).offset().top;
                        }
                    $('#daterange_'+that.id).daterangepicker({
                        autoUpdateInput: false,
                        showDropdowns: true,
                        drops:that.drop<=300 ? 'down' : 'up',
                        opens: "left",
                        locale: { applyLabel: 'OK' }
                    });

                    $('#daterange_'+that.id).on('apply.daterangepicker', function(ev, picker) {
                        $(this).parent().next().val(picker.startDate.format('YYYY-MM-DD') + ' -> ' + picker.endDate.format('YYYY-MM-DD'))
                        $('.myBtn').trigger('click');
                    });

                    $('#daterange_'+that.id).on('cancel.daterangepicker', function(ev, picker) {
                        $(this).parent().next().val('')
                    });
                    $(".daterangepicker").click( function(e) {
                        e.stopPropagation();
                    });
                    $(".daterangepicker").css({'z-index':'99999', 'overflow':'hidden','border': 'none',"box-shadow": "rgb(36 35 35 / 28%) 2px 2px 5px 1px"});
                    $(".daterangepicker").addClass( " datepicker-rta" );
                    $(".daterangepicker .ranges").remove();
                    
                    }


                    if($('#date_'+that.id).offset()!=undefined && (vm.itemFilterAttributes==='{}' || $('#date_'+that.id).offset().top<3)){
                        if($('#date_'+that.id).offset().top>100){
                            that.drop1=$('#date_'+that.id).offset().top;
                        }
                    $('#date_'+that.id).daterangepicker({
                        singleDatePicker: true,
                        autoUpdateInput: false,
                        showDropdowns: true,
                        drops:that.drop1<=300 ? 'down' : 'up',
                        opens: "left",
                        locale: { applyLabel: 'OK' }
                    });
                    $('#date_'+that.id).on('apply.daterangepicker', function(ev, picker) {
                        $(this).parent().next().val(picker.startDate.format('YYYY-MM-DD'))
                        $('.myBtn').trigger('click');
                    });

                    $(".daterangepicker").click( function(e) {
                        e.stopPropagation();
                    });
                    $(".daterangepicker").css({'z-index':'99999', 'overflow':'hidden','border': 'none',"box-shadow": "rgb(36 35 35 / 28%) 2px 2px 5px 1px"});
                    $(".daterangepicker").addClass( " datepicker-rta" );
                    $(".daterangepicker .ranges").remove();
                }
            }
        }
    });
