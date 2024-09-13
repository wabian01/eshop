<style>
    .title{
        display: none;
        margin-top: 34px;
        position: fixed;
        z-index: 9999;
        list-style-type: none;
        margin-left: -50px;
        padding: 2px 10px 2px 10px ;
        float: right;
    }
    .taskicon:hover .title{
        color: #000000;
        font-size: 14px;
        font-weight: 600;
        background-color: #FFF;
        display: block;
        border-radius: 4px;
        border: 1px solid #bdbdbd;
        height: fit-content;
        width: 300px;
    }
    .close-icon {
        display: none;  
    }
    .taskicon:hover .close-icon {
        display: flex; 
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        width: 14px;
        height: 14px;
        background-color: #ffffff;
        cursor: pointer;
        position: absolute;
        margin-top: -4px;
        margin-left: -6px;
        box-shadow: rgb(0 0 0 / 1%) 0px 15px 25px, rgb(0 0 0 / 50%) 0px 5px 10px;
    }
    .activetask{
        border: 1px solid rgb(255, 152, 0);
    }
    .taskbaricon{
        width: 28px; 
        text-align:center;
        height: 28px; 
        border-radius: 50%; 
        list-style-type: none; 
        margin: 0 auto 10px auto; 
    }
    .taskbartitle{
        text-align:center; 
        float: left; 
        margin:0;
        padding-left: 10px;
        padding-top: 5px;
        color: #fff;
        font-size: 14px;
        font-weight: bolder;
    }
    .display-none {
        display: none;
    }
    .just-been-actived {
        border-radius: 50%;
        width: 9px;
        height: 9px;
        background-color: #ff0000;
        position: absolute;
        margin-top: 19px;
        margin-left: 20px;
    }
</style>