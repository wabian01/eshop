

<template id="system-instance-object">
    <div class="webapp-detailmodule">
        <div v-if="instance.showCheckbox != 1" class="fillsystem-form-object"  v-on:click="vm.openTask(instance,layout, subitem, comitem)">
            <div>
                <label>{{handleTitle(instance.title)}}</label>
                <span class="f-text">{{instance.version}}</span> - <span class="f-label">{{instance.updatedDate}}</span>
            </div>
        </div>
        <div v-else class="fillsystem-form-object">
            <div>
                <label style="padding-right:10px;">{{handleTitle(instance.title)}}</label>
                <span class="f-text">{{instance.version}}</span> - <span class="f-label">{{instance.updatedDate}}</span>
            </div>
            <label class="kt-checkbox" style="position:relative;">
                <input 
                    class="checkbox-instance"
                    v-on:change="handleChange" 
                    :checked="vm.selectedInstances.hasOwnProperty(instance.instanceID)?vm.selectedInstances[instance.instanceID]:false" 
                    :value="instance.instanceID" 
                    type="checkbox">
                <span></span>
            </label>
        </div>
    </div>

</template>
<style>
    .kt-checkbox {
	    margin-bottom: 5px;
    }

    .kt-checkbox span{
        border: 1px solid #d1d7e2;
        border-radius: 3px !important;
        background: none;
        position: absolute;
        top: -10px;
        right: 0;
        height: 18px;
        width: 18px;
        cursor: pointer;
    }
    .kt-checkbox input{
        position: absolute;
        z-index: -1;
        opacity: 0;
    }
    }

    .kt-checkbox > input ~ label{
        cursor: pointer;
    }

    .kt-checkbox > input:checked ~ font{
        font-weight: bold;
    }

    .kt-checkbox > input:checked ~ span {
        border: 1px solid #ffb822;
        background-color: #ffb822;
    }

    .kt-checkbox > input:checked ~ span::after {
        border: solid #ffffff;
        display: block;
    }
    .kt-checkbox > span:after {
        content: '';
        position: absolute;
        display: none;
        top: 50%;
        left: 50%;
        margin-left: -2px;
        margin-top: -6px;
        width: 5px;
        height: 10px;
        border-width: 0 2px 2px 0/*rtl:ignore*/ !important;
        -webkit-transform: rotate(45deg)/*rtl:ignore*/;
        transform: rotate(45deg)/*rtl:ignore*/;
    }
</style>
<script type="text/javascript">

    var background_color = ['#f36a5a', '#ff4b55', '#e43a45', '#e7505a', '#8e44ad', '#8775a7', '#337ab7', '#32c5d2', '#03b381', '#26c281', '#f4d03f']
    Vue.component('system-instance-object', {
        template: '#system-instance-object',
        props: ['instance','layout', 'subitem', 'comitem'],
        data: { 
            b_color: '#f36a5a',
            column: 0
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

            },
            handleChange:function (event) {
                const checkbox = $(event.target);
                vm.selectedInstances[checkbox.val()]=checkbox.prop("checked");
                $(".checkbox-instance").each(function(i, obj) {
                    if(this.checked){
                        $(".rta-button-send-instances").removeClass("rta-btn-disable");
                        return false;
                    }
                    if(!$(".rta-button-send-instances").hasClass("rta-btn-disable")){
                        $(".rta-button-send-instances").addClass("rta-btn-disable")
                    }
                });
            }
        },
    });
</script>

