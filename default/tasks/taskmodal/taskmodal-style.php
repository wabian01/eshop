<style>
    .loading-animation-taskmodal {
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
    .loading-animation-taskmodal div {
        display: inline-block;
        position: absolute;
        width: 50%;
        height: 5px;
        background: #ff9800;
        animation: loading-animation-taskmodal 1.2s ease infinite;
    }
    @keyframes loading-animation-taskmodal {
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
    .rta-webapp-popup-functional-button li:hover{
        background: #ffffff24;
    }
    .rta-kt-sticky-toolbar .rta-kt-sticky-toolbar-item, .rta-webapp-popup-functional-button li button{
        margin: 0;
        padding: 0;
        width: 40px;
        height: 49px;
    }
    .rta-kt-sticky-toolbar .rta-kt-sticky-toolbar-item, .rta-webapp-popup-functional-button li button:hover{
        background: transparent;
        color: #fff !important;
    }
    .sk-circle {
        margin: 35% 45%;
        width: 40px;
        height: 40px;
        position: absolute;
    }
    .sk-circle .sk-child {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }
    .sk-circle .sk-child:before {
        content: '';
        display: block;
        margin: 0 auto;
        width: 15%;
        height: 15%;
        background-color: #009688;
        border-radius: 100%;
        -webkit-animation: sk-circleBounceDelay 1.2s infinite ease-in-out both;
        animation: sk-circleBounceDelay 1.2s infinite ease-in-out both;
    }
    .sk-circle .sk-circle2 {
    -webkit-transform: rotate(30deg);
        -ms-transform: rotate(30deg);
            transform: rotate(30deg); }
    .sk-circle .sk-circle3 {
    -webkit-transform: rotate(60deg);
        -ms-transform: rotate(60deg);
            transform: rotate(60deg); }
    .sk-circle .sk-circle4 {
    -webkit-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
            transform: rotate(90deg); }
    .sk-circle .sk-circle5 {
    -webkit-transform: rotate(120deg);
        -ms-transform: rotate(120deg);
            transform: rotate(120deg); }
    .sk-circle .sk-circle6 {
    -webkit-transform: rotate(150deg);
        -ms-transform: rotate(150deg);
            transform: rotate(150deg); }
    .sk-circle .sk-circle7 {
    -webkit-transform: rotate(180deg);
        -ms-transform: rotate(180deg);
            transform: rotate(180deg); }
    .sk-circle .sk-circle8 {
    -webkit-transform: rotate(210deg);
        -ms-transform: rotate(210deg);
            transform: rotate(210deg); }
    .sk-circle .sk-circle9 {
    -webkit-transform: rotate(240deg);
        -ms-transform: rotate(240deg);
            transform: rotate(240deg); }
    .sk-circle .sk-circle10 {
    -webkit-transform: rotate(270deg);
        -ms-transform: rotate(270deg);
            transform: rotate(270deg); }
    .sk-circle .sk-circle11 {
    -webkit-transform: rotate(300deg);
        -ms-transform: rotate(300deg);
            transform: rotate(300deg); }
    .sk-circle .sk-circle12 {
    -webkit-transform: rotate(330deg);
        -ms-transform: rotate(330deg);
            transform: rotate(330deg); }
    .sk-circle .sk-circle2:before {
    -webkit-animation-delay: -1.1s;
            animation-delay: -1.1s; }
    .sk-circle .sk-circle3:before {
    -webkit-animation-delay: -1s;
            animation-delay: -1s; }
    .sk-circle .sk-circle4:before {
    -webkit-animation-delay: -0.9s;
            animation-delay: -0.9s; }
    .sk-circle .sk-circle5:before {
    -webkit-animation-delay: -0.8s;
            animation-delay: -0.8s; }
    .sk-circle .sk-circle6:before {
    -webkit-animation-delay: -0.7s;
            animation-delay: -0.7s; }
    .sk-circle .sk-circle7:before {
    -webkit-animation-delay: -0.6s;
            animation-delay: -0.6s; }
    .sk-circle .sk-circle8:before {
    -webkit-animation-delay: -0.5s;
            animation-delay: -0.5s; }
    .sk-circle .sk-circle9:before {
    -webkit-animation-delay: -0.4s;
            animation-delay: -0.4s; }
    .sk-circle .sk-circle10:before {
    -webkit-animation-delay: -0.3s;
            animation-delay: -0.3s; }
    .sk-circle .sk-circle11:before {
    -webkit-animation-delay: -0.2s;
            animation-delay: -0.2s; }
    .sk-circle .sk-circle12:before {
    -webkit-animation-delay: -0.1s;
            animation-delay: -0.1s; }

    @-webkit-keyframes sk-circleBounceDelay {
        0%, 80%, 100% {
            -webkit-transform: scale(0);
                    transform: scale(0);
        } 40% {
            -webkit-transform: scale(1);
                    transform: scale(1);
        }
    }

    @keyframes sk-circleBounceDelay {
        0%, 80%, 100% {
            -webkit-transform: scale(0);
                    transform: scale(0);
        } 40% {
            -webkit-transform: scale(1);
                    transform: scale(1);
        }
    }
  
    @media (min-width: 768px){
        .bootstrap-iso .modal-dialog {
            width: 75%;
        }
        .modal-body{
            height:100% !important;
        }
    }
    #app .modal-body{
        height:100% !important;
    }

    #app .modal-content {
        color: initial !important;
    }
    .rta-webapp-popup-functional-button .btn-group{
        display: block;
    }
    input.rta.empty {
        font-family: FontAwesome;
        font-style: normal;
        font-weight: normal;
        text-decoration: inherit;
    }
    .rta-webapp-popup-functional-button li button{
        font-size: 1rem;
    }
    .rta-modal-header-div i{
        color: rgb(115, 115, 115);
        font-size: 14px;
    }
    .rta-modal-header-div ul{
        margin: 0 !important;
    }
    .rta-modal-header-div {
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -ms-flex-line-pack: flex-first;
        align-content: flex-first;
    }
    .rta-modal-header-new{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: stretch;
        -ms-flex-align: stretch;
        align-items: center;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
        height: 100%;
    }
    i:hover.rta-fas-icon.fas.fa-arrow-left{
        border-radius: 50%;
        background-color: rgb(0 0 0 / 5%);
        padding: 7px;
    }
    .toparea-button div{
        margin-top:0px;
    }
</style>