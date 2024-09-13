<template id="chart-view">
    <div >
        <quick-filter v-if="ChainData!==''" :object="object" :quickfilter="quickfilter" @filter_chartview="filterChart" :list_items="ChainData"></quick-filter>
        <div v-if="this.body_area.hasOwnProperty('filters') && body_area.filters.length>0">
            <div  data-toggle="modal" :data-target="'#'+chartCode"   style="float: right;font-weight: bold;color: orange;margin: 0px 20px;font-size: 20px;cursor: pointer;"><?php echo Yii::t('app','FILTER'); ?></div>
        </div>
        <div class="modal fade" :id="chartCode" tabindex="-1" data-backdrop="false">
                <div class="modal-dialog modal-filter-chartview" style="margin-top: 90px;width:450px;">
                    <div class="modal-content" style="border-radius: 4px !important;max-height: 80vh;border:none;box-shadow: 2px 2px 5px 1px #24232347;">    
                        <div class="modal-body">
                            <div style="height:50px;padding:16px;display:flex; align-items: center; justify-content: space-between;border-bottom: 1px solid #bdbdbd;">
                                <span style="color:#000;font-size:1.3em;font-weight:bold;"><?php echo Yii::t('app','Filter'); ?></span>
                                <span style="color:#ff0000;cursor:pointer;font-weight:bold;" @click="reset_filter=!reset_filter"><?php echo Yii::t('app','Reset'); ?></span>
                            </div>
                            <div style="overflow: auto;max-height: calc(80vh - 115px);padding-bottom:5px;min-height:250px;">
                                <search-option  v-for="(filter, code) in vm.activeListFilters" v-if="filterforVM.length>0 && filter.screen_code == body_area.screenCode" :key="filter.entries?.length>0?true:false" :show_all_object="true" :chartcode="chartCode" :filter="filter" :reset_filter="reset_filter" :taskcode="task.code" @filter_chartview="filterChart" :apply_filter="apply_filter" :cancel_filter="cancel_filter"
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
        <div class="chart-view" style="margin:auto;">
            <canvas :id="'rtaChart-'+chartCode" width="100%" height="100%"></canvas>
        </div>
        <div :class="chartCode+' parentload'">
            <div style="height:100px;"></div>
            <div :class='chartCode+" loadicon"' style="border-radius: 50% !important;"> </div>
            <div style="height:100px;"></div>
        </div>     
    </div>
</template>