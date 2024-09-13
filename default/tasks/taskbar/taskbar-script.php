<script type="text/javascript">

    Vue.component('taskbar', {
        template: '#taskbar',
        props: ['task'],
        data: function () {
           
        },
        created: function () {
           
        },
        mounted: function () {
            let arrColors = ['#009788','#fc5ee6','#33e142','#8894ac','#e7f615','#eb678c','#966a81','#f3b806','#8b5f5c','#44a9c7','#573b76','#dca8aa','#10e4f0','#9422f3']
            let bgColor = arrColors[Math.floor(Math.random() * arrColors.length)];
            if( this.task.object.background === null || 
                this.task.object.background === "" ||
                this.task.object.background === undefined
            ) {              
                $("#task-bar-icon-" + this.task.code).css({"background-color": bgColor})
            }
        },
        methods: {
            clickShowTask(task){
                event.preventDefault(); 
                event.stopPropagation();
                $('#task-modal-'+task.code).show();
                $('#ifmatrixchat').contents().find('.mx_Dialog_staticBackground').click();
                $('#ifmatrixchat').contents().find('.mx_ImageView_button_close').click();
                $('#ifmatrixchat').contents().find('.mx_ContextualMenu_background').click();
                vm.showTask(task)
            },
            addClassAppearance: function(itemAppearance){
                if(itemAppearance !== null){
                    classNameTask = itemAppearance.replace(/[^A-Z0-9]/ig, '');
                    return classNameTask + "task";
                }
            },
            handleClose(task) {
                if(task.object.type === 'form') {
                    if ($('#task-modal-'+task.code+' #i-wf').contents().find('.close-wf').length === 0) {
                        window.top.postMessage('close', '*');
                    } else {
                        $('#task-modal-'+task.code+' #i-wf').contents().find('.close-wf').click();
                    }     
                } else {
                    window.top.postMessage('close', '*');
                }   
                if(vm.listSreenTheme[task.code]?.length>0){
                    let list = vm.listSreenTheme[task.code]
                    list.map(code=>{
                        vm.tasks[code].isDeleted = true
                    })
                }
            }
        },
    });
</script>