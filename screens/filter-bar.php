<template id="filter-bar">
    <div  class="col-md-12">
        <list-item v-for="(list_item,index) in list_items" :screen_item="screen_item" :list_item="list_item"></list-item>
    </div>
</template>
<script type="text/javascript">
    Vue.component('filter-bar', {
        template: '#filter-bar',
        props: ['object','screen_item','scroll_to_end'],
        data: function () {
            return {
                'list_items':[],
                'page':1,
                'more':true,
                'limit':10
            }
        },
        created: function () {
            this.getDMItems();
        },
        methods: {
            getDMItems:function () {
                var that = this;
                $.ajax({
                    url:'https://rta.rtcpms.com'+'/api/download/query',
                    type:'GET',
                    dataType:'json',
                    data:{
                        token:that.object.token,
                        dm_name:that.object.dm_name,
                        limit:that.limit,
                        offset:that.limit*that.page,
                    },
                    success:function (data) {
                        if(data.length>0){
                            that.list_items = that.list_items.concat(data);
                            that.page++;
                        }else{
                            that.more=false;
                        }
                    }
                });
            },
        },
        watch: {
            scroll_to_end: function(scroll_to_end) {
                if(scroll_to_end&&this.more){
                    this.getDMItems();
                }

            }
        }
    });
</script>