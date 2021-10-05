function FullScreen(){this.init=function(){__toggleFullScreen()}
var __cancelFullScreen=function(el){var requestMethod=el.cancelFullScreen||el.webkitCancelFullScreen||el.mozCancelFullScreen||el.exitFullscreen||el.msExitFullscreen;if(requestMethod){requestMethod.call(el)}
else if(typeof window.ActiveXObject!=="undefined"){var wscript=new ActiveXObject("WScript.Shell");if(wscript!==null){wscript.SendKeys("{F11}")}}}
var __requestFullScreen=function(el){var requestMethod=el.requestFullScreen||el.webkitRequestFullScreen||el.mozRequestFullScreen||el.msRequestFullscreen;if(requestMethod){requestMethod.call(el)}
else if(typeof window.ActiveXObject!=="undefined"){var wscript=new ActiveXObject("WScript.Shell");if(wscript!==null){wscript.SendKeys("{F11}")}}
return!1}
var __toggleFullScreen=function(){var elem=document.body;var isInFullScreen=(document.fullScreenElement&&document.fullScreenElement!==null)||(document.mozFullScreen||document.webkitIsFullScreen||document.msFullscreenElement);if(isInFullScreen){__cancelFullScreen(document)}
else{__requestFullScreen(elem)}
return!1}}