<template id= 'quick-filter'>
    <div class="col-md-12 scroll-quick" style="margin-bottom: 10px;white-space: nowrap;overflow: auto;text-align: right;">
        <div v-if="quickfilter.entries[0]!=='__daterange__' && quickfilter.entries[0]!=='__date__' && quickfilter.entries[0]!=='__daterecent__' && quickfilter.entries[0]!=='__datelast__'" >
            <span v-for="(option) in quickfilter.entries"  v-if=" option!=null" v-on:click="addData(option)" v-bind:class="{quick:true,changecolor:true ,active: listdata.indexOf(option)>-1}">
                {{ option }}
            </span>
        </div>
        <div v-if="quickfilter.entries[0]==='__daterange__' || quickfilter.entries[0]=='__date__'" class="wrap-datepicker-quickfilter" style="border-radius: 4px !important;display: flex;justify-content: flex-end;">
            <div v-if="quickfilter.entries[0]==='__daterange__' || quickfilter.entries[0]==='__date__'"  class="bootstrap-tagsinput">
                <span v-for="(html_test) in listdata" v-if="html_test !== '_all'" class="badge badge-info" >
                    <span style="display: flex;align-items: center;width: max-content;">
                        <span style="display: inherit;max-width: 380px;word-break: break-word;white-space: normal;text-align: left;font-weight:bold;padding:8px;font-size: 15px;">{{html_test}}</span>
                        <span  v-on:click="addData(html_test)" class="remove"></span>
                    </span>
                </span>
            </div>
            <div>
                <i v-if="quickfilter.entries[0]==='__daterange__'" class="flaticon-calendar" :id="'daterange_'+id" name="__daterange__"  style="color:#737373;float: right;height: 35px; width: 35px;text-align: center;vertical-align: middle;padding: 5px;font-size:1.2em;cursor:pointer;" ></i> 
                <i v-if="quickfilter.entries[0]==='__date__'" class="flaticon-calendar" :id="'date_'+id" name="__date__"  style="color:#737373;float: right;height: 35px; width: 35px;text-align: center;vertical-align: middle;padding: 5px;font-size:1.2em;cursor:pointer;"></i>
            </div>
            <input v-on:click="addDataTiem" :class="id+'myBtn'" autocomplete="off" style="display:none;"   type="text" >
        </div>
        <div v-if="quickfilter.entries[0]==='__daterecent__'" style="text-transform: uppercase;">
            <span v-for="(option) in quickfilter.entries"  v-if=" option!=null && option!='__daterecent__'" v-on:click="addDataRecent(option)" v-bind:class="{quick:true,changecolor:true ,active: checktime==option}">
                {{option.split(' ')[0]}} {{lang[option.split(' ')[1]] }}
            </span>
        </div>
        <div v-if="quickfilter.entries[0]==='__datelast__'" style="text-transform: uppercase;">
            <span v-for="(option) in quickfilter.entries"  v-if=" option!=null && option!='__datelast__'" v-on:click="addDataLast(option)" v-bind:class="{quick:true,changecolor:true ,active: checktime==option}">
                {{option.split(' ')[0]}} {{lang[option.split(' ')[1]] }}
            </span>
        </div>
    </div>
</template>