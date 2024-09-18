replaceAttribute(itemJSONString){
                itemJSONString = this.replaceJsonPaths(itemJSONString);
                for (let key in this.list_item) {
                    if (this.list_item.hasOwnProperty(key) && this.list_item[key] != null ) {
                        itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),this.list_item[key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                        itemJSONString = itemJSONString.replace('"','\"');
                    }
                }
                for (let key in this.flatRuntimeAttributes) {
                    if (this.flatRuntimeAttributes.hasOwnProperty(key)) {
                        itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),this.flatRuntimeAttributes[key].replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                        itemJSONString = itemJSONString.replace('"','\"');
                    }
                }
                for(let key in vm.current.parent){
                    try {
                        itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                    } catch (error) {
                    }
                    itemJSONString = itemJSONString.replace('"','\"');
                }
                return itemJSONString
            },