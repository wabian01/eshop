    Vue.component('bottom-area', {
        template: '#bottom-area',
        props: ['object','bottom_area',"scroll_to_end","task","screen",'checkcompo','list_data_object','status_ref'],
        data: function () {
            return {
                height: '',
                id_random: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10)
            }
        },
        created: function () {
            
        },
        mounted: function (){
            
            if($('.bottom-'+this.screen.code).length > 0){
                this.height = $('.bottom_area-'+this.screen.code).height()
                $('.bottom-'+this.screen.code).css({'height':$('.bottom_area-'+this.screen.code).height()})  
            }
            if(($('#task-modal-'+vm.activeTaskCode+' #bottomView-'+this.object.code).height() > $('#task-modal-'+vm.activeTaskCode+' .bottom_area-'+this.screen.code).height()) || ($('#'+this.screen.code+' #bottomView-'+this.object.code).height() > $('#'+this.screen.code+' .bottom_area-'+this.screen.code).height())){   
                
                if(this.checkcompo){
                    $('#'+this.screen.code+' .bottom_area-'+this.screen.code).find('i')[0].className = $('.bottom_area-'+this.screen.code).find('i')[0].className.replace('fa-angle-down','fa-angle-up')
                    $('#'+this.screen.code+'.modal-body .floating_button').css({'bottom':($('#'+this.screen.code+'.modal-body').height()*0.33)+'px'})    
                }
                else{
                    $('#task-modal-'+vm.activeTaskCode+' .bottom_area-'+this.screen.code).find('i')[0].className = $('.bottom_area-'+this.screen.code).find('i')[0].className.replace('fa-angle-down','fa-angle-up')
                    $('#task-modal-'+vm.activeTaskCode+' .floating_button').css({'bottom':($('#task-modal-'+vm.activeTaskCode+' .modal-'+this.object.code).height()*0.33)+'px'})    
                    $('.bottom_area-'+this.screen.code).find('.'+this.id_random).css({'position':'fixed','top':(100 - (($('.bottom_area-'+this.screen.code).height()/window.innerHeight)*106))+'%'})
                }
                
            }
            let that = this
            
            
            $(window).resize(function() {
                    let bottomArea = that.checkcompo ? $('#'+that.screen.code+' .bottom_area-'+that.screen.code) : $('#task-modal-'+vm.activeTaskCode+' .bottom_area-'+that.screen.code);
                    let modal = that.checkcompo ? $('#'+that.screen.code+'.modal-body') : $('#task-modal-'+vm.activeTaskCode+' .modal-'+that.object.code);
                    let floatButton = that.checkcompo ? $('#'+that.screen.code+'.modal-body .floating_button') : $('#task-modal-'+vm.activeTaskCode+' .floating_button'); 
                    if(bottomArea.find('i')[0].className.indexOf('fa-angle-down') > -1){
                        bottomArea.css({'height':'fit-content'})
                        if(modal.find('.floating_button').length > 0 ){
                            bottomArea.css({'max-height':(modal.height()*0.89)+'px'})
                            if($('#task-modal-'+vm.activeTaskCode+' #bottomView-'+that.object.code).height() > $('.bottom_area-'+that.object.code).height()){
                                floatButton.css({'bottom':(modal.height()*0.9)+'px'})
                            }
                            else{
                                floatButton.css({'bottom':bottomArea.height()+(bottomArea.height()*0.05)+'px'})
                            }
                        }
                        else{
                            bottomArea.css({'max-height':(modal.height())+'px'})
                        }
                        $('.bottom_area-'+that.screen.code).find('.'+that.id_random).css({'position':'fixed','top':(100 - (($('.bottom_area-'+that.screen.code).height()/window.innerHeight)*106))+'%'})
                    }
                    else if(bottomArea.find('i')[0].className.indexOf('fa-angle-up') > -1){
                        if(modal.find('.floating_button').length > 0 && $('.bottom_area-'+that.screen.code).css('max-height') != '30%'){
                            floatButton.css({'bottom':'4%'})
                        }
                        if($('.bottom_area-'+that.screen.code).css('max-height') != '30%') bottomArea.css({'height':that.height,'max-height':'3%'})
                        $('.bottom_area-'+that.screen.code).find('.'+that.id_random).css({'position':'fixed','top':(100 - (($('.bottom_area-'+that.screen.code).height()/window.innerHeight)*106))+'%'})
                    }
                    $('.bottom-'+that.screen.code).css({'height':$('.bottom_area-'+that.screen.code).height()})
            });

        },
        
        methods: {
            expand:function (screenCode,height,objectCode,checkcompo,id_random){
                let bottomArea = checkcompo ? $('#'+screenCode+' .bottom_area-'+screenCode) : $('#task-modal-'+vm.activeTaskCode+' .bottom_area-'+screenCode);
                let modal = checkcompo ? $('#'+screenCode+'.modal-body') : $('#task-modal-'+vm.activeTaskCode+' .modal-'+objectCode);
                let floatButton = checkcompo ? $('#'+screenCode+'.modal-body .floating_button') : $('#task-modal-'+vm.activeTaskCode+' .floating_button'); 
                if(bottomArea.find('i')[0].className.indexOf('fa-angle-up') > -1){
                    bottomArea.css({'height':'fit-content'})
                    if(modal.find('.floating_button').length > 0 ){
                        bottomArea.css({'max-height':(modal.height()*0.89)+'px'})
                        if($('#task-modal-'+vm.activeTaskCode+' #bottomView-'+objectCode).height() > $('.bottom_area-'+objectCode).height()){
                            floatButton.css({'bottom':(modal.height()*0.9)+'px'})
                        }
                        else{
                            floatButton.css({'bottom':bottomArea.height()+(bottomArea.height()*0.05)+'px'})
                        }
                    }
                    else{
                        bottomArea.css({'max-height':(modal.height())+'px'})
                    }
                    $('.bottom_area-'+screenCode).find('.'+id_random).css({'position':'fixed','top':(100 - (($('.bottom_area-'+screenCode).height()/window.innerHeight)*106))+'%'})
                    bottomArea.find('i')[0].className = $('.bottom_area-'+screenCode).find('i')[0].className.replace('fa-angle-up','fa-angle-down')
                }
                else if(bottomArea.find('i')[0].className.indexOf('fa-angle-down') > -1){
                    if(modal.find('.floating_button').length > 0){
                        floatButton.css({'bottom':'4%'})
                    }
                    bottomArea.css({'height':height,'max-height':'3%'})
                    bottomArea.find('i')[0].className = bottomArea.find('i')[0].className.replace('fa-angle-down','fa-angle-up')
                    $('.bottom_area-'+screenCode).find('.'+id_random).css({'position':'fixed','top':(100 - (($('.bottom_area-'+screenCode).height()/window.innerHeight)*106))+'%'})
                }
                $('.bottom-'+screenCode).css({'height':$('.bottom_area-'+screenCode).height()})
            }
        }
    })
