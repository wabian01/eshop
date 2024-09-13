<template id= 'sort-filter'>
    <div class="" style="padding: 15px;">
        <div style="margin-bottom: 15px;">
            <div style="color: rgb(115, 115, 115);padding-bottom: 15px;font-weight: bold;">Order</div>
            <label style="cursor: pointer;">
                <input type="radio" value="ASC" v-model="order">
                <span>Ascending</span>
            </label>
            <label style="cursor: pointer;">
                <input type="radio" style="margin-left: 50px;" value="DESC" v-model="order">
                <span>Descending</span>
            </label>
        </div>
        <div>
            <div style="color: rgb(115, 115, 115);padding-bottom: 15px;font-weight: bold;">Field</div>
            <label v-for="(option) in vm.sortFilter[taskcode].entries">
                <input style="display:none" type="radio" :value="option.column" v-model="field">
                <span 
                    style="
                        background-color: #f5f5f5;
                        margin: 2px;
                        color: black;
                        padding: 5px 8px;
                        display: inline-block;
                        border-radius: 20px !important;
                        cursor: pointer;
                        border: 2px solid #f5f5f5;
                    " 
                    :style="field==option.column?'background-color: #fff;border: 2px solid #009688;':''"
                >
                    {{option.label}}
                </span>
            
            </label>
        </div>
        
        <div style="height:65px;padding:16px;display:flex; align-items: center; justify-content: flex-end;">
            <button @click="buttonCancel()" type="button" class="btn"  style ="font-weight:bold; width:100px; height:40px; background:#eee;color:#737373 !important; border:none;border-radius: 4px !important;">Cancel</button>    
            <button @click="buttonApply()" type="button" class="btn"  style ="font-weight:bold; width:100px; margin-left:10px; height:40px; background:#009688;color:#fff; border:none;border-radius: 4px !important;">Apply</button>
        </div>
            
    </div>
</template>
<script type="text/javascript">
    Vue.component('sort-filter', {
        template: '#sort-filter',
        props: ['taskcode'],
        data() {
            return{
                // Support default value sort menu for the first time.
                order: vm.sortFilter[this.taskcode].order === "ASC" ? "ASC" : "DESC",
                field: (vm.sortFilter[this.taskcode].hasOwnProperty('column') && vm.sortFilter[this.taskcode].column !== '') ? vm.sortFilter[this.taskcode].column : vm.sortFilter[this.taskcode].entries[0].column,
            }
        },
        created: function () {
            
        },
        methods: {
            buttonCancel(){
                $('.sortfilter-button div').removeClass('open')
            },
            buttonApply(){
                this.$parent.orderSortChange(this.order);
                if(this.taskcode==9999){
                    this.$parent.addComponentActive();
                }
                vm.sortFilter[this.taskcode].order = this.order;
                vm.sortFilter[this.taskcode].column = this.field;
                vm.stateSortFilter = !vm.stateSortFilter;
                $('.sortfilter-button div').removeClass('open')
                
            }
        }
    })
</script>