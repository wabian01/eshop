var w;
if (typeof(Worker) !== "undefined") {
    if (typeof(w) == "undefined") {
        let http = new XMLHttpRequest();
        let url = "../plugins/worker.js"
        http.open('HEAD', url, false);
        http.send();
        if (http.status != 404)
            w = new Worker(url);
    }
} 
Vue.config.devtools = true;
var vm = new Vue({
    el: '#app',
    mixins: [funcReplaceTitleAndName,filterHidden,watchIndex,configRule,aggregateFunction,dynamicFilter,callActionButton,handleForm,funcRenderTask,getDataDmobj,jsonHolderData,getRuntime,getDmObject,getSubModules,jumpToView,sendFinalizedInstances,getSystemModule,handleLocalForage,dataIndex,openTask],
    data: {  
        flatRuntimeAttributes:{},
        username: username,
        userId: userId,
        objectTest:{},
        taskTest:{},
        reset_filter:false,
        show_filter: false,
        apply_filter: false,
        showSearchInput:false,
        stateRender:true,
        listModulePublic:[],
        resetModuleList: resetModuleList,
        checkRender:0,
        typeUIPublic:'',
        componentPublic:[],
        stateTitle:true,
        paramPublicView:[],
        jsonDataParent: {},
        lang: langPublic,
        utilityModule:"",
        newtemplate: viewName === 'dynamicTemplateUI' ? true : false
    },
    created: function () {
        var that= this;
        this.paramPublicView = query_params 
        this.stateTitle = isTitle
        listmodules.push(modulecode);
        this.listModulePublic = listmodules;
        this.getRuntimeAttributes()
        this.getOwnedDomains()
        this.loadCacheModules()
        .then(()=>{
            if(Object.keys(this.modules)==0 || this.resetModuleList){
                that.modules = {}
                that.module_power = {}
                this.getFullModulesPublic();
            }else{
                this.handleModulesPublic()
                this.moduleTimer = setInterval(function () {
                    that.handleModulesPublic()
                }, 900000);
            }
            this.handleModulesOnRcm()
        })
        .catch(err => {
            toastr.error(err);
        })

        /* Load Chatwoot */
        loadChatwoot();
    },
    mounted(){
        setTimeout(() => {
            $(window).resize((event) => {
                setTimeout(() => {
                    $('.dm-table-view').DataTable().columns.adjust();
                }, 100);
            });
        }, 1000);

        $(document).ready(function () {
            handleWebsocket();

            // Render FormIO for public view
            let loadingFormIO = setInterval((e) => {
                if (window.ssoLoginStatus && eleID !== 'undefined' && $( '#' + eleID ).length) {
                    renderFormIO(eleID, profile);
                    clearInterval(loadingFormIO);
                } else if (eleID === 'undefined') {
                    clearInterval(loadingFormIO);
                }
            }, 100);
            setTimeout(() => {
                if (loadingFormIO !== undefined) clearInterval(loadingFormIO);
            }, 60000);
        });
        
    },
    methods: {
        checkQuickView(component){
            if(Object.keys(component.objects).length===1){
                return true;
            }
            if(!component.hasOwnProperty('quick_view_object') || (component.hasOwnProperty('quick_view_object') && component.quick_view_object !== 0)){
                return true;
            }
            return false
        },
        renderMuti(){
            let json_object = vm.paramPublicView['json_view']
            this.level = 2
            json_object.map(data=>{
                if(data.type === "object"){
                    let object = vm.getAllObjects(data['module_code'])[data['object_code']]
                    this.activeScreenSkipObject = "";
                    let taskTest1={
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
                    title: object.title,
                    where: null}
                    this.activeScreenCom[object.code] = object.root_screen
                    this.activeFilterAndSearchCom['submodule'] = object.subModuleCode
                    this.activeFilterAndSearchCom['component'] = object.componentCode
                    new Vue({
                        el:data['target_element_id'],
                        template:  `
                            <dynamic-object-viewer :object="objectTest" :task="taskTest" :statetitle="statetitle"></dynamic-object-viewer>
                        `,
                        data: function () {
                        return {
                            objectTest:object,
                            taskTest:taskTest1,
                            statetitle:data['statetitle']==0?false:true,
                            }    
                        },
                        created: function() {
                        },
                    }).$mount();
                }
            })

        },
        renderUiPublic(){
            if(viewName === 'dynamicTemplateUI'){
                this.renderMuti()
                return;
            }
            if(this.checkRender < 2){
                this.checkRender++;
                let submodulecode = isSubmoduleCode
                let componentcode = isComponentCode
                let objectcode = isObjectCode
                let screencode = isScreenCode
                if(objectcode){
                    this.newDmView()
                    this.typeUIPublic = 'objectcode';
                    this.level = 2
                }else if(componentcode!=='false'){
                    let component = this.modules[modulecode].subModules[submodulecode].components[componentcode]
                    if(this.paramPublicView.hasOwnProperty('query_params') || this.paramPublicView.hasOwnProperty('dm_host') || this.paramPublicView.hasOwnProperty('dm_name')){
                        this.replaceParamComponent(component)
                    }
                    this.filterHiddenObjects(component.objects)
                    this.componentPublic = component
                    this.activeFilterAndSearchCom['submodule'] = component.subModuleCode
                    this.activeFilterAndSearchCom['component'] = component.code
                    this.typeUIPublic = 'componentcode';
                    this.level = 2
                }else if(submodule!=='false'){
                    this.jumpToSubmoduleDetail(modulecode, submodulecode);
                    this.typeUIPublic = 'submodulecode';
                    setTimeout(() => {
                        this.renderUiPublic()
                    }, 10);
                }
            }
        },
        replaceParamComponent: function(component){
            for(let code in component.objects){
                if(component.objects.hasOwnProperty(code)){
                    let object = component.objects[code]
                    if(this.paramPublicView.hasOwnProperty('query_params')){
                        object.query_params = JSON.parse(this.paramPublicView.query_params)
                    }
                    if(this.paramPublicView.hasOwnProperty('dm_host')){
                        object.dm_host = this.paramPublicView.dm_host
                    }
                    if(this.paramPublicView.hasOwnProperty('dm_name')){
                        object.dm_name = this.paramPublicView.dm_name
                    }
                }
            }
            return component;
        },
        handleModulesPublic:function(){
            var that = this;
            $.ajax({
                url: "/webapp/default/GetPublicModulesList",
                type: "POST",
                dataType: "json",
                data: {
                    module_codes: that.listModulePublic
                },
                success: function (data) {
                    
                    if(data.status=="success") {
                        that.processModules(that, data);
                        that.getModulesPublic()
                    }else{
                        toastr.error(data.message);
                    }
                }, error: function (error) {
                    toastr.error(error);
                    
                }
            });
        },
        getFullModulesPublic(){
            for(let i = 0;i < this.listModulePublic.length;i++){
                let code = this.listModulePublic[i];
                
                if((i + 1) == (this.listModulePublic.length)){
                    this.getModulePublic(code,true)
                }else{
                    this.getModulePublic(code)
                }
            }
            return;
        },
        getModulePublic(code,isLastOne=false){
            var that = this;
            $.ajax({
                url: "/webapp/default/getPublicModule" + "?code="+code,
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
                        that.saveToCache('rtcloud_webapp_modules_public',that.modules);
                        that.saveToCache('rtcloud_webapp_module_power_public',that.module_power);
                        that.renderUiPublic();
                    }
                }, error: function (error) {
                    toastr.error('Module not found');
                    if(isLastOne){
                        that.saveToCache('rtcloud_webapp_modules_public',that.modules);
                        that.saveToCache('rtcloud_webapp_module_power_public',that.module_power);
                        that.renderUiPublic();
                    }
                }
            });
        },
        currentCom:function (code) {
            this.showSearchInput=!this.showSearchInput;
            if(this.showSearchInput){
                this.$nextTick(function () {
                this.$refs.searchInput.focus();
                });
            } else{
                this.$refs.searchInput.value='';
                this.itemSearchString='';
            }
        },
        clearSearch:function(){
            this.$refs.searchInput.value='';
            this.itemSearchString='';
            this.$nextTick(function () {
                this.$refs.searchInput.focus();
            });
        },
        handleSearchCom:function (event) {
            vm.activeTaskCode='';
            vm.itemSearchString = $(event.target).val();

        },
        hideFilter:function(){
            this.reset_filter = !this.reset_filter
            this.show_filter =  !this.show_filter
            this.apply_filter = !this.apply_filter
        },
        actionBacktoScreen(code){
            if((vm['checkIframe'] != undefined && vm['checkIframe'][0]) || vm['checkIframe'] == undefined){
                vm.jumpToPreviousScreen(code)
            }else{
                try {
                    $('#'+vm['checkIframe'].id).get(0).contentDocument.location.href = "about:srcdoc";
                } catch (error) {
                    window.history.back();
                }
            }
            // Pause audio when back screen
            if ( ($(document).find("audio")).length > 0 ) {
                $( "audio" ).trigger( "pause" );
            }
        },
        getDataModalObject: function(objectCode) {
            for (key in this.objects) {
                let code = this.objects[key].code
                if(code == objectCode){
                    return this.objects[key]
                }
            }
            return {}
        },
        newDmView(){
            var queryParams = query_params
            let screnncode = isScreenCode
            let object = []
            this.objects = this.getAllObjects(modulecode)
            object = this.getDataModalObject(objectCode)
            if(Object.keys(object).length === 0){
                for (moduleCode in this.modules) {
                    let objects = this.getAllObjects(moduleCode)
                    if(Object.keys(objects).length === 0){
                        continue
                    }
                    object = this.getDataModalObject(objectCode)
                    if(Object.keys(object).length !== 0){
                        break
                    }
                }
            }
            if(queryParams.hasOwnProperty('query_params')){
                object.query_params = JSON.parse(queryParams.query_params)
            }
            if(queryParams.hasOwnProperty('dm_host')){
                object.dm_host = queryParams.dm_host
            }
            if(queryParams.hasOwnProperty('dm_name')){
                object.dm_name = queryParams.dm_name
            }
            this.activeScreenSkipObject = "";
            this.objectTest = object
            this.taskTest={
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
            title: object.title,
            where: null}
            this.activeScreenCom[object.code] =  screnncode ? screnncode : object.root_screen
            this.activeFilterAndSearchCom['submodule'] = object.subModuleCode
            this.activeFilterAndSearchCom['component'] = object.componentCode
            setTimeout(() => {
                $('.autofit_subdetail').css({'display':'block'})
            }, 10);

        },
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
                            that.getModulesPublic()      
                        }else if(command == "delete"){
                            that.moduleList.oldModules = params
                            that.removeModules()
                        }else if(command == "updateAll"){
                            that.modules = {}
                            that.module_power = {}
                            that.getFullModulesPublic()
                        }
                    }
                }
            };
            wsconn.onopen = function(e) {
                wsconn.send( JSON.stringify({'action' : 'setId', 'id' : that.userId}) );
            };
        },

        getModulesPublic:function (code) {
            if(this.moduleList.newModules.length==0){
                this.renderUiPublic();
                setTimeout(() => {
                    this.getDmObject();
                }, 2000);
                return true;
            }
            for(let i = 0;i < this.moduleList.newModules.length;i++){
                let code = this.moduleList.newModules[i];
                
                if((i + 1) == (this.moduleList.newModules.length)){
                    this.getModulePublic(code,true)
                }else{
                    this.getModulePublic(code)
                }
            }
            
        },
    },
});