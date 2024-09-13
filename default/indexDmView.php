<?php 
    $view = "indexDmView";
    include __DIR__ . '/appLoader.php';
    include __DIR__ . '/utils/common/style.php';
?>
<script>
    let module_view = 'rtcloud_webapp_modules_public',
        module_power_view = 'rtcloud_webapp_module_power_public';
</script>


<!-- BEGIN::Flowbite modal -->
<div id="popup-modal" data-modal-placement="center" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 md:inset-0 h-modal md:h-full">
    <div id="popup-modal--container" class="relative p-4 w-full max-w-lg h-full md:h-auto">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <button id="popup-modal--header" type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                <span class="sr-only">Close modal</span>
            </button>
            <!-- Modal body -->
            <div id="popup-modal--body" class="p-6 text-center">
                <!-- Modal body::Icons -->
                <svg aria-hidden="true" class="mx-auto mb-4 w-14 h-14 text-blue-400 popup-icon info" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <svg aria-hidden="true" class="mx-auto mb-4 w-14 h-14 text-yellow-400 popup-icon warning" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="display: none;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <svg aria-hidden="true" class="mx-auto mb-4 w-14 h-14 text-red-400 popup-icon danger" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="display: none;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <!-- Modal body::Message -->
                <h3 class="mb-5 text-lg font-normal text-gray-900"></h3>
                <!-- Modal body::Buttons -->
            </div>
        </div>
    </div>
</div>
<!-- END::Flowbite modal -->

<?php include __DIR__ . '/utils/common/appCore.php';?>

<div id="app">
    <div class="bootstrap-iso" style="max-width: 800px;margin:auto;">
        <div v-for="(task, code) in tasks" v-show="activeTaskCode === task.code">
            <div is="component-tab" v-if="task.hasOwnProperty('components')" :task="task" :webpublic="true"></div>
            <div is="taskmodal" v-else :task="task" :webpublic="true"></div>
        </div>
        <div class="modal fade" id="multiObject" tabindex="-1">
                <div class="modal-dialog" style="margin-top: 90px;">
                    <div class="modal-content" style="padding: 30px;border-radius: 10px !important;max-height: 76vh;overflow: scroll;">    
                        <div class="modal-body">
                         <div v-for="object in multiObject">
                            <div class="card-image" style="display: flex;justify-content: center;margin-bottom: 20px;cursor: pointer;" v-on:click='openMultiObjectAB(object)'>
                                <img :src="object.background" style=" width: 270px;height: 90px;align-self: center;">
                                <div class="card" style="color: black;-height: 100%;float: right;padding-left: 22px;width: 100%;">
                                    <div class="card-title" style="text-transform: uppercase;font-size: 30px;text-align: left;font-weight: bold;padding-top: 20px;">{{vm.funcReplaceTitleAndName(object.title)}}</div>
                                    <div class="card-desc" style="padding-top: 10px;text-align: left;font-size: 18px;">
                                    trong <a href="javascript:;" style="text-decoration: none;text-transform: uppercase;">{{vm.funcReplaceTitleAndName(object.nameModule)}}</a>
                                    </div>
                                </div>
                            </div>
                         </div>
                        </div>
                    </div>
                </div>
        </div>
    </div>
        <div  class="bootstrap-iso" style="height: 100%;z-index: 9;background: white;max-width: 800px;margin:auto;"> 
    <!-- object code -->
    <action-button ref="actionbuttonCP" :task="taskCP" ></action-button>            
    <action-button ref="callAB" :task="taskcallAB" ></action-button>    
    <action-button ref="callABForm" :task="taskcallAB" :list_item="jsonDataParent" ></action-button>
    <div class="autofit_subdetail" v-show="statusPopup" v-if="typeUIPublic=='objectcode'" style="columns: unset;display:none;background-color:#f5f5f5e6;"  :id="objectTest.componentCode">
        <div v-if="stateTitle" class="new-header" style="min-height: 35px;height: 35px;padding:6px;position: sticky;top: 0px;background-color: #f5f5f5e6;z-index: 10;border-bottom: 1px solid rgb(230, 222, 222);">
            <div style="display: flex;float: right;" v-show="previousScreenCode==''">
                <div  style="margin: auto;display: flex;position:relative;padding: 0px 10px 0px 16px;" class="searchContent" v-show="showSearchInput">
                    <span style="color:#bdbdbd;position:absolute;left:25px;top:3px;font-size:0.9em;"><i class="fa fa-search"></i></span>
                    <input v-on:input="handleSearchCom" ref="searchInput" type="text" class="rta-search-com" style="width: 250px;;height:25px;color: #737373;padding: 0px 30px;border: 1px solid #bdbdbd;border-radius: 20px !important;font-size:0,9em;" placeholder="Search" style="color: white;background-color: #009688;border: none;"/>
                    <span v-show="itemSearchString!=''"  style="color:#737373;position:absolute;right:20px;top:2px;cursor:pointer;" @click="clearSearch()"><i class="la la-times" style="font-size: 0.9em;font-weight: bold;"></i></span>
                </div>
                <div class="searchdisplay" style="display:none;">
                    <button v-on:click="currentCom"  style="background: transparent;border: none;color: #737373;font-size: 1rem;display: block;padding: 0.1rem 0.4rem;outline: none;" type="button" class=""><i  class="fa fa-search"></i></button>
                </div>
                <div class="btn-group btn-theme-panel filterdisplay" style="margin-top:0;display:none;" >
                    <button  data-close-others="true" data-toggle="dropdown" type="button" style="background: transparent;border: none;color: #ffffff;font-size: 1rem;display: block;padding: 0.1rem 0.4rem;outline: none;" class=""><i style="color: #737373;font-weight: 600;" class="la la-filter"></i><div class="check_filter" style="background-color: orange;width: 10px;height: 10px;position: absolute;top: 2px;left: 19px;border-radius: 50% !important; display:none;"></div></button>
                    <div 
                        class="filter-public dropdown-menu dropdown-custom hold-on-click"
                        style="
                            z-index: 1000;
                            overflow: hidden;
                            right: 0;
                            left: auto;
                            max-height: 80vh;
                            top: 30px;
                            border-radius: 4px !important;
                            box-shadow: 2px 2px 5px 1px #24232347;
                        "  
                    >
                        <div class="">
                            <div style="height:50px;padding:16px;display:flex; align-items: center; justify-content: space-between;border-bottom: 1px solid #bdbdbd;">
                                <span style="color:#000;font-size:1.3em;font-weight:bold;"><?php echo Yii::t('app','Filter'); ?></span>
                                <span style="color:#ff0000;cursor:pointer;font-weight:bold;" @click="reset_filter=!reset_filter"><?php echo Yii::t('app','Reset'); ?></span>
                            </div>
                            <div style="overflow: auto;max-height: calc(80vh - 115px);padding-bottom: 5px; min-height:250px;"> 
                                <search-option v-if="filter.chart===undefined && filter.table===undefined"
                                        v-for="(filter, code) in activeListFilters"
                                        :filter="filter" :reset_filter="reset_filter" :taskcode="9999" :key="activeListFilters" :show_all_object="true" :show_filter="show_filter" :apply_filter="apply_filter"
                                ></search-option>
                            </div>
                            <div style="height:65px;padding:16px;display:flex; align-items: center; justify-content: flex-end;">
                                <button type="button" class="btn" @click="hideFilter()" style ="font-weight:bold; width:100px; height:40px; background:#eee;color:#737373 !important; border:none;border-radius: 4px !important;"><?php echo Yii::t('app','Cancel'); ?></button>    
                                <button type="button" class="btn" @click="apply_filter=!apply_filter" style ="font-weight:bold; width:100px; margin-left:10px; height:40px; background:#009688;color:#fff; border:none;border-radius: 4px !important;"><?php echo Yii::t('app','Apply'); ?></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <span  v-if="previousScreenCode!=''"><i style="color:#737373;padding: 7px; cursor: pointer;" class="fas fa-arrow-left" v-on:click="actionBacktoScreen(objectTest.subModuleCode)" ></i></span>
                <span v-if="previousScreenCode==''" style="color: #009688; font-weight:600;text-transform: uppercase;" v-html="vm.funcReplaceTitleAndName(objectTest.title)"></span>
                <span v-if="previousScreenCode!=''" style="text-transform: uppercase;color: #009688;font-weight: 600;" v-html="vm.funcReplaceTitleAndName(titleSkipObject)"></span>
            </div>
        </div>
        <!-- end test -->
            <div :style="stateTitle?'height:94vh;':'height:100vh;'" style="overflow: auto;width:100%;">
                <div style="height:calc(100vh - 50px);padding-top:10px;position: relative">
                    <div class="lds-spinner loading-animation" style="display:none;position: absolute;height: 5px;top: 0px;left: -30px;transform: none;"><div></div></div>
                    <screen v-if="Object.keys(objectTest).length>0"  v-for="(screen, code) in objectTest.screens" :screen="screen" :object="objectTest" :task="taskTest">
                    </screen>
                </div>
            </div>
        </div>
    <!-- end object code  -->

    <div class="autofit_subdetail" v-show="statusPopup" v-if="typeUIPublic=='submodulecode'" >
        <div v-for="(submodule, code,index) in filterHiddenSubmodules(subModules)"  v-if="activeColumn==-1 || activeColumn== index " class="item">
            <submodule-detail-public v-if="level == 2 && (submodule.code == activeSubModuleCode || (activeSubModuleCode=='all' && activeModuleCode == submodule.moduleCode))  && submodule.filtered_visible " :submodule="submodule" :key="submodule.code" :components="components" :objects="objects"
            ></submodule-detail-public>
        </div>
    </div>
    <!-- component content -->
  
    <div class="autofit_subdetail" v-show="statusPopup" v-if="typeUIPublic=='componentcode'" style="columns: unset;background-color:#f5f5f5e6;" :id="componentPublic.code">
        <div v-if="stateTitle" class="new-header" style="min-height: 35px;height: 35px;padding:6px;position: sticky;top: 0px;background-color: #f5f5f5;z-index: 10;border-bottom: 1px solid rgb(230, 222, 222);display:none;" v-show="level==2">
            <div style="display: flex;float: right;" v-show="previousScreenCode==''">
                <div  style="margin: auto;display: flex;position:relative;padding: 0px 10px 0px 16px;" class="searchContent" v-show="showSearchInput">
                    <span style="color:#bdbdbd;position:absolute;left:25px;top:3px;font-size:0.9em;"><i class="fa fa-search"></i></span>
                    <input v-on:input="handleSearchCom" ref="searchInput" type="text" class="rta-search-com" style="width: 250px;;height:25px;color: #737373;padding: 0px 30px;border: 1px solid #bdbdbd;border-radius: 20px !important;font-size:0,9em;" placeholder="Search" style="color: white;background-color: #009688;border: none;"/>
                    <span v-show="itemSearchString!=''"  style="color:#737373;position:absolute;right:20px;top:2px;cursor:pointer;" @click="clearSearch()"><i class="la la-times" style="font-size: 0.9em;font-weight: bold;"></i></span>
                </div>
                <div class="searchdisplay" style="display:none;">
                    <button v-on:click="currentCom"  style="background: transparent;border: none;color: #737373;font-size: 1rem;display: block;padding: 0.1rem 0.4rem;outline: none;" type="button" class=""><i  class="fa fa-search"></i></button>
                </div>
                <div class="btn-group btn-theme-panel filterdisplay" style="margin-top:0;display:none;" >
                    <button  data-close-others="true" data-toggle="dropdown" type="button" style="background: transparent;border: none;color: #ffffff;font-size: 1rem;display: block;padding: 0.1rem 0.4rem;outline: none;" class=""><i style="color: #737373;font-weight: 600;" class="la la-filter"></i><div class="check_filter" style="background-color: orange;width: 10px;height: 10px;position: absolute;top: 2px;left: 19px;border-radius: 50% !important; display:none;"></div></button>
                    <div 
                        class="filter-public dropdown-menu dropdown-custom hold-on-click"
                        style="
                            z-index: 1000;
                            overflow: hidden;
                            right: 0;
                            left: auto;
                            max-height: 80vh;
                            top: 30px;
                            border-radius: 4px !important;
                            box-shadow: 2px 2px 5px 1px #24232347;
                        "   
                    >
                        <div class="">
                            <div style="height:50px;padding:16px;display:flex; align-items: center; justify-content: space-between;border-bottom: 1px solid #bdbdbd;">
                                <span style="color:#000;font-size:1.3em;font-weight:bold;"><?php echo Yii::t('app','Filter'); ?></span>
                                <span style="color:#ff0000;cursor:pointer;font-weight:bold;" @click="reset_filter=!reset_filter"><?php echo Yii::t('app','Reset'); ?></span>
                            </div>
                            <div style="overflow: auto;max-height: calc(80vh - 115px);padding-bottom: 5px; min-height:250px;"> 
                                <search-option v-if="filter.chart===undefined && filter.table===undefined"
                                        v-for="(filter, code) in activeListFilters"
                                        :filter="filter" :reset_filter="reset_filter" :taskcode="9999" :key="activeListFilters" :show_all_object="true" :show_filter="show_filter" :apply_filter="apply_filter"
                                ></search-option>
                            </div>
                            <div style="height:65px;padding:16px;display:flex; align-items: center; justify-content: flex-end;">
                                <button type="button" class="btn" @click="hideFilter()" style ="font-weight:bold; width:100px; height:40px; background:#eee;color:#737373 !important; border:none;border-radius: 4px !important;"><?php echo Yii::t('app','Cancel'); ?></button>    
                                <button type="button" class="btn" @click="apply_filter=!apply_filter" style ="font-weight:bold; width:100px; margin-left:10px; height:40px; background:#009688;color:#fff; border:none;border-radius: 4px !important;"><?php echo Yii::t('app','Apply'); ?></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="display:none;" v-show="level==2">
                <span  v-if="vm.activeScreenSub.indexOf(componentPublic.subModuleCode) >-1"><i style="color:#737373;padding: 7px;" class="fas fa-arrow-left" v-on:click="actionBacktoScreen(componentPublic.subModuleCode)" ></i></span>
                <span v-if="vm.activeScreenSub.indexOf(componentPublic.subModuleCode) <0" style="color: #009688; font-weight:600;text-transform: uppercase;" v-html="componentPublic.name !== '' ? vm.funcReplaceTitleAndName(componentPublic.name) : vm.funcReplaceTitleAndName(componentPublic.submoduleTitle)"></span>
                <span v-if="vm.activeScreenSub.indexOf(componentPublic.subModuleCode) >-1" style="text-transform: uppercase;color: #009688;font-weight: 600;" v-html="vm.funcReplaceTitleAndName(titleSkipObject)"></span>
            </div>
            <div>
            
            </div>
        </div>
        <div style="height:calc(100vh - 35px);overflow: auto;">
            <div  v-if="checkQuickView(componentPublic)" :showtab="true" :show_all_object="true" is="component-content" :component="componentPublic" :key='componentPublic'></div>
            <div v-else  is="component-detail" :component="componentPublic" :objects="componentPublic.objects" ></div>
        </div>   
    </div>
</div>

<?php 
    include __DIR__ . '/worker.php';
?>
