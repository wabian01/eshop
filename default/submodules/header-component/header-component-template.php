<template id="header-component">
    <div style="margin:0 -10px;color:black;">
        <div 
            class="portlet box green-dark" 
            style="background-color:transparent; border:none;"  
        >
            <div class="tabbable form-body" style="background: #ffffff; padding-left:0px !important; padding-right:0px !important; padding-top:8 !important">
                <div 
                    class="tab-content" 
                    style="position: relative;" 
                    :style="submodule.layout == 'tiles' ? {
                    'max-height':'597px',
                    'overflow-y': 'auto',
                    'padding-top': '0',
                    'scrollbar-width': 'none'} : ''
                    "
                >
                    <div 
                        v-show="component.filtered_visible"
                        :style="submodule.layout != 'tiles' ? showTab ? {'overflow-y': 'auto','padding-top': '0','scrollbar-width': 'none'}:{'overflow-y': 'auto','padding-top': '0','scrollbar-width': 'none'}: ''" 
                        v-if="(component.subModuleCode == submodule.code) && (component.hasOwnProperty('is_header') && component.is_header === 1)"  
                        v-for="(component, code) in vm.filterHiddenComponents(components)" 
                        :key="component.code" 
                        :class="{'tab-pane':true, 'active':submodule.layout == 'tiles'? true : component.is_header === 1, 'form':true, 'no-instances':(Object.keys(component.objects).length<=0)}" 
                        :id="component.code" 
                    >
                        <div v-if="submodule.layout==='tiles' && component.hasOwnProperty('buttons')" style="padding:4px 10px;">
                            <div style="float:right;" v-if="component.buttons.length>0">
                                <span  
                                    class="dropdown toparea" 
                                    style="
                                        background-color: rgba(51, 51, 51, 0.36);
                                        border-radius: 50% !important;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        color: rgb(255, 255, 255);
                                        cursor: pointer;
                                        font-size: 10px;"
                                >
                                    <span 
                                        data-toggle="dropdown" 
                                        style="
                                            z-index: 3;
                                            width: 24px;
                                            height: 24px;
                                            display: flex;
                                            align-items: center;
                                            justify-content: center;" 
                                    >
                                        <span v-html="convertABComponent(component.buttons,'icon_button')" v-show="showABTiles"></span>
                                    </span>
                                    <span class="dropdown-menu pull-right module_button" style="overflow: auto;max-height: 40vh; border-radius: 4px !important; box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 8px;">
                                        <action-button v-for="(item_button,index) in convertABComponent(component.buttons,'buttons')" :key="component.buttons" :indexsearch="true" :end="index==component.buttons.length-1" :item_button="item_button" :task="convertABComponent(component,'task')"> </action-button>
                                    </span>
                                </span> 
                            </div>
                            <div>{{component.name}}</div>
                        </div>
                        <div ref='zoomTask1' :showtab="showTab" :show_all_object="showMultiOneObject" is="component-content" v-if="(!component.hasOwnProperty('not_power') && !component.hasOwnProperty('one_object_notpower')) && ((componentContent(component) && submodule.layout==='tabs'))"   :component="component" :layout="submodule.layout" :subitem="submodule.itemAppearance" :comitem="component.itemAppearance"></div>
                        <div v-else-if="(!component.hasOwnProperty('show_content') && !componentContent(component)) || (component.hasOwnProperty('show_content') && !component.show_content) || (component.hasOwnProperty('not_power') || component.hasOwnProperty('one_object_notpower'))" :not_power="component.hasOwnProperty('not_power') ? true :false"  is="component-detail" :component="component" :objects="objects" :layout="submodule.layout" :subitem="submodule.itemAppearance" :keyword="keyword"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>