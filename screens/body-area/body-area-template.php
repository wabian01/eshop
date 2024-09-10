<template id="body-area">
    <div 
        style="background-color: #fff;"
        class="row" 
        :id="id_random"
        :style="
                ((body_area.type == 'searchView') 
                ? height_searchView + nonehide_view
                : (body_area.type == 'blankView') 
                        ? height_blankView + nonehide_view + bgColor_blankView
                        : '' + nonehide_view) + (vm.newtemplate ? 'background-color: transparent !important;' : '')
        ">
        <calendar-view
                v-if="body_area.type=='calendarView' && !skip_object"
                :object="object" :body_area="body_area" :task="task" :id_random="id_random"
                :list_data_object="list_data_object"
        >

        </calendar-view>

        <html-view
                v-if="body_area.type=='htmlView'"
                :body_area="body_area" :object="object"
                :item_data="vm.activeItemData" :task="task" :json_holder="vm.jsonHolder"
                :status_ref="status_ref"
                :list_data_object="list_data_object"
                :update_theme_css="vm.updateThemeCss"
        >
        </html-view>
        <divkit-view
                v-if="body_area.type=='adaptiveCardView' || body_area.type=='divkitView'"
                :body_area="body_area" :object="object"
                :item_data="vm.activeItemData" :task="task" :json_holder="vm.jsonHolder"
                :status_ref="status_ref"
                :list_data_object="list_data_object"
        >
        </divkit-view>
        <html-cloudphone
                v-if="body_area.type=='htmlCloudphone'"
                :screen_item="body_area" :object="object"
                :item_data="vm.activeItemData" :task="task"
        >
        </html-cloudphone>
        <video-view
                v-if="body_area.type=='videoView'"
                :screen_item="body_area" :id_random="id_random"
                :task="task" :object="object"
                :list_data_object="list_data_object"
        >
        </video-view>
        
        <audio-view
                v-if="body_area.type=='audioView'"
                :screen_item="body_area" :id_random="id_random" :task="task"  :object="object"
                :list_data_object="list_data_object"
        >
        </audio-view>

        <list-view
                v-if="body_area.type=='listView' || body_area.type=='gridView'"
                :body_area="body_area" :object="object"
                :item_search_string="vm.itemSearchString" :item_filter_attributes="vm.itemFilterAttributes"
                :screen="screen"
                :task="task"
                :refresh_rate="vm.refresh_rate"
                :status_ref="status_ref"
                :status_sort="vm.stateSortFilter"
                :json_holder="vm.jsonHolder"
                :list_data_object="list_data_object"
        >
        </list-view>
        <slider-view
                v-if="body_area.type=='sliderView'"
                :body_area="body_area" :object="object"
                :screen="screen"
                :task="task"
                :list_data_object="list_data_object"
        >
        </slider-view>
        <template v-if="re_render_searchview">
                <search-view
                        v-if="body_area.type=='searchView'"
                        :body_area="body_area" :object="object"
                        :screen="screen"
                        :task="task"
                >
                </search-view>
        </template>
        <lite-form
                v-if="body_area.type=='liteform'"
                :body_area='body_area'
                :object='object'
                :task='task'
                :item_data="vm.activeItemData"
        >
        </lite-form>
        <template v-if="re_render_map">
                <map-view
                        v-if="body_area.type=='mapView' && !skip_object"
                        :object="object" :body_area="body_area" :item_search_string="vm.itemSearchString" :task="task"
                        :list_data_object="list_data_object"
                        :item_filter_attributes="vm.itemFilterAttributes"
                >
                </map-view>
        </template>
        <timeline-view
                v-if="body_area.type=='timelineView'"
                :screen_item="body_area" :object="object" :task="task"
                :list_data_object="list_data_object"
        >
        </timeline-view>

        <chart-view
                v-if="body_area.type=='chartView'" :skip_object="skip_object"
                :list_data_object="list_data_object"
                :body_area="body_area" :object="object" :task="task" :item_filter_attributes="vm.itemFilterAttributes" :refresh_rate="vm.refresh_rate" :status_ref="status_ref"
        >
        </chart-view>
        <table-view v-if="body_area.type=='tableView'" :skip_object="skip_object" :body_area="body_area" :object="object" :task="task" :refresh_rate="vm.refresh_rate" :status_ref="status_ref" :list_data_object="list_data_object">

        </table-view>
        <template v-if="re_render_button_group">
                <button-group v-if="body_area.type=='buttonGroup'" :refresh_rate="vm.refresh_rate" :status_ref="status_ref" :body_area="body_area" :object="object" :task="task" :item_data="vm.activeItemData" :json_holder="vm.jsonHolder" :list_data_object="list_data_object"> </button-group>
        </template>
        <div v-if="body_area.type=='listView' || body_area.type=='gridView'" class="loadingItem" style="position:initial;margin-top:-30%;width:100%;;display:none">
            <div :class="classNameLoad" style="display:none;text-align: center;left: 44%;"><div></div><div></div><div></div>
        </div>
    </div>
</template>