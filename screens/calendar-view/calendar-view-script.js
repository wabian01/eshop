Vue.component('calendar-view', {
        template: '#calendar-view',
        props: ['object','body_area','task','id_random','list_data_object'],
        mixins: [handleButtonVisible],
        data: function () {
            return {
                item_content:"",
                event_attributes:"",
                item_html:'',
                title_html:'',
                iframe_html:'',
                data_end:'',
                idtem:"",
                item_html_bottom: "",
                id_iframe: "iframe-" + this.id_random,
                list_item:[],
                item_buttons:[]
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
            if(this.task.code!==9999){
                this.idtem='task-modal-'+this.task.code;
            }else{
                this.idtem=this.id_random;
            }
            this.event_attributes = this.body_area.attributes;
        },
        mounted(){
            if(this.task.code===vm.activeTaskCode || this.task.code===9999){
                let that = this;
                let calendarEl = document.getElementById(this.idtem).getElementsByClassName('calendar'+this.id_random)[0];
                let calendar = new FullCalendar.Calendar(calendarEl, {
                    headerToolbar: {
                        start: 'prev,today,next',
                        center: 'title',
                        end: 'dayGridMonth,dayGridWeek,dayGridDay'
                    },
                    buttonText: {
                        today:    'Today',
                        month:    'Month',
                        week:     'Week',
                        day:      'Day',
                    },
                    height: "auto",
                });
                calendar.render();
                $('#'+this.idtem+' .calendar'+this.id_random).block({
                    message: '<h3>Waiting <img src="../../img/loading-color.gif" /></h3>',
                    css: {background: 'none', border: 'none', color: '#fff'}
                });
                $('.fc-prev-button,.fc-next-button, .fc-today-button, .fc-dayGridMonth-button, .fc-dayGridWeek-button, .fc-dayGridDay-button').on( "click", function() {
                that.item_html_bottom ='';
            });  
            }
            
        },
        methods: {
            // Refer at map-leaflet file
            buttonData(index) {
                let button_replace = JSON.stringify(JSON.parse(JSON.stringify(this.body_area.attributes.item_buttons)))
                this.list_item = this.data_end[index]
                let button_visible = JSON.parse(button_replace)
                    button_visible = this.handleButtonVisible(button_visible,this.list_item)
                    button_replace = JSON.stringify(button_visible)
                for(var key in this.list_item){
                    if(this.list_item.hasOwnProperty(key) && this.list_item[key] != null){
                        button_replace = button_replace.toString().replace(new RegExp('"##'+key+'##"','g'),'"'+(this.list_item[key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+'"');
                        button_replace = button_replace.toString().replace(new RegExp('\'##'+key+'##\'','g'),"'"+(this.list_item[key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                        button_replace = button_replace.toString().replace(new RegExp('##'+key+'##','g'),(this.list_item[key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"')));
                    }
                }
                button_replace = button_replace.replace(/\\"'(.*?)'\\"/g,'\\"$1\\"')
                for (var key in vm.flatRuntimeAttributes) {
                    if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                        button_replace = button_replace.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                        button_replace = button_replace.replace('"','\"');
                    }
                }  
                for(var key in vm.current.parent){
                    try {
                        button_replace = button_replace.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].replace(/[\r\n]+/g," "));
                    } catch (error) {
                    }
                    button_replace = button_replace.replace('"','\"');
                }
                if(button_replace.indexOf('${getdata_dmobj')>-1){
                        button_replace = vm.getDataDmobj(button_replace)
                }
                if(button_replace.indexOf('##source:dmobj')>-1){
                    button_replace = vm.getSourceDmobj(button_replace)
                }
                button_replace = vm.jsonHolderData(button_replace,'buttonGroup')
                if(button_replace.indexOf('##')>-1){
                    button_replace = button_replace.replace(/\\\"##(.*?)##\\\"/g,"''");
                    button_replace = button_replace.replace(/##(.*?)##/g,"''");
                }
                this.item_buttons = JSON.parse(button_replace);
                this.handleDynamicButtons();
            },
            replaceABDynamic(data,indexbutton,dynamic_buttons){
                let that = this
                data=data.sort((a,b)=>a.orderNumber-b.orderNumber)
                data.forEach(dynamic_button => {
                    if(dynamic_button.actionID!=""){
                        dynamic_buttons.splice(indexbutton, 0, dynamic_button)
                        indexbutton++;
                    }
                })
                var itemJSONString = JSON.stringify(dynamic_buttons);
                for (var key in that.list_item) {
                    if (that.list_item.hasOwnProperty(key)) {
                        if(that.list_item[key] == null){
                            that.list_item[key] = "";
                        }
                        itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),that.list_item[key].toString().replace(/[\r\n]+/g," "));
                        itemJSONString = itemJSONString.replace('"','\"');
                    }
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
                if(itemJSONString.indexOf('${getdata_dmobj')>-1){
                        itemJSONString = vm.getDataDmobj(itemJSONString)
                }
                if(itemJSONString.indexOf('##source:dmobj')>-1){
                    itemJSONString = vm.getSourceDmobj(itemJSONString)
                }
                itemJSONString = vm.jsonHolderData(itemJSONString,'buttonGroup')
                if(itemJSONString.indexOf('##')>-1){
                    itemJSONString = itemJSONString.replace(/\\\"##(.*?)##\\\"/g,"''");
                    itemJSONString = itemJSONString.replace(/##(.*?)##/g,"''");
                }                
                that.item_buttons = JSON.parse(itemJSONString);
            },
            handleDynamicButtons: async function() {
                let that = this;
                let indexbutton = 0;
                let item_buttons = this.item_buttons.sort((a,b)=>a.orderNumber-b.orderNumber);
                let dynamic_buttons = JSON.parse(JSON.stringify(item_buttons));  
                let p = $.when();
                item_buttons.forEach((button,index) => {
                    p = p.then(function() { 
                        if(button.type=="dynamic"){
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
                                        that.replaceABDynamic(button_cache,indexbutton,dynamic_buttons)
                                        indexbutton = indexbutton + button_cache.length
                                        return;
                                    }
                                }
                            }
                        return    $.ajax({
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
                                    that.replaceABDynamic(data,indexbutton,dynamic_buttons)
                                    indexbutton = indexbutton + data.length

                                }, error: function (error) {
                                    toastr.error(error);
                                }
                            });
                        }                   
                    })  
                })   
            },
            onClickChild (event) {
                this.onEventClick(event);
            },
            closeModal (){
                $('.chartCode').modal('hide');
            },
            handleDataObject(){
                var that = this;
                let data = JSON.parse(JSON.stringify(this.list_data_object));
                that.data_end=data;
                that.handleInit();
                $('.eventForm [name="color"]').minicolors();
            },
            handleInit:function(){
                this.onViewRender()      
            },
            onEventClick:function(event, jsEvent, view){
                var regex = /^(#[a-z0-9]{6})$/;
                $sql ='';
                $sql2 ='';
                Object.keys(this.event_attributes).forEach(function(key){
                    if(key=='title'){
                        $sql2 += '<div class="form-group"><div class="col-md-12" style="border-bottom: 4px solid '+ event._def.ui['backgroundColor']+';"><b>'+event[key]+'</b></div><hr style="border:none;"></div>';
                    }
                    else if(key != 'parent_event' && key != 'id' && event.extendedProps[key] != '' && key != 'start' && key != 'color' && key != 'start_temp' && key != 'end_temp' && event.extendedProps[key] != null ){
                        if(key == 'description' && !event.extendedProps['item_template']){
                            $sql += '<div class="form-group"><div class="col-md-12" style="border-bottom: 1px solid #c1c1c1;"><label>'+ event.extendedProps[key]+'</label></div></div>';
                        }
                    }
                });
                $sql += '<div class="form-group"><div class="col-md-12" style="padding-top:0.5em;"><i class="fa fa-clock-o"></i></div></div>';
                $startTime = event.extendedProps['start_temp'].indexOf("00:01") ? event.extendedProps['start_temp'].replace("00:01","00:00") : event.extendedProps['start_temp'] ;
                $endTime = event.extendedProps['end_temp'].indexOf("00:01") ? event.extendedProps['end_temp'].replace("00:01","00:00") : event.extendedProps['end_temp'];
                $sql += '<div class="form-group"><div class="col-md-12"><label>'+moment($startTime).format('MMMM Do')+' ('+moment($startTime).format('dddd')+')</label><label style="float:right;text-transform: uppercase;">'+moment($startTime).format('h:mm:ss a')+'</label></div></div>';
                $sql += '<div class="form-group"><div class="col-md-12" style="border-bottom: 1px solid #c1c1c1;"><label>'+moment($endTime).format('MMMM Do')+' ('+moment($startTime).format('dddd')+')</label><label style="float:right;text-transform: uppercase;">'+moment($endTime).format('h:mm:ss a')+'</label></div></div>';
                $sql += '<div class="form-group"><div class="col-md-12" style="border-bottom: 1px solid #c1c1c1; padding-top:0.5em;"><div style="border: 2px solid black;float:right;width: 20px;height: 20px;background-color:'+ event._def.ui['backgroundColor']+'"></div><i class="fas fa-palette" style="margin-right:10px;"></i><label name = "color">'+ event._def.ui['backgroundColor']+'</label></div></div>';
                if(this.event_attributes.hasOwnProperty('item_template') && event.extendedProps['item_template']){
                    this.iframe_html= event.extendedProps['item_template'];
                    if(this.iframe_html.indexOf('<script')>-1){
                        let functionApp = `
                                <script>
                                    class App{
                                        static callActionButton(json){
                                            let moduleCode = '`+this.object.moduleCode+`';
                                            let subModuleCode = '`+this.object.subModuleCode+`';
                                            let componentCode = '`+this.object.componentCode+`';
                                            let code = '`+this.object.code+`';
                                            let rawComponentCode = '`+this.object.rawComponentCode+`';
                                            window.parent.vm.callActionButton(json,moduleCode,subModuleCode,componentCode,code,rawComponentCode)
                                        }}  
                                <\/script>`
                        this.iframe_html = this.iframe_html + functionApp
                    }
                }
                if (this.event_attributes.hasOwnProperty('item_buttons') && this.event_attributes.item_buttons.length > 0) { 
                    this.buttonData(event.extendedProps['index']);
                }
                this.item_html=$sql;
                this.title_html=$sql2;
                $('#'+this.idtem+' #chartCode').modal('show');
            },
            onViewRender:function(){
                var event={};
                let that=this;
                let parent_event="";
                let calendarEl = document.getElementById(this.idtem).getElementsByClassName('calendar'+this.id_random)[0];
                let calendar = new FullCalendar.Calendar(calendarEl, {
                    headerToolbar: {
                        start: 'prev,today,next',
                        center: 'title',
                        end: 'dayGridMonth,dayGridWeek,dayGridDay'
                    },
                    buttonText: {
                        today:    'Today',
                        month:    'Month',
                        week:     'Week',
                        day:      'Day',
                    },
                    views: {
                        timeGrid: {
                            allDaySlot: false,
                        },
                        dayGrid: {
                            dayMaxEventRows: 2,
                        }
                    },
                    dayMaxEventRows: true,
                    height : "auto",
                    editable: true,
                    selectable: true,
                    displayEventTime: false,
                    eventClick: function(info)
                    {
                        that.onEventClick(info.event, info.jsEvent, info.view)
                    },
                    dateClick: function(info) {
                        let events = calendar.getEvents();
                        let str = [];
                        Object.keys(events).forEach(function (key) {
                            let start_time = new Date(events[key]._def.extendedProps.start_temp)
                            let end_time = new Date(events[key]._def.extendedProps.end_temp)
                            if( events[key]._def.extendedProps.start_temp.indexOf(info.dateStr)>-1 || 
                                events[key]._def.extendedProps.end_temp.indexOf(info.dateStr)>-1 ||
                                (start_time < info.date && end_time > info.date))
                                {
                                    str.push(events[key])
                                }
                        });
                        that.item_html_bottom =  str;
                    }
                });
                console.log('nam-event_attributes', that.event_attributes);
                if (!that.event_attributes.hasOwnProperty('color')) {
                    that.event_attributes['color'] = undefined;
                } 
                for (i = 0; i < this.data_end.length; i++) {
                    event['index'] = i;
                    if(that.event_attributes.hasOwnProperty('parent_event')){
                        if(that.data_end[i][that.event_attributes['parent_event']] == parent_event){
                            continue;
                        }
                        parent_event=that.data_end[i][that.event_attributes['parent_event']];
                    }
                    Object.keys(this.event_attributes).forEach(function (key) {
                        if(key=='start' || key == 'end'){
                            if(that.data_end[i][that.event_attributes[key]] != null && that.data_end[i][that.event_attributes[key]] !=undefined){
                                that.data_end[i][that.event_attributes[key]] = that.data_end[i][that.event_attributes[key]].replace("00:00","00:01").replace(/23:[0-9]{2}/g,"23:00")
                                
                                let validator = moment(that.data_end[i][that.event_attributes[key]]).format("YYYY/MM/DD");
                                // Check different empty and wrong datetime format 
                                if (!validator.includes('Invalid date')) {
                                    // Include HH:mm:ss
                                    function isValidTimeFormat1(dateTimeString) {
                                        const dateTimeParts = dateTimeString.split(' ');
                                        
                                        if (dateTimeParts.length === 2) {
                                            const timePart = dateTimeParts[1];
                                            const timeParts = timePart.split(':');

                                            if (timeParts.length === 3) {
                                                const hour = parseInt(timeParts[0]);
                                                const minute = parseInt(timeParts[1]);
                                                const second = parseInt(timeParts[2]);

                                                if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59 && second >= 0 && second <= 59) {
                                                    return true;
                                                }
                                            }
                                        }

                                        return false;
                                    }
                                    // Include HH:mm
                                    function isValidTimeFormat2(dateTimeString) {
                                        const dateTimeParts = dateTimeString.split(' ');

                                        if (dateTimeParts.length === 2) {
                                            const timePart = dateTimeParts[1];
                                            const timeParts = timePart.split(':');

                                            if (timeParts.length === 2) {
                                                const hour = parseInt(timeParts[0]);
                                                const minute = parseInt(timeParts[1]);

                                                if (hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59) {
                                                    return true;
                                                }
                                            }
                                        }

                                        return false;
                                    }

                                    const testDateTimeString = that.data_end[i][that.event_attributes[key]];
                                    const isValid1 = isValidTimeFormat1(testDateTimeString);
                                    const isValid2 = isValidTimeFormat2(testDateTimeString);
                                    
                                    if (isValid1) {
                                        that.data_end[i][that.event_attributes[key]] = moment(that.data_end[i][that.event_attributes[key]]).format("YYYY-MM-DD HH:mm:ss")
                                    } else if (isValid2) {
                                        that.data_end[i][that.event_attributes[key]] = moment(that.data_end[i][that.event_attributes[key]]).format("YYYY-MM-DD HH:mm")
                                    } else {
                                        that.data_end[i][that.event_attributes[key]] = moment(that.data_end[i][that.event_attributes[key]]).format("YYYY-MM-DD")
                                    }    
                                }    
                            }
                            event[key+'_temp'] = that.data_end[i][that.event_attributes[key]];
                        }
                        if(key =="color" && that.data_end[i][that.event_attributes[key]] == undefined){
                            that.data_end[i][that.event_attributes[key]] = "#99cc00"; 
                        }

                        if(key == "item_template" && that.data_end[i][that.event_attributes[key]] == undefined){
                            let itemJSONString = that.event_attributes.item_template;
                            itemJSONString=itemJSONString.replace(/##(.*?)##/g,function (match, capture) {
                                let value=jsonPath(that.data_end[i],capture);
                                if(value===false || value === undefined){
                                    value=match
                                }else{
                                    value=value[0]!==null?value[0]:""
                                }
                                value=value.toString().replace(/\"/g,"\\\"").replace(/\s/g," ")
                                return value;
                            });
                            for (let key in that.data_end[i]) {
                                if(that.data_end[i][key]==null){
                                    that.data_end[i][key]='';
                                }
                                if (that.data_end[i].hasOwnProperty(key) && that.data_end[i][key]!==null ) {
                                    itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),that.data_end[i][key].toString().replace(/[\r\n\t]+/g," ").replace(/["]/g,'\\\"').replace(/<\\/g, "<\\\\"));
                                    itemJSONString = itemJSONString.replace('"','\"');
                                }
                            } 
                            for (let key in vm.flatRuntimeAttributes) {
                                if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                                    itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].toString().replace(/[\r\n\t]+/g," "));
                                    itemJSONString = itemJSONString.replace('"','\"');
                                }
                            }
                            for (let key in vm.current.parent) {
                                if (vm.current.parent.hasOwnProperty(key)) {
                                    itemJSONString = vm.current.parent[key] != null ? (itemJSONString.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].toString().replace(/[\r\n\t]+/g," "))) : itemJSONString;
                                    itemJSONString = itemJSONString.replace('"','\"');
                                }
                            }
                            if(itemJSONString.indexOf('##')>-1){
                                itemJSONString = itemJSONString.replace(/##(.*?)##/g,"");
                            }
                            that.data_end[i][that.event_attributes[key]] = itemJSONString
                        }
                        
                        event[key] = that.data_end[i][that.event_attributes[key]];
                    });
                    calendar.addEvent(event);
                }
                calendar.render();
                $('#'+this.idtem+' .calendar'+this.id_random).unblock();
            },
        },
        updated(){
            let iframe = document.getElementById(this.id_iframe);
            if(iframe!=null && iframe.contentWindow!=null){
                setTimeout(() => {
                    iframe.style.height = iframe.contentWindow.document.documentElement.scrollHeight  + 'px';
                }, 700);
            }
        }
    });