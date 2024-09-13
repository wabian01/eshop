<script type="text/javascript">
    Vue.component('screentheme-view', {
        template: '#screentheme-view',
        props: ['task'],
        data: function () {
            return {
                typeTheme: this.task?.components?.screenTheme || this.task?.object?.screenTheme
            };
        },
        created: function () {
            $("#webapp_workspace").css("overflow","unset");
            if(!vm.listSreenTheme.hasOwnProperty(vm.activeTaskCode)){
                vm.listSreenTheme[vm.activeTaskCode] = [this.task.code]
            }else{
                vm.listSreenTheme[vm.activeTaskCode].push(this.task.code)
            }
        },
        mounted: function (){
            $(".modal").on("shown.bs.modal", function () {
                if ($(".modal-backdrop").length > 1) {
                    $(".modal-backdrop").not(':first').remove();
                }
            });
            var that = this;
            // Handling click event
            $( "#separator-" + that.task.code ).click(function() {
                if ($("#task-modal-" + that.task.code + " .screen-theme-bottom").hasClass("bt-h-90")) {
                    $("#task-modal-" + that.task.code + " .screen-theme-bottom").addClass("bt-h-40").removeClass("bt-h-90")
                } else {
                    $("#task-modal-" + that.task.code + " .screen-theme-bottom").addClass("bt-h-90").removeClass("bt-h-40")
                }    
            });
            
            // Handling mousemove event
            $("#separator-" + that.task.code).mousedown(function() {
                $(document).mousemove(function(event) {
                    if (event.pageY < 300) {
                        $("#task-modal-" + that.task.code + " .screen-theme-bottom").addClass("bt-h-90").removeClass("bt-h-40")
                    } 
                    if (event.pageY > 550) {
                        $("#task-modal-" + that.task.code + " .screen-theme-bottom").addClass("bt-h-40").removeClass("bt-h-90")
                    }
                });
            });
            // Remove mousemove event
            $(document).mouseup(function() {
                $(document).unbind("mousemove");
            });
        },
        beforeDestroy: function(){
            if(vm.listSreenTheme[vm.activeTaskCode]?.length === 0){
                $("#webapp_workspace").css("overflow","scroll");
            }
        },
        methods: {
            createTaskVirtual:function(object){
                vm.activeScreenCom[object.code]=object.root_screen
                let task={
                    code: 9999,
                    comitem: null,
                    get: this.task.get,
                    html_content: "",
                    isDeleted: false,
                    layout: "tabs",
                    object: object,
                    openFromAB: "",
                    post: this.task.post,
                    subitem: null,
                    title: object.modalTitle,
                    where: this.task.where}
                    return task;
            },
            closeScreenTheme:function(event) {
                let scModalContainer, scModal;
                if (this.typeTheme === "popup-center") {
                    scModalContainer = document.getElementById('task-modal-'+this.task.code);
                    scModal = document.getElementById('task-modal-'+this.task.code).getElementsByClassName('modal-dialog-modal-wide-webapp-modal')[0];
                } else {
                    scModal = document.getElementById('task-modal-'+this.task.code);
                }
                    
                if (event.target == scModal || event.target == scModalContainer) {
                    this.closeTaskScreenTheme();
                }
            },
            closeTaskScreenTheme(){
                let list = vm.listSreenTheme[vm.activeTaskCode]
                let taskcode = this.task.code
                if(vm.listSreenTheme[vm.activeTaskCode]?.length>0){
                    vm.listSreenTheme[vm.activeTaskCode].pop()   
                    vm.tasks[taskcode].isDeleted = true;
                    setTimeout(function() {
                        $('#task-modal-'+taskcode).remove();
                        $('#task-icon-'+taskcode).remove();
                    }, 200)
                }else{
                    vm.tasks[taskcode].isDeleted = true;
                    setTimeout(function() {
                        $('#task-modal-'+taskcode).remove();
                        $('#task-icon-'+taskcode).remove();
                    }, 200)
                }
            }
        },
    });
</script>