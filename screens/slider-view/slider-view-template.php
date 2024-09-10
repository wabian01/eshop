<template id= 'slider-view'>
    <div class="col-md-12" style="height: 100%">
        <div :id="random" class="carousel slide" data-interval="false" style="padding-bottom:40px;">
            <ol v-if="list_items[0]!='notfound'"  class="sliderview carousel-indicators" style="display:flex;justify-content: center;flex-wrap: nowrap;">
                <li v-for="(list_item,index) in list_items" :data-target="'#'+random" :data-slide-to="index" :class="index==0?'active':''" style="width:inherit;height: 7px;border-radius: 4px !important;background-color: #c6c2c2;border-color: #c6c2c2;margin: unset;margin-right: 5px;"></li>  
            </ol>
            <div class="carousel-inner" >
                <div class="item" v-for="(list_item,index) in list_items" :class="index==0?'active':''" style="padding:5px;">
                    <list-item :horizontal='true'  :indexsearch="list_items.length-1<index+2" :key="list_item" :screen_item="screen_item" :list_item="list_item" :object="object" :task="task" :position='index'></list-item>
                </div>
            </div>
        </div>
    </div>
</template>