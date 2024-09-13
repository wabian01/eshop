<style>
    #loader-submit-1, #loader-submit-2,#loader-submit-3 {
        border: 6px solid #ffffff;
        border-top: 6px solid #f7d013;
        border-radius: 50% !important;
        width: 50px;
        height: 50px;
        animation: spinsubmit 2s linear infinite;
    }
    #loader-submit-1{
        position: absolute;
        top: 22%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    #loader-submit-2{
        right: 8%;
        position: absolute;
        top: 59%;
    }
    #loader-submit-3{
        position: absolute;
        top: 35%;
    }
    .liteform button[disabled]{
        background-color: #dbdbdb !important;
    }
    .liteform button[disabled] #liteform-icon{
        fill: #a09e9e;
    }
    @keyframes spinsubmit {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .load-liteform {
        position: absolute;
        z-index: 1;
        width: 80px;
        height: 80px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        transform: -webkit-translate(-50%, -50%);
        transform: -moz-translate(-50%, -50%);
        transform: -ms-translate(-50%, -50%);
        z-index: 1;
    }
    .overflow-load-liteform{
        background-color: #ff000000;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
        z-index:1;
    }
    .load-liteform div {
        animation: load-liteform 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        transform-origin: 40px 40px;
    }
    .load-liteform div:after {
        content: " ";
        display: block;
        position: absolute;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #b6b4ae;
        margin: -4px 0 0 -4px;
    }
    .load-liteform div:nth-child(1) {
        animation-delay: -0.036s;
    }
    .load-liteform div:nth-child(1):after {
        top: 63px;
        left: 63px;
    }
    .load-liteform div:nth-child(2) {
        animation-delay: -0.072s;
    }
    .load-liteform div:nth-child(2):after {
        top: 68px;
        left: 56px;
    }
    .load-liteform div:nth-child(3) {
        animation-delay: -0.108s;
    }
    .load-liteform div:nth-child(3):after {
        top: 71px;
        left: 48px;
    }
    .load-liteform div:nth-child(4) {
        animation-delay: -0.144s;
    }
    .load-liteform div:nth-child(4):after {
        top: 72px;
        left: 40px;
    }
    .load-liteform div:nth-child(5) {
        animation-delay: -0.18s;
    }
    .load-liteform div:nth-child(5):after {
        top: 71px;
        left: 32px;
    }
    .load-liteform div:nth-child(6) {
        animation-delay: -0.216s;
    }
    .load-liteform div:nth-child(6):after {
        top: 68px;
        left: 24px;
    }
    .load-liteform div:nth-child(7) {
        animation-delay: -0.252s;
    }
    .load-liteform div:nth-child(7):after {
        top: 63px;
        left: 17px;
    }
    .load-liteform div:nth-child(8) {
        animation-delay: -0.288s;
    }
    .load-liteform div:nth-child(8):after {
        top: 56px;
        left: 12px;
    }
    @keyframes load-liteform {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>