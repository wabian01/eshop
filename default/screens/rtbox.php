<template id= 'rtbox'>
    <div class="col-md-12" style="height: 100%">
        <iframe :src="object.url" style="height:99%; width:100%;" frameborder = 0> </iframe>
    </div>
</template>
<script type="text/javascript">
    Vue.component('rtbox', {
        template: '#rtbox',
        props: ['object'],
        created: function () {
        },
        methods: {
            
        }
    })
</script>