<template id="screentheme-view">
    <div 
        :class="'modal-fade '+task.object.code+' '+task.openFromAB" 
        :id="'task-modal-'+task.code" 
        role="dialog" 
        aria-hidden="true" 
        :style="
            typeTheme === 'popup-center'
            ? 'position: absolute; z-index: 999999; padding-top: 100px; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4);'
            : 'position: absolute; z-index: 999999;top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0, 0, 0, 0.4);'
        "
        v-on:click="closeScreenTheme(event)"
    >
        <div class="modal-dialog-modal-wide-webapp-modal" style="position: relative; display:block; z-index: 9999 !important;" >
            <div 
                :class="
                    (typeTheme === 'popup-center')
                    ? 'modal-content webapp-popup'
                    : 'modal-content webapp-popup screen-theme-bottom bt-h-40'
                " 
                style="height:calc(100vh - 90px);  box-shadow: none; border: none;"
                :style="
                    (typeTheme === 'popup-center')
                    ? 'position: relative; box-shadow: none; background-color: #fefefe; margin: auto; padding: 20px; border: 1px solid #888; width: 80%; overflow: auto; height:calc(88vh - 90px); border-radius: 14px !important;'
                    <!-- Testing: popup-dynamic/ popup-bottom  -->
                    : (typeTheme === 'popup-dynamic')
                        ? 'bottom: 0; background-color: #fefefe; padding: 20px; padding-top: 4px; border: 1px solid #888; width: 100%; position: fixed; border-top-left-radius: 14px !important; border-top-right-radius: 14px !important;'
                        : 'bottom: 0; background-color: #fefefe; padding: 20px; border: 1px solid #888; width: 100%; overflow: auto; position: fixed; border-top-left-radius: 14px !important; border-top-right-radius: 14px !important;'
                        
                "
            >
                <button 
                    style="
                        position: absolute;
                        border: none;
                        background: transparent; 
                        top: 5px;
                        right: 1px;
                        opacity: 0.7;
                        z-index: 1;
                        cursor: pointer;" 
                    type="button" 
                    data-dismiss="modal"  
                    v-show="typeTheme !== 'popup-bottom'"
                    v-on:click="closeTaskScreenTheme()"
                >
                    <i style="font-size: 20px;" class="fas fa-times-circle"></i>
                </button> 
                <div :id="'separator-' + this.task.code" class="i-separator" v-show="typeTheme === 'popup-dynamic'"></div>
                <div :class="'modal-body modal-'+task.object.code" style="width: 100%;overflow: scroll; scrollbar-width: none;">     
                <div class="sk-circle" style="display:none">
                    <div class="sk-circle1 sk-child"></div>
                    <div class="sk-circle2 sk-child"></div>
                    <div class="sk-circle3 sk-child"></div>
                    <div class="sk-circle4 sk-child"></div>
                    <div class="sk-circle5 sk-child"></div>
                    <div class="sk-circle6 sk-child"></div>
                    <div class="sk-circle7 sk-child"></div>
                    <div class="sk-circle8 sk-child"></div>
                    <div class="sk-circle9 sk-child"></div>
                    <div class="sk-circle10 sk-child"></div>
                    <div class="sk-circle11 sk-child"></div>
                    <div class="sk-circle12 sk-child"></div>
                </div>
                <template v-if="task.hasOwnProperty('components')">
                    <div
                        is="component-detail" 
                        v-if="task.hasOwnProperty('components') && task.components.hasOwnProperty('quick_view_object') && task.components.quick_view_object == 0"
                        :component="task.components"
                        :objects="task.components.objects"
                    >
                    </div>
                    <div v-else v-for="(object,code2,index2) in task.components.objects" class="autofit_subdetail" style="columns: unset;">
                        <screen
                            v-for="(screen, code) in object.screens" 
                            :screen="screen" 
                            :object="object" 
                            :task="createTaskVirtual(object)" 
                            checkcompo="true" 
                            :showtab="true" 
                            :skip_object="true"
                            >
                        </screen>
                    </div>
                </template>
                <template v-else>
                    <screen v-for="(screen, code) in task.object.screens" :screen="screen" :object="task.object" :task="createTaskVirtual(task.object)" ></screen>
                </template>
                </div>
            </div>
        </div>
    </div>
</template>