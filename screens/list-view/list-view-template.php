<template id="list-view">
    <div style="height:100%;">
        <quick-filter v-if="Object.keys(quickfilter).length>0 && quickfilter.hasOwnProperty('entries') && Object.keys(list_items).length>0" :object="object" :quickfilter="quickfilter" :list_items='ChainData' @filter_chartview="fuSearchAndFilter"></quick-filter>
        <!-- icon of dynamic_style -->
        <div class="icons-container">
            <div class="dropdown-col" v-show="hasColumn">
                <span>{{ selectedValue }}</span>
                <span class="column-icon i-general-col dropbtn-col">
                    <img src='https://cdn.rtworkspace.com/plugins/webapp/images/column-icon.svg' />
                </span>
                <div class="dropdown-content-col">
                    <span v-for="val in valColumn" :key="val" @click="displayValue(val)">{{ val }}</span>
                </div>
            </div>
            <div v-if="dynamicTemplate">
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
        </div>
        
        <div :class="checkHorizontal?'scroll_horizontal':''"  class="col-md-12" style="padding: 8px 0 2px 0;height: 100%;overflow: scroll;scrollbar-width:none;" :style="((!noHorizontal && list_items[0]!=='notfound')?'display:flex;':'') + bgColor" v-on:scroll="handleScrollListView">
            <div v-if="vm.newtemplate" class="lds-spinner load-newtemplate" style="display:none;"></div>
            <div v-else class="lds-spinner loading-animation-info" style="display:none;">
                <div style="display:flex;">
                    <div style="display: flex;align-items: center;padding: 10px 10px 10px 0px;">
                        <div style="width:60px;height:60px; border-radius:50% !important;background:#ababab;"></div>
                    </div>
                    <div>
                        <div style="width:150px;height:16px;background:#ababab;margin:8px; border-radius: 2px !important;"></div>
                        <div style="width:200px;height:16px;background:#ababab;margin:8px; border-radius: 2px !important;"></div>
                        <div style="width:100px;height:16px;background:#ababab;margin:8px; border-radius: 2px !important;"></div>
                    </div>
                </div>
                <div style="display:flex;">
                    <div style="display: flex;align-items: center;padding: 10px 10px 10px 0px;">
                        <div style="width:60px;height:60px; border-radius:50% !important;background:#d5d5d5;"></div>
                    </div>
                    <div>
                        <div style="width:150px;height:16px;background:#d5d5d5;margin:8px; border-radius: 2px !important;"></div>
                        <div style="width:200px;height:16px;background:#d5d5d5;margin:8px; border-radius: 2px !important;"></div>
                        <div style="width:100px;height:16px;background:#d5d5d5;margin:8px; border-radius: 2px !important;"></div>
                    </div>
                </div>
                <div><?php echo Yii::t('app','Loading data, please wait...'); ?></div>
            </div>
            <template v-if="re_render_tem">
                <div v-if="noHorizontal || list_items[0]=='notfound'"  :style="hasColumn === true ? 'display: flex; flex-wrap: wrap;' : (list_items[0]=='notfound'?'':(checkHorizontal?'display:flex;':styleGridView))" :class="styleGridView!=''?'gridViewBt':'none_bg'" >
                        <list-item :horizontal="checkHorizontal" :style="list_items[0]=='notfound' ? '' : styleHorizontal" v-for="(list_item,index) in list_items" :indexsearch="list_items.length-1<index+2" :key="list_item" :screen_item="screen_item" :list_item="list_item" :object="object" :task="task" :position='index' :selected-value="selectedValue" :has-column="hasColumn"></list-item>
                </div>
                <div v-else v-for="col in Math.ceil(list_items.length/numberCol)" :style="widthGridView">
                    <list-item :horizontal="checkHorizontal" v-if="(col -1)*numberCol <=index && index < col*numberCol" :style="styleHorizontal" v-for="(list_item,index) in list_items" :indexsearch="list_items.length-1<index+2" :key="list_item" :screen_item="screen_item" :list_item="list_item" :object="object" :task="task" :position='index'></list-item>
                </div>
            </template>
        </div>
    </div>
</template>