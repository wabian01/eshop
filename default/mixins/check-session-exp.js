const checkSessionExp = {
    methods: {
        checkSessionExp(){
            $.ajax({
                url: "/api/user/isAuthenticated",
                type: "GET",
                data: {
                    _: 'd84c0c6d3154fb853916'
                },
                contentType: "application/json",
                dataType: "json",
                success: function (data) {
                    if(data.status==="success"&&data.isAuth){}
                    else{
                        $('#sessionExp').modal('show');
                        return
                    }
                }, error: function (error) {
                    toastr.error(error);
                }
            });
        },
    }
  }