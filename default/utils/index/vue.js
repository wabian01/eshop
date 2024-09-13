Vue.config.devtools = true;
var vm = new Vue({
el: '#app',
mixins: [checkSessionExp,funcReplaceTitleAndName,modulesHeader,filterHidden,watchIndex,configRule,aggregateFunction,dynamicFilter,loginSession,DMCloudPhone,callActionButton,handleForm,funcRenderTask,getDataDmobj,jsonHolderData,getRuntime,getDmObject,getModuleCloudPhone,getSubModules,jumpToView,sendFinalizedInstances,getSystemModule,handleLocalForage,dataIndex,openTask],
data: {
    username: username,
    userId: userId,
    flatRuntimeAttributes:{
        primaryAppColor: "var(--color-theme-primary)"
    },
    lang: lang,
    utilityModule:"",
    bcardsModule:"",
    mcardsModule:"",
    stateHome:"",
    activeBgHomeview:false,
    updateThemeCss:true,
    resetModuleList: resetModuleList,
},

created: function () {
    var that= this;
    this.getRuntimeAttributes()
    this.getAppSetting()
    this.getOwnedDomains()

    this.loadCacheModules()
    .then(()=>{
        if(Object.keys(this.modules)==0 || this.resetModuleList){
            that.modules = {}
            that.module_power = {}
            this.getFullModules();
        }else{
            this.handleModules()
            this.moduleTimer = setInterval(function () {
                that.shouldCheckVisible = true
                that.handleModules()
            }, 900000);
        }
        this.handleModulesOnRcm()
    })
    .catch(err => {
        toastr.error(err);
    })
},
mounted(){
    var heighthome = 0;
    let heightcontent
    setTimeout(() => {
        $(window).resize((event) => {
            setTimeout(() => {
                heighthome = $('.home-view').width()
                heightcontent = $('.home-view div').outerHeight() - 25;
                if(heighthome>0 && heightcontent!=undefined){
                    this.renderUIHomeView(heightcontent)
                }
            }, 100);
            setTimeout(() => {
                $('.dm-table-view').DataTable().columns.adjust();
            }, 100);
        });
    }, 1000);

    if (navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
        $.fn.modal.Constructor.prototype.enforceFocus = function (){};
    }
    
    $(".more-icon").click(function(){
        if( $(".more-icon").hasClass("more-icon-actived") === false ) {
            $(".title-close").removeClass("display-none").addClass("display-block");
            $(".more-icon").removeClass("display-none").addClass("more-icon-actived display-flex");
        } else {
            $(".title-close").removeClass("display-block").addClass("display-none");
            $(".more-icon").addClass("display-none").removeClass("more-icon-actived display-flex");
        }
    });  
    
    $(".title-close").click(function(){
        $(".taskicon").remove();
        $(".title-close").removeClass("display-block").addClass("display-none");
        $(".more-icon").addClass("display-none").removeClass("more-icon-actived display-flex");  
    });  

    

},
methods: {
    CloseAllTask(){
        for (let i = 0; i < this.tasks.length; i++) {
            if(!this.tasks[i].isDeleted){
                this.tasks[i].isDeleted = true;
                    $('#task-modal-'+this.tasks[i].code).remove();
                    $('#task-icon-'+this.tasks[i].code).remove();
            }
        }
        this.statusPopup = true;
    },
    detectHeightHomeView(){
        if(this.stateHome === "SM_HOMEVIEW"){
            let heightfull = ($('#rightpanel').height()) + "px"
            $(".h-module").css({"margin-bottom":"0"})
            $("#autofit_module_main").css({"display":"block"})
            this.heightHomeView = "height:"+heightfull+";columns: unset !important;"
            setTimeout(() => {
                $(".splash-screen").addClass("display-none");  
            }, 1000);
            return
        }
        let test = setInterval(() => {
            if(this.timeCheckHeight == 10){
                clearInterval(test)
            }
            if(this.timeCheckHeight < 10 && this.level==0 && this.statusPopup){
                let heightcontent = $('.home-view div').outerHeight() - 25;
                this.timeCheckHeight++;
                this.renderUIHomeView(heightcontent)
            }
        }, 1000);
    },
    renderUIHomeView(heightcontent){
        if(this.stateHome === "SM_HOMEVIEW") {
            let heightfull = ($('#rightpanel').height()) + "px"
            this.heightHomeView = "height:"+heightfull+";columns: unset !important;"
            return
        }
        let heighthome = $('.home-view').width()
        let width_tem = $('#autofit_module_main').width()
        if(heighthome == width_tem){
            this.heightHomeView = 'height:auto;columns: unset !important;grid-row: 1/4;grid-column: 1/4;';
            vm.activeBgHomeview = false;
            return
        }
        // 1 row
        if(heightcontent<=((heighthome-16)*0.76/3)){
            this.heightHomeView = 'height:'+((heighthome-16)*0.76/3)+'px;columns: unset !important;grid-row: 1/1;grid-column: 1/4;';
            this.activeBgHomeview = true
        }else if(heightcontent<=(((heighthome-16)*0.76/3)*2+9)){
            // 2 row
            this.heightHomeView = 'height:'+(((heighthome-16)*0.76/3)*2+9)+'px;columns: unset !important;grid-row: 1/3;grid-column: 1/4;';
            vm.activeBgHomeview = false;
        }else{
            // 3 row
            this.heightHomeView = 'height:'+((heighthome)*0.76+5)+'px;columns: unset !important;grid-row: 1/4;grid-column: 1/4;';
            vm.activeBgHomeview = false;
        }
    },
    
    getModuleHomeView(modules){
        let module = []
        for(code in modules){
            if(modules[code].hasOwnProperty('functionCode') && modules[code].functionCode == "SM_HOMEVIEW"){
                module = modules[code];
            }
        }
        if(!this.statusHomeView){
            if(Object.keys(module).length>0){
                this.stateHome = "SM_HOMEVIEW"
                this.statusHomeView = true;
                setTimeout(() => {
                    this.renderUIHomeView(0)
                    this.detectHeightHomeView()
                }, 100);
            }else{
                this.stateHome = "none"
            }
        }
        if(this.statusHomeView && Object.keys(module).length==0){
            this.renderHomeView = false;
        }
        return module;
    },

    removeTab:function(listTab){
        if(this.backToModule.hasOwnProperty(listTab.code)){
            delete this.backToModule[listTab.code];
        }
        let list = false;
        let index = Object.keys(this.listTabs).indexOf(listTab.code)
        let indexCurent = Object.keys(this.listTabs).indexOf(this.tabModuleActive)
        delete this.listTabs[listTab.code];
        if(indexCurent === index && this.level !==0){
            if(index === 0 && Object.keys(this.listTabs).length>0){
                list = this.listTabs[Object.keys(this.listTabs)[index]];
            }
            if(index > 0){
                list = this.listTabs[Object.keys(this.listTabs)[index - 1]];
            }else if(Object.keys(this.listTabs).length===0){
                this.level=0;
                list = false;
            }
        }else{
            list = this.listTabs[Object.keys(this.listTabs)[indexCurent !== 0 ? indexCurent - 1 : 0]];
        }
        if(list!==false){
            if(this.level === 0){
                this.level = 3;
                this.level = 0;
            }else{
                if(list.type==='jumpToSubmoduleDetail'){
                    this.jumpToSubmoduleDetail(list.code,list.typeopen)
                }else if(list.type==='jumpToSubmodule'){
                    if(this.level === 1){
                        this.level = 3
                    }
                    this.jumpToSubmodule(list.code)
                }
            }
            
        }
        
    },
    moveTabCurent:function(listTab){
        if(listTab.type==='jumpToSubmoduleDetail'){
            this.jumpToSubmoduleDetail(listTab.code,listTab.typeopen)
        }else if(listTab.type==='jumpToSubmodule'){
            this.jumpToSubmodule(listTab.code)
        }
        
    },
    clearSearchModule:function(){
        this.$refs.searchModuleInput.value='';
        this.inputSearchModule='';
        this.searchModuleValue=[];
    },
    focusSearchInput:function(){
        this.$nextTick(function () {
            this.$refs.searchModuleInput.focus();
        });
    },
    searchModule:function(e){
        this.inputSearchModule=$(e.target).val();
        if($(e.target).val()==''){
            return this.searchModuleValue=[];
        }
        var that=this;
        var test={};
        this.searchModuleValue=[];
        let modules=this.filterHiddenModules(this.modules);
        
        for(let code in modules){
            if(modules.hasOwnProperty(code)){
                let module = modules[code];
                if(module.hasOwnProperty("title") && 
                    module.filtered_visible && 
                    (module.title.toLowerCase().indexOf($(e.target).val().toLowerCase())==0 || 
                        module.title.toLowerCase().indexOf(" "+$(e.target).val().toLowerCase())>-1)){
                    this.searchModuleValue=this.searchModuleValue.concat(module.title);
                }
                if(module.hasOwnProperty("subModules")){
                    let subModules=this.filterHiddenSubmodules(module.subModules)
                    for(let code in subModules){
                        let subModule = subModules[code];
                        if(subModule.hasOwnProperty("title") && 
                            subModule.title != null && 
                            subModule.title != undefined &&
                            subModule.filtered_visible && 
                            (subModule.title.toLowerCase().indexOf($(e.target).val().toLowerCase())==0 || 
                                subModule.title.toLowerCase().indexOf(" "+$(e.target).val().toLowerCase())>-1)){
                            this.searchModuleValue=this.searchModuleValue.concat(subModule.title);
                        }
                    }
                    Object.keys(subModules).forEach(function(key1) {
                        let tmp_components = subModules[key1].components;
                        Object.keys(tmp_components).forEach(function(key2) {
                            let tmp_objects = tmp_components[key2].objects;
                                tmp_objects=that.filterHiddenObjects(tmp_objects)
                            Object.keys(tmp_objects).forEach(function(key) {
                                if(tmp_objects[key].filtered_visible && 
                                    tmp_objects[key].title != null && 
                                    (tmp_objects[key].title.toLowerCase().indexOf($(e.target).val().toLowerCase())==0|| tmp_objects[key].title.toLowerCase().indexOf(" "+$(e.target).val().toLowerCase())>-1)){
                                    that.searchModuleValue=that.searchModuleValue.concat(tmp_objects[key].title)
                                }       
                        });
                        });      
                    });
                }   
            }   
        }
    },

    getFullModules:function () {
        var that = this;
        $.ajax({
            url: "/webapp/default/getFullModules" + "?offSet="+that.moduleOffset+"&limit="+that.moduleLimit,
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            beforeSend: function () {
                if(typeof(showNofSystem)==='undefined' || (typeof(showNofSystem)!=='undefined' &&  showNofSystem === 'yes')){
                    toastr.info(translations['Getting modules...'],'');
                }
            },
            success: function (data) {
                
                if(data.sttCode=="S1001") {
                    if(data.modules && Object.keys(data.modules).length > 0 ){
                        that.modules = {...that.modules,...data.modules};
                        if(data.hasOwnProperty('module_power')){
                            that.module_power = {...that.module_power,...data.module_power};
                        }
                        that.moduleOffset = that.moduleOffset + that.moduleLimit;
                        that.getFullModules();
                    }else{
                        that.saveToCache('rtcloud_webapp_modules',that.modules);
                        that.saveToCache('rtcloud_webapp_module_power',that.module_power);
                        if(typeof(showNofSystem)==='undefined' || (typeof(showNofSystem)!=='undefined' &&  showNofSystem === 'yes')){
                            toastr.success(translations['Modules have been updated!'],'');
                        }
                        setTimeout(() => {
                            that.getModuleCloudPhone();
                        }, 2000)   
                    }
                }else{
                    toastr.error(data.msgCode);
                }
            }, error: function (error) {
                toastr.error(error);
            }
        });
    },

    handleModulesOnRcm:function(){
        let that = this
        const wsconn = new WebSocket('wss://' + window.location.hostname + '/socket');
        wsconn.onmessage = function(e) {
            if(e.data !== "" && JSON.parse(e.data)['action'] === "rcmMsg"){
                // show new message
                let edata = JSON.parse(e.data)
                let msg = edata.msg
                let msg_detail = msg.split(":")
                let commandCat = msg_detail[0]
                if(commandCat == "module"){
                    let cmdBody = msg_detail[1].split("_")
                    let command = cmdBody[0]
                    let params = (cmdBody.length > 1)?JSON.parse(cmdBody[1]):""
                    if(command == "update"){
                        that.moduleList.newModules = params
                        that.getModules()      
                    }else if(command == "delete"){
                        that.moduleList.oldModules = params
                        that.removeModules()
                    }else if(command == "updateAll"){
                        that.modules = {}
                        that.module_power = {}
                        that.getFullModules()
                    }
                }
            }
        };
        wsconn.onopen = function(e) {
            wsconn.send( JSON.stringify({'action' : 'setId', 'id' : that.userId}) );
        };
    },

    handleModules:function(){
        var that = this;
        if (that.shouldCheckVisible == true) {
            if($('#webapp_workspace:visible').length == 0)
            {
                return true;
            }
        }
        
        $.ajax({
            url: "/webapp/default/getAssignedModulesList",
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            beforeSend: function () {
                if(typeof(showNofSystem)==='undefined' || (typeof(showNofSystem)!=='undefined' &&  showNofSystem === 'yes')){
                    toastr.info(translations['Syncing modules...'],'');
                }
            },
            success: function (data) {
                
                if(data.status=="success") {
                    that.processModules(that, data);
                    that.getModules()               
                }else{
                    toastr.error(data.message);
                }
            }, error: function (error) {
                toastr.error(error);
                
            }
        });
    },

    getModules:function (code) {
        if(this.moduleList.newModules.length==0){
            if(typeof(showNofSystem)==='undefined' || (typeof(showNofSystem)!=='undefined' &&  showNofSystem === 'yes')){
                toastr.success(translations['Modules have been updated!'], '');
            }
            setTimeout(() => {
                this.getModuleCloudPhone();
            }, 2000);
            return true;
        }
        for(let i = 0;i < this.moduleList.newModules.length;i++){
            let code = this.moduleList.newModules[i];
            
            if((i + 1) == (this.moduleList.newModules.length)){
                this.getModule(code,true)
            }else{
                this.getModule(code)
            }
        }
        
    },

    getModule:function (code,isLastOne=false) {
        var that = this;
        $.ajax({
            url: "/webapp/default/getModule" + "?code="+code,
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                
                if(data.sttCode=="S1001") {
                    that.modules = {...that.modules,[code]:data};
                    if(data.hasOwnProperty('module_power')){
                        that.module_power = {...that.module_power,[code]:data.module_power};
                        delete data.module_power
                    }
                }else{
                    toastr.error(data.msgCode);
                    that.removeModule(code)
                }
                if(isLastOne){
                    if(typeof(showNofSystem)==='undefined' || (typeof(showNofSystem)!=='undefined' &&  showNofSystem === 'yes')){
                        toastr.success(translations['Modules have been updated!'], '');
                    }
                    that.saveToCache('rtcloud_webapp_modules',that.modules);
                    that.saveToCache('rtcloud_webapp_module_power',that.module_power);
                    setTimeout(() => {
                        that.getModuleCloudPhone();
                    }, 2000); 
                }
            }, error: function (error) {
                toastr.error(error);
                if(isLastOne){
                    if(typeof(showNofSystem)==='undefined' || (typeof(showNofSystem)!=='undefined' &&  showNofSystem === 'yes')){
                        toastr.success(translations['Modules have been updated!'], '');
                    }
                    that.saveToCache('rtcloud_webapp_modules',that.modules);
                    that.saveToCache('rtcloud_webapp_module_power',that.module_power);
                    setTimeout(() => {
                        that.getModuleCloudPhone();
                    }, 2000);
                }
            }
        });
    },
    paramJsonHolder(jsonholder,task,object){
        let param = ""
        let where_jsonholder = task.where ? task.where : ""
        let task_where = ""
        if(object.query_params && object.query_params.where) {
            task_where = object.query_params.where;
        }
        if(where_jsonholder !== "" && task_where !== ""){
            param = "and("+where_jsonholder+","+task_where+")"
        }else if(where_jsonholder !== ""){
            param = where_jsonholder
        }else if(task_where !== ""){
            param = task_where
        }
        let A = jsonholder[object.dm_name]
        if(param !== ""){
            param = param.replace(/@@(.*?)@@/,'item.$1')
            return result = A.filter(item => {
                return eval(param)
            })
        }else{
            return A
        }
    },
},
});