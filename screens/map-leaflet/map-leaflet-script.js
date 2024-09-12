Vue.component('map-leaflet', {
        template: '#map-leaflet',
        props: ['list_items_origin','id_random','body_area','item_search_string','task','object','item_filter_attributes','update_map','refresh_rate'],
        mixins: [handleFilter],
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
            var that = this
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
            setTimeout(function(){
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
            }, 10);

            let that = this;
            if (window.navigator.geolocation) {
                let getPosition = function (options) {
                    return new Promise(function (resolve, reject) {
                      navigator.geolocation.getCurrentPosition(resolve, reject, options);
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
                    
                    let osm = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
                        maxZoom: 22,
                        subdomains:['mt0','mt1','mt2','mt3']
                    }),
                   
                    osm_de = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
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

                    let controlLayers = L.control.layers(baseMaps).setPosition('bottomleft').addTo(mymap);
                    attributes = this.body_area.attributes;    
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
                    });;
                    document.getElementById('map-navigation').onclick = function(e) {
                        let lat = e.target.getAttribute('data-longitude');
                        let long = e.target.getAttribute('data-latitude');
                        if (lat && long) {
                        
                        mymap.flyTo([long,lat], 22, {
                                animate: true,
                            });
                        }
                    }
                    this.mymap = mymap
                    if(Object.keys(this.quickfilter).length>0 && this.quickfilter.firstEntrySelectedByDefault){
                        this.startfilter = true
                    }else{
                        this.startfilter = true
                        this.renderMarker(this.list_items)
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
                            json=this.dataStore.filter(function(item) { return eval(filter_query1[0])});
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
                    mymap = this.mymap
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
                renderMarker(data){
                    let attributes = this.body_area.attributes;   
                    let that = this          
                    this.list_items = data
                    markers = this.markers
                    let headerMarker = undefined;
                    mymap = this.mymap
                    try {
                        headerMarker = attributes.statusRules.headerMarker
                    } catch (error) {}

                    try {
                        if(attributes.hasOwnProperty('geojson_url') && attributes.geojson_url != null && attributes.geojson_url != ''){
                            for (var key in vm.flatRuntimeAttributes) {
                                if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                                    attributes.geojson_url = attributes.geojson_url.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].toString().replace(/[\r\n\t]+/g," "));
                                    attributes.geojson_url = attributes.geojson_url.replace('"','\"');
                                }
                            }
                            for (var key in vm.current.parent) {
                                if (vm.current.parent.hasOwnProperty(key)) {
                                    attributes.geojson_url = vm.current.parent[key] != null ? (attributes.geojson_url.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].toString().replace(/[\r\n\t]+/g," "))) : attributes.geojson_url;
                                    attributes.geojson_url = attributes.geojson_url.replace('"','\"');
                                }
                            }     
                            that.renderGeoJSON('GeoJSON_url',attributes.geojson_url)
                        }
                    } catch (error) {
                        
                    }

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
                        } catch (error) {
                            
                        }
                    });  
                },
                replaceABDynamic(data,indexbutton,dynamic_buttons){
                    let that = this
                    data=data.sort((a,b)=>a.orderNumber-b.orderNumber)
                    data.forEach(dynamic_button => {
                        if(dynamic_button.actionID!=""){
                            dynamic_buttons.splice(indexbutton, 0, dynamic_button)
                            indexbutton++;
                        }
                    })
                    var itemJSONString = JSON.stringify(dynamic_buttons);
                    for (var key in that.list_item) {
                        if (that.list_item.hasOwnProperty(key)) {
                            if(that.list_item[key] == null){
                                that.list_item[key] = "";
                            }
                            itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),that.list_item[key].toString().replace(/[\r\n]+/g," "));
                            itemJSONString = itemJSONString.replace('"','\"');
                        }
                    }
                    for (var key in vm.flatRuntimeAttributes) {
                        if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                            itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                            itemJSONString = itemJSONString.replace('"','\"');
                        }
                    }                
                    for(var key in vm.current.parent){
                        try {
                            itemJSONString = itemJSONString.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].replace(/[\r\n]+/g," "));
                        } catch (error) {
                        }
                        itemJSONString = itemJSONString.replace('"','\"');
                    }
                    if(itemJSONString.indexOf('${getdata_dmobj')>-1){
                            itemJSONString = vm.getDataDmobj(itemJSONString)
                    }
                    if(itemJSONString.indexOf('##source:dmobj')>-1){
                        itemJSONString = vm.getSourceDmobj(itemJSONString)
                    }
                    itemJSONString = vm.jsonHolderData(itemJSONString,'buttonGroup')
                    if(itemJSONString.indexOf('##')>-1){
                        itemJSONString = itemJSONString.replace(/\\\"##(.*?)##\\\"/g,"''");
                        itemJSONString = itemJSONString.replace(/##(.*?)##/g,"''");
                    }                
                    that.item_buttons = JSON.parse(itemJSONString);
                },
                // Refer at button-group
                handleDynamicButtons: async function(){
                    let that = this;
                    let indexbutton = 0;
                    let item_buttons = this.item_buttons.sort((a,b)=>a.orderNumber-b.orderNumber);
                    let dynamic_buttons = JSON.parse(JSON.stringify(item_buttons));  
                    let p = $.when();
                    item_buttons.forEach((button,index) => {
                        p = p.then(function() { 
                            if(button.type=="dynamic"){
                                if(indexbutton === 0){
                                    indexbutton = index;
                                }
                                if(button.hasOwnProperty('payloadLifetime')){
                                    if(vm.payloadLifetime.hasOwnProperty(hashCode(button.source))){
                                        let timeCache = vm.payloadLifetime[hashCode(button.source)].time
                                        let timePayload = button.payloadLifetime * 1000
                                        let timeCurrent = (new Date()).getTime()
                                        if(timeCurrent - timeCache < timePayload){
                                            let button_cache = vm.payloadLifetime[hashCode(button.source)].buttons;
                                            that.replaceABDynamic(button_cache,indexbutton,dynamic_buttons)
                                            indexbutton = indexbutton + button_cache.length
                                            return;
                                        }
                                    }
                                }
                                return $.ajax({
                                    url: button.source.replace("./",window.location.origin+"/"),
                                    type: "GET",
                                    contentType: "application/json",
                                    dataType: "json",
                                    success: function (data) {
                                        if(typeof(data[0])==='string') return;
                                        if(button.hasOwnProperty('payloadLifetime')){
                                            vm.payloadLifetime[hashCode(button.source)] = {
                                                time: (new Date()).getTime(),
                                                buttons: data
                                            }
                                        }
                                        that.replaceABDynamic(data,indexbutton,dynamic_buttons)
                                        indexbutton = indexbutton + data.length

                                    }, error: function (error) {
                                        toastr.error(error);
                                    }
                                });
                            }                   
                        })
                    })     
                },
                buttonData() {
                    let button_replace = JSON.stringify(JSON.parse(JSON.stringify(attributes.item_buttons)))
                    let button_visible = JSON.parse(button_replace)
                    button_visible = this.handleButtonVisible(button_visible,this.list_item)
                    button_replace = JSON.stringify(button_visible)
                    for(var key in this.list_item){
                        if(this.list_item.hasOwnProperty(key) && this.list_item[key] != null){
                            button_replace = button_replace.toString().replace(new RegExp('"##'+key+'##"','g'),'"'+(this.list_item[key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+'"');
                            button_replace = button_replace.toString().replace(new RegExp('\'##'+key+'##\'','g'),"'"+(this.list_item[key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                            button_replace = button_replace.toString().replace(new RegExp('##'+key+'##','g'),(this.list_item[key].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"')));
                        }
                    }
                    button_replace = button_replace.replace(/\\"'(.*?)'\\"/g,'\\"$1\\"')
                    for (var key in vm.flatRuntimeAttributes) {
                        if (vm.flatRuntimeAttributes.hasOwnProperty(key)) {
                            button_replace = button_replace.replace(new RegExp('##'+key+'##','g'),vm.flatRuntimeAttributes[key].replace(/[\r\n]+/g," "));
                            button_replace = button_replace.replace('"','\"');
                        }
                    }  
                    for(var key in vm.current.parent){
                        try {
                            button_replace = button_replace.replace(new RegExp('##'+key+'##','g'),vm.current.parent[key].replace(/[\r\n]+/g," "));
                        } catch (error) {
                        }
                        button_replace = button_replace.replace('"','\"');
                    }
                    if(button_replace.indexOf('${getdata_dmobj')>-1){
                            button_replace = vm.getDataDmobj(button_replace)
                    }
                    if(button_replace.indexOf('##source:dmobj')>-1){
                        button_replace = vm.getSourceDmobj(button_replace)
                    }
                    button_replace = vm.jsonHolderData(button_replace,'buttonGroup')
                    if(button_replace.indexOf('##')>-1){
                        button_replace = button_replace.replace(/\\\"##(.*?)##\\\"/g,"''");
                        button_replace = button_replace.replace(/##(.*?)##/g,"''");
                    }
                    
                    this.item_buttons = JSON.parse(button_replace);
                    this.handleDynamicButtons();
                },
                openHtmlView(index){
                    let el = this.list_items[index]
                    let content = '';               
                        if(attributes.hasOwnProperty('item_template')){
                            let item_template = attributes['item_template'];
                            for(let key in el){
                                if(el.hasOwnProperty(key) && el[key]!=null){
                                    item_template = item_template.replace(new RegExp('##'+key+'##','g'),el[key].toString().replace(/[\r\n]+/g," "));
                                }
                            }
                            this.list_item = el;
                            
                            if(attributes.hasOwnProperty('item_buttons') && attributes.item_buttons.length>0){
                                this.buttonData();
                            }

                            if( attributes.hasOwnProperty('button_description') && 
                                attributes.button_description != undefined && 
                                attributes.button_description != null && 
                                attributes.button_description != "" 
                            ) {
                                this.button_description = attributes.button_description;
                            }

                            if(item_template.indexOf('<script>') > -1){
                                item_template = item_template.replaceAll(/["]/g,'&quot;')
                                if(item_template.indexOf('<script')>-1){
                                    let functionApp = `
                                        <script>
                                            class App{
                                                static callActionButton(json){
                                                    let moduleCode = '`+this.object.moduleCode+`';
                                                    let subModuleCode = '`+this.object.subModuleCode+`';
                                                    let componentCode = '`+this.object.componentCode+`';
                                                    let code = '`+this.object.code+`';
                                                    let rawComponentCode = '`+this.object.rawComponentCode+`';
                                                    window.parent.vm.callActionButton(json,moduleCode,subModuleCode,componentCode,code,rawComponentCode)
                                                }}  
                                        <\/script>`
                                    item_template = item_template + functionApp
                                }
                                content = '<iframe srcdoc="'+item_template+'" marginheight="0" marginwidth="0" frameborder="0"" scrolling="auto"></iframe>';
                            }
                            else{
                                content = '<span>  <div> '+item_template+'</div></span>';
                            }
                        }
                        else{
                            content = el[attributes['description']]
                        }
                        $('.showPopup.'+this.id_random+' .content').html(content)
                },
                handleButtonVisible(screen_item_new_temp,list_item){
                    screen_item_new_temp.forEach(element => {                    
                        for(var key in element){
                            if(key === 'name'){
                                element[key] = vm.aggregateFunction(element[key],list_item)
                            }
                            for(var key1 in list_item){
                                if(key == 'visible' && element[key].toString().indexOf(key1)>-1 && element[key] != null && list_item[key1] !=null ){
                                    element[key] = element[key].toString().replace(new RegExp('"##'+key1+'##"','g'),'"'+(this.list_item[key1].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+'"');
                                    element[key] = element[key].toString().replace(new RegExp('\'##'+key1+'##\'','g'),"'"+(this.list_item[key1].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                                    element[key] = element[key].toString().replace(new RegExp('##'+key1+'##','g'),"'"+(this.list_item[key1].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");           
                                }
                            }
                            for (var key2 in vm.flatRuntimeAttributes) {
                                if (vm.flatRuntimeAttributes.hasOwnProperty(key2)) {
                                    if(key == 'visible' && element[key].toString().indexOf(key2)>-1 && element[key] != null && vm.flatRuntimeAttributes[key2] !=null ){
                                        let hasMatches = element[key].match(/matches\((.*?)\)/g) 
                                        
                                        if( !(hasMatches && hasMatches[0] && hasMatches[0].indexOf("##")) && element[key].indexOf('"##')<0 && element[key].indexOf('\'##')<0){
                                            element[key] = element[key].toString().replace(new RegExp('##'+key2+'##','g'),"'"+(vm.flatRuntimeAttributes[key2].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                                        }
                                        else{
                                            element[key] = element[key].toString().replace(new RegExp('##'+key2+'##','g'),vm.flatRuntimeAttributes[key2].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                                        }
                                    }
                                }
                            }
                            for(var key3 in vm.current.parent){
                                if(key == 'visible' && element[key].toString().indexOf(key3)>-1 && element[key] != null && vm.current.parent[key3] !=null ){
                                        if( element[key].indexOf('"##')<0 && element[key].indexOf('\'##')<0){
                                            element[key] = element[key].toString().replace(new RegExp('##'+key3+'##','g'),"'"+(vm.current.parent[key3].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'))+"'");
                                        }
                                        else{
                                            element[key] = element[key].toString().replace(new RegExp('##'+key3+'##','g'),vm.current.parent[key3].toString().replace(/[\r\n]+/g," ").replace(/["]/g,'\\\"'));
                                        }
                                    }
                            }
                            if(key == 'visible' && element[key].toString().indexOf('##')>-1){
                                if( element[key].indexOf('"##')<0 && element[key].indexOf('\'##')<0){
                                    element[key] = element[key].toString().replace(/##(.*?)##/g,'""')
                                }
                                else{
                                    element[key] = element[key].toString().replace(/##(.*?)##/g,'')
                                }
                            }
                        }
                    });
                    return screen_item_new_temp;
                },
            },
    });