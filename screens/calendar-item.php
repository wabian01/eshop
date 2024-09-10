<template id= 'calendar-item'>
    <div>
        <div class="fc-list-select-item" style="display:flex; align-items:baseline; padding: 0.2em 0.5em; cursor: pointer;" @click="onEventClick(object)">
            <div style="flex-basis:3%;">
                <div :style="style"></div>
            </div>
            <div style="flex-basis:97%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"><span style="color: #337ab7;font-weight: bold;">{{object._def.title}}</span></div>
        </div>
    </div>
</template>
<script type="text/javascript">
    Vue.component('calendar-item', {
        template: '#calendar-item',
        props: ['object'],
        computed: {
            style () {
                return 'width:10px;height:10px;background:' + this.object._def.ui['backgroundColor'] +';'
            }
        },
        created: function () {
        },
        methods: {
            onEventClick:function(event){
                this.$emit('clicked', event)
            },
        }
    })
</script>