const dynamicFilter = {
    methods: {
        handleAjaxSuccess(json, index) {
            if (json && json.hasOwnProperty('jsonpath')) {
                json = jsonPath(json, json.jsonpath);
            }
            if (!json) {
                json = [];
            }
            json = json.filter((x, i, d) => d.indexOf(x) == i && x != '');
            if (vm.activeListFilters[index].entries[0].indexOf('userinput____lite_connection') > -1) {
                json.unshift('__userinput__');
                vm.activeListFilters[index].entries = json;
            } else {
                vm.activeListFilters[index].entries = json;
            }
        },
        handleAjaxError(index) {
            let jsontem = [];
            if (vm.activeListFilters[index].entries[0].indexOf('userinput____lite_connection') > -1) {
                jsontem.unshift('__userinput__');
            }
            vm.activeListFilters[index].entries = jsontem;
        },
        dynamicFilter(data, index) {
            try {
                let datastring = JSON.stringify(data);
                for (var key in vm.flatRuntimeAttributes) {
                    if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                        datastring = datastring.replace(new RegExp('##' + key + '##', 'g'), vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g, " "));
                        datastring = datastring.replace('"', '\"');
                    }
                }
                if (datastring.indexOf('##') > -1) {
                    datastring = datastring.replace(/##(.*?)##/g, "");
                }
                data = JSON.parse(datastring);

                $.ajax({
                    url: data.url,
                    type: (data.request && data.request.method) ? data.request.method : 'GET',
                    data: data.request && data.request.body ? JSON.parse(data.request.body) : false,
                    contentType: (data.request && data.request['content-type']) ? 'application/json' : false,
                    dataType: "json",
                    success: (json) => this.handleAjaxSuccess(json, index),
                    error: () => this.handleAjaxError(index)
                });

            } catch (error) {
                this.handleAjaxError(index);
            }
        },
    }
};