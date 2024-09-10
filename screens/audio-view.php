<template id="audio-view">
    <!-- BEGIN Portlet PORTLET-->
    <div  style="height: 110%;position:relative" id="playerContainer" >
        <div v-html='template' style="border: 1px solid #e6e6e6; padding:0.5em;margin: 5px; border-radius:5px !important;"></div>
    </div>
    <!-- END Portlet PORTLET-->
</template>

<script type="text/javascript">
    Vue.component('audio-view', {
        template: '#audio-view',
        props: ['screen_item','id_random','task','object','list_data_object'],
        data: function () {
            return {
                template : '',
            }
        },
        created: function () {
            
        },
        watch: {
            list_data_object(list_data_object_new,list_data_object_old){
                if(list_data_object_old==="waiting_loading"){
                    this.handleDataObject()
                }
            },
        },
        methods:{
            handleDataObject(){
                let body_area_replace = JSON.stringify(JSON.parse(JSON.stringify(this.screen_item)))
                let that = this;
                let data = JSON.parse(JSON.stringify(this.list_data_object));
                for(var key in data[0]){
                            if(data[0].hasOwnProperty(key) && data[0][key] != null){
                                body_area_replace = body_area_replace.toString().replace(new RegExp('\'##'+key+'##\'','g'),"'"+(data[0][key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                                body_area_replace = body_area_replace.toString().replace(new RegExp('##'+key+'##','g'),(data[0][key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"')));
                            }
                        }
                        body_area_replace = body_area_replace.replace(/\\"'(.*?)'\\"/g,'\\"$1\\"')
                        for (var key in vm.flatRuntimeAttributes) {
                                    if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                                        body_area_replace = body_area_replace.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                                        body_area_replace = body_area_replace.replace('"','\"');
                                    }
                                }  
                        for(var key in vm.current.parent){
                            try {
                                body_area_replace = body_area_replace.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].replace(/[\r\n]+/g," "));
                            } catch (error) {
                            }
                            body_area_replace = body_area_replace.replace('"','\"');
                        }
                        if(body_area_replace.indexOf('##')>-1){
                            body_area_replace = body_area_replace.replace(/##(.*?)##/g,"");
                        }
                        let screen_item = JSON.parse(body_area_replace)
                        let title = screen_item.audio_title ? screen_item.audio_title : "" ;
                        that.template = ' <figcaption>'+title+'</figcaption><audio id="audio-'+that.id_random+'" style="width:100%;" controlsList="nodownload"  controls preload="auto"><source src="'+screen_item.url+'"></audio>';
            }
        },
        mounted: function(){
            let random = this.id_random
            $('#task-modal-'+this.task.code).on('hidden.bs.modal', function () {
                let audio = document.getElementById("audio-"+random)
                audio.pause();
            })
        },
    });
</script>