//Author	: Raghu Golconda
//version	: V1.0
//Date		: august 14 2017
//Company: KPMG, copyrights

var eLearningApp = angular.module('eLearningTemplate', ['ngAnimate']);
//temp variables for vodafone activity;
var __scope;
var __retryBOL = true;
//glossary

eLearningApp.controller('ctrlGlossary', function ($scope, $http) {
	$http.get('json/glossary.json')
	.then(function (res) {
		$scope.glossary = res.data;
		$scope.glossaryFunc = function (index) {
			//$(".wordMeaning").html(index);
			angular.element($(".glossary-meaning")).html(index.meaning);
			//comment 130619
			//playAudio("audio/glossary/gloAudio"+(index.id)); 
		}; 
	});
	function playAudio(sndName){			
		//new audio	
		var audioAct = document.getElementById("audio-msc");
		audioAct.loop = false;
		var path = sndName + '.mp3';  
		audioAct.src = path;
		var playPromise = audioAct.play(); 
		if (playPromise !== undefined) {
		  playPromise.then(function() { 
			audioAct.play(); 
		  }).catch(function(error) {
			 
		  });
		};
	} 
});

eLearningApp.controller('ctrlNavigation', function ($scope, $document, $http, $element) {
	var count = 0;
	var exitBOL = false;
	var listItem;
	var onChangeListBOL = false;
	var __fullscreen = new FullScreen();
	//keys
	var rightArrowKey = 39;
	var leftArrowKey = 37;
	var mKey = 77;
	var gKey = 71;
	var tKey = 84;
	var fKey = 70;
	var pKey = 80;
	var rKey = 82;
	var sKey = 83;
	var hKey = 72;
	var homeKey = 36;
	var xKey = 88;
	var nKey = 78;
	var yKey = 89;
	var iKey = 73;
	var plusKey = 187;
	var minusKey = 189;
	var date = new Date();
	var scaleBOL = true;
	__scope = $scope
	var __resize = new ResizeContent($("#wrapper"), $(".container"), 1280, 720);
	$(".date").html("Date:  "+formatDate(new Date()));
	$scope.count = count;
	//scorm 1.2
	if (__gscormVersion) {
		loadPage();
		__gbookmark = getBookmarkNo().split(":")[0];
		if (__gbookmark != "completed") {
			count = Number(__gbookmark);
			$scope.count = count;
			if(count == 0){
				$(".skip-btn").show();
			}else{
				$(".skip-btn").hide();
			}
		}
	}
	
	function formatDate(date) {
	  var monthNames = [
		"January", "February", "March",
		"April", "May", "June", "July",
		"August", "September", "October",
		"November", "December"
	  ]; 
	  var day = date.getDate();
	  var monthIndex = date.getMonth();
	  var year = date.getFullYear(); 
	  return day + ' ' + monthNames[monthIndex] + ' ' + year;
	}

	//
	$http.get('json/slide.json')
	.then(function (res) {
		$scope.templates = res.data;
		__gtotalSlides = $scope.templates.length;
		angular.element($(".transcript")).html($scope.templates[count].transcript);
		angular.element($(".sld-slideheading-txt")).html($scope.templates[count].subheading); 
		slideStatus();
		menuStatus();
		disableNavBT(count, $scope);
		$scope.menuClick = function (url, transcript, id, name, subheading) {
			//scorm 1.2 
			if ($scope.templateURL != url) {
				var click = angular.element($("#menu-list" + id)).attr("clicked");
					if(click == "true" || __gbookmark=="completed" || __unLocked == "true"){
					$scope.templateURL = url;
					count = Number(id);
					$scope.count = count;
					$("#menu-list" + id).css("color", "#EE2737");
					angular.element($(".transcript")).html(transcript);
					angular.element($(".sld-slideheading-txt")).html(subheading);
					disableNavBT(count, $scope);
					$(".skip-btn").hide();
				}
			} 
		}
		
		$scope.changeListItem = function (item) {
			var click = angular.element($("#menu-list" + item.id)).attr("clicked");
			//playAudio("audio/menu/menuAudio"+(item.id+1));
			if (click == "true" || __gbookmark == "completed" || __unLocked == "true") { 
				if (__isMobile.any()) {   
					$scope.templateURL = item.url;
					count = Number(item.id);
					$scope.count = count;
					$("#menu-list" + item.id).css("color", "#EE2737");
					angular.element($(".transcript")).html(item.transcript);
					angular.element($(".sld-slideheading-txt")).html(item.subheading);
					disableNavBT(count, $scope);
				}else{ 
					listItem = item;
					onChangeListBOL = true; 
					$document.on('keyup', menuChangeLoadPage);
				} 
				
			}
		}

		$scope.templateURL = $scope.templates[count].url;

		$(".prev-btn").css({
			opacity: 0.5
		})
		$scope.skipClick = function () {
			onChangeListBOL = false;
			var click = angular.element($("#menu-list" + count)).attr("clicked");  
			$(".next-btn-disable").hide();
			angular.element($("#menu-list" + (count - 1))).attr("clicked", "true");
			$("#menu-list" + count).css("color", "#EE2737");
			count++; 
			$scope.templateURL = $scope.templates[count].url;
			$scope.count = count;
			angular.element($(".transcript")).html($scope.templates[count].transcript);
			angular.element($(".sld-slideheading-txt")).html($scope.templates[count].subheading);

			$(".prev-btn").css({
				opacity: 1
			})

			angular.element($(".prev-btn")).attr('disabled', false);
			disableNavBT(count, $scope);  
			$(".skip-btn").hide();
		}
		$scope.nextClick = function () {
			onChangeListBOL = false;
			var click = angular.element($("#menu-list" + count)).attr("clicked");
			console.log(click + "---clicked");
			if(click == "true" || __gbookmark=="completed" || __unLocked == "true"){ 
				$(".next-btn-disable").hide();
				angular.element($("#menu-list" + (count - 1))).attr("clicked", "true");
				$("#menu-list" + count).css("color", "#EE2737");
				count++; 
				$scope.templateURL = $scope.templates[count].url;
				$scope.count = count;
				angular.element($(".transcript")).html($scope.templates[count].transcript);
				angular.element($(".sld-slideheading-txt")).html($scope.templates[count].subheading);
				$(".prev-btn").css({
					opacity: 1
				})

				angular.element($(".prev-btn")).attr('disabled', false);
				disableNavBT(count, $scope);
				$(".skip-btn").hide();
			}
			
		}
		$scope.prevClick = function () {
			onChangeListBOL = false;
			$scope.templateURL = $scope.templates[count - 1].url;
			angular.element($(".transcript")).html($scope.templates[count - 1].transcript);
			angular.element($(".sld-slideheading-txt")).html($scope.templates[count - 1].subheading);
			count--;
			$scope.count = count;
			$(".next-btn").css({
				opacity: 1
			})
			angular.element($(".next-btn")).attr('disabled', false);
			disableNavBT(count, $scope);
		}
		$document.on('keyup', nextKey);
		$document.on('keyup', prevKey);
		$document.on('keyup', menuKey);
		$document.on('keyup', glossaryKey);
		$document.on('keyup', transcriptKey);
		$document.on('keyup', fullscreenKey);
		$document.on('keyup', pauseKey);
		$document.on('keyup', replayKey);
		$document.on('keyup', soundKey);
		$document.on('keyup', helpKey);
		$document.on('keyup', exitKey);
		$document.on('keyup', exitNoKey);
		$document.on('keyup', exitYesKey);
		$document.on('keyup', firstSlideKey);
		$document.on('keyup', invertKey);
		$document.on('keyup', zoomInKey);
		$document.on('keyup', zoomOutKey);
		
	});

	//pause/play
	$scope.pauseIconClick = function (evt) {
		if ($(".pause-icn").hasClass('pause-icn')) {
			$(".pause-icn").attr("class", "play-icn");
			if (__audio != undefined) {
				__audio.pause();
				//new code1 
				animationControl(false);
			}
		} else {
			$(".play-icn").attr("class", "pause-icn");
			if (__audio != undefined) {
				var playPromise = __audio.play();
				if (playPromise !== undefined) {
					playPromise.then(function () {
						__audio.play();
					}).catch(function (error) {});
				}
				//new code1 
				animationControl(true);
			}
		}
	}
	//replay
	$scope.replayIconClick = function (evt) {
		$(".help-holder").hide();
		__audio.removeEventListener("timeupdate", __ggetCurTime); 
		animationControl(false);
		//new code1
		__audio.load();
		var tempUrl = "";
		var tempUrl = Math.random(1).toFixed(2);
		$scope.templateURL = $scope.templateURL + "?" + tempUrl;
	}
	//sound mute
	$scope.soundIconClick = function (evt) {
		var actAudio = document.getElementById("audio-act"); 
		if ($(".sound-on-icn").hasClass('sound-on-icn')) {
			$(".sound-on-icn").attr("class", "sound-off-icn");
			if (__audio != null) {
				__audio.muted = true;
			}
			if(actAudio != null){
				actAudio.muted = true;
			}
		} else {
			$(".sound-off-icn").attr("class", "sound-on-icn");
			if (__audio != null) {
				__audio.muted = false;
			}
			if(actAudio != null){
				actAudio.muted = false;
			}
		}
	}
	//help
	$scope.helpIconClick = function (evt) {
		$(".help-holder").toggle();
	}

	//help close
	$scope.helpCloseClick = function (evt) {
		$(".help-holder").toggle();
	}
	
	//zoom
	$scope.zoomIconClick = function (evt) {
		if (!__isMobile.any()) { 
			if(scaleBOL){
				scaleBOL = false; 
				$(".container").attr("style",""); 
				$(".container").css( {"transform-origin": "top left"});
				$(".container").css( {"transform": "scale(1)"});
				$(".container").css( {"position": "relative"});
				$(".container").css( {"left": ""});
				$(".container").css( {"top": ""});
				$(".container").css( {"margin-left": "auto"});
				$(".container").css( {"margin-right": "auto"});
			}else{
				scaleBOL = true;
				$(".container").css( {"transform-origin": ""});
				$(".container").css( {"position": "absolute"});
				$(".container").css( {"margin-left": ""});
				$(".container").css( {"margin-right": ""}); 
				__resize.init();
			}
		}
	}

	//home
	$scope.homeIconClick = function (evt) {
		if (count != 0) {
			count = 0;
			disableNavBT(count, $scope);
			$scope.templateURL = $scope.templates[count].url;
		}
	}

	//exit
	$scope.exitIconClick = function (evt) {
		exitBOL = true;
		$(".exit-win").css("display", "flex");
		$(".exit-win-inst").text("Do you really want to exit the course?");
		$(".exit-win").show();
	}
	//exit-win-yes
	$scope.exitWinYes = function (evt) {
		window.close();
	}
	//exit-win-no
	$scope.exitWinNo = function (evt) {
		exitBOL = false;
		$(".exit-win").hide();
	}

	//menu
	var menuBol = true;
	$scope.menuIconClick = function (evt) {
		$(".help-holder").hide();
		$document.off('keyup', menuChangeLoadPage);
		$(".menu").show(); 
		$("#menu-select").focus(); 
		menuAudioControl();
		if(menuBol){
			menuBol = false;
			$(".menu").css( "left", "-344px");
			$(".menu").animate({ "left": "46px" }, "slow" ,function() {
				$(".menu").show(); 
			});
		}else{
			menuBol = true;
			$(".menu").css( "left", "46px");
			$(".menu").animate({ "left": "-344px" }, "slow" ,function() {
				$(".menu").hide();
				menuAudioControl();
			});
		};
	}
	
	//menu close
	$scope.menuCloseClick = function (evt) {
		$document.off('keyup', menuChangeLoadPage);
		menuBol = true;
		$(".menu").css( "left", "-344px");
		$(".menu").hide();
		menuAudioControl()
	}

	//transcript
	var transBol = true;
	$scope.transcriptIconClick = function (evt) {
		$(".help-holder").hide();
		$(".transcript-holder").show(); 
		$(".transcript").focus();  
		var f=document.getElementById("transcript");
			if (f) { f.tabIndex = -1; f.focus(); } 
		$document.off('keyup', menuChangeLoadPage);
		$(".menu").hide();
		$(".glossary-container").hide();
		menuAudioControl();
		if(transBol){
			transBol = false;
			$(".transcript-holder").css( "left", "-344px");
			$(".transcript-holder").animate({ "left": "46px" }, "slow" ,function() {
				$(".transcript-holder").show();
			});
		}else{
			transBol = true;
			$(".transcript-holder").css( "left", "46px");	
			$(".transcript-holder").animate({ "left": "-344px" }, "slow" ,function() {
				$(".transcript-holder").hide();
			});
		};
	}
	//transcript close
	$scope.transcriptCloseClick = function (evt) {
		transBol = true;
		$(".transcript-holder").css( "left", "-344px");
		$(".transcript").blur();  
	}

	//glossary
	var gloBol = true;
	$scope.glossaryIconClick = function (evt) {
		$(".help-holder").hide();
		$(".glossary-container").show() 
		$("#glossary-select").blur();
		$("#glossary-select").focus(); 
		glossaryAudioControl();
		if(gloBol){
			gloBol = false;
			$(".glossary-container").css( "left", "-344px");
			$(".glossary-container").animate({ "left": "46px" }, "slow" ,function() {
				$(".glossary-container").show();
			});
		}else{
			gloBol = true;
			$(".glossary-container").css( "left", "46px");
			$(".glossary-container").animate({ "left": "-344px" }, "slow" ,function() {
				$(".glossary-container").hide();
				glossaryAudioControl();
			});
		};
	}
	
	function clearSelected(){
		var elements = document.getElementById("glossary-select").options; 
		for(var i = 0; i < elements.length; i++){ 
			if(i==0){
				elements[i].selected = true;
			}else{
				elements[i].selected = false;
			} 
		}
	}
	//glossary close
	$scope.glossaryCloseClick = function (evt) {
		gloBol = true;
		$(".glossary-container").css( "left", "-344px");
		$(".glossary-container").hide();
		$("#glossary-select").blur();
		glossaryAudioControl()
	}

	//fullscreen
	$scope.fullscreenIconClick = function (evt) {
		__fullscreen.init();
		if ($(".fullscreen-on-icn").hasClass('fullscreen-on-icn')) {
			//$(".fullscreen-on-icn").attr("class", "fullscreen-off-icn");
		} else {
			//$(".fullscreen-off-icn").attr("class", "fullscreen-on-icn");
		}
	}

	$scope.invertIconClick = function (evt) {
		$(".help-holder").hide();
		if ($(".invert-on-icn").hasClass('invert-on-icn')) {
			$(".invert-on-icn").attr("class", "invert-off-icn");
			$(".template-holder").css("filter", "invert(100)");
		} else {
			$(".invert-off-icn").attr("class", "invert-on-icn");
			$(".template-holder").css("filter", "invert(0)");
		}
	}

	$scope.zoomIn = function (evt) {
		$(".toolbar-holder").hide();
		$(".template-holder").css("top", "80px");
		$(".template-holder").css("transform", "scale(1.12)");
	}

	$scope.zoomOut = function (evt) {
		$(".toolbar-holder").show();
		$(".template-holder").css("top", "84px");
		$(".template-holder").css("transform", "scale(1)");
	}
	var toolBol = true;
	$scope.toolbarToggle = function (evt) { 
		//$(".toolbar-holder").toggle();
		if(toolBol){
			toolBol = false;
			$(".toolbar-holder-button").css( "transform", "rotateZ(0deg)");
			$(".toolbar-holder").css( "top", "-112px");
			$(".toolbar-holder").animate({ "top": "528px" }, "slow" );
		}else{
			toolBol = true;
			$(".toolbar-holder").css( "top", "528px");
			$(".toolbar-holder-button").css( "transform", "rotateZ(180deg)");
			$(".toolbar-holder").animate({ "top": "-112px" }, "slow" );
		}
		
		transBol = true;
		menuBol = true;
		gloBol = true;
		$(".menu").css( "left", "-344px");
		$(".menu").hide();
		menuAudioControl();

		$(".glossary-container").css( "left", "-344px");
		$(".glossary-container").hide();
		glossaryAudioControl(); 

		$(".transcript-holder").css( "left", "-344px");
		$(".transcript-holder").hide();
	}
	
	function animationControl(playBol) {
		var type = $scope.templates[count].type;
		console.log(type+"----type")
		if (type == "animation") {
			createjs.Ticker.removeEventListener("tick", stage); 
			if (playBol) {
				createjs.Ticker.removeEventListener("tick", stage);
				createjs.Ticker.addEventListener("tick", stage);
			}  
		} 
	}
	
	//new
	function menuAudioControl(){
		var type = $scope.templates[count].type;
		var isMenuVisible = $(".menu").is(":visible");
		var isPauseDisableVisible = $(".pause-disable").is(":visible");
		var opacity = $(".play-icn").css('opacity');  
		if(isMenuVisible){
			//playAudio("audio/menuInfo");
			$(".transcript-holder").css( "left", "-344px");
			$(".glossary-container").css( "left", "-344px");
			transBol = true;
			gloBol = true;
			if(!isPauseDisableVisible){
				$(".pause-icn").attr("class", "play-icn");
				$(".play-icn").css('opacity', 1);
				if (type == "animation") {
					createjs.Ticker.removeEventListener("tick", stage);
				}
				__audio.pause();
			}
		}else{
			document.getElementById("audio-msc").pause();
			if(!isPauseDisableVisible){
				__audio.play(); 
			};
		}
	}
	
	function glossaryAudioControl(){
		var type = $scope.templates[count].type;
		var isGlossaryVisible = $(".glossary-container").is(":visible");
		var isPauseDisableVisible = $(".pause-disable").is(":visible");
		var opacity = $(".play-icn").css('opacity');  
		if(isGlossaryVisible){
			//playAudio("audio/glossaryInfo");
			$(".transcript-holder").css( "left", "-344px");
			$(".menu").css( "left", "-344px");
			transBol = true;
			menuBol = true;
			if(!isPauseDisableVisible){
				$(".pause-icn").attr("class", "play-icn");
				$(".play-icn").css('opacity', 1);
				if (type == "animation") {
					createjs.Ticker.removeEventListener("tick", stage);
				}
				__audio.pause();
			}
		}else{
			document.getElementById("audio-msc").pause();
			if(!isPauseDisableVisible){
				__audio.play(); 
			};
		}
	}

	function menuChangeLoadPage(e) {
		var keyCode = e.keyCode;
		if (keyCode === 13) { 
			$scope.menuClick(listItem.url, listItem.transcript, listItem.id, listItem.name, listItem.subheading);
			$("#menu-list" + listItem.id).css("color", "#EE2737");
			$scope.$apply();
			$document.off('keyup', menuChangeLoadPage);
		}
	}

	function checkSlideComplete() {
		menuStatus();
		if (__gslideCountArr.length >= $scope.templates.length) {}
	}

	function slideStatus() {
		$scope.slideStatus = ((count + 1) + " / " + $scope.templates.length);
		if (__gbookmark != "completed") {
			//$(".next-btn-disable").show();
		}
		__gslideCount = count;
	}

	function menuStatus() {
		var menuList = "menu-list" + count;
		$(".menu-word").removeClass("menu-list-focus");
		$("#" + menuList).addClass("menu-list-check");
		$("#" + menuList).addClass("menu-list-focus");
		__gslideCountArr.push(menuList);
		removeDuplicateValues(__gslideCountArr); 
	}

	function disableNavBT(count, $scope) {
		$(".help-holder").hide();
		$(".slide-info").html("");
		$(".invert-off-icn").attr("class", "invert-on-icn");
		__audio.removeEventListener("timeupdate", __ggetCurTime); 
		$("body").off('keyup', __tabKeyRadioSelection);
		$("body").off('keyup', __enterKeySubmit);
		$("body").off('keyup', __spacebarKeyQuestion); 
		$("body").off('keyup', __enterKeyNext);  
		$("body").off('keyup', __printKey);  
		$("body").off('keyup', __enterKeyRetry);  
		animationControl(false);
		__audio.load();
		$(".waiting-holder").hide();
		if (count == 0) {
			$(".prev-btn").css({
				opacity: 0.5,
				cursor: "default"
			})

			angular.element($(".prev-btn")).attr('disabled', true);
		} else {
			$(".prev-btn").css({
				opacity: 1,
				cursor: "pointer"
			})
			angular.element($(".prev-btn")).attr('disabled', false);
		}
		//
		if (count >= $scope.templates.length - 1) {

			$(".next-btn").css({
				opacity: 0.5,
				cursor: "default"
			})
			angular.element($(".next-btn")).attr('disabled', true);
		} else {
			$(".next-btn").css({
				opacity: 1,
				cursor: "pointer"
			})
			angular.element($(".next-btn")).attr('disabled', false);
		}
		slideStatus();
		//scorm 1.2
		if (__gscormVersion) {
			setBookmark(count);
		}
		//
		checkSlideComplete();
	}

	function removeDuplicateValues(uniqueArr) {
		for (var i = 0; i < uniqueArr.length; i++) {
			for (var j = 0; j < uniqueArr.length - i; j++) {
				if (uniqueArr[i] == uniqueArr[i + j + 1]) {
					uniqueArr.splice(i + j + 1, 1);
					j--;
				}
			}
		}
	}
	
	function nextKey(e){
		var keyCode = e.keyCode;
		if (keyCode === rightArrowKey) {
			if ($(".next-btn-disable").is(":hidden")) {
				if (count >= $scope.templates.length - 1) {}
				else {
					$scope.nextClick();
					$scope.$apply();
				}
			}
		};
	};
	function prevKey(e){
		var keyCode = e.keyCode;
		if (keyCode === leftArrowKey) {
			if (count == 0) {}
			else {
				$scope.prevClick();
				$scope.$apply();
			}
		}
	};
	function menuKey(e){
		var keyCode = e.keyCode;
		if (keyCode === mKey) {
			$scope.menuIconClick();
			$scope.$apply();
		}
	};
	
	function glossaryKey(e){
		var keyCode = e.keyCode;
		if (keyCode === gKey) {
			$scope.glossaryIconClick();
			$scope.$apply();
		}
	}
	function transcriptKey(e){
		var keyCode = e.keyCode;
		if (keyCode === tKey) {
			$scope.transcriptIconClick();
			$scope.$apply();
		}
	};
	
	function fullscreenKey(e){
		var keyCode = e.keyCode;
		if (keyCode === fKey) {
			$scope.fullscreenIconClick();
			$scope.$apply();
		}
	};
	function pauseKey(e){
		var keyCode = e.keyCode;
		if (keyCode === pKey && !e.shiftKey) {
			if ($(".pause-disable").is(":hidden")) {
				$scope.pauseIconClick();
				$scope.$apply();
			}else{
				var actAudio = document.getElementById("audio-act");
				if(actAudio != null){
					if(isPlaying(actAudio)){
						actAudio.pause();
					}else{
						actAudio.play();
					} 
				} 
			}
		};
	};
	
	function replayKey(e){
		var keyCode = e.keyCode;
		if (keyCode === rKey) {
			$scope.replayIconClick();
			$scope.$apply();
		}
	};
	function soundKey(e){
		var keyCode = e.keyCode;
		if (keyCode === sKey) {
			$scope.soundIconClick();
			$scope.$apply();
		}
	}
	function helpKey(e){
		var keyCode = e.keyCode;
		if (keyCode === hKey) {
			$scope.helpIconClick();
			$scope.$apply();
		}
	};
	function exitKey(e){
		var keyCode = e.keyCode;
		if (keyCode === xKey) {
			//$scope.exitIconClick();
			//$scope.$apply();
		}
	};
	function exitNoKey(e){
		var keyCode = e.keyCode;
		if (keyCode === nKey) {
			$scope.exitWinNo();
			$scope.$apply();
		}
	};
	
	function exitYesKey(e){
		var keyCode = e.keyCode;
		if (keyCode === yKey) {
			if (exitBOL) {
				$scope.exitWinYes();
				$scope.$apply();
			}
		}
	};
	
	function firstSlideKey(e){
		var keyCode = e.keyCode;
		if (keyCode === homeKey) {
			$scope.homeIconClick();
			$scope.$apply();
		}
	};
	
	function invertKey(e){
		var keyCode = e.keyCode;
		if (keyCode === iKey) {
			$scope.invertIconClick();
			$scope.$apply();
		}
	}
	function zoomInKey(e){
		var keyCode = e.keyCode;
		if (keyCode === plusKey) {
			//$scope.zoomIn();
			//$scope.$apply();
		}
	}
	function zoomOutKey(e){
		var keyCode = e.keyCode;
		if (keyCode === minusKey) {
			//$scope.zoomOut();
			//$scope.$apply();
		}
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
	} 
	
	function isPlaying(audio) {
		return !audio.paused;
	}

});
