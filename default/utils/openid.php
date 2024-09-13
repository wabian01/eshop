<script src="https://accounts.rtworkspace.com/auth/js/keycloak.min.js"></script>
<script>
    const OpenID = (config = {
        url: 'https://accounts.rtworkspace.com/auth/',
        realm: 'rta',
        clientId: '<?= $projectCode ?? FaConfiguration::get_config('project_code') ?>'
    }) => {
        let kc;

        if (typeof config === 'string' || typeof config === 'object') {
            kc = new Keycloak(config);
        } else {
            throw new Error('Invalid Keycloak configuration. Must be a string (URL) or an object.');
        }

        return {
            getKeycloak: () => kc,
            init: (onLoad, authenticatedCallback, unauthenticatedCallback, loginParams = '', ssoLoginRequired = false) => {
                kc.init({
                    onLoad,
                    checkLoginIframe: false,
                    silentCheckSsoRedirectUri: window.location.origin + '/cpms/cpmsSite/silentCheckSSO'
                }).then((authenticated) => {
                    if (authenticated) {
                        kc.loadUserInfo().then(profile => {
                            authenticatedCallback(profile);
                        });
                    } else if (ssoLoginRequired) {
                        const redirectUri = window.location.href;
                        const loginURL = kc.createLoginUrl({ redirectUri }) + loginParams;
                        window.location.href = loginURL;
                    } else {
                        unauthenticatedCallback();
                    }
                }).catch(error => {
                    console.error('Failed to initialize:', error);
                })
            }
        }
    }
</script>