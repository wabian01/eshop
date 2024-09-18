<template id='floating_button'>
    <div v-if="list_items && list_items.length > 0" class='floating_button'>
        <div v-if="list_items.length <= 2" 
            :style="screen.floating_buttons.appearance.type === 'regular' ? 
                            { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' } : {}">
            <action-button
                v-for="(action, index) in list_items"
                :indexsearch="true"
                :end="list_items.length-1"
                :key="action"
                :item_button="action"
                :task="task"
                :list_item="list_items"
                :floating_button="true" 
                style="margin-right:10px;"
                :appearance="screen.floating_buttons.appearance"
            >
            </action-button>
        </div>
        <div v-else class="btn-group dropup">
            <button type="button" class="btn btn-circle1 btn-sm dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i class="fa fa-plus" aria-hidden="true"></i> {{screen.floating_buttons.appearance.menu_label}}
            </button>
            <div class="dropdown-menu dropdown-menu-right dropdown-menu-floating" style="background-color: transparent;max-height: 70vh;overflow-y: auto;margin-bottom: 5px;">
                <action-button v-for="action in list_items" :item_button="action" :task="task" :list_item="list_items" :key="action" :floating_button="false" :appearance="screen.floating_buttons.appearance"> </action-button>
            </div>
        </div>
    </div>
</template>
