<template id="home-view">
    <div :style="getBackgroundStyle()">
        <div v-for="(submodule, submoduleCode, submoduleIndex) in module.subModules" 
             v-if="submoduleIndex === 0" 
             :style="getHomeViewStyle()">
            <div v-for="(component, componentCode, componentIndex) in submodule.components" 
                 v-if="componentIndex === 0" 
                 :style="getHomeViewStyle()">
                <div v-for="(object, objectCode, objectIndex) in component.objects" 
                     :style="getHomeViewStyle()">
                    <screen  
                        v-for="(screen, screenCode) in object.screens" 
                        :screen="screen" 
                        :object="object" 
                        :task="createTaskVirtual(object)" 
                        checkcompo="true" 
                        :showtab="true" 
                        :skip_object="true">
                    </screen>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
Vue.component('home-view', {
    template: '#home-view',
    props: ['module'],
    methods: {
        createTaskVirtual: function(object) {
            vm.activeScreenCom[object.code] = object.root_screen;
            return {
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
                where: null
            };
        },
        getBackgroundStyle: function() {
            return vm.activeBgHomeview ? vm.bgcolorHomeview : '';
        },
        getHomeViewStyle: function() {
            return vm.stateHome === 'SM_HOMEVIEW' ? 'height: 100%;' : '';
        }
    }
});
</script>