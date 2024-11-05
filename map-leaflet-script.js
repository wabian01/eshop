    Vue.component('map-leaflet', {
        template: '#map-leaflet',
        props: ['list_items_origin','id_random','body_area','item_search_string','task','object','item_filter_attributes','update_map','refresh_rate'],
        mixins: [handleFilter,handleButtonVisible,handleDynamicButtons],
        data: function () {
        return {
            searchs: [],
            longitude:'',
            latitude:'',
            tilte:'',
            markers:'',
            count:0,
            renderMarkerStart: true,
            stateButton: true,
            showContent: false,
            list_item:[],
            item_buttons:[],
            button_description:[],
            permission:{
                    vi: window.location.origin+' không được phép sử dụng vị trí của bạn',
                    en: window.location.origin+' does not have permission to use your location'
                },
            lang:vm.lang,
            quickfilter:{},
            list_items: JSON.parse(JSON.stringify(this.list_items_origin)),
            dataStore:JSON.parse(JSON.stringify(this.list_items_origin)),
            filterMap_temp:{},
            mymap:'',
            startfilter:false,
            }    
        },
        created(){
            let that = this
            if(this.body_area.attributes.hasOwnProperty('filterConfig') && this.body_area.attributes.filterConfig.hasOwnProperty('quick')){
                this.quickfilter = {...this.body_area.attributes.filterConfig.quick}
            }
            if(Object.keys(that.quickfilter).length>0 && this.dataStore.length>0){
                if(!that.quickfilter.hasOwnProperty('entries')){
                    that.quickfilter.entries = []
                    let entries =  this.dataStore.map(d => jsonPath(d,that.quickfilter.column)[0]);
                    that.quickfilter.entries = that.quickfilter.entries.concat(entries).filter((x, i, d) => d.indexOf(x) == i && x != '');
                }
            }

        },
        watch: {
            item_search_string: function(item_search_string){
               this.searchMap(item_search_string);
            },    
            item_filter_attributes: function(item_filter_attributes){
                this.filterMapview(item_filter_attributes)
            },
            refresh_rate(){
                this.mymap.invalidateSize()
            },
            update_map(){
                this.mymap.invalidateSize()
        },
        },
        mounted: function () {    
            setTimeout(() => this.setupNavigationVisibility(), 10);

            let that = this;
            if (window.navigator.geolocation) {
                let getPosition = function (options) {
                    return new Promise(function (resolve, reject) {
                        window.navigator.geolocation.getCurrentPosition(resolve, reject, options);
                    });
                }
                getPosition().then((position) => {
                    that.renderMap(true,position.coords.latitude, position.coords.longitude,16)
                }).catch(error=>{
                    let mapEle = $('#webapp').find('.parents-map-leaflet');
                    if ( mapEle.length > 0 && ($("#webapp").css("display") !== "none") ) {
                        Swal.fire({
                            title: that.lang=='en'?'Warning!':'Cảnh báo!',
                            text: that.permission[that.lang],
                            icon: 'warning',
                            confirmButtonText: that.lang=='en'?'OK':'Xác Nhận'
                        })
                    }
                    that.renderMap(false,17.0286292,107.3789675,6)
                })
                    
                }
            },
            beforeDestroy: function(){
                this.renderMarkerStart = false;
            },
            methods: {
                setupNavigationVisibility(){
                    if($("#task-modal-"+vm.activeTaskCode+" .search-button").is(':visible')){
                        $("#task-modal-"+vm.activeTaskCode+' #map-navigation').hide();
                    }else{
                        $("#task-modal-"+vm.activeTaskCode+' #map-navigation').show();;
                    }
                    if($(".autofit_subdetail .searchContent").is(':visible')){
                        $(".autofit_subdetail #map-navigation").show();
                    }else{
                        $(".autofit_subdetail #map-navigation").hide();;
                    }
                    if($("#task-modal-"+vm.activeTaskCode+' .modal-dialog').css('max-width')=="800px"){
                        $("#task-modal-"+vm.activeTaskCode+' #map-navigation').css({'left':'46%'})
                    }else{
                        $("#task-modal-"+vm.activeTaskCode+' #map-navigation').css({'left':'50%'})
                    }
                },
                renderMap(access,latitude,longitude,zoom){
                    let that = this
                    let mymap
                    try {
                        mymap = L.map(this.id_random,{zoomControl:true}).setView([latitude, longitude], zoom);
                    } catch (error) {
                        this.$parent.$parent.re_render_map = false
                    }
                    if(access){
                        let greenIcon1 = L.icon({
                                iconUrl: 'https://cdn.rtworkspace.com/plugins/webapp/images/location.png',
                                iconSize:     [60, 60], 
                                iconAnchor:   [30, 30],
                            });
                        L.marker([latitude, longitude],{icon: greenIcon1,zIndexOffset:-9999}).addTo(mymap)
                    }
                    
                    let osm = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                        maxZoom: 22,
                        subdomains:['mt0','mt1','mt2','mt3']
                    }),
                
                    osm_de = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                        maxZoom: 22,
                        subdomains:['mt0','mt1','mt2','mt3']
                    })
                    L.easyButton('fa-location-arrow', function(btn, map){
                        if(!access){
                            Swal.fire({
                                title: that.lang=='en'?'Warning!':'Cảnh báo!',
                                text: that.permission[that.lang],
                                icon: 'warning',
                                confirmButtonText: that.lang=='en'?'OK':'Xác Nhận'
                            })
                        }
                        mymap.flyTo([latitude,longitude], 18, {
                            animate: true,
                        });
                    }).addTo(mymap);
                
                    vm['mapLeaflet'] = mymap;
                    mymap.options.maxZoom = 22;
                    mymap.options.minZoom = 2;
                    osm.addTo(mymap)

                    let baseMaps = {
                        "StateLite": osm_de,
                        'Default': osm,
                    }

                    L.control.layers(baseMaps).setPosition('bottomleft').addTo(mymap);
                    // attributes = this.body_area.attributes;  

                    let markers = L.markerClusterGroup({ chunkedLoading: true });
                    this.markers = markers
                    mymap.attributionControl.addAttribution('RTA &copy; <a href= "https://rta.rtworkspace.com">rta.rtworkspace.com</a>');
                    L.DomEvent.addListener(markers, 'click', function(e){
                        mymap.closePopup();
                        that.stateButton = true;
                        that.showContent = true;
                        $('#'+that.id_random+' .leaflet-bottom').css({'bottom':'23vh'})
                        let popup = e.layer.getPopup();
                        let content = popup.getContent();
                        that.openHtmlView(content)
                    });
                    mymap.addLayer(markers).on('click', function(e) {
                        that.narrowPopup()
                        that.showContent = false;
                        $('#'+that.id_random+' .leaflet-bottom').css({'bottom':'0'})
                        $('#'+that.id_random+' .leaflet-top').css({'top':'0'})
                        $('.showPopup.'+that.id_random+' .content').empty()
                    });

                    this.flyToLocation(mymap)

                    this.mymap = mymap
                    if(Object.keys(this.quickfilter).length>0 && this.quickfilter.firstEntrySelectedByDefault){
                        this.startfilter = true
                    }else{
                        this.startfilter = true
                        this.renderMarker(this.list_items)
                    }
                },
                flyToLocation(mymap){
                    document.getElementById('map-navigation').onclick = function(e) {
                        let lat = e.target.getAttribute('data-longitude');
                        let long = e.target.getAttribute('data-latitude');
                        if (lat && long) {
                            mymap.flyTo([long,lat], 22, {
                                animate: true,
                            });
                        }
                    }
                },
                filterMapview:function(item_filter_attributes,check=false){
                    try {
                        let markers = this.markers
                        markers.clearLayers();
                    } catch (error) {}
                        Object.assign(this.filterMap_temp,JSON.parse(item_filter_attributes))
                        
                        let filter_attributes = this.filterMap_temp
                        let filter_query=[]
                        let filter_query1=[]
                        let json
                        filter_query = this.handleFilter(filter_attributes)

                        filter_query1.push(filter_query.join(' && '))
                        if(filter_query1[0]==""){
                            json=this.dataStore;
                        }else{
                            json=this.dataStore.filter(function(item) { return eval("eval(filter_query1[0])")});
                        }
                        this.renderMarker(json)
                        let mymap = this.mymap
                        let attributes = this.body_area.attributes;    
                        let fitBounds = []
                        json.map(el=>{
                            let array = []
                            if(el[attributes['latitude']]==null){
                                el[attributes['latitude']]="";
                            }
                            if(el[attributes['longitude']]==null){
                                el[attributes['longitude']]="";
                            }
                            if(el[attributes['latitude']]!="" && el[attributes['longitude']]!=""){
                                array = array.concat(el[attributes['latitude']])
                                array = array.concat(el[attributes['longitude']])
                            }
                            fitBounds.push(array)
                        })
                        mymap.fitBounds(fitBounds);
                        
                },
                extendPopup(){
                    this.stateButton = false;
                    let height1=$('#'+this.id_random).height() - 100;
                    $('#'+this.id_random+' .leaflet-top.leaflet-left').css("top","calc(0px - "+height1+"px)");
                    $('#'+this.id_random+' .leaflet-bottom.leaflet-left').css("bottom",height1+28+"px");
                    $('.showPopup.'+this.id_random+' iframe').css("cssText", "height: "+(height1-10)+"px !important;");
                    $('.showPopup.'+this.id_random).css("height", height1+30+"px");
                },
                narrowPopup(){
                    this.stateButton = true;
                    $('#'+this.id_random+' .leaflet-top.leaflet-left').css("top","0px");
                    $('#'+this.id_random+' .leaflet-bottom.leaflet-left').css("bottom","23vh");
                    $('.showPopup.'+this.id_random+' iframe').css("cssText", "height: 17vh !important;");
                    $('.showPopup.'+this.id_random).css("height", "23vh");
                },
                searchMap:function (item_search_string='') {      
                    let ketqua=[];
                    let count = 0;
                    if(item_search_string!==null){
                        let attributes= this.body_area.attributes;
                        this.longitude=attributes.longitude;
                        this.latitude=attributes.latitude;
                        this.tilte=attributes.title;
                        this.list_items.forEach((item)=>{
                        count++
                        if(count<1000 && item[attributes['longitude']].toString().length > 0 && item[attributes['latitude']].toString().length > 0 ){
                            
                            if(item[attributes['title']].toLowerCase().indexOf(item_search_string.toLowerCase()) > -1){
                            ketqua.push(item);
                                }
                            }
                        })
                    }
                    this.searchs=ketqua;
                
                },
                renderGeoJSON(type,object){
                    let mymap = this.mymap
                    if(type === 'GeoJSON'){
                        if(typeof (object) == 'string'){
                            L.geoJSON(JSON.parse(object)).addTo(mymap);
                        }else if(typeof (object) == 'object'){
                            L.geoJSON(object).addTo(mymap);
                        }
                    }else if(type === 'GeoJSON_url'){
                        $.getJSON(object, function(data) {
                            L.geoJSON(data).addTo(mymap);
                        })
                    }
                },
                processGeoJSONUrl(url) {
                    if (!url) return url;
                    
                    Object.entries(vm.flatRuntimeAttributes).forEach(([key, value]) => {
                        url = url.replace(
                            new RegExp('##'+key+'##', 'g'),
                            value.toString().replace(/[\r\n\t]+/g, " ")
                        );
                    });
                    if(vm.current.parent){
                        Object.entries(vm.current.parent).forEach(([key, value]) => {
                            if (value !== null) {
                                url = url.replace(
                                    new RegExp('##'+key+'##', 'g'),
                                    value.toString().replace(/[\r\n\t]+/g, " ")
                                );
                            }
                        });
                    }
                
                    return url;
                },
                createMarkerIcon(el, attributes, headerMarker,index, markers){
                    if(el[attributes['latitude']].toString().length > 0 && el[attributes['longitude']].toString().length > 0 ){
                        if (headerMarker === "show" || headerMarker === "") {
                            const markerPath = el[attributes['markerPath']];
                            const bearingColumn = el[attributes['bearingColumn']];
                            if (markerPath || bearingColumn) {
                                if (markerPath && (!bearingColumn || bearingColumn === "")) {
                                    let icon = L.divIcon({
                                    iconSize:null,
                                        html:'<div class="map-label"><div class="map-label-content-marker-path"> '+el[attributes['title']]+' </div><img src="'+el[attributes['markerPath']]+'" height="30px" width="30px" /></div>'
                                    });     

                                    let marker = L.marker(L.latLng(el[attributes['latitude']], el[attributes['longitude']]),{icon:icon});
                                    marker.bindPopup(index.toString());
                                    markers.addLayer(marker)
                                } else if (bearingColumn && (!markerPath || markerPath === "")) {
                                    let icon = L.divIcon({
                                        iconSize:null,
                                        html:'<div class="map-label"><div class="map-label-content-bearing"> '+el[attributes['title']]+' </div><div style="transform: rotate('+el[attributes['bearingColumn']]+'deg);"><img src="https://cdn.rtworkspace.com/plugins/webapp/images/bearing-icon.webp" height="50px"></div></div>'
                                    });     

                                    let marker = L.marker(L.latLng(el[attributes['latitude']], el[attributes['longitude']]),{icon:icon});
                                    marker.bindPopup(index.toString());
                                    markers.addLayer(marker)
                                } else {
                                    let icon = L.divIcon({
                                    iconSize:null,
                                        html:'<div class="map-label"><div class="map-label-content-marker-path"> '+el[attributes['title']]+' </div><div style="transform: rotate('+el[attributes['bearingColumn']]+'deg);"><img src="https://cdn.rtworkspace.com/plugins/webapp/images/bearing-icon.webp" height="50px"></div><img src="'+el[attributes['markerPath']]+'" height="30px" width="30px" /></div>'
                                    });     

                                    let marker = L.marker(L.latLng(el[attributes['latitude']], el[attributes['longitude']]),{icon:icon});
                                    marker.bindPopup(index.toString());
                                    markers.addLayer(marker)
                                }
                            } else {
                                let icon = L.divIcon({
                                    iconSize:null,
                                    html:'<div class="map-label"><div class="map-label-content"> '+el[attributes['title']]+' </div><div class="map-label-arrow"></div></div>'
                                });     

                                let marker = L.marker(L.latLng(el[attributes['latitude']], el[attributes['longitude']]),{icon:icon});
                                marker.bindPopup(index.toString());
                                markers.addLayer(marker)
                            }
                        } else {
                            let marker = L.marker(L.latLng( el[attributes['latitude']], el[attributes['longitude']] ));
                            marker.bindPopup(index.toString());
                            markers.addLayer(marker)
                        }  
                    }
                },
                renderMarker(data){
                    let attributes = this.body_area.attributes;   
                    let that = this          
                    this.list_items = data
                    let markers = this.markers
                    let headerMarker = attributes.statusRules?.headerMarker || "";

                    try {
                        if (attributes?.geojson_url) {
                            const processedUrl = this.processGeoJSONUrl(attributes.geojson_url);
                            this.renderGeoJSON('GeoJSON_url', processedUrl);
                        }
                    } catch (error) {}

                    data.forEach((el,index) => {
                        try {
                            if(el[attributes['latitude']]==null){
                                el[attributes['latitude']]="";
                            }
                            if(el[attributes['longitude']]==null){
                                el[attributes['longitude']]="";
                            }
                            if (headerMarker === null || headerMarker === undefined) {
                                headerMarker = "";
                            }
                            if(attributes.hasOwnProperty('type')){
                                that.renderGeoJSON(el[attributes.type],el[attributes.object])
                            }
                            that.createMarkerIcon(el, attributes, headerMarker,index, markers)
                        } catch (error) {
                            
                        }
                    });  
                },
                buttonData() {
                    let button_replace_map = JSON.stringify(JSON.parse(JSON.stringify(attributes.item_buttons)))
                    let button_visible = JSON.parse(button_replace_map)
                    button_visible = this.handleButtonVisible(button_visible,this.list_item)
                    button_replace_map = JSON.stringify(button_visible)
                    for(let key in this.list_item){
                        if(this.list_item.hasOwnProperty(key) && this.list_item[key] != null){
                            button_replace_map = button_replace_map.toString().replace(new RegExp('"##'+key+'##"','g'),'"'+(this.list_item[key].toString().replace(/[\r\n]+/g," ").replace(/"/g,'\\"'))+'"');
                            button_replace_map = button_replace_map.toString().replace(new RegExp('\'##'+key+'##\'','g'),"'"+(this.list_item[key].toString().replace(/[\r\n]+/g," ").replace(/"/g,'\\"'))+"'");
                            button_replace_map = button_replace_map.toString().replace(new RegExp('##'+key+'##','g'),(this.list_item[key].toString().replace(/[\r\n]+/g," ").replace(/"/g,'\\"')));
                        }
                    }
                    button_replace_map = button_replace_map.replace(/\\"'(.*?)'\\"/g,'\\"$1\\"')
                    for (let key in vm.flatRuntimeAttributes) {
                        if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                            button_replace_map = button_replace_map.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                        }
                    }  
                    for(let key in vm.current.parent){
                        try {
                            button_replace_map = button_replace_map.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].replace(/[\r\n]+/g," "));
                        } catch (error) {}
                    }
                    if(button_replace_map.indexOf('${getdata_dmobj')>-1){
                            button_replace_map = vm.getDataDmobj(button_replace_map)
                    }
                    if(button_replace_map.indexOf('##source:dmobj')>-1){
                        button_replace_map = vm.getSourceDmobj(button_replace_map)
                    }
                    button_replace_map = vm.jsonHolderData(button_replace_map,'buttonGroup')
                    if(button_replace_map.indexOf('##')>-1){
                        button_replace_map = button_replace_map.replace(/\\"##(.*?)##\\"/g,"''");
                        button_replace_map = button_replace_map.replace(/##(.*?)##/g,"''");
                    }
                    
                    this.item_buttons = JSON.parse(button_replace_map);
                    this.handleDynamicButtons();
                },
                processTemplate(template, data) {
                    for(let key in data) {
                        if(data.hasOwnProperty(key) && data[key] != null) {
                            template = template.replace(
                                new RegExp('##'+key+'##','g'), 
                                data[key].toString().replace(/[\r\n]+/g," ")
                            );
                        }
                    }
                    return template;
                },

                getAppScript() {
                    return `
                        <script>
                            class App{
                                static callActionButton(json){
                                    let moduleCode = '${this.object.moduleCode}';
                                    let subModuleCode = '${this.object.subModuleCode}';
                                    let componentCode = '${this.object.componentCode}';
                                    let code = '${this.object.code}';
                                    let rawComponentCode = '${this.object.rawComponentCode}';
                                    window.parent.vm.callActionButton(json,moduleCode,subModuleCode,componentCode,code,rawComponentCode)
                                }}  
                        </script>`;
                },

                wrapContent(template, hasScript) {
                    if(hasScript) {
                        template = template.replaceAll(/"/g,'&quot;');
                        if(template.indexOf('<script') > -1) {
                            template += this.getAppScript();
                        }
                        return '<iframe srcdoc="'+template+'" marginheight="0" marginwidth="0" frameborder="0"" scrolling="auto"></iframe>';
                    }
                    return '<span><div>'+template+'</div></span>';
                },

                openHtmlView(index) {
                    const el = this.list_items[index];
                    let content = '';
                    let attributes = this.body_area.attributes;

                    if(attributes.hasOwnProperty('item_template')) {
                        let item_template = attributes['item_template'];
                        item_template = this.processTemplate(item_template, el);
                        
                        this.list_item = el;
                        
                        if(attributes.hasOwnProperty('item_buttons') && attributes.item_buttons.length > 0) {
                            this.buttonData();
                        }

                        if(attributes.hasOwnProperty('button_description') && 
                           attributes.button_description != undefined && 
                           attributes.button_description != null && 
                           attributes.button_description != "") {
                            this.button_description = attributes.button_description;
                        }

                        const hasScript = item_template.indexOf('<script>') > -1;
                        
                        content = this.wrapContent(item_template, hasScript);
                    } else {
                        content = el[attributes['description']];
                    }
                    
                    $('.showPopup.'+this.id_random+' .content').html(content);
                },

            },
    });