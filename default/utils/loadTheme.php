<script>
    let themeSelect
    let cssTheme
    let fontColorTheme
    document.addEventListener('DOMContentLoaded', () => {
        let themeLocal = localStorage.getItem('selectedTheme')
        if(!themeLocal){
            themeLocal = "teal"
        }
        let json_style = {
            "templates": {
                "button_color": {
                "type": "container",
                "orientation": "overlap",
                "width": {
                    "type": "wrap_content"
                },
                "height": {
                    "type": "wrap_content"
                },
                "items": [
                    {
                    "text": " ",
                    "type": "text",
                    "width": {
                        "type": "fixed",
                        "constrained": true,
                        "value": 64,
                        "unit": "dp"
                    },
                    "height": {
                        "type": "fixed",
                        "constrained": true,
                        "value": 64,
                        "unit": "dp"
                    },
                    "border": {
                        "corner_radius": 32
                    },
                    "margins": {
                        "left": 8,
                        "top": 8
                    },
                    "background": [
                        {
                        "type": "solid",
                        "$color": "background_color"
                        }
                    ],
                    "actions": [
                        {
                        "log_id": "set_color",
                        "$url": "action_color"
                        }
                    ]
                    },
                    {
                    "$visibility": "visibility_icon",
                    "type": "image",
                    "image_url": "empty://",
                    "preview": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAABmJLR0QA/wD/AP+gvaeTAAACe0lEQVRYhe2YPU5bQRDHf7EpIHEscYHIIVLgCoCoQEBIgSJzAog4QYAeTBMFCQM5AyUyuQAFHzegI8TYRCYNHZAiJsWuxez6+b3dfW5AjPQke3fm7593Zj/ewrM9MnsREJMFRoBZYBQYAPp13zXwEzgCKsAx8C89ZrT1ASvAFXDv+FwByzq2qzYH1DxA7OcCKHYDJAOsA03rB6rAFjAFDAKv9DOo27Y1hIxpAiWtGQyza4nWgHlUHSVZFlgA6pbGbijUuiW0B+QCdF6jClxqlXxF5jDTtEmKodaxZcz0OddUL2b+91LCSCg5UnXgpUvgCmbNhKRJ2jhqrQKVvkuhv5QUnMVcZ+ZTwkwCt8Av4K1u+yz0GySM/phwruI2m5JgWnoHuj2LuaaNxolsCMdySpgbzD83IPp3RN/XOKET4Tgt2n1GagpzZM6BguUzI/qP4sT+CMf3uq0AnAITXYIBtaLLOupof4VjDngDnOnvd8DHmFi7Zuw0ScsJv7tQoDgoHxiAvCtQp5Sdi/YbDdAy1zRJc07ZsXCURW1D3WqQEBgwi/owzvGbcNy2+qKgQmAAvou42GkvF8YL2qe7DRUC04PHwmhvHQsRPjaUDwzAImb9JG7cyyKgjtoQO0H5wuSB30L/i0tQH+bxo0L0vyh4wmSAfaFbRR11nKyIeUArd4DygdkSek3gk69ICbNwK0SnL8nywA9LazVAJ/KQf4k6z7hstj2oApY1c0+KQ34LqkT7a1ANdYT4AAyhtpmc/jyDWmfs97gmsJYGRlqR9vcsn6dKQM0kWS/qDNzwAGmgprbzbAq5bMgAwzxcNrzDvGw44+Gy4QSVqmd7uvYfNcNEglk0zPkAAAAASUVORK5CYII=",
                    "height": {
                        "type": "fixed",
                        "value": 36,
                        "unit": "dp"
                    },
                    "width": {
                        "type": "fixed",
                        "value": 36,
                        "unit": "dp"
                    },
                    "alignment_vertical": "center",
                    "alignment_horizontal": "center",
                    "tint_color": "#ffffff",
                    "margins": {
                        "left": 8,
                        "top": 8
                    }
                    }
                ]
                },
                "button_custom": {
                "type": "text",
                "$text": "text",
                "font_size": 16,
                "width": {
                    "type": "wrap_content",
                    "constrained": true
                },
                "border": {
                    "corner_radius": 4
                },
                "background": [
                    {
                    "type": "solid",
                    "color": "#ffffff"
                    }
                ],
                "paddings": {
                    "left": 16,
                    "right": 8,
                    "top": 8,
                    "bottom": 8
                },
                "text_color": "#FF9800"
                }
            },
            "card": {
                "log_id": "div2_change_app_color",
                "states": [
                {
                    "state_id": 0,
                    "div": {
                    "items": [
                        {
                        "type": "container",
                        "content_alignment_vertical": "center",
                        "width": {
                            "type": "match_parent"
                        },
                        "height": {
                            "type": "fixed",
                            "value": 48,
                            "unit": "dp"
                        },
                        "items": [
                            {
                            "type": "text",
                            "text": "{{{<vi>Màu chính</vi><en>Primary Color</en>}}}",
                            "font_size": 18,
                            "text_color": "#000000",
                            "alignment_horizontal": "left",
                            "margins": {
                                "left": 16
                            },
                            "width": {
                                "type": "wrap_content"
                            }
                            }
                        ]
                        },
                        {
                        "type": "grid",
                        "column_count": 4,
                        "content_alignment_vertical": "center",
                        "content_alignment_horizontal": "center",
                        "margins": {
                            "right": 16,
                            "left": 8
                        },
                        "width": {
                            "type": "match_parent"
                        },
                        "height": {
                            "type": "wrap_content"
                        },
                        "items": [
                            {
                            "type": "button_color",
                            "background_color": "@{getDictString(theme_data,'amber')}",
                            "visibility_icon": "@{default_theme != 'amber' ? 'gone' : 'visible'}",
                            "action_color": "div-action://set_variable?name=default_theme&value=amber"
                            },
                            {
                            "type": "button_color",
                            "background_color": "@{getDictString(theme_data,'cerulean')}",
                            "visibility_icon": "@{default_theme != 'cerulean' ? 'gone' : 'visible'}",
                            "action_color": "div-action://set_variable?name=default_theme&value=cerulean"
                            },
                            {
                            "type": "button_color",
                            "background_color": "@{getDictString(theme_data,'coral')}",
                            "visibility_icon": "@{default_theme != 'coral' ? 'gone' : 'visible'}",
                            "action_color": "div-action://set_variable?name=default_theme&value=coral"
                            },
                            {
                            "type": "button_color",
                            "background_color": "@{getDictString(theme_data,'crimson')}",
                            "visibility_icon": "@{default_theme != 'crimson' ? 'gone' : 'visible'}",
                            "action_color": "div-action://set_variable?name=default_theme&value=crimson"
                            },
                            {
                            "type": "button_color",
                            "background_color": "@{getDictString(theme_data,'emerald')}",
                            "visibility_icon": "@{default_theme != 'emerald' ? 'gone' : 'visible'}",
                            "action_color": "div-action://set_variable?name=default_theme&value=emerald"
                            },
                            {
                            "type": "button_color",
                            "background_color": "@{getDictString(theme_data,'forest-green')}",
                            "visibility_icon": "@{default_theme != 'forest-green' ? 'gone' : 'visible'}",
                            "action_color": "div-action://set_variable?name=default_theme&value=forest-green"
                            },
                            {
                            "type": "button_color",
                            "background_color": "@{getDictString(theme_data,'indigo')}",
                            "visibility_icon": "@{default_theme != 'indigo' ? 'gone' : 'visible'}",
                            "action_color": "div-action://set_variable?name=default_theme&value=indigo"
                            },
                            {
                            "type": "button_color",
                            "background_color": "@{getDictString(theme_data,'lavender')}",
                            "visibility_icon": "@{default_theme != 'lavender' ? 'gone' : 'visible'}",
                            "action_color": "div-action://set_variable?name=default_theme&value=lavender"
                            },
                            {
                            "type": "button_color",
                            "background_color": "@{getDictString(theme_data,'magenta')}",
                            "visibility_icon": "@{default_theme != 'magenta' ? 'gone' : 'visible'}",
                            "action_color": "div-action://set_variable?name=default_theme&value=magenta"
                            },
                            {
                            "type": "button_color",
                            "background_color": "@{getDictString(theme_data,'maroon')}",
                            "visibility_icon": "@{default_theme != 'maroon' ? 'gone' : 'visible'}",
                            "action_color": "div-action://set_variable?name=default_theme&value=maroon"
                            },
                            {
                            "type": "button_color",
                            "background_color": "@{getDictString(theme_data,'mauve')}",
                            "visibility_icon": "@{default_theme != 'mauve' ? 'gone' : 'visible'}",
                            "action_color": "div-action://set_variable?name=default_theme&value=mauve"
                            },
                            {
                            "type": "button_color",
                            "background_color": "@{getDictString(theme_data,'navy')}",
                            "visibility_icon": "@{default_theme != 'navy' ? 'gone' : 'visible'}",
                            "action_color": "div-action://set_variable?name=default_theme&value=navy"
                            },
                            {
                            "type": "button_color",
                            "background_color": "@{getDictString(theme_data,'tangerine')}",
                            "visibility_icon": "@{default_theme != 'tangerine' ? 'gone' : 'visible'}",
                            "action_color": "div-action://set_variable?name=default_theme&value=tangerine"
                            },
                            {
                            "type": "button_color",
                            "background_color": "@{getDictString(theme_data,'royal-blue')}",
                            "visibility_icon": "@{default_theme != 'royal-blue' ? 'gone' : 'visible'}",
                            "action_color": "div-action://set_variable?name=default_theme&value=royal-blue"
                            },
                            {
                            "type": "button_color",
                            "background_color": "@{getDictString(theme_data,'rust')}",
                            "visibility_icon": "@{default_theme != 'rust' ? 'gone' : 'visible'}",
                            "action_color": "div-action://set_variable?name=default_theme&value=rust"
                            },
                            {
                            "type": "button_color",
                            "background_color": "@{getDictString(theme_data,'saffron')}",
                            "visibility_icon": "@{default_theme != 'saffron' ? 'gone' : 'visible'}",
                            "action_color": "div-action://set_variable?name=default_theme&value=saffron"
                            },
                            {
                            "type": "button_color",
                            "background_color": "@{getDictString(theme_data,'sky-blue')}",
                            "visibility_icon": "@{default_theme != 'sky-blue' ? 'gone' : 'visible'}",
                            "action_color": "div-action://set_variable?name=default_theme&value=sky-blue"
                            },
                            {
                            "type": "button_color",
                            "background_color": "@{getDictString(theme_data,'slate-blue')}",
                            "visibility_icon": "@{default_theme != 'slate-blue' ? 'gone' : 'visible'}",
                            "action_color": "div-action://set_variable?name=default_theme&value=slate-blue"
                            },
                            {
                            "type": "button_color",
                            "background_color": "@{getDictString(theme_data,'teal')}",
                            "visibility_icon": "@{default_theme != 'teal' ? 'gone' : 'visible'}",
                            "action_color": "div-action://set_variable?name=default_theme&value=teal"
                            },
                            {
                            "type": "button_color",
                            "background_color": "@{first_theme}",
                            "visibility_icon": "@{default_theme != first_theme ? 'gone' : 'visible'}",
                            "action_color": "div-action://set_variable?name=default_theme&value=@{encodeUri(first_theme)}",
                            "visibility": "@{contains('', first_theme) ? 'gone' : 'gone'}"
                            }
                        ]
                        },
                        {
                        "type": "container",
                        "width": {
                            "type": "match_parent"
                        },
                        "items": [
                            {
                            "type": "text",
                            "text": "@{getDictString(theme_description,default_theme)}",
                            "font_size": 16,
                            "width": {
                                "type": "match_parent"
                            },
                            "visibility": "@{theme_description.containsKey(default_theme) ? 'visible' : 'gone'}"
                            }
                        ],
                        "margins": {
                            "top": 16,
                            "right": 16,
                            "left": 16
                        }
                        },
                        {
                        "type": "container",
                        "width": {
                            "type": "match_parent"
                        },
                        "height": {
                            "type": "wrap_content",
                            "value": 200
                        },
                        "items": [
                            {
                            "type": "button_custom",
                            "text": "{{{<vi>Chấp nhận</vi><en>Accept</en>}}}",
                            "actions": [
                                {
                                "log_id": "set_color",
                                "url": "div-action://rtapp.setColor?value=@{encodeUri(default_theme)}"
                                }
                            ]
                            },
                            {
                            "type": "button_custom",
                            "text": "{{{<vi>Hủy</vi><en>Cancel</en>}}}",
                            "actions": [
                                {
                                "log_id": "set_color",
                                "url": "div-action://rtapp.cancelDialog"
                                }
                            ]
                            }
                        ],
                        "orientation": "horizontal",
                        "content_alignment_horizontal": "right",
                        "margins": {
                            "top": 16,
                            "right": 8
                        }
                        }
                    ],
                    "background": [
                        {
                        "color": "#ffffff",
                        "type": "solid"
                        }
                    ],
                    "orientation": "vertical",
                    "type": "container",
                    "alignment_vertical": "center",
                    "alignment_horizontal": "center",
                    "width": {
                        "type": "match_parent"
                    },
                    "border": {
                        "corner_radius": 8
                    },
                    "paddings": {
                        "left": 16,
                        "right": 16,
                        "top": 16,
                        "bottom": 16
                    }
                    }
                }
                ],
                "variables": [
                {
                    "type": "dict",
                    "name": "theme_description",
                    "value": {
                        "amber": "{{{<en>Evokes caution, alertness, and warm energy</en><vi>Gợi lên sự thận trọng, cảnh giác và năng lượng ấm áp</vi>}}}",
                        "cerulean": "{{{<en>Evokes serenity, clarity, and endless possibilities</en><vi>Gợi lên sự thanh thản, trong sáng và khả năng vô tận</vi>}}}",
                        "coral": "{{{<en>Represents vibrancy, optimism, and youthful energy</en><vi>Đại diện cho sự sôi động, lạc quan và năng lượng trẻ trung</vi>}}}",
                        "crimson": "{{{<en>Evokes passion, boldness, and intense emotions</en><vi>Gợi lên sự đam mê, táo bạo và cảm xúc mãnh liệt</vi>}}}",
                        "emerald": "{{{<en>Symbolizes growth, prosperity, and natural harmony</en><vi>Tượng trưng cho sự tăng trưởng, thịnh vượng và hài hòa tự nhiên</vi>}}}",
                        "forest-green": "{{{<en>Represents stability, endurance, and deep connection to nature</en><vi>Đại diện cho sự ổn định, sức chịu đựng và kết nối sâu sắc với thiên nhiên</vi>}}}",
                        "indigo": "{{{<en>Embodies intuition, deep thought, and spiritual awareness</en><vi>Hiện thân của trực giác, suy nghĩ sâu sắc và nhận thức tâm linh</vi>}}}",
                        "lavender": "{{{<en>Evokes tranquility, femininity, and gentle sophistication</en><vi>Gợi lên sự yên bình, nữ tính và sự tinh tế nhẹ nhàng</vi>}}}",
                        "magenta": "{{{<en>Radiates creativity, unconventionality, and emotional balance</en><vi>Tỏa ra sự sáng tạo, phi truyền thống và cân bằng cảm xúc</vi>}}}",
                        "maroon": "{{{<en>Conveys maturity, confidence, and controlled passion</en><vi>Truyền tải sự trưởng thành, tự tin và đam mê kiểm soát</vi>}}}",
                        "mauve": "{{{<en>Suggests nostalgia, romance, and understated luxury</en><vi>Gợi ý sự hoài cổ, lãng mạn và sang trọng kín đáo</vi>}}}",
                        "navy": "{{{<en>Embodies trust, stability, and timeless sophistication</en><vi>Hiện thân của sự tin cậy, ổn định và sự tinh tế vượt thời gian</vi>}}}",
                        "royal-blue": "{{{<en>Symbolizes confidence, success, and regal authority</en><vi>Tượng trưng cho sự tự tin, thành công và quyền lực hoàng gia</vi>}}}",
                        "rust": "{{{<en>Evokes warmth, earthiness, and rustic charm</en><vi>Gợi lên sự ấm áp, gần gũi với đất và vẻ quyến rũ mộc mạc</vi>}}}",
                        "saffron": "{{{<en>Represents energy, excitement, and culinary delights</en><vi>Đại diện cho năng lượng, sự phấn khích và niềm vui ẩm thực</vi>}}}",
                        "sky-blue": "{{{<en>Symbolizes peace, tranquility, and open skies</en><vi>Tượng trưng cho sự bình yên, thanh thản và bầu trời rộng mở</vi>}}}",
                        "slate-blue": "{{{<en>Represents reliability, stability, and trustworthiness</en><vi>Đại diện cho sự đáng tin cậy, ổn định và đáng tin cậy</vi>}}}",
                        "tangerine": "{{{<en>Evokes enthusiasm, creativity, and adventure</en><vi>Gợi lên sự nhiệt tình, sáng tạo và phiêu lưu</vi>}}}",
                        "teal": "{{{<en>Embodies balance, rejuvenation, and sophisticated calmness</en><vi>Hiện thân của sự cân bằng, trẻ hóa và sự bình tĩnh tinh tế</vi>}}}"
                    }
                },
                {
                    "type": "dict",
                    "name": "theme_data",
                    "value": {
                    "amber": "#ffffbf00",
                    "cerulean": "#ff007ba7",
                    "coral": "#ffff7f50",
                    "crimson": "#ffdc143c",
                    "emerald": "#ff50c878",
                    "forest-green": "#ff228b22",
                    "indigo": "#ff4b0082",
                    "lavender": "#ff9370db",
                    "magenta": "#ffff00ff",
                    "maroon": "#ff800000",
                    "mauve": "#ffe0b0ff",
                    "navy": "#ff000080",
                    "royal-blue": "#ff4169e1",
                    "rust": "#ffb7410e",
                    "saffron": "#fff4c430",
                    "sky-blue": "#ff87ceeb",
                    "slate-blue": "#ff6a5acd",
                    "tangerine": "#fff28500",
                    "teal": "#ff008080"
                    }
                },
                {
                    "type": "string",
                    "name": "default_theme",
                    "value": themeLocal
                }, {
                    "type": "string",
                    "name": "first_theme",
                    "value": "teal"
                }
                ]
            }
            }

        json_style = processJsonFile(json_style,vm.lang)

        window.Ya.Divkit.render({
            id: 'smth',
            target: document.querySelector('#json_style'),
            json: json_style,

            onError(details) {
                // console.log(details);
            },
            onStat(details) {
                if(details.hasOwnProperty('action') && details.action.url.indexOf("div-action://rtapp.")>-1){
                    let paramurl = details.action.url.replace("div-action://rtapp.","");
                    let urlParams = new URLSearchParams(paramurl);
                    let params = Object.fromEntries(urlParams);
                    if(params['setColor?value']){
                        localStorage.setItem('selectedTheme', params['setColor?value']);
                        themeSelect(params['setColor?value']+'-light')
                        $('#selectTheme').modal('hide')
                    }else if(paramurl.indexOf('cancelDialog')>-1){
                        $('#selectTheme').modal('hide')
                    }
                }
            }
        });

        function processJsonFile(data, lang) {
            function processText(text) {
                const regex = /\{\{\{([^\{\}]*)\}\}\}/;
                const match = text.match(regex);
                if (match) {
                    const [fullMatch, content] = match;
                    let regex_lang

                    if(lang === "vi"){
                        regex_lang = /<vi>(.*?)<\/vi>/
                    }else{
                        regex_lang = /<en>(.*?)<\/en>/
                    }
                    const match_lang = content.match(regex_lang);
                    if (match_lang) {
                        return match_lang[1];
                    }
                }
                return text;
            }

            function traverse(obj) {
                for (let key in obj) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    traverse(obj[key]);
                } else if (typeof obj[key] === 'string') {
                    obj[key] = processText(obj[key]);
                }
                }
            }

            traverse(data);

            return data;
        }
        const baseURLTheme = 'https://styles.rtworkspace.com/'
        const colorArray = [];
        themeSelect = function loadTheme(themeName) {
            fetch(`${baseURLTheme}/themes/${themeName}/_variables.scss`)
                .then(response => response.text())
                .then(scss => {
                    const cssVariables = scss
                        .replace(/\$/g, '--')
                        .replace(/:/g, ':')
                        .replace(/;/g, ';')
                        .replace(/\/\/.+/g, '')
                        .trim();

                    document.documentElement.style.cssText = cssVariables;
                    cssTheme = cssVariables
                    const object_theme = {};
                    let createdArray = true;
                    if(colorArray.length!==0){
                        createdArray = false
                    }
                    scss.split('\n').forEach(line => {
                    const match = line.match(/\$([a-z-]+):\s*([^;]+)/i);
                        if (match) {
                            const key = `__${match[1].toUpperCase().replace(/-/g, '_')}__`;
                            const value = match[2].trim();
                            object_theme[key] = 'var(--' + match[1] + ')';
                            // object_theme[key] = value
                            if(createdArray) colorArray.push(match[1]);
                            
                        }
                    });

                    if(createdArray) addCssTagFont();

                    if(vm.updateThemeCss!=undefined){
                        vm.updateThemeCss = !vm.updateThemeCss
                    }
                    for(let key in object_theme){
                        vm.flatRuntimeAttributes[key] = object_theme[key]
                        if(key === '__COLOR_THEME_PRIMARY__'){
                            vm.flatRuntimeAttributes['primaryAppColor'] = object_theme[key]
                        }  
                    }

                })
                .catch(error => console.error('Error loading theme:', error));
        }
        let defaultTheme = themeLocal + "-light"
        if (defaultTheme) {
            themeSelect(defaultTheme);
        }
        function addCssTagFont(){
            let css = '';
            colorArray.forEach((property) => {
                css += generateCSSRule(property);
            });

            const styleElement = document.createElement('style');
            styleElement.textContent = css;
            fontColorTheme = css
            document.head.appendChild(styleElement);
        }
        function generateCSSRule(property) {
            if (property.startsWith('color')) {
                const css = `
                    [color="var(--${property})"] {
                        color: var(--${property});
                    }
                `;
                return css;
            }
            return '';
        }
    })

</script>
