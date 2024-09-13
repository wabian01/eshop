const funcRenderTask = {
    methods: {
        funcRenderTask(task) {
            let check = 0;
            let taskcode = task.code;
            let taskold = task.code
            for (let i = 0; i < this.tasks.length; i++) {
                if (this.tasks[i].isDeleted) {
                    continue;
                } else {
                    if (this.tasks[i].object.code == task.object.code) {
                        if (check === 0) {
                            taskcode = i
                            if(task.object.type != 'form' && task.object.type != 'instance' && task.object.type != 'fill-form'){
                                this.tasks[i] = {...task}
                                this.tasks[i].code = taskcode
                            }
                        }
                        taskold = i
                        check++
                    }
                }
            }
            if (check > 1) {
                this.activeTaskCode = taskcode;
                if(task.object.type != 'form' && task.object.type != 'instance' && task.object.type != 'fill-form'){
                    task.isDeleted = true;
                    $("#task-modal-" +taskcode).show();
                    return false;
                }else{
                    this.tasks[taskold].isDeleted = true;
                    $("#task-modal-" +taskcode).show();
                    return true;
                }
            }
            // Handle dot actived icons task
            $('.taskbaricon').find(".just-been-actived").addClass("display-none");
            setTimeout(() => {
                $("#task-bar-icon-" +this.activeTaskCode).find(".just-been-actived").removeClass("display-none");
            }, 100);
            return true;
        },
    }
  }