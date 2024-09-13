<script>
    let removeCache = <?php echo ($removeCache?"true":"false");?>;
    if(removeCache){
        async function removeItems() {
            await localforage.removeItem('rtcloud_webapp_modules');
            await localforage.removeItem('rtcloud_webapp_module_power');
        }
        removeItems();
    }
    var w;
    if (typeof(Worker) !== "undefined") {
        if (typeof(w) == "undefined") {
            let http = new XMLHttpRequest();
            let url = "/plugins/worker.js"
            http.open('HEAD', url, false);
            http.send();
            if (http.status != 404)
                w = new Worker(url);
        }
    } 

    <?php if($modulecode === ""){ ?>
        // Hide splash-screen webapp
        setTimeout(() => {
            $(".splash-screen").addClass("display-none");  
            $(".covered-screen").removeClass("display-none");      
        }, 2000);
    <?php } ?>

    function pickRandomProperty(obj) {
        var result;
        var count = 0;
        for (var prop in obj)
            if (Math.random() < 1/++count)
                result = prop;
        return result;
    }

    $.ajax({
        url: "<?php echo Yii::app()->params['matrixapi_url']; ?>/services/getQuote",
        data: {
            format: 'json'
        },
        success: function(data) {
            var data = JSON.parse(data);
            var random = pickRandomProperty(data);
            document.getElementById("HomePage_qoute").innerHTML = data[random].qoute;
            document.getElementById("actor").innerHTML = data[random].actor;
        },
        type: 'GET'
    });

    var access_token = "<?php echo $access_token;?>";
    var show_taskbar = <?php echo ($show_taskbar=="yes"?"true":"false");?>;
    var show_welcomebox = <?php echo ($show_welcomebox=="yes"?"true":"false");?>;
    
</script>
