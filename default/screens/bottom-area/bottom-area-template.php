<template id= 'bottom-area'>
    <div :class="'col-md-12 bottom_area-'+screen.code" >
        <html-view
                v-if="bottom_area.type=='htmlView'"
                :body_area="bottom_area" :object="object"
                :item_data="vm.activeItemData" :task="task" :json_holder="vm.jsonHolder"
                :status_ref="status_ref"
                :list_data_object="list_data_object"
                :bottom_area_code='object.code'
        >
        </html-view>
        <button-group v-if="bottom_area.type=='buttonGroup'" :refresh_rate="vm.refresh_rate" :status_ref="status_ref" :body_area="bottom_area" :object="object" :task="task" :item_data="vm.activeItemData" :json_holder="vm.jsonHolder" :list_data_object="list_data_object"> </button-group>
        <lite-form
                v-if="bottom_area.type=='liteform'"
                :body_area='bottom_area'
                :object='object'
                :task='task'
                :item_data="vm.activeItemData"
        >
        </lite-form>
        <audio-view
                v-if="bottom_area.type=='audioView'"
                :screen_item="bottom_area" :id_random="id_random" :task="task"  :object="object"
                :list_data_object="list_data_object"
        >
        </audio-view>
        <video-view
                v-if="bottom_area.type=='videoView'"
                :screen_item="bottom_area" :id_random="id_random"
                :task="task" :object="object"
                :list_data_object="list_data_object"
        >
        </video-view>
    </div>
</template>