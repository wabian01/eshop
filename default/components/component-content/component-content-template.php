<template id="component-content">
    <div class="webapp-item" :style="getHeightContent()" style="padding:10px; padding-left:0;padding-right:0;" >
        <div class="lds-spinner loading-animation" style="display:none;overflow:hidden;">
            <div></div>
        </div>
        <div 
            v-if="object.filtered_visible" 
            v-for="(object, code) in component.objects" 
            :style="show_all_object?'':'height:100%'"
        >
            <screen  
                v-for="(screen, code) in object.screens" 
                :screen="screen" 
                :object="object" 
                :task="createTaskVirtual(object)" 
                checkcompo="check" 
                :showtab="showtab" 
                :skip_object="show_all_object"
            >
            </screen>
        </div>
    </div>    
</template>