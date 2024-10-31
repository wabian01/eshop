Vue.component('action-button', {
    template: '#action-button',
    props: ['list_item','item_button','task','floating_button','appearance','body_area','button_description','overflow_menu','id_random','end','indexsearch','position','tracking_id'],
    data: function () {
        return {
            button_content: '',
            button_icon:'',
            activeClass: '',
            styleButton: "",
            isBigIcon:'',
            idcss:'',
            disabled:'',
            hasBorder:'',
            statushasBorder: false,
            styleAll:'',
            styleIcon:'',
            stylefontasome:'padding:2px;',
            styleIconDisable:'',
            hasBadgeIcon:"",
            status_tracking:false,
            randomID: 'AB-'+Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10),
            tracking:'',
        }
    },
    watch:{
        tracking_id(tracking_id){
            if(tracking_id === this.item_button.tracking_id && tracking_id!==''){
                setTimeout(() => {
                    vm.tracking_id_button = ''
                }, 1000);
                if(this.item_button.hasOwnProperty('override_ui_behavior')){
                    if(this.item_button.override_ui_behavior.behavior === 'hide'){
                        $('#'+this.randomID).hide()
                        if(this.item_button.override_ui_behavior.hasOwnProperty('timeout')){
                            vm.time_tracking_id[tracking_id] = {
                                "time": (new Date()).getTime()
                            }
                            let time = this.item_button.override_ui_behavior.timeout * 1000
                            setTimeout(() => {
                                $('#'+this.randomID).show()
                            }, time);
                        }
                    }else if(this.item_button.override_ui_behavior.behavior === 'disable'){
                        this.status_tracking = true
                        this.disabled = 'disabled'
                        let $button = $('#'+this.randomID +' button')
                        var $imgTag = $button.find('img');
                        var $iTag = $button.find('i');
                        let $pTag = $('#'+this.randomID).find('p');
                        
                        if ($imgTag.length > 0) {
                            $imgTag.css('filter', 'contrast(0)');
                        }

                        if ($iTag.length > 0) {
                            $iTag.css('color', '#808080d1 !important');
                        }
                        if ($pTag.length > 0) {
                            $pTag.css('color', '#808080d1 !important');
                        }
                        if(this.item_button.override_ui_behavior.hasOwnProperty('timeout')){
                            let time = this.item_button.override_ui_behavior.timeout * 1000
                            vm.time_tracking_id[tracking_id] = {
                                "time": (new Date()).getTime()
                            }
                            setTimeout(() => {
                                this.status_tracking = false
                                this.disabled = ""
                                if ($imgTag.length > 0) {
                                    $imgTag.css('filter', '');
                                }
                                if ($iTag.length > 0) {
                                    $iTag.css('color', 'black');
                                }
                                if ($pTag.length > 0) {
                                    $pTag.css('color', '');
                                }
                            }, time);
                        }
                    }
                }
            }
        }
    },
    created: function () {  
        if(this.body_area != undefined && this.body_area.hasOwnProperty('button_description') && this.body_area.button_description != undefined && this.body_area.button_description.type == "bigIcon" && this.body_area.button_description.hasOwnProperty('has_border') && this.body_area.button_description.has_border){
            this.statushasBorder = true;
            if (this.body_area.button_description.has_border === "true" || 
                this.body_area.button_description.has_border === true
            ) {
                this.hasBorder = 'border-radius: 12px !important; margin: auto; text-align: center; padding: 5px !important; margin:5px; box-shadow: rgb(0 0 0 / 24%) 0px 1.5px 8px; background: #fff !important;'
            } else {
                this.hasBorder = 'margin: auto; text-align: center; padding: 5px !important; margin:5px; background: #fff !important;'
            }   
        } 
        if(this.task.code===9999){
            this.idcss ='.autofit_subdetail'
        }else{
            this.idcss = '#task-modal-'+this.task.code;
        }
        if(this.item_button == undefined) return;  
        if(vm.flatRuntimeAttributes.appLanguage == 'vi' && this.item_button.hasOwnProperty('label')){
            this.item_button.label = this.item_button.label.replace(/<en>.*<\/en>/g,"")
        }
        else if(vm.flatRuntimeAttributes.appLanguage == 'en' && this.item_button.hasOwnProperty('label')){
            this.item_button.label = this.item_button.label.replace(/<vi>.*<\/vi>/g,"")
        }

        if(this.body_area != undefined && this.body_area.type == 'buttonGroup'){    
            this.activeClass = this.body_area.type;
        }
        
        this.renderItem()

        if (this.item_button.hasOwnProperty("badge_icon") && this.item_button.badge_icon !== "") {
            this.hasBadgeIcon = "padding: 1em;"
        }

    },
    mounted: function(){
        let numCol = 1;
        var button_description = [];

        if(this.body_area != undefined && this.body_area.hasOwnProperty('button_description')){
            button_description = this.body_area.button_description
        }
        else if(this.button_description != undefined && Object.keys(this.button_description).length > 0){
            button_description = this.button_description;
        }
        if(this.end&&this.indexsearch){
            if(this.$parent.$options.name === 'button-group' && document.querySelector('#'+this.id_random) == null){
                this.$parent.$parent.re_render_button_group = false
            }
            $(this.idcss+' .bigIcon button').not(':has("i")').css({'padding':'25px 25px'})
            $(this.idcss+' .bigIcon button').has('img').css({'padding':'9px 9px'})
            $(this.idcss+' .bigIcon button img').css({'width':'2rem'})
            $(this.idcss+' .bigIcon').css({'text-align':'center'})
            $(this.idcss+' .bigIcon p').css({'text-align':'center'})
            $(this.idcss+' .action-button:not(.buttonGroup) button:not(.btn-circle)').css({'padding': '6px 12px 4px','margin-bottom':'0px','width':'fit-content'})
            if($('#'+this.id_random+' .scrollAB span.action-button.buttonGroup').length > 1){
                if (this.body_area.orientation !== "horizontal") {
                    $('#'+this.id_random+' .scrollAB span.action-button.buttonGroup').css({width:'fit-content'})
                }    
            }
        }
        if(this.body_area != undefined && this.body_area.hasOwnProperty('numCol') && this.body_area.numCol > 0 ){
            numCol = this.body_area.numCol;
        }
        if(this.body_area != undefined && this.body_area.hasOwnProperty('numCol') && this.body_area.numCol.toString().indexOf('|')>-1){
            if(screen.width<481){
                numCol = this.body_area.numCol.split('|')[0]
            }else{
                numCol = this.body_area.numCol.split('|')[1]
            }
        }

        if(button_description.hasOwnProperty('show_text') && button_description.show_text == false ){
        }
        if(this.id_random && !this.statushasBorder){
            if(button_description.type == "custom" && !this.item_button.hasOwnProperty("badge_icon")){
                $('#'+this.id_random+' .'+this.activeClass).css({'padding': '0.6rem 0rem 0rem 0.3rem', 'display': 'flex'})
            } else if (this.item_button.hasOwnProperty("badge_icon") && this.item_button.badge_icon !== "") {
                $('#'+this.id_random+' .'+this.activeClass).css({'padding': '0.6rem 0.6rem 0rem 0.3rem'})
            }else{
                $('#'+this.id_random+' .'+this.activeClass).css({'padding': '0.6rem 0.3rem 0rem 0.3rem'})
            }
        }
        var columnGrid = '';
        var test = 100/numCol
        for (let i = 0; i < numCol; i++) {
            columnGrid += test+'%'
        }
        $('#'+this.id_random).css({'grid-template-columns':columnGrid, 'grid-auto-rows': 'minmax(min-content, 1fr)'})
        if(numCol == 1 && this.activeClass != ""){
            if((this.body_area.hasOwnProperty('button_description') && this.body_area.button_description.type == 'bigIcon') || (this.button_description != undefined && this.button_description.type == 'bigIcon')){
            }
            else{
                if (button_description.hasOwnProperty('width') && button_description.width !== "") {
                    $('#'+this.id_random+' .'+this.activeClass+' button').css({width:button_description.width+'px'})
                } else {
                    $('#'+this.id_random+' .'+this.activeClass+' button').css({width:'100%'})
                }    
            }
            
        }
        else if(numCol >1 && this.activeClass != ""){
            if((this.body_area.hasOwnProperty('button_description') && this.body_area.button_description.type == 'bigIcon') || (this.button_description != undefined && this.button_description.type == 'bigIcon')){
                 $('#'+this.id_random).css({'justify-content':'space-around'})
            }
            else{
                if (button_description.hasOwnProperty('width') && button_description.width !== "") {
                    $('#'+this.id_random+' .'+this.activeClass+' button').css({width:button_description.width+'px'})
                } else {
                    $('#'+this.id_random+' .'+this.activeClass+' button').css({width:'100%'})
                }
            }
        }
    },
    methods: {
        initializeButtonDescription(){
            let button_description = []
            if(this.body_area?.button_description){
                button_description = structuredClone(this.body_area.button_description)
            }else if(this.button_description && Object.keys(this.button_description).length > 0){
                button_description = structuredClone(this.button_description);
            }
            return button_description
        },
        addStyleButton(button_description){
            if (Object.keys(button_description).length > 0) {
                for (const key in button_description) {
                    switch (key) {
                        case 'type':
                            this.handleButtonType(button_description[key],button_description);
                            break;
                        case 'bold':
                            if (button_description.bold) {
                                this.styleAll += 'font-weight: bold;';
                            }
                            break;
                        case 'upper_case':
                            if (button_description.upper_case) {
                                this.styleAll += 'text-transform: uppercase;';
                            }
                            break; 
                        case 'icon_size':
                            this.handleIconSize(button_description.icon_size , "icon_size");
                            break;                              
                        default:
                            break;
                    }
                }
            }
        },
        handleButtonType(type,button_description) {
            // https://rtgit.rta.vn/rtlab/tech-document/-/blob/main/datamodel/AB-in-DMView.md
            const hasBadgeIcon = this.item_button.hasOwnProperty("badge_icon") && this.item_button.badge_icon !== "";
            const baseStyles = hasBadgeIcon ? 
                'position: relative;' : '';
        
            switch (type) {
                case 'outline':
                    this.styleButton += `background-color: #fff; border: 1px solid #bec1c7; color: orange; border-radius: 5px !important; ${baseStyles}`;
                    break;
                case 'icon':
                case 'text':
                    this.styleButton += `border: 0px; background-color: transparent; color: #FFCC00; ${baseStyles}`;
                    break;
                case 'contain':
                    this.styleButton += `background-color: #FFCC00; color: white; border-radius: 5px !important; border-color: transparent !important; ${baseStyles}`;
                    break;
                case 'bigIcon':
                    this.isBigIcon += 'bigIcon';
                    this.styleButton += `border-radius: 50% !important; padding: 12px 16px !important; font-size: 18px !important; margin: 0px !important; ${baseStyles}`;
                    break;
                case 'custom':
                    this.handleCustomButton(button_description);
                    break;
                default:
                    break;
            }
        },
        handleCustomButton(description) {
            const textColor = `color:${description.text_color || "orange"};`;
            const strokeColor = `border: 1px solid ${description.stroke_color || "#bec1c7"};`;
            const fillColor = `background-color:${description.fill_color || "#fff"};`;
            let shadowEnable = "";

            if (description.shadow_enable) {
                if (description.shadow_enable === true || description.shadow_enable === "true") {
                    shadowEnable = "box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px !important;";
                }
            }

            this.styleButton += `border-radius: 5px !important; ${textColor} ${strokeColor} ${fillColor} ${shadowEnable}`;
        
            this.handleIconSize(description.icon_size , "custom");
        },
        handleIconSize(size , type) {
            let iconSize = "1rem";
            let fontSize = ""
            
            if (size === "large") {
                iconSize = "2rem";
                fontSize = "25px"
            } else if (size === "medium") {
                iconSize = "1.5rem";
                fontSize = "20px"
            }

            if(type === "custom"){
                this.styleIcon += `width:${iconSize}; font-size:${fontSize};`;
            }
            if(type === "icon_size"){
                if (size === "large" || size === "medium") {
                    this.styleAll += `line-height: ${size === "large" ? "2.5" : "2"};`;
                    this.stylefontasome =''
                    this.stylefontasome += 'padding:4px;';
                }
            }
        },
        visibleButton(){
            if(this.item_button.hasOwnProperty("visible")) {
                if(this.item_button.visible != 'true' && this.item_button.visible !== ""){   
                    if(this.item_button.visible != 'false' && Boolean(this.item_button.visible) !== false){
                        this.item_button.visible = String(this.item_button.visible);
                        this.item_button.visible = this.item_button.visible.trim();
                        if(!handleDMFunction(this.item_button.visible.replaceAll('\\"',"\"")) || handleDMFunction(this.item_button.visible.replaceAll('\\"',"\""))=='error'){
                            this.handleButtonAction();                        
                            return true;
                        }
                    }else if(this.item_button.visible == 'false' || !this.item_button.visible){
                        this.handleButtonAction();
                        return true;
                    }
                }
            }
            return false
        },
        handleButtonAction() {
            try {
                if (this.overflow_menu !== undefined) {
                    this.$parent.checkOverflow(false);
                }
                this.$parent.handleShowButton(false);
            } catch (error) {}
        },
        getDisabled(){
            let disabled = ""
            if(this.item_button.hasOwnProperty("enable") && this.item_button.enable!=null) {
                this.item_button.enable = String(this.item_button.enable);
                this.item_button.enable = this.item_button.enable.trim();
                if(this.item_button.enable == 'true' || this.item_button.enable == 'false'){
                    disabled = this.item_button.enable;
                }
                else if(!handleDMFunction(this.item_button.enable)){
                    disabled = "disabled"
                }
            }
            if(disabled === 'false'){
                disabled = "disabled";
            }
            return disabled
        },
        handleVisibility(badge_icon) {
            return badge_icon.visible === true || badge_icon.visible === 'true' ? 'flex' : 'none';
        },
        
        handleContent(badge_icon) {
            let content = badge_icon.content;
            if (content === "") {
                return "";
            }
        
            let lang = vm.lang;
            let langPattern = lang === 'vi' ? /<vi>(.*)<\/vi>/ : /<en>(.*)<\/en>/;
            return content.replace(langPattern, function(match, key) {
                return key;
            });
        },
        
        handleColor(value, defaultColor) {
            return value === "" ? defaultColor : value;
        },
        
        handleBorder(badge_icon) {
            return badge_icon.border_color !== "" ? `1px solid ${badge_icon.border_color}` : 'none';
        },
        
        handleShadow(badge_icon) {
            if (badge_icon.shadow_enable !== false && badge_icon.shadow_enable !== 'false' && (!badge_icon.hasOwnProperty('shadow_enable'))) {
                let color;

                if (badge_icon.border_color !== "") {
                    color = badge_icon.border_color;
                } else if (badge_icon.background_color !== "") {
                    color = badge_icon.background_color;
                } else {
                    color = 'grey';
                }
                return `0px 5px 8px ${color}`;
            }

            return "";
        },
        
        handleBadgeIcon() {
            let { badge_icon } = this.item_button;
            if (!badge_icon || badge_icon === "") {
                return {};
            }
        
            let showBIcon = this.handleVisibility(badge_icon);
            let contentBIcon = this.handleContent(badge_icon);
            let bgBIcon = this.handleColor(badge_icon.background_color, "#FF0000");
            let txtBIcon = this.handleColor(badge_icon.text_color, "#FFFFFF");
            let borderColorBIcon = this.handleBorder(badge_icon);
            let shadowBIcon = this.handleShadow(badge_icon);
        
            return { showBIcon, contentBIcon, bgBIcon, txtBIcon, borderColorBIcon, shadowBIcon };
        },
        renderItem:function () {
            let button_description = this.initializeButtonDescription()

            this.addStyleButton(button_description)

            // Default Button
            if (this.item_button.hasOwnProperty("badge_icon") && this.item_button.badge_icon !== "") {
                this.styleAll += 'position: relative; text-align:'+((button_description.hasOwnProperty('text_gravity') && button_description.text_gravity!=="") ? button_description.text_gravity : "start")+';'
            } else {
                this.styleAll += 'text-align:'+((button_description.hasOwnProperty('text_gravity') && button_description.text_gravity!=="") ? button_description.text_gravity : "start")+';'
            }
            
            if(this.visibleButton()){
                return
            }

            if(this.item_button.type == 'act_call_cloudphone' && this.item_button.phone.length == 0 ){
                return true;
            }
            if(this.$parent.$vnode.componentOptions.Ctor.options.name === 'taskmodal'){
                this.$parent.countSumAB(this.item_button)
            }

            let disabled = this.getDisabled()

            this.disabled = disabled;

            if(this.disabled == "disabled"){
                this.styleIconDisable = 'filter: contrast(0);'
                this.styleAll += 'color: #808080d1 !important;'
            }

            if(vm.time_tracking_id.hasOwnProperty(this.item_button.tracking_id)){
                this.handleTracking(this.item_button.tracking_id)
            }
            
            let {showBIcon, contentBIcon, bgBIcon, txtBIcon, borderColorBIcon, shadowBIcon} = this.handleBadgeIcon();

            if( button_description.hasOwnProperty("show_text") && typeof(button_description.show_text) == 'string' ) {
                button_description.show_text = Boolean(button_description.show_text)
            }

            let font_icon = ''
            switch(this.item_button.type) {
                case "act_call":
                case "act_sms":
                    return true
                case "act_share":
                case "act_dm_view":
                case "act_open_module":
                case "act_exit":
                case "act_open_html_screen":
                    font_icon = 'fa fa-bar-chart'
                    break
                case "act_call_cloudphone":
                    if (typeof makeCall === "function" && this.item_button['phone'] !== "undefined") {
                        let phoneNumber = this.item_button['phone'].replace(/##/g, "");
                        if(!this.item_button.label){
                            this.item_button.label = phoneNumber
                        }
                        font_icon = 'fa fa-phone'
                    }
                    break

                case "act_call_api":
                    font_icon = 'fa fa-cloud-download'
                    break

                case "act_fill_form":
                case "act_get_instance":
                    font_icon = 'fa fa-calendar-plus-o'
                    break

                case "act_gps":
                    font_icon = 'fa fa-map-marker'
                    break

                case "act_check":
                    return true;
                    // this.button_content = '<label class="mt-checkbox mt-checkbox-outline"><input  '+disabled+' type="checkbox">'+(button_description.hasOwnProperty('show_text') ? button_description.show_text == true ? this.item_button['label']: '' :this.item_button['label'])+' <span></span></label>';
                    break

                case "act_report":
                    font_icon = 'flaticon-diagram'
                    break

                case "act_jholder_add": 
                case "act_jholder_remove": 
                    font_icon = 'none'
                    break

                case "act_open_chat":
                    font_icon = 'fa fa-comment'
                    break

                default:
                    return
            }
            if(!this.item_button.label){
                this.item_button.label = this.item_button.name || this.item_button.title || ""
            }

            this.renderButtonContent(font_icon, disabled, showBIcon, contentBIcon, bgBIcon, txtBIcon, borderColorBIcon, shadowBIcon)
            
            this.renderFloatButton()
        },
        renderButtonContent(font_icon, disabled, showBIcon, contentBIcon, bgBIcon, txtBIcon, borderColorBIcon, shadowBIcon){
            let icon = "";
            let iconfont = "";
            let iconSetUrl = "";
            let iconSetStyle = "";
            let iconSetFallBack = "";
            if (this.item_button?.imageUrl?.includes('rta://icon')) {
                ({ iconSetUrl, iconSetStyle, iconSetFallBack } = vm.handleIconSetAB(this.item_button.imageUrl));
            }
           
            if(this.styleButton != ""){
                if(this.isBigIcon != ""){  
                    if(button_description.hasOwnProperty('icon_color_background') && button_description.icon_color_background != ""){
                        this.styleButton = 'style=\''+this.styleButton+" background-color:"+button_description.icon_color_background+" !important;'"
                        icon += '<i class="isShowIcon '+font_icon+'" aria-hidden="true" style="'+this.styleIconDisable+'color:black"></i> ';
                    }
                    else{
                        this.styleButton = 'style=\''+this.styleButton+this.styleAll+"'";
                        icon += '<i class="isShowIcon '+font_icon+'" aria-hidden="true" style="'+this.styleIconDisable+'color:#00c5dc"></i> ';
                    }
                    if(font_icon==='none'){
                        icon = ''
                    }
                    if(this.item_button.hasOwnProperty('imageUrl')){
                        iconfont = icon.replace('isShowIcon', 'isShowIcon d-none');
                        icon = '<img src="'+this.item_button.imageUrl+'" onerror="this.onerror=null;$(this).addClass(\'d-none\');$(this).next().removeClass(\'d-none\');" style="'+this.styleIconDisable+'width:1rem;"></i> '+iconfont;
                        if(iconSetUrl!==""){
                            icon = `<img ${iconSetFallBack} src="${iconSetUrl}" style="${iconSetStyle};${this.styleIconDisable}width:1rem;"></i>`;
                        }
                    }
                    this.button_content = '<button '+disabled+' type="button" class="btn"'+this.styleButton+'>'+(button_description.hasOwnProperty('show_icon') ? ((button_description.show_icon == true || button_description.show_icon == 'true') == true ? icon: '') :icon)+'</button><p style="'+this.styleAll+'overflow: hidden;text-overflow: ellipsis;margin: 6px;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp:'+((button_description.hasOwnProperty('max_text_line') && button_description.max_text_line!=null)?button_description.max_text_line:1)+';">'+(button_description.hasOwnProperty('show_text') ? button_description.show_text == true ? this.item_button['label']: '' :this.item_button['label'])+'</p>';
                }
                else if(button_description.hasOwnProperty('type') && button_description.type === 'custom'){
                    if (this.item_button.hasOwnProperty("badge_icon") && this.item_button.badge_icon !== "") {
                        this.styleButton = 'style=\''+this.styleButton+this.styleAll+"display:flex; position:relative;'";
                    } else {
                        this.styleButton = 'style=\''+this.styleButton+this.styleAll+"display:flex;'";
                    }
                    icon += '<i class="isShowIcon '+font_icon+'" aria-hidden="true" style="'+this.styleIconDisable+this.styleIcon+this.stylefontasome+'color:#00c5dc; margin:auto;"></i> '
                    if(font_icon==='none'){
                        icon = ''
                    }
                    if(this.item_button.hasOwnProperty('imageUrl')){

                        let icon_size_more  = 'height:'+((button_description.hasOwnProperty('icon_size') && button_description.icon_size !== "") ? (button_description.icon_size == "large" ? "25px;" : (button_description.icon_size == "medium" ? "24px" : "")) : "")+';'
                            icon_size_more += 'min-width:'+((button_description.hasOwnProperty('icon_size') && button_description.icon_size !== "") ? (button_description.icon_size == "large" ? "25px;" : (button_description.icon_size == "medium" ? "24px" : "")) : "")+';'
                            this.styleIcon += icon_size_more
                        
                        iconfont = icon.replace('isShowIcon', 'isShowIcon d-none');
                        icon = '<img src="'+this.item_button.imageUrl+'" onerror="this.onerror=null;$(this).addClass(\'d-none\');$(this).next().removeClass(\'d-none\');" style="'+this.styleIconDisable+this.styleIcon+'margin-bottom:3px;"></i> '+iconfont;
                        if(iconSetUrl!==""){
                            icon = `<img ${iconSetFallBack} src="${iconSetUrl}" style="${iconSetStyle};${this.styleIconDisable}${this.styleIcon}margin-bottom:3px;"></i>`;
                        }
                    }
                    if(button_description.hasOwnProperty('icon_alignment')){
                        switch (button_description.icon_alignment) {
                            case 'end':
                                this.button_content = '<button '+disabled+' type="button" class="btn default"'+this.styleButton+'><span style="'+this.styleAll+'width:100%;overflow: hidden;text-overflow: ellipsis;padding:0 5px;display: -webkit-box;-webkit-box-orient: vertical;white-space: break-spaces;word-wrap: break-word;margin: auto;-webkit-line-clamp:'+((button_description.hasOwnProperty('max_text_line') && button_description.max_text_line!=null)?button_description.max_text_line:(1+";white-space: unset !important"))+';">'+(button_description.hasOwnProperty('show_text') ? button_description.show_text == true ? this.item_button['label']: '' :this.item_button['label'])+' </span>'+(button_description.hasOwnProperty('show_icon') ? ((button_description.show_icon == true || button_description.show_icon == 'true') == true ? icon: '') :icon)+'</button>';
                                break;
                            case 'top':
                                this.styleButton = this.styleButton.replace('text-align:start;','').replace('display:flex;','')
                                this.button_content = '<button '+disabled+' type="button" class="btn default"'+this.styleButton+'>'+(button_description.hasOwnProperty('show_icon') ? ((button_description.show_icon == true || button_description.show_icon == 'true') == true ? icon: '') :icon)+'<span style="'+this.styleAll+'width:100%;overflow: hidden;text-overflow: ellipsis;padding:0 5px;display:block;"> '+(button_description.hasOwnProperty('show_text') ? button_description.show_text == true ? this.item_button['label']: '' :this.item_button['label'])+' </span></button>';
                                break;
                            case 'bottom':
                                this.styleButton = this.styleButton.replace('text-align:start;','').replace('display:flex;','')
                                this.button_content = '<button '+disabled+' type="button" class="btn default"'+this.styleButton+'><span style="'+this.styleAll+'width:100%;overflow: hidden;text-overflow: ellipsis;padding:0 5px;display:block;"> '+(button_description.hasOwnProperty('show_text') ? button_description.show_text == true ? this.item_button['label']: '' :this.item_button['label'])+' </span>'+(button_description.hasOwnProperty('show_icon') ? ((button_description.show_icon == true || button_description.show_icon == 'true') == true ? icon: '') :icon)+'</button>';
                                break;
                        
                            default:
                                this.button_content = '<button '+disabled+' type="button" class="btn default"'+this.styleButton+'>'+(button_description.hasOwnProperty('show_icon') ? ((button_description.show_icon == true || button_description.show_icon == 'true') == true ? icon: '') :icon)+'<span style="'+this.styleAll+'width:100%;overflow: hidden;text-overflow: ellipsis;padding:0 5px;display: -webkit-box;-webkit-box-orient: vertical;white-space: break-spaces;word-wrap: break-word;margin: auto;-webkit-line-clamp:'+((button_description.hasOwnProperty('max_text_line') && button_description.max_text_line!=null)?button_description.max_text_line:(1+";white-space: unset !important"))+';">'+(button_description.hasOwnProperty('show_text') ? button_description.show_text == true ? this.item_button['label']: '' :this.item_button['label'])+' </span></button>';
                                break;
                        }
                    }else{
                        if (this.item_button.hasOwnProperty("badge_icon") && this.item_button.badge_icon !== "") {
                            this.button_content = '<button '+disabled+' type="button" class="btn default"'+this.styleButton+'>'+(button_description.hasOwnProperty('show_icon') ? ((button_description.show_icon == true || button_description.show_icon == 'true') == true ? icon: '') :icon)+'<span style="'+this.styleAll+'width:100%;overflow: hidden;text-overflow: ellipsis;padding:0 5px;display: -webkit-box;-webkit-box-orient: vertical;white-space: break-spaces;word-wrap: break-word;margin: auto;-webkit-line-clamp:'+((button_description.hasOwnProperty('max_text_line') && button_description.max_text_line!=null)?button_description.max_text_line:(1+";white-space: unset !important"))+';">'+(button_description.hasOwnProperty('show_text') ? button_description.show_text == true ? this.item_button['label']: '' :this.item_button['label'])+' </span><span style="background:'+bgBIcon+'; box-shadow:'+shadowBIcon+'; color:'+txtBIcon+'; display:'+showBIcon+'; border:'+borderColorBIcon+'; width:fit-content; height:fit-content; position:absolute; top:-10px; right:-10px; justify-content:center; align-items:center; text-transform: none; padding: 3px 7px !important" class="badge">'+contentBIcon+'</span></button>';
                        } else {
                            this.button_content = '<button '+disabled+' type="button" class="btn default"'+this.styleButton+'>'+(button_description.hasOwnProperty('show_icon') ? ((button_description.show_icon == true || button_description.show_icon == 'true') == true ? icon: '') :icon)+'<span style="'+this.styleAll+'width:100%;overflow: hidden;text-overflow: ellipsis;padding:0 5px;display: -webkit-box;-webkit-box-orient: vertical;white-space: break-spaces;word-wrap: break-word;margin: auto;-webkit-line-clamp:'+((button_description.hasOwnProperty('max_text_line') && button_description.max_text_line!=null)?button_description.max_text_line:(1+";white-space: unset !important"))+';">'+(button_description.hasOwnProperty('show_text') ? button_description.show_text == true ? this.item_button['label']: '' :this.item_button['label'])+' </span></button>';
                        }
                    }
                }
                else{
                    this.styleButton = 'style=\''+this.styleButton+this.styleAll+"display:flex;'";
                    icon += '<i class="isShowIcon '+font_icon+'" aria-hidden="true" style="'+this.styleIconDisable+this.stylefontasome+'color:#00c5dc"></i> '
                    if(font_icon==='none'){
                        icon = ''
                    }
                    if(this.item_button.hasOwnProperty('imageUrl')){
                        iconfont = icon.replace('isShowIcon', 'isShowIcon d-none');
                        icon = '<img src="'+this.item_button.imageUrl+'" onerror="this.onerror=null;$(this).addClass(\'d-none\');$(this).next().removeClass(\'d-none\');" style="'+this.styleIconDisable+'height:1rem;width:1rem;margin-bottom:3px;"></i> '+iconfont;
                        if(iconSetUrl!==""){
                            icon = `<img ${iconSetFallBack} src="${iconSetUrl}" style="${iconSetStyle};${this.styleIconDisable}height:1rem;width:1rem;margin-bottom:3px;"></i>`;
                        }
                    }
                    this.button_content = '<button '+disabled+' type="button" class="btn default"'+this.styleButton+'>'+(button_description.hasOwnProperty('show_icon') ? ((button_description.show_icon == true || button_description.show_icon == 'true') == true ? icon: '') :icon)+'<span style="'+this.styleAll+'width:100%;overflow: hidden;text-overflow: ellipsis;padding:0 5px;"> '+(button_description.hasOwnProperty('show_text') ? button_description.show_text == true ? this.item_button['label']: '' :this.item_button['label'])+' </span></button>';
                }
            }
            else{
                icon='<i class="isShowIcon '+font_icon+'" aria-hidden="true" style="'+this.styleIconDisable+this.stylefontasome+'color:#00c5dc;padding:1px !important;"></i> ';
                if(font_icon==='none'){
                    icon = ''
                }
                if(this.item_button.hasOwnProperty('imageUrl')){
                    iconfont = icon.replace('isShowIcon', 'isShowIcon d-none');
                    icon = '<img src="'+this.item_button.imageUrl+'" onerror="this.onerror=null;$(this).addClass(\'d-none\');$(this).next().removeClass(\'d-none\');" style="'+this.styleIconDisable+'height:1rem;width:1rem;margin-bottom:3px;"></i> '+iconfont;
                    if(iconSetUrl!==""){
                        icon = `<img ${iconSetFallBack} src="${iconSetUrl}"  style="${iconSetStyle};${this.styleIconDisable}height:1rem;width:1rem;margin-bottom:3px;"></i>`
                    }
                }
                this.button_content = '<button '+disabled+' type="button" style="'+this.styleAll+'padding: 3px 9px !important; border-radius: 5px !important;'+''+'" class="btn default">'+icon+'<span style="'+this.styleAll+'padding:0 5px;width:100%;">'+(button_description.hasOwnProperty('show_text') ? button_description.show_text == true ? this.item_button['label']: '' :this.item_button['label'])+'</span></button>';
            }
        },
        renderFloatButton(){
            if(this.floating_button != undefined){
                let label='';
                let fontSize='15px';
                if(this.appearance.type == 'extended'){
                    label = this.item_button.label;
                }
                else if(!this.floating_button){
                    label = this.item_button.label;
                }
                if(label == undefined || label.length == 0){
                    if(this.item_button.type == 'act_call_cloudphone'){
                        label = this.item_button.phone
                    }
                    else if(this.item_button.type == 'act_report'){
                        label = this.item_button.title
                    }
                    else if (this.item_button.type == 'act_open_chat') {
                        fontSize = '25px';
                    }
                    else{
                        label = this.item_button.name
                    }
                }
                this.button_content = '<button style=" min-height: 50px; min-width:50px;padding: 4px 10px; border-radius: 15px; font-size: '+fontSize+';margin-bottom:10px; text-align: center; color: white;background-color: #ff8000;" class="dropdown-item btn-circle btn btn-sm" type="button"><i class="isShowIcon '+this.button_icon+'"></i> '+label+'</button>';
            }
        },
        handleClick:function (event) {  
            if(this.status_tracking){
                if(this.item_button.override_ui_behavior.hasOwnProperty('message')){
                    toastr.info(this.item_button.override_ui_behavior.message)
                    return;
                }
            }
            if(this.disabled == 'disabled') return; 
            switch(this.item_button.type) {
                case "act_share":
                    this.handleActionShare()
                    break
                case "act_fill_form":
                    $(event.target).closest(".webapp-popup").find('.minimize-button button').click()
                    this.openFillForm()
                    break

                case "act_call_cloudphone":
                    this.callCloudPhone()
                    break

                case "act_dm_view":
                    this.openDataModalViews()
                    break

                case "act_report":
                    $(event.target).closest(".webapp-popup").find('.minimize-button button').click()
                    this.openReportView()
                    break

                case "act_gps":
                    $(event.target).closest(".webapp-popup").find('.minimize-button button').click()
                    this.openMapView()
                    break

                case "act_leaflet_map":
                    $(event.target).closest(".webapp-popup").find('.minimize-button button').click()
                    this.openLeafletMapView();
                    break

                case "act_check":
                    break

                case "act_get_instance":
                    this.getInstance($(event.target));
                    break

                case "act_jholder_add":
                    this.addJsonHolder($(event.target));
                    break

                case "act_jholder_remove":
                    this.removeJsonHolder($(event.target));
                    break
                
                case "act_open_module":
                    $(event.target).closest(".webapp-popup").find('.minimize-button button').click()
                    this.openModule($(event.target));
                    break
                
                case "act_exit":
                    if(vm.listSreenTheme[vm.activeTaskCode]?.length>0){
                        this.closeScreenTheme(vm.activeTaskCode)
                    }else{
                        if(vm.activeTaskCode!==''){
                            vm.closeTask(vm.tasks[vm.activeTaskCode])
                        }
                    }
                break

                case "act_open_html_screen":
                    $(event.target).closest(".webapp-popup").find('.minimize-button button').click()
                    this.openHtmlViewScreenTheme();
                    break

                case "act_open_chat":
                    $(event.target).closest(".webapp-popup").find('.minimize-button button').click()
                    this.handleActionOpenChat();
                    break

                default:
                    alert("This feature is under construction. We're comming soon.")
                    break
            }
        },
        handleActionShare(item_button){
            if(!this.item_button){
                this.item_button = item_button
            }
            let text = this.item_button.body;
            let dummyInput = document.createElement('input');
            document.body.appendChild(dummyInput);
            dummyInput.value = text;
            dummyInput.select();
            document.execCommand('copy');
            document.body.removeChild(dummyInput);
            toastr.success('Copied to clipboard')
        },
        addJsonHolder(item_button) {

            this.initializeItemButton(item_button);

            let json = this.getCurrentJsonHolder();

            if(!json){
                json = {}
            }

            switch (this.item_button.duplicate_solution) {
                case 'duplicate':
                    this.handleDuplicateSolution(json);
                    break;
                case 'overwrite':
                    this.handleOverwriteSolution(json);
                    break;
                case 'increase_multiplier':
                    this.handleIncreaseMultiplierSolution(json);
                    break;
            }

            this.saveUpdatedJsonHolder();
        },

        initializeItemButton(item_button) {
            if (!this.item_button) {
                this.item_button = item_button;
            }
            if (!this.item_button.hasOwnProperty('json')) {
                this.item_button.json = this.list_item;
            }
            if (typeof this.item_button.json === 'string') {
                this.item_button.json = JSON.parse(this.item_button.json);
            }
            this.item_button.json.__multiplier__ = 1;
        },

        getCurrentJsonHolder() {
            return Object.keys(vm.jsonHolder).length > 0 ? JSON.parse(vm.jsonHolder) : {};
        },

        handleDuplicateSolution(json) {
            const jholderCode = this.item_button.jholder_code;
            if (!json.hasOwnProperty(jholderCode)) {
                json[jholderCode] = [];
            }
            this.item_button.json.__json_id__ = json[jholderCode].length === 0 ? 0 : json[jholderCode][json[jholderCode].length - 1].__json_id__ + 1;
            json[jholderCode] = json[jholderCode].concat(this.item_button.json);
            vm.jsonHolder = JSON.stringify(json);
        },

        handleOverwriteSolution(json) {
            const jholderCode = this.item_button.jholder_code;
            if (!json.hasOwnProperty(jholderCode)) {
                json[jholderCode] = [];
            }
            if (json[jholderCode].length > 0) {
                this.overwriteExistingData(json[jholderCode], this.item_button.json);
            } else {
                this.item_button.json.__json_id__ = 0;
                json[jholderCode] = [this.item_button.json];
            }
            vm.jsonHolder = JSON.stringify(json);
        },

        overwriteExistingData(existingData, newData) {
            existingData.forEach(item => {
                Object.keys(newData).forEach(prop => {
                    if (item.hasOwnProperty(prop) && prop !== "__json_id__") {
                        item[prop] = newData[prop];
                    }
                });
            });
        },

        initializeJholderEntry(json, jholderCode) {
            if (!json.hasOwnProperty(jholderCode)) {
                json[jholderCode] = [this.item_button.json];
                if (this.item_button.json) {
                    this.item_button.json.__json_id__ = 0;
                }
                return true;
            }
            return false;
        },

        updateMultiplier(json, jholderCode) {
            let multiplierIncreased = false;
            if (Array.isArray(json[jholderCode])) {
                json[jholderCode].forEach(value => {
                    if (this.isMatchingEntry(value)) {
                        value.__multiplier__ = (value.__multiplier__ || 0) + 1;
                        multiplierIncreased = true;
                    }
                });
            }
            return multiplierIncreased;
        },

        isMatchingEntry(value) {
            return value && this.item_button.json_id_key && 
                this.item_button.json && 
                value[this.item_button.json_id_key] === this.item_button.json[this.item_button.json_id_key];
        },

        addNewJsonEntry(json, jholderCode) {
            if (this.item_button.json) {
                this.item_button.json.__json_id__ = json[jholderCode].length === 0 ? 0 : 
                    (json[jholderCode][json[jholderCode].length - 1].__json_id__ || 0) + 1;
                json[jholderCode].push(this.item_button.json);
            }
        },

        handleIncreaseMultiplierSolution(json) {
            const jholderCode = this.item_button.jholder_code;

            if (this.initializeJholderEntry(json, jholderCode)) {
                vm.jsonHolder = JSON.stringify(json);
                this.saveJsonHolderToCache("jsonHolder", vm.jsonHolder);
                return;
            }

            const multiplierIncreased = this.updateMultiplier(json, jholderCode);

            if (!multiplierIncreased) {
                this.addNewJsonEntry(json, jholderCode);
            }

            vm.jsonHolder = JSON.stringify(json);
        },

        saveUpdatedJsonHolder() {
            this.saveJsonHolderToCache("jsonHolder", vm.jsonHolder);
        },
        findIndex(array, id) {
            return array.map(item => item.__json_id__).indexOf(id);
        },
        removeJsonHolder(item_button){
            if(!this.item_button){
                this.item_button = item_button
            }
            let json = JSON.parse(vm.jsonHolder)
            if(this.item_button.remove_mode == 'all'){
                json[this.item_button.jholder_code] = []
                vm.jsonHolder = JSON.stringify(json)
            }else if(this.item_button.remove_mode == 'remove'){
                let index = this.findIndex(json[this.item_button.jholder_code], this.list_item.__json_id__);
                json[this.item_button.jholder_code].splice(index, 1)
                vm.jsonHolder = JSON.stringify(json)
            }else if(this.item_button.remove_mode == 'reduce'){
                let index = this.findIndex(json[this.item_button.jholder_code], this.list_item.__json_id__);
                if(json[this.item_button.jholder_code][index]['__multiplier__']==1){
                    json[this.item_button.jholder_code].splice(index, 1)
                }else{
                    json[this.item_button.jholder_code][index]['__multiplier__']--
                }
                vm.jsonHolder = JSON.stringify(json)
            }
            this.saveJsonHolderToCache("jsonHolder",vm.jsonHolder)
        },
        saveJsonHolderToCache: async function(key,value){
            if ( typeof(Storage) !== 'undefined') {
                // Khởi tạo sesionStorage
                await localforage.setItem(key,value)
            } else {
                console.log('Your browser does not support localStorage');
            }
        },
        handleCurrent(){
            if(this.list_item != undefined){
                    vm.current['parent'] = {}
                    for(let key in this.list_item){
                        if(this.list_item[key] == null){
                            this.list_item[key] = ""
                        }
                        vm.current['parent']['current.parent.'+key] = this.list_item[key]
                    }
            }else{
                vm.current={};
            }
            if(this.item_button.hasOwnProperty('args')  && this.item_button.args !== '' && this.item_button.args !== null){
                if(typeof(this.item_button.args)==='string'){
                    this.item_button.args = JSON.parse(this.item_button.args)
                }
                if(vm.current.hasOwnProperty('parent')){
                    for(let key in this.item_button.args){
                        vm.current['parent']['current.args.'+key] = this.item_button.args[key]
                    }
                }else{
                    vm.current['parent'] = {};
                    for(let key in this.item_button.args){
                        vm.current['parent']['current.args.'+key] = this.item_button.args[key]
                    }
                }
            }
        },
        openModule(item_button){
            if(!this.item_button){
                this.item_button = item_button
            }
            vm.current={};
            vm.current.open_module = true

            this.handleCurrent()

            if(this.item_button.destinationType === "module"){
                if(vm.modules[this.item_button.destinationCode] == undefined){
                    toastr.error("The module "+this.item_button.destinationCode+" not found");
                    return;
                }
                vm.jumpToSubmoduleDetail(this.item_button.destinationCode,'all');
                vm.statusPopup = true;
            }else if(this.item_button.destinationType === "subModule" ){
                let modulecode
                for (moduleCode in vm.modules) {
                    let submodule = vm.getSubModules(moduleCode)
                    if(Object.keys(submodule).length === 0){
                        continue
                    }
                    
                    for (key in submodule) {
                        if(submodule[key].code === this.item_button.destinationCode){
                            modulecode = submodule[key].moduleCode
                        }
                    }
                }
                if(modulecode == undefined){
                    toastr.error("The submodule "+this.item_button.destinationCode+" not found");
                    return;
                }
                vm.jumpToSubmoduleDetail(modulecode, this.item_button.destinationCode);
                vm.statusPopup = true;
            }else if(this.item_button.destinationType === "component"){
                let modulecode
                let submodule
                for (moduleCode in vm.modules) {
                    let component = vm.getAllComponents(moduleCode)
                    if(Object.keys(component).length === 0){
                        continue
                    }
                    for (key in component) {
                        if(component[key].code === this.item_button.destinationCode){
                            modulecode = component[key].moduleCode
                            if (this.item_button.hasOwnProperty('dismissParent') && this.item_button.dismissParent === true) {
                                if(vm.listSreenTheme[vm.activeTaskCode]?.length>0){                                        
                                    this.closeScreenTheme(vm.activeTaskCode)
                                }else{
                                    if(vm.activeTaskCode!==''){
                                        vm.closeTask(vm.tasks[vm.activeTaskCode])
                                    }
                                }
                                dependView = vm.activeTaskCode; 
                                dismissPr = false;
                            } else {
                                dependView = vm.activeTaskCode; 
                                dismissPr = false;
                            }
                            let typeTheme = ['popup-center','popup-dynamic','popup-bottom']
                            let screenTheme = component[key]?.screenTheme;
                            if (!screenTheme || !typeTheme.includes(screenTheme)) {
                                vm.activeTaskCode = vm.tasks.length;
                            }
                            
                            vm.tasks.push({
                            code:vm.tasks.length,
                            layout: component[key].layout,
                            subitem: component[key].subitem,
                            comitem: 'center|start',
                            title: component[key].name,
                            html_content:"",
                            where: "",
                            post: "",
                            isDeleted:false,
                            components: component[key],
                            get:'',
                            screenCode: component[key].code,
                            object:{
                                    background:undefined,
                                    title:component[key].name,
                                    code:component[key].code,
                                    dependView: dependView,
                                    dismissPr: dismissPr,
                                    type:'datamodel',
                                    taskDepend: vm.activeTaskCode
                                },
                            openModule:true
                            });
                        }
                    }
           
                }
                if(modulecode == undefined){
                    toastr.error("The component "+this.item_button.destinationCode+" not found");
                    return;
                }
                setTimeout(function() {
                    $('#task-modal-'+vm.activeTaskCode).modal('show');
                },200);
                let currentTask = vm.tasks[vm.tasks.length - 1];
                if ( currentTask.hasOwnProperty('components') && 
                    currentTask.components.hasOwnProperty('screenTheme') && 
                    currentTask.components.screenTheme != null && 
                    currentTask.components.screenTheme != 'fullscreen' ) {
                } else {
                    vm.statusPopup = false;
                }
            }else{
                toastr.error(translations["Screen definition not found"]);
            }
        },
        opemForm(object_code,object){
            if(!vm.objects.hasOwnProperty(object_code)){
                vm.objects[object_code]=object;
            }
            object.item_button = this.item_button;
            let tracking_id = ''
            if(this.item_button.hasOwnProperty('override_ui_behavior') && this.item_button.hasOwnProperty('tracking_id')){
                tracking_id = this.item_button.tracking_id
            }
            object.tracking_id = tracking_id
            if(Object.keys(object).length !== 0){
                if(this.item_button.hasOwnProperty('clone') && (this.item_button.clone == 'TRUE' || this.item_button.clone == 'true')){
                    vm.openTask(object,this.task.layout,this.task.subitem, this.task.comitem,'clone');
                }
                else{
                    vm.openTask(object,this.task.layout,this.task.subitem, this.task.comitem,'edit');
                }
            }
        },
        createdObjectForm(object_code,screen_code,name){
            let object = {
                "type": "form",
                "taskParent": vm.activeTaskCode,
                "code": object_code,
                "moduleCode": this.task.object.moduleCode,
                "subModuleCode": this.task.object.subModuleCode,
                "componentCode": this.task.object.componentCode,
                "rawComponentCode": this.task.object.rawComponentCode,
                "title": name,
                "desc": "",
                "icon": "",
                "background": "",
                "quickAccess": 1,
                "formId": name,
                "familyId": name,
                "familyName": name,
                "version": "undefined",
                "modalTitle": name,
                "root_screen": screen_code,
                "screens": {
                    [screen_code]: {
                        "code": screen_code,
                        "title":name,
                        "top_area": [

                        ],
                        "body_area": [
                            {
                                "code": screen_code+"-formscreen",
                                "type": "htmlView",
                                "html_template": ""
                            }
                        ],
                        "bottom_area": [

                        ]
                    }
                }
            }
            return object
        },
        getInstance: function(event){
            var uuid = null;
            var filter = null;
            var that = this;
            if (this.item_button === undefined) {
                this.item_button = event
            }
            
            if(this.item_button.hasOwnProperty('uuid')){
                uuid = this.item_button.uuid;
            }
            if(this.item_button.hasOwnProperty('filter')){
                filter = JSON.stringify(this.item_button.filter)
            }
            if(uuid != null && this.item_button.isLast != 'TRUE' && this.item_button.isLast != 'true'){
                var family_name = this.item_button.familyName;
                let object_code = "undefined-undefined-"+hash('form'+this.item_button['familyName']);
                let object = {}
                
                let screen_code = object_code +"-"+hash(this.item_button['familyName']);
                if(!object.hasOwnProperty('screens')){
                    object = this.createdObjectForm(object_code,screen_code,this.item_button['familyName'])
                }
                this.opemForm(object_code,object)
            }
            else{
                var that = this;
                var datajson="";
                $.ajax({
                url:(that.item_button.isLast=="TRUE" || that.item_button.isLast=="true" || that.item_button.isLast === true)?'/api/instance/getFormInstanceLast':"/api/instance/getFormInstanceOriginal",
                type:'GET',
                dataType: 'text',
                data:filter!=null?{
                family_name:that.item_button.familyName,
                filter: JSON.stringify(that.item_button.filter),
                }:{
                    family_name:that.item_button.familyName,
                    ...(uuid ? { instance_ids: uuid } : {})
                },
                success:function(jsondata){
                    datajson = JSON.parse(jsondata);
                
                    if(Object.keys(datajson).length == 0) {
                        toastr.error(translations["No records found."])
                    }
                
                if(Object.keys(datajson).length > 1){
                    
                    var choices = {};
                    if(that.item_button.hasOwnProperty('display')){
                        for(var key in datajson){
                            var temp = that.item_button.display;
                            for(var key123 in datajson[key].data){
                                temp = temp.replace('out{'+key123+'}',datajson[key].data[key123]);
                                temp = temp.replace('"','\"');               
                            }
                            choices[key] = temp;
                        }
                        
                    }else{
                        for(let key in datajson){
                           choices[key] = key;
                        }
                    }
                   
                    $('#task-modal-'+that.task.code).css("z-index", "101");
                    (async () =>{const inputOptions = new Promise((resolve) => {
                            setTimeout(() => {
                                resolve(choices)
                            }, 1)
                            })

                            const { value: uuid } = await Swal.fire({
                            title: 'Select record',
                            input: 'radio',
                            customClass: {
                                input: 'act_get_instance'
                            },
                            inputOptions: inputOptions,
                            showCancelButton: true,
                            confirmButtonColor: '#009688',
                            cancelButtonColor: '#fd397a',
                            confirmButtonText: 'OK',
                            cancelButtonText: 'Cancel',
                            reverseButtons: true,
                            inputValidator: (value) => {
                                if (!value) {
                                return 'You need to choose record!'
                                }
                            }
                            })
                            if (uuid) {
                                var family_name = that.list_item?.familyName;
                            let object_code = "undefined-undefined-"+hash('form'+that.item_button['familyName']);


                            let screen_code = object_code +"-"+hash(that.item_button['familyName']);
                            let object = {}
                            if(!object.hasOwnProperty('screens')){
                                object = that.createdObjectForm(object_code,screen_code,that.item_button['familyName'])  
                                object.uuid = uuid    
                            
                                that.opemForm(object_code,object)
                            }
                            }
                            })()
                            
                }
                else if(Object.keys(datajson).length == 1){
                    var uuid = "";
                    for(var key in datajson){
                       uuid = key;
                    }
                    var family_name = that.list_item?.familyName;
                    let object_code = "undefined-undefined-"+hash('form'+that.item_button['familyName']);

                    
                    let screen_code = object_code +"-"+hash(that.item_button['familyName']);
                    let object = {}
                    if(!object.hasOwnProperty('screens')){
                        object = that.createdObjectForm(object_code,screen_code,that.item_button['familyName'])  
                        object.uuid = uuid
                    }
                    that.opemForm(object_code,object)
                }
                }
                })                  
            
            } 
        },
        openFillForm: function(action_button) {
            if(action_button != null){
                this.item_button = action_button;
            }
            let objectFillForm = {}
            let familyID = this.item_button['familyID']
            for (key in vm.objects) {
                if(vm.objects[key].hasOwnProperty('familyName')){
                    if (vm.objects.hasOwnProperty(key) && vm.objects[key].type === "form" && vm.objects[key].familyName == familyID) {
                        object = vm.objects[key]
                        break
                    }
                }

            }
            if(objectFillForm == {}){
                for (key in vm.objects) {
                    if (vm.objects.hasOwnProperty(key) && vm.objects[key].type === "form" && vm.objects[key].formId.indexOf(familyID) !== -1 ) {
                        objectFillForm = vm.objects[key]
                        break
                    }
                }
            }
            if(!objectFillForm.hasOwnProperty('screens')){
                let object_code = "undefined-undefined-"+hash('form'+this.item_button['familyID']);
                let form_object_code = this.task.object.code.split('-');
                form_object_code = form_object_code[form_object_code.length-1];
                let screen_code = object_code +"-"+hash(this.item_button['familyID']);

                objectFillForm = this.createdObjectForm(object_code,screen_code,this.item_button['familyID'])  
                objectFillForm.objectCode = form_object_code
                
                if(!vm.objects.hasOwnProperty(object_code)){
                    vm.objects[object_code]=objectFillForm;
                }
            };
            objectFillForm.item_button = this.item_button;
            let tracking_id = ''
            if(this.item_button.hasOwnProperty('override_ui_behavior') && this.item_button.hasOwnProperty('tracking_id')){
                tracking_id = this.item_button.tracking_id
            }
            objectFillForm.tracking_id = tracking_id
            if (this.item_button.hasOwnProperty('dismissParent') && this.item_button.dismissParent === true) {
                if(vm.listSreenTheme[vm.activeTaskCode]?.length>0){                        
                    this.closeScreenTheme(vm.activeTaskCode)
                }else{
                    if(vm.activeTaskCode!==''){
                        vm.closeTask(vm.tasks[vm.activeTaskCode])
                    }
                }
                objectFillForm.dependView = vm.activeTaskCode; 
                objectFillForm.dismissPr = false;
            } else {
                objectFillForm.dependView = vm.activeTaskCode; 
                objectFillForm.dismissPr = false;
            }
            if(Object.keys(objectFillForm).length !== 0){
                vm.openTask(objectFillForm,this.task.layout,this.task.subitem, this.task.comitem,null,null,null,null,[true,this.task]);
            }
        },
        callCloudPhone: function(action_button) {
            let customData={
                        'call_type': '##call_type##',
                        'username': vm.flatRuntimeAttributes['user.username'],
                        'module_code': this.task.object.moduleCode,
                        'sub_module_code': this.task.object.subModuleCode,
                        'component_code': this.task.object.componentCode,
                        'object_code': this.task.object.code,
                        'project_code': vm.flatRuntimeAttributes['projectCode'],
            }
            if(action_button != null){
                this.item_button = action_button;
            }
            if(this.item_button.hasOwnProperty('customData') && typeof(this.item_button.customData) == 'object'){
                Object.assign(customData,this.item_button.customData)
            }
            if (typeof makeCall === "function" && this.item_button['phone'] !== "undefined") {                  
                let phoneNumber = this.item_button['phone'].replace(new RegExp('##','g'),"")
                makeCall(phoneNumber,customData)
            }
        },
        getDataModalObject: function(objectCode) {
            for (key in vm.objects) {
                let code = vm.objects[key].code
                if(code == objectCode){
                    return vm.objects[key]
                }
            }
            return {}
        },
        openDataModalViews: function(action_button,list_item) {
            if(action_button != null){
                this.item_button = action_button;
            }
            if(list_item != null){
                this.list_item = list_item;
            }
            
            this.handleCurrent()

            let object = {}
            let objectCode = this.item_button['object']
            let object_temp=vm.objects;
            if(this.item_button.hasOwnProperty('alias') && this.item_button.alias !== '' && this.item_button.alias !== null){
                let multiOB = [];
                let aliasCode = this.item_button.alias;
                for (moduleCode in vm.modules) {
                    let nameModule = vm.modules[moduleCode].title
                    let objects = JSON.parse(JSON.stringify(vm.getAllObjects(moduleCode)))
                    if(Object.keys(objects).length === 0){
                        continue
                    }
                    for (key in objects) {
                        let code = objects[key].alias
                        if(code == aliasCode){
                            objects[key]['nameModule']=nameModule
                            objects[key]['objectwhere']=this.item_button.where
                            objects[key]['objectpost']=this.item_button.post
                            objects[key]['objectget']=this.item_button.get
                            objects[key]['objecttask']=this.task
                            objects[key]['objectscreen']=this.item_button.screen
                            multiOB.push(objects[key])
                        }
                    }
                }
                if(Object.keys(multiOB).length === 1){
                    let screenCode = this.item_button.screen
                    if (this.item_button.hasOwnProperty('dismissParent') && this.item_button.dismissParent === true) {
                        if(vm.listSreenTheme[vm.activeTaskCode]?.length>0){                   
                            this.closeScreenTheme(vm.activeTaskCode)
                        }else{
                            if(vm.activeTaskCode!==''){
                                vm.closeTask(vm.tasks[vm.activeTaskCode])
                            }
                        }
                        multiOB[0].dependView = vm.activeTaskCode; 
                        multiOB[0].dismissPr = false;
                    } else {
                        multiOB[0].dependView = vm.activeTaskCode; 
                        multiOB[0].dismissPr = false;
                    }
                    vm.openTask(multiOB[0],"tabs", "center|start","center|start",null,this.item_button.where,this.item_button.post,this.item_button.get,[true,this.task],screenCode)
                }else if(Object.keys(multiOB).length > 1){
                    vm.multiObject=multiOB;
                    $('#multiObject').modal('show')
                }else{
                    let lang = vm.lang;
                    toastr.error(lang == "en" ? "The module "+aliasCode+" not found" :"Không tìm thấy "+aliasCode);
                }
                vm.objects = object_temp;
                return;
            }
            object = this.getDataModalObject(objectCode)
            if(Object.keys(object).length === 0){
                for (moduleCode in vm.modules) {
                    let objects = vm.getAllObjects(moduleCode)
                    if(Object.keys(objects).length === 0){
                        continue
                    }
                    vm.objects = objects
                    object = this.getDataModalObject(objectCode)
                    if(Object.keys(object).length !== 0){
                        break
                    }
                }
            }
            if(Object.keys(object).length !== 0){
                let screenCode = this.item_button.screen
                if (this.item_button.hasOwnProperty('dismissParent') && this.item_button.dismissParent === true) {
                    if(vm.listSreenTheme[vm.activeTaskCode]?.length>0){                           
                        this.closeScreenTheme(vm.activeTaskCode)
                    }else{
                        if(vm.activeTaskCode!==''){
                            vm.closeTask(vm.tasks[vm.activeTaskCode])
                        }
                    }
                    object.dependView = vm.activeTaskCode; 
                    object.dismissPr = false;
                } else {
                    object.dependView = vm.activeTaskCode; 
                    object.dismissPr = false;
                }
                vm.openTask(object,"tabs", "center|start","center|start",null,this.item_button.where,this.item_button.post,this.item_button.get,[true,this.task],screenCode)
            }else{
                toastr.error(translations["Screen definition not found"]);
            }
            vm.objects = object_temp;
        },
        getReportObject: function(reportId) {
            for (key in vm.objects) {
                if (vm.objects.hasOwnProperty(key) && vm.objects[key].type === "report" && vm.objects[key].reportId === reportId ) {
                    return vm.objects[key]
                }
            }
            return {}
        },
        getStateReportId(reportId){
            let state_report = false
            $.ajax({
                url: '/cpms/cpmsServices/assignedReports?username=' + vm.flatRuntimeAttributes['user.username'],
                type:'GET',
                dataType: 'json',
                async:false,
                success:function(data){
                    if(data.offline.length>0){
                        data.offline.map(value=>{
                            if(value.reportID == reportId){
                                return state_report = true;
                            }
                        })
                    }
                    if(data.online.length>0){
                        data.online.map(value=>{
                            if(value.reportID == reportId){
                                return state_report = true;
                            }
                        })
                    }
                }
            })
            return state_report;
        },
        openReportView: function(action_button) {
            if(action_button != null){
                this.item_button = action_button;
            }
            let object = {}
            let reportId = this.item_button['reportID']
            let object_temp=vm.objects;
            object = this.getReportObject(reportId)

            if(Object.keys(object).length === 0){
                for (moduleCode in vm.modules) {
                    let objects = vm.getAllObjects(moduleCode)
                    if(Object.keys(objects).length === 0){
                        continue
                    }
                    vm.objects = objects
                    object = this.getReportObject(reportId)
                    if(Object.keys(object).length !== 0){
                        break
                    }
                }
            }
            if(Object.keys(object).length !== 0){
                vm.openTask(object)
            }else if(this.getStateReportId(reportId)){
                let that = this
                let object_code = "undefined-undefined-"+hash('report'+reportId);
                let form_object_code = String(this.task.object.code).split('-');
                form_object_code = form_object_code[form_object_code.length-1];
                let screen_code = object_code +"-"+hash(reportId);
                let objectReport = {
                            "type": "report",
                            "code": object_code,
                            "objectCode": form_object_code,
                            "moduleCode": that.task.object.moduleCode,
                            "subModuleCode": that.task.object.subModuleCode,
                            "componentCode": that.task.object.componentCode,
                            "rawComponentCode": that.task.object.rawComponentCode,
                            "title": "",
                            "desc": "",
                            "icon": "",
                            "background": "",
                            "quickAccess": 1,
                            "modalTitle": "",
                            "root_screen": screen_code,
                            "reportId":reportId,
                            "screens": {
                                [screen_code]: {
                                    "code": screen_code,
                                    "title":"",
                                    "top_area": [

                                    ],
                                    "body_area": [
                                        {
                                            "code": screen_code+"-formscreen",
                                            "type": "htmlView",
                                            "html_template": ''
                                        }
                                    ],
                                    "bottom_area": [

                                    ]
                                }
                            }
                        }
                        vm.openTask(objectReport,"tabs","start|center","start|center")
            }else{
                alert("Report not found")
            }
            vm.objects = object_temp;
        },
        openHtmlViewScreenTheme: function(action_button) {
            if(action_button != null) {
                this.item_button = action_button;
            }
            // hvst = htmlViewScreenTheme
            let that = this;
            let object_code = "undefined-undefined-"+hash('hvst');
            let form_object_code = String(this.task.object.code).split('-');
            form_object_code = form_object_code[form_object_code.length-1];
            let screen_code = object_code +"-"+hash('hvst');
            // Support language tag
            let lang = vm.lang;
            if (lang == 'vi') {
                if (this.item_button.template.includes('vi')) {
                    this.item_button.template.replace(/<vi>(.*)<\/vi>/, function(key1,key2) {
                        that.item_button.template = key2;
                    })
                }
            } else {
                if (this.item_button.template.includes('en')) {
                    this.item_button.template.replace(/<en>(.*)<\/en>/, function(key1,key2) {
                        that.item_button.template = key2;
                    })
                }
            }

            let objectHVST = {
                "type": "act_open_html_screen",
                "code": object_code,
                "objectCode": form_object_code,
                "moduleCode": that.task.object.moduleCode,
                "subModuleCode": that.task.object.subModuleCode,
                "componentCode": that.task.object.componentCode,
                "rawComponentCode": that.task.object.rawComponentCode,
                "activeTaskCode": that.task.object.activeTaskCode,
                "title": "",
                "desc": "",
                "icon": "",
                "background": "",
                "quickAccess": 1,
                "modalTitle": "",
                "root_screen": screen_code,
                "screenTheme": this.item_button.screenTheme,
                "screens": {
                    [screen_code]: {
                        "code": screen_code,
                        "title":"",
                        "top_area": [

                        ],
                        "body_area": [
                            {
                                "code": screen_code+"-formscreen",
                                "type": "htmlView",
                                "html_template": that.item_button.template,
                                "screenCode": screen_code
                            }
                        ],
                        "bottom_area": [

                        ]
                    }
                }
            }
            // Add dismissPr & dependView attribute
            if (this.item_button.hasOwnProperty('dismissParent') && this.item_button.dismissParent === true) {
                if(vm.listSreenTheme[vm.activeTaskCode]?.length>0){      
                    this.closeScreenTheme(vm.activeTaskCode)
                }else{
                    if(vm.activeTaskCode!==''){
                        vm.closeTask(vm.tasks[vm.activeTaskCode])
                    }
                }
                objectHVST.dismissPr = false;
                if (vm.activeTaskCode == "") objectHVST.dependView = objectHVST.activeTaskCode; 
                else objectHVST.dependView = vm.activeTaskCode;
            } else {
                objectHVST.dismissPr = false;
                if (vm.activeTaskCode == "") objectHVST.dependView = objectHVST.activeTaskCode; 
                else objectHVST.dependView = vm.activeTaskCode; 
            }
            // Cheking ownedDomains of RTA
            if ( that.item_button.template.indexOf('https://') === 0 ) {
                const domain = new URL(that.item_button.template).hostname;
                const containsDomain = vm.ownedDomains.some(item => domain.endsWith(item));

                if (containsDomain) {
                    vm.openTask(objectHVST,"tabs","start|center","start|center")
                } else {
                    let link = document.createElement("a");
                        link.href = that.item_button.template;
                        link.target = "_blank";
                        link.click();
                }       
            } else {
                vm.openTask(objectHVST,"tabs","start|center","start|center")
            }

        },
        // Action open chat room:
        handleActionOpenChat: function(action_button) {
            if (action_button != null) {
                this.item_button = action_button;
            }
            const mxUserId      = localStorage.getItem('mx_user_id');
            const mxAccessToken = localStorage.getItem('mx_access_token');
            const roomTarget    = this.item_button.room_target;
            const roomTitle     = this.item_button.room_title;
            const isUserId      = /^@/i.test(roomTarget);

            // Check if the room target already exists
            // If it does, try to open the room if it is a real room ID (not starts with '@' symbol) or create a new room if it is not.
            if ((roomTarget ?? '').trim()) {
                if (!isUserId) {
                    this.openRoom(roomTarget);
                } else {
                    $.when(
                        $.getJSON(`https://vn-rtmessaging.rtcenter.org/_matrix/client/v3/user/${mxUserId}/account_data/m.direct?access_token=${mxAccessToken}`)
                    ).always((dmRoomMap, textStatus, jqXHR) => {
                        if (jqXHR.status !== 200) {
                            dmRoomMap = {};
                        }
                        let matchedRoomId = null;
                        let userId        = roomTarget;
                        let flag          = false;

                        for (var key in dmRoomMap) {
                            if (key === userId) {
                                matchedRoomId = dmRoomMap[key];
                                break;
                            }
                        }

                        // If the room is founded, open it. Otherwise, create a new direct-message room
                        if (matchedRoomId && Array.isArray(matchedRoomId) && matchedRoomId.length > 0) {
                            for (let i = 0; i < matchedRoomId.length; i++) {
                                if (!flag) {
                                    let roomId    = matchedRoomId[i];
                                    let countName = 0;
                                    $.ajax({
                                        url: `https://vn-rtmessaging.rtcenter.org/_matrix/client/v3/rooms/${roomId}/members`,
                                        async: false,
                                        type: 'GET',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${mxAccessToken}`
                                        },
                                        success: (response) => {
                                            let chunk = response.chunk;
                                            for (var i = 0; i < chunk.length; i++) {
                                                if (chunk[i].content.hasOwnProperty('displayname')) {
                                                    countName++;    
                                                }
                                            }    
                                            
                                            if (countName > 1) {
                                                flag = !flag;
                                                this.openRoom(roomId);
                                            }       
                                        },
                                        error: (error) => {}
                                    }); 
                                } else {
                                    break;
                                }
                            }
                            // After going through all roomId in array and can't match the user, create a new direct-message room
                            if (!flag) {
                                this.createMatrixRoom(roomTitle, userId, true, dmRoomMap);
                            }
                        } else {
                            this.createMatrixRoom(roomTitle, userId, true, dmRoomMap);
                        }
                    });
                }
            } else {
                // The room target doesn't exist, so create a new one and open it
                this.createMatrixRoom(roomTitle);
            }
        },
        createMatrixRoom: function(roomTitle, invitee = null, isDirectRoom = false, dmRoomMap = null) {
            const mxUserId      = localStorage.getItem('mx_user_id');
            const mxAccessToken = localStorage.getItem('mx_access_token');
            const payload = {
                name: roomTitle,
                preset: 'trusted_private_chat',
                visibility: 'private',
                ...(isDirectRoom
                    ? { invite: [invitee] }
                    : {}
                )
            }

            $.ajax({
                url: 'https://vn-rtmessaging.rtcenter.org/_matrix/client/v3/createRoom',
                type: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${mxAccessToken}`
                },
                data: JSON.stringify(payload),
                success: (response) => {
                    const roomId = response.room_id;
                    // Marks the given room as being as a DM room
                    if (isDirectRoom && dmRoomMap) {
                        const roomList = dmRoomMap[invitee] || [];
                        if (roomList.indexOf(roomId) == -1) {
                            roomList.push(roomId);
                        }
                        dmRoomMap[invitee] = roomList;

                        $.ajax({
                            url: `https://vn-rtmessaging.rtcenter.org/_matrix/client/v3/user/${mxUserId}/account_data/m.direct?access_token=${mxAccessToken}`,
                            type: 'PUT',
                            dataType: 'JSON',
                            data: JSON.stringify(dmRoomMap)
                        });
                    }

                    // After everything is done, open the room
                    this.openRoom(roomId);
                },
                error: (error) => {}
            });
        },
        openRoom: function(roomId) {
            const iframe = document.getElementById('ifmatrixchat');
            if (iframe) {
                iframe.setAttribute("src", `webapp/default/messaging/#/room/${roomId}`);
                $('#webapp_workspace').fadeOut(1200);
            } else {
                // TODO: Handle when the iframe doesn't exist, maybe ignores the function call or displays an error message
                toastr.error('Error !!! Please try again later.')
            }
        },
        // Action open chat room - End.
        openMapView: function (action_button) {
            if(action_button != null){
                this.item_button = action_button;
            }
            let taskCode = vm.tasks.length
            vm.tasks.push({
                code: taskCode,
                title: "Map",
                html_content: "",
                isDeleted:false,
                comitem: "center|start",
                subitem: "center|start",
                layout: "tabs",
                object: {
                    title:'Map',
                    type:'datamodel',
                    screens:[],
                    dependView:vm.activeTaskCode,
                    dismissPr:false
                }
            })
            vm.activeTaskCode = taskCode
            vm.statusPopup = false
            let lat = parseFloat(this.item_button['lat'])
            let lon = parseFloat(this.item_button['lon'])
            let markerContent = this.item_button['name']
            setTimeout(function() {
                $('#task-modal-'+vm.activeTaskCode).modal('show')

                let mapType = document.createElement('div')
                mapType.className = "rta-map-types"
                let btnGoogle = document.createElement('button')
                btnGoogle.innerHTML = "Google"
                btnGoogle.className = "rta-google-map"
                btnGoogle.addEventListener("click", function () {
                    $('#task-modal-'+vm.activeTaskCode).find(".modal-body .rta-map-types .rta-google-map").addClass("active")
                    $('#task-modal-'+vm.activeTaskCode).find(".modal-body .rta-map-types .rta-leaflet-map").removeClass("active")
                    $('#task-modal-'+vm.activeTaskCode).find(".modal-body .leaflet-container").addClass("hidden")
                    $('#task-modal-'+vm.activeTaskCode).find(".modal-body .rta-map-container").removeClass("hidden")
                    leafletMap.invalidateSize()
                });
                let btnLeaflet = document.createElement('button')
                btnLeaflet.innerHTML = "Leaflet"
                btnLeaflet.className = "rta-leaflet-map active"
                btnLeaflet.addEventListener("click", function () {
                    $('#task-modal-'+vm.activeTaskCode).find(".modal-body .rta-map-types .rta-leaflet-map").addClass("active")
                    $('#task-modal-'+vm.activeTaskCode).find(".modal-body .rta-map-types .rta-google-map").removeClass("active")
                    $('#task-modal-'+vm.activeTaskCode).find(".modal-body .rta-map-container").addClass("hidden")
                    $('#task-modal-'+vm.activeTaskCode).find(".modal-body .leaflet-container").removeClass("hidden")
                    leafletMap.invalidateSize()
                });
                $('#task-modal-'+vm.activeTaskCode).find(".modal-body .rta-map-types").append(btnGoogle)
                $('#task-modal-'+vm.activeTaskCode).find(".modal-body .rta-map-types").append(btnLeaflet)
                $('#task-modal-'+vm.activeTaskCode).find(".modal-body").addClass("rta-map-body")

                // Google Maps
                let mapOptions = {
                    zoom: 13,
                    center: {lat: lat, lng: lon}
                };
                let mapDiv = document.createElement('div')
                mapDiv.className = "rta-map-container"
                $('#task-modal-'+vm.activeTaskCode).find(".modal-body").append(mapDiv)
                let map = new google.maps.Map(mapDiv, mapOptions)

                let marker = new google.maps.Marker({
                    position: {lat: lat, lng: lon},
                    map: map
                })

                let infowindow = new google.maps.InfoWindow({ content: "<p>" + markerContent + "</p>"})

                google.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map, marker);
                })

                // Leaflet Map
                let mapdiv = document.createElement('div')
                $('#task-modal-'+vm.activeTaskCode).find(".modal-body").append(mapdiv)
                let leafletMap = L.map(mapdiv).setView([lat, lon], 15)

                L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                    subdomains:['mt0','mt1','mt2','mt3'],
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox.streets',
                    accessToken: 'pk.eyJ1IjoiYmxxdWFuZzIwMjAiLCJhIjoiY2sweDk2MGhnMDQxdzNjcDE5bTFpNDY2bCJ9.h1r5t5Zn287CbjHRjxUmwQ'
                }).addTo(leafletMap);
                let leafletMarker = L.marker([lat, lon]).addTo(leafletMap)
                leafletMarker.bindPopup("<p>" + markerContent + "</p>")
                $('#task-modal-'+vm.activeTaskCode).find(".modal-body .rta-map-container").addClass("hidden")

                // fullscreen-button
                $('#task-modal-'+vm.activeTaskCode).find(".rta-modal-header .fullscreen-button button").click( function () {
                    map.panTo({lat: lat, lng: lon})
                    leafletMap.invalidateSize()
                });
            }, 200)
        },
        openLeafletMapView: function() {
            let taskCode = vm.tasks.length
            vm.tasks.push({
                code: taskCode,
                title: "Map",
                html_content: "",
                isDeleted:false,
                object: {}
            })
            vm.activeTaskCode = taskCode
            vm.statusPopup = false
            let lat = parseFloat(this.item_button['lat'])
            let lon = parseFloat(this.item_button['lon'])
            let markerContent = this.item_button['name']
            setTimeout(function() {
                $('#task-modal-'+taskCode).modal('show')
                let mapdiv = document.createElement('div')
                $('#task-modal-'+taskCode).find(".modal-body").append(mapdiv)
                $('#task-modal-'+taskCode).find(".modal-body").addClass("rta-map-body")
                let leafletMap = L.map(mapdiv).setView([lat, lon], 15)

                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox.streets',
                    accessToken: 'pk.eyJ1IjoiYmxxdWFuZzIwMjAiLCJhIjoiY2sweDk2MGhnMDQxdzNjcDE5bTFpNDY2bCJ9.h1r5t5Zn287CbjHRjxUmwQ'
                }).addTo(leafletMap);
                let marker = L.marker([lat, lon]).addTo(leafletMap)
                marker.bindPopup("<p>" + markerContent + "</p>")
            }, 200)
        },
        handleTracking(tracking_id){
            if(this.item_button.hasOwnProperty('override_ui_behavior')){
                if(this.item_button.override_ui_behavior.timeout){
                    let timecurent = (new Date()).getTime()
                    let timerun = timecurent - vm.time_tracking_id[tracking_id].time
                    let timeout = timerun < this.item_button.override_ui_behavior.timeout*1000 && timerun > 0
                    
                    if(timeout){
                        this.status_tracking = true
                        let timeremain = this.item_button.override_ui_behavior.timeout*1000 - (timerun)
                        if(this.item_button.override_ui_behavior.behavior === 'hide'){
                            this.tracking = 'display: none;';
                            setTimeout(() => {
                                $('#'+this.randomID).show()
                            }, timeremain);
                        }else if(this.item_button.override_ui_behavior.behavior === 'disable'){
                            this.disabled == 'disabled'
                            this.styleIconDisable = 'filter: contrast(0);'
                            this.styleAll += 'color: #808080d1 !important;'
                            setTimeout(() => {
                                let $button = $('#'+this.randomID +' button')
                                let $imgTag = $button.find('img');
                                let $iTag = $button.find('i');
                                let $pTag = $('#'+this.randomID).find('p');
                                this.status_tracking = false
                                this.disabled = ""
                                if ($imgTag.length > 0) {
                                    $imgTag.css('filter', '');
                                }
                                if ($iTag.length > 0) {
                                    $iTag.css('color', 'black');
                                }
                                if ($pTag.length > 0) {
                                    $pTag.css('color','')
                                }
                            }, timeremain);
                        }else{
                            return
                        }
                    }
                
                }
            }
        },
        closeScreenTheme(taskactive){
            let list = vm.listSreenTheme[taskactive]
            let taskcode = list[list.length-1]
            vm.listSreenTheme[taskactive].pop()   
            vm.tasks[taskcode].isDeleted = true;
            setTimeout(function() {
                $('#task-modal-'+taskcode).remove();
                $('#task-icon-'+taskcode).remove();
            }, 200)
        },
    }
});
