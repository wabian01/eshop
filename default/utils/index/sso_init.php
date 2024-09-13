<script>
    var profile = {};
    const openid = OpenID("https://rtcenter.org/config/keycloak-public-view.json");
    const loginSuccess = (pf) => {
        profile = pf
        localStorage.setItem('jwtProfile', JSON.stringify(profile))
        refreshToken();
        window.ssoLoginStatus = true;
    };
    const loginFailed  = () => window.ssoLoginStatus = true;
    const loginParams  = '';

    // Handle SSO
    openid.init('check-sso', loginSuccess, loginFailed, loginParams, false);
</script>
