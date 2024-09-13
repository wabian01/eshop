const loginSession = {
    methods: {
        loginSession(){
            window.top.postMessage('close', '*');
            let base_url = window.origin;
            let redirectUri = base_url + '/cpms/cpmsSite/auth'
            let new_url = openid.getKeycloak().createLoginUrl({ redirectUri: redirectUri }) + '&ui_locales='+ this.lang
            let width = 500;
            let height = 800;
            let left = (window.innerWidth - width) / 2;
            let top = (window.innerHeight - height) / 2;
            let popupWindow = window.open('', "Popup", 'width=' + width + ',height=' + height + ',top=' + top + ',left=' + left);
            popupWindow.document.open()
            popupWindow.document.write(`
                <div style="display: flex; align-items: center; justify-content: center; height: 100%">
                    <div style='text-align: center'>
                        <span style='font-size: 15px; color: #000'>Powered by RTA</span>
                        <div style="margin-top: 10px; height: auto">
                            <div class="loader-bar-container">
                                <div class="loader-bar-wrapper">
                                    <div class="loading-bar-loader">          
                                        <div class="progress-track" style="border-radius: 4px !important;">
                                            <div class="progress-fill" style="border-radius: 4px !important;">
                                            <\/div>
                                        <\/div>
                                    <\/div>
                                <\/div>
                            <\/div>
                        <\/div>
                    <\/div>
                <\/div>
                <style>
                    .loader-bar-container {
                        width: 100%;
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
                        color : #009688;
                    }
                    .progress-fill {
                        height: 100%;
                        width: 100%;
                        width: 0%;
                        color : #009688;
                        background-color: #009688;
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
                <\/style>
            `)
            popupWindow.document.close();
            popupWindow.location.href = new_url;
            setTimeout(() => {
                popupWindow.document.title = translations['Loading...']
            }, 100);
            
            let messageListener = function(event) {
                if (event.source === popupWindow && event.data) {
                    if(profile.email === event.data || event.data === vm.flatRuntimeAttributes['user.email']){
                        $('#sessionExp').modal('hide');
                        if(vm.lang === 'vi'){
                            fetch('/dashBoard/language?lang=vi_VN')
                        }
                    }else{
                        onLogout()
                    }
                    window.removeEventListener("message", messageListener);
                }
            };
            window.addEventListener("message", messageListener);
        },
    }
  }