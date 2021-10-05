var __isMobile
var __triggerOnce = true; 
var __audio
var __gjsonfilePath;
var __gslideCountArr = [];
var __gslideCount;
var __gtotalSlides;
var __ggetCurTime;
var __gaudioEnded;
var __gpauseTriggerOnce = true;
var __gfirstSlidePlayButton = true;
var __gfirstSlide = true;
var __unLocked = "true";
var __assmtComplete = false;
//new code1
var stage;
var __preloadComplete;

//Play audio button for the mobile first slide, to continue play audio without pause and for video slide.
function __playAudioButton() { 
	$(".sld-play-audio").show(); 
	$(".pause-icn").attr("class","play-icn");  
	$(".sld-play-audio").on("click", function() {
		__audio.play();
		$(".sld-play-audio").hide();
		$(".play-icn").attr("class","pause-icn")
	}) 
}

<!-- scorm 1.2 -->
// For scorm version value should true;
var __gscormVersion = false;
// For locked version value should be "";
// For unlocked version (checking purpose) value should be "completed"
var __gbookmark = "";
<!-- scorm -->
angular.element(document).ready(function() {
	<!-- right click disable -->
	document.addEventListener("contextmenu", function(e){
		//e.preventDefault();
	}, false);

	__audio = document.getElementById("audio");

	__isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (__isMobile.Android() || __isMobile.BlackBerry() || __isMobile.iOS() || __isMobile.Opera() || __isMobile.Windows());
		}
	};  
	var __resize = new ResizeContent($("#wrapper"), $(".container"), 1280, 720);
	__resize.init();
	//var __fullscreen = new FullScreen();
	//
	//$("#wrapper").on("dblclick", function() { 
		if (__isMobile.any()) {
			//$(".toolbar-holder").toggle();
			//$(".template-holder").css("top", "105px");
			//$(".template-holder").css("transform", "scale(1.1)");
			$(".zoom").hide();
			$(".top-nav-holder").css("left","1050px");
		}else{
			$(".fullscreen-on-icn").hide(); 
			$(".top-nav-holder").css("left","1050px");
		}
	//}) 

});
document.addEventListener("DOMContentLoaded", function(event) { 
})

// Listen for orientation changes
var cancelFullScreen = function(el) {
	var requestMethod = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullscreen || el.msExitFullscreen;
	if (requestMethod) { // cancel full screen.
		requestMethod.call(el);
	}
	else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
		var wscript = new ActiveXObject("WScript.Shell");
		if (wscript !== null) {
			wscript.SendKeys("{F11}");
		}
	}
}
window.addEventListener("orientationchange", function() { 
   cancelFullScreen(document);
	
}, false);