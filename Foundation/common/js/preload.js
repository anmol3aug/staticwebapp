
eLearningApp.controller('preloading', function ($attrs, $scope, $timeout, $http, PreloadService) {
	var jsonData;
	var playAudioOnce = true;
	disableNavBT(true);
	
	$http.get($attrs.json)
	.then(function (res) {
		jsonData = res.data;
		var triggerOnce = true;
		console.log('load')
		
		$scope.$on('queProgress', function (event, queProgress) {
			// $scope.$apply(function() {});
			$timeout(function () {
				if(playAudioOnce){ 
					playAudioOnce = false;
					//playAudio("audio/pleasewait");
				} 
				__preloadComplete = false; 
				$scope.progress = queProgress.progress * 100;
			}, 0);
		});

		$scope.$on('queComplete', function (event, jsonData) {
			//$scope.$apply(function() {});
			if (triggerOnce) {
				$timeout(function () { 
					playAudioOnce = true;
					document.getElementById("audio-msc").pause();
					audioControl();
					disableNavBT(false);
					slideAnimation();
					$scope.loaded = true;
				}, 0, triggerOnce);
			}
			triggerOnce = false;
		});

		$scope.progress = 0;
		$scope.loaded = false;
		
		loadSlides();
	});

	function loadSlides() {
		PreloadService.loadManifest(jsonData); 
	}
	function slideAnimation() {
		$(".preloadingTemp-holder").fadeOut(0);
		$(".sld-holder").css("opacity", 0);
		$(".sld-holder").stop(true).animate({
			"opacity": 1
		}, 1000, function () {
			__preloadComplete = true;
			$(".sld-holder").stop(true, true);   
			//new fix pause audio in mobile for first time play audio.
			//if (__isMobile.any()) {
				if (!isPlaying(__audio)) {
					if (__gpauseTriggerOnce) {
						__gpauseTriggerOnce = false;
						$(".pause-icn").attr("class", "play-icn");
						$(".play-icn").css('opacity', 1); 
					}
				} 
			//};
			//new fix
		});
	}
	function audioControl() {
		pausePlayControl();
		__audio.removeEventListener("ended", audioEnded);
		__audio.addEventListener("ended", audioEnded);
		__audio.removeEventListener("timeupdate", getCurTime);
		__audio.addEventListener("timeupdate", getCurTime);

		__audio.removeEventListener("waiting", waitingMedia);
		__audio.addEventListener("waiting", waitingMedia);

		__audio.removeEventListener("playing", playingMedia);
		__audio.addEventListener("playing", playingMedia);

		/* __audio.onwaiting = function(){
		$(".waiting-holder").show();
		};
		__audio.onplaying = function(){
		$(".waiting-holder").hide();
		}; */
	}

	function waitingMedia() {
		$(".waiting-holder").show();
		//createjs.Ticker.removeEventListener("tick", stage);
		animationControl(false);
	}

	function playingMedia() {
		$(".waiting-holder").hide();
		//createjs.Ticker.addEventListener("tick", stage);
		animationControl(true);
	}

	function animationControl(playBol) {
		var type = $scope.templates[$scope.count].type; 
		if (type == "animation") {
			createjs.Ticker.removeEventListener("tick", stage);
			if (playBol) {
				createjs.Ticker.removeEventListener("tick", stage);
				createjs.Ticker.addEventListener("tick", stage);
			}  
		}
	}

	function pausePlayControl() {
		//$(".next-btn").css("background-image", "url(common/img/next-icon.png)");
		$(".pause-disable").hide();
		$(".play-icn").attr("class", "pause-icn");
		$(".pause-icn").css('opacity', 1);
		//
		$(".sound-off-icn").attr("class", "sound-on-icn");
		__audio.muted = false;
		//
		$(".progress-status").css("width", 0);
		//
	}
	function audioEnded() { 
		if ($scope.count >= $scope.templates.length - 1) {
			//$(".next-btn").css("background-image", "url(common/img/next-icon.png)");
			//console.log("completed")
			$(".slide-info").html("Click on browser close to exit the course");
		} else {
			$(".slide-info").html("Click Next to Continue");
			$(".next-blink").show();
			//$(".next-btn").css("background-image", "url(common/img/next-icon-blink.gif)");
			//playAudio("audio/Nextbtn");
		}
		//next button
		var click = $("#menu-list" + $scope.count).attr("clicked", "true");

		if (__gbookmark != "completed") {
			$(".next-btn-disable").hide();
		}
		//
		$("#menu-list" + $scope.count).attr("clicked", "true");
		$(".pause-icn").attr("class", "play-icn");
		$(".play-icn").css('opacity', 0.75);
		$(".pause-disable").show(); 
	};
	
	function playAudio(sndName){			
		//new audio	
		var audioAct = document.getElementById("audio-msc"); 
		var path = sndName + '.mp3';   
		audioAct.src = path; 
		var playPromise = audioAct.play(); 
		if (playPromise !== undefined) {
		  playPromise.then(function() { 
			audioAct.play(); 
		  }).catch(function(error) {
			 
		  });
		}   
	}; 

	function getCurTime() {
		var percentage = (__audio.currentTime / __audio.duration);
		var progress = ($(".progress-bar").width() * percentage);
		$(".progress-bar .progress-status").css("width", progress);
		if (isPlaying(__audio)) {
			$(".sld-play-audio").hide();
			$(".play-icn").attr("class", "pause-icn");
			document.getElementById("audio-msc").pause();
		} else {
			if (__gpauseTriggerOnce) {
				__gpauseTriggerOnce = false;
				$(".pause-icn").attr("class", "play-icn");
			}
		}
	}
	function isPlaying(audio) {
		return !audio.paused;
	}
});

eLearningApp.factory('PreloadService', function ($rootScope) {
	var queue = {};
	//$rootScope = null;
	var queue = new createjs.LoadQueue(false);

	function loadManifest(manifest) {
		queue.off('complete', manifest);
		queue.off('progress', manifest);
		queue.loadManifest(manifest);
		queue.on('progress', function (event) {
			$rootScope.$broadcast('queProgress', event);
		});

		queue.on('complete', function () {
			$rootScope.$broadcast('queComplete', manifest);
		});
	};
	return {
		loadManifest: loadManifest
	}
})

function disableNavBT(BOL) {
	if (__gslideCount == 0) {}
	else if (__gslideCount == __gtotalSlides - 1) {}
	else {
		angular.element($(".prev-btn")).attr('disabled', BOL);
		angular.element($(".next-btn")).attr('disabled', BOL);
	}
}
