<style>
    #app .modal .webapp-popup .chart-view .loading {
        margin: 10% auto;
        border: 8px solid #f3f3f3;
        border-top: 8px solid #3498db;
        border-radius: 50% !important;
        width: 60px;
        height: 60px;
        -webkit-animation: spin 2s linear infinite;
        animation: spin 2s linear infinite;
    }
    .loadicon{
        border: 8px solid #f3f3f3;
        border-top: 8px solid #3498db;
        width: 60px;
        height: 60px;
        -webkit-animation: spin 2s linear infinite; /* Safari */
        animation: spin 2s linear infinite;
        margin:auto;
    }
    .parentload{
        display:none;
    }
    /* Safari */
    @-webkit-keyframes spin {
        0% { -webkit-transform: rotate(0deg); }
        100% { -webkit-transform: rotate(360deg); }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .modal-body .theme-option {
        border-top: none !important;
    }
</style>