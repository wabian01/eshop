<template id="timeline-item">
    <div class="timeline-item">
        <div class="timeline-badge">
            <span :style="icon_style"></span>
        </div>
        <div class="timeline-body">
            <div>
                <span
                    class="timeline-date_column"
                    style="color: #6a6565;font-size: 12px;"
                    v-html="item_content.date_column"
                ></span>
                <span
                    class="timeline-extra_text_column"
                    v-html="item_content.extra_text_column"
                ></span>
            </div>
            <div
                class="timeline-item_template"
                v-html="item_content.item_template ? item_content.item_template : item_content.title_column"
            ></div>
        </div>
    </div>
</template>

<script type="text/javascript">
    Vue.component('timeline-item', {
        template: '#timeline-item',
        props: ['list_item','screen_item', 'object'],
        data: function () {
            return {
                item_content:''
            }
        },
        created: function () {
            this.handleItem();  
        },
        methods: {
            handleItem:function () {
                this.item_content = JSON.parse(JSON.stringify(this.screen_item.attributes));
                for (var key in this.item_content) {
                    if(/##(.*?)##/.test(this.item_content[key])) {
                        let match = this.item_content[key].match(/##(.*?)##/g);
                        for(let i=0; i<match.length; i++) {
                            this.item_content[key] = this.item_content[key].replace(match[i], this.list_item[match[i].replace(/##/g,"")]);
                        }
                    }
                    if(this.item_content[key] in this.list_item) {
                        this.item_content[key] = this.list_item[this.item_content[key]];
                    }
                }
               
                this.icon_style = {
                    width: "15px",
                    'border-radius': "50% !important",
                    position: "absolute",
                    height: "15px",
                    background: this.list_item[this.screen_item.attributes.colorline_column],
                    display: "block",
                    top: "65%",
                    left: "2rem",
                }
            },
            handleClick:function (event) {
                if (this.screen_item.hasOwnProperty('item_onclick')) {
                    for (let i = 0; i < this.screen_item.item_onclick.length; i++) {
                        if(this.screen_item.item_onclick[i].type='navigate'){
                            vm.jumpToScreen(this.screen_item.screenCode, this.screen_item.item_onclick[i].target_screen_id,this.list_item);
                        }

                    }
                }
            }
        }
    });
</script>
