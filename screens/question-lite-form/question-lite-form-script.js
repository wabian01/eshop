Vue.component('question-lite-form', {
        template: '#question-lite-form',
        props: ['question','formid','one','body_area'],
        data: function(){
            return {
                value:'',
                checkedAnswer:[],
                webcam:{},
                file_name:'',
                statusWebcam:'none',
                media_recorder:null,
                blobs_recorded:[],
                camera_stream:null,
                videoURL:'',
                previouslySelected:'',
                lang: vm.lang,
            }
        },
        watch: {
            value(value){
                if(value!=""){
                    if(!this.$parent.arrayValue.includes(this.formid+this.question.name)){
                        this.$parent.arrayValue.push(this.formid+this.question.name)
                    } 
                }else{
                    let index = this.$parent.arrayValue.indexOf(this.formid+this.question.name)
                    this.$parent.arrayValue.splice(index,1);
                }
            },
            file_name(value){
                if(value!==""){
                    if(!this.$parent.arrayValue.includes(this.formid+this.question.name)){
                        this.$parent.arrayValue.push(this.formid+this.question.name)
                    } 
                }else{
                    let index = this.$parent.arrayValue.indexOf(this.formid+this.question.name)
                    this.$parent.arrayValue.splice(index,1);
                }
            },
            checkedAnswer:function(){
                if(typeof this.checkedAnswer == 'object'){
                    if(this.checkedAnswer.length>0){
                        if(!this.$parent.arrayValue.includes(this.formid+this.question.name)){
                            this.$parent.arrayValue.push(this.formid+this.question.name)
                        } 
                    }else{
                        let index = this.$parent.arrayValue.indexOf(this.formid+this.question.name)
                        this.$parent.arrayValue.splice(index,1);
                    }
                }
                else if(typeof this.checkedAnswer == 'string'){
                    if(this.checkedAnswer!==""){
                        if(!this.$parent.arrayValue.includes(this.formid+this.question.name)){
                            this.$parent.arrayValue.push(this.formid+this.question.name)
                        } 
                    }else{
                        let index = this.$parent.arrayValue.indexOf(this.formid+this.question.name)
                        this.$parent.arrayValue.splice(index,1);
                    }
                }
                if(this.one){
                    let formData = new FormData($('form')[vm['liteform'][this.formid].index]);
                    document.getElementById(this.formid+"-result").innerHTML = ''
                    this.$parent.appendFormData(formData)
                    if(typeof this.checkedAnswer == 'object'){
                        formData.set(this.question.name,Object.values(this.checkedAnswer).join(" "))
                    }
                    else if(typeof this.checkedAnswer == 'string'){
                        formData.set(this.question.name,this.checkedAnswer)
                    }
                    $('.input-'+this.formid+'-'+this.question.name).prop("disabled",true)
                    $('.label-'+this.question.name+'-'+this.formid).css({'opacity':'60%'})
                    let left = 0;
                    let formWidth = $('#'+this.formid).width();
                   let num = Object.keys(this.question.choices).length * $('#'+this.formid+' label').width()
                    left = (num / formWidth) * 80
                    var that = this
                    $('.loader-submit-'+this.formid).css({'left':left+'%','display':'block'})
                    $.ajax({
                        url: that.body_area['form'].domain+'/webapp/webform/saveInstance?send=true',
                        async: true,
                        type: 'post',
                        dataType: 'json',
                        contentType: false,
                        processData: false,
                        data: formData,
                        success: function (result) {
                            if(result.status == 'error'){
                                document.getElementById(that.formid+"-result").innerHTML = 'Error: '+result.title
                                $('#'+that.formid+"-result").css({'color':'red'})
                            }
                            else{
                                document.getElementById(that.formid+"-result").innerHTML = 'Successfully sent!'
                                $('#'+that.formid+"-result").css({'color':'green'})
                            }
                            setTimeout(() => {
                                document.getElementById(that.formid+"-result").innerHTML = ''
                            }, 1000);
                            $('.loader-submit-'+that.formid).css({'display':'none'})
                            $('.input-'+that.formid+'-'+that.question.name).prop("disabled",false)
                            $('.label-'+that.question.name+'-'+that.formid).css({'opacity':'100%'})
                        },
                        error: function (jqXHR, status, msg) {
                            $('.loader-submit-'+that.formid).css({'display':'none'})
                            document.getElementById(that.formid+"-result").innerHTML = 'Error!'
                                $('#'+that.formid+"-result").css({'color':'red'})
                            $('.input-'+that.formid+'-'+that.question.name).prop("disabled",false)
                            $('.label-'+that.question.name+'-'+that.formid).css({'opacity':'100%'})
                        },
                    })
                }
            }
        },
        created: function () {
            if(this.question.type == "text" && this.question.hasOwnProperty('default') && this.question.default!=='' && this.question.default.indexOf('##')<0){
                this.value = this.handleLanguege(this.question.default).replace(/<.*>(.*?)<.*>/g,"$1")
            }else if(this.question.type == "select_one" && this.question.hasOwnProperty('default') && this.question.default.trim()!==''){
                this.checkedAnswer = this.question.default
            }else if((this.question.type == "select_multiple" ) && this.question.hasOwnProperty('default') && this.question.default.trim()!==''){
                this.checkedAnswer = this.question.default
            }
            if(this.question.hasOwnProperty('default') && String(this.question.default).indexOf("##")>-1){
                this.$parent.status_load = true
            }else if(this.question.hasOwnProperty('default') && String(this.question.default).indexOf("##")===-1){
                this.$parent.status_load = false
            }
        },
        mounted:function(){
            $('#'+this.formid+'-'+this.question.name+'-modal').on("hidden.bs.modal",() =>{
                try {
                    this.media_recorder.stop();
                } catch (error) {}
                try {
                    this.webcam.stop();
                } catch (error) {}
                
            });
            if(this.question.type == "select_one" && this.question.hasOwnProperty('default') && this.question.default.trim()!==''){
                this.change(this.question.name,this.checkedAnswer,this.checkedAnswer)
            }
            if(this.question.type == "select_multiple" && this.question.hasOwnProperty('default') && this.question.default.trim()!==''){
                let that = this
                let multi = this.checkedAnswer.split(" ")
                this.checkedAnswer = []
                multi.map(value=>{
                    that.checkedAnswer = that.checkedAnswer.concat(value)
                    that.change(that.question.name,that.checkedAnswer,value)
                })
            }
        },
        methods: {
            uniqid:function(number) {
                return number + Date.now() * Math.random();
            },
            getRandomInt:function() {
                return Math.random() * Math.floor(100000);
            },
            uploadFile:function(e){
                if(e.target.files.length > 0) {
                    let file = e.target.files[0];
                    if(file.size >= 3145728){
                        Swal.fire({
                            title: this.lang=='en'?"<h5 style='color:red'>File limit reached (3MB) </h5>":"<h5 style='color:red'>Đã đạt đến giới hạn tệp (3MB) </h5>",
                            icon: 'warning',
                            confirmButtonText: this.lang=='en'?'RETRY':'Thử Lại'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                e.target.click()
                            }
                        })
                        return;
                    }
                    this.file_name = file.name
                    if(vm.liteform[this.formid]['file'] == undefined){
                        vm.liteform[this.formid]['file'] = {}
                    }
                    vm.liteform[this.formid]['file'][this.question.name+'-rta-file-uploader'] = file
                }
            },
            snap:function(){
                let picture = this.webcam.snap();
                let img = new Image(400);
                img.src = picture;
                $('.camera.label'+'-'+this.question.name+'-'+this.formid).hide()
                $('#'+this.formid+'-'+this.question.name+'-preview').html("").append(img)
                $('#'+this.formid+'-'+this.question.name+'-preview').css({'display':'inline-block'})
                $('#'+this.formid+'-'+this.question.name+'-preview img').css({'width':'3rem','height':'3rem'})
                $('#'+this.formid+'-'+this.question.name+'-modal').modal('hide')
                fetch(picture)
                .then(res => res.arrayBuffer())
                .then(buf=> {
                    let file = new File([buf], Date.now(), {type: "image/jpeg"});
                    if(vm.liteform[this.formid]['file'] == undefined){
                        vm.liteform[this.formid]['file'] = {}
                    }
                    vm.liteform[this.formid]['file'][this.question.name+'-rta-file-uploader'] = file
                    this.file_name = file.name
                })
            },
            startRecordVideo: async function(){
                let that = this
                that.blobs_recorded = []
                this.camera_stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                this.media_recorder = new MediaRecorder(this.camera_stream, { mimeType: 'video/webm;codecs=vp8,opus' });
                this.media_recorder.addEventListener('dataavailable', function(e) {
                    that.blobs_recorded.push(e.data);
                });
                this.statusWebcam = 'stop'
                this.media_recorder.start(1000);
            },
            stopRecordVideo(){
                this.media_recorder.stop();
                this.camera_stream.getTracks().forEach(track => track.stop())
                let video_record = new Blob(this.blobs_recorded, { type: 'video/mp4' })
                video_record.arrayBuffer()
                        .then(buf=> {
                            let file = new File([buf], Date.now()+'.mp4', {type: "video/mp4"});
                            this.videoURL = URL.createObjectURL(file)
                            let htmlStr = `<video width="640" height="480" controls style="width:100%;height: 350px"><source type="video/mp4" src="${this.videoURL}"/></video>`
                            setTimeout(() => {
                                $('#'+this.formid+'-'+this.question.name+'-previewvideo').html("").append(htmlStr)
                            }, 100);
                            if(vm.liteform[this.formid]['file'] == undefined){
                                vm.liteform[this.formid]['file'] = {}
                            }
                            vm.liteform[this.formid]['file'][this.question.name+'-rta-file-uploader'] = file
                            this.file_name = file.name
                            this.statusWebcam = 'record'
                            $('#'+this.formid+'-'+this.question.name+'-modal').modal('hide')
                    })
            },
            reupVideo(){
                this.file_name = ''
                this.videoURL = ''
                this.statusWebcam = 'none'
                this.webcam.start().then(res=>this.statusWebcam = 'record')
            },
            openModal:function(){
                let that = this
                let webcam = ''
                const webcamElement = document.getElementById(this.formid+"-"+this.question.name+'-webcam');
                const canvasElement = document.getElementById(this.formid+"-"+this.question.name+'-canvas');
                webcam = this.webcam = new Webcam(webcamElement, 'user', canvasElement, null);
                this.webcam.start()
                .then(result =>{
                    that.statusWebcam = 'record'
                })
                .catch(err => {6 
                    console.log(err);
                });
            },
            change:function(name,checkedAnswer,index){
                if(typeof checkedAnswer == 'string'){
                    if (checkedAnswer === this.previouslySelected) {
                        checkedAnswer = '';
                        this.checkedAnswer = ''
                    }
                    this.previouslySelected = checkedAnswer;
                    Object.keys(this.question.choices).forEach(element => {
                        if(element == checkedAnswer){
                             $('#'+name+'-'+element+'-'+this.formid).css({'background-color':'#009688','color':'white'})
                        }
                        else{
                            $('#'+name+'-'+element+'-'+this.formid).css({'background-color':'#e5e5e5','color':'black'})
                        }
                    });
                }
                else if(typeof checkedAnswer == 'object'){
                    if(checkedAnswer.includes(index)){
                        $('#'+name+'-'+index+'-'+this.formid).css({'background-color':'#009688','color':'white'})
                    }
                    else if(!checkedAnswer.includes(index)){
                        $('#'+name+'-'+index+'-'+this.formid).css({'background-color':'#e5e5e5','color':'black'})
                    }
                }
            },
            handleLanguege(value){
                if(this.lang==='vi'){
                    value = value.replace(/<en>.*<\/en>/,'')
                }else{
                    value = value.replace(/<vi>.*<\/vi>/,'')
                }
                return value;
            }
        }
    })