 Vue.component('slider-view', {
        template: '#slider-view',
        props: ['object','body_area','screen','task','list_data_object'],
        data(){
            return {
                'list_items':[],
                'page':1,
                'more':true,
                'items_temp':[],
                'ChainData':{},
                'searchChainData':'',
                'filterforVM':[],
                screenSlider:{},
                random: 'myCarousel-'+Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10),
            }
        },
        watch: {
            list_data_object(list_data_object_new,list_data_object_old){
                if(list_data_object_old==="waiting_loading"){
                    this.handleDataObject()
                }
            },
        },
        created: function () {
            this.screenSlider = JSON.parse(JSON.stringify(this.body_area))
        },
        methods: {
            handleDataObject(reset=false,item_search_string='',item_filter_attributes=[]){
                let that = this;
                if(this.screenSlider.hasOwnProperty('sort') && Object.keys(this.screenSlider.sort).length > 0){
                    order = "`"+this.screenSlider.sort.column+"` "+this.screenSlider.sort.order+"";
                    this.screenSlider['filterConfig']={
                        'sortCol':this.screenSlider.sort.column,
                        'order':this.screenSlider.sort.order
                    }
                }
                else if(this.screenSlider.hasOwnProperty('filterConfig') && Object.keys(this.screenSlider.filterConfig).length > 0){
                    if(this.screenSlider.filterConfig.hasOwnProperty('sortCol')!=true){
                        this.screenSlider.filterConfig['sortCol'] = this.object.key_attribute;
                    }
                    if(this.screenSlider.filterConfig.hasOwnProperty('order')!=true){
                        this.screenSlider.filterConfig['order'] = 'ASC';
                    }
                    order = "`"+this.screenSlider.filterConfig['sortCol']+"` "+this.screenSlider.filterConfig['order']+"";
                }
                else{
                    order = "`"+this.object.key_attribute+"` ASC";
                    this.screenSlider['filterConfig']={
                        'sortCol':this.object.key_attribute,
                        'order':'ASC'
                    }
                }
                
                if(this.object.dm_type == 'JsonHolder'){
                    that.list_items = {0:'notfound'};
                    setTimeout(() => {
                        this.loadCacheJsonHolder()
                        .then((value)=>{
                            let jsonholderSlider = typeof(value) == 'string' ? JSON.parse(value) : value
                            if(jsonholderSlider != null){
                                vm.jsonHolder = value
                                if(jsonholderSlider[that.object.dm_name] == undefined || jsonholderSlider[that.object.dm_name].length==0){
                                    that.list_items = {0:'notfound'};
                                }else{
                                    that.list_items = vm.paramJsonHolder(jsonholderSlider,that.task,that.object);
                                }
                            }
                        })
                    }, 100);
                    return
                }
                let data = JSON.parse(JSON.stringify(this.list_data_object));
                if(data.length>0){
                            if(that.object.hasOwnProperty('key_attribute') && (that.object.key_attribute != "" || that.object.key_attribute != null)){
                                let keyid = that.object.key_attribute;
                                data = data.filter((thing, index) => {
                                    const _thing = thing[keyid];
                                    return index === data.findIndex(obj => {
                                        return obj[keyid] === _thing;
                                    });
                                });
                            }
                            
                        }
                        var flag = 0;
                        if(typeof data !='undefined') {
                            if (data.length > 0) {
                                that.list_items = that.list_items.concat(data);
                                if( that.screenSlider.hasOwnProperty('filterConfig') && Object.keys(that.screenSlider.filterConfig).length > 0){
                                    if(that.screenSlider.filterConfig.hasOwnProperty('sortCol') && that.screenSlider.filterConfig.hasOwnProperty('order') && that.screenSlider.filterConfig.order=='DESC'){
                                            that.list_items.sort(function(a, b) {
                                                if(new Date(jsonPath(a,that.screenSlider.filterConfig.sortCol))!='Invalid Date' && isNaN(Number(jsonPath(a,that.screenSlider.filterConfig.sortCol))) ){
                                                    return new Date(jsonPath(b,that.screenSlider.filterConfig.sortCol))-new Date(jsonPath(a,that.screenSlider.filterConfig.sortCol));
                                                }else if(!isNaN(parseFloat(jsonPath(a,that.screenSlider.filterConfig.sortCol)))){
                                                    return (parseFloat(jsonPath(b,that.screenSlider.filterConfig.sortCol)))-(parseFloat(jsonPath(a,that.screenSlider.filterConfig.sortCol)));
                                                }else{
                                                    return (String(jsonPath(b,that.screenSlider.filterConfig.sortCol))).localeCompare(String((jsonPath(a,that.screenSlider.filterConfig.sortCol))));
                                                }
                                            })
                                            that.ChainData=that.list_items
                                            that.list_items=that.ChainData.slice(0,19)
                                    }else if(that.screenSlider.filterConfig.hasOwnProperty('sortCol') && that.screenSlider.filterConfig.hasOwnProperty('order') && that.screenSlider.filterConfig.order=='ASC'){
                                            that.list_items.sort(function(b, a) {
                                                if(new Date(jsonPath(a,that.screenSlider.filterConfig.sortCol))!='Invalid Date' && isNaN(Number(jsonPath(a,that.screenSlider.filterConfig.sortCol))) ){
                                                    return new Date(jsonPath(b,that.screenSlider.filterConfig.sortCol))-new Date(jsonPath(a,that.screenSlider.filterConfig.sortCol));
                                                }else if(!isNaN(parseFloat(jsonPath(b,that.screenSlider.filterConfig.sortCol)))){
                                                    return (parseFloat(jsonPath(b,that.screenSlider.filterConfig.sortCol)))-(parseFloat(jsonPath(a,that.screenSlider.filterConfig.sortCol)));
                                                }else{
                                                    return (String(jsonPath(b,that.screenSlider.filterConfig.sortCol))).localeCompare(String((jsonPath(a,that.screenSlider.filterConfig.sortCol))));
                                                }
                                            })
                                            that.ChainData=that.list_items
                                            that.list_items=that.ChainData.slice(0,19)
                                    }else{
                                            that.ChainData=that.list_items
                                            that.list_items=that.ChainData.slice(0,19)
                                    }
                                }else {
                                    that.ChainData=that.list_items
                                    that.list_items=that.ChainData.slice(0,19)
                                }

                                
                            } else {
                                if(that.page === 1 || reset){
                                    that.list_items = {0:'notfound'}
                                }
                            }
                        }
                        that.animationSlide();
            },
            animationSlide(){
                if(this.body_area.hasOwnProperty('animation')){
                    let that = this
                    if(this.body_area.animation.enable && this.body_area.animation.delay > -1){
                        setTimeout(() => {
                            $("#"+that.random).carousel({
                                interval : that.body_area.animation.delay,
                                pause: false
                            });
                        }, 1000);
                    }
                }
            },
        },
        mounted: function(){
            let that = this
            setTimeout(() => {
                if(this.body_area.hasOwnProperty('layout') && this.body_area.layout.hasOwnProperty('height') && this.body_area.layout.height != ""){
                    if(String(this.body_area.layout.height).indexOf('px')>-1){
                        let height = String(Number(this.body_area.layout.height.replace('px','')) + 62) + 'px';
                        $("#"+this.$parent.id_random).css({'max-height': height });
                        $("#"+this.$parent.id_random).css({'overflow': 'auto' });   
                    }
                }
            }, 10);
            $("#"+this.random).on('slide.bs.carousel', function (e) {
                if($("#"+that.random+":visible").length == 0){
                    $("#"+that.random).carousel($(e.relatedTarget).index())
                }
                if($(e.relatedTarget).index()>=(that.page*9 - 1)){
                    if(that.list_items.length < that.ChainData.length){
                        that.page++
                        that.list_items = that.ChainData.slice(0,9*that.page)
                    }
                }
            })
        }
    })