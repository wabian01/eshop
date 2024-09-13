<template id="screen">
    <div :id="screen.code"
         v-show="newwebapp?(vm.activeScreenCom[object.code]!= undefined && vm.activeScreenCom[object.code]==(this.screen.code)):task.code===9999?((((vm.activeScreenCom[object.code]!= undefined && vm.activeScreenCom[object.code]==(this.screen.code) && vm.previousScreenCode==='') || (vm.activeScreenCom[object.code]!= undefined && this.screen.code==vm.activeScreenCode && vm.previousScreenCode!=='') ) && (vm.activeScreenSkipObject==='' || Object.keys(vm.activeScreenComPre).length>0))||(vm.activeScreenSkipObject==this.screen.code && Object.keys(vm.activeScreenComPre).length==0 && vm.activeScreenComPre!==false)):((this.object_temp.root_screen.indexOf(this.screen.code) > -1 && vm.activeScreenCode == '') || vm.activeScreenCode==(this.screen.code)  || this.screen.code==(vm.activeScreenCode) )"
         class="modal-body" style="height: 100% !important; position: relative;" :style="bgColor"
    >
        <body-area 
            v-for="(body_area, code) in screen.body_area" 
            :skip_object="skip_object" 
            :screen="screen" 
            :body_area="body_area"
            :object="object_temp" 
            :scroll_to_end="scroll_to_end" 
            :task="task" 
            :status_ref="statusRefresh" 
            :list_data_object="list_data_object"
        >
        </body-area>
        <floating_button 
            v-if="screen.hasOwnProperty('floating_buttons')"
            :object="object_temp"
            :screen="screen"
            :refresh_rate="vm.refresh_rate"
            :task="task"
            :style="styleFloat"
            :json_holder="vm.jsonHolder"
            :list_data_object="list_data_object"
        >
        </floating_button>
        <div v-if="bottom_area.length>0" class="bottom_area_view" >
            <div class="bottom_width" ref="bottomArea" :class="statusBottom?'active':''" style="position: fixed;width:100%;min-height:3%;max-height: 50%;overflow:auto;bottom:0%;border-top: 1px solid #ccc;border-radius: 5px !important;box-shadow: -2px -5px 10px grey;background-color: white;padding: 0px 30px !important;z-index:4;" @wheel.self="scrollContentBottom(event)">
                <div style="text-align: center;margin-top: 3px;position: sticky; top: 0px; background-color: white; z-index: 4;"> 
                    <i class="fa fa-bars" style="border-radius: 10px;padding: 4px 15px;" @click="statusBottom=!statusBottom"></i>
                </div>
                <bottom-area v-if="!skip_object" v-for="(bottom_area, code) in bottom_area" :checkcompo='checkcompo != undefined ? true : false' :screen="screen" :bottom_area="bottom_area" :object="object_temp" :scroll_to_end="scroll_to_end" :task="task" :list_data_object="list_data_object" :status_ref="statusRefresh"> </bottom-area>
            </div>
            <div v-show="statusBottom" class="bottom_width" style="text-align: center;margin-top: 3px;position: fixed;bottom: 5px;width:100%;z-index:4"> 
                    <i class="fa fa-bars" style="border-radius: 10px;padding: 4px 15px;background-color: #ededed;" @click="statusBottom=!statusBottom"></i>
            </div>
        </div>
    </div>
</template>