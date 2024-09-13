<?php 
    $view = "index";
    include __DIR__ . '/appLoader.php';
    include __DIR__ . '/utils/common/style.php';
    include __DIR__ . '/utils/index/sso_init.php';
?>
<script>
    let module_view = 'rtcloud_webapp_modules',
        module_power_view = 'rtcloud_webapp_module_power';
</script>

<div id="root" style="display:none;"></div>
<div id="app">
    <ul 
        style="
            display:flex; 
            flex-direction: row-reverse; 
            margin-top: -42px;
            margin-bottom: auto;
            overflow-x: auto;
            scrollbar-width: none;
            position: relative;
            padding-top: 4px;
            z-index: 9999;
            padding-right: 10px;
            /* margin-left: 67%; */
            /* max-width: 260px; */
        "
    >
        <li 
            v-show="!task.isDeleted" 
            is="taskbar" 
            v-for="(task, code) in tasks" 
            :key="task.code" 
            :task="task">
        </li>
    </ul>
    <div 
        class="homepanel" 
        style="
            display: none;
            width: 60px; 
            height: 100%; 
            float: left; 
            background-color: #e5f7f3;
        " 
        onclick="handleHomePanelClick()"
    >
        <div id="home-webapp" style="text-align: center; margin-top: 17px;margin-bottom: 18px; cursor: pointer;">
            <a href="/webapp#/home" style="text-decoration: none;">
                <?php if(AppEnv::PLATFORM == "rtSurvey"){ ?>
                    <div style="width: 35px; height: 35px; margin: auto; background: #0f4c81; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <img src="https://cdn.rtworkspace.com/plugins/webapp/images/icon-home.svg" height="24px"/>
                    </div>
                <?php }else{ ?>
                    <div style="width: 35px; height: 35px; margin: auto; background: #009688; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <img src="https://cdn.rtworkspace.com/plugins/webapp/images/icon-home.svg" height="24px"/>
                    </div>
                <?php } ?>
            </a>
        </div>
        <div style="height: 0; width: 42px; border-bottom: 1px solid rgba(0,0,0,.2); margin: auto; text-align: center;"></div>
        <div 
            id="home-list-task" 
            class="tabbable-line tabs-below" 
            style="
                width:100%;
                height:auto; 
                overflow: auto;
            "
        >
            <ul class="nav nav-tabs" style="padding :0; ">
                <div class="more-icon display-none"> 
                    <i class="fas fa-ellipsis-v i-more" style="font-size: 16px; color: #000000;"></i>
                    <i class="fa fa-times i-close display-none" style="font-size: 16px; color: red;"></i>
                </div>
                <div class="title-close display-none" v-on:click="CloseAllTask()">
                    <p style="margin-top: 9px; float: left; margin-left: 5px;">
                        <?php echo Yii::t('app','Close all'); ?>
                    </p>
                </div>
            </ul>

        </div>
    </div>
    <div class="bootstrap-iso">
        <!-- BEGIN SESSION -->
        <div class="modal fade" id="sessionExp" role="dialog" data-backdrop="static" style="background-color: rgba(100, 100, 100, 0.8)">
            <div class="modal-dialog " style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);width:50%;">
                <div class="modal-content" style="background: #fff; border: 1px solid transparent; border-radius: 8px !important; box-shadow: 0 4px 8px 3px rgba(60,64,67,.15); z-index: 1003; padding: 24px;">    
                    <div class="modal-body">
                        <h2 style="color: #202124; font-family: Google Sans,Roboto,RobotoDraft,Helvetica,Arial,sans-serif; font-weight: 400; line-height: 28px;">
                            <?php echo Yii::t('app','Your session has expired'); ?>
                        </h2>
                        <span style="line-height: 1.4em;word-wrap: break-word;">
                            <?php echo Yii::t('app','Your site access has expired. To continue using our services, please log in again'); ?>
                        </span>
                        <div style="display: flex; justify-content: flex-end; margin-top: 24px">
                            <button type="button" class="btn btn-default" @click="loginSession" style="background-image: none; border: 1px solid transparent!important; border-radius: 4px !important; box-shadow: none; box-sizing: border-box; font-family: Google Sans,Roboto,RobotoDraft,Helvetica,Arial,sans-serif; font-weight: 500; font-size: 14px; height: 36px; letter-spacing: .25px; line-height: 16px; padding: 9px 24px 11px; background: #fff; border: 1px solid #dadce0!important; color: #1a73e8;">
                                <?php echo Yii::t('app','Login'); ?>
                            </button>
                        </div> 
                    </div>
                </div>
            </div>
        </div>
        <!-- END SESSION -->
        <div class="modal fade" id="multiObject" tabindex="-1">
                <div class="modal-dialog" style="margin-top: 90px;">
                    <div class="modal-content" style="padding: 30px;border-radius: 10px !important;max-height: 76vh;overflow: scroll;">    
                        <div class="modal-body">
                         <div v-for="object in multiObject">
                            <div class="card-image" style="display: flex;justify-content: center;margin-bottom: 20px;cursor: pointer;" v-on:click='openMultiObjectAB(object)'>
                                <img :src="object.background" style=" width: 270px;height: 90px;align-self: center;">
                                <div class="card" style="color: black;-height: 100%;float: right;padding-left: 22px;width: 100%;">
                                    <div class="card-title" style="text-transform: uppercase;font-size: 30px;text-align: left;font-weight: bold;padding-top: 20px;">{{object.title}}</div>
                                    <div class="card-desc" style="padding-top: 10px;text-align: left;font-size: 18px;">
                                    trong <a href="javascript:;" style="text-decoration: none;text-transform: uppercase;">{{object.nameModule}}</a>
                                    </div>
                                </div>
                            </div>
                         </div>
                        </div>
                    </div>
                </div>
        </div>
        <div class="modal fade" id="selectTheme" tabindex="-1" role="dialog">
                <div class="modal-dialog" style="margin: 90px auto;width:360px;">
                    <div class="modal-content">    
                        <div class="modal-body">
                            <div id="json_style"></div>
                        </div>
                    </div>
                </div>
        </div>
    </div>

    <div id="rightpanel" style=" height: ;float: left; ">
        <div class="splash-screen" style="width: 100%; height: 100%;">
            <div 
                style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    margin-top: -50px;
                    margin-left: -50px;
                    width: 100px;
                    height: 100px;
                    text-align: center;
                ">
                    <span class="newloader"></span>
            </div>
            <?php if(AppEnv::PLATFORM == "rtSurvey"){ ?>
                <div class="newloader-text" style="color: #0f4c81;">
                    Real-Time Survey...
                </div>
            <?php }else{ ?>
                <div class="newloader-text" style="color: #009688;">
                    Real-Time Workspace...
                </div>
            <?php } ?>    
        </div> 
        <iframe 
            id='ifmatrixchat' 
            class="position-fixed invisible"
            style="border:0;height: 100%; float: left;" 
            src="webapp/default/messaging/" 
            title="rtMessaging">
        </iframe>
        <div class="covered-screen display-none"> 
        <!-- PRE LOADER --> 
        <div style="width:350px;"  id="chatPreloader">
            <div style="text-align: center;">
                <img 
                    class="bg-image-chat"
                    src="/plugins/bootstrap-iso/img/empty_state_room_optimized.png"
                />
                <div style="margin-top: 80px;"> 
                    <img 
                        src="/plugins/bootstrap-iso/img/issue-1482-icon-chat.svg"
                        style="width: 80px; height: 80px;"
                    />
                    <p style="color: #bdbdbd; font-weight: bolder; margin-top: 5px;">
                        <?php echo Yii::t('app','Your room will be displayed here.<br>Please select existing ones<br>or start some of your own.'); ?>
                    </p>                                                   
                </div>
            </div>
        </div>   
        <div class="Initialzing">
            <div class="chatLoader"></div>
            <p><?php echo Yii::t('app','Initial Sync:</br>Waiting for server response...'); ?></p>
        </div> 

        <!-- CASE LOG IN FAILED --> 
        <div class="bg-notif-cases display-none">
            <div style="margin-top: 325px;">
                <p style="color:#8b8b8b; position:relative; font-size: 18px;" class ="notif-skip display-none">
                    <?php echo Yii::t('app','It seems to take a long time to respond.<br> Skip to continue waiting.'); ?>
                </p>
                <p style="color:#8b8b8b; position:relative; font-size: 18px;" class ="notif-logout display-none">
                    <?php echo Yii::t('app','It seems to take a long time to respond.<br> You should logout then login again.'); ?>
                </p>
                <p style="color:#8b8b8b; position:relative; font-size: 18px;" class ="notif-retry display-none">
                    <?php echo Yii::t('app','There was an error during loading.<br> Check your connection or retry.'); ?>
                </p>
                <p style="color:#8b8b8b; position:relative; font-size: 18px;" class ="notif-reload display-none">
                    <?php echo Yii::t('app','There was an error during loading.<br> You can retry chat or reload page.'); ?>
                </p>

                <button 
                    type="button" 
                    class="btn-skip display-none" 
                    onClick="skipNotif()"
                >
                    <i class="fa fa-forward"></i>&nbsp;&nbsp;<?php echo Yii::t('app','Skip'); ?>
                </button>
                
                <button 
                    type="button" 
                    class="btn-logout display-none" 
                    onClick="logoutPage()"
                >
                    <i class="fa fa-sign-in"></i>&nbsp;&nbsp;<?php echo Yii::t('app','Login again'); ?>
                </button>  
                <div style="display: flex; justify-content: space-evenly;">
                    <button type="button" class="btn-retry display-none" onClick="reTryChat()"><i class="fas fa-redo-alt"></i>&nbsp;&nbsp;<?php echo Yii::t('app','Retry chat'); ?></button> 
                    <button type="button" class="btn-reload display-none" onClick="reLoadPage()"><i class="fa fa-refresh"></i>&nbsp;&nbsp;<?php echo Yii::t('app','Reload page'); ?></button> 
                </div>
            </div>
        </div>

        <!-- CASE NO ROOM --> 
        <div class="bg-no-room display-none">
            <div style="text-align: center;">
                <img 
                    class="bg-image-chat"
                    src="/plugins/bootstrap-iso/img/empty_state_room_optimized.png"
                />
                <div style="margin-top: 80px;"> 
                    <img 
                        src="/plugins/bootstrap-iso/img/issue-1482-icon-chat.svg"
                        style="width: 80px; height: 80px;"
                    />
                    <p style="color: #bdbdbd; font-weight: bolder; margin-top: 5px;">
                        <?php echo Yii::t('app','Your room will be displayed here.<br> Please select existing ones<br>or start some of your own.'); ?>
                    </p>                                                   
                </div>
            </div>
        </div> 
        
        <div id="webapp_workspace" class="bootstrap-iso" style="height: 100%; float: right; overflow: scroll; ">
            <div id="loading-animation-webform" style="display:none;align-items:center;justify-content:center;height:100vh;padding-right:68px;margin-bottom:10px;position:relative;top:-28px;">
                <img width="100px;" src="https://cdn.rtworkspace.com/plugins/webapp/images/Spin-1s-200px-unscreen.gif">
            </div>
            <div id="fullpage" class="wellcome " >

                <div v-show="toastrWaiting" id="overlay">
                    <div class="lds-roller"></div>
                </div>

                <div v-for="(task, code) in tasks"  v-if="!task.isDeleted">
                    <!-- have screenTheme -->
                    <div  v-show="activeTaskCode === task.object.taskDepend" v-if="
                            (task.hasOwnProperty('components') && 
                            task.components.hasOwnProperty('screenTheme') && 
                            task.components.screenTheme != null && 
                            task.components.screenTheme != 'fullscreen') || 
                            (task.hasOwnProperty('object') && 
                            task.object.hasOwnProperty('screenTheme') && 
                            task.object.screenTheme != null && 
                            task.object.screenTheme != 'fullscreen')"
                    >
                        <div is="screentheme-view" :task="task"></div>
                    </div>
                    <!-- don't have screenTheme -->
                    <div v-else-if="!task.isDeleted && funcRenderTask(task)" v-show="activeTaskCode === task.code">
                        <div is="component-tab" v-if="task.hasOwnProperty('components')" :task="task"></div>
                        <div is="taskmodal" v-else :task="task"></div>
                    </div>    
                </div>
                <div v-show="level==0 && statusPopup && stateHome!=='SM_HOMEVIEW'" class="section top" id="wrap-welcome" style=" padding-bottom: 0px; width: 100%; background-color: #fff">
                    <div class="col-sm-10 col-centered" id="box-welcome" style="margin:auto; float: none">
                        <div class="col-sm-12 col-centered">
                        <?php if(AppEnv::PLATFORM == "rtSurvey"){ ?>
                            <div id="header" style="text-align:center;">
                                <h2 style="color: #0f4c81; margin: 0; padding-top: 10px; padding-bottom: 10px;font-weight:bold">REAL-TIME SURVEY</h2>
                            </div>
                        <?php }else{ ?>   
                            <div id="header" style="text-align:center;">
                                <h2 style="color: #009688; margin: 0; padding-top: 10px; padding-bottom: 10px;font-weight:bold">REAL-TIME WORKSPACE</h2>
                            </div>
                        <?php } ?>
                            <div style="padding-top: 20px; border-radius: 50%;">
                                <?php if (isset($current_user->avatar) && file_exists(AppEnv::BASE_PATH . DIRECTORY_SEPARATOR . 'images/avatar/' . $current_user->avatar)) { ?>
                                    <img style="border-radius: 50% !important; width: 100px; height: 100px;" src="<?php echo Yii::app()->baseUrl . '/images/avatar/' . $current_user->avatar; ?>">
                                <?php } else { ?>
                                    <img style="border-radius: 50% !important; width: 100px; height: 100px;" src="<?php echo Yii::app()->baseUrl . '/images/avatar/user-default.png'; ?>">
                                <?php } ?>
                            </div>
                            <div style="display: inline;"><h3 style="color: black;font-weight: 500; "><?php echo Yii::t('app','Welcome')?>, <?php echo $current_user->fullname; ?></h3></div>
                        </div>
                    </div>

                    <div class="col-sm-8 qoute col-centered" style="padding-top: 0px; padding-bottom: 30px; clear: both; float: none;">
                        <p id="HomePage_qoute" style="text-align: center ; font-size:16px;color: #007aff;" ></p>
                        <div class="actor" style="text-align: right; text-decoration: none;"><a   style="font-size: 18px; text-align: center;color:#737373;" id="actor"></a></div>
                    </div>
                </div>

                <div class="col-sm-12 workspace  section " id="webapp" style="padding-left:0px !important;" v-show="statusPopup">

                    <div  style="z-index:-1" class="h-module" :style="(level==0 || level==1)?'margin-bottom: 58px;':'margin-bottom:35px;'">

                        <div v-show="stateHome!=='SM_HOMEVIEW'" class="row" style="height: 33px;position: sticky;top: 0;z-index: 10;background-color: #f5f5f5;border-bottom: 1px solid rgb(230 222 222); margin-bottom: 9px;">
                            <div style="float: right;">
                            <div class="dropdown dropdown-search-module">
                                <span class="searchicon dropdown-toggle" data-toggle="dropdown" style="position: absolute;right: 15px;top: 6px;cursor: pointer;" @click="focusSearchInput()"><i class="fa fa-search"></i></span>
                                <div class="dropdown-menu dropdown-custom hold-on-click" style="transform: translate3d(-360px, 25px, 0px);overflow:auto;box-shadow: 3px 3px 10px #33323252;width:350px;border-radius:4px !important;">
                                    <div style="padding:8px;display:flex;align-items:center;height:50px;">
                                        <span style="flex-basis:5%;"><i class="fa fa-search" style="font-size:1.2em;color: #bdbdbd;"></i></span>
                                            <input v-on:input="searchModule" ref="searchModuleInput" style="font-weight:normal;color:black;height: 29px;flex-basis: 90%;border: none;padding: 0 10px;" type="text" class="search_module" placeholder="Search"/>
                                        <span v-show="inputSearchModule!=''" @click="clearSearchModule()" style="cursor:pointer;flex-basis:5%;"><i class="la la-times" style="font-size:1.2em;color: #737373;font-weight:bold;"></i></span>
                                    </div>
                                    <search-module-dropdown :modules="modules" :search="searchModuleValue" :searchtext="inputSearchModule">
                                    </search-module-dropdown>
                                </div>
                            </div>
                            </div>
                            <div style='float: left;padding: 5px 0px 0px 10px;'>
                                <?php if(AppEnv::PLATFORM == "rtSurvey"){ ?>
                                    <i class="fa fa-home" style="color:#0f4c81;"></i>
                                <?php }else{ ?>
                                    <i class="fa fa-home" style="color:#009688;"></i>
                                <?php } ?>
                                <a href="javascript:;" v-on:click="level = 0" style="text-decoration: none !important;color: black !important;border-right: 1px solid #bdbdbd;padding-right: 10px;">Home</a>
                            </div>
                            <div class="listTab">
                                <ul class="page-breadcrumb breadcrumb" style="text-align: left;padding: 7px 15px !important;padding-left: 10px;padding-bottom: 2px">
                                    <li v-for="(listTab,code) in listTabs"  >
                                        <span style="float:right;">
                                            <span v-if="show_button && level==1 && tabModuleActive===listTab.code" class="dropdown toparea">
                                                <span data-toggle="dropdown"  >
                                                    <span v-html="icon_button"></span>
                                                </span>
                                                <span class="dropdown-menu pull-right module_button" style="overflow: auto;max-height: 40vh; border-radius: 4px !important; box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 8px;">
                                                    <action-button v-for="(item_button,index) in item_buttons" :key="item_buttons" :indexsearch="true" :end="index==item_buttons.length-1" :item_button="item_button" :task="task"> </action-button>
                                                </span>
                                            </span>        
                                            <i v-on:click='removeTab(listTab)' class="fas fa-times-circle removeTab" ></i>
                                        </span>
                                        <a href="javascript:;" :class="{ active : tabModuleActive===listTab.code && level!==0}"  v-on:click="moveTabCurent(listTab)">
                                            {{ (listTab.label).replace(/(<([^>]+)>)/ig, "") }}
                                        </a>
                                    </li>
                                </ul>  
                            </div>   
                        </div>
                        
                        <div class="row">        
                            <action-button ref="actionbuttonCP" :task="taskCP" ></action-button>            
                            <action-button ref="callAB" :task="taskcallAB" ></action-button>    
                            <action-button ref="callABForm" :task="taskcallAB" :list_item="jsonDataParent" ></action-button>  
                            <div>
                                <div id="autofit_module_main" class="autofit_module" style="padding-left: 5px !important; padding-right: 6px !important;">
                                    <div v-if="renderHomeView" v-show="level == 0 && statusHomeView" class="home-view autofit_subdetail" style="grid-row: 1/4;grid-column: 1/4;overflow:auto;" :style="heightHomeView" :module="getModuleHomeView(modules)" is="home-view"></div>
                                    <div v-for="(module, code, index) in filterHiddenModules(modules)" v-show="level == 0 && module.filtered_visible">
                                        <module :module="module" :key="module.code" :setting_title="appSetting"></module>
                                    </div>
                                </div>
                                <!-- show submodules -->
                                <div class="autofit_module" >
                                    <div v-for="(submodule, code) in filterHiddenSubmodules(subModules)" v-show="level == 1 && submodule.filtered_visible">
                                        <submodule :submodule="submodule" :key="submodule.code" :modulitem="modules[activeModuleCode].hasOwnProperty('itemAppearance')?modules[activeModuleCode].itemAppearance:null"></submodule>
                                    </div>
                                </div>
                                <div class="autofit_subdetail" >
                                    <div v-for="(submodule, code,index) in filterHiddenSubmodules(subModules)"  v-if="activeColumn==-1 || activeColumn== index " class="item">
                                        <keep-alive >
                                            <submodule-detail v-if="level == 2 && (submodule.code == activeSubModuleCode || (activeSubModuleCode=='all' && activeModuleCode == submodule.moduleCode)) " :submodule="submodule" :key="submodule.code" :components="components" :objects="objects"></submodule-detail>
                                        </keep-alive> 
                                    </div>
                                </div>
                            </div>   
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div> 
        <!-- End covered-screen -->
    </div>
</div>
<?php 
    include __DIR__ . '/utils/loadTheme.php';
    include __DIR__ . '/worker.php';
    include __DIR__ . '/utils/index/loading_chat.php';
?>
