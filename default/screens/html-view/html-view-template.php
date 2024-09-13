<template id="html-view">
    <div 
        v-if="isForm" 
        style="height: 100%; position: relative; top: -10px;"
    >
        <div 
            :id="id_random" 
            v-show="!stateUX" 
            v-html="item_content" 
            style="height: 100%; width: 100%;"
        ></div>
        <div 
            v-show="stateUX"
            style="
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
            "
        >
            <div
                class="d-flex align-items-center justify-content-between"
                style="
                    position: absolute; 
                    top: 0; 
                    left: 0; 
                    background: #f5f5f5; 
                    height: 40px; 
                    padding: 0 10px; 
                    border-bottom: 1px solid #e5e5e5; 
                    width: 100%;
                "
            >
            </div>
            <div 
                style="
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    height: 100%;
                "
            >
                <div style="text-align: center">
                    <span style="font-size: 15px; color: #000">
                        <?php echo Yii::t('app', 'Powered by RTA'); ?>
                    </span>
                    <div style="margin-top: 10px; height: auto">
                        <div class="loader-bar-container">
                            <div class="loader-bar-wrapper">
                                <div class="loading-bar-loader">          
                                    <div class="progress-track" style="border-radius: 4px !important;">
                                        <div class="progress-fill" style="border-radius: 4px !important;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div 
        v-else="isForm"
        :id="'bottomView-' + (bottom_area_code ? bottom_area_code : '')" 
        style="height: 100%; padding: 6px;"
    >
        <div 
            v-show="loadURL" 
            :style="layout !== '' ? 'height: 100%;' : 'height: calc(100vh - 50px);'"
            style="display: flex; align-items: center; justify-content: center; height: 100%;"
        >
            <div style="text-align: center">
                <span style="font-size: 15px; color: #000">
                    <?php echo Yii::t('app', 'Powered by RTA'); ?>
                </span>
                <div style="margin-top: 10px; height: auto">
                    <div class="loader-bar-container">
                        <div class="loader-bar-wrapper">
                            <div class="loading-bar-loader">          
                                <div class="progress-track" style="border-radius: 4px !important;">
                                    <div class="progress-fill" style="border-radius: 4px !important;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div 
            v-if="!content_http" 
            style="height: 100%;"
        >
            <div 
                v-if="item_content.indexOf('<script') == -1" 
                v-html="item_content" 
                :style="layout !== '' ? 'height: 100%; overflow: auto;' : ''"
            ></div>
            <div 
                v-else="item_content.indexOf('<script') > -1" 
                style="height: 100%; overflow: auto;"
            >
                <iframe 
                    v-if="screen_item.screenCode == vm.activeScreenCode || (task.code === 9999 && vm.activeScreenCom[object.code] == screen_item.screenCode)" 
                    :id="id_random" 
                    @load="checkIframe" 
                    :srcdoc="item_content" 
                    marginheight="0" 
                    marginwidth="0" 
                    frameborder="0" 
                    :style="layout !== '' ? 'height: 100%;' : 'height: 0px;'" 
                    style="height: 0px; width: 100%; transition: 0.5s;" 
                    scrolling="no"
                ></iframe>
            </div>
        </div>
        <div 
            v-else-if="content_http" 
            v-show="!loadURL"
            :style="
                task.object.hasOwnProperty('screenTheme') 
                ? (task.object.screenTheme == 'fullscreen'
                    ? 'height: 100%; position: relative; padding: 14px 20px 0 20px;' 
                    : task.object.screenTheme == 'popup-center' 
                        ? 'height: 100%; position: relative; padding: 4px;' 
                        : 'height: 100%; position: relative;'
                )
                : 'height: 100%; position: relative; top: -10px;'
            "
        >
            <iframe 
                v-if="screen_item.screenCode == vm.activeScreenCode || (task.code === 9999 && vm.activeScreenCom[object.code] == screen_item.screenCode)" 
                :src="item_content" 
                :id="'url-' + id_random" 
                @load="checkUrlIframe" 
                :style="layout !== '' ? 'height: 100%;' : 'height: calc(100vh - 50px);'" 
                style="width: 100%; transition: 0.5s;" 
                marginheight="0" 
                marginwidth="0" 
                frameborder="0" 
                allow="camera *; microphone *;"
            ></iframe>
        </div>
    </div>
</template>