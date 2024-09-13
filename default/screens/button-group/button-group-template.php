<template id='button-group'>
    <div style="height: 100%" v-show="showButton" :style="bgColor">
        <div style="display:grid" :id='id_random'>
            <div v-if="!body_area.hasOwnProperty('orientation') || body_area.hasOwnProperty('orientation') && body_area.orientation == 'horizontal'" class="scrollAB">
                <action-button v-for="(item_button,index) in body_area_temp.buttons" :list_item="list_item" :key="item_button" :indexsearch="true" :end="index==body_area_temp.buttons.length-1" :item_button="item_button" :task="task" :body_area="body_area_temp" :id_random='id_random' :tracking_id = "vm.tracking_id_button"> </action-button>
            </div>
            <action-button v-else v-for="(item_button,index) in body_area_temp.buttons" :list_item="list_item" :key="item_button" :indexsearch="true" :end="index==body_area_temp.buttons.length-1" :item_button="item_button" :task="task" :body_area="body_area_temp" :id_random='id_random' :tracking_id = "vm.tracking_id_button"> </action-button>
        </div>
    </div>
</template>