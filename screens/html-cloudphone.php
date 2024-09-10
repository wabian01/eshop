<template id="html-cloudphone">
    <div  style="height: 110%;position:relative;top:-60px;" v-if="isForm" v-html="item_content" ></div>
    <div :id='"bottomView-"+(bottom_area_code ? bottom_area_code : "")' style="height: 100%; padding: 0px 15px 0px;"  v-else="isForm"  >
        <div v-if="item_content.indexOf('<script')==-1" v-html="item_content"></div>
        <div v-else="item_content.indexOf('<script')>-1" style="height: 100%">
            <iframe :id="id_random" @load="checkIframe" :srcdoc="item_content" marginheight="0" marginwidth="0" frameborder="0" style="height: 0px;width: 100%;transition:0.5s;" scrolling="no"></iframe>
        </div>
    </div>
</template>
<script type="text/javascript">
    Vue.component('html-cloudphone', {
        template: '#html-cloudphone',
        props: ['screen_item','item_data', 'object','task','bottom_area_code'],
        data: function () {
            this.isForm = typeof this.object !== "undefined" && this.object !== null && (['fill-form','edit-form','instance','form'].indexOf(this.object.type) >= 0)
            return {
                item_content:"",
                'limit':10,
                'page':1,
                id_random: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10) ,
            }
        },
        created: function () {      
            this.item_content = this.screen_item.html_template;   
        },
        methods: {
            checkIframe: function(){
                let iframe = $('#'+this.id_random).get(0).contentDocument
                if((iframe != null && iframe.location.href != "about:srcdoc") || iframe == null){
                    vm['checkIframe']={0:false,'id':this.id_random};
                }else{
                    vm['checkIframe']={0:true};
                }
            },
        },
        mounted(){
            if(this.task.code===vm.activeTaskCode){
                let iframe = document.getElementById(this.id_random);
                if(iframe!=null){
                    setTimeout(() => {
                        iframe.style.height = iframe.contentWindow.document.documentElement.scrollHeight  + 'px';
                    }, 700);
                }
            }
        },
    });
</script>