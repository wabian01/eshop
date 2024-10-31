const iconSet = {
    methods: {
        handleIconSetTemplate(template) {
            const regexPattern = /src="rta:\/\/icon\/([^/]+)\/([^?"]+)(\?([^"]+))?"/g;
        
            return template.replace(regexPattern, (src, type, name, _, param) => {
                const urlParams = new URLSearchParams(param);
                const params = Object.fromEntries(urlParams);
                let style = "width:24px;";
                let fallback = "";
        
                const stylesMap = {
                    color: () => {
                        style += `filter: drop-shadow(0px 10000000px 0 ${vm.flatRuntimeAttributes[params.color]});transform: translateY(-10000000px);`;
                    },
                    size: () => {
                        style += `width: ${params.size}px !important;`;
                    },
                    fallback: () => {
                        const iconFall = params.fallback;
                        const srcFall = vm.renderUrlIcon(type, iconFall);
                        if (srcFall !== "") {
                            fallback = `onerror="this.onerror=null;this.${srcFall};"`;
                        }
                    }
                };
        
                for (const key in params) {
                    if (stylesMap[key]) {
                        stylesMap[key]();
                    }
                }
        
                const srcUrl = vm.renderUrlIcon(type, name);
                return srcUrl !== "" ? `${fallback} style="${style}" ${srcUrl}` : src;
            });
        },
        renderUrlIcon(type, name) {
            const basePath = 'https://cdn.rtworkspace.com/plugins/webapp/icon';
            
            switch (type) {
                case 'bootstrap':
                    return `src='${basePath}/bootstrap/${name}.svg'`;
                
                case 'fontawesome':{
                    const [typeIcon, ...nameParts] = name.split('-');
                    const nameIcon = nameParts.join('-');
                    return `src='${basePath}/fontawesome/${typeIcon}/${nameIcon}.svg'`;
                }
                default:
                    return "";
            }
        },
        handleIconSetAB(imgString){
            let iconSetUrl = "";
            let iconSetStyle = "";
            let iconSetFallBack = "";
            const basePath = 'https://cdn.rtworkspace.com/plugins/webapp/icon';
            const regexPattern = /rta:\/\/icon\/([^/]+)\/([^?"]+)(\?([^"]+))?/;
            const array = regexPattern.exec(imgString);

            if (array) {
                const [, typeIcon, nameIcon, paramIcon] = array;

                iconSetUrl = vm.generateIconSetUrl(basePath, typeIcon, nameIcon);

                if (paramIcon) {
                    iconSetStyle += vm.generateIconStyle(paramIcon);
                    iconSetFallBack = vm.generateFallback(paramIcon, typeIcon);
                }
            }
            return { iconSetUrl, iconSetStyle, iconSetFallBack }
        },
        generateIconSetUrl(basePath, typeIcon, nameIcon) {
            if (typeIcon === 'bootstrap') {
                return `${basePath}/${typeIcon}/${nameIcon}.svg`;
            } else if (typeIcon === 'fontawesome') {
                const [type, ...nameParts] = nameIcon.split('-');
                const name = nameParts.join('-');
                return `${basePath}/fontawesome/${type}/${name}.svg`;
            }
            return "";
        },
        generateIconStyle(paramIcon) {
            const urlParams = new URLSearchParams(paramIcon);
            let style = "";
        
            for (const [key, value] of urlParams.entries()) {
                if (key === "color") {
                    style += `filter: drop-shadow(0px 10000000px 0 ${vm.flatRuntimeAttributes[value]}); transform: translateY(-10000000px);`;
                }
            }
        
            return style;
        },
        generateFallback(paramIcon, typeIcon) {
            const urlParams = new URLSearchParams(paramIcon);
            const fallbackValue = urlParams.get("fallback");
            
            if (fallbackValue) {
                const srcFall = vm.renderUrlIcon(typeIcon, fallbackValue);
                return srcFall ? `onerror="this.onerror=null;this.${srcFall};"` : "";
            }
            
            return "";
        },
    }
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { iconSet };
}
