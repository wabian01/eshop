<style type="text/css">
    .webapp-detailmodule{
        display: flex;
        flex-direction:column;
        border-left: 1px solid #dddd;
        border-right: 1px solid #dddd;
    }    
    .fillform-item{
        width: 100%;
        min-height: 60px;
        background-color: #fff;
        padding: 10px;
        color: black !important;
        font-size: 13px;
        border-bottom: 1px solid #dddd;
        cursor: pointer;
    }

    .fillform-item label{
        display: block;
    }
    
    .fillform-item span.f-text{
        color: #585252;
        font-size: 12px;
    }
    .fillform-item span.f-label{
        color: #585252;
        font-size: 12px;
    }

    .header-detail {
        width: 100%;
        min-height: 40px;
        line-height: 45px;
        background-color: #009688;
        padding-left: 20px;
        color: #fff !important;
        font-size: 16px;
    }

    .fillform-item span.sub-fillform-title{
        font-weight: 600;
        float: left;
        height: 30px;
        width: 30px;
        background-color: #bbb;
        display: inline-block;
        margin: 6px;
        padding: 7px 0 0 10px;
        border-radius: 50% !important;
    }

    .fillform-item span.f-updatetime{
        float: right;
        font-size: 10px;
    }
</style>

<template id="detailmodule">
    <div>
        <div v-if="detailmodule.code === 'SM_FILLFORM'">
            <div class="header-detail" v-show="parseInt(Object.keys(detailmodule.component).length/6) > i || (Object.keys(detailmodule.component).length%6 != 0 && parseInt(Object.keys(detailmodule.component).length/6) == i)">
                <span class="caption-subject uppercase">{{detailmodule.code}}</span>         
            </div>
            <div class="webapp-detailmodule">
                <div class="fillform-item" v-for="component in detailmodule.component" v-if="parseInt(component.indexColumn/6)%3 == i" v-on:click="vm.openTask(component.object)">
                    {{randomColor()}}    
                    <span v-bind:style="{backgroundColor:b_color, color:'#fff'}" class="sub-fillform-title">
                    {{handleSubTitle(component.title)}}</span>
                   <label>{{handleTitle(component.title)}}</label>                   
                   <span class="f-label">Version </span><span class="f-text">{{component.version}}</span>
                </div>
            </div>
        </div>
        <div v-else-if="detailmodule.code === 'SM_REPORT'">
            <div class="header-detail" v-show="parseInt(Object.keys(detailmodule.component).length/6) > i || (Object.keys(detailmodule.component).length%6 != 0 && parseInt(Object.keys(detailmodule.component).length/6) == i)">
                <span class="caption-subject uppercase">{{detailmodule.code}}</span>         
            </div>
            <div class="webapp-detailmodule">
                <div class="fillform-item" v-for="component in detailmodule.component" v-on:click="vm.openTask(component.object)" v-if="parseInt(component.indexColumn/6)%3 == i">
                    {{randomColor()}}   
                    <span v-bind:style="{backgroundColor:b_color, color:'#fff'}" class="sub-fillform-title">{{handleSubTitle(component.title)}}</span>
                    <label>{{handleTitle(component.title)}}</label>                   
                    <span class="f-label">Version </span><span class="f-text">{{component.version}}</span>
                    <span class="f-label f-updatetime">{{converter(component.updatetime)}}</span>
                </div>
            </div>
        </div>   
    </div>
</template>

<script type="text/javascript">

    var background_color = ['#f36a5a', '#ff4b55', '#e43a45', '#e7505a', '#8e44ad', '#8775a7', '#337ab7', '#32c5d2', '#03b381', '#26c281', '#f4d03f']
    Vue.component('detailmodule', {
        template: '#detailmodule',
        props: ['detailmodule', 'i'],
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
                for(i=0; i<title.length; i++){
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

