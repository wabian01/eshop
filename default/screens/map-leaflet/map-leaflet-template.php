<template id= "map-leaflet">
    <div class="parents-map-leaflet">
        <quick-filter style="z-index:999;" v-if="Object.keys(quickfilter).length>0 && quickfilter.hasOwnProperty('entries') && Object.keys(dataStore).length>0 && startfilter" :object="object" :quickfilter="quickfilter" :list_items='dataStore' @filter_chartview="filterMapview"></quick-filter>
        <div :id='id_random' style=" position: absolute; min-width:800px;max-width:10000x;height:calc(100% + 10px);top: -10px" ></div>
        <select style="position: fixed; z-index: 9999;border: 0px;left: 50%;transform: translateX(-50%);" id="map-navigation" multiple>
            <option style="width: 350px;"v-for="(search,index) in searchs" class="list-group-item" :data-longitude="search[longitude]"  :data-latitude="search[latitude]">{{search[tilte]}}</option>        
        </select>
        <div v-show="showContent" class="showPopup collapsible-content" :class="id_random" style="width:100%;position: absolute;bottom: 0;z-index: 9999999;background-color:white; padding: 10px;">
            <div style="position: sticky;top: 0px;background-color: #fff;">
                <button v-if="stateButton" class="buttonmap" type="button" v-on:click="extendPopup()"><i class="fas fa-angle-up"></i></button>
                <button v-else class="buttonmap" type="button" v-on:click="narrowPopup()"><i class="fas fa-angle-down"></i></button>
            </div>
            <div class="content">content</div>
            <div style="display: flex; overflow-x: scroll; max-width: 100%; scrollbar-width: none; height: 50px;">
                <action-button v-for="(item_button,index) in item_buttons" :key="item_buttons" :indexsearch="true" :end="index==item_buttons.length-1" :list_item="list_item" :item_button="item_button" :task="task" :button_description="button_description" > </action-button>
            </div>        
        </div>    
    </div>
</template>