setInterval(()=>{
    refreshToken();
}, 60000);

function refreshToken (){
    openid.getKeycloak().updateToken(120).then(function() {
        vm.flatRuntimeAttributes['user.access_token'] = openid.getKeycloak().token;
        vm.runtimeAttributes['user']['access_token'] = openid.getKeycloak().token;
    }).catch(function() {
        console.log("kc_token", 'Failed to refresh token.');
    });

}

function stringToASCII(str) {
    try {
        return str.replace(/[àáảãạâầấẩẫậăằắẳẵặ]/g, 'a')
            .replace(/[èéẻẽẹêềếểễệ]/g, 'e')
            .replace(/[đ]/g, 'd')
            .replace(/[ìíỉĩị]/g, 'i')
            .replace(/[òóỏõọôồốổỗộơờớởỡợ]/g, 'o')
            .replace(/[ùúủũụưừứửữự]/g, 'u')
            .replace(/[ỳýỷỹỵ]/g, 'y')
    } catch {
        return ''
    }
}

function makeElemId() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 32; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
function btn_close() {
    $("#fullCalModal").modal("hide")
}

function handleDMFunction(funcStr) {
    if(funcStr == 'true' || funcStr == true || funcStr == 'false' || funcStr == false){
        return funcStr
    }
    funcStr = funcStr.substring(2,funcStr.length-1);
        let result = eval(funcStr);
        return result;      
}
function matches(regex, arg)
{
    //matches all arg with regex. Ex: matches("[0-9]+","13123") -> true
    const matches = arg.match(new RegExp( regex, 'g' ));
    if(matches && matches[0] == arg){
        return  true;
    }
    return false;
}
function hash(s) {
    /* Simple hash function. */
    let a = 1, c = 0, h, o;
    if (s) {
        a = 0;
        /*jshint plusplus:false bitwise:false*/
        for (h = s.length - 1; h >= 0; h--) {
            o = s.charCodeAt(h);
            a = (a<<6&268435455) + o + (o<<14);
            c = a & 266338304;
            a = c!==0?a^c>>21:a;
        }
    }
    return String(a);
}
function number(number){
    if(number===''){return 'error';}
    var num = Number(number);
    if(isNaN(num)) {return 'error';}
    return num;
}
function boolean(arg){
    if(arg === '' || typeof(arg) === 'string') return false;
    var boo = Boolean(arg);
    return boo;
}
function eq(var1,var2){
    if(typeof(var1) !== typeof(var2)){
        if(var1==var2 && (var1!=='' || var2!=='')){
            return false;
        }
        return "error";
    }
    if(var1 === var2){
        return true;
    }
    else{
        return false;
    }
}
function replace(arg1,regex,arg2){
    arg1 = arg1.replace(new RegExp(regex,'g'),arg2)
    return arg1;
}

function isEmpty(arg){
    if(arg.length > 0){
        return true;
    }
    else{
        return false;
    }
}
function is_number(arg){        
    if(!isNaN(arg) && arg!==''){
        return true;
    }
    else{
        return false;
    }
}
function gt(arg1,arg2){
    if(arg1==='' || arg2==='' || isNaN(arg1) || isNaN(arg2)) return "error";
    if(Number(arg1) > Number(arg2)){
        return true;
    }
    else{
        return false;
    }
}
function lt(arg1,arg2){
    if(arg1==='' || arg2==='' || isNaN(arg1) || isNaN(arg2)) return "error";
    if(Number(arg1) < Number(arg2)){
        return true;
    }
    else{
        return false;
    }
}
function sum() {
    let sum = 0;
    for(let i = 0; i < arguments.length; i++) {
        if((isNaN(arguments[i]) && arguments[i]!=='') ||arguments[i]===''){ return 'error';}
        sum += Number(arguments[i]);
    }
    return sum;
}
function is_empty(){
    if(arguments[0] != undefined && arguments[0].toString().length > 0){
        return false;
    }
    else{
        return true;
    }
    
}
function avg() {
    let sum = 0;
    for(let i = 0; i < arguments.length; i++) {
        if((isNaN(arguments[i]) && arguments[i]!=='') ||arguments[i]===''){ return 'error';}
        sum += Number(arguments[i]);
    }
    const avg = sum / arguments.length;
    return avg;
}
function min() {
    const arr = [];
    for(let i = 0; i < arguments.length; i++) {
        if((isNaN(arguments[i]) && arguments[i]!=='') ||arguments[i]===''){ return 'error';}
        arr.push(Number(arguments[i]))
    }
    const min = Math.min.apply (Math, arr)
    return min;
}
function multiple() {
    let multi = 1;
    for(let i = 0; i < arguments.length; i++) {
        if((isNaN(arguments[i]) && arguments[i]!=='') ||arguments[i]===''){ return 'error';}
        multi*=Number(arguments[i])
    }
    return multi;
}
function max() {
    const arr = [];
    for(let i = 0; i < arguments.length; i++) {
        if((isNaN(arguments[i]) && arguments[i]!=='') ||arguments[i]===''){ return 'error';}
        arr.push(Number(arguments[i]))
    }
    const max = Math.max.apply (Math, arr)
    return max;
}
function and(){
    var boo = 0;
    for(var i = 0; i < arguments.length; i++) {
        if(arguments[i] == false || arguments[i]!=true){
                boo = 1;
        }
    }
    if(boo == 0){
        return true;
    }
    else{
        return false;
    }
    
}
function or(){
    var boo = 0;
    for(var i = 0; i < arguments.length; i++) {
        if(arguments[i] == true){
                boo = 1;
        }
    }
    if(boo == 1){
        return true;
    }
    else{
        return false;
    }
    
}
function abs(arg){
    if((isNaN(arg) && arg!=='') || arg==='' || arg===-'') return 'error';
    return Math.abs(arg);
}
function number_format(format, arg1){
    if(format==='' || format===null || format==='null') return 'error';
    let value = new DecimalFormat(arg1).format(format)
    return value;
}
function string_format(){
    let string = arguments[0];
    let index = 0;
    let temp = arguments
    string = string.replace(/%S|%s/g, function(matched){
        index+=1;
        return matched === '%S' ? temp[index].toUpperCase() : temp[index];
    })
    return string;
}
function guest_mode(){
    return false;
}
function str_which(){
    let string = arguments[0];
    let pattern = arguments[1];
    let regex = eval('/'+pattern+'/g')
    return regex.test(string)
}
function str_count(){
    let string = arguments[0];
    let pattern = arguments[1]; 
    let regex = eval('/'+pattern+'/g')
    let splitChart= string.match(regex)
    let a = 0
    if(splitChart){
        return (splitChart.length).toFixed(1);
    } else return a.toFixed(1)
}
function str_sub(){
    let string = arguments[0];
    let string_temp = arguments.length == 3 ? 
        string.substring(arguments[1],arguments[2]+1) : 
            string.substr(arguments[1])
    return string_temp
}
function str_extract(){
    let string = arguments[0];
    let pattern = arguments[1]; 
    let found = string.match(pattern);
    let string_temp =""
    if(found){
        string_temp = arguments.length == 3 ? found[arguments[2]] : found[0]
    }
    return string_temp ? string_temp : ""
}
function str_length(){
    let string = arguments[0];
    return string.length.toFixed(1)
}
function str_trim(){
    let string = arguments[0];
    let side = arguments[1]
    switch (side) {
        case "left":
            string = string.trimStart()
            break;
        case "right":
            string = string.trimEnd()
        break;
        default:
            string = string.trim()
            break;
    }
    return string
}
function str_to_lower(){
    let string = arguments[0];
    return string.toLowerCase() 
}
function str_to_upper(){
    let string = arguments[0];
    return string.toUpperCase() 
}
function str_locate (){
    let string = arguments[0];
    let pattern = arguments[1]; 
    let regex = eval('/'+pattern+'/g')
    let locate = string.search(regex)
    if(locate >=0){
        return locate.toFixed(1)
    }
    return ""
}

function module_exists(code){
    if(vm.modules.hasOwnProperty(code)){
        return true;
    }else{
        return false;
    }
}

function module_granted(code){
    if(vm.modules.hasOwnProperty(code) && vm.modules[code].hasOwnProperty('power_needed') && parseInt(vm.module_power[code]) >= parseInt(vm.modules[code].power_needed)){
        return true;
    }else if(vm.modules.hasOwnProperty(code) && !vm.modules[code].hasOwnProperty('power_needed')){
        return true;
    }else{
        return false;
    }
}

function now(){
    return (new Date()).getTime();
}

function convertTimestampToISO8601(timestamp) {
    const date = new Date(Number(timestamp));
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);
    const milliseconds = ("00" + date.getMilliseconds()).slice(-3);
    const offsetHours = -Math.floor(date.getTimezoneOffset() / 60);
    const offsetMinutes = date.getTimezoneOffset() % 60;
    const offsetSign = offsetHours >= 0 ? "+" : "-";
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetSign}${("0" + Math.abs(offsetHours)).slice(-2)}:${("0" + offsetMinutes).slice(-2)}`;
}

function time_format(unixtime, format="") {
    if(format===""){
        return convertTimestampToISO8601(unixtime)
    }
    var dateO = new Date(Number(unixtime)),
        date = dateO,
        result = format.toString(),
        intPad = function(num, l) {
            var str = num.toString(),
                zeros = l - str.length;
            for (var j = 0; j < zeros; j++) {
            str = '0' + str;
            }
            return str;
        },
        props;

    if (isNaN(date.getTime())) {
        return date.toString();
    }

    props = {
        'Y': date.getFullYear(),
        'y': date.getFullYear().toString().substring(2, 4),
        'm': intPad((date.getMonth() + 1), 2),
        'n': date.getMonth() + 1,
        'b': vm.lang === "en" ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()] : ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"][date.getMonth()],
        'd': intPad(date.getDate(), 2),
        'e': date.getDate(),
        'H': intPad(date.getHours(), 2),
        'h': date.getHours(),
        'M': intPad(date.getMinutes(), 2),
        'S': intPad(date.getSeconds(), 2),
        '3': intPad(date.getMilliseconds(), 3),
        'a': vm.lang === "en" ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()] : ["CN", "T.2", "T.3", "T.4", "T.5", "T.6", "T.7"][date.getDay()]
    };

    for (var prop in props) {
        result = result.replace('%' + prop, props[prop]);
    }

    return result;
}

function str_to_time(timestring){
    return (new Date(timestring)).getTime();
}

function difftime(time1, time2, format){
    if(/^\d{13}$/.test(time1)){
        time1 = Number(time1)
    }
    if(/^\d{13}$/.test(time2)){
        time2 = Number(time2)
    }
    const date1 = new Date(time1);
    const date2 = new Date(time2);

    let diff = Math.abs(date1 - date2);

    switch (format) {
    
        case "secs":
            diff = diff/1000;
            break;

        case "mins":
            diff = diff/60000;
            break;

        case "hours":
            diff = diff/3600000;
            break;

        case "auto":
        case "days":
            diff = diff/86400000;
            break;

        case "weeks":
            diff = diff/604800000;
            break;

        default:
            return "Invalid format";
    }
    diff = diff.toFixed(2)
    if(format == "auto"){
        let day = vm.lang === "en" ? " days" : " ngày"
        diff = diff+day
    }
    return diff
}

function call_function_base64(function_base64){
    return eval(window.atob(function_base64))
}

function encode_url(data){
    return encodeURIComponent(data)
}

function escape_json(data){
    return JSON.stringify(data).slice(1,-1)
}

function decode_base64(data){
    return window.atob(data)
}

function unescape_json(data){
    data = data.replace(/\\\\/g, "\\")
            .replace(/\\\\n/g, "\\n")
            .replace(/\\\\'/g, "\\'")
            .replace(/\\\\"/g, '\\"')
            .replace(/\\\\&/g, "\\&")
            .replace(/\\\\r/g, "\\r")
            .replace(/\\\\t/g, "\\t")
            .replace(/\\\\b/g, "\\b")
            .replace(/\\\\f/g, "\\f")
            .replace(/\\\"/g, "\"");
    return data
}

function if_else(bool, valueTrue="", valueFalse=""){
    return bool ? valueTrue : valueFalse
}
//funtion nanoid
const urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
const POOL_SIZE_MULTIPLIER = 128
let pool, poolOffset

function fillPool(bytes) {
    if (!pool || pool.length < bytes) {
        pool = new Uint8Array(bytes * POOL_SIZE_MULTIPLIER)
        crypto.getRandomValues(pool)
        poolOffset = 0
    } else if (poolOffset + bytes > pool.length) {
        crypto.getRandomValues(pool)
        poolOffset = 0
    }
    poolOffset += bytes
}

function random(bytes) {
    fillPool((bytes -= 0))
    return pool.subarray(poolOffset - bytes, poolOffset)
}

function customRandom(alphabet, defaultSize, getRandom) {
    let mask = (2 << (31 - Math.clz32((alphabet.length - 1) | 1))) - 1
    let step = Math.ceil((1.6 * mask * defaultSize) / alphabet.length)

    return (size = defaultSize) => {
        let id = ''
        while (true) {
            let bytes = getRandom(step)
            let i = step
            while (i--) {
                id += alphabet[bytes[i] & mask] || ''
                if (id.length === size) return id
            }
        }
    }
}

function customAlphabet(alphabet, size = 21) {
    return customRandom(alphabet, size, random)
}

function nanoid(size = 21) {
    fillPool((size -= 0))
    let id = ''
    for (let i = poolOffset - size; i < poolOffset; i++) {
        id += urlAlphabet[pool[i] & 63]
    }
    return id
}
function randomnanoid(t=21,type=""){
    let regex = /[^0-9]/;
    if(regex.test(t.toString().trim())){
        t = 21
    }else{
        t = Number(t)
    }
    t = t > 50 ? 50 : t
    t = t <= 0 ? 21 : t
    if(type === 'number'){
        let cus_nanoid = customAlphabet('0123456789',t)
        return cus_nanoid()
    }
    if(type === 'letter'){
        let cus_nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',t)
        return cus_nanoid()
    }
    if(type === 'except_special'){
        let cus_nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',t)
        return cus_nanoid()
    }
    return nanoid(t);
}
// end function nanoid
function div(a, b) {
    return a / b;
}

    window.onmessage = (event) => {
        if(event.data && typeof event.data =='object' &&  event.data.action == 'close'){
            vm.closeIframe(event.data)
        }
        if(event.data=="close"){
            vm.closeIframe(event.data)
        }
        if(event.data.action=="Minimize"){
            if(event.data.hasOwnProperty('tracking_id') && event.data.tracking_id !== ''){
                vm.tracking_id_button = event.data.tracking_id
            }
            vm.minimizeTask(event.data)
        }
        if(event.data=="Maximize"){
            vm.maximizeTask()
        }
        if(event.data=="Close this form"){
            vm.closeIframe(event.data)
        }
        if(event.data.action=="Show warning"){
            vm.showWarningTask(event.data)
        }
        if (event.data == 'closeWebpage') {
            if(vm.listSreenTheme[vm.activeTaskCode]?.length>0){                                        
                let list = vm.listSreenTheme[vm.activeTaskCode]
                let taskcode = list[list.length-1]
                vm.listSreenTheme[vm.activeTaskCode].pop()   
                vm.tasks[taskcode].isDeleted = true;
                setTimeout(function() {
                    $('#task-modal-'+taskcode).remove();
                    $('#task-icon-'+taskcode).remove();
                }, 200)
            }else{
                vm.closeTask(vm.tasks[vm.activeTaskCode])
            }
        }
    }; 
    
    function handleMessage(event) {
        if (typeof vm !== 'undefined' && typeof vm.DMCloudPhone === 'function') {
            vm.DMCloudPhone(event);
        }
    }
    window.addEventListener("message", handleMessage, false);

    //support change language
    const removeModuleForage = async () => {
        await localforage.removeItem(module_view)
        await localforage.removeItem(module_power_view)
    }
    $(".rta.page-header.navbar .dropdown-language .dropdown-menu-default li").on( "click", function() {
        removeModuleForage()
    });
    //support funtion number_format
    function DecimalFormat(formatStr)
    {
        this.prefix = '';
        this.suffix = '';
        this.comma = 0;
        this.minInt = 1;
        this.minFrac = 0;
        this.maxFrac = 0;
        
        // get prefix
        for (let i=0; i<formatStr.length; i++) {
            if (formatStr.charAt(i) == '#' || formatStr.charAt(i) == '0') {
                this.prefix = formatStr.substring(0,i);
                formatStr = formatStr.substring(i);
                break;
            }
        }
        
        // get suffix
        this.suffix = formatStr.replace(/[#]|[0]|[,]|[.]/g , '');

        // get number as string
        const numberStr = formatStr.replace(/[^0#,.]/g , '');
        
        let intStr = '';
        let fracStr = '';
        const point = numberStr.indexOf('.');
        if (point != -1) {
            intStr = numberStr.substring(0,point);
            fracStr = numberStr.substring(point+1);
        }
        else {
            intStr = numberStr;
        }
        
        const commaPos = intStr.lastIndexOf(',');
        if (commaPos != -1) {
            this.comma = intStr.length - 1 - commaPos;
        }
        
        intStr = intStr.replace(/[,]/g , ''); // remove commas

        fracStr = fracStr.replace(/[,]|[.]+/g , '');

        this.maxFrac = fracStr.length;
        let tmp = intStr.replace(/[^0]/g , ''); // remove all except zero
        if (tmp.length > this.minInt)
        this.minInt = tmp.length;
        tmp = fracStr.replace(/[^0]/g , '');
        this.minFrac = tmp.length;
    }

    DecimalFormat.prototype.format = function(numStr) { // 1223.06 --> $1,223.06
        // remove prefix, suffix and commas
        var numberStr = this.formatBack(numStr).toLowerCase();
        
        // do not format if not a number
        if (isNaN(numberStr) || numberStr.length == 0)
        return numStr;
        
        //scientific numbers
        if (i = numberStr.indexOf("e") != -1) {
        var n = Number(numberStr);
        if (n=="Infinity" || n=="-Infinity") return numberStr;
        numberStr = n+"";
        if(numberStr.indexOf('e') != -1) return numberStr;
        }

        var negative = false;
        // remove sign
        if (numberStr.charAt(0) == '-') {
        negative = true;
        numberStr = numberStr.substring(1);
        }
        else if (numberStr.charAt(0) == '+') {
        numberStr = numberStr.substring(1);
        }

        var point = numberStr.indexOf('.'); // position of point character
        var intStr = '';
        var fracStr = '';
        if (point != -1) {
            intStr = numberStr.substring(0,point);
            fracStr = numberStr.substring(point+1);
        }
        else {
            intStr = numberStr;
        }
        fracStr = fracStr.replace(/[.]/ , ''); // remove other point characters
        
        var isPercentage = this.suffix && this.suffix.charAt(0) === '%';
        // if percentage, number will be multiplied by 100.
        var minInt = this.minInt, minFrac = this.minFrac, maxFrac = this.maxFrac;
        if (isPercentage) {
        minInt -= 2;
        minFrac += 2;
        maxFrac += 2;
        }
        
        if (fracStr.length > maxFrac) { // round
            //case 6143
            var num = new Number('0.' + fracStr);
            num = (maxFrac == 0)? Math.round(num) : num.toFixed(maxFrac);
            // toFixed method has bugs on IE (0.7 --> 0)
            fracStr = num.toString(10).substr(2);
            var c = (num>=1)? 1:0; //carry
            var x, i=intStr.length-1;
            while (c) { //increment intStr
            if (i==-1) {
                intStr = '1'+intStr;
                break;
            }
            else {
                x = intStr.charAt(i);
                if (x==9) {x='0'; c=1;}
                else {x = (++x)+''; c=0;}
                intStr = intStr.substring(0,i) + x + intStr.substring(i+1,intStr.length);
                i--;
            }
            }
        }
        for (var i=fracStr.length; i<minFrac; i++) { // if minFrac=4 then 1.12 --> 1.1200
            fracStr = fracStr + '0';
        }
        while (fracStr.length > minFrac && fracStr.charAt(fracStr.length-1) == '0') { // if minInt=4 then 00034 --> 0034)
            fracStr = fracStr.substring(0,fracStr.length-1);
        }
        
        for (var i=intStr.length; i<minInt; i++) { // if minInt=4 then 034 --> 0034
            intStr = '0' + intStr;
        }
        while (intStr.length > minInt && intStr.charAt(0) == '0') { // if minInt=4 then 00034 --> 0034)
            intStr = intStr.substring(1);
        }
        
        if (isPercentage) { // multiply by 100
        intStr += fracStr.substring(0,2);
        fracStr = fracStr.substring(2);
        }
        
        var j = 0;
        for(var i=intStr.length; i>0; i--) { // add commas
            if (j != 0 && j%this.comma == 0) {
                intStr = intStr.substring(0,i) + ',' + intStr.substring(i);
                j = 0;
            }
            j++;
        }

        var formattedValue;
        if (fracStr.length > 0)
            formattedValue = this.prefix + intStr + '.' + fracStr + this.suffix;
        else
            formattedValue = this.prefix + intStr + this.suffix;
            
        if (negative) {
            formattedValue = '-' + formattedValue;
        }
        
        return formattedValue;
    }
    DecimalFormat.prototype.formatBack = function(fNumStr) { // $1,223.06 --> 1223.06
    fNumStr += ''; //ensure it is string
    if (!fNumStr) return ''; //do not return undefined or null
    if (!isNaN(fNumStr)) return this.getNumericString(fNumStr);
    var fNumberStr = fNumStr;
    var negative = false;
    if (fNumStr.charAt(0) == '-') {
        fNumberStr = fNumberStr.substr(1);
        negative = true;
    }
    var pIndex = fNumberStr.indexOf(this.prefix);
    var sIndex = (this.suffix == '')? fNumberStr.length : fNumberStr.indexOf(this.suffix, this.prefix.length+1);
    if (pIndex == 0 && sIndex > 0) {
        // remove suffix
        fNumberStr = fNumberStr.substr(0,sIndex);
        // remove prefix
        fNumberStr = fNumberStr.substr(this.prefix.length);
        // remove commas
        fNumberStr = fNumberStr.replace(/,/g , '');
        if (negative)
        fNumberStr = '-' + fNumberStr;
        if (!isNaN(fNumberStr))
        return this.getNumericString(fNumberStr);
    }
    return fNumStr;
    }
    DecimalFormat.prototype.getNumericString = function(str){
        //first convert to number
        var num = new Number(str);
        //check if there is a missing dot
        var numStr = num + '';
        if (str.indexOf('.')>-1 && numStr.indexOf('.')<0){
            //check if original string has all zeros after dot or not
            for (var i=str.indexOf('.')+1;i<str.length;i++){
                //if not, this means we lost precision
                if (str.charAt(i) !== '0') return str;
            }
            return numStr;
        }
        return str;
    }
        //end number_format
    function base64ToHex(str) {
        const raw = atob(str);
        let result = '';
        for (let i = 0; i < raw.length; i++) {
            const hex = raw.charCodeAt(i).toString(16);
            result += (hex.length === 2 ? hex : '0' + hex);
        }
        return result.toUpperCase();
    }

    function hashCode(str){
        let hash = 0;
        if (str.length == 0) return hash;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }
    $('.menu-toggler.responsive-toggler').click(function() { 
        let x = $('.page-top').hasClass('hidden-top')
        if(x){
            $('.page-top').removeClass('hidden-top')
        }else{
            $('.page-top').addClass('hidden-top')
        }
    });

    $(document).on("shown.bs.dropdown", ".toparea", function () {
        var $ul = $(this).children(".dropdown-menu");
        if($ul.children().length<=1){
            $ul.css({'display':'none'});
            $ul.children().click();
        }
        var $button = $(this).children(".dropdown-toggle");
        var ulOffset = $ul.offset();
        var spaceUp = (ulOffset.top - $button.height() - $ul.height()) - $(window).scrollTop();
        
        var spaceDown = $(window).scrollTop() + $(window).height() - (ulOffset.top + $ul.height());
        if (spaceDown < 0 && (spaceUp >= 0 || spaceUp > spaceDown)){
           
            $(this).addClass("dropup");
        }
        
    }).on("hidden.bs.dropdown", ".toparea", function() {
        
        $(this).removeClass("dropup");
    });
    
    $.ajaxSetup({
        beforeSend: function(jqXHR, settings) {
            var key = CryptoJS.enc.Hex.parse("168b5e441be60f647dff935e20a869c5");
            var iv =  CryptoJS.enc.Hex.parse("140210eb0e8b2a8ded7193728cedd6b6");
            if (settings.url.indexOf('https://es.rta.vn')>-1){
                let url = settings.url.substring(17)
                var encrypted = CryptoJS.AES.encrypt(url, key, {iv:iv});
                let entdata = CryptoJS.AES.encrypt(settings.data, key, {iv:iv});
                if(settings.url.indexOf('/_search')>-1){
                    settings.url = 'https://es.rta.vn/_protected_search/' + base64ToHex(encrypted);
                }else{
                    settings.url = 'https://es.rta.vn/_protected_data/' + base64ToHex(encrypted);
                }
                settings.data = base64ToHex(entdata);
            }

        }
    }); 
