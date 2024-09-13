<template id="calendar-view">
    <div class="calendar-view-webapp" >
        <div class=" portlet light bordered" style="border:none !important;">
            <div :class="'calendar'+id_random" class="has-toolbar"></div>
                <div v-show="item_html_bottom !=''" style="padding: 0.5em 0 0;border: 1px solid #dddddd;border-top: none;">
                    <calendar-item  v-for="(calendar_item) in item_html_bottom" @clicked="onClickChild" :object="calendar_item" ></calendar-item>
                </div>
        </div>
        <div class="modal fade chartCode" id="chartCode" data-backdrop="false" style="position : absolute;">
            <div class="modal-dialog" style="margin-top: 90px;">
                <div class="modal-content" style="padding: 30px;border-radius: 10px !important;max-height: 76vh;">    
                    <div class="modal-header" style="padding:0; border:none;">
                        <div class="modal-title" v-html="title_html"></div>
                        <span @click="closeModal" style="position: fixed;top: 15px;right: 25px;cursor: pointer;"><i class="fas fa-times"></i></span>
                    </div>
                    <div class="modal-body" style="max-height: 60vh !important; overflow-x: scroll; -ms-overflow-style: none;scrollbar-width: none; ">
                        <div class="form-group">
                            <div class="col-md-12" style="border-bottom: 1px solid #c1c1c1;">
                                <iframe v-if="iframe_html.length > 0" :id="id_iframe" :srcdoc="iframe_html" :key="iframe_html" marginheight="0" marginwidth="0" frameborder="0" style="height: 200px;width: 100%;transition:0.5s;"></iframe>    
                            </div>
                        </div>
                        <div v-html="item_html"></div>
                        <!-- item_buttons into CalendarView -->
                        <div style="display: flex; overflow-x: scroll; max-width: 100%; scrollbar-width: none; margin-right:-1px; padding-top: 10px;">
                            <action-button v-for="(item_button,index) in item_buttons" :key="item_buttons" :indexsearch="true" :end="index==item_buttons.length-1" :list_item="list_item" :item_button="item_button" :task="task"> </action-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="event-dialog" title="Event" style="display: none">
            <?php $form = $this->beginWidget(
                'CActiveForm',
                        array(
                'htmlOptions' => array('enctype' => 'multipart/form-data', 'class' => 'form-horizontal eventForm', 'role' => 'form'),
                'enableAjaxValidation' => false,
                )
            ); ?>
            <div class="modal-body form">
                <div class="form-body">
                </div>
            </div>
            <?php $this->endWidget(); ?>
        </div>
    </div>
</template>