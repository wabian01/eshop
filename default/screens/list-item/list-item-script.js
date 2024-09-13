    Vue.component('list-item', {
        template: '#list-item',
        props: ['list_item','screen_item','task','object','indexsearch','position','horizontal','selectedValue','hasColumn'],
        data: function () {
            return {
                item_content:'',
                item_buttons:[],
                phoneNum: "",
                statusButton:false,
                test:'',
                classRandom:Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10),
                button_description:[],
                overflow_menu:{},
                timer:0,
                notfound:'',
                screen_item_new:undefined,
                listJS:false,
                stateOverflow:true,
                count:0,
                divkit:false,
                checkABDivkit:true,
                flatRuntimeAttributes:{},
                lang : vm.lang,
                heightrow:'',
                shadow_item:(vm.newtemplate ?'':'background: #fff;box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;margin-top: 6px; padding: 0 4px 4px 4px !important;')+'width:100%;',
                hasSecondary:false,
                tempObject:{},
                wrapColumnStyle:'',
                when_empty:false,
                height_empty:"",
            }
        },
        created: function () {
            // Has config column
            if (this.hasColumn) {
                const splitColValues = {
                    '1': '100%',
                    '2': '50%',
                    '3': '33.33%',
                    '4': '25%',
                    '5': '20%',
                    '6': '16.66%',
                    '7': '14.28%',
                    '8': '12.5%',
                    '9': '11.11%',
                    '10': '10%',
                    '11': '9.09%',
                    '12': '8.33%',
                    '13': '7.69%',
                    '14': '7.14%',
                    '15': '6.66%',
                    '16': '6.25%',
                    '17': '5.88%',
                    '18': '5.55%',
                    '19': '5.26%',
                    '20': '5%',
                };

                if (this.list_item === 'notfound') {
                    this.wrapColumnStyle = `flex: 1 0 100%; max-width: 100%; margin: 0`;
                } else {
                    const valSplitCol = splitColValues[this.selectedValue] || '100%';
                    this.wrapColumnStyle = `flex: 1 0 ${valSplitCol}; max-width: ${valSplitCol}; margin-left: 0; margin-right: 0`;
                }
            }

            if(this.screen_item.type == "sliderView"){
                this.shadow_item = 'width:100%; background: #fff; margin-top: 6px; box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, inset rgba(0, 0, 0, 0.3) 0px -1px 3px -1px; padding: 0 4px 4px 4px !important;'
                if(this.screen_item.hasOwnProperty('layout')){
                    this.heightrow = this.screen_item.layout.height;
                }
                if (this.heightrow != null && this.heightrow != undefined && this.heightrow != "" ) {
                    if (typeof this.heightrow == "number") this.heightrow = this.heightrow.toString();
                    if (!this.heightrow.includes('%') && !this.heightrow.includes('px')) {
                        this.heightrow = this.heightrow + 'px';
                        this.heightrow = "height: "+this.heightrow+";overflow: auto;";  
                    } else {
                        if (this.heightrow.includes('%')) {
                            this.heightrow = this.heightrow.replace('%','vh');
                        }
                        this.heightrow = "height: "+this.heightrow+" ;overflow: auto;";  
                    }   
                }else {
                    this.heightrow = "height: 300px;overflow: auto;"; 
                }
            }
            this.flatRuntimeAttributes = JSON.parse(JSON.stringify(vm.flatRuntimeAttributes))
            this.flatRuntimeAttributes['module.code'] = this.object['moduleCode']
            this.flatRuntimeAttributes['module.component.code'] = this.object['componentCode']
            this.flatRuntimeAttributes['module.object.code'] = this.object['code']
            this.flatRuntimeAttributes['module.subModule.code'] = this.object['subModuleCode']
            this.flatRuntimeAttributes['module.title'] = vm.modules[this.object['moduleCode']].title
            this.flatRuntimeAttributes['module.subModule.title'] = vm.modules[this.object['moduleCode']].subModules[this.object['subModuleCode']].title
                    
            this.$parent.$parent.nonehide_view = '';
            this.screen_item_new = JSON.parse(JSON.stringify(this.screen_item));
            if(this.list_item === 'notfound'){
                if( this.screen_item_new.hasOwnProperty('when_empty') && 
                  ( !this.screen_item_new.hasOwnProperty('filters') || this.screen_item_new.filters === "" ) 
                ) {
                    if(this.screen_item_new.hasOwnProperty('layout')){
                        let height_empty = ""
                        if(this.screen_item.layout.hasOwnProperty('height') && this.screen_item.layout.height !== '' && this.screen_item.layout.height != null && this.screen_item.layout.height != 'null'){
                            if(this.screen_item.layout.height.toString().indexOf('%')>-1){
                                height_empty += 'height:'+this.screen_item.layout.height.replace('%',"vh")+';overflow:auto;'
                            }else if(!isNaN(this.screen_item.layout.height.toString()) && Number(this.screen_item.layout.height)>-1){
                                height_empty += 'height:'+this.screen_item.layout.height+'px;overflow:auto;'
                            }
                        }
                        this.height_empty = height_empty
                    }
                    if(this.screen_item_new.when_empty == 'hide_view'){
                        this.notfound = ''
                        this.when_empty = true
                        return;
                    }else{
                        this.handleHideView()
                        return;
                    }
                }
                let lang = vm.lang;
                if(lang == 'vi'){
                    this.notfound = '<img src="/metronic6/images/notfound.svg" width="120px"><h3 class="text-center" style="color:#737373;font-weight:400;">Chưa có thông tin để hiển thị</h3>'
                }else{
                    this.notfound = '<img src="/metronic6/images/notfound.svg" width="120px"><h3 class="text-center" style="color:#737373;font-weight:400;">Nothing to display at the moment</h3>'
                }
            }else{
                this.handleReplacements();
            }
        },
        mounted: function(){
            $(document).on("shown.bs.dropdown", ".dropdown_overflow", function () {
           
                var $ul = $(this).children(".dropdown-menu");
                var $button = $(this).children(".dropdown-toggle");
                var ulOffset = $ul.offset();
                let rightoffset = $(window).width() - ulOffset.left
                let leftoffset = ulOffset.left
                var spaceUp = (ulOffset.top - $button.height() - $ul.height()) - $(window).scrollTop();
                
                var spaceDown = $(window).scrollTop() + $(window).height() - (ulOffset.top + $ul.height());
                
                if (spaceDown < 0 && (spaceUp >= 0 || spaceUp > spaceDown))
                $(this).addClass("dropup");
                
                if(rightoffset > leftoffset){
                    $ul.addClass("pull-left");
                    $ul.removeClass("pull-right");
                }else{
                    $ul.addClass("pull-right");
                    $ul.removeClass("pull-left");
                }
            }).on("hidden.bs.dropdown", ".dropdown_overflow", function() {
                
                $(this).removeClass("dropup");
            });
            let that = this;
            if(this.listJS){
                $(window).on('resize', function(){
                    that.retryIfHeight()
                });
                $('#task-modal-'+this.task.code+' .fullscreen-button').click(function(){
                    that.retryIfHeight()
                });
                setTimeout(() => {
                    $('#'+this.classRandom).contents().find('body').on('DOMSubtreeModified', function(){
                        that.retryIfHeight();
                    });
                }, 1000);
            }

            if(this.hasSecondary) {
                var list_item1 = this.list_item;
                var item_button1 = this.screen_item_new.item_template.template_default.attributes.secondary_action;
                var task1 = this.task;
                var body_area1 = this.screen_item_new;
                var popupTemp = new Vue({
                    template: '<action-button :body_area="body_area"  :list_item="list_items" :item_button="item_button" :task="task"> </action-button>',
                    data: function () {
                    return {
                        list_items: list_item1,
                        item_button:item_button1,
                        task: task1,
                        body_area:body_area1,
                        }    
                    },
                    created: function() {
                    },
                }).$mount();
                
                this.$refs.container.querySelector(".btn-sec-"+this.classRandom).appendChild(popupTemp.$el)
            }    

            $('.modal-'+this.object.code+' .lds-spinner').css({'display':'none'})
        },
        methods: {
            replaceJsonPaths: function(template) {
                return template.replace(/##(\$.*?)##/g, (match, capture) => {
                    if(capture === '$'){
                        return typeof this.list_item === 'object' 
                        ? JSON.stringify(this.list_item)
                        : JSON.stringify([]);
                    }
                    const value = jsonPath(this.list_item, capture);
                    if (!value) return match;
                    const processedValue = value[0] ? value[0] : "";
                    return typeof processedValue === 'object' 
                        ? JSON.stringify(processedValue)
                        : processedValue.toString().replace(/\"/g, "\\\"").replace(/\s/g, " ");
                });
            },
            replaceAttribute(itemJSONString){
                itemJSONString = this.replaceJsonPaths(itemJSONString);
                for (let key in this.list_item) {
                    if (this.list_item.hasOwnProperty(key) && this.list_item[key] != null ) {
                        itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),this.list_item[key].toString().replace(/[\r\n]+/g," "));
                        itemJSONString = itemJSONString.replace('"','\"');
                    }
                }
                for (let key in this.flatRuntimeAttributes) {
                    if (this.flatRuntimeAttributes.hasOwnProperty(key)) {
                        itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),this.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                        itemJSONString = itemJSONString.replace('"','\"');
                    }
                }
                for(let key in vm.current.parent){
                    try {
                        itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].replace(/[\r\n]+/g," "));
                    } catch (error) {
                    }
                    itemJSONString = itemJSONString.replace('"','\"');
                }
                return itemJSONString
            },
            handleHideView(){
                    this.screen_item_new.when_empty = vm.aggregateFunction(this.screen_item_new.when_empty,this.list_item)                  
                    let itemJSONString = this.screen_item_new.when_empty
                    itemJSONString = this.replaceAttribute(itemJSONString)
                    if(itemJSONString.indexOf('<script')>-1){
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
                        itemJSONString = itemJSONString + functionApp
                        
                    }
                    if(vm.newtemplate){
                        this.item_content = itemJSONString;
                        return
                    }
                    this.listJS = true;
                    this.item_content = itemJSONString;
            },
            checkOverflow(count){
                if(count==false){
                    this.count++
                }
                if(this.overflow_menu.length == this.count){
                    this.stateOverflow = false;
                }
            },
            checkIframe:function(){
                let that = this
                this.retryHeight($(event.target)[0])
                this.retryIfHeight()
                $('#'+this.classRandom).contents().find('body').on("click", function(){
                    that.handleClick()
                })
            },
            retryHeight(iframe){
                let count=0
                let retryIframe = setInterval(() => {
                    if(count>5){
                        clearInterval(retryIframe);
                    }
                    try {
                        if(iframe.contentWindow.document.documentElement.scrollHeight>0){
                            count++
                            iframe.style.height=iframe.contentWindow.document.documentElement.scrollHeight +'px';
                        } 
                    } catch (error) {}
                }, 1000);
            },
            retryIfHeight(){
                setTimeout(() => {
                    $('#'+this.classRandom).height($('#'+this.classRandom).contents().find("html").height())
                }, 1000);
                
            },
            handleReplacements:function () {
                let that = this;          
                if(this.screen_item_new.hasOwnProperty('item_buttons')){
                    var screen_item_new_temp = JSON.stringify(this.screen_item_new.item_buttons);
                    screen_item_new_temp = JSON.parse(screen_item_new_temp)
                    screen_item_new_temp.forEach(element => {                    
                            for(var key in element){
                                if(key === 'name'){
                                    element[key] = vm.aggregateFunction(element[key],this.list_item)
                                }
                                for(var key1 in this.list_item){
                                    if((key == 'visible' || key == 'enable') && element[key].toString().indexOf(key1)>-1 && element[key] != null && this.list_item[key1] !=null ){
                                        element[key] = element[key].toString().replace(new RegExp('"##'+key1+'##"','g'),'"'+(this.list_item[key1].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+'"');
                                        element[key] = element[key].toString().replace(new RegExp('\'##'+key1+'##\'','g'),"'"+(this.list_item[key1].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                                        element[key] = element[key].toString().replace(new RegExp('##'+key1+'##','g'),"'"+(this.list_item[key1].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");           
                                    }
                                }
                                for (var key2 in that.flatRuntimeAttributes) {
                                    if (that.flatRuntimeAttributes.hasOwnProperty(key2)) {
                                        if((key == 'visible' || key == 'enable') && element[key].toString().indexOf(key2)>-1 && element[key] != null && that.flatRuntimeAttributes[key2] !=null ){
                                            let hasMatches = element[key].match(/matches\((.*?)\)/g) 
                                            if( !(hasMatches && hasMatches[0] && hasMatches[0].indexOf("##")) && element[key].indexOf('"##')<0 && element[key].indexOf('\'##')<0){
                                                element[key] = element[key].toString().replace(new RegExp('##'+key2+'##','g'),"'"+(that.flatRuntimeAttributes[key2].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                                            }
                                            else{
                                                element[key] = element[key].toString().replace(new RegExp('##'+key2+'##','g'),that.flatRuntimeAttributes[key2].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                                            }
                                        }
                                    }
                                }
                                for(var key3 in vm.current.parent){
                                    if((key == 'visible' || key == 'enable') && element[key].toString().indexOf(key3)>-1 && element[key] != null && vm.current.parent[key3] !=null ){
                                            if( element[key].indexOf('"##')<0 && element[key].indexOf('\'##')<0){
                                                element[key] = element[key].toString().replace(new RegExp('##'+key3+'##','g'),"'"+(vm.current.parent[key3].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                                            }
                                            else{
                                                element[key] = element[key].toString().replace(new RegExp('##'+key3+'##','g'),vm.current.parent[key3].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                                            }
                                        }
                                }
                                if((key == 'visible' || key == 'enable') && element[key].toString().indexOf('##')>-1){
                                    element[key] = vm.aggregateFunction(element[key],this.list_item)
                                    if( element[key].indexOf('"##')<0 && element[key].indexOf('\'##')<0){
                                        element[key] = element[key].toString().replace(/##(.*?)##/g,'""')
                                    }
                                    else{
                                        element[key] = element[key].toString().replace(/##(.*?)##/g,'')
                                    }
                                }
                            }
                    });
                    
                    this.screen_item_new.item_buttons = screen_item_new_temp;
                }

                if(this.screen_item_new.item_template.hasOwnProperty('overflow_menu')){
                    let button_overflow = JSON.stringify(this.screen_item_new.item_template.overflow_menu);
                    button_overflow = JSON.parse(button_overflow)
                    button_overflow.forEach(element => {                    
                            for(var key in element){
                                if(key === 'name'){
                                    element[key] = vm.aggregateFunction(element[key],this.list_item)
                                }
                                for(var key1 in this.list_item){
                                    if(key == 'visible' && element[key].toString().indexOf(key1)>-1 && element[key] != null && this.list_item[key1] !=null ){
                                        element[key] = element[key].toString().replace(new RegExp('"##'+key1+'##"','g'),'"'+(this.list_item[key1].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+'"');
                                        element[key] = element[key].toString().replace(new RegExp('\'##'+key1+'##\'','g'),"'"+(this.list_item[key1].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                                        element[key] = element[key].toString().replace(new RegExp('##'+key1+'##','g'),(this.list_item[key1].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))); 
                                    }
                                }
                            }
                    });
                    
                    this.screen_item_new.item_template.overflow_menu = button_overflow;
                }
                
                if(typeof this.screen_item_new.item_template == 'string'){
                    this.screen_item_new.item_template = vm.aggregateFunction(this.screen_item_new.item_template,this.list_item)
                    var temp_screen_item = this.screen_item_new;                        
                    let itemJSONString = JSON.stringify(temp_screen_item);
                    itemJSONString = this.replaceAttribute(itemJSONString)
                    this.screen_item_new = JSON.parse(itemJSONString);
                    this.item_content = this.screen_item_new.item_template;

                    this.handleItem();
                    this.handleButtons();
                    this.handleDynamicButtons();
                }
                else{
                    try {
                        if(this.screen_item_new.item_template.hasOwnProperty('template_default') && this.screen_item_new.item_template.template_default.type == 'web-page'){
                            this.screen_item_new.item_template.template_default.attributes.content = vm.aggregateFunction(this.screen_item_new.item_template.template_default.attributes.content,this.list_item)
                        }
                    } catch (error) {}
                    
                    this.screen_item_new = JSON.stringify(this.screen_item_new);
                    if(this.screen_item_new.indexOf('##$.')>-1){
                        this.screen_item_new = this.screen_item_new.replace(/##(\$\..*?)##/g,function(me,to){
                            let value = jsonPath(that.list_item,to);
                            if(value===false){
                                value=me
                            }else{
                                value=value[0]!==null?value[0]:""
                            }
                            value=value.toString().replace(/\"/g,"\\\"").replace(/\s/g," ")
                            return value;
                        })
                    }
                    for (var key in this.list_item) {
                        if (this.list_item.hasOwnProperty(key) && this.list_item[key] != null) {
                            if(this.list_item[key].toString().search("##") != -1){
                                this.list_item[key] = this.list_item[key].replace(new RegExp('^(##).*(##)','gm'),'null')
                            }
                            if(typeof(this.list_item[key]) == 'object'){
                                this.screen_item_new = this.screen_item_new.replace(new RegExp('##'+key+'##','g'),JSON.stringify(this.list_item[key]).toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                            }else{
                                this.screen_item_new = this.screen_item_new.replace(new RegExp('##'+key+'##','g'),this.list_item[key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                            }
                            this.screen_item_new = this.screen_item_new.replace('"','\"');
                        }
                    }
                    for (var key in this.flatRuntimeAttributes) {
                        if (this.flatRuntimeAttributes.hasOwnProperty(key)) {
                            this.screen_item_new = this.screen_item_new.replace(new RegExp('##'+key+'##','g'),this.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                            this.screen_item_new = this.screen_item_new.replace('"','\"');
                        }
                    }
                    for(var key in vm.current.parent){
                        try {
                            this.screen_item_new = this.screen_item_new.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].replace(/[\r\n]+/g," "));
                        } catch (error) {
                        }
                        this.screen_item_new = this.screen_item_new.replace('"','\"');
                    }
                    this.screen_item_new = JSON.parse(this.screen_item_new);
                    if(this.screen_item_new.item_template.hasOwnProperty('column_type')){ // dynamic item template
                        let screen_item_temp = JSON.parse(JSON.stringify(this.screen_item))
                        var arrtemps = screen_item_temp.item_template.templates;
                        var cond = this.screen_item_new.item_template.column_type;
                        var temp_default = false;
                        if(this.screen_item_new.item_template.hasOwnProperty('templates')){
                            arrtemps.forEach((element,index) => {
                                if(!element.hasOwnProperty('html')){
                                    if(element.key == this.list_item[cond]){
                                        temp_default = true;
                                        this.dynamicItem(index)
                                    }
                                    return;
                                }
                                if(element.key == this.list_item[cond]){
                                    var itemJSONString = element.html;
                                    itemJSONString = vm.aggregateFunction(itemJSONString,this.list_item)
                                    temp_default = true;
                                    itemJSONString = this.replaceAttribute(itemJSONString)
                                    this.item_content =  itemJSONString;

                                    this.handleItem();
                                    this.handleButtons();
                                    this.handleDynamicButtons();
                                }
                            });
                        }
                       
                        if(temp_default == false){
                            let typeView = this.screen_item_new.item_template.template_default.type
                            if(typeView == "divkit-minimal"){
                                let divkit_tem = JSON.parse(JSON.stringify(this.screen_item))
                                this.renderDivkitMinimal(divkit_tem.item_template.template_default.attributes)
                                this.divkit = true
                            }
                            if(typeView == "divkit"){
                                let divkit_tem = JSON.parse(JSON.stringify(this.screen_item))
                                this.renderDivkit(divkit_tem.item_template.template_default.attributes)
                                this.divkit = true
                            }
                            if(typeView == "adaptive-card"){
                                let adaptive_tem = JSON.parse(JSON.stringify(this.screen_item))
                                this.renderAdaptiveCard(adaptive_tem.item_template.template_default.attributes)
                                this.divkit = true
                            }
                            if(this.screen_item_new.item_template.template_default.hasOwnProperty('type')){
                                let attributes = JSON.parse(JSON.stringify(this.screen_item.item_template.template_default.attributes))
                                if(typeView == 'article'){
                                    this.handleArticle(attributes)
                                }
                                else if(typeView == 'contact'){
                                    this.handleContact(attributes)
                                }
                                else if(typeView == "gallery"){
                                    this.handleGallery(attributes)
                                }
                                else if(typeView == "gallery2"){
                                    this.handleGallery2(attributes)  
                                }
                                else if(typeView == "html"){
                                    this.handleHtml(attributes)
                                }
                                this.handleContentAttribute(attributes,this.screen_item_new.item_template.template_default)
                            }else{
                                var itemJSONString = this.screen_item_new.item_template.template_default;
                                itemJSONString = vm.aggregateFunction(itemJSONString,this.list_item)
                                itemJSONString = this.replaceAttribute(itemJSONString)
                                this.item_content =  itemJSONString;
                            }

                            if(typeView == "web-page"){
                                this.handleWebPage(this.screen_item_new.item_template.template_default.attributes)
                            }
                            
                            this.handleItem();
                            this.handleButtons();
                            this.handleDynamicButtons();
                        }
                    }
                    else if(this.screen_item_new.item_template.hasOwnProperty('template_default')){
                        if(typeof this.screen_item_new.item_template.template_default == 'string' ){
                            let screen_item_temp = JSON.parse(JSON.stringify(this.screen_item))
                            this.screen_item_new.item_template.template_default = vm.aggregateFunction(screen_item_temp.item_template.template_default,this.list_item)
                            this.item_content = this.screen_item_new.item_template.template_default;
                        }
                        else{
                            let attributes = JSON.parse(JSON.stringify(this.screen_item.item_template.template_default.attributes))
                            if(this.screen_item_new.item_template.template_default.type == 'article'){
                                this.handleArticle(attributes)
                            }
                            else if(this.screen_item_new.item_template.template_default.type == 'contact'){
                                this.handleContact(attributes)
                            }
                            else if(this.screen_item_new.item_template.template_default.type == "gallery"){
                                this.handleGallery(attributes)
                            }
                            else if(this.screen_item_new.item_template.template_default.type == "gallery2"){
                                this.handleGallery2(attributes)    
                            }
                            else if(this.screen_item_new.item_template.template_default.type == "html"){
                                this.handleHtml(attributes)
                            }
                            this.handleContentAttribute(attributes,this.screen_item_new.item_template.template_default)
                        }
                        if(this.screen_item_new.item_template.template_default.type == "web-page"){
                            this.handleWebPage(this.screen_item_new.item_template.template_default.attributes)
                        }
                        if(this.screen_item_new.item_template.template_default.type == "divkit-minimal"){
                            let divkit_tem = JSON.parse(JSON.stringify(this.screen_item))
                            this.renderDivkitMinimal(divkit_tem.item_template.template_default.attributes)
                            this.divkit = true
                        }
                        if(this.screen_item_new.item_template.template_default.type == "divkit"){
                            let divkit_tem = JSON.parse(JSON.stringify(this.screen_item))
                            this.renderDivkit(divkit_tem.item_template.template_default.attributes)
                            this.divkit = true
                        }
                        if(this.screen_item_new.item_template.template_default.type == "adaptive-card"){
                            let adaptive_tem = JSON.parse(JSON.stringify(this.screen_item))
                            this.renderAdaptiveCard(adaptive_tem.item_template.template_default.attributes)
                            this.divkit = true
                        }
                        this.handleItem();
                        this.handleButtons();
                        this.handleDynamicButtons();
                    }else{
                        this.handleButtons();
                        this.handleDynamicButtons();
                    }
                    if(this.screen_item_new.item_template.hasOwnProperty('overflow_menu')){
                        this.overflow_menu = this.screen_item_new.item_template.overflow_menu
                        let overflow_menu_string = JSON.stringify(this.overflow_menu);
                        if(overflow_menu_string.indexOf('##')>-1){
                            overflow_menu_string = overflow_menu_string.replace(/##(.*?)##/g,"");
                        }
                        this.overflow_menu = JSON.parse(overflow_menu_string);
                        this.handleDynamicOverflow()
                    }
                }
            },
            callContact:function() {
                let customData={
                            'call_type': '##call_type##',
                            'username': this.flatRuntimeAttributes['user.username'],
                            'module_code': this.task.object.moduleCode,
                            'sub_module_code': this.task.object.subModuleCode,
                            'component_code': this.task.object.componentCode,
                            'object_code': this.task.object.code,
                            'project_code': this.flatRuntimeAttributes['projectCode'],
                }
                makeCall(this.phoneNum,customData)
            },
            handleButtons:function () {
                if(this.screen_item_new.hasOwnProperty('item_buttons')){
                    this.item_buttons = this.screen_item_new.item_buttons.sort((a,b)=>a.orderNumber-b.orderNumber);
                }
                this.item_buttons = JSON.stringify(this.item_buttons)
                for(var key in vm.current.parent){
                    this.item_buttons = this.item_buttons.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key]);
                }
                if(this.item_buttons.indexOf('${getdata_dmobj')>-1){
                    this.item_buttons = vm.getDataDmobj(this.item_buttons)
                }
                if(this.item_buttons.indexOf('##source:dmobj')>-1){
                    this.item_buttons = vm.getSourceDmobj(this.item_buttons)
                } 
                if(this.item_buttons.indexOf('##')>-1){
                    this.item_buttons = this.item_buttons.replace(/##(.*?)##/g,"");
                }
                this.item_buttons = JSON.parse(this.item_buttons)
                if(this.screen_item_new.hasOwnProperty('button_description')){
                    this.button_description = this.screen_item_new.button_description
                }               
            },
            replaceABDynamic(data,indexbutton,dynamic_buttons,type=""){
                let that = this
                data=data.sort((a,b)=>a.orderNumber-b.orderNumber)
                data.forEach(dynamic_button => {
                    if(dynamic_button.hasOwnProperty('actionID') && dynamic_button.actionID!=""){
                        dynamic_buttons.splice(indexbutton, 0, dynamic_button)
                        indexbutton++;
                    }
                })
                itemJSONString = JSON.stringify(dynamic_buttons);
                if(itemJSONString.indexOf('${')>-1){
                    itemJSONString = itemJSONString.replace(/\${(.*?)}/g,function(me,to){
                        if(me.indexOf("'##")<0 && me.indexOf("\"##")<0){
                            me = me.replace(/##(.*?)##/g,'\\"##$1##\\"')
                        }
                        return me;
                    })
                }
                let list_temp = {...that.list_item}
                for (var key in list_temp) {
                    if (list_temp.hasOwnProperty(key)) {
                        if(list_temp[key] == null){
                            list_temp[key] = "";
                        }
                        try {
                            if(typeof(list_temp[key])!=='number'){
                                list_temp[key] = JSON.stringify(list_temp[key]).slice(1,-1)
                            }
                        } catch (error) {}
                        itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),list_temp[key].toString().replace(/[\r\n]+/g," "));
                        itemJSONString = itemJSONString.replace('"','\"');
                    }
                }
                for (var key in that.flatRuntimeAttributes) {
                    if (that.flatRuntimeAttributes.hasOwnProperty(key)) {
                        itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),that.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                        itemJSONString = itemJSONString.replace('"','\"');
                    }
                }
                for(var key in vm.current.parent){
                    try {
                        itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key]);  
                    } catch (error) {}
                }
                if(itemJSONString.indexOf('${getdata_dmobj')>-1){
                    itemJSONString = vm.getDataDmobj(itemJSONString)
                }
                if(itemJSONString.indexOf('##source:dmobj')>-1){
                    itemJSONString = vm.getSourceDmobj(itemJSONString)
                }
                if(itemJSONString.indexOf('##')>-1){
                    itemJSONString = itemJSONString.replace(/##(.*?)##/g,"");
                }
                if(type === 'overflow'){
                    that.overflow_menu = JSON.parse(itemJSONString)
                    that.count = 0;
                    return;
                }
                that.item_buttons = JSON.parse(itemJSONString)
            },
            handleDynamicButtons:function () {
                let that = this;
                let indexbutton = null;
                if(!this.screen_item_new.hasOwnProperty('item_buttons')){return;}
                let item_buttons = this.screen_item_new.item_buttons.sort((a,b)=>a.orderNumber-b.orderNumber);
                let dynamic_buttons = JSON.parse(JSON.stringify(item_buttons));
                let p = $.when();
                item_buttons.forEach((button,index) => {
                    p = p.then(function() { 
                        if(button.type=="dynamic"){
                            if(button.source.indexOf('##')>-1){
                                button.source = button.source.replace(/##(.*?)##/g,"");
                            }
                        that.statusButton = true;
                        if(indexbutton===null){
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
                                    that.statusButton = false
                                    return;
                                }
                            }
                        }
                        return $.ajax({
                                url: button.source.replace("./",window.location.origin+"/"),
                                type: "GET",
                                contentType: "application/json",
                                dataType: "json",
                                success: function (data) {
                                    try {
                                        if(typeof(data[0])==='string') {
                                            that.statusButton = false;
                                            return;
                                        }
                                        if(button.hasOwnProperty('payloadLifetime')){
                                            vm.payloadLifetime[hashCode(button.source)] = {
                                                time: (new Date()).getTime(),
                                                buttons: data
                                            }
                                        }
                                        that.replaceABDynamic(data,indexbutton,dynamic_buttons)
                                        indexbutton = indexbutton + data.length
                                        that.statusButton = false;   
                                    } catch (error) {
                                        that.statusButton = false;
                                    }
                                }, error: function (error) {
                                    that.statusButton = false;
                                    toastr.error(error);
                                }
                            });

                        }
                    });
                });
            },
            handleDynamicOverflow:function () {
                let that = this;
                let indexbutton = null;
                let item_buttons = this.overflow_menu.sort((a,b)=>a.orderNumber-b.orderNumber);
                let dynamic_buttons = JSON.parse(JSON.stringify(item_buttons));
                let p = $.when();
                item_buttons.forEach((button,index) => {
                    p = p.then(function() { 
                    if(button.type=="dynamic"){
                        if(indexbutton===null){
                            indexbutton = index;
                        }
                        if(button.hasOwnProperty('payloadLifetime')){
                            if(vm.payloadLifetime.hasOwnProperty(hashCode(button.source))){
                                let timeCache = vm.payloadLifetime[hashCode(button.source)].time
                                let timePayload = button.payloadLifetime * 1000
                                let timeCurrent = (new Date()).getTime()
                                if(timeCurrent - timeCache < timePayload){
                                    let button_cache = vm.payloadLifetime[hashCode(button.source)].buttons;
                                    that.replaceABDynamic(button_cache,indexbutton,dynamic_buttons,"overflow")
                                    indexbutton = indexbutton + button_cache.length
                                    return;
                                }
                            }
                        }
                        return $.ajax({
                                url: button.source.replace("./",window.location.origin+"/"),
                                type: "GET",
                                contentType: "application/json",
                                dataType: "json",
                                success: function (data) {
                                    indexbutton= indexbutton+index;
                                    try {
                                        if(button.hasOwnProperty('payloadLifetime')){
                                            vm.payloadLifetime[hashCode(button.source)] = {
                                                time: (new Date()).getTime(),
                                                buttons: data
                                            }
                                        }
                                        that.replaceABDynamic(data,indexbutton,dynamic_buttons)
                                        indexbutton = indexbutton + data.length
                                    } catch (error) {
                                        that.count = 0;
                                    }
                                }, error: function (error) {
                                    toastr.error(error);
                                }
                            });
                        
                        }
                    });
                });

            },
            handleItem:function () {
                for (var key in this.list_item) {
                    if (this.list_item.hasOwnProperty(key) && this.list_item[key] != null) {
                        try {
                            if(this.screen_item_new.item_template.template_default.type == 'article' && key=='avatar'){
                                if(this.list_item['avatar'] != undefined &&  (this.list_item['avatar'] == "" || this.list_item['avatar'] == null)){
                                    this.list_item[key] = '/metronic6/images/rta_nophoto.webp';
                                }
                            }
                        } catch (error) {}
                        this.item_content = this.item_content.replace(new RegExp('##'+key+'##','g'),this.list_item[key]);
                    }
                }
                for (var key in vm.flatRuntimeAttributes) {
                    if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                        this.item_content = this.item_content.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].toString().replace(/[\r\n\t]+/g," "));
                        this.item_content = this.item_content.replace('"','\"');
                    }
                }
                for (var key in vm.current.parent) {
                    if (vm.current.parent.hasOwnProperty(key)) {
                        this.item_content = vm.current.parent[key] != null ? (this.item_content.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].toString().replace(/[\r\n\t]+/g," "))) : this.item_content;
                        this.item_content = this.item_content.replace('"','\"');
                    }
                }
                if(this.item_content.indexOf('${getdata_dmobj')>-1){
                    this.item_content = vm.getDataDmobj(this.item_content)
                }
                if(this.item_content.indexOf('##source:dmobj')>-1){
                    this.item_content = vm.getSourceDmobj(this.item_content)
                }
                if(this.item_content.indexOf('##')>-1){
                    this.item_content = this.item_content.replace(/##(.*?)##/g,"");
                }
            },
            dynamicItem(dynmicNumber){
                if(this.screen_item_new.item_template.templates[dynmicNumber].layout.hasOwnProperty('type')){
                    let attributes = JSON.parse(JSON.stringify(this.screen_item.item_template.templates[dynmicNumber].layout.attributes))
                    let typeView = this.screen_item_new.item_template.templates[dynmicNumber].layout.type
                    if(typeView == "divkit-minimal"){
                        let divkit_attributes = JSON.parse(JSON.stringify(this.screen_item.item_template.templates[dynmicNumber].layout.attributes))
                        this.renderDivkitMinimal(divkit_attributes)
                        this.divkit = true
                    }
                    if(typeView == "divkit"){
                        let divkit_attributes = JSON.parse(JSON.stringify(this.screen_item.item_template.templates[dynmicNumber].layout.attributes))
                        this.renderDivkit(divkit_attributes)
                        this.divkit = true
                    }
                    if(typeView == "adaptive-card"){
                        let adaptive_attributes = JSON.parse(JSON.stringify(this.screen_item.item_template.templates[dynmicNumber].layout.attributes))
                        this.renderAdaptiveCard(adaptive_attributes)
                        this.divkit = true
                    }
                    if(typeView == 'article'){
                        this.handleArticle(attributes)
                    }
                    else if(typeView == 'contact'){
                        this.handleContact(attributes)
                    }
                    else if(typeView == "gallery"){
                        this.handleGallery(attributes)
                    }
                    else if(typeView == "gallery2"){
                        this.handleGallery2(attributes)  
                    }
                    else if(typeView == "html"){
                        this.handleHtml(attributes)
                    }
                    this.handleContentAttribute(attributes,this.screen_item_new.item_template.templates[dynmicNumber].layout)
                }else{
                    var itemJSONString = this.screen_item_new.item_template.templates[dynmicNumber].layout;
                    itemJSONString = this.replaceAttribute(itemJSONString)
                    this.item_content =  itemJSONString;
                }
                if(typeView == "web-page"){
                    this.handleWebPage(this.screen_item_new.item_template.templates[dynmicNumber].layout.attributes)
                }
                this.handleItem();
                this.handleButtons();
                this.handleDynamicButtons();
                        
            },
            mouseDown:function(){
                this.timer = Date.now();
            },
            mouseUp:function(event){
                if((Date.now() - this.timer) < 200 ){
                    this.handleClick(event)
                }
            },
            handleClick:function (event) {
                if(this.screen_item_new == undefined || Object.keys(this.screen_item_new).length == 0){
                    this.screen_item_new = JSON.parse(JSON.stringify(this.screen_item));
                }
                if (this.screen_item_new.hasOwnProperty('item_onclick')) {
                    for (let i = 0; i < this.screen_item_new.item_onclick.length; i++) {
                        if(this.screen_item_new.item_onclick[i].hasOwnProperty('column') && this.screen_item_new.item_onclick[i].hasOwnProperty('value')){
                            if(this.list_item[this.screen_item_new.item_onclick[i].column] != this.screen_item_new.item_onclick[i].value || this.list_item[this.screen_item_new.item_onclick[i].column] === ""){
                                continue;
                            }
                        }
                        if(this.screen_item_new.item_onclick[i].type=='navigate' && this.task.object.screens.hasOwnProperty(this.screen_item_new.item_onclick[i].target_screen_id)){
                            if(this.task.code===9999 && vm.level == 0){
                                this.tempObject = JSON.parse(JSON.stringify(this.object));
                                this.tempObject.tempListItem = this.list_item;
                                vm.openTask(this.tempObject,"tabs", "center|start","center|start",null,null,null,null,null,this.screen_item_new.item_onclick[i].target_screen_id)
                            }
                            else if(vm.tasks[vm.activeTaskCode]!=undefined && vm.tasks[vm.activeTaskCode].hasOwnProperty('openModule')){
                                this.tempObject = JSON.parse(JSON.stringify(this.object));
                                this.tempObject.tempListItem = this.list_item;
                                vm.openTask(this.tempObject,"tabs", "center|start","center|start",null,null,null,null,null,this.screen_item_new.item_onclick[i].target_screen_id)
                            }
                            else if(this.task.code===9999){
                                let pre=JSON.parse(JSON.stringify(vm.activeScreenCom))
                                vm.activeScreenSub.push(this.task.object.subModuleCode);
                                let preScreen = {...vm.activeScreenComPre}
                                preScreen[this.object.code] = vm.activeScreenCom[this.object.code]
                                vm.activeScreenComPre={...preScreen};
                                vm.activeScreenCom[this.object.code]=this.screen_item_new.item_onclick[i].target_screen_id;
                                vm.activeTaskCode = this.task.code;
                                vm.activeObjectCode = '';
                                vm.activeItemData=undefined;
                                vm.activeScreenCode = vm.previousScreenCode;
                                vm.titleSkipObject = this.object.screens[this.screen_item_new.item_onclick[i].target_screen_id].title;
                                vm.activeScreenSkipObject = this.screen_item_new.item_onclick[i].target_screen_id;
                                vm.jumpToScreen(this.screen_item_new.screenCode, this.screen_item_new.item_onclick[i].target_screen_id,this.list_item);
                            }else{
                                vm.jumpToScreen(this.screen_item_new.screenCode, this.screen_item_new.item_onclick[i].target_screen_id,this.list_item);
                            }
                        }
                        else if(this.screen_item_new.item_onclick[i].type == 'detail'){
                            try{
                                var temp = vm.lang;
                            }
                            catch(err){
                                if(String(err).indexOf('en is not defined')){
                                    var lang = 'en'
                                }
                                else if(String(err).indexOf('vi is not defined')){
                                    var lang = 'vi'
                                }
                            }
                            lang = 'vi';
                            if(lang == 'en'){
                                var title = 'Detail';
                                var layout = this.screen_item_new.item_onclick[i].layout.split("<en>");
                                html_template = "<en>"+layout[1];
                            }
                            else{
                                var title = 'CHI TIẾT';
                                var layout = this.screen_item_new.item_onclick[i].layout.split("<en>");
                                html_template = layout[0];
                            }

                            id_random=Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
                            this.task.object.screens[id_random] = {
                                "code": id_random,
                                "title": title,
                                "top_area": [

                                ],
                                "body_area": [
                                    {
                                        "code": id_random,
                                        "screenCode": id_random,
                                        "type": "htmlView",
                                        "html_template": html_template,
                                    }
                                ],
                                "bottom_area": [

                                ]
                            }
                            
                            if(this.task.code == 9999){
                                for (var key in this.list_item) {
                                    if (this.list_item.hasOwnProperty(key) && this.list_item[key] != null ) {
                                        html_template = html_template.replace(new RegExp('##'+key+'##','g'),this.list_item[key].toString().replace(/[\r\n]+/g," "));
                                        html_template = html_template.replace('"','\"');
                                    }
                                }
                                for (var key in this.flatRuntimeAttributes) {
                                    if (this.flatRuntimeAttributes.hasOwnProperty(key)) {
                                        html_template = html_template.replace(new RegExp('##'+key+'##','g'),this.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                                        html_template = html_template.replace('"','\"');
                                    }
                                }
                                let realTask = JSON.parse(JSON.stringify(this.task))
                                realTask.object.screen = {}
                                realTask.object.screens[id_random] = {
                                    "code": id_random,
                                    "title": title,
                                    "top_area": [

                                    ],
                                    "body_area": [
                                        {
                                            "code": id_random,
                                            "screenCode": id_random,
                                            "type": "htmlView",
                                            "html_template": html_template,
                                        }
                                    ],
                                    "bottom_area": [

                                    ]
                                }
                                // Add dismissParent attribute
                                if (this.object.hasOwnProperty('dismissParent') && this.object.dismissParent === true) {
                                    realTask.object.dependView = vm.activeTaskCode; 
                                    realTask.object.dismissPr = true;
                                } else {
                                    realTask.object.dependView = vm.activeTaskCode; 
                                    realTask.object.dismissPr = false;
                                }
                                vm.openTask(realTask.object,"tabs", "center|start","center|start",null,null,null,null,null,id_random)
                            }
                            else{
                                vm.jumpToScreen(this.screen_item_new.screenCode, id_random,this.list_item);
                            }
                        }
                        else if(this.screen_item_new.item_onclick[i].type == 'action_button'){
                            try {
                                $(event.target).closest(".webapp-popup").find('.minimize-button button').click()
                            } catch (error) {}
                            if(this.screen_item_new.item_onclick[i].button.type === 'act_call_cloudphone'){
                                this.$refs.actionbutton1.callCloudPhone(this.screen_item_new.item_onclick[i].button);
                            }
                            else if(this.screen_item_new.item_onclick[i].button.type === 'act_fill_form'){
                                this.$refs.actionbutton1.openFillForm(this.screen_item_new.item_onclick[i].button);
                            }
                            else if(this.screen_item_new.item_onclick[i].button.type === 'act_report'){
                                this.$refs.actionbutton1.openReportView(this.screen_item_new.item_onclick[i].button);
                            }
                            else if(this.screen_item_new.item_onclick[i].button.type === 'act_dm_view'){
                                if(this.screen_item_new.item_onclick[i].button.hasOwnProperty('alias')){
                                    this.screen_item_new.item_onclick[i].button.alias = this.screen_item_new.item_onclick[i].button.alias.replace(/##alias##/,this.list_item['alias'])
                                }
                                this.$refs.actionbutton1.openDataModalViews(this.screen_item_new.item_onclick[i].button,this.list_item);
                            }
                            else if(this.screen_item_new.item_onclick[i].button.type === 'act_gps'){
                                this.$refs.actionbutton1.openMapView(this.screen_item_new.item_onclick[i].button);
                            }
                            else if(this.screen_item_new.item_onclick[i].button.type === 'act_open_module'){
                                this.$refs.actionbutton1.openModule(this.screen_item_new.item_onclick[i].button);
                            }
                            else if(this.screen_item_new.item_onclick[i].button.type === 'act_get_instance'){
                                this.$refs.actionbutton1.getInstance(this.screen_item_new.item_onclick[i].button);
                            }
                            else if(this.screen_item_new.item_onclick[i].button.type === 'act_open_html_screen'){
                                this.$refs.actionbutton1.openHtmlViewScreenTheme(this.screen_item_new.item_onclick[i].button);
                            }
                            else if(this.screen_item_new.item_onclick[i].button.type === 'act_open_chat'){
                                this.$refs.actionbutton1.handleActionOpenChat(this.screen_item_new.item_onclick[i].button);
                            }
                            else if(this.screen_item_new.item_onclick[i].button.type === 'act_share'){
                                this.$refs.actionbutton1.handleActionShare(this.screen_item_new.item_onclick[i].button);
                            }
                            else if(this.screen_item_new.item_onclick[i].button.type === 'act_leaflet_map'){
                                this.$refs.actionbutton1.openLeafletMapView(this.screen_item_new.item_onclick[i].button);
                            }
                        }
                        else{
                                toastr.error(translations["Screen definition not found"]);
                        }
                        break;
                    }
                }
            },
            renderDivkitMinimal(attributes){
                let that = this
                let schema_temp = JSON.stringify(attributes)
                schema_temp = this.handleSchema(schema_temp)
                attributes = JSON.parse(schema_temp)
                let json = {
                    "templates": {},
                    "card": {
                        "log_id": "simple",
                        "states": [
                            {
                                "state_id": 0,
                                "div": {
                                    "type": "container",
                                    "orientation": "vertical",
                                    "items": [
                                        {
                                            "type": "container",
                                            "orientation": "vertical",
                                            "items": [
                                                {
                                                    "type": "separator"
                                                },
                                                {
                                                    "type": "container",
                                                    "orientation": "horizontal",
                                                    "paddings": {
                                                        "left": 8,
                                                        "right": 8,
                                                        "top": 8,
                                                        "bottom": 8
                                                    },
                                                    "items": [
                                                        {
                                                            "type": "image",
                                                            "image_url": attributes.image,
                                                            "preview": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAABQCAYAAABPlrgBAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAOxAAADsQBlSsOGwAAB0NJREFUeJztnG1sU9cdxp/n2AklZKMNnXiRSqFJHAqB0Dop1SqNTRoIpGmqyhoNdWIbK4nDXuiqTd2Qqihaq20gpKGleE7UoVXdSmn7Aa1M3T6QttIqEhLaZmlYYwNjLUu7daxak0Cc+D77kAQcSBz7+trXyfz7lHvuOf//40c35x6fFwN58uTJkyejMFuJNh4+f9NANFpFeaogywfydgCLAS0UMJ+iATAiaIDgJQEXQescgV6PrNPtgVUXQCobWjNnisTq4Nk1MrH7CbMZwgYQhfbjoV/ECcg67onyeMce338dVDsJx01Ze+jCLYUc/gaInQQrnY4PAJKuADgmmZbTDaVtTj9BjpniD/UuhQoeo7QLZJFTcWdG3RSfPPVB2YtoouVExLRNWffMWwsKh4p+LOBRgvOdEGUHCW/B4NGu+vK2dGOlZcrdh/q+ZIinQC5PV4iDPBe1+Ej37rJ/2g1gy5TVzT3F873zDhLYaTdxRhH+BepbnQHf7+00T9mU6kNnKmS8xwhU2EkIYEDE943wfqJKlmhIfQ3Adpt5IGF/8Qfv732t6QujqbRLyRR/qG8zxBcIfDo1edeQ1NLV4KtPpu5Yf7VgwG6u8XyvzCuI1b7x8J2fJNvGJFvRHwo/SIsvp2MIAIC8nGzV7h3rB9PKBYDkluiop63ml72Lkm2TlCk1wXAtpSMgCuzLcxP6VeA9kawxM5pSHYpstYjfAkz6qcpNuE7eguP+0MUZx1AJP2hNS3gNpKMEvM6JcxFiAzT0DBqV8HNPe9MfOrtQMRwDUOy4OBchsK16aeRHiepMbYpEygqCKM2IMtfRT/zByH3T3Z3SlOpQpBZpjA8SQaUwDJAy9C2ehtBvputfbjCl6vD5myUdzIwYANDamf6nJ/C3RO7KmAyilBpqnPrWdVQHwwdBfC9jYgAI6CX0XsI6ogfABhKfyqCOUWPMmlN1pX3x5ZNMuas5XGa8ODNn3jZJIOClrkD5V+LLJj3GHq8e/38yBBh7G90TfLcqvuyqKf7Q2eUSHsq+LPexaB6Lv772pCgWIOnJuqIcQMCD/lDv0olrAwAbG9u8AL7pmiqXIeCFvDsmrr0AMLhs2ecpLnEykaQYwC92BcpeszWx3CjjXxbZSaHVSV3TwbGu4+fA+JMii/c7nwXnuhrKX7U9095E645byg47rGp6yLX+UF8pMG4KwS0ZyJL2zPoLtYw5oSRpLG4FAFP9VPi2ufsdJzVIbAQAI6MNbovJFYQxLwyJ9W6LyRUI3nZva0+JAWh3Vn5OEovNqzCSVrgtJJeQxdsN4Oz4JC787JzTpbXYkLg5I7GBUn+wb1PmJooyg8gSL6CizGxToSHxp+pQBPhV+FpS4GBXoPyRDCR0CBWZ2b904TCi14x9R8kTx4gBmfbS5FyC1KAh9B+3heQSAi8ZCf9wW0hOIfUbgufd1pFTGJ4zonXGbR05g6TLI8N9BsSbbmvJFQSEe79TOWAAtbstJmcg2gHAdNWv+gjSX9zWkwsQaAOuLnHwD26KyQkkiaOvABOmGPOSq4Jygz931a/uB8ZN6ay7o1NSX+I2cxtBz078PbZuTIrBcCuA/Q7n2gfyVUpXlzliMetCKgEIbI2/FqwigU2OHoYQBmG8R+JyjnFva0/J6Gjhe44dNpD+3hkoX5GJMzo1wXCtiOedi6jmzoDvuxNXV6cNTu6qvAQg6Fga8nKmDi3FpCGnYgkY9Sh2IL5s0lxKVGYfgLR2OM82KLS2N9z5t/iySaaMn3z4aTZFuYmETzxe03R9+Q2zbh8P64Cg8PXlcxFCj7fvKv3w+vIbTIns8Q0b6OHsyHKVkysXlTdPdWPK+dlTgYrXIR2Y6t6cQBj0iDumW8CfdtJ6aFF0L4CT9hNnbmnDmPSWHwRrV3tD2bRdxLSm9NZWRmMjo9sEXLSTmOSy9U/3fcZO25mQuM5+W+zvaqh4LlGdGR2/J/huVYzmdTvnfCR9SPBtUE6OV4oBTruFPKEe6GhXf/n2mU6lJvUYVofCn4XwR8zmwwvC8aFFww/01lZGZ6qa1EJYZ335G5alTZi9M/8vfhzVtmQMAVI4Lnd6t+9kLKb7JMyqiW4Jv1hZUvbVyB7fcLJtUu7F/aG/3kp5fgdgU6pts4mkKyR2dwZ8KW8mtPdqa5TxLwn/gOATuXiuUMDbxuChU3Xl79hpn9b7vqYlvEaWQnbfBk4j6QqoJy+XjOxLtv+YivQHWI0yNUvC2y3yCQIr0o5nE0FHPMba21G3Ku0+z7FR5+qjPYUL/j3v6xb1Q4LlTsVNhKQYyaOxmPnZm98u7XYqrvND8UaZuxdHNtFoJ4Qvk7zJ6RSCwhSeNR78uqPOl/DnAeyQ0a1Xq5t7iou8BZsFbgH4uXR+HwFQh8QTHlgvdwR83Zn8KaKs7kfzh84uhKVKyqoQuZzAYhALx7eYeSRESQ1A+AhgP2idg2W9s/LWVZGsb0nPkydPnjx5ssr/ANuWjSBjQ/QTAAAAAElFTkSuQmCC",
                                                            "width": {
                                                                "type": "fixed",
                                                                "value": 24
                                                            },
                                                            "height": {
                                                                "type": "fixed",
                                                                "value": 24
                                                            }
                                                        },
                                                        {
                                                            "type": "text",
                                                            "font_size": 18,
                                                            "line_height": 24,
                                                            "max_lines": 1,
                                                            "text": attributes.title,
                                                            "paddings": {
                                                                "left": 8
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
                setTimeout(() => {
                        let divkit=  window.Ya.Divkit.render({
                        id: 'smth',
                        target: document.querySelector('#root-'+that.classRandom)==null?document.querySelector('#root'):document.querySelector('#root-'+that.classRandom),
                        json: json,
                        onError(details) {
                            
                        },
                        onStat(details) {
                            
                        }
                    });
                }, 1);

            },
            handleSchema(schema_temp){
                schema_temp = vm.aggregateFunction(schema_temp,this.list_item)
                for (var key in this.list_item) {
                    if(this.list_item[key]==null){
                        this.list_item[key]='';
                    }
                    if (this.list_item.hasOwnProperty(key) && this.list_item[key]!==null ) {
                        if(typeof(this.list_item[key]) == 'object'){
                            schema_temp = schema_temp.replace(new RegExp('##'+key+'##','g'),JSON.stringify(this.list_item[key]).toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                        }else{
                            schema_temp = schema_temp.replace(new RegExp('##'+key+'##','g'),this.list_item[key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                        }
                        schema_temp = schema_temp.replace('"','\"');
                    }
                }
                for (var key in this.flatRuntimeAttributes) {
                    if (this.flatRuntimeAttributes.hasOwnProperty(key)) {

                        schema_temp = schema_temp.replace(new RegExp('##'+key+'##','g'),this.flatRuntimeAttributes[key].toString().replace(/[\r\n\t]+/g," "));
                        schema_temp = schema_temp.replace('"','\"');
                    }
                }
                for (var key in vm.current.parent) {
                    if (vm.current.parent.hasOwnProperty(key)) {
                        schema_temp = vm.current.parent[key] != null ? (schema_temp.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].toString().replace(/[\r\n\t]+/g," "))) : schema_temp;
                        schema_temp = schema_temp.replace('"','\"');
                    }
                }
                if(schema_temp.indexOf('##')>-1){
                    schema_temp = schema_temp.replace(/##(.*?)##/g,"");
                }
                return schema_temp;
            },
            renderDivkit(schema){
                let that= this
                let schema_temp = JSON.stringify(schema)
                schema_temp = this.handleSchema(schema_temp)
                schema = JSON.parse(schema_temp)
                let schema_lang = schema.schema
                let lang = vm.lang;
                if(schema.hasOwnProperty('schema_by_locale')){
                    if(schema.schema_by_locale.hasOwnProperty(lang)){
                        schema_lang = schema.schema_by_locale[lang]
                    }
                }
                setTimeout(() => {
                    let divkit=  window.Ya.Divkit.render({
                    id: 'smth',
                    target: document.querySelector('#root-'+that.classRandom)==null?document.querySelector('#root'):document.querySelector('#root-'+that.classRandom),
                    json: {
                        card: schema_lang.card,
                        templates: schema_lang.templates
                    },

                    onError(details) {
                        
                    },
                    onStat(details) {
                        if(details.hasOwnProperty('action') && details.action.url.indexOf("div-action://rtab?")>-1){
                            that.checkABDivkit = false
                            let paramurl = details.action.url.replace("div-action://rtab?","");
                            let urlParams = new URLSearchParams(paramurl);
                            let params = Object.fromEntries(urlParams);
                            vm.callActionButton(JSON.stringify(params),"","","","","")
                        }
                    }
                });
                }, 1);
            },
            renderAdaptiveCard(schema){
                let that = this
                let schema_temp = JSON.stringify(schema)
                schema_temp = this.handleSchema(schema_temp)
                schema = JSON.parse(schema_temp)
                let schema_lang = schema.schema
                let lang = vm.lang;
                if(schema.hasOwnProperty('schema_by_locale')){
                    if(schema.schema_by_locale.hasOwnProperty(lang)){
                        schema_lang = schema.schema_by_locale[lang]
                    }
                }
                let host_config = schema.host_config
                var adaptiveCard = new AdaptiveCards.AdaptiveCard();
                adaptiveCard.hostConfig = new AdaptiveCards.HostConfig(host_config);
                adaptiveCard.onExecuteAction = function(action) {
                     if(action._processedData!=undefined){
                        vm.callActionButton(JSON.stringify(action._processedData),"","","","","")
                     }else{
                        that.handleClickDiv()
                     }
                }
                adaptiveCard.parse(schema_lang);
                var renderedCard = adaptiveCard.render();
                setTimeout(() => {
                    document.getElementById('root-'+this.classRandom).appendChild(renderedCard)
                }, 1);
            },
            handleClickDiv(event){
                if(this.checkABDivkit){
                    this.handleClick(event);
                    return
                }
                this.checkABDivkit = true
            },
            handleArticle(attributes){
                let description_html = ''
                let secondary_action = ''
                if(attributes.hasOwnProperty('description') && attributes.description.toString().indexOf('##')>-1){
                    description_html = attributes.description
                    let lang = vm.lang;
                    if(lang==='vi'){
                        description_html = description_html.replace(/<en>.*<\/en>/,'')
                    }else{
                        description_html = description_html.replace(/<vi>.*<\/vi>/,'')
                    }
                }
                if(attributes.hasOwnProperty('secondary_action') && attributes.secondary_action !== '') {
                    this.hasSecondary = true
                    this.item_content = '<div class = "row col-10" style="margin-bottom:2%;overflow:hidden;"> <div class="col" style="float:##thumbnail_alignment##;padding:0 20px;"> <img src= "##thumbnail##" onerror="this.onerror=null;this.src=\'./metronic6/images/rta_nophoto.webp\';" style="height:120px;width:120px"> </div> <div class="row"> <div> <div> <h3>'+(attributes.hasOwnProperty('title')?'##title##':"")+'</h3> </div> <div> <span>'+(attributes.hasOwnProperty('secondary_text')?'##secondary_text##':"")+'</span> </div> <div style="display:flex; justify-content:space-between;"> <h5 style="color:grey;">'+(description_html !== '' ? description_html : (attributes.hasOwnProperty('description')?'##description##':''))+'</h5><div class="btn-sec-'+this.classRandom+'"></div> </div> </div> </div> </div>';
                    this.item_content =  this.item_content.replace(new RegExp('##thumbnail_alignment##','g'),this.screen_item_new.item_template.template_default.thumbnail_alignment == undefined ? 'left':this.screen_item_new.item_template.template_default.thumbnail_alignment)                             
                } else {
                    this.item_content = '<div class = "row col-10" style="margin-bottom:2%;margin-top:2%;overflow:hidden;"> <div class="col" style="float:##thumbnail_alignment##;margin-right:10px;display:flex;align-items:center;justify-content:center;width:120px;height:120px;"> <img src= "##thumbnail##" onerror="this.onerror=null;this.src=\'./metronic6/images/rta_nophoto.webp\';" style="width:100%;height:100%;object-fit:cover;"> </div> <div class="row"> <div> <div> <h3>'+(attributes.hasOwnProperty('title')?'##title##':"")+'</h3> </div> <div> <span>'+(attributes.hasOwnProperty('secondary_text')?'##secondary_text##':"")+'</span> </div> <div> <h5 style="color:grey;">'+(description_html !== '' ? description_html : (attributes.hasOwnProperty('description')?'##description##':''))+'</h5> </div> </div> </div> </div>';
                    this.item_content =  this.item_content.replace(new RegExp('##thumbnail_alignment##','g'),this.screen_item_new.item_template.template_default.thumbnail_alignment == undefined ? 'left':this.screen_item_new.item_template.template_default.thumbnail_alignment)
                }
            },
            handleContact(attributes){
                if(this.list_item[attributes.avatar] != null && this.list_item[attributes.avatar] != ""){
                    if( typeof this.list_item[attributes.avatar] == "string" && 
                        (
                            this.list_item[attributes.avatar].includes(".png") ||
                            this.list_item[attributes.avatar].includes(".jpg") ||
                            this.list_item[attributes.avatar].includes(".svg") ||
                            this.list_item[attributes.avatar].includes(".gif")
                        )   
                    ) {
                        this.item_content = '<div style="padding: 0;" class="col-md-9"> <div style="height:70px; " > <img src="##avatar##" onerror="this.onerror=null;this.src=\'./metronic6/images/rta_nophoto.webp\';" width="70px" height="70px" style="border-radius: 50% !important; float:left;"> </img> <p style="float: left; width:80%; padding-left: 2%; margin-top: 14px;"> <span style="font-size: 17px; font-weight: bold;"> ##name## </span> <br> <span style="font-size: 13px; color: #737373;"> ##phone## </span></p>  </div></div>';
                    } else {
                        let none_avt = "https://cdn.rtworkspace.com/plugins/webapp/images/avt_user.svg";
                        this.item_content = '<div style="padding: 0;" class="col-md-9"> <div style="height:70px; " > <img src='+none_avt+' width="70px" height="70px" style="border-radius: 50% !important; float:left;"> </img> <p style="float: left; width:80%; padding-left: 2%; margin-top: 14px;"> <span style="font-size: 17px; font-weight: bold;"> ##name## </span> <br> <span style="font-size: 13px; color: #737373;"> ##phone## </span></p>  </div></div>';
                    } 
                }
                else{
                    let letterName = 'N/A';
                    let arrColor = ['#009788','#fc5ee6','#33e142','#8894ac','#e7f615','#eb678c','#966a81','#f3b806','#8b5f5c','#44a9c7','#573b76','#dca8aa','#10e4f0','#9422f3']
                    let colorText = arrColor[Math.floor(Math.random()*arrColor.length)];
                    if(this.list_item[attributes.name] != null && this.list_item[attributes.name] != ""){
                        let arrName = this.list_item[attributes.name].split(" ");
                        letterName = arrName[0].charAt(0);                               
                    }
                    this.item_content = '<div style="padding: 0;" class="col-md-9"> <div style="height:70px; " > <div style="height:70px;width:70px;background-color:'+colorText+'; font-size: 33px; border-radius: 50% !important; text-align:center; padding-top:13px; color:white; font-weight:bold; float:left;"> '+letterName.toUpperCase()+' </div> <p style="float: left; width:80%; padding-left: 2%; margin-top: 14px;"> <span style="font-size: 17px; font-weight: bold;"> ##name## </span> <br> <span style="font-size: 13px; color: #737373;"> ##phone## </span></p>  </div></div>';
                }
            },
            handleGallery(attributes){
                let star='';
                let numberStar="";
                if(this.screen_item_new.item_template.template_default.hasOwnProperty('rating')){
                    numberStar = this.list_item[attributes.rating].length === 0 ? 0 : this.list_item[attributes.rating]
                    if(this.screen_item_new.item_template.template_default.hasOwnProperty('numStars')){
                        let maxStar = this.screen_item_new.item_template.template_default.numStars;
                        for (let i = 0; i < maxStar; i++) {
                            if(numberStar>i){
                                star += '<span class="fa fa-star starchecked"></span>';
                            }else{
                                star += '<span class="fa fa-star starunchecked"></span>';
                            }
                        }
                    }
                }
                let imgSrc = attributes.hasOwnProperty('image') ?this.list_item[attributes.image]:'';
                if(imgSrc.length == 0 ){
                    imgSrc ="/metronic6/images/rta_nophoto.webp"
                
                }
                if(attributes.hasOwnProperty('title') && this.list_item[attributes.title].length>0){
                    let lang = vm.lang;
                    if(lang==='vi'){
                        this.list_item[attributes.title] = this.list_item[attributes.title].replace(/<en>.*<\/en>/,'')
                    }else{
                        this.list_item[attributes.title] = this.list_item[attributes.title].replace(/<vi>.*<\/vi>/,'')
                    }
                    
                }
                let description_html = ''
                if(attributes.hasOwnProperty('description') && attributes.description.toString().indexOf('##')>-1){
                    description_html = attributes.description
                    let lang = vm.lang;
                    if(lang==='vi'){
                        description_html = description_html.replace(/<en>.*<\/en>/,'')
                    }else{
                        description_html = description_html.replace(/<vi>.*<\/vi>/,'')
                    }
                }
                let heightDyImg = "";
                if (this.screen_item.hasOwnProperty('layout') && this.screen_item.layout.hasOwnProperty('height')) {
                    let heightModule = this.screen_item.layout.height;
                    if (heightModule != null && heightModule != undefined && heightModule != "" ) {
                        if (typeof heightModule == "number") heightModule = heightModule.toString();
                        // no units
                        if (!heightModule.includes('%') && !heightModule.includes('px')) {
                            heightModule = heightModule + 'px';
                            heightDyImg = "height: calc("+heightModule+" * 2/3 );";  
                        } else {
                            if (heightModule.includes('%')) {
                                heightModule = heightModule.replace('%','vh');
                            }
                            heightDyImg = "height: calc("+heightModule+" * 2/3 );";  
                        }   
                    } else {
                        heightDyImg = "height: 300px;"; 
                    }    
                } else {
                    heightDyImg = "height: 300px;"; 
                }
                this.item_content='<div class=""><div width="100%" style="display:flex; justify-content:center; background:#cccccc; background-image:url('+imgSrc+'); background-size: 1000000%; background-position:center;"> <img src="'+imgSrc+'" onerror="this.onerror=null;this.src=\'./metronic6/images/rta_nophoto.webp\';" alt="" width="auto"  style="max-width:100%; max-height:300px; '+heightDyImg+'"></div> <div class="card-body"> <h3>'+this.list_item[attributes.title]+(star!==""?('</h3><div>'+star+'<span style="margin-left:1em; color:#999999; font-size:0.8em;">'+Number.parseFloat(numberStar).toFixed(1)):'')+'</span></div> <h5>'+(attributes.hasOwnProperty('secondary_text')?this.list_item[attributes.secondary_text]:'')+'</h5> <p class="">'+(description_html !== '' ? description_html : (attributes.hasOwnProperty('description')?this.list_item[attributes.description]:''))+'</p> </div> </div>'
            },
            handleGallery2(attributes){
                let height = '300px'
                if(this.screen_item_new.hasOwnProperty('layout')){
                    if(this.screen_item_new.layout.hasOwnProperty('height')){
                        if(!isNaN(Number(this.screen_item_new.layout.height))){
                            height = String(this.screen_item_new.layout.height) + 'px';
                        }
                        if(String(this.screen_item_new.layout.height).indexOf('px')>-1){
                            height = String(this.screen_item_new.layout.height);
                        }else if(String(this.screen_item_new.layout.height).indexOf('%')>-1){
                            if(this.task.code == 9999){
                                height = 'calc( ( 100vh - 120px ) * '+this.screen_item_new.layout.height.replace('%','')+'/100)'
                            }else{
                                height = 'calc( ( 100vh - 90px ) * '+this.screen_item_new.layout.height.replace('%','')+'/100)'
                            }
                        }
                    }
                } 
                let imgSrc = attributes.hasOwnProperty('image') ?this.list_item[attributes.image]:'';
                let title_temp = attributes.hasOwnProperty('title') ?this.list_item[attributes.title]:'';

                let description_html = ''
                if(attributes.hasOwnProperty('description') && attributes.description.toString().indexOf('##')>-1){
                    description_html = attributes.description
                    let lang = vm.lang;
                    if(lang==='vi'){
                        description_html = description_html.replace(/<en>.*<\/en>/,'')
                    }else{
                        description_html = description_html.replace(/<vi>.*<\/vi>/,'')
                    }
                }
                if(imgSrc.length == 0 ){
                    imgSrc ="./metronic6/images/rta_nophoto.webp"
                }
                this.item_content= '<div class="item active" style="position: relative;"><div width="100%" style="max-height: 300px; height:'+height+';display:flex; justify-content:center; background:#cccccc; background-image:url('+imgSrc+'); background-size: 1000000%; background-position:center;border-radius: 25px !important;overflow:hidden;"><img src="'+imgSrc+'" alt="" onerror="this.onerror=null;this.src=\'./metronic6/images/rta_nophoto.webp\';" width="auto"  style="max-width:100%"></div><div class="" style="color:#fff;position: absolute;padding: 0 25px !important;overflow:hidden;bottom: 0;"><h3 style="font-weight: bold;">'+title_temp+'</h3> <h5>'+(attributes.hasOwnProperty('secondary_text')?this.list_item[attributes.secondary_text]:'')+'</h5> <p style="overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">'+(description_html !== '' ? description_html : (attributes.hasOwnProperty('description')?this.list_item[attributes.description]:''))+'</p></div></div>'
            },
            handleHtml(attributes){
                if(attributes.hasOwnProperty('raw')){
                    let raw_tem = attributes.raw
                    if(this.lang === 'vi') {
                        raw_tem.replace(/<vi>(.*)<\/vi>/, function(key1,key2) {
                            raw_tem = key2;
                        })
                    } else {
                        raw_tem.replace(/<en>(.*)<\/en>/, function(key1,key2) {
                            raw_tem = key2;
                        })
                    }  
                    this.item_content = raw_tem
                }else if(attributes.hasOwnProperty('source')){
                    let source_tem = attributes.source
                    if(this.lang === 'vi') {
                        source_tem.replace(/<vi>(.*)<\/vi>/, function(key1,key2) {
                            source_tem = key2;
                        })
                    } else {
                        source_tem.replace(/<en>(.*)<\/en>/, function(key1,key2) {
                            source_tem = key2;
                        })
                    } 
                    this.item_content = '<iframe src="'+source_tem+'" frameborder="0" height="100%" width="100%"></iframe>'
                }
            },
            handleContentAttribute(attributes,layout){
                for(let key in attributes){
                    if (attributes.hasOwnProperty(key)) {
                        if(typeof(attributes[key])!='string'){
                            continue;
                        }
                        if(key == 'phone' && layout != '' && layout.cloud == true){
                            this.phoneNum = this.list_item[attributes[key]];
                            if (this.phoneNum == "" || this.phoneNum == null || this.phoneNum == undefined) {
                                this.phoneNum = false;
                            }
                        }
                        if(attributes[key].length < 1){
                            this.item_content = this.item_content.replace(new RegExp('##'+key+'##','g'),attributes[key].toString().replace(/[\r\n]+/g," "));
                        }
                        else{
                            if(key == 'thumbnail'){
                                if(this.list_item[attributes[key]] !== '' && this.list_item[attributes[key]] != null && this.list_item[attributes[key]] != undefined){
                                    this.item_content = this.item_content.replace(new RegExp('##'+key+'##','g'),"##"+attributes[key].replace(/[\r\n]+/g," ")+"##");
                                }else{
                                    this.item_content = this.item_content.replace(new RegExp('##'+key+'##','g'),"/metronic6/images/rta_nophoto.webp");
                                }
                            }else if(key == 'description' && attributes[key].toString().indexOf('##')>-1){

                            }else{
                                this.item_content = this.item_content.replace(new RegExp('##'+key+'##','g'),"##"+attributes[key].replace(/[\r\n]+/g," ")+"##");
                            }
                        }
                        this.item_content = this.item_content.replace('"','\"');
                    }
                }
            },
            handleWebPage(attributes){
                let lang = vm.lang;
                let webpage = JSON.parse(JSON.stringify(attributes)).content
                if(lang==='vi'){
                    webpage = webpage.replace(/<en>.*<\/en>/,'')
                }else{
                    webpage = webpage.replace(/<vi>.*<\/vi>/,'')
                }
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
                this.listJS = true;
                this.item_content = webpage + functionApp
            }
        },
        watch: {
            statusButton: function(statusButton){
                if(statusButton == false){
                    $("."+this.classRandom).css({'display': 'none'  });
                }
                else if(statusButton == true){
                    $("."+this.classRandom).css({'display': 'inline-block'  });
                }
            },
        }
    });