<script>
    const rtshid = '<?= $query_params['rtshid'] ?? '' ?>';
    const rtscid = '<?= $query_params['rtscid'] ?? '' ?>';
    const view_params = <?= json_encode($view_params) ?>;
    const openid = OpenID();
    const ssoLoginRequired = <?= filter_var($view_params['settings']['hydra:member'][0]['ssoLoginRequired'], FILTER_VALIDATE_BOOLEAN) ? 'true' : 'false' ?>;
    var profile = {};

    const renderFormIO = (eleID, metadata) => {
        let BASE_URL = "https://testcrm.rtworkspace.com/tmp/widgets/" + eleID;
        let g = document.createElement("script"),
            s = document.getElementsByTagName("script")[0];
        g.src = BASE_URL + "/script.js";
        g.defer = true;
        g.async = true;
        s.parentNode.insertBefore(g,s);
        g.onload = function() {
            rtaFormIO.render(eleID, metadata)
        }
    }
    <?php if($view == 'dynamicTemplateUI') { ?>
        const loginSuccess = (pf) => {
            profile = pf;
            if (window.posthog !== undefined) {
                posthog.register(profile);
            }
            if (refreshToken && typeof refreshToken === 'function') {
                refreshToken();
            }
            window.ssoLoginStatus = true;
            viewLoginSuccess(pf);
        };
        const loginFailed = () => {
            window.ssoLoginStatus = true;
            viewloginFailed();
        };
    <?php } else if ($view == 'indexDmView'){ ?>
        const loginSuccess = (pf) => {
            profile = pf;
            if (window.posthog !== undefined) {
                posthog.register(profile);
            }
            refreshToken();
            window.ssoLoginStatus = true;
        };
        const loginFailed  = () => window.ssoLoginStatus = true;
    <?php } ?>
    
    const loginParams  = '';

    // Handle SSO
    openid.init('check-sso', loginSuccess,loginFailed, loginParams, ssoLoginRequired);
</script>

<!-- BEGIN::Posthog -->
<script>
    if (window.posthog !== undefined) {
        if (rtshid) posthog.register({'rtshid': rtshid});
        if (rtscid) posthog.register({'rtscid': rtscid});
        if (view_params) posthog.register(view_params);
    }
</script>
<!-- END::Posthog -->

<script>
    const popupModal     = $('#popup-modal');
    const popupContainer = popupModal.find('#popup-modal--container');
    const popupHeader    = popupModal.find('#popup-modal--header');
    const popupBody      = popupModal.find('#popup-modal--body');
    const flModal        = new Modal(popupModal[0]); //Flowbite modal

    function _popupSetSize(size) {
        let className;
        switch(size) {
            case 'small':
                className = 'max-w-md'; break;
            case 'large':
                className = 'max-w-4xl'; break;
            case 'extra-large':
                className = 'max-w-7xl'; break;
            default:
                className = 'max-w-lg';
        }
        popupContainer.removeClass('max-w-md max-w-4xl max-w-7xl max-w-lg').addClass(className);
    }

    function _popupSetPlacement(placement) {
        if (!(/^(top|center|bottom)-(left|center|right)$/.test(placement)))
            placement = 'center';
        popupModal.attr('data-modal-placement', placement);
        flModal._options.placement = placement;
    }

    function _popupSetIcon(iconType) {
        if (!(/^(info|danger|warning)$/.test(iconType)))
            iconType = 'info';
        popupBody.find('.popup-icon').hide();
        popupBody.find('.popup-icon' + '.' + iconType).show();
    }

    function _popupSetMessage(message) {
        let ele = popupBody.find('h3');
        ele.html(message['text']);
        ele.removeAttr('class').addClass(message['classes']);
    }

    function _popupSetButton(buttons) {
        let defaultClasses = 'rounded-lg font-medium text-sm inline-flex items-center text-center px-5 py-2.5 focus:z-10 border border-gray-200';

        // Remove all existing buttons
        popupBody.find('button').remove();

        if (Array.isArray(buttons) && buttons.length > 0) {
            buttons.forEach(function (button, index) {
                let btnText    = button['text'];
                let btnClasses = defaultClasses + ' ' + (button['classes'] ? button['classes'] : '');
                if (index === 0) btnClasses += ' mr-2';
                popupBody.append(`<button type="button" class="${btnClasses}">${btnText}</button>`);
            });
        }
    }

    function _popupReset() {
        popupModal.removeClass('justify-start justify-center justify-end items-start items-center items-end');
    }

    function _popupPrepare(options) {
        _popupReset();
        _popupSetSize(options['size']);
        _popupSetPlacement(options['placement']);
        _popupSetIcon(options['icon_type']);
        _popupSetMessage(options['message']);
        _popupSetButton(options['buttons']);
        flModal._init();
    }

    function _popupShow() {
        flModal.hide();
        flModal.show();

        // Delete event click and then bind again
        popupModal.find('button').off('click.popup-namespace').on('click.popup-namespace', () => {
            flModal.toggle();
        });
    }
</script>

<script>
    function isMobile() {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }

    function loadChatwoot() {
        <?php if ((int)$query_params['enable_chatwoot'] && !StringUtils::isNullOrEmptyString($query_params['chatwoot_config']['chatToken'])) { ?>
            <?php
                $cwToken = $query_params['chatwoot_config']['chatToken'];
                $cwHideMessageBubble = $query_params['chatwoot_config']['hideMessageBubble'] ?? 'false';
                $cwPosition = $query_params['chatwoot_config']['position'] ?? 'right';
                $cwLocale = $query_params['chatwoot_config']['locale'] ?? 'en';
                $cwType   = $query_params['chatwoot_config']['type'] ?? 'standard';
                $cwHideOnMobile = $query_params['chatwoot_config']['hideOnMobile'] ?? 'true';
            ?>
            let cwToken = "<?= $cwToken ?>";
            let hideOnMobile = ("<?= $cwHideOnMobile ?>" === "true");

            window.chatwootSettings = {
                hideMessageBubble: ("<?= $cwHideMessageBubble ?>" !== "false"),
                position: "<?= $cwPosition ?>", // This can be left or right
                locale: "<?= $cwLocale ?>", // Language to be set
                type: "<?= $cwType ?>", // [standard, expanded_bubble]
            };

            if (!isMobile() || !hideOnMobile) {
                var BASE_URL = "https://rtchat.rtworkspace.com";
                var g = document.createElement("script"),
                    s = document.getElementsByTagName("script")[0];
                g.src = BASE_URL+"/packs/js/sdk.js";
                g.defer = true;
                g.async = true;
                s.parentNode.insertBefore(g,s);
                g.onload = function() {
                    window.chatwootSDK.run({
                        websiteToken: cwToken,
                        baseUrl: BASE_URL
                    })
                }
            }
        <?php } ?>
    }

    function handleWebsocket() {
        if (rtshid) {
            var passhash = CryptoJS.MD5(rtshid.replace(/^https?:\/\//, '')).toString();
            var isEnabledPopup = <?= (int)$query_params['enable_popup_modal'] ?>;

            var wsconn = new WebSocket('wss://' + 'testcrm.rtworkspace.com' + '/socket');
            wsconn.onmessage = function(e) {
                if (e.data !== "" && JSON.parse(e.data)['action'] === "rcmMsg") {
                    // show new message
                    let edata = JSON.parse(e.data)
                    if (isEnabledPopup) {
                        _popupPrepare(edata);
                        _popupShow();
                    }
                }
            };
            wsconn.onopen = function(e) {
                wsconn.send(JSON.stringify({
                    'action': 'setId',
                    'id': passhash
                }));
            };
            wsconn.onclose = function(e) {
                setTimeout(function() {
                    handleWebsocket();
                }, 1000);
            };
            wsconn.onerror = function(e) {
                console.log(e)
                wsconn.close();
            };
        }
    }
</script>