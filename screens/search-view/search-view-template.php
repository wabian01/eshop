<template id= 'search-view'>
    <div class="col-md-12" :style="bgColor + 'padding: 0px;height: 100%;overflow: auto;' + leftRightPadding + (vm.newtemplate?'padding:revert-layer':'')" >
        <div style="padding: 0.5em 0em 0.5em 0.5em;" :style="bgSearchBar + searchBarCorner + searchBarShadow + paddingNewInput" class="bootstrap-iso">
            <div class="modal" :id="filterCode" tabindex="-1" data-keyboard="false" data-backdrop="static">
                <div class="modal-dialog" style="margin-top: 90px;width:500px;">
                    <div class="modal-content" style="padding: 30px;border-radius: 10px !important;max-height: 76vh;overflow: scroll;">    
                        <div class="modal-body">
                            <div v-for="(filter,index) in body_area.advanced">
                                <div style="margin-top:5px;background-color: #8080801f;color: gray;padding: 2px 10px;">{{filter.title}}</div>
                                <span v-for="option in filter.suggestion" v-if="filter.suggestion[0]!=='__userinput__'" class="selectValue" :class="(valueAdvace.hasOwnProperty('__advanced_'+index+'__') && ((valueAdvace['__advanced_'+index+'__'].indexOf(option)>-1 && typeof(valueAdvace['__advanced_'+index+'__']) === 'object' ) ||(valueAdvace['__advanced_'+index+'__'] == option && typeof(valueAdvace['__advanced_'+index+'__']) === 'string') ))?'active':''" v-on:click="addFilterAdvance(option.toString(),index,filter)">{{option}}</span>
                                <div v-if="filter.suggestion[0]==='__userinput__'" style="padding:5px;">
                                    <div class="bootstrap-tagsinput" v-if="listinput.hasOwnProperty('__advanced_'+index+'__')">
                                        <span v-for="(html_test) in listinput['__advanced_'+index+'__']" class="badge badge-info" >
                                            <span style="display: flex;align-items: center;width: max-content;">
                                                <span style="display: inherit;max-width: 380px;word-break: break-word;white-space: normal;text-align: left;font-weight:bold;padding:8px;">{{html_test}}</span>
                                                <span v-on:click="removeTag(html_test,index)" class="remove"></span>
                                            </span>
                                        </span>
                                    </div>
                                    <div class="dropdown">
                                        <input class="advancedSeach" data-toggle="dropdown" type="text" v-on:keyup.enter="$event.target.value!==''?checkExist($event.target.value,index,filter):''" v-on:input="searchInput(event,index,filter)">
                                        <ul class="listinput dropdown-menu" v-if="filter.suggestion.length>1">
                                            <li class="listadvancedSeach" v-for="option in filter.suggestion" v-if="option!=='__userinput__' && ( !inputsearch.hasOwnProperty('__advanced_'+index+'__') || inputsearch.hasOwnProperty('__advanced_'+index+'__') && option.toString().indexOf(inputsearch['__advanced_'+index+'__'])>-1)" v-on:click="checkExist(option.toString(),index,filter)">{{option}}</li>
                                        </ul>
                                    </div>       
                                </div>
                            </div>
                            <div style="margin-top:10px;">
                                <button type="button" class="btn btn-danger" @click="applyFilter(true)"><?php echo Yii::t('app','Reset'); ?></button>
                                <button type="button" class="btn btn-success" v-on:click="applyFilter(false)"><?php echo Yii::t('app','Apply'); ?></button>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal" :id="'qrcode-'+filterCode" tabindex="-1" role="dialog" aria-hidden="true">
                <div class="modal-dialog" style="margin-top: 90px;">
                    <div class="modal-content" style="width:500px;margin: 0 auto;">    
                        <div class="modal-body">
                        <div style="width: 500px" :id="'reader-'+filterCode"></div>
                        </div>
                    </div>
                </div>
            </div>
        <div class="dropdown searchviewpublic" :id="'currentSearch' + filterCode" style="
            z-index: 1;
            display: flex;
            /* border: 1px solid rgb(190, 193, 199); */
            box-shadow: none;
            border-radius: 5px !important;
            margin-right: 10px;
            background: #fff;
        ">
            <button type="button" style="background: #fff; border: none; font-size: 1.2rem; display: block; padding-left: 15px; outline: none; border-top-left-radius: 4px !important; border-bottom-left-radius: 4px !important;"><i class="flaticon-search"></i></button>
            <input ref="searchView" @click="checkDropdownOpen" @focus="checkDropdownOpen"  class="dropdown-toggle" data-toggle="dropdown" style="color: black !important;height:32px;padding-right: 10px;border: none;width: 100%;outline: none; border-top-right-radius: 4px !important; border-bottom-right-radius: 4px !important;" v-on:keyup="searchDataV1" type="text" :placeholder="hint">
            <div style="display:flex; background: #fff; border-top-right-radius: 4px !important; border-bottom-right-radius: 4px !important;">
                <span v-show="value!==''" v-on:click="remove()" class="searchView" style="cursor: pointer;
                color: rgb(140, 140, 140) !important;
                font-size: 24px;padding-right: 14px;"></span>
                <div v-if="showQR">
                    <button v-on:click="turnOnCamera" data-toggle="modal" :data-target="'#qrcode-'+filterCode" type="button" style="background: transparent; border: none; font-size: 22px; outline: none;">
                        <img 
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA3hJREFUaEPtmlmoTlEUx39XIUqEBxElc+ZZ5qmkzC/KAyXTC4XyQnnzJLcrc8mD5NWUB2V+ICFDvJgKXXR5oEzJ0P92Th27vfc9+5zvfOfSt96+b6+19vqvtYf/3vvU8bf0BZYBq4H2wG+jPfmzDvgFLAUeefR8TROAk5Efn14b4BNwBDgLvI6VFUQsW4DtQNfAYMYBdwJtYvUZwJVA23fATuCw7GIAm4E9gY6krgqMB+5msJXJdOBqRts1wFEB6AM8ADpncFQmAFVipABsBXZnCD42UQVuZ7SfCVzOaCuzFQLwEuhtOHkL3ErhWJNcCXiWQtemMhTYldJ2MtDd0G0QANtKcypaXVL6roraRWC20dMBF4AzwOKqhJW+Ew01Dbmk7K8BSJ/A3Jq1CuROYU4HFavAPm0gjtXrO7AKaHQEq03zGNDW0q75qP1ErMAmFQNwA5jk6OQnMMizLwwBHnsqcQ0QP8oNQIxvkcOROpnmaPsCDAeeO9oHA/cipmtT0Vo/12Er0meCa94HlDVTBGBJKwNwyQVgjCXQj55hUFYFBgCdjFibkueBtItEWQCs8WUBcB2Y6kD7DRBB880BUXfbKiSXGiZz0mZSelkAXACmeCaxjokvHO0DgZueSaylckHRAHoCHSz7QHxG1nn1hyMIZV7U3cbB9J9WsTdFAwjxX7huliFUeFAhHdQAhGSrCN1aBYrIaojPLBUQJe7o6ET3RNoDXMtoO0DXl65+PwOvigYgxujbyMZ6NjJRbV3X6N7VFIHSTjy/aAA+KvEVGNYClbgPqBI2qQqVaHVkTleDogZJ+eC5Mi8LgI6x5v1to8admKMmVlLOAQsdZS4LgK3fgwLwBOhvBOu7mSsLgPNQHwpAdHiiozp5D/VaIPRmYJOKAaiPDu62TnSgWeuhxKLSeiZyHWj0ULKtaAAhy3QldStWgUoGFeKrBiAkW0Xo/r8VeAr0M1J22nMzV0R20/gUT5plKDZfLT6MCFiy7X30f0t0W/R5Q7QZpgnC1BkBNKQw1DveaKCLoVuvADcCe1M4cankeanP+8y6XAB6AaK43TKAKPOhW28Qo+Ihsh449A8BUOJWAieSY3xd9BGFbt5CJM8QyvKxhx7mdwDHFaQ5SXtEM30eICBC6hO1bwK0kmURPYboMwffZz3yq89tdOV4Pjp2NsWd/QGb2PD/1y38gwAAAABJRU5ErkJggg==" 
                            width="22px" 
                            height="22px" 
                            style="margin-top: -4px;" 
                        />
                    </button>
                </div>
                <div v-if="searchAdvance && valuecheck.length>2">
                    <button data-toggle="modal" :data-target="'#'+filterCode" type="button" style="background: transparent;
                        border: none;
                        font-size: 22px;
                        outline: none;
                        position: relative;"
                    >
                        <i class="fas fa-filter"></i>
                        <i v-show='Object.keys(valueAdvace).length>0' class="fas fa-circle" style="
                            position: absolute;
                            top: 4px;
                            right: 5px;
                            color: orange;
                            font-size: 10px;">
                        </i>
                    </button>   
                </div>
            </div>
            <div class="dropdown-menu hold-on-click dropdown-custom" style="overflow: auto;box-shadow: #33323238 0px 5px 5px;width: 100%;margin-top: 0;">
                <div style="display: flex;align-items: center;justify-content: space-between;padding: 16px;">
                    <span style="font-weight:bold;color:#737373 !important;"><?php echo Yii::t('app','RECENTSEARCH'); ?></span>
                    <span v-if="currentSearch.length > 0" v-on:click="deleteAllItem" style="cursor:pointer;color:#007aff !important;"><?php echo Yii::t('app','Clearall'); ?></span>
                </div>
                <div class="currentSearchItemWrap" style="max-height:330px;overflow:auto;">
                    <div v-if="topSearches !== '' && topSearches !== currentSearch[0]" class="currentSearchItem" style="display:flex; align-items:center; justify-content:space-between; color:#737373 !important;">
                        <span v-on:click="seletedItem(topSearches)" style="flex-grow:1; cursor:pointer; padding:10px 16px;color:#737373 !important;"><i class="fas fa-history" style="margin-right:8px;"></i> {{topSearches}}</span> 
                        <span v-on:click="topSearches = ''" style="cursor:pointer; padding:10px 16px;color:#737373 !important;"><i class="la la-times"></i></span>
                    </div>

                    <div v-for="item in (showMore ? currentSearch.slice(0,5) : currentSearch)" v-if="currentSearch.length > 0" class="currentSearchItem" style="display: flex;align-items: center;justify-content: space-between;color:#737373 !important;">
                        <span  v-on:click="seletedItem(item)" style="flex-grow:1;cursor:pointer;padding: 10px 16px;color:#737373 !important;"><i class="fas fa-history" style="margin-right: 8px;"></i> {{item}}</span>
                        <span v-on:click="deleteItem(item)" style="cursor:pointer;padding: 10px 16px;color:#737373 !important;"><i class="la la-times"></i></span>
                    </div>
                </div>
                <div v-if="currentSearch.length > 5" style="display: flex;align-items: center;justify-content: center;padding: 8px;">
                    <span v-on:click="showMore = !showMore" style="cursor:pointer;color:#007aff !important;">{{showMore ? '<?php echo Yii::t('app','Showmore'); ?>' : '<?php echo Yii::t('app','Showless'); ?>'}}</span>
                </div>
                <div v-if="currentSearch.length == 0 && dataSave.length == 0" style="display: flex;align-items: center;justify-content: center;padding: 8px;color:#737373;">
                        <span style="color:#737373 !important;"><?php echo Yii::t('app','Norecentkeywords'); ?></span>
                </div>
                <div v-if="currentSearch.length == 0 && dataSave.length != 0" style="display: flex;align-items: center;justify-content: center;padding: 8px;color:#737373;">
                        <span style="color:#737373 !important;"><?php echo Yii::t('app','Norecentkeywordsmatch'); ?></span>
                </div>
            </div>
        </div>
    </div>
    
    <div style="padding-top:5px;" v-if="Object.keys(quickfilter).length>0 && quickfilter.hasOwnProperty('entries') && value!==''" :object="object" :list_items='list_items' class="bootstrap-iso">
        <div v-if="quickfilter.entries[0]!=='__daterange__' && quickfilter.entries[0]!=='__date__' && quickfilter.entries[0]!=='__daterecent__' && quickfilter.entries[0]!=='__datelast__'" class="scroll-quicksearch" style="margin-bottom: 10px;white-space: nowrap;overflow: auto;text-align: right;">
            <span v-for="(option) in quickfilter.entries"  v-if=" option!=null" v-on:click="checkExistQuick(option.toString())" v-bind:class="{quicksearch:true,changecolor:true,active:(valueQuick.hasOwnProperty('__quick__') && valueQuick['__quick__'].indexOf(option.toString())>-1) }">
            {{ option }}
            </span>
        </div>
    </div>

    <!-- icon of dynamic_style -->
    <div class="icons-searchView-container" v-if="dynamicTemplate">
        <span class="i-general" :class=" typeSelected === 'article' ? 'i-active' : '' " @click="switchType('article')">
            <img src='https://cdn.rtworkspace.com/plugins/webapp/images/article-icon.svg' />
        </span>
        <span class="i-general" :class=" typeSelected === 'gallery2' ? 'i-active' : '' " @click="switchType('gallery2')">
            <img src='https://cdn.rtworkspace.com/plugins/webapp/images/gallery2-icon.svg' />
        </span>
        <span class="i-general" :class=" typeSelected === 'gallery' ? 'i-active' : '' " @click="switchType('gallery')">
            <img style="height: 18px;" src='https://cdn.rtworkspace.com/plugins/webapp/images/gallery-icon.webp' />
        </span>
    </div>
    <div v-if="listJS" :style="heightrow">
        <iframe :srcdoc="notfound" marginheight="0" marginwidth="0" frameborder="0" style="height: 100%;width: 100%;transition:0.5s;" @load="checkIframe" scrolling="no"></iframe>
    </div>
    <div 
        v-else
        :style="(heightrow != '' && heightrow != null && heightrow != undefined) ? heightrow : ''" 
        style="display:flex;text-align: -webkit-center;justify-content:center; align-items: center; overflow: scroll;"
        v-show="notfound!=''" >
            <div style="margin: auto;" v-html="notfound"></div>
    </div>
    <template v-if="re_render_tem">
        <div :style="(list_items.length>0?'max-height: 100%;'+heightrow:(notfound==='')?heightrow:'') + paddingNewItem" style="padding-left: 0.5em;padding-right: 0.6em;overflow: scroll;" v-if='notfound===""' v-on:scroll="handleScrollListView">
            <list-item  v-for="(list_item,index) in list_items" :indexsearch="list_items.length-1==index" :screen_item="body_area_temp" :list_item="list_item" :object="object" :task="task"  :position='index'></list-item>
        </div>
    </template>
    </div>
</template>