const funcReplaceTitleAndName = {
    methods: {
        funcReplaceTitleAndName(stringTitle) {
            this.handleParamPublicView();
            if (stringTitle == null || stringTitle === undefined) return;
            
            stringTitle = vm.aggregateFunction(stringTitle, []);
            stringTitle = this.replaceAttributesInTitle(stringTitle, vm.flatRuntimeAttributes);
            stringTitle = this.replaceAttributesInTitle(stringTitle, vm.current.parent);
            
            return this.escapeSpecialCharacters(stringTitle);
        },

        handleParamPublicView() {
            if (!vm.paramPublicView) return;
            
            if (!vm.current.hasOwnProperty('parent')) {
                vm.current['parent'] = {};
            }
            
            for (const [key, value] of Object.entries(vm.paramPublicView)) {
                vm.current['parent']['current.args.' + key] = value ?? "";
            }
        },

        replaceAttributesInTitle(title, attributes) {
            if (!attributes) return title;
            for (const [key, value] of Object.entries(attributes)) {
                const regex = new RegExp('##' + key + '##', 'g');
                const sanitizedValue = String(value).replace(/[\r\n]+/g, " ");
                title = title.replace(regex, sanitizedValue);
                title = title.replace('"', '\\"');
            }
            return title;
        },

        escapeSpecialCharacters(title) {
            return title.replace(/</g, "&lt;");
        }
    }
};
