<script type="text/javascript">
    Vue.component('component-content', {
        template: '#component-content',
        props: ['component','layout', 'subitem', 'comitem','show_all_object','showtab','webpublic'],
        data: function () {
            return {
                check:true,
                taskVirtual:'',
                flatRuntimeAttributes:'',
                current:'',
                firstRender:true,
                buttonTop:[],
            }
        },
        created: function () {
           $('.autofit_subdetail .filterdisplay').hide();
           $('.autofit_subdetail .searchdisplay').hide();
           vm.checkFilterSkipObject = 0;
           vm.activeScreenSkipObject = "";
           vm.componentABactive = false;
            let that=this;
            let buttons=[];
            Object.keys(that.component.objects).map(key=>{
              if(that.component.objects[key].screens[that.component.objects[key].root_screen].top_area.length>0 && that.component.objects[key].filtered_visible){
                  buttons=buttons.concat(that.component.objects[key].screens[that.component.objects[key].root_screen].top_area[0].buttons)
              }
            })
            vm.topBar[9999]=buttons;
            this.buttonTop = buttons
        },
        activated(){
            if(!this.firstRender){
              vm.flatRuntimeAttributes = {...this.flatRuntimeAttributes}
              vm.current = {...this.current}
              $('.autofit_subdetail .check_filter').hide()
              this.getScreen()
              vm.topBar[9999] = this.buttonTop
            }
        },
        deactivated(){
              this.firstRender = false
              this.flatRuntimeAttributes = {...vm.flatRuntimeAttributes}
              this.current = {...vm.current}
              $('.autofit_subdetail .check_filter').hide()
              this.$parent.reset_filter = !this.$parent.reset_filter
              this.$parent.show_filter =  !this.$parent.show_filter
              this.$parent.apply_filter = !this.$parent.apply_filter
        },
        methods: {
          getScreen(){
                this.$parent.closeSearch(this.component.code);
                vm.activeTaskCode='';
                vm.itemSearchString = '';
                vm.activeScreenCom=[];
                // vm.itemFilterAttributes="{}";
                if(
                    (!vm.module_power.hasOwnProperty(this.component.moduleCode)) ||
                    (!this.component.hasOwnProperty('power_needed')) ||
                    (parseInt(vm.module_power[this.component.moduleCode]) >= parseInt(this.component.power_needed)) ||
                    (this.component.unavailable_behavior != 'disable')
                ){
                    vm.jumpToComponent(this.component.code);
                }else{
                    toastr.error('You do not have enough power to use this item.');
                    event.preventDefault();
                    return;
                }
          },
          getHeightContent(){
            if(this.component.is_header === 1){
              return "";
            }else{
              if(this.webpublic){
                return 'height:calc(100vh - 40px);';
              }else{
                let height = 40
                if ($(".rta.page-header").length) {
                  if ($(".rta.page-header").is(":visible")) {
                      height += 50
                  } 
                } 
                if ($(".listTab").length) {
                  if ($(".listTab").is(":visible")) {
                      height += 30
                  } 
                } 
                return 'height:calc(100vh - '+height+'px);';
              }
            }
          },
          zoomTaskFromComponent:function(){
            vm.current={};
            vm.openTask(this.taskVirtual.object,this.layout, this.subitem, this.comitem)
          },
          createTaskVirtual:function(object){
            // vm.activeScreenCode = object.root_screen;
            if(vm.activeComponentCode !== '' && vm.activeComponentCode !== object.componentCode){
              return;
            }
            vm.activeScreenCom[object.code]=object.root_screen
            let task={
                code: 9999,
                comitem: null,
                get: null,
                html_content: "",
                isDeleted: false,
                layout: "tabs",
                object: object,
                openFromAB: "",
                post: null,
                subitem: null,
                title: object.modalTitle,
                where: null}
                this.taskVirtual=task
                return task;
          }
        },
    });
</script>