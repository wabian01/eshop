

<template id="system-fill-form-object">
    <div class="webapp-detailmodule" :id="object.formId">
        <div class="fillsystem-form-object"  v-on:click="vm.openTask(object,layout, subitem, comitem)">
            <span v-bind:style="{backgroundColor:b_color, color:'#fff'}" class="sub-fillform-title">
                    {{handleSubTitle(object.title)}}</span>
            <div class="f-label-middle">
                <label>{{handleTitle(object.title)}}</label>
                <span class="f-label">Version </span><span class="f-text">{{object.version}}</span>
            </div>
        </div>
    </div>

</template>

<script type="text/javascript">

    var background_color = ['#f36a5a', '#ff4b55', '#e43a45', '#e7505a', '#8e44ad', '#8775a7', '#337ab7', '#32c5d2', '#03b381', '#26c281', '#f4d03f']
    Vue.component('system-fill-form-object', {
        template: '#system-fill-form-object',
        props: ['object','layout', 'subitem', 'comitem'],
        data: { 
            b_color: '#f36a5a',
            column: 0,
        },
        created: function () {
            this.randomColor();
        },
        methods: {
            randomColor: function(){
                this.b_color = background_color[Math.floor(Math.random()*background_color.length)];
                this.showTitle = true;
            },

            handleSubTitle: function(title){
                for(var i=0; i<title.length; i++){
                    tt = title.charAt(i).toUpperCase(); 
                    if(tt.match(/[A-Z]/i)){
                        return tt
                    }
                }           
            },

            handleTitle: function(title){
                var tt = title.slice(0, 29) 
                if(tt.indexOf(' ') < 0){
                    var laststr = tt.lastIndexOf('_');
                    return title.slice(0, laststr+1)+' '+title.slice(laststr+1);
                }
                return title;
            },
            converter: function(s) {
                var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                s =  s.replace(/-/g, '/');
                var d = new Date(s);

                var hour = d.getHours();
                var weekday = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

                // return d.getFullYear() + ' ' + months[d.getMonth()] + ' ' + d.getDate() + ' | ' + (hour % 12) + ':' + d.getMinutes() + ' ' + (hour > 11 ? 'pm' : 'am');
                return d.getFullYear() + ' | ' +' '+ weekday[d.getDay()] +' '+ (hour % 12) + ':' + d.getMinutes() + ' ' + (hour > 11 ? 'pm' : 'am');

            }
        },
    });
</script>

