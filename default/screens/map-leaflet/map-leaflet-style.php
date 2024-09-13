<style>
    .buttonmap{
        background: transparent;
        border: none;
        color: rgb(255, 255, 255);
        display: block;
        outline: none;
        margin: auto !important;;
    }
    .showPopup iframe{
        width:100%;
        height: 17vh;
        transition: 0.8s;
    }
    .showPopup{
        height: 23vh;
        transition: 0.8s;
        overflow:auto;
    }
    .map-label {
    position: absolute;
    bottom: 0;left: -50%;
    display: flex;
    flex-direction: column;
    text-align: center;
    }
    .leaflet-top.leaflet-left{
        transition: 0.8s;
    }
    .leaflet-bottom.leaflet-left{
        transition: 0.8s;
    }
    .map-label-content {
    order: 1;
    position: relative; left: -50%;bottom: -36px;
    background-color: #fff;
    border-radius: 10px;
    border-width: 2px;
    border-style: solid;
    border-color: #444;
    padding: 3px;
    white-space: nowrap;

    }

    .map-label-arrow {
    order: 2;
    width: 0px; height: 0px; left: 50%;
    border-style: solid;
    border-color: #444 transparent transparent transparent;
    border-width: 10px 6px 0 6px; 
    margin-left: -6px;
    }
    .swal2-container{
        z-index: 10000 !important;
    }

    .bearing {
        color: #4285F4;
        font-size: 20px;
        margin-left: -6px;
        width: 0px;
        height: 0px;
    }
    .map-label-content-bearing {
        /* order: 1; */
        position: relative; left: -50%;
        bottom: 10px;
        background-color: #fff;
        border-radius: 10px;
        border-width: 2px;
        border-style: solid;
        border-color: #444;
        padding: 3px;
        white-space: nowrap;
    }
    .map-label-content-marker-path {
        order: 1;
        position: relative; 
        bottom: -2px;
        background-color: #fff;
        border-radius: 10px;
        border-width: 2px;
        border-style: solid;
        border-color: #444;
        padding: 3px;
        white-space: nowrap;
    }
</style>