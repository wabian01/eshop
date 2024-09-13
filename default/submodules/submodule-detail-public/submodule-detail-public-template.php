<template id="submodule-detail-public">
    <div>
        <div 
            class="portlet box green-dark" 
            style="background-color:transparent; border:none;"  
        >
            <div 
                class="portlet-title" 
                style="min-height: 40px;background-color: #f5f5f5;border-bottom: 1px solid #e6dede;"  
                :style="showTab ? 'position: sticky;z-index:9999;':'' "
            >
                <div 
                    v-show='showBackToModule && vm.activeScreenSub.indexOf(submodule.code)<0' 
                    v-on:click="backToModule()" 
                    style="float:left;padding-top:8px; cursor: pointer;"
                    title="Back to"
                > 
                    <span>
                        <i class="fas fa-arrow-left" style="color: rgb(115, 115, 115); padding: 7px;"></i>
                    </span> 
                </div>
                <div 
                    v-show="(activeComponentContent!=='' && submodule.components.hasOwnProperty(activeComponentContent) && submodule.components[activeComponentContent].show_content) && submodule.layout==='tabs'" 
                    :style="(showTab && Object.keys(submodule.components).length > 1)?'padding-top: 5px;':'padding-top: 5px;'" 
                    style="display:flex;float: right;" 
                >
                    <div 
                        v-show="vm.activeScreenSub.indexOf(submodule.code)<0 && showSearchInput" 
                        style="margin: auto;display: flex;position:relative;padding: 0px 10px 0px 16px;" 
                        class="searchContent"
                    >
                        <span style="color:#bdbdbd;position:absolute;left:25px;top:3px;font-size:0.9em;"><i class="fa fa-search"></i></span>
                        <input  v-on:input="handleSearchCom" ref="searchInput" type="text" class="rta-search-com" style="width: 250px;;height:25px;color: black;padding: 0px 30px;border: 1px solid #bdbdbd;border-radius: 20px !important;font-size:0,9em;" placeholder="Search" style="color: white;background-color: #009688;border: none;"/>
                        <span v-show="keyword!=''" style="color:#737373;position:absolute;right:20px;top:2px;cursor:pointer;" @click="clearSearch()"><i class="la la-times" style="font-size: 0.9em;font-weight: bold;"></i></span>
                    </div>
                    <div class="searchdisplay" style="display:none;">
                        <button v-if="vm.activeScreenSub.indexOf(submodule.code)<0 && showSearch" v-on:click="currentCom" style="background: transparent;border: none;color: #ffffff;font-size: 1rem;display: block;padding: 0.1rem 0.4rem;outline: none;" type="button" ><i :style="[showSearchInput ? {'color': '#009688'} : {'color': '#737373'}]" class="fa fa-search"></i></button>
                    </div>
                
                    <div class="btn-group btn-theme-panel filterdisplay" style="margin-top:0;display:none;" >
                    <button v-if="vm.activeScreenSub.indexOf(submodule.code)<0 && showSearch" v-on:click="addComponentActive" data-close-others="true" data-toggle="dropdown" type="button" style="background: transparent;border: none;color: #ffffff;font-size: 1rem;display: block;padding: 0.1rem 0.4rem;outline: none;" class=""><i style="color: #737373;font-weight: 600;" class="la la-filter"></i><div class="check_filter" style="background-color: orange;width: 10px;height: 10px;position: absolute;top: 2px;left: 14px;border-radius: 50% !important; display:none;"></div></button>
                        <div style="width: 450px;z-index: 1000;overflow: hidden;right: 0;left: auto;max-height: 80vh;top: 20px;border-radius: 4px !important;box-shadow: 2px 2px 5px 1px #24232347;" class="dropdown-menu dropdown-custom hold-on-click">
                            <div class="">
                                <div style="height:50px;padding:16px;display:flex; align-items: center; justify-content: space-between;border-bottom: 1px solid #bdbdbd;">
                                    <span style="color:#000;font-size:1.3em;font-weight:bold;"><?php echo Yii::t('app','Filter'); ?></span>
                                    <span style="color:#ff0000;cursor:pointer;font-weight:bold;" @click="reset_filter=!reset_filter"><?php echo Yii::t('app','Reset'); ?></span>
                                </div>
                                <div style="overflow: auto;max-height: calc(80vh - 115px);padding-bottom: 5px; min-height:250px;"> 
                                    <search-option
                                            v-for="(filter, code) in vm.activeListFilters"
                                            :filter="filter" :reset_filter="reset_filter" :show_all_object="showMultiOneObject" :taskcode="9999" :show_filter="show_filter" :apply_filter="apply_filter" :check_filter="check_filter"
                                    ></search-option>
                                </div>
                                <div style="height:65px;padding:16px;display:flex; align-items: center; justify-content: flex-end;">
                                    <button type="button" class="btn" @click="hideFilter()" style ="font-weight:bold; width:100px; height:40px; background:#eee;color:#737373 !important; border:none;border-radius: 4px !important;"><?php echo Yii::t('app','Cancel'); ?></button>    
                                    <button type="button" class="btn" @click="apply_filter=!apply_filter" style ="font-weight:bold; width:100px; margin-left:10px; height:40px; background:#009688;color:#fff; border:none;border-radius: 4px !important;"><?php echo Yii::t('app','Apply'); ?></button>
                                </div>
                            </div>
                        </div>
                    </div>
                     
                    <div class="sortfilter-button" v-if="stateSort && vm.activeScreenSub.indexOf(submodule.code)<0 && showSearch">
                        <div v-if="vm.sortFilter[9999].hasOwnProperty('entries') && vm.sortFilter[9999].entries.length>0">
                            <button data-close-others="true" data-toggle="dropdown" type="button" class="" style="background: transparent;border: none;color: #ffffff;font-size: 1rem;display: block;padding: 0.1rem 0.4rem;outline: none;"><i :class="orderSort=='ASC'?'fas fa-sort-alpha-down':'fas fa-sort-alpha-down-alt'" style="color: #737373;font-weight: 600;"></i></button>
                            <div style="color: black;width: 450px;z-index: 1000;overflow: hidden;right: 0;left: auto;max-height: 80vh;top: 30px;border-radius: 4px !important;box-shadow: 2px 2px 5px 1px #24232347;" class="dropdown-menu dropdown-custom hold-on-click">
                                <sort-filter :taskcode="9999"></sort-filter>
                            </div>
                        </div>
                        <button v-on:click="sortFilter" v-else  type="button" class="" style="background: transparent;border: none;color: #ffffff;font-size: 1rem;display: block;padding: 0.1rem 0.4rem;outline: none;"><i :class="orderSort=='ASC'?'fas fa-sort-alpha-down':'fas fa-sort-alpha-down-alt'" style="color: #737373;font-weight: 600;"></i></button>
                    </div>
                    <div class="btn-group btn-theme-panel dropdown toparea" style="margin-top:0;" v-show="show_button">
                        <button type="button" data-close-others="true" data-toggle="dropdown" style="background: transparent;border: none;color: #ffffff;font-size: 1rem;display: block;padding: 0.1rem 0.4rem;outline: none;">
                            <div style="color: rgb(115, 115, 115);" v-html="icon_button"></div>
                        </button>
                        <div class="dropdown-menu pull-right module_button" style="overflow: auto;max-height: 40vh; border-radius: 4px !important; box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 8px;">
                            <action-button v-for="(item_button,index) in item_buttons" :key="item_buttons" :indexsearch="true" :end="index==item_buttons.length-1" :item_button="item_button" :task="task"> </action-button>
                        </div>
                    </div>
                </div>
                <div 
                    v-if="vm.modules[vm.activeModuleCode].hasOwnProperty('functionCode') && vm.objectLevel == 0" 
                    v-show="!((activeComponentContent!=='' && submodule.components.hasOwnProperty(activeComponentContent) && submodule.components[activeComponentContent].show_content) && submodule.layout==='tabs')"
                    style="display:flex;float: right;padding-top: 9px;" 
                >
                    <div 
                        v-show="showSearchInputSystem " 
                        style="margin: auto;display: flex;position:relative;padding: 0px 10px 0px 16px;" 
                        class="searchContent"
                    >
                        <span style="color:#bdbdbd;position:absolute;left:25px;top:3px;font-size:0.9em;"><i class="fa fa-search"></i></span>
                        <input  v-on:input="handleSearch" ref="searchInputSystem" type="text" class="rta-search-com" style="width: 250px;;height:25px;color: black;padding: 0px 30px;border: 1px solid #bdbdbd;border-radius: 20px !important;font-size:0,9em;" placeholder="Search" style="color: white;background-color: #009688;border: none;"/>
                        <span v-show="vm.objectSearchString!=''" style="color:#737373;position:absolute;right:20px;top:2px;cursor:pointer;" @click="clearSearch2()"><i class="la la-times" style="font-size: 0.9em;font-weight: bold;"></i></span>
                        
                    </div>
                    <button v-if="!showSearchInputSystem" v-on:click="currentCom2" style="background: transparent;border: none;color: #ffffff;font-size: 1rem;display: block;padding: 0.1rem 0.4rem;outline: none;" type="button" class=""><i style="color: #737373" class="fa fa-search"></i></button>
                    <span v-else style="color:#737373;cursor:pointer;"  v-on:click="currentCom2">Cancel</span>
                    <button v-if="!showSearchInputSystem" v-on:click="alert('This feature not support now!')" style="background: transparent;border: none;color: #ffffff;font-size: 1rem;display: block;padding: 0.1rem 0.4rem;outline: none;" type="button" class=""><i style="color: #737373" class="fas fa-sort-amount-down"></i></button>
                    <button v-if="!showSearchInputSystem" v-on:click="alert('This feature not support now!')" style="background: transparent;border: none;color: #ffffff;font-size: 1rem;display: block;padding: 0.1rem 0.4rem;outline: none;" type="button" class=""><i style="transform: rotate(90deg);color: #737373;" class="fas fa-ellipsis-h"></i></button>
                   
                </div>
                               
                <div class="caption" v-if="vm.objectLevel == 1">
                    <span v-on:click="vm.backToFormList()" v-if="vm.objectLevel == 1" ><i style="font-size:14px;color:#737373;" class="fas fa-arrow-left"></i></span>
                    <span style="color: #009688;font-size:14px;  text-transform: uppercase; font-weight: 600;" v-html="objects[vm.activeObjectCode].title"></span>
                </div>
                <div class="caption scroll-com" v-else style="padding:  5px 0 0;font-size: 14px;white-space: nowrap;display: flex;text-overflow: ellipsis;overflow: hidden;align-items: center;height:40px; overflow: auto;overflow-x: overlay;scrollbar-color: #4db3a2 #C2D2E400;overflow-y: hidden;" :style="{'float': activeComponentContent!=='' ? 'none' : 'left'}">
                    <span><i style="color:#737373;padding: 7px; cursor: pointer;" class="rta-fas-icon fas fa-arrow-left" v-if="vm.activeScreenSub.indexOf(submodule.code)>-1" v-on:click="actionBacktoScreen" ></i></span>
                    <span v-show="statusABactive && ((Object.keys(submodule.components).length === 1 && vm.activeScreenSub.indexOf(submodule.code) <0) || (!showTab && (Object.keys(submodule.components).length === 1 || submodule.layout == 'tiles'))) && ( !showSearchInput || vm.activeScreenSub.indexOf(submodule.code)>-1)" style="text-transform: uppercase;color: #009688;font-weight: 600;" v-html="vm.funcReplaceTitleAndName(submodule.title)"></span>
                    <span v-show="showTab && vm.activeScreenSub.indexOf(submodule.code)>-1" style="text-transform: uppercase;color: #009688;font-weight: 600;" v-html="vm.funcReplaceTitleAndName(vm.titleSkipObject)"></span>
                    <div   
                        v-if="submodule.layout != 'tiles' && vm.activeScreenSub.indexOf(submodule.code)<0 && statusABactive" 
                        class='scroll-com tab-content' 
                        title="Shift + scroll mouse to horizontal scroll"
                    >
                        <ul class="nav nav-tabs" v-if="vm.objectLevel == 0 && (Object.keys(submodule.components).length > 1)" style="margin-bottom: 0px;border-bottom: none;">
                            <li v-show="component.filtered_visible && component.name!='' && component.name!=null" style="margin-right: 10px;border-radius: 4px !important;" :class="{ active : activeComponentContent !=='' && activeComponentContent === component.code}" v-if="(component.subModuleCode == submodule.code)" is="component-tab-content" v-for="(component, code) in vm.filterHiddenComponents(components)" :key="component.code" :component="component"></li>
                        </ul>
                    </div>
                    <div v-if="!statusABactive && vm.activeScreenSub.indexOf(submodule.code)<0" style="color: #009688;font-size:14px;  text-transform: uppercase; font-weight: 600;" v-html="components[nameComponentAB].name"></div>
                    <div class="btn-group btn-theme-panel dropdown toparea" style="margin-top:0;position: fixed;right:10px;z-index:5;" v-show="submodule.hasOwnProperty('inner_buttons') && submodule.inner_buttons.length>0 && !showTab">
                        <button type="button" data-close-others="true" data-toggle="dropdown" style="background: transparent;border: none;color: #ffffff;font-size: 1rem;display: block;padding: 0.1rem 0.4rem;outline: none;">
                            <div style="color: rgb(115, 115, 115);" v-html="icon_button"></div>
                        </button>
                        <div class="dropdown-menu pull-right module_button" style="overflow: auto;max-height: 40vh; border-radius: 4px !important; box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 8px;">
                            <action-button v-for="(item_button,index) in item_buttons" :key="item_buttons" :indexsearch="true" :end="index==item_buttons.length-1" :item_button="item_button" :task="task"> </action-button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="portlet-body form" style="padding: 10px;;position: relative;background-color:hsla(0,0%,96.1%,.9);" :style="showTab?'border-top: none;margin-right: 0px;':'none'">
                <div 
                    v-if="submodule.layout != 'tiles' && !showTab  && false" 
                    id="s-com-title"
                    class='scroll-com' 
                    style="
                        overflow: auto;
                        overflow-x: overlay;
                        scrollbar-color: #009688;
                        overflow-y: hidden !important;
                        height: 42px;
                        padding: 8px;
                        /* background-color: red; */
                    " 
                    title="Shift + scroll mouse to horizontal scroll"
                >
                    <ul style="border-bottom: none; margin-bottom: 0;" class="nav nav-tabs" v-if="vm.objectLevel == 0 && (Object.keys(submodule.components).length > 1)">
                        <li style="margin-right: 10px;" v-show="component.filtered_visible && component.name!='' && component.name!=null" :class="{ active : component.isFirst}" v-if="(component.subModuleCode == submodule.code)" is="component" v-for="(component, code) in vm.filterHiddenComponents(components)" :key="component.code" :component="component"></li>
                    </ul>
                </div>
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
                            :style="submodule.layout != 'tiles' ? showTab ? {'overflow-y': 'auto',
                                'padding-top': '0',
                                'scrollbar-width': 'none'}:
                                                    {
                                                'max-height':'597px',
                                'overflow-y': 'auto',
                                'padding-top': '0',
                                'scrollbar-width': 'none'}: ''
                            " 
                            v-if="(component.subModuleCode == submodule.code)"  
                            v-for="(component, code) in vm.filterHiddenComponents(components)" 
                            :key="component.code" 
                            :class="{'tab-pane':true, 'active':submodule.layout == 'tiles'? true : component.isFirst, 'form':true, 'no-instances':(Object.keys(component.objects).length<=0)}" 
                            :id="component.code" 
                        >
                            <div v-if="submodule.layout==='tiles' && component.hasOwnProperty('buttons')" style="padding:4px 10px;">
                                <div style="float:right;" v-if="component.buttons.length>0">
                                    <span  class="dropdown toparea" style="background-color: rgba(51, 51, 51, 0.36);
                                                border-radius: 50% !important;
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                color: rgb(255, 255, 255);
                                                cursor: pointer;
                                                font-size: 10px;">
                                        <span data-toggle="dropdown" style="z-index: 3;
                                                width: 24px;
                                                height: 24px;
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;" >
                                            <span v-html="convertABComponent(component.buttons,'icon_button')" v-show="showABTiles"></span>
                                        </span>
                                        <span class="dropdown-menu pull-right module_button" style="overflow: auto;max-height: 40vh; border-radius: 4px !important; box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 8px;">
                                            <action-button v-for="(item_button,index) in convertABComponent(component.buttons,'buttons')" :key="component.buttons" :indexsearch="true" :end="index==component.buttons.length-1" :item_button="item_button" :task="convertABComponent(component,'task')"> </action-button>
                                        </span>
                                    </span> 
                                </div>
                                <div>{{component.name}}</div>
                            </div>
                            <div ref='zoomTask1' :showtab="showTab" :show_all_object="showMultiOneObject" :webpublic="true" is="component-content" v-if="(!component.hasOwnProperty('not_power') && !component.hasOwnProperty('one_object_notpower')) && (((component.isFirst && activeComponentContent=='')||(activeComponentContent==component.code)) && (componentContent(component) && submodule.layout==='tabs')) && (activeComponentContent !== '' &&  activeComponentContent==component.code)"   :component="component" :layout="submodule.layout" :subitem="submodule.itemAppearance" :comitem="component.itemAppearance"></div>
                            <div v-else-if="(!component.hasOwnProperty('show_content') && !componentContent(component)) || (component.hasOwnProperty('show_content') && !component.show_content) || (component.hasOwnProperty('not_power') || component.hasOwnProperty('one_object_notpower'))" :not_power="component.hasOwnProperty('not_power') ? true :false"  is="component-detail" :component="component" :objects="objects" :layout="submodule.layout" :subitem="submodule.itemAppearance" :keyword="keyword"></div>
                        </div>
                    </div>
                </div>
                <div v-if="submodule.showActionButtons == 1 && vm.objectLevel == 1">
                    <button v-on:click="vm.sendFinalizedInstances()" type="button" class="btn pull-right rta-button-send-instances rta-btn-disable" style="height:35px;margin:0 10px;font-weight:bold; width:75px; background:#009688;color:#fff; border:none;border-radius:4px !important;">SEND</button>
                    <button v-on:click="selectAllInstance" type="button" class="btn pull-right" style="height:35px;margin:0 10px;font-weight:bold; width:120px; background:#eee;color:#737373; border:none;border-radius:4px !important;">TOGGLE ALL</button>
                </div>
            </div>
        </div>
    </div>
</template>