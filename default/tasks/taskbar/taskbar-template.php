<template id="taskbar">
    <div style="margin-left: 14px">
        <a 
            :href="'#task-modal-' + task.code" 
            data-toggle="modal" 
            :id="'task-icon-'+task.code" 
            class="taskicon" 
            v-on:click="clickShowTask(task)"
            :style="
                ( task.hasOwnProperty('components') && task.components.hasOwnProperty('screenTheme') && (task.components.screenTheme == 'popup-center' || task.components.screenTheme == 'popup-bottom' || task.components.screenTheme == 'fullscreen' || task.components.screenTheme == 'popup-dynamic') ) ||
                ( task.hasOwnProperty('object') && task.object.hasOwnProperty('screenTheme') && (task.object.screenTheme == 'popup-center' || task.object.screenTheme == 'popup-bottom' || task.object.screenTheme == 'fullscreen' || task.object.screenTheme == 'popup-dynamic') )
                ? 'display: none'
                : ''
            "
        >
            <li 
                v-if="task.layout == 'tiles'" 
                :id="'task-bar-icon-'+task.code"
                :class="addClassAppearance(task.subitem)" 
                class="taskbaricon " 
                :class="{activetask: task.code == vm.activeTaskCode}" 
                :style="{ 'background-image': 'url(' + task.object.background + ')' }"
                style="
                    background-size: contain;
                    box-shadow: rgb(0 0 0 / 5%) 0px 15px 25px, rgb(0 0 0 / 10%) 0px 5px 10px;
                "
            > 
                <div class="close-icon" v-on:click="handleClose(task)">
                    <span style="color: #000000; font-size: 10px; font-weight: bolder; margin-left: 0.5px;">x</span>
                </div>
                <div class="just-been-actived display-none"></div>
                <div v-if="task.object.background == null ||task.object.background == ''">
                    <p class="taskbartitle">{{task.object.title.replace(/[^A-Z0-9]/ig, '').charAt(0)}}</p>
                </div>
                <ul class="title">
                    <li style="margin-top: 9px; float: left; margin-left: 5px;">
                        {{task.object.title}}
                    </li>
                </ul>
            </li>

            <li  
                v-else="task.layout == 'tabs'" 
                :id="'task-bar-icon-'+task.code"
                :class="addClassAppearance(task.comitem)"  
                class="taskbaricon " 
                :class="{activetask: task.code == vm.activeTaskCode}" 
                :style="{ 'background-image': 'url(' + task.object.background + ')' }" 
                style="
                    background-size: contain;
                    box-shadow: rgb(0 0 0 / 5%) 0px 15px 25px, rgb(0 0 0 / 10%) 0px 5px 10px;
                "
            > 
                <div class="close-icon" v-on:click="handleClose(task)">
                    <span style="color: #000000; font-size: 10px; font-weight: bolder; margin-left: 0.5px;">x</span>
                </div>
                <div class="just-been-actived display-none"></div>
                <div v-if="task.object.background == null ||task.object.background == ''">
                    <p class="taskbartitle">{{task.object.title.replace(/[^A-Z0-9]/ig, '').charAt(0)}}</p>
                </div>
                <ul class="title">
                    <li style="margin-top:9px; margin-bottom:9px; text-align:left; margin-left:5px;">
                        {{task.object.title}}
                    </li>
                </ul>
                <div :id="'task-bar-icon-err-'+task.code">
                    <span 
                        style="
                            color: #fff;
                            font-size: 13px;
                            font-weight: bolder;
                            display: none;
                            justify-content: center;
                            align-items: center;
                            border-radius: 50%;
                            width: 16px;
                            height: 16px;
                            background-color: #ff0000;
                            cursor: pointer;
                            position: absolute;
                            margin-top: 21px;
                            margin-left: 25px;
                        "
                    >
                        !
                    </span>
                </div>
            </li>  
        </a>
    </div>
</template>