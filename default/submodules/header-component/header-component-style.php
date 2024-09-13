<style>
    .scroll-com:hover::-webkit-scrollbar {
        width: 0px; 
        height: 5px;
        background-color: transparent;
        display: block;
    }
    .scroll-com:hover::-webkit-scrollbar-thumb {
        background-color: #009688 !important; 
    }
    .bootstrap-iso .form .form-body{
        padding:1px !important;
    }
    .header-sub {
        width: 100%;
        height: 45px;
        line-height: 45px;
        background-color: #009688;
        padding-left: 20px;
        color: #fff !important;
        font-size: 16px;
    }

    .no-instances {
        background-image: url("/img/webapp-no-instances-icon.png");
        height: 500px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 25%;
    }

    .scroll-com > ul.nav.nav-tabs{
        display:flex;
        flex-direction: row;
        align-items: flex-start;
        flex-wrap: nowrap;
        width: 100%;
    }
    .scroll-com > ul.nav.nav-tabs > li{
        flex: 0 0 auto;
        justify-content: center;
        align-items: center;
    }
    .scroll-com:hover{
        scrollbar-width: thin;
    }
    .scroll-com{
        scrollbar-width: none;
    }
    .dropdown-menu.searchInput::before,.dropdown-menu.searchInput::after{
        left: auto !important;
        right: 7px !important;
    }
    .caption  i:hover.rta-fas-icon.fas.fa-arrow-left{
        border-radius: 50%;
        background-color: rgb(0 0 0 / 5%);
        padding: 7px;
    }
    .rta-search-com:focus{
        outline: 0;
        border: 1px solid #009688 !important;
    }
    .rta-search-com:focus-visible{
        outline: 0;
    }
    .rta-search-com::placeholder{
        color: #bdbdbd;
    }
    .btn-group.btn-theme-panel.filterdisplay.open button > i.la.la-filter{
        color: #009688 !important;
    }

    .nav-tabs > li.active > a {
        color: #009688 !important;
        background-color: #e5f4f3 !important;
        font-weight: bolder;
        border-radius: 4px !important;
    }

    .nav-tabs > li > a {
        color: #000000;
        background: transparent;
        border: none !important;
        font-weight: bolder;
        margin-right: 0 !important;
    }

    .nav-tabs > li {
        background-color: #eeeeee;
        border-radius: 4px !important;
    }

    .nav-tabs > li > a:hover {
        color: #009688 !important;
        background-color: #e5f4f3 !important;
        border-left: none;
        border-radius: 4px !important;
    }

    .rta-btn-disable{
        background: #eee !important;
        cursor: not-allowed !important;
    }
</style>