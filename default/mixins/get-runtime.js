const getRuntime = {
    methods: {
        getRuntimeAttributes:function () {
            var that = this;
            $.ajax({
                url: "/api/user/getRuntimeAttributes",
                type: "GET",
                data: {
                    _: 'd84c0c6d3154fb853916',
                    username: username?username:"anonymous",
                    ot_token: token,
                },
                contentType: "application/json",
                dataType: "json",

                success: function (data) {
                    data.user = data.currentUser;
                    delete data.currentUser;
                    that.runtimeAttributes = Object.assign({}, data);;
                    console.log(that.runtimeAttributes );
                    for (var key in data) {
                        if (data.hasOwnProperty(key)&&typeof data[key] != "object"&&key!="primaryAppColor") {
                            data[key] = String(data[key]);
                            that.flatRuntimeAttributes[key] = data[key];
                        }
                    }
                    for (var key in data.user) {
                        if (data.user.hasOwnProperty(key)&&typeof data.user[key] != "object") {
                            data.user[key] = String(data.user[key]);
                            that.flatRuntimeAttributes['user.'+key] = data.user[key];
                        }
                    }
                    for (var key in data.module) {
                        if (data.module.hasOwnProperty(key)&&typeof data.module[key] != "object") {
                            data.module[key] = String(data.module[key]);
                            that.flatRuntimeAttributes['module.'+key] = data.module[key];
                        }
                    }
                    for (var key in data.user.ipcall) {
                        if (data.user.ipcall.hasOwnProperty(key)) {
                            data.user.ipcall[key] = String(data.user.ipcall[key]);
                            that.flatRuntimeAttributes['user.ipcall.'+key] = data.user.ipcall[key];
                        }
                    }
                    console.log(that.flatRuntimeAttributes );

                }, error: function (error) {
                    toastr.error(error);
                }
            });
        },
        getAppSetting:function () {
            var that = this;
            $.ajax({
                url: "/services/appSettings",
                type: "GET",
                data: {
                    username: username,
                },
                contentType: "application/json",
                dataType: "json",

                success: function (data) {
                    that.appSetting = data.module_appearance;

                }, error: function (error) {
                }
            });
        },
        getOwnedDomains:function () {
            var that = this;
            $.ajax({
                url: `https://rtcenter.org/services/get-owned-domains`,
                async: false,
                type: 'GET',
                dataType: 'json',

                success: (response) => {
                    that.ownedDomains = response.domains;
                },
                error: (error) => {}
            });
        },
    }
  }