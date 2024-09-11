Vue.component('lite-form', {
        template: '#lite-form',
        props: ['body_area','object','task','list_item','item_data','list_data_object'],
        created: function () {    
            var that = this
            if(this.body_area.hasOwnProperty('grid')){
                this.styleSubmit = "display:none;"
                let numCol = this.body_area.grid.weight
                let columnGrid = '';
                let oneCol = 100/numCol
                for (let i = 0; i < numCol; i++) {
                    columnGrid += oneCol+'%'
                }
                this.gridLayout = 'row-gap: 10px;display:grid;grid-template-columns:'+columnGrid+';'
                this.body_area.grid.layout.map(field=>{
                    if(field.name === '__submit_button__'){
                        that.typeSubmit = '__submit_button__'
                        that.styleSubmit = "height: 34px;width: 100px;"+"grid-area:"+(parseInt(field.row) + 1) +"/"+(parseInt(field.col) + 1)+"/auto/"+ (parseInt(field.colspan) + parseInt(field.col) + 1)+";"
                    }else if(field.name === '__submit_icon__'){
                        that.typeSubmit = '__submit_icon__'
                        that.styleSubmit = "grid-area:"+(parseInt(field.row) + 1) +"/"+(parseInt(field.col) + 1)+"/auto/"+ (parseInt(field.colspan) + parseInt(field.col) + 1)+";"
                    }
                    that.styleField[field.name] = "grid-area:"+(parseInt(field.row) + 1) +"/"+(parseInt(field.col) + 1)+"/auto/"+ (parseInt(field.colspan) + parseInt(field.col) + 1)+";"
                })
            } 
            if (!vm.liteform) {
                vm.liteform = {
                    [this.id_random]: {
                        id: this.id_random,
                        index: 0
                    }
                };
            } else {
                vm.liteform[this.id_random] = {
                    id: this.id_random,
                    index: Object.keys(vm.liteform).length
                };
            }
            this.initializeForm()
        },
        watch: {
            list_data_object(list_data_object_new,list_data_object_old){
                if(list_data_object_old==="waiting_loading" || !list_data_object_old){
                    this.handleDataObject()
                }
            },
            item_data: {
                handler: function(newVal, oldVal) {
                    if(this.task.code===vm.activeTaskCode && this.body_area.screenCode==vm.activeScreenCode && newVal != undefined){
                        this.list_item = newVal
                        this.handleReplaceListItem()
                    }
                },
                deep: true
            }
        },
        data: function () {
            return {
                questions:this.body_area['fields'],
                id_random:Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10),
                render:true,
                gridLayout:'',
                styleField:[],
                styleSubmit:'',
                typeSubmit:'none',
                arrayValue:[],
                status_load:false,
                body_area_tem:this.body_area,
            }
        },
        methods: {
            initializeForm: function() {
                if(this.list_item != undefined){
                    this.handleReplaceListItem()
                }
            },
            uniqid:function(number) {
                return number + Date.now() * Math.random();
            },
            getRandomInt:function() {
                return Math.random() * Math.floor(100000);
            },
            appendFormData(formData){
                let instanceID = md5(this.uniqid(this.getRandomInt() * 2)).substr(0, 8) + '-' + md5(this.uniqid(this.getRandomInt() * 3)).substr(0, 4) + '-' + md5(this.uniqid(this.getRandomInt() * 4)).substr(0, 4) + '-' + md5(this.uniqid(this.getRandomInt() * 5)).substr(0, 4) + '-' + md5(this.uniqid(this.getRandomInt() * 6)).substr(0, 12)
                formData.append("rta-username", this.body_area['form'].username);
                formData.append("username", this.body_area['form'].username);
                formData.append("rta_familyID", this.body_area['form'].familyId);
                formData.append('instanceID','uuid:'+instanceID)
                if(this.body_area.form.hasOwnProperty('metadata')){
                    for(let key in this.body_area.form.metadata){
                        if(formData.get(key) == null || formData.get(key) === ''){
                            formData.append(key,this.body_area.form.metadata[key])
                        }
                    }
                }
            },
            saveInstance: function(){
                document.getElementById(this.id_random+"-result").innerHTML = ''
                $('.submitButton-'+this.id_random).css({'display':'none'})
                $('.loader-submit-'+this.id_random).css({'display':'block'})
                this.body_area.fields.forEach(element => {
                    if(element.type == 'text'){}
                    else if(element.type == 'select_one' || element.type == 'select_multiple' || element.type == 'file'){
                        $('.input-'+this.id_random+'-'+element.name).prop("disabled",true)
                        $('.label-'+element.name+'-'+this.id_random).css({'opacity':'60%'})
                    }
                    else if(element.type == 'image'){}
                });
                let formData = new FormData($('#'+this.id_random)[0]);
                this.appendFormData(formData)
                if (vm.liteform[this.id_random] && vm.liteform[this.id_random].file) {
                    Object.entries(vm.liteform[this.id_random].file).forEach(([element, value]) => {
                        formData.set(element, value);
                    });
                }
                var that = this
                $.ajax({
                    url: this.body_area['form'].domain+'/webapp/webform/saveInstance?send=true',
                    async: true,
                    type: 'post',
                    dataType: 'json',
                    contentType: false,
                    processData: false,
                    data: formData,
                    success: function (result) {
                        if(result.status == 'error'){
                            document.getElementById(that.id_random+"-result").innerHTML = 'Error: '+result.title
                            $('#'+that.id_random+"-result").css({'color':'red'})
                        }
                        else{
                            document.getElementById(that.id_random+"-result").innerHTML = 'Successfully sent!'
                            $('#'+that.id_random+"-result").css({'color':'green'})
                        }
                        setTimeout(() => {
                            document.getElementById(that.id_random+"-result").innerHTML = ''
                        }, 1000);
                        that.resetForm()
                    },
                    error: function (jqXHR, status, msg) {
                        document.getElementById(that.id_random+"-result").innerHTML = 'Error!'
                        $('#'+that.id_random+"-result").css({'color':'red'})
                        that.resetForm()
                    },
                })
            },
            resetForm: function() {
                let that = this
                $('.submitButton-'+that.id_random).css({'display':'block'})
                $('.loader-submit-'+that.id_random).css({'display':'none'})
                $('#'+that.id_random+' input:not(.radio-select)').val('').change();
                $('#'+that.id_random+' p.filetext').text('');;
                $('#'+that.id_random+' label').has('img').css({'display':'none'});
                that.body_area.fields.forEach((element,index) => {
                    if(element.type == 'text'){
                        $('.input-'+that.id_random+'-'+element.name).prop("readonly",false)
                    }
                    else if(element.type == 'select_one' || element.type == 'select_multiple' || element.type == 'file'){
                        $('.input-'+that.id_random+'-'+element.name).prop("disabled",false)
                        $('.label-'+element.name+'-'+that.id_random).css({'opacity':'100%'})
                        if(element.type == 'file'){
                            that.$children[index].file_name = ''
                        }
                    }
                    else if(element.type == 'image'){
                        $('.labelImg-'+element.name+'-'+that.id_random).css({'display':'none'})
                        $('.camera.label-'+element.name+'-'+that.id_random).show()
                        try {
                            delete vm.liteform[that.id_random]['file'][element.name+'-rta-file-uploader']
                        } catch (error) {}
                    }
                    else if(element.type == 'video'){
                        that.$children[index].videoURL = ''
                        try {
                            delete vm.liteform[that.id_random]['file'][element.name+'-rta-file-uploader']
                        } catch (error) {}
                    }
                });
                that.arrayValue = []
            },
            handleReplaceListItem(){
                this.body_area = JSON.stringify(this.body_area)
                for(let key in this.list_item){
                    if (this.list_item.hasOwnProperty(key)) {
                        if(this.list_item[key]==null){
                            this.list_item[key]='';
                        }
                        this.body_area = this.body_area.replace(new RegExp('##'+key+'##','g'),typeof this.list_item[key] == 'number' ? this.list_item[key] : this.list_item[key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                    }
                }  
                for (var key in vm.flatRuntimeAttributes) {
                    if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                        this.body_area = this.body_area.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                    }
                }  
                if(this.body_area.indexOf('##')>-1){
                    this.body_area = this.body_area.replace(/##(.*?)##/g, "")
                }
                
                this.body_area = JSON.parse(this.body_area);
                this.body_area_tem = this.body_area
                this.questions = this.body_area['fields']
            },
            handleDataObject(){
                let that = this;
                let data = JSON.parse(JSON.stringify(this.list_data_object));
                that.body_area = JSON.stringify(that.body_area)
                for(let key in data[0]){
                    if (data[0].hasOwnProperty(key)) {
                        if(data[0][key]==null){
                            data[0][key]='';
                        }
                        that.body_area = that.body_area.replace(new RegExp('##'+key+'##','g'),typeof data[0][key] == 'number' ? data[0][key] : data[0][key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                    }
                }   
                for (var key in vm.flatRuntimeAttributes) {
                    if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                        that.body_area = that.body_area.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                    }
                } 
                if(that.body_area.indexOf('##')>-1){
                    that.body_area = that.body_area.replace(/##(.*?)##/g, "")
                }
                
                that.body_area = JSON.parse(that.body_area);
                that.body_area_tem = that.body_area
                that.questions = that.body_area['fields']
            },
        }
    })