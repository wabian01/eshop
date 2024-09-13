<style>
  .loading-animation {
    color: official;
    display: inline-block;
    position: absolute;
    width: 100%;
    height: 5px;
    left: 50%;
    top: 0;
    background:#ffe7c4;
    transform: translate(-50%, -50%);
  }
  .loading-animation div {
    display: inline-block;
    position: absolute;
    width: 50%;
    height: 5px;
    background: #ff9800;
    animation: loading-animation 1.2s ease infinite;
  }
  @keyframes loading-animation {
    from {left: 0px;}
    to {left: 100%;}
    0% {
      width: 20%;
    }
    50%{
      width: 50%;
    }
    100%{
      width: 20%;
    }
  }
</style>