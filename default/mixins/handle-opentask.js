const openTask = {
    methods: {
        openTask:function (object, layout, subitem, comitem,action= null,where=null,post=null,get=null,openFromAB=null,screenCode=null) {
            if ( object.hasOwnProperty('screenTheme') && object.screenTheme != null && object.screenTheme != 'fullscreen') {
                $("#webapp_workspace").css("overflow","unset");
                object = { ...object, taskDepend: this.activeTaskCode };
            } else {
                this.statusPopup = false
                this.activeObjectCode = object.code;
                this.activeTaskCode = this.tasks.length;
                var html_content ='';
                this.activeScreenCode = screenCode != null ? screenCode : object.root_screen;
                try {
                    vm.topBar[this.activeTaskCode]=object.screens[object.root_screen].top_area;
                } catch (error) {
                    
                }
            }
            
            this.previousScreenCode = '';
            console.log('---------------------'+object.type+'---------------------');
    
            if (object.type=="report"){
                if(viewName === 'index' || viewName === 'indexLiteView'){
                    this.checkSessionExp()
                }
                if(this.handleShowModalReport){
                    this.handleShowModalReport = false;
                    this.toastrWaiting = true;
                    var that = this;
                    $.ajax({
                        url: "/cpms/cpmsAnalytic/ajaxSeeDesign",
                        data: {design_ids: [object.reportId]},
                        type: 'POST',
                        dataType: 'json',
                    })
                        .done(function (data) {
                            if (data.success == 'success') {
                                html_content = '<iframe src="'+data.src+'" frameborder="0" scrolling="yes" style="width: 100%; height: calc(100vh - 95px);"></iframe>';
                                object.screens[object.root_screen]['body_area'][0]['html_template']=html_content;
                                object.screens[object.root_screen]['body_area'][0]['screenCode']=object.root_screen;
                                object.title = data.title
    
                                that.tasks.push({
                                    code:that.tasks.length,
                                    layout: layout,
                                    subitem: subitem,
                                    comitem: comitem,
                                    title: data.title,
                                    html_content:html_content,
                                    isDeleted:false,
                                    object: object
                                });
    
                                setTimeout(function() {
                                    $('#task-modal-'+that.activeTaskCode).modal('show');
                                },200);
                                that.handleShowModalReport = true;
                                that.toastrWaiting = false;
                            }
                            else {
                                html_content = 'Error in Executing R Markdown script! Please find R errors below!<br><br>'+data.msg;
                                object.screens[object.root_screen]['body_area'][0]['html_template']=html_content;
                                object.screens[object.root_screen]['body_area'][0]['screenCode']=object.root_screen;
                                object.title = 'Error'
    
                                that.tasks.push({
                                    code:that.tasks.length,
                                    layout: layout,
                                    subitem: subitem,
                                    comitem: comitem,
                                    title: 'Error',
                                    html_content:html_content,
                                    isDeleted:false,
                                    object: object
                                });
                                setTimeout(function() {
                                    $('#task-modal-'+that.activeTaskCode).modal('show');
                                },200);
                                that.handleShowModalReport = true;
                                that.toastrWaiting = false;
                            }
                        })
                        .error(function () {
                            html_content = 'Error! Please contact Administrator for help!';
                            object.screens[object.root_screen]['body_area'][0]['html_template']=html_content;
                            object.screens[object.root_screen]['body_area'][0]['screenCode']=object.root_screen;
                            object.title = 'Error'
    
                            that.tasks.push({
                                code:that.tasks.length,
                                objectCode:object.code,
                                layout: layout,
                                subitem: subitem,
                                comitem: comitem,
                                title: 'Error',
                                html_content:html_content,
                                isDeleted:false,
                                object: object
                            });
                            
                            
                            if(object.moduleType == 'system'){
                                that.jumpToScreen(that.previousScreenCode,that.activeScreenCode, '', object)
                            }
                            else{
                                that.jumpToScreen(that.previousScreenCode,that.activeScreenCode)
                            }
    
                            setTimeout(function() {
                                $('#task-modal-'+that.activeTaskCode).modal('show');
                            },200);
                            that.handleShowModalReport = true;
                            that.toastrWaiting = false;
                        });
    
                }
    
            }
            else if (object.type=="form" || object.type == 'instance' || object.type == 'fill-form'){
                if(viewName === 'index' || viewName === 'indexLiteView'){
                    this.checkSessionExp()
                }
                var uuid = null;
                var removeQuestions = null;
                if(object.hasOwnProperty('uuid')){
                    uuid = object.uuid;
                }
                else if(object.hasOwnProperty('item_button')&&object.item_button.hasOwnProperty('uuid')){
                    
                    uuid = object.item_button.uuid
                }                    
                if(object.hasOwnProperty('item_button')&&object.item_button.hasOwnProperty('removeQuestions')){
                    removeQuestions = JSON.stringify(object.item_button.removeQuestions)
                }
                if(object.hasOwnProperty('item_button')){   
                    $("#loading-animation-webform").show();
                    $("#loading-animation-webform").css("display","flex");
                    if(object.hasOwnProperty('familyId')){
                        var queries = {
                            familyId:object.familyId,
                            display:"popup",
                            componentCode:object.rawComponentCode,
                            subModuleCode:object.subModuleCode,
                            moduleCode:object.moduleCode,
                            objectCode:object.objectCode,
                            action: action,
                            instanceID : uuid,
                            removeQuestions: removeQuestions,
                            taskCode: this.activeTaskCode,
                            code:object.code
                        };
                        if(viewName === 'indexDmView' || viewName === 'dynamicTemplateUI'){
                            queries.displayview = "publicview"
                        }
                        if(object.item_button.hasOwnProperty('preload')){
                            var preloads = {};
                            if(typeof object.item_button.preload == "string"){
                                object.item_button.preload = JSON.parse(object.item_button.preload)
                            }
                            try {
                                object.item_button.preload.forEach(function (item) {
                                    if(item.value[0] == "'" && item.value[item.value.length-1] == "'"){
                                        item.value = item.value.substring(1,item.value.length-1);
                                    }
                                    preloads[item.key]=item.value;
                                });
                            } catch (error) {
                                console.log('preloads null',error)
                            }
                            $.extend( queries, preloads );
                        }
    
                        if(object.item_button.hasOwnProperty('openArgs')){
                            if(typeof object.item_button.openArgs != 'string'){
                                queries['openArgs'] = JSON.stringify(object.item_button.openArgs);
                            }
                            else{
                                queries['openArgs'] =   object.item_button.openArgs
                            }
                        }
    
                        if(object.item_button.hasOwnProperty('preload_repeat')){
                            if(typeof object.item_button.preload_repeat != 'string'){
                                queries['preload_repeat'] = JSON.stringify(object.item_button.preload_repeat);
                            }
                            else{
                                queries['preload_repeat'] =   object.item_button.preload_repeat
                            }
                        }
    
                        if(object.hasOwnProperty('tracking_id') && object.tracking_id!==''){
                            queries['tracking_id'] = object.tracking_id
                        }
                        var queryString = $.param(queries);
                        
                        let that = this;
                        $.ajax({
                            "url": "/webapp/webform/getWebformUri",
                            "method": "POST",
                            "dataType": 'json',
                            "data": {
                                "uri":queryString
                            }
                        }).done(function (response) {
                            $("#loading-animation-webform").hide();
                            $("#loading-animation-webform").css("display","none");
                            if(response.status=="success"&&response.uri.length>0){
                                queryString = response.uri
    
                            }
                            html_content = '<iframe src="/webapp/webform/indexV2?'+queryString+ '" frameborder="0" scrolling="yes" style="width: 100%; height: 100%;" id="i-wf"></iframe>';
                            object.screens[Object.keys(object.screens)[0]]['body_area'][0]['html_template']=html_content;
    
                            that.tasks.push({
                                code:that.tasks.length,
                                layout: layout,
                                subitem: subitem,
                                comitem: comitem,
                                title: object.title,
                                html_content:html_content,
                                isDeleted:false,
                                object: object,
                                openFromAB:(openFromAB != null && openFromAB[0]) ? 'openFromAB' : ''
                            });
                            if(openFromAB != null && openFromAB[0]){
                                vm.lastTask[object['code']] = openFromAB[1]
                            }
                            if(object.moduleType=="system"){
                                that.jumpToScreen(that.previousScreenCode,that.activeScreenCode, '', object)
                            }
                            else{
                                that.jumpToScreen(that.previousScreenCode,that.activeScreenCode)
                            }
    
                            if(that.handleShowModalReport){
                                var taskCode = that.activeTaskCode;
    
                                setTimeout(function() {
    
                                    $('#task-modal-'+taskCode).modal('show');
                                }, 200);
                            }
                        });
    
                        return 0;
                    }
    
                }
    
                let object_fill_form = JSON.parse(JSON.stringify(object))
                let temp = object_fill_form.screens[Object.keys(object_fill_form.screens)[0]]['body_area'][0]['html_template']
                object_fill_form.screens[Object.keys(object_fill_form.screens)[0]]['body_area'][0]['html_template'] = temp.replace("src=\"/webapp/webform/indexV2?", "src=\"/webapp/webform/indexV2?taskCode="+this.activeTaskCode+"&");
    
    
                this.tasks.push({
                    code:this.tasks.length,
                    layout: layout,
                    subitem: subitem,
                    comitem: comitem,
                    title: object.title,
                    html_content:html_content,
                    isDeleted:false,
                    object: object_fill_form,
                    openFromAB:(openFromAB != null && openFromAB[0]) ? 'openFromAB' : ''
                });
                if(openFromAB != null && openFromAB[0]){
                    vm.lastTask[object['code']] = openFromAB[1] 
                }
                if(object.moduleType=="system"){
                    this.jumpToScreen(this.previousScreenCode,this.activeScreenCode, '', object)
                }
                else{
                    this.jumpToScreen(this.previousScreenCode,this.activeScreenCode)
                }
    
            }
            else{
                this.tasks.push({
                    code:this.tasks.length,
                    layout: layout,
                    subitem: subitem,
                    comitem: comitem,
                    title: object.title,
                    html_content:html_content,
                    where: where,
                    post: post,
                    isDeleted:false,
                    object: object,
                    get:get,
                    openFromAB:(openFromAB != null && openFromAB[0]) ? 'openFromAB' : '',
                    screenCode: screenCode
                });
                if(openFromAB != null && openFromAB[0]){
                    vm.lastTask[object['code']] = openFromAB[1]
                }
                vm.flatRuntimeAttributes['module.code'] = object['moduleCode']
                vm.flatRuntimeAttributes['module.component.code'] = object['componentCode']
                vm.flatRuntimeAttributes['module.object.code'] = object['code']
                vm.flatRuntimeAttributes['module.subModule.code'] = object['subModuleCode']
                vm.flatRuntimeAttributes['module.title'] = vm.modules[object['moduleCode']].title
                vm.flatRuntimeAttributes['module.subModule.title'] = vm.modules[object['moduleCode']].subModules[object['subModuleCode']].title
    
                if(object.moduleType=="system"){
                    this.jumpToScreen(this.previousScreenCode,this.activeScreenCode, '', object)
                }
                else if(object.fileType !== 'rtbox/link'){
                    this.jumpToScreen(this.previousScreenCode,this.activeScreenCode)
                }
            }
            if(this.handleShowModalReport){
                var taskCode = this.activeTaskCode;
    
                setTimeout(function() {
    
                    $('#task-modal-'+taskCode).modal('show');
                }, 200);
            }
        },
        
        showTask:function (task) {
            $('#webapp_workspace').show();
            if (task.hasOwnProperty('components') && 
                task.components.hasOwnProperty('screenTheme') && 
                task.components.screenTheme != null && 
                task.components.screenTheme != 'fullscreen' ) {
                this.statusPopup = true
            } else if (task.hasOwnProperty('object') && 
                task.object.hasOwnProperty('screenTheme') && 
                task.object.screenTheme != null && 
                task.object.screenTheme != 'fullscreen' ) {
                this.statusPopup = true
            } else {
                this.statusPopup = false
            }
            this.refresh_rate=!this.refresh_rate;
            this.activeTaskCode = task.code;
            this.activeScreenCode = task.screenCode != null ? task.screenCode :task.object.root_screen;
            this.previousScreenCode = '';
            this.activeObjectCode=task.object.code;
            
            let activeTemp = this.tasks[this.activeTaskCode].object.screens[this.activeScreenCode];
            if (activeTemp != undefined &&
                activeTemp != null &&
                activeTemp != '' && 
                activeTemp.hasOwnProperty('title') && 
                activeTemp.title != ''
            ) {
                this.tasks[this.activeTaskCode].title = activeTemp.title;
            } else {
                this.activeScreenCode = task.object.root_screen;
                this.tasks[this.activeTaskCode].title = activeTemp.title;
            }
            var ID_MODEL;
            $('#task-bar-icon-err-'+this.activeTaskCode +' span').css('display','none')
        },
    
        minimizeTask:function (message) {
            this.statusPopup = true
            let taskCode = this.activeTaskCode
            this.activeTaskCode = ''
            this.previousScreenCode = ''
            if(typeof message == 'object' && message.taskCode){
                taskCode = message.taskCode
            }
            $('#task-modal-'+taskCode).hide();
            if(!vm.listSreenTheme[""] || vm.listSreenTheme[""]?.length === 0){
                $("#webapp_workspace").css("overflow","scroll");
            }
            if(message.hasOwnProperty('tracking_id')){
                if(this.tasks[taskCode]?.object?.taskParent!=9999){
                    let code = this.tasks[taskCode]?.object?.taskParent
                    if(!this.tasks[code].isDeleted){
                        $('#task-modal-'+code).modal('show')
                        this.showTask(this.tasks[code])
                    }
                }
            }
        },
        deleteTask(task){
            this.statusPopup = true
            this.activeTaskCode = '';
            for (let i = 0; i < this.tasks.length; i++) {
                if(this.tasks[i].code==task.code){
                    this.tasks[i].isDeleted = true;
                    $('#task-modal-'+task.code).addClass("out");
                    setTimeout(function() {
                        $('#task-modal-'+task.code).remove();
                        $('#task-icon-'+task.code).remove();
                        $(".modal-backdrop.fade.in").remove();
                    }, 200)
                }
            }
        },
        showDismiss(task){
            if (task.object.hasOwnProperty('dismissPr') && task.object.dismissPr === false && task.object.dependView!=="" && this.tasks[task.object.dependView].isDeleted != true) {
                $('#task-modal-'+task.object.dependView).modal('show')
                this.showTask(this.tasks[task.object.dependView])
            }
            if(vm.checkScreenCP.indexOf(task.code)>-1){
                delete vm.checkScreenCP[task.code]; 
                setTimeout(() => {
                    $('#li_phonecall').addClass('open');
                }, 100);
            }
        },
        closeTask:function (task) {
            this.previousScreenCode = ''
            $("#webapp_workspace").css("overflow","scroll");
            if(this.modules.hasOwnProperty(this.activeModuleCode)){
                if(this.modules[this.activeModuleCode].hasOwnProperty("functionCode")){
                    this.getSystemModule(this.modules[this.activeModuleCode].functionCode);
                }
            }
    
            if(task.object.type === "form" || task.object.type==='fill-form' || task.object.type==='edit-form' || task.object.type==='instance') {
                $('#task-modal-'+task.code).css("z-index", "101");
    
                const that = this;
                Swal.fire({
                    title: 'Do you want to close this form?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#009688',
                    cancelButtonColor: '#fd397a',
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    reverseButtons: true,
    
                    }).then((t) => {
                        if(t.hasOwnProperty('dismiss')!= false) {
                            return "";
                        }
                        else{
                            this.statusPopup = true
                            that.activeTaskCode = '';
                            for (let i = 0; i < that.tasks.length; i++) {
                                if(that.tasks[i].code==task.code){
                                    that.tasks[i].isDeleted = true;
                                    $('#task-modal-'+task.code).remove();
                                    $('#task-icon-'+task.code).remove();
                                }
                            }
                        }    
                })
            } else {
                this.deleteTask(task)
            }
            
            this.showDismiss(task)
        },
        async updateJsonHolder(){
            const temp = await localforage.getItem('jsonHolder')
            const json = typeof(temp) == 'string' ? temp : JSON.stringify(temp)
            if(json!== this.jsonHolder){
                this.jsonHolder = json
            }
        },
        closeIframe:function (message) {
            this.updateJsonHolder();
            this.previousScreenCode = ''
            let task = {}
            let taskCode = this.activeTaskCode
            if(typeof message == 'object' && message.taskCode){
                taskCode = message.taskCode
            }
            for (let i = 0; i < this.tasks.length; i++) {
                if(this.tasks[i].code==taskCode){
                    task = this.tasks[i]
                }
            }
            if(task.object.type === "form" || task.object.type==='fill-form' || task.object.type==='edit-form' || task.object.type==='instance') {
                $('#task-modal-'+task.code).css("z-index", "101");
                const that = this;
                if(message=="close" || message.action=="close"){
                    this.statusPopup = true
                    if(taskCode == this.activeTaskCode){
                        that.activeTaskCode = '';
                    }
                    for (let i = 0; i < that.tasks.length; i++) {
                        if(that.tasks[i].code==task.code){
                            that.tasks[i].isDeleted = true;
                            $('#task-modal-'+task.code).remove();
                            $('#task-icon-'+task.code).remove();
                            $(".modal-backdrop.fade.in").remove()
                        }
                    }
                    if(this.tasks[taskCode]?.object?.taskParent!=9999){
                        let code = this.tasks[taskCode]?.object?.taskParent
                        if(!this.tasks[code].isDeleted){
                            $('#task-modal-'+code).modal('show')
                            this.showTask(this.tasks[code])
                        }
                    }
                } 
            } else {
                this.deleteTask(task)
            }
            this.showDismiss(task)
        },
    }
  }