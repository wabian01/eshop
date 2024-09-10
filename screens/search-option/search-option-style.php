<style> 
    .datepicker-rta.daterangepicker .drp-selected {
        font-size: 14px;
    }
    .datepicker-rta.daterangepicker td.active.end-date.start-date.available{
        border-radius: 50% !important;
    }
    .datepicker-rta.daterangepicker td.active.start-date.available{
        border-top-right-radius: 0px !important;
        border-bottom-right-radius: 0px !important;
    }
    .datepicker-rta.daterangepicker td.active.end-date.available{
        border-top-left-radius: 0px !important;
        border-bottom-left-radius: 0px !important;
    }
    .datepicker-rta.daterangepicker td.active.off, .daterangepicker td.active.off:hover{
        background-color: #fff !important;
        border-color: transparent !important;
        color: #999 !important;
    }
    .datepicker-rta.daterangepicker td.available.in-range.off:hover,
    .datepicker-rta.daterangepicker td.available.off.active.start-date:hover,
    .datepicker-rta.daterangepicker td.available.off.end-date:hover{
        border-radius: 50% !important;
        background: #eee !important;
        color: #999 !important;
    }
    .datepicker-rta.daterangepicker td.available.in-range:not(.off, .end-date, .start-date):hover{
        border-radius: 0px !important;
        background: #e5f4f3;
    }
    .datepicker-rta.daterangepicker td.active, .datepicker-rta.daterangepicker td.active:hover{
        background-color: #009688 !important;
        border-color: transparent !important;
        color: #fff !important;
        border-radius: 50% !important;
        box-shadow: none !important;
    }
    .datepicker-rta.daterangepicker .calendar-table th, .daterangepicker .calendar-table td{
        height: 32px !important;
    }
    .datepicker-rta.daterangepicker td.available:hover, .daterangepicker th.available:hover{
        border-radius: 50% !important;
    }
    .datepicker-rta.daterangepicker td.available.today{
        border-radius: 50%;
        box-shadow: inset 0px 0px 0px 1px #737373;
    }
    .datepicker-rta.daterangepicker td.in-range{
        background-color: #e5f4f3;
    }
    .datepicker-rta.daterangepicker .drp-buttons .btn{
        font-weight: bold;
        width: 100px;
        height: 40px;
        border: none;
        border-radius: 4px !important;
        font-size: 14px;
    }
    .datepicker-rta.daterangepicker .drp-buttons .btn.cancelBtn{
        background: #eee;
        color: #737373 !important;
        cursor:pointer;
    }
    .datepicker-rta.daterangepicker .drp-buttons .btn.applyBtn{
        background: #009688;
        color: #fff !important;
        cursor:pointer;
    }
    .datepicker-rta.daterangepicker.show-calendar .ranges{
        margin: 0;
    }
    .wrap-datepicker-filter{
        width: 100%;
        height: 35px;
        border: 1px solid #bdbdbd;
        padding: 5px 0px 5px 5px;
        border-radius: 4px !important;
        margin-top:5px;
        display:flex;
        align-items: center;
        justify-content: space-between;
    }
    .wrap-list-options:hover::-webkit-scrollbar {
        width: 3px !important;
        background-color: #fff;
        display: block !important;
    }
    .wrap-list-options:hover::-webkit-scrollbar-thumb {
        background-color: #bdbdbd !important; 
        width: 3px !important;
    } 
    .rta.list-group-item:hover{
        background:#e5f4f3 !important;
    }
    .bootstrap-tagsinput .badge {
        background: #e5f4f3;
        color: #000;
        height: auto;
        padding: 0px;
        margin: 2px;
    }
    .bootstrap-tagsinput .badge .remove {
        cursor: pointer;
    }

    .bootstrap-tagsinput .badge .remove::after {
        content: "×";
        font-size: 13px;
        padding: 0px 8px 0 0;
        border-radius: 50%;
        color: #737373;
        font-weight:bold;
    }
    .daterangepicker {
        color:black !important;
    }
    .daterangepicker td.off{
        color:#999 !important;
    }
    .filterdisplay .theme-option, li.filter-button .theme-option,  .modal-filter-chartview .theme-option {
        border-top: none !important;
        border-bottom: 1px solid #bdbdbd;
        margin: 0 16px;
        padding: 15px 0 16px 0;
    }
    .theme-option input::placeholder{
        color: #bdbdbd;
    }
    .theme-option input:focus-visible, .theme-option input:focus {
        outline: 0;
        border: 1px solid #009688 !important;
    }
    .rta.changecolor.active{
        background-color:#fff;
        border: 2px solid #009688 ;
    }
    span.rta.changecolor{
        background-color: #f5f5f5;
        margin: 2px;
        color: black;
        padding: 5px 8px;
        display: inline-block;
        border-radius:20px !important;
        cursor:pointer;
        border: 2px solid #f5f5f5;
    }
    input:checked ~ .rta.list-group-item {
    background: #f5f5f5;
    }
    .modal-filter-chartview .wrap-datepicker-filter .flaticon-calendar{
        margin-bottom: 5px;
    }
</style>