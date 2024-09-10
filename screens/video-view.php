<template id="video-view">
    <div>
        <iframe :srcdoc="template" marginheight="0" marginwidth="0" frameborder="0" style="width:100%;height: 470px;"></iframe>
    </div>
</template>

<script type="text/javascript">
    Vue.component('video-view', {
        template: '#video-view',
        props: ['screen_item','id_random','task','object','list_data_object'],
        data: function () {
            return {
                template : '',
                screen_item_tem:'',
            }
        },
        watch: {
            list_data_object(list_data_object_new,list_data_object_old){
                if(list_data_object_old==="waiting_loading"){
                    this.handleDataObject()
                }
            },
        },
        created:  function () {
        
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
                that.screen_item_tem = screen_item
                if(screen_item.thumbnail != undefined && screen_item.thumbnail.indexOf("http") == 0){
                    that.template = '<div style="margin:0.5em;position: relative;display: flex;justify-content: center;align-items: center;"><video style="width:100%;height: 450px;border-radius: 5px;background:#000000;" poster="'+screen_item.thumbnail+'"><source src="'+screen_item.url+'" type="video/mp4"></video><div style="position: absolute;width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;"><img src="../../img/loading-color.gif"></div></div>';
                } else {
                    that.template = '<div style="margin:0.5em;position: relative;display: flex;justify-content: center;align-items: center;"><video style="width:100%;height: 450px;border-radius: 5px;background:#000000;"><source src="'+screen_item.url+'" type="video/mp4"></video><div style="position: absolute;width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;"><img src="../../img/loading-color.gif"></div></div></div>';
                }
                this.checkHttp()
            },
            checkHttp(){
                let that = this;
                let random = this.id_random;
                if(this.screen_item_tem.subtitle != undefined && this.screen_item_tem.subtitle.indexOf("http") == 0 && this.screen_item_tem.url.indexOf("http") == 0){
                    $.ajax({
                        url: "<?php echo $this->createUrl('/services/getSubtitles'); ?>",
                        type: 'POST',
                        data: {
                            downloadLink: this.screen_item_tem.subtitle,
                        },
                        success: function (json) {
                            let subtitle = json;
                            let subBlob = new Blob([subtitle]);
                            let subURL = URL.createObjectURL(subBlob);
                            if(that.screen_item_tem.thumbnail != undefined && that.screen_item_tem.thumbnail.indexOf("http") == 0){
                                that.template = '<div style="margin:0.5em;position: relative;display: flex;justify-content: center;align-items: center;"><video id="video-'+random+'" controls preload="auto" style="width:100%;height: 450px;border-radius: 5px;background:#000000;" poster="'+that.screen_item_tem.thumbnail+'" ><source src="'+that.screen_item_tem.url+'" type="video/mp4"><track kind="subtitles" srclang="en" label="English" src="'+subURL+'" default ></video></div>';
                            } else {
                                that.template = '<div style="margin:0.5em;position: relative;display: flex;justify-content: center;align-items: center;"><video id="video-'+random+'" controls preload="auto" style="width:100%;height: 450px;border-radius: 5px;background:#000000;"><source src="'+that.screen_item_tem.url+'" type="video/mp4"><track kind="subtitles" srclang="en" label="English" src="'+subURL+'" default ></video></div>';
                            }
                        },
                        error: function (response) {
                            if(that.screen_item_tem.thumbnail != undefined && that.screen_item_tem.thumbnail.indexOf("http") == 0){
                                that.template = '<div style="margin:0.5em;position: relative;display: flex;justify-content: center;align-items: center;"><video id="video-'+random+'" controls preload="auto" style="width:100%;height: 450px;border-radius: 5px;background:#000000;" poster="'+that.screen_item_tem.thumbnail+'" ><source src="'+that.screen_item_tem.url+'" type="video/mp4"></video></div>';
                            } else {
                                that.template = '<div style="margin:0.5em;position: relative;display: flex;justify-content: center;align-items: center;"><video id="video-'+random+'" controls preload="auto" style="width:100%;height: 450px;border-radius: 5px;background:#000000;"><source src="'+that.screen_item_tem.url+'" type="video/mp4"></video></div>';
                            }
                        },
                    });
                } else {
                    if(that.screen_item.thumbnail != undefined && that.screen_item.thumbnail.indexOf("http") == 0){
                        that.template = '<div style="margin:0.5em;position: relative;display: flex;justify-content: center;align-items: center;"><video id="video-'+random+'" controls preload="auto" style="width:100%;height: 450px;border-radius: 5px;background:#000000;" poster="'+that.screen_item.thumbnail+'" ><source src="'+that.screen_item.url+'" type="video/mp4"></video></div>';
                    } else {
                        that.template = '<div style="margin:0.5em;position: relative;display: flex;justify-content: center;align-items: center;"><video id="video-'+random+'" controls preload="auto" style="width:100%;height: 450px;border-radius: 5px;background:#000000;"><source src="'+that.screen_item.url+'" type="video/mp4"></video></div>';
                    }    
                }
            }
        },
        mounted: async function(){
            let random = this.id_random;
            $('#task-modal-'+this.task.code).on('hidden.bs.modal', function () {
                let vid = document.getElementById("video-"+random)
                vid.pause();
            })
        },
    });
</script>