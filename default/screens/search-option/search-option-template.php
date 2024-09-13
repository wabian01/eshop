<template id="search-option">
    <div v-if="(filter.screen_code==vm.activeScreenCode) || (show_all_object && Object.keys(vm.activeScreenCom).map((e)=> { return vm.activeScreenCom[e];}).indexOf(filter.screen_code) >-1)" class="theme-option">
        <div style="color: #737373;padding-bottom: 5px; font-weight:bold;">
            {{filter.title}} 
        </div>
        <div v-if="filter.entries[0]==='__userinput__'"  class="bootstrap-tagsinput">
            <span v-for="(html_test) in html_tests" v-if="html_test !== '_all'" class="badge badge-info" >
                <span style="display: flex;align-items: center;width: max-content;">
                    <span style="display: inherit;max-width: 380px;word-break: break-word;white-space: normal;text-align: left;font-weight:bold;padding:8px;">{{html_test}}</span>
                    <span v-on:click="removeTag(html_test)" class="remove"></span>
                </span>
            </span>
        </div>
        <div v-if="filter.entries[0]==='__daterange__' || filter.entries[0]=='__date__'" class="wrap-datepicker-filter" style="border-radius: 4px !important;">
            <div v-if="filter.entries[0]==='__daterange__' || filter.entries[0]==='__date__'"  class="bootstrap-tagsinput">
                <span v-for="(html_test) in html_tests" v-if="html_test !== '_all'" class="badge badge-info" >
                    <span style="display: flex;align-items: center;width: max-content;">
                        <span style="display: inherit;max-width: 380px;word-break: break-word;white-space: normal;text-align: left;font-weight:bold;padding:8px;">{{html_test}}</span>
                        <span v-on:click="removeTag(html_test)" class="remove"></span>
                    </span>
                </span>
                <span v-if="filter.entries[0]==='__daterange__' && (html_tests.length == 0 || html_tests[0] == '_all')">Select date range</span>
                <span v-if="filter.entries[0]==='__date__' && (html_tests.length == 0 || html_tests[0] == '_all')">Select date</span>
            </div>
            <div>
                <i v-if="filter.entries[0]==='__daterange__'" class="flaticon-calendar" :id="'daterange_'+id" name="__daterange__"  style="color:#737373;float: right;height: 35px; width: 35px;text-align: center;vertical-align: middle;padding: 8px;font-size:1.2em;cursor:pointer;" ></i> 
                <i v-if="filter.entries[0]==='__date__'" class="flaticon-calendar" :id="'date_'+id" name="__date__"  style="color:#737373;float: right;height: 35px; width: 35px;text-align: center;vertical-align: middle;padding: 8px;font-size:1.2em;cursor:pointer;"></i>
            </div>
            <input v-on:click="createTag" v-show="activeDate"  class="myBtn" autocomplete="off" style="width: 100%;height: 35px;color: black;border: 1px solid #bdbdbd;padding: 5px;border-radius: 4px !important;margin-top:5px;"   type="text" placeholder="Enter to filter">
        </div>
        <div class="dropdown" ref="dropdownWrapSelect">
            <input ref="searchTagInput" v-on:keyup.enter="createTag" v-on:input="testSearch" v-if="filter.entries[0]==='__userinput__'"  autocomplete="off" style="width: 100%;height: 35px;color: black;border: 1px solid #bdbdbd;padding: 5px;border-radius: 4px !important;margin-top:5px;" type="text" placeholder="Enter to separate keywords"   @focus="addDataScroll" @blur="close">
            <div v-show="scrollData.length ==1 || scrollData.length >=2 && !(scrollData.length ==2 && scrollData[1]==null)" v-on:scroll="scrollDataDown" v-if="filter.entries[0]=='__userinput__' && filter.entries.length > 1" class="dropdown-menu dropdown-custom wrap-list-options" style="border: 0px;max-height:163px;overflow: auto;margin:0;border:0;box-shadow: 0px 0px 5px 5px #6666661a;padding: 12px 0 4px 0; border-radius: 4px !important;width:416px; margin-bottom:5px;">
                <label v-for="(option) in scrollData" v-if=" option!=='__userinput__' && option!=null" style="margin:0;margin-top:-4px;">
                    <input type="checkbox" style="display:none;" :value ="replaceOption(option)" :checked="html_tests.indexOf(option) >-1">
                    <span v-on:click="createTag1(option)" style="white-space: nowrap;width: 416px;color: black;overflow: hidden;text-overflow: ellipsis;border: none;cursor:pointer;" class="rta list-group-item">
                        {{option}}
                    </span>
                </label>
            </div>
        </div>
        <div v-if="filter.entries[0]!=='__userinput__' && filter.entries[0]!=='__daterange__' && filter.entries[0]!=='__date__' && filter.entries[0]!=='__datelast__' && filter.entries[0]!=='__daterecent__'" style="margin-bottom:-2px;">
            <span v-for="(option) in filter.entries" v-on:click="createTag1(option)" v-if=" option!=null" v-bind:class="{rta:true,changecolor:true, active: html_tests.indexOf(option)>-1 }">
                {{ option }}
            </span>
        </div>
        <div v-if="filter.entries[0]==='__daterecent__'" style="text-transform: uppercase;">
            <span v-for="(option) in filter.entries"  v-if=" option!=null && option!='__daterecent__'" v-on:click="addDataRecent(option)" v-bind:class="{rta:true,changecolor:true, active: checktime==option }">
                {{option.split(' ')[0]}} {{lang[option.split(' ')[1]] }}
            </span>
        </div>
        <div v-if="filter.entries[0]==='__datelast__'" style="text-transform: uppercase;">
            <span v-for="(option) in filter.entries"  v-if=" option!=null && option!='__datelast__'" v-on:click="addDataLast(option)" v-bind:class="{rta:true,changecolor:true, active: checktime==option }">
                {{option.split(' ')[0]}} {{lang[option.split(' ')[1]] }}
            </span>
        </div>
    </div>
</template>