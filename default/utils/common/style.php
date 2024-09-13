<style>
    html, body {
        height: 100% !important;
        scrollbar-width: none;
    }
    .clear-both {
        clear: both;
    }
    #app {
        width: 100%;
    }

    #fullpage {
        padding-left: 0px !important;
    }

    #fullpage #webapp, #fullpage #wrap-welcome{
        padding-right: 0px !important;
    }

    .position{
        position: fixed;
        top: 0;
        text-align: center;
        z-index: 4 ;
        width: 100%;
    }

    .col-centered{
        float: none;
        margin: 0 auto;
        text-align: center;
        padding-top: 5px;
        padding-bottom: 10px
    }
    .icon {
        border-radius: 50% !important;
        width: 100px;
        height: 100px;
    }
    #HomePage_qoute {
        text-align: center ;
        font-size:16px
    }
    .actor{
        text-align: right;
        text-decoration: none;
    }
    .qoute{
        padding-top: 20px;
        padding-bottom: 30px
    }
    .workspace{
        clear: both;
        padding-bottom: 20px
    }
    .bootstrap-iso .row {
        margin-left: inherit!important;
        margin-right: inherit!important;
    }
    /*begin::toastr*/
    #app .lds-roller {
        z-index: 1000000;
        display: flex;
        position: fixed;
        width: 80px;
        height: 80px;
        left: 50%;
        top: 50%;
    }
    #app .lds-roller div {
        animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        transform-origin: 40px 40px;
    }
    .page-breadcrumb{
        margin-block-start: 0em !important;
        margin-block-end: 2px !important;
    }
    #app .lds-roller div:after {
        content: " ";
        display: block;
        position: absolute;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #fff;
        margin: -4px 0 0 -4px;
        color: green;
    }

    #app .lds-roller div:nth-child(1) {
        animation-delay: -0.036s;
    }
    #app .lds-roller div:nth-child(1):after {
        top: 63px;
        left: 63px;
    }
    #app .lds-roller div:nth-child(2) {
        animation-delay: -0.072s;
    }
    #app .lds-roller div:nth-child(2):after {
        top: 68px;
        left: 56px;
    }
    #app .lds-roller div:nth-child(3) {
        animation-delay: -0.108s;
    }
    #app .lds-roller div:nth-child(3):after {
        top: 71px;
        left: 48px;
    }
    #app .lds-roller div:nth-child(4) {
        animation-delay: -0.144s;
    }
    #app .lds-roller div:nth-child(4):after {
        top: 72px;
        left: 40px;
    }
    #app .lds-roller div:nth-child(5) {
        animation-delay: -0.18s;
    }
    #app .lds-roller div:nth-child(5):after {
        top: 71px;
        left: 32px;
    }
    #app .lds-roller div:nth-child(6) {
        animation-delay: -0.216s;
    }
    #app .lds-roller div:nth-child(6):after {
        top: 68px;
        left: 24px;
    }
    #app .lds-roller div:nth-child(7) {
        animation-delay: -0.252s;
    }
    #app .lds-roller div:nth-child(7):after {
        top: 63px;
        left: 17px;
    }
    #app .lds-roller div:nth-child(8) {
        animation-delay: -0.288s;
    }
    #app .lds-roller div:nth-child(8):after {
        top: 56px;
        left: 12px;
    }
    #chatPreloader {
        position: fixed;
        z-index: 22;
        height: 100%;
        float: left;
        background-color: #ffff;
        filter: brightness(0.7);
    }

    .bg-no-room {
        position: fixed;
        z-index: 999;
        height: 100%;
        width: 350px;
        float: left;
        background-color: #ffff;
        margin-top: 167px;
    }

    .display-flex {
        display: flex;
    }

    .bg-image-chat {
        margin-top: 170px;
        width: 355px;
        height: 340px;
    }

    .dot-loading {
        height: 8px;
        width: 8px;
        background-color: rgb(189, 189, 189);
        border-radius: 50%;
        display: inline-block;
    }
 
    .chatLoader {
        margin: auto;
        margin-top: 10px;
        right: 0;
        bottom: 0;
        left: 0;
        width: 20px;
        height: 20px;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        border: 3px solid #f3f3f3;
        border-radius: 50%;
        border-top: 3px solid #159588;
        border-bottom: 3px solid #159588;
        border-right: 3px solid #159588;
        -webkit-animation: spin 0.5s linear infinite;
        animation: spin 0.5s linear infinite;
    }

    .Initialzing{
        position: absolute;
        margin-top: 350px;
        text-align: center;
        color: gray;
        z-index: 24;
        background-color: white;
        width: fit-content;
        margin-left: 60px;
        font-size: 12px;
        border-radius: 4px;
        padding: 40px;
        padding-top: 7px;
        padding-bottom: 7px;
    }

    .bg-notif-cases  {
        position: fixed;
        z-index: 26;
        height: 100%;
        width: 350px;
        float: left;
        background-color: #f5f5f5;
        text-align: center;
    }

    .btn-skip, .btn-retry, .btn-reload, .btn-logout{
        cursor: pointer;
        position: relative;
        text-align: center;
        font-size: 16px;
        color: #ffff;
        background-color: #009688;
        border: none;
        border-radius: 4px;
        padding: 10px;
        padding-left: 20px;
        padding-right: 20px;
    }

    .display-none {
        display: none;
    }

    .display-none-important {
        display: none !important;
    }

    @keyframes lds-roller {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    #app #overlay {
        position: absolute; /* Sit on top of the page content */
        width: 100%; /* Full width (cover the whole page) */
        height: 100%; /* Full height (cover the whole page) */
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.5); /* Black background with opacity */
        z-index: 99999; /* Specify a stack order in case you're using a different order for other elements */
        cursor: pointer; /* Add a pointer on hover */
    }
    /*end::Toastr*/

    ::-webkit-scrollbar {
        -webkit-appearance: none!important;
        width: 2px !important;
        height: 3px !important;
    }
    ::-webkit-scrollbar-thumb {
        border-radius: 4px!important;
        background-color: rgba(0,0,0,.5)!important;
        -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5)!important;
    }

    .bootstrap-iso .portlet{
        margin-bottom: initial;!important;
    }

    .webapp-detailmodule{
        display: flex;
        flex-direction:column;
        border-left: none;
        border-right: none;
    }
    .fillsystem-form-object{
        width: 100%;
        min-height: 60px;
        background-color: #fff;
        padding: 16px;
        color: black !important;
        font-size: 13px;
        border-bottom: 1px solid #dddd;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .fillsystem-form-object .f-label-middle{
        flex-grow: 1;
        padding: 0 16px;
    }

    .fillsystem-form-object .f-label-middle label{
        margin-bottom: 4px;
        font-size:15px;
    }

    .fillsystem-form-object label{
        display: block;
        font-size:15px;
    }

    .fillsystem-form-object span.f-text{
        color: #737373;
        font-size: 13px;
    }
    .fillsystem-form-object span.f-label{
        color: #4caf50;
        font-size: 13px;
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

    .fillsystem-form-object span.sub-fillform-title{
        font-size: 1.3em;
        float: left;
        height: 35px;
        width: 35px;
        background-color: #bbb;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50% !important;
    }

    .fillsystem-form-object span.f-updatetime{
        float: right;
        font-size: 10px;
    }

    .fillsystem-form-object span.f-notification-badge{
        background-color: #2196f3;
        border-radius: 50% !important;
        width: 18px;
        height: 18px;
        text-align: center;
        color: #ffffff;
        font-size: 10px;
        display: inline-block;
        padding: 2px 3px;
    }

    .h-module .col-md-12 {
        padding-left: 0px !important;
        padding-right: 0px !important;
    }
    .search_module:focus{
        outline: 0;
    }
    .search_module:focus-visible{
        outline: 0;
    }
    .search_module::placeholder{
        color: #bdbdbd;
    }
    .dropdown.open > span.searchicon{
        color: #009688;
    }
    .listTab ul{
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        flex-wrap: nowrap;
    }
    .listTab li{
        justify-content: center;
        align-items: center;
    }
    .listTab a:hover i.removeTab{
        display:block;
    }
    .listTab i.fas.fa-times-circle.removeTab{
        display: none;
        float: right;
        padding-top: 3px;
    }
    .listTab ul li:hover i.fas.fa-times-circle.removeTab{
        display: inline-block;
        padding-left: 10px;

    }
    .listTab a{
        text-decoration: none !important;
        color: black !important;
        text-overflow: ellipsis;
        overflow: hidden;
        display: block;
    }
    .listTab ul li{
        border-right: 1px solid #bdbdbd;
        padding-right: 10px;
        padding-left: 10px;
        min-width: 10px;
        white-space: nowrap;
    }
    .listTab ul li:nth-child(1){
        padding-left: 0px;
    }
    .listTab ul li a.active {
        color:#009688 !important;
    }

    <?php if($view == 'indexDmview' || $view == 'dynamicTemplateUI'){ ?>
        .loading-animation {
            color: official;
            display: inline-block;
            position: absolute;
            width: 100%;
            height: 5px;
            left: 50%;
            top: 0;
            background:#ffe7c4;
            transform: translate(-50%, -50%);
        }
        .loading-animation div {
            display: inline-block;
            position: absolute;
            width: 50%;
            height: 5px;
            background: #ff9800;
            animation: loading-animation 1.2s ease infinite;
        }
        @keyframes loading-animation {
            from {left: 0px;}
            to {left: 100%;}
            0% {
                width: 20%;
            }
            50%{
                width: 50%;
            }
            100%{
                width: 20%;
            }
        }
        @media only screen and (max-width: 600px) {
            .filter-public {width: 200px !important;}
        }
        @media only screen and (min-width: 600px) {
            .filter-public {width: 250px !important;}
        }
        @media only screen and (min-width: 768px) {
            .filter-public {width: 350px !important;}
        }
        @media only screen and (min-width: 992px) {
            .filter-public {width: 400px !important;}
            .bootstrap-iso .col-md-12{
                float:unset !important;
            }
        }
        @media only screen and (min-width: 1200px) {
            .filter-public {width: 450px !important;}
        }
    <?php } ?>

    .display-block {
        display: block;  
    }

    .more-icon:hover {
        background-color: #eeeeee !important; 
    }

    .nav-tabs:hover .more-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        background-color: #ffffff;
        cursor: pointer;
        margin: 0 auto 10px auto;
        box-shadow: rgb(0 0 0 / 15%) 0px 15px 25px, rgb(0 0 0 / 10%) 0px 5px 10px;
    }

    .more-icon-actived {
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        background-color: #ffffff;
        cursor: pointer;
        margin: 0 auto 10px auto;
        box-shadow: rgb(0 0 0 / 15%) 0px 15px 25px, rgb(0 0 0 / 10%) 0px 5px 10px;
    }

    .title-close {
        position: absolute;
        z-index: 9999;
        list-style-type: none;
        margin-left: 18px;
        padding: 2px 10px 2px 10px ;
        float: right;
        color: #737373;
        font-size: 14px;
        font-weight: 600;
        background-color: #FFF;
        border-radius: 4px;
        border: 1px solid #bdbdbd;
        height: 35px;
        width: 341px;
        cursor: pointer;
    }

    .title-close:hover {
        color: #000000 !important;
        <?php if(AppEnv::PLATFORM == "rtSurvey"){ ?>
            background-color: #e7edf2 !important;
        <?php }else{ ?> 
            background-color: #e5f4f3 !important;
        <?php } ?>  
    }

    .taskbaricon1{
        display: flex; 
        justify-content: center;
        align-items: center;
        cursor: pointer;
        width: 35px; 
        text-align:center; 
        height: 35px; 
        margin-bottom: 10px; 
        border-radius: 50%; 
        list-style-type: none; 
        margin: 0 auto 10px auto; 
        background-color: #bdbdbd;
        box-shadow: rgb(0 0 0 / 15%) 0px 15px 25px, rgb(0 0 0 / 10%) 0px 5px 10px;
    }

    .taskicon1:hover .title1{
        display: block;
    }

    .title1 {
        display: none;  
        position: absolute;
        z-index: 9999;
        list-style-type: none;
        margin-left: 380px;
        padding: 10px 0px 10px 0px ;
        float: right;
        width: 320px;
        background-color: #FFF;
        border-radius: 4px;
        border: 1px solid #bdbdbd;
        cursor: pointer;
        top: 136px;
        min-height: 35px;
        max-height: 240px;
        height: fit-content;
        overflow: scroll;
        box-shadow: rgb(0 0 0 / 15%) 0px 15px 25px, rgb(0 0 0 / 10%) 0px 5px 10px;
    }

    .child-list {
        color: #737373;
        font-size: 14px;
        font-weight: 600;
        width: 100%;
        padding-top: 10px;
        padding-bottom: 10px;
        cursor: pointer;
    }

    .child-list:hover {
        color: #000000;
        <?php if(AppEnv::PLATFORM == "rtSurvey"){ ?>
            background-color: #e7edf2;
        <?php }else{ ?>
            background-color: #e5f4f3;
        <?php } ?>   
    }

    .newloader {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: inline-block;
        <?php if(AppEnv::PLATFORM == "rtSurvey"){ ?>
            border-top: 4px solid #0f4c81;
        <?php }else{ ?>
            border-top: 4px solid #009688;
        <?php } ?>  
        
        border-right: 4px solid transparent;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
    }
    .newloader::after {
        content: '';  
        box-sizing: border-box;
        position: absolute;
        left: 0;
        top: 0;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border-left: 4px solid #FF3D00;
        border-bottom: 4px solid transparent;
        animation: rotation 0.5s linear infinite reverse;
    }
    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    } 

    .newloader-text {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: 10px;
        margin-left: -90px;
        width: 200px;
        text-align: center;
        font-family: Nunito;
    }   

    .position-fixed {
        position: fixed;
    }
    .invisible {
        visibility: hidden;
    }
    
    @media only screen and (max-width: 991px){
        .page-header.navbar .menu-toggler.responsive-toggler {
            display: none !important;
        }
        .page-header.navbar .page-top {
            clear: unset;
            width: unset;
        }
    }
    @media only screen and (max-width: 800px) {
        .bootstrap-iso .nav.pull-right > li > #ddl_phonecall{
            left:0;
        }
        .page-header.navbar .page-top {
            clear: both;
            width: 100%;
        }
        .page-header.navbar .menu-toggler.responsive-toggler {
            display: inline-block !important;
        }
        .autofit_module {
            display: grid;
            grid-column-gap: 8px;
            grid-row-gap: 7px;
            grid-template-columns: repeat(auto-fill, minmax(180px,1fr));
        }
        .page-top {
            height: 0px !important;
            display: none !important;
        }
        .top-menu{
            width: 100% !important;
            <?php if(AppEnv::PLATFORM == "rtSurvey"){ ?>
                background-color: #0f4c81 !important;
            <?php }else{ ?>
                background-color: #009688 !important;
            <?php } ?> 
            margin: 1px 0 0 !important;
            padding: 0 !important;
            float: right;
        }
        .page-top.hidden-top{
            display: block !important;
        }
        .page-header-inner h4{
            font-size: 14px;
        }
        .rta.page-header.navbar .page-logo{
            width: 230px !important;
        }
        .filterdisplay .dropdown-menu{
            width: 75vw !important;
        }
        .filterdisplay .dropdown-menu.wrap-list-options{
            width: 100% !important;
        }
    }

</style>
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css"
      integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
      crossorigin=""/>
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.css" />
<script src="https://cdn.jsdelivr.net/npm/jsqr/dist/jsQR.js"></script>
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>
<link href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.min.css" rel='stylesheet' />
<script type="text/javascript" src="https://unpkg.com/webcam-easy/dist/webcam-easy.min.js"></script>
<script type="text/javascript" src="https://cdn.rtworkspace.com/plugins/webapp/md5/md5.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDuXMiMBmRbd_0TqsR9Sw0R_sh4rZ1HzZs"></script>
<script src="https://unpkg.com/leaflet@1.5.1/dist/leaflet.js"
        integrity="sha512-GffPMF3RvMeYyc1LWMHtK8EbPv0iNZ8/oTtHPx9/cc2ILxQ+u905qIwdpULaqDkyBKgOaB57QTMg7ztg8Jm2Og=="
        crossorigin=""></script>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.3/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.0.3/dist/leaflet.js"></script>
<link href="https://api.tiles.mapbox.com/mapbox-gl-js/v0.35.1/mapbox-gl.css" rel='stylesheet' />
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.3.0/dist/MarkerCluster.css" />
<link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.3.0/dist/MarkerCluster.Default.css" />
<script src="https://api.tiles.mapbox.com/mapbox-gl-js/v0.35.1/mapbox-gl.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.js"></script>
<script src="https://unpkg.com/leaflet.markercluster@1.3.0/dist/leaflet.markercluster.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet-easybutton@2/src/easy-button.css">
<script src="https://cdn.jsdelivr.net/npm/leaflet-easybutton@2/src/easy-button.js"></script>
<script src="https://cdn.rtworkspace.com/plugins/webapp/localforage/dist/localforage.min.js"></script>
<script src="https://cdn.rtworkspace.com/plugins/webform/js/sql-wasm.js"></script>
<script src="https://cdn.rtworkspace.com/plugins/webapp/encryptAES/aes.js"></script>
<script src="https://cdn.rtworkspace.com/plugins/webapp/jsonpath/jsonpath.js"></script>
