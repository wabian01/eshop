    Vue.component('quick-filter', {
        template: '#quick-filter',
        props: ['object','quickfilter','list_items'],
        data: function () {
            return {
                listdata:[],
                id:'',
                html_range:'',
                language:{
                        vi:{second:"giây",mitute:"phút",hour:"giờ",day:"ngày",month:"tháng",year:"năm"},
                        en:{second:"second",mitute:"mitute",hour:"hour",day:"day",month:"month",year:"year"}
                    },
                lang:vm.lang,
                checktime:'',
                timeLast:'',
            }
        },
        created: function () {
            this.lang = this.language[this.lang]
            let id =  Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
            this.id = id;
            vm.activeFilterAndSearchCom['submodule']=this.object.subModuleCode
            vm.activeFilterAndSearchCom['component']=this.object.componentCode
            
            var that = this
            this.timeLast = moment(Math.max.apply(null, that.list_items.map(function(e) {
            return moment(e[that.quickfilter.column]).isValid() ? moment(e[that.quickfilter.column]) : moment(0);
            }))).toDate();

        },
        mounted(){
            var that = this
            if((this.quickfilter.hasOwnProperty('firstEntrySelectedByDefault') && this.quickfilter.firstEntrySelectedByDefault) || !this.quickfilter.hasOwnProperty('firstEntrySelectedByDefault')){
                if(this.quickfilter.entries[0] !== '__userinput__' && this.quickfilter.entries[0] !== '__date__' && this.quickfilter.entries[0] !== '__daterange__' && this.quickfilter.entries[0] !== '__daterecent__' && this.quickfilter.entries[0] !== '__datelast__'){
                    this.listdata = [].concat(this.quickfilter.entries[0])
                    this.handleFilter(this.listdata)
                }else if(this.quickfilter.entries[0] === '__daterecent__'){
                    this.addDataRecent(this.quickfilter.entries[1])
                }else if(this.quickfilter.entries[0] === '__datelast__'){
                    this.addDataLast(this.quickfilter.entries[1])
                }
            }
          
            $('#daterange_'+that.id).daterangepicker({
                autoUpdateInput: false,
                showDropdowns: true,
                drops:'auto',
                opens: "left",
                locale: { applyLabel: 'OK' } 
            
            });

            $('#daterange_'+that.id).on('apply.daterangepicker', function(ev, picker) {
                $(this).parent().next().val(picker.startDate.format('YYYY-MM-DD') + ' -> ' + picker.endDate.format('YYYY-MM-DD'))
                $('.'+that.id+'myBtn').trigger('click');
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
                
            
            $('#date_'+that.id).daterangepicker({
                singleDatePicker: true,
                autoUpdateInput: false,
                showDropdowns: true,
                drops:'auto',
                opens: "left",
                locale: { applyLabel: 'OK' }
            
            });
            $('#date_'+that.id).on('apply.daterangepicker', function(ev, picker) {
                $(this).parent().next().val(picker.startDate.format('YYYY-MM-DD'))
                $('.'+that.id+'myBtn').trigger('click');
            });

            $(".daterangepicker").click( function(e) {
                e.stopPropagation();
            });
            $(".daterangepicker").css({'z-index':'99999', 'overflow':'hidden','border': 'none',"box-shadow": "rgb(36 35 35 / 28%) 2px 2px 5px 1px"});
            $(".daterangepicker").addClass( " datepicker-rta" );
            $(".daterangepicker .ranges").remove();
                
        },
        methods: {
            addDataLast(data){
                if(this.checktime == data){
                    this.checktime = ''
                    this.listdata=[].concat('_all');
                    this.handleFilter(this.listdata)
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
                        timelast = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        timelast.setSeconds(timelast.getSeconds() - Number(arg[0]))
                        this.convertTime(timelast+' -> '+time)
                        break;
                    case "mitute":
                        time = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        timelast = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        timelast.setMinutes(timelast.getMinutes() - Number(arg[0]))
                        this.convertTime(timelast+' -> '+time)
                        break;
                    case "hour":
                        time = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        timelast = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        timelast.setHours(timelast.getHours() - Number(arg[0]))
                        this.convertTime(timelast+' -> '+time)
                        break;
                    case "day":
                        time = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        timelast = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        timelast.setDate(timelast.getDate() - Number(arg[0]))
                        this.convertTime(timelast+' -> '+time)
                        break;
                    case "month":
                        time = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        timelast = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        timelast.setMonth(timelast.getMonth() - Number(arg[0]))
                        this.convertTime(timelast+' -> '+time)
                        break;
                    case "year":
                        time = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        timelast = new Date(JSON.parse(JSON.stringify(this.timeLast)))
                        timelast.setFullYear(timelast.getFullYear() - Number(arg[0]))
                        this.convertTime(timelast+' -> '+time)
                        break;
                    default:
                        break;
                }
            },
            addDataRecent(data){
                if(this.checktime == data){
                    this.checktime = ''
                    this.listdata=[].concat('_all');
                    this.handleFilter(this.listdata)
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
                        nowrecent = new Date()
                        nowrecent.setSeconds(nowrecent.getSeconds() - Number(arg[0]))
                        this.convertTime(nowrecent+' -> '+now)
                        break;
                    case "mitute":
                        now = new Date()
                        nowrecent = new Date()
                        nowrecent.setMinutes(nowrecent.getMinutes() - Number(arg[0]))
                        this.convertTime(nowrecent+' -> '+now)
                        break;
                    case "hour":
                        now = new Date()
                        nowrecent = new Date()
                        nowrecent.setHours(nowrecent.getHours() - Number(arg[0]))
                        this.convertTime(nowrecent+' -> '+now)
                        break;
                    case "day":
                        now = new Date()
                        nowrecent = new Date()
                        nowrecent.setDate(nowrecent.getDate() - Number(arg[0]))
                        this.convertTime(nowrecent+' -> '+now)
                        break;
                    case "month":
                        now = new Date()
                        nowrecent = new Date()
                        nowrecent.setMonth(nowrecent.getMonth() - Number(arg[0]))
                        this.convertTime(nowrecent+' -> '+now)
                        break;
                    case "year":
                        now = new Date()
                        nowrecent = new Date()
                        nowrecent.setFullYear(nowrecent.getFullYear() - Number(arg[0]))
                        this.convertTime(nowrecent+' -> '+now)
                        break;
                    default:
                        break;
                }
            },
            convertTime(time){
                if(time.indexOf("->")>-1 && this.html_range!=''){
                    const index = this.listdata.indexOf(this.html_range);
                    if (index > -1) {
                        this.listdata.splice(index, 1);
                        this.listdata=this.listdata;
                    }
                }
                if(this.listdata.includes('_all')){
                        let all = this.listdata.indexOf('_all');
                        this.listdata.splice(all, 1);
                        this.listdata=this.listdata;
                    }
                if(this.listdata.includestime  || time==''){
                    this.listdata=this.listdata;
                }else{
                    this.listdata=[].concat(time);
                }
                this.html_range=time;
                this.handleFilter(this.listdata)
            },
            addDataTiem:function (event) {
                if(($(event.target).val()).indexOf("->")>-1 && this.html_range!=''){
                    const index = this.listdata.indexOf(this.html_range);
                    if (index > -1) {
                        this.listdata.splice(index, 1);
                        this.listdata=this.listdata;
                    }
                }
                if(this.listdata.includes('_all')){
                        let all = this.listdata.indexOf('_all');
                        this.listdata.splice(all, 1);
                        this.listdata=this.listdata;
                    }
                if(this.listdata.includes($(event.target).val())  || $(event.target).val()==''){
                    this.listdata=this.listdata;
                }else{
                    this.listdata=[].concat($(event.target).val());
                }
                this.html_range=$(event.target).val();
                $(event.target).val('');
                this.handleFilter(this.listdata)
            },
            addData(event){
                if(this.listdata.includes('_all')){
                        let all = this.listdata.indexOf('_all');
                        this.listdata.splice(all, 1);
                        this.listdata=this.listdata;
                    }
                    if(this.listdata.includes(event)){
                        const index = this.listdata.indexOf(event);
                        this.listdata.splice(index, 1);
                        this.listdata=this.listdata;
                        if (this.listdata=='') {
                        this.listdata=this.listdata.concat('_all');
                       
                        }
                    }else{
                        this.listdata=[].concat(event);
                       
                    }
                    this.handleFilter(this.listdata)
            },
            handleFilter:function(value){
                let charttabble = {}
                charttabble[this.quickfilter.column] = value
                setTimeout(() => {
                    this.$emit('filter_chartview', JSON.stringify(charttabble))
                }, 10);    
            },
        }
    })
