<template id="taskmodal">
    <div :class="'modal-fade '+task.object.code+' '+task.openFromAB" :id="'task-modal-'+task.code" style="display: block !important;">
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
                v-show="task.object.hasOwnProperty('screenTheme') && task.object.screenTheme == 'fullscreen' "
                v-on:click="vm.closeTask(task)"
            >
                <i style="font-size: 20px;" class="fas fa-times-circle"></i>
            </button>  
            <div class="modal-content webapp-popup" style="box-shadow: none; border: none;" :style="getHeightContent()">
                <div v-show="task.object.type!='form' && task.object.type!='fill-form' && task.object.type!='edit-form' && task.object.type!='instance' && (!task.object.hasOwnProperty('screenTheme') || task.object.screenTheme == null)" class="modal-header rta-modal-header-wrapper" style="background-color: #f5f5f5;position: sticky;top: 0;z-index:9999;height: 40px;">
                    <div class="rta-modal-header-new" style="padding:0px 10px;">
                        <div v-show="!showCodeQr && (showSearch==false || vm.previousScreenCode!='')" class="rta-modal-header-div">
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
                        <div v-show="showCodeQr && vm.previousScreenCode==''" class="rta-modal-header-div" style="position:relative;padding-right: 10px;width: 100%;">
                            Code : {{codeQR}}
                            <span @click="closeQR" style="position: absolute; right: 10px; cursor:pointer;"><i class="fas fa-remove"></i></span>
                        </div>
                        <div class="rta-modal-header-div">
                            <ul class="rta-webapp-popup-functional-button" v-show="!showCodeQr">
                                <li v-show="task.object.type=='datamodel' && showSearch==false && vm.previousScreenCode==''">
                                    <div class="btn-group codeQRdisplay" style="display:none;">
                                        <button @click="openCamera" data-toggle="modal" data-target="#qr_scan"  type="button" style="background: transparent; border: none; font-size: 22px; outline: none;">
                                            <img 
                                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA3hJREFUaEPtmlmoTlEUx39XIUqEBxElc+ZZ5qmkzC/KAyXTC4XyQnnzJLcrc8mD5NWUB2V+ICFDvJgKXXR5oEzJ0P92Th27vfc9+5zvfOfSt96+b6+19vqvtYf/3vvU8bf0BZYBq4H2wG+jPfmzDvgFLAUeefR8TROAk5Efn14b4BNwBDgLvI6VFUQsW4DtQNfAYMYBdwJtYvUZwJVA23fATuCw7GIAm4E9gY6krgqMB+5msJXJdOBqRts1wFEB6AM8ADpncFQmAFVipABsBXZnCD42UQVuZ7SfCVzOaCuzFQLwEuhtOHkL3ErhWJNcCXiWQtemMhTYldJ2MtDd0G0QANtKcypaXVL6roraRWC20dMBF4AzwOKqhJW+Ew01Dbmk7K8BSJ/A3Jq1CuROYU4HFavAPm0gjtXrO7AKaHQEq03zGNDW0q75qP1ErMAmFQNwA5jk6OQnMMizLwwBHnsqcQ0QP8oNQIxvkcOROpnmaPsCDAeeO9oHA/cipmtT0Vo/12Er0meCa94HlDVTBGBJKwNwyQVgjCXQj55hUFYFBgCdjFibkueBtItEWQCs8WUBcB2Y6kD7DRBB880BUXfbKiSXGiZz0mZSelkAXACmeCaxjokvHO0DgZueSaylckHRAHoCHSz7QHxG1nn1hyMIZV7U3cbB9J9WsTdFAwjxX7huliFUeFAhHdQAhGSrCN1aBYrIaojPLBUQJe7o6ET3RNoDXMtoO0DXl65+PwOvigYgxujbyMZ6NjJRbV3X6N7VFIHSTjy/aAA+KvEVGNYClbgPqBI2qQqVaHVkTleDogZJ+eC5Mi8LgI6x5v1to8admKMmVlLOAQsdZS4LgK3fgwLwBOhvBOu7mSsLgPNQHwpAdHiiozp5D/VaIPRmYJOKAaiPDu62TnSgWeuhxKLSeiZyHWj0ULKtaAAhy3QldStWgUoGFeKrBiAkW0Xo/r8VeAr0M1J22nMzV0R20/gUT5plKDZfLT6MCFiy7X30f0t0W/R5Q7QZpgnC1BkBNKQw1DveaKCLoVuvADcCe1M4cankeanP+8y6XAB6AaK43TKAKPOhW28Qo+Ihsh449A8BUOJWAieSY3xd9BGFbt5CJM8QyvKxhx7mdwDHFaQ5SXtEM30eICBC6hO1bwK0kmURPYboMwffZz3yq89tdOV4Pjp2NsWd/QGb2PD/1y38gwAAAABJRU5ErkJggg==" 
                                                width="22px" 
                                                height="22px" 
                                                style="margin-top: -4px;" 
                                            />
                                        </button>
                                    </div>
                                    <div class="modal" id="qr_scan" tabindex="-1" role="dialog" aria-hidden="true">
                                            <div class="modal-dialog" style="margin-top: 90px;width:500px">
                                                <div class="modal-content" style="width:500px;margin: 0 auto;">    
                                                    <div class="modal-body">
                                                        <div style="width: 500px;height: 375px;">
                                                            <video :id="classVideo" playsinline width="500px"></video>
                                                            <button @click="stopCamera" style="position: absolute;top: 0;right: 25px;"><i style=" color: #fff;" class="fas fa-remove"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </li>
                                <li v-show="task.object.type=='datamodel' && showSearch==false && vm.previousScreenCode==''" class="search-button">
                                    <div class="btn-group btn-theme-panel searchdisplay" style="display:none;">
                                        <button v-on:click="handleOpenSearch" data-close-others="true" data-toggle="dropdown" type="button" class=""><i class="fas fa-search"></i></button>
                                    </div>
                                </li>
                                <li v-show="task.object.type=='datamodel' && showSearch==false && vm.previousScreenCode==''" class="filter-button">
                                    <div class="btn-group btn-theme-panel filterdisplay" style="display:none;">
                                        <button data-close-others="true" data-toggle="dropdown" type="button" class="" @click="cancelFilterOutSide()"><i class="fas fa-filter"></i><div class="check_filter" style="background-color: orange;width: 10px;height: 10px;position: absolute;top: 14px;left: 20px;border-radius: 50% !important; display:none;"></div></button>
                                        <div style="width: 450px;z-index: 1000;overflow: hidden;right: 0;left: auto;max-height: 80vh;top: 30px;border-radius: 4px !important;box-shadow: 2px 2px 5px 1px #24232347;" class="dropdown-menu dropdown-custom hold-on-click">
                                            <div class="">
                                                <div style="height:50px;padding:16px;display:flex; align-items: center; justify-content: space-between;border-bottom: 1px solid #bdbdbd;">
                                                    <span style="color:#000;font-size:1.3em;font-weight:bold;"><?php echo Yii::t('app','Filter'); ?></span>
                                                    <span style="color:#ff0000;cursor:pointer;font-weight:bold;" @click="reset_filter=!reset_filter"><?php echo Yii::t('app','Reset'); ?></span>
                                                </div>
                                                <div style="overflow: auto;max-height: calc(80vh - 115px);padding-bottom:5px;min-height:250px;">
                                                    <search-option v-if="filter.chart===undefined && filter.table===undefined"
                                                        v-for="(filter, code) in vm.activeListFilters" :key="filter.entries?.length>0?true:false"
                                                        :filter="filter" :reset_filter="reset_filter" :taskcode="task.code" :show_filter="show_filter" :apply_filter="apply_filter" :check_filter="check_filter" :cancel_filter="cancel_filter"
                                                    ></search-option>
                                                </div>
                                                <div style="height:65px;padding:16px;display:flex; align-items: center; justify-content: flex-end;">
                                                    <button type="button" class="btn" @click="cancelFilter()" style ="font-weight:bold; width:100px; height:40px; background:#eee;color:#737373 !important; border:none;border-radius: 4px !important;"><?php echo Yii::t('app','Cancel'); ?></button>    
                                                    <button type="button" class="btn" @click="apply_filter=!apply_filter" style ="font-weight:bold; width:100px; margin-left:10px; height:40px; background:#009688;color:#fff; border:none;border-radius: 4px !important;"><?php echo Yii::t('app','Apply'); ?></button>
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
                                            <div class="dropdown-menu pull-right module_button" style="max-height: 80vh;overflow: auto; border-radius: 4px !important; box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 8px;">
                                                <action-button v-for="(item_button,index) in item_buttons" :key="item_button" :indexsearch="true" :end="index==item_buttons.length-1" :item_button="item_button" :task="task"> </action-button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li class="download-button" v-if="task.object.fileType !== 'rtbox/link'&& downloadDM(task.object) != ''" v-show="showSearch==false">
                                    <button type="button">
                                        <a style="text-decoration: none; color: #fff;" class="fas fa-download" v-bind:href="downloadDM(task.object)" ></a>
                                    </button>
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
                                <li class="minimize-button" v-show="showSearch==false && !webpublic">
                                    <button type="button" data-dismiss="modal" v-on:click="vm.minimizeTask()" class=""><i class="la la-compress" style="font-weight:900; font-size:1.1rem;"></i></button>
                                </li>
                                <li class="close-popup-button" v-show="showSearch==false">
                                    <button type="button" data-dismiss="modal" class="" v-on:click="vm.closeTask(task)"><i class="fas fa-times-circle"></i></button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div :class="'modal-body modal-'+task.object.code" style="padding-top:10px !important;width: 100%;overflow: scroll; scrollbar-width: none;" :style="webpublic?'height:calc(100vh - 40px) !important;':''">     
                <div class="lds-spinner loading-animation-taskmodal" style="overflow:hidden;">
                    <div></div>
                </div>    
                <div class="sk-circle-temp-close" style="display:none">
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
                <rtbox  v-if="task.object.fileType === 'rtbox/link'" :object='task.object'> </rtbox>
                <screen v-else v-for="(screen, code) in task.object.screens" :screen="screen" :object="task.object" :task="task" :refresh_rate="vm.refresh_rate">
                </screen>
                </div>
            </div>
        </div>
    </div>
</template>