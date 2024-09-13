<style>
    .loader-bar-container {
        width: 100%;
        height: 100%;
        display: '-webkit-box';
        display: '-webkit-flex';
        display: '-ms-flexbox';
        display: flex;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
    }
    .loader-bar-wrapper {
        display: '-webkit-box';
        display: '-webkit-flex';
        display: '-ms-flexbox';
        display: flex;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;
        text-align: center;
        -webkit-align-items: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
    }
    .loading-bar-loader {
        width: 160px;
    }
    .progress-track {
        width: 100%;
        height: 4px;
        border-radius: 4px;
        overflow: hidden;
        background-color: rgba(0,0,0,0.3);
        position: relative;
        color : var(--color-theme-primary);
    }
    .progress-fill {
        height: 100%;
        width: 100%;
        width: 0%;
        color : var(--color-theme-primary);
        background-color: var(--color-theme-primary);
        border-radius: 4px;
        -webkit-transition: 0.4s;
        transition: 0.4s;
        width: 100%;
        -webkit-animation: loading-bar 1.3s infinite linear;
        animation: loading-bar 1.3s infinite linear;
        -webkit-transform-origin: 0% 50%;
        -ms-transform-origin: 0% 50%;
        transform-origin: 0% 50%;
    }
    @keyframes loading-bar{
        0% {
            -webkit-transform: translateX(0) scaleX(0);
            -ms-transform: translateX(0) scaleX(0);
            transform: translateX(0) scaleX(0);
        }
        10% {
            -webkit-transform: translateX(0) scaleX(0.2);
            -ms-transform: translateX(0) scaleX(0.2);
            transform: translateX(0) scaleX(0.2);
        }
        40% {
            -webkit-transform: translateX(0) scaleX(0.7);
            -ms-transform: translateX(0) scaleX(0.7);
            transform: translateX(0) scaleX(0.7);
        }
        60% {
            -webkit-transform: translateX(60%) scaleX(0.4);
            -ms-transform: translateX(60%) scaleX(0.4);
            transform: translateX(60%) scaleX(0.4);
        }
        100% {
            -webkit-transform: translateX(100%) scaleX(0.2);
            -ms-transform: translateX(100%) scaleX(0.2);
            transform: translateX(100%) scaleX(0.2);
        }
    }
</style>