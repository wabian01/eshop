<style>
    .rta-dropdown-action-button-li:hover::-webkit-scrollbar {
        width: 3px !important;
        background-color: #fff;
        display: block !important;
    }
    .rta-dropdown-action-button-li:hover::-webkit-scrollbar-thumb {
        background-color: #bdbdbd !important; 
        width: 3px !important;
    }
    .rta-dropdown-action-button-li li:empty{
        display: none;
    }
    .modal-content .dropdown_overflow .rta-dropdown-action-button, .modal-content .dropdown_overflow .rta-dropdown-action-button-li{
        margin-right: -15px !important;
    }
    .dropdown_overflow.open .rta-dropdown-action-button{
        background:#0000001a;
    }
    .rta-dropdown-action-button:hover{
        background:#0000001a;
        cursor: pointer;
    }
    .rta-dropdown-action-button-li li:hover{
        background: #e5f4f3 !important;
    }
    .rta-dropdown-action-button-li li button:hover{
        color: #000 !important;
    }
    .rta-dropdown-action-button-li li button{
        width:100%;
        text-align: left !important;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .scrollAB:has(span:only-child) {
        padding: 0px !important;
    }
    .scrollAB{
        width: 100%;
        display: inline-flex;
        overflow: auto;
        scrollbar-width: none !important;
    }
    .scrollAB:hover {
        scrollbar-width: thin !important;
    }
    .scrollAB:hover::-webkit-scrollbar{
        display:block;
        height:7px;
    }
    #loading-ac {
        display: none;
        width: 20px;
        height: 20px;
        border: 3px solid rgba(255,255,255,.3);
        border-radius: 50% !important;
        border-top-color: #fcab29;
        animation: spin 1s ease-in-out infinite;
        -webkit-animation: spin11 1s ease-in-out infinite;
        position:relative;
        top:6px;
    }
    .starchecked{
        color:#fed430;
    }
    .starunchecked{
        color:#cccccc;
    }
    @keyframes spin11 {
        to { -webkit-transform: rotate(360deg); }
    }
    @-webkit-keyframes spin11 {
        to { -webkit-transform: rotate(360deg); }
    }
</style>