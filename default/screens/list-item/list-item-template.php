<template id="list-item">
    <div  class="col-md-12" :class="vm.newtemplate?'':'container'" :style="divkit || when_empty? (divkit ? wrapColumnStyle : ''): shadow_item + wrapColumnStyle">
        <div v-html="notfound" class="text-center bootstrap-iso" style="text-align: -webkit-center !important;"></div>
        <div v-if="listJS" :style="heightrow + height_empty" >
            <iframe :id='classRandom' :srcdoc="item_content" marginheight="0" marginwidth="0" frameborder="0" style="height: 100%;width: 100%;transition:0.5s;" @load="checkIframe" scrolling="no"></iframe>
        </div>
        <div v-on:click="handleClickDiv" v-else-if="divkit" :id="'root-'+classRandom" ></div>
        <div 
            :style="vm.newtemplate ? '' :'padding:0 10px 0 10px;'" :style="heightrow"
            class="row" 
            v-else-if="!listJS && !divkit" 
            v-on:dblclick="handleClick"
            v-html="item_content"
            @mousedown.left="mouseDown"
            @mouseup.left='mouseUp'
            ref="container">
        </div>
        <i v-if="phoneNum != '' && typeof makeCall === 'function'" class= "fa fa-phone" style="font-size: xx-large;color: #009688;float: right; margin-top: -46px; cursor: pointer;" v-on:click="callContact" > </i>
        <i v-if="phoneNum === false && typeof makeCall === 'function'" class= "fa fa-phone" style="font-size: xx-large;color: #bdbdbd;float: right; margin-top: -46px; cursor: not-allowed;"> </i>
        <action-button ref="actionbutton1" :task="task" :list_item="list_item"></action-button>
        <div style="display: flex;flex-wrap: nowrap;">
            <div class="scrollAB" style="padding: 4px;" v-show="item_buttons.length>0">
                <action-button ref="actionbutton" :end="index==item_buttons.length-1" :key="item_buttons" :indexsearch="true" v-for="(item_button,index) in item_buttons" :item_button="item_button" :list_item="list_item" :task="task" :button_description="button_description" :position="position" :tracking_id="vm.tracking_id_button"></action-button>
                <span id="loading-ac" :class="classRandom" >
            </div>
            <div class="dropdown dropdown_overflow" style="float:right;" v-show="overflow_menu.length > 0">
                <div v-if="stateOverflow" id="dropdownMenuButton" class="rta-dropdown-action-button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style="width: 35px;height: 35px;display: flex;align-items: center;justify-content: center;margin: 0 5px 0 20px;border-radius: 50% !important;">
                    <i class="fas fa-ellipsis-v"></i>
                </div>
                <div class="dropdown-menu pull-right rta-dropdown-action-button-li " aria-labelledby="dropdownMenuButton" style="overflow:auto;margin: 0 5px 0 0;border-radius:4px !important;box-shadow: #0000001a 3px 3px 5px;padding:4px 0;width:fit-content;max-height:215px; overflow: auto;">
                    <li v-for="(item_button,index) in overflow_menu" style="background: #fff;padding:4px;">
                        <action-button ref="actionbutton" :item_button="item_button" :key="overflow_menu" :list_item="list_item" :task="task" :overflow_menu="'overflow_menu'"  :position="position"></action-button>
                    </li>
                </div>
            </div>
        </div>   
        <div>
            <lite-form
                v-if="screen_item.hasOwnProperty('item_liteform') && list_item!=='notfound'"
                :body_area='screen_item.item_liteform'
                :object='object'
                :task='task'
                :list_item='list_item'
            >
            </lite-form>
        </div>
        </span>
    </div>
</template>