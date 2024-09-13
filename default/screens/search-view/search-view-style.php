<style>
    .icons-searchView-container {
        display: flex; 
        justify-content: end; 
        background: transparent; 
        padding: 6px 0px 6px 0px;
    }
    .i-general {
        padding: 0 10px 0 10px;
        cursor: pointer;
        margin-right: 2px;
    }
    .i-general-col {
        padding: 0 10px 0 10px;
        cursor: pointer;
        margin-right: 2px;
    }
    .i-general:hover {
        background: #c2bebe;
        border-radius: 4px;
    }
    .i-general-col:hover {
        background: #c2bebe;
        border-radius: 4px;
    }
    .dp-n {
        display: none;
    }
    .i-active {
        background: #c2bebe;
        border-radius: 4px;
    }
    .searchView:before {
        content: "×";
    }
    span.selectValue{
        background-color: #8080804d;
        margin-right: 10px;
        color: black;
        padding: 5px 5px;
        margin-top: 7px;
        display: inline-block;
        border-radius:20px !important;
        white-space: break-spaces;
    }
    span.selectValue.active{
        background-color:orange;
    }
    [placeholder]{
        text-overflow:ellipsis;
    }
    .searchviewpublic input::placeholder {
        color: gray !important;
    }
    .currentSearchItem:hover{
        background: #e5f4f3;
        color: #000 !important;
    }
    .currentSearchItemWrap::-webkit-scrollbar {
        width: 5px !important;
        background-color: transparent;
        display: block !important;
    }
    .currentSearchItemWrap::-webkit-scrollbar-thumb {
        background-color: #bdbdbd !important; 
        width: 5px !important;
    }
    .advancedSeach{
        outline: 0;
        border: 1px solid #009688 !important;
    }
    .listadvancedSeach{
        padding:5px;
    }
    .listadvancedSeach:hover{
        background: #e5f4f3 !important;
    }
    .listinput:hover::-webkit-scrollbar {
        width: 3px !important;
        background-color: #fff;
        display: block !important;
    }
    .listinput:hover::-webkit-scrollbar-thumb {
        background-color: #bdbdbd !important; 
        width: 3px !important;
    } 
    .listinput{
        width: 100%;
        border-radius: 5px !important;
        box-shadow: rgb(0 0 0 / 24%) 0px 3px 8px !important;
        overflow: auto;
        margin-top: 0px !important;
        position:relative !important;
        max-height: 150px !important;
    }
    .advancedSeach{
        width: 100%;
        height: 35px;
        color: black;
        border: 1px solid rgb(189, 189, 189);
        padding: 5px;
        border-radius: 4px !important;
        margin-top: 5px !important;
    }
    .statuslistopen{
        display:block !important;
    }
    .statuslistclose{
        display:none !important;
    }
    .scroll-quicksearch:hover::-webkit-scrollbar {
        width: 0px; 
        height: 5px;
        background-color: transparent;
        display: block;
    }
    .scroll-quicksearch:hover::-webkit-scrollbar-thumb {
        background-color: #009688 !important; 
    }
    .quicksearch.changecolor.active{
        background-color:#fff;
        border: 2px solid #009688 ;
    }
    span.quicksearch.changecolor{
        background-color: #f5f5f5;
        margin: 2px;
        color: black;
        padding: 5px 8px;
        display: inline-block;
        border-radius:20px !important;
        cursor:pointer;
        border: 2px solid #c9c9c9;
    }
    .searchviewpublic input:focus {
        border: none !important;
        box-shadow: none !important;
    } 
    .searchviewpublic button {
        padding-block: 1px;
        padding-inline: 6px;
    }
</style>