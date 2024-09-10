<template id= 'table-view'>
    <div>
        <quick-filter v-if="dataStore!==''" :object="object" :quickfilter="quickfilter" @filter_chartview="filterTableview" :list_items="dataStore"></quick-filter>
        <div class="col-md-12 table-view" style="margin-bottom:7%" >
            <div style="border-radius: 5px !important;box-shadow: 2px 5px 9px 5px #88888847;" >
                <div v-if="this.body_area.attributes.hasOwnProperty('filters') && dataStore!==''">
                    <div data-toggle="modal" :data-target="'#' + id" @click.once="reset_filter=!reset_filter" style="float: right;font-weight: bold;color: orange;margin: 0px 20px;font-size: 20px;cursor: pointer;"><?php echo Yii::t('app','FILTER'); ?></div>  
                </div>
                <div class="modal fade" :id="id" tabindex="-1" data-backdrop="false">
                    <div class="modal-dialog modal-filter-chartview" style="margin-top: 90px;width:450px;">
                        <div class="modal-content" style="border-radius: 4px !important;max-height: 80vh;border:none;box-shadow: 2px 2px 5px 1px #24232347;">
                            <div class="modal-body">
                                <div style="height:50px;padding:16px;display:flex; align-items: center; justify-content: space-between;border-bottom: 1px solid #bdbdbd;">
                                    <span style="color:#000;font-size:1.3em;font-weight:bold;"><?php echo Yii::t('app','Filter'); ?></span>
                                    <span style="color:#ff0000;cursor:pointer;font-weight:bold;" @click="reset_filter=!reset_filter"><?php echo Yii::t('app','Reset'); ?></span>
                                </div>
                                <div style="overflow: auto;max-height: calc(80vh - 115px);padding-bottom:5px;min-height:250px;">
                                    <search-option v-if="body_area.attributes.hasOwnProperty('filters') && filter.screen_code == body_area.screenCode && dataStore!==''" :show_all_object="task.code == 9999 ? true: false" v-for="(filter, code) in vm.activeListFilters" :chartcode="id" :filter="filter" :reset_filter="reset_filter" :taskcode="task.code" @filter_chartview="filterTableview" :apply_filter="apply_filter" :cancel_filter="cancel_filter"
                                    ></search-option>
                                </div>
                                <div style="height:65px;padding:16px;display:flex; align-items: center; justify-content: flex-end;">
                                    <button type="button" @click="cancelFilter()" class="btn" style ="font-weight:bold; width:100px; height:40px; background:#eee;color:#737373 !important; border:none;border-radius: 4px !important;"><?php echo Yii::t('app','Cancel'); ?></button>    
                                    <button type="button" @click="applyFilter()" class="btn" style ="font-weight:bold; width:100px; margin-left:10px; height:40px; background:#009688;color:#fff; border:none;border-radius: 4px !important;"><?php echo Yii::t('app','Apply'); ?></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-html="item_content"></div>
            </div>
        </div>
    </div> 
</template>