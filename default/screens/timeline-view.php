<template id="timeline-view">
        <div class="col-md-12" style="padding-top: 0px;" v-on:scroll="handleScrollListView">
            <div class="timeline">
                <timeline-item  v-for="(list_item,index) in list_items" :screen_item="screen_item" :list_item="list_item" :object="object"></timeline-item>
            </div>
        </div>
</template>

<script type="text/javascript">
    Vue.component('timeline-view', {
        template: '#timeline-view',
        props: ['object','screen_item','task','list_data_object'],
        data: function () {
            return {
                'list_items':[],
                'page':1,
                'more':true,
                'limit':100,
                'scroll_to_end':false,
                'title_list': '',
            }
        },
        created: function () {
        
        },
        methods: {
            handleDataObject(){
                var that = this;
                $("#timeline-view #line_loading").hide();
                let data = JSON.parse(JSON.stringify(this.list_data_object));
                if(typeof data !='undefined') {
                    if (data.length > 0) {
                        that.list_items = that.list_items.concat(data);
                        that.page++;
                        $("#timeline-view #items_loading").show();
                    } else {
                        that.more = false;
                        $("#timeline-view #items_loading").hide();
                    }
                }
            },
            handleScrollListView: function (event) {
                if (($(event.target).scrollTop() + $(event.target).innerHeight() + 1500) >= $(event.target)[0].scrollHeight) {
                    this.scroll_to_end = true;
                } else {
                    this.scroll_to_end = false;
                }
            },
        },
        watch: {
            list_data_object(list_data_object_new,list_data_object_old){
                if(list_data_object_old==="waiting_loading"){
                    this.handleDataObject()
                }
            },
            scroll_to_end: function(scroll_to_end) { // watch it
                if(scroll_to_end&&this.more){
                    this.getDMItems();
                    $("#timeline-view #items_loading").hide();
                }else{
                    $("#timeline-view #items_loading").hide();
                }
            },
            item_search_string: function(item_search_string) { // watch it
                this.getDMItems(true,item_search_string);


            },
            item_filter_attributes: function(item_filter_attributes) { // watch it
                var filter_attributes = JSON.parse(item_filter_attributes);
                this.getDMItems(true,this.item_search_string,filter_attributes);
            }
        }
    });
</script>
