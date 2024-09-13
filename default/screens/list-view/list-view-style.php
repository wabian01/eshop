<style>
  .dropdown-col {
    position: relative;
    display: inline-block;
  }

  .dropdown-content-col {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 176px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    right: 0;
  }

  .dropdown-content-col span {
    color: black;
    padding: 12px 16px;
    text-decoration: none !important;
    display: block;
  }

  .dropdown-content-col span:hover {
    background-color: #f1f1f1;
    cursor: pointer;
  }

  .dropdown-col:hover .dropdown-content-col {
    display: block;
  }

  .dropdown-col:hover .dropbtn-col {
    background-color: #c2bebe;
    border-radius: 4px;
  }
  .icons-container {
    display: flex; 
    justify-content: end; 
    background: transparent; 
    padding-right: 8px;
  }
  .i-general {
    padding: 0 10px 0 10px;
    cursor: pointer;
    margin-right: 2px;
  }
  .i-general-col {
    padding: 0 10px 2px 10px !important;
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

  .scroll_horizontal:hover::-webkit-scrollbar{
    width: 0 !important;
    height: 10px;
    display: block;
  }
  .scroll_horizontal p{
    margin: 0 0 10px !important;
  }
  .scroll_horizontal{
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
  .gridViewBt div{
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
  .loading-animation-info {
    position: absolute;
    left:50%;
    transform: translate(-50%);
    padding-top: 10px
  }
  .none_bg {
    padding-right: 10px; 
    padding-left: 10px;
    height: 100%;
  }
  /* loading new template  */
  .load-newtemplate  {
    animation: rotate 1s infinite;  
    height: 50px;
    width: 50px;
    margin: auto;
  }

  .load-newtemplate:before,
  .load-newtemplate:after {   
    border-radius: 50%;
    content: '';
    display: block;
    height: 20px;  
    width: 20px;
  }
  .load-newtemplate:before {
    animation: ball1 1s infinite;  
    background-color: #cb2025;
    box-shadow: 30px 0 0 #f8b334;
    margin-bottom: 10px;
  }
  .load-newtemplate:after {
    animation: ball2 1s infinite; 
    background-color: #00a096;
    box-shadow: 30px 0 0 #97bf0d;
  }

  @keyframes rotate {
    0% { 
      -webkit-transform: rotate(0deg) scale(0.8); 
      -moz-transform: rotate(0deg) scale(0.8);
    }
    50% { 
      -webkit-transform: rotate(360deg) scale(1.2); 
      -moz-transform: rotate(360deg) scale(1.2);
    }
    100% { 
      -webkit-transform: rotate(720deg) scale(0.8); 
      -moz-transform: rotate(720deg) scale(0.8);
    }
  }

  @keyframes ball1 {
    0% {
      box-shadow: 30px 0 0 #f8b334;
    }
    50% {
      box-shadow: 0 0 0 #f8b334;
      margin-bottom: 0;
      -webkit-transform: translate(15px,15px);
      -moz-transform: translate(15px, 15px);
    }
    100% {
      box-shadow: 30px 0 0 #f8b334;
      margin-bottom: 10px;
    }
  }

  @keyframes ball2 {
    0% {
      box-shadow: 30px 0 0 #97bf0d;
    }
    50% {
      box-shadow: 0 0 0 #97bf0d;
      margin-top: -20px;
      -webkit-transform: translate(15px,15px);
      -moz-transform: translate(15px, 15px);
    }
    100% {
      box-shadow: 30px 0 0 #97bf0d;
      margin-top: 0;
    }
  }
</style>