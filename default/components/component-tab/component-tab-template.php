<template id="component-tab">
    <div :class="'modal-fade '+task.object.code+' '+task.openFromAB" :id="'task-modal-'+task.code"  role="dialog" aria-hidden="true" style="display: block !important;">
        <div class="modal-dialog-modal-wide-webapp-modal" style="position: relative; display:block; z-index: 9999 !important;" >
            <button 
                style="
                    position: absolute;
                    border: none;
                    background: transparent; 
                    top: 5px;
                    right: 1px;
                    opacity: 0.7;
                    z-index: 1;
                    cursor: pointer;" 
                type="button" 
                data-dismiss="modal"  
                v-show="task.components.hasOwnProperty('screenTheme') && task.components.screenTheme == 'fullscreen' "
                v-on:click="vm.closeTask(task)"
            >
                <i style="font-size: 20px;" class="fas fa-times-circle"></i>
            </button> 
            <div class="modal-content webapp-popup" style="box-shadow: none; border: none;" :style="webpublic?'':'height:calc(100vh - 90px);'">
                <div v-show="task.object.type!='form' && task.object.type!='fill-form' && task.object.type!='edit-form' && task.object.type!='instance' && (!task.components.hasOwnProperty('screenTheme') || task.components.screenTheme == null)" class="modal-header rta-modal-header-wrapper" style="background-color: #f5f5f5;position: sticky;top: 0;z-index:3;height: 40px;">
                    <div class="rta-modal-header-new" style="padding:0px 10px;">
                        <div v-show="showSearch==false || vm.previousScreenCode!=''" class="rta-modal-header-div">
                            <i class="rta-fas-icon fas fa-arrow-left" style="padding:7px; cursor: pointer;" v-if="vm.previousScreenCode!=''" v-on:click="previousScreenIframe"></i>
                            <ul class="rta-webapp-popup-topbar-left">
                                <li>
                                    <h4 class="modal-title" style="font-size:14px;color: rgb(0, 150, 136);font-weight: 600;">{{vm.funcReplaceTitleAndName(task.title)}}</h4>
                                </li>
                            </ul>
                        </div>
                        <div v-show="showSearch==true && vm.previousScreenCode==''" class="rta-modal-header-div" style="margin:auto;width:100%;position:relative;padding-right: 10px;">
                            <div style="display:flex;;align-items:center;height:40px;width:100%;position:relative;">
                                <input v-on:input="handleSearch" ref="searchInput" type="text" class="form-control input-large rta empty" placeholder="&#xF002;  Search" style="width:100% !important;border:none; border-radius: 5px !important;font-size: 1em;padding-right:30px;"/>
                                <span v-show="vm.itemSearchString!=''" style="color:#999;position:absolute;right:15px;cursor:pointer;" @click="clearSearch()"><i class="fas fa-times"></i></span>
                            </div>
                            <span @click="closeSearch()" style="padding-left: 1em; cursor:pointer;">Cancel</span>
                        </div>
                        <div class="rta-modal-header-div">
                            <ul class="rta-webapp-popup-functional-button">
                                <li v-show="task.object.type=='datamodel' && showSearch==false && vm.previousScreenCode==''" class="search-button">
                                    <div class="btn-group btn-theme-panel searchdisplay" style="display:none;">
                                        <button v-on:click="handleOpenSearch" data-close-others="true" data-toggle="dropdown" type="button" class=""><i class="fas fa-search"></i></button>
                                    </div>
                                </li>
                                <li v-show="task.object.type=='datamodel' && showSearch==false && vm.previousScreenCode==''" class="filter-button">
                                    <div class="btn-group btn-theme-panel filterdisplay" style="display:none;">
                                        <button data-close-others="true" data-toggle="dropdown" type="button" class="" @click="check_filter  = !check_filter"><i class="fas fa-filter"></i><div class="check_filter" style="background-color: orange;width: 10px;height: 10px;position: absolute;top: 10px;left: 20px;border-radius: 50% !important; display:none;"></div></button>
                                        <div style="width: 450px;z-index: 1000;overflow: hidden;right: 0;left: auto;max-height: 80vh;top: 30px;border-radius: 4px !important;box-shadow: 2px 2px 5px 1px #24232347;" class="dropdown-menu dropdown-custom hold-on-click">
                                            <div class="">
                                                <div style="height:50px;padding:16px;display:flex; align-items: center; justify-content: space-between;border-bottom: 1px solid #bdbdbd;">
                                                    <span style="color:#000;font-size:1.3em;font-weight:bold;">Filter</span>
                                                    <span style="color:#ff0000;cursor:pointer;font-weight:bold;" @click="reset_filter=!reset_filter">Reset</span>
                                                </div>
                                                <div style="overflow: auto;max-height: calc(80vh - 115px);padding-bottom:5px;min-height:250px;">
                                                    <search-option v-if="filter.chart===undefined && filter.table===undefined"
                                                        v-for="(filter, code) in vm.activeListFilters"
                                                        :filter="filter" :reset_filter="reset_filter" :taskcode="task.code" :show_filter="show_filter" :apply_filter="apply_filter" :check_filter="check_filter"
                                                    ></search-option>
                                                </div>
                                                <div style="height:65px;padding:16px;display:flex; align-items: center; justify-content: flex-end;">
                                                    <button type="button" class="btn" @click="hideFilter()" style ="font-weight:bold; width:100px; height:40px; background:#eee;color:#737373 !important; border:none;border-radius: 4px !important;">Cancel</button>    
                                                    <button type="button" class="btn" @click="apply_filter=!apply_filter" style ="font-weight:bold; width:100px; margin-left:10px; height:40px; background:#009688;color:#fff; border:none;border-radius: 4px !important;">Apply</button>
                                                </div>
                                                    
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class="toparea-button"  v-if="show_button && vm.topBar.hasOwnProperty(this.task.code) && vm.topBar[this.task.code][0].screenCode == vm.activeScreenCode">
                                    <div class="btn-theme-panel" >
                                        <div class="btn-group btn-theme-panel dropdown toparea">
                                            <button type="button" data-close-others="true" data-toggle="dropdown">
                                                <div v-html="icon_button"></div>
                                            </button>
                                            <div class="dropdown-menu pull-right module_button" style="overflow: auto; border-radius: 4px !important; box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 8px;">
                                                <action-button v-for="(item_button,index) in item_buttons" :indexsearch="true" :end="index==item_buttons.length-1" :item_button="item_button" :task="task"> </action-button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class="sortfilter-button" v-if="stateSort" v-show="task.object.type=='datamodel' && showSearch==false && vm.previousScreenCode==''">
                                    <div v-if="vm.sortFilter[task.code].hasOwnProperty('entries') && vm.sortFilter[task.code].entries.length>0">
                                        <button data-close-others="true" data-toggle="dropdown" type="button" class=""><i :class="orderSort=='ASC'?'fas fa-sort-alpha-down':'fas fa-sort-alpha-down-alt'" style="font-weight:900; font-size:1.1rem;"></i></button>
                                        <div style="color: black;width: 450px;z-index: 1000;overflow: hidden;right: 0;left: auto;max-height: 80vh;top: 30px;border-radius: 4px !important;box-shadow: 2px 2px 5px 1px #24232347;" class="dropdown-menu dropdown-custom hold-on-click">
                                            <sort-filter :taskcode="task.code"></sort-filter>
                                        </div>
                                    </div>
                                    <button v-on:click="sortFilter" v-else type="button" class=""><i :class="orderSort=='ASC'?'fas fa-sort-alpha-down':'fas fa-sort-alpha-down-alt'" style="font-weight:900; font-size:1.1rem;"></i></button>
                                </li>
                                <li class="minimize-button" v-show="showSearch==false && (!task.components.hasOwnProperty('screenTheme') || task.components.screenTheme == null) && !webpublic">
                                    <button type="button" data-dismiss="modal" v-on:click="vm.minimizeTask()" class=""><i class="la la-compress" style="font-weight:900; font-size:1.1rem;"></i></button>
                                </li>
                                <li class="close-popup-button" v-show="showSearch==false">
                                    <button type="button" data-dismiss="modal" class="" v-on:click="vm.closeTask(task)"><i class="fas fa-times-circle"></i></button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div :class="'modal-body modal-'+task.object.code" style="width: 100%;padding-top:20px !important;overflow: scroll;">     
                    <div class="sk-circle" style="display:none">
                        <div class="sk-circle1 sk-child"></div>
                        <div class="sk-circle2 sk-child"></div>
                        <div class="sk-circle3 sk-child"></div>
                        <div class="sk-circle4 sk-child"></div>
                        <div class="sk-circle5 sk-child"></div>
                        <div class="sk-circle6 sk-child"></div>
                        <div class="sk-circle7 sk-child"></div>
                        <div class="sk-circle8 sk-child"></div>
                        <div class="sk-circle9 sk-child"></div>
                        <div class="sk-circle10 sk-child"></div>
                        <div class="sk-circle11 sk-child"></div>
                        <div class="sk-circle12 sk-child"></div>
                    </div>
                    <div v-for="(object,code2,index2) in task.components.objects" v-if="handleObject(object)" class="autofit_subdetail" style="columns: unset;">
                        <screen  
                            v-for="(screen, code) in object.screens" 
                            :screen="screen" 
                            :object="object" 
                            :task="createTaskVirtual(object)" 
                            checkcompo="true" 
                            :showtab="true" 
                            :skip_object="true">
                        </screen>
                    </div>
                </div>
            </div>  
        </div>
    </div>
</template>