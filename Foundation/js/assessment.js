//Author	: Raghu Golconda
//version	: V1.0
//Date		: september 23 2017
//Company: KPMG, copyrights
var __qstNO;
var __playQuestionAudio;
var __spacebarKeyQuestion;
var __enterKeySubmit;
var __enterKeyNext;
var __tabKeyRadioSelection;
var __printKey;
var __enterKeyRetry;
eLearningApp.controller('assessment', function($scope, $http) {
	var questionType;
	var radioAnswer;
	var score=0;
	var random = true;
	var totalQuestions = 5;
	var attempts = 0;
	var maxAttempts = 2;
	var percentage;
	var jsonData;
	//new
	var radioCount = 0;
	var tabKey = 9;
	var enterKey = 13;
	var spacebarKey = 32;
	var shiftKey = 16;
	var pKey = 80;
	var clearT;
	//scorm 1.2
	if(__gscormVersion){
		BVScorm_getScore();
	}
	//

    $http.get(__gjsonfilePath)
        .then(function(res) {
			$scope.isDisabled = false;
			$scope.questionNO = 0;
			jsonData = res;
			randomize(random,jsonData);
			questionType = $scope.multipleChoice[$scope.questionNO].type;
			__qstNO = $scope.multipleChoice[$scope.questionNO].no;
			//$scope.totalQuestions = $scope.multipleChoice.length;
			$scope.totalQuestions = totalQuestions;
			checkQuestionType();
			$scope.choiceButtonClick = function(evt,id){
				if(questionType == "singleChoice"){
					 radioButtonClick(evt,id)
				}else{
					checkButtonClick(evt,id)
				}

			}

			$scope.submitClick = function(evt){
				radioCount = 0;
				if(questionType == "singleChoice"){
					radioValidation();
				}else{
					checkValidation();
				} 
			}

			$scope.showAnswerClick = function(evt){
				if(questionType == "singleChoice"){
					showRadioAnswer();
				}else{
					showCheckAnswer();
				}
			}

			$scope.nextButtonClick = function(evt){
				nextButtonClick();
			}

			$scope.retakeTest = function(evt){
				retakeTest();
			}

			$scope.certificate = function(evt){
				certificate();
			}

			$scope.print = function(evt){
				//printCertificate($('[data-print-content]'));
			}

			$scope.printCertificate = function(div) {
			  printCertificate(div)
			}

			if(__gbookmark == "completed" || __assmtComplete == true){
				certificate();
				certificateAudioEnded();
				//__audio.removeEventListener("ended", certificateAudioEnded);
				//__audio.addEventListener("ended", certificateAudioEnded);
			}
        });

		function certificateAudioEnded(){
			$("body").off('keyup', __printKey);
			$("body").on('keyup', __printKey);
			//__audio.removeEventListener("ended", certificateAudioEnded);
		}

		__tabKeyRadioSelection = function(e) {
			//new
			var keyCode = e.keyCode;
			if(keyCode===tabKey) {
				if(questionType == "singleChoice"){
					radioCount++;
					console.log(radioCount);
					radioButtonClick(null,radioCount);
				}
			}
		}

		__spacebarKeyQuestion = function(e){
			//new
			var keyCode = e.keyCode;
			if(keyCode===spacebarKey) {
				e.preventDefault();
				//__playQuestionAudio(__qstNO);
			};
		}

		__enterKeySubmit = function(e){
			//new
			var keyCode = e.keyCode;
			if(keyCode===enterKey) {
				e.preventDefault();
				console.log("__enterKeySubmit");
				radioCount = 0;
				$("body").off('keyup', __enterKeySubmit);
				$("body").off('keyup', __tabKeyRadioSelection);
				$scope.submitClick();
			};
		}

		__enterKeyNext = function(e){
			//new
			var keyCode = e.keyCode;
			if(keyCode===enterKey) {
				e.preventDefault();
				console.log("__enterKeyNext");
				$("body").off('keyup', __enterKeyNext);
				radioCount = 0;
				$scope.nextButtonClick();
				$scope.$apply();
			};
		}

		__enterKeyRetry = function(e){
			//new
			var keyCode = e.keyCode;
			if(keyCode===enterKey) {
				 $scope.retakeTest();
				 $scope.$apply();
				 $("body").off('keyup', __enterKeyRetry);
			};
		}

		__printKey = function(e){
			//new
			var keyCode = e.keyCode;
			if(e.shiftKey && keyCode===pKey) {
				$("body").off('keyup', __printKey);
				//playAudio('print_dialog');
				var clearTime = setTimeout(function(){
					clearTimeout(clearTime);
					$scope.printCertificate('act-certificate');
					$scope.$apply();
				}, 1000);
			};
		}

		__playQuestionAudio = function(qstNO){
			//new audio
			var path = 'audio/assmt/A' + qstNO + '.mp3';
			var audioAct = document.getElementById("audio-act");
			audioAct.src = path;
			$("body").off('keyup', __tabKeyRadioSelection);
			$("body").on('keyup', __tabKeyRadioSelection);
			var playPromise = audioAct.play();
			if (playPromise !== undefined) {
				playPromise.then(function() {
					audioAct.play();
				}).catch(function(error) {

				});
			}
			$("body").off('keyup', __spacebarKeyQuestion);
			$("body").on('keyup', __spacebarKeyQuestion);
			//
		}

		function playOptionAudio(id){
			//new audio
			var path = 'audio/assmt/A' + __qstNO + '_O' + id + '.mp3';
			var audioAct = document.getElementById("audio-act");
			audioAct.src = path;
			var playPromise = audioAct.play();
			if (playPromise !== undefined) {
			  playPromise.then(function() {
				audioAct.play();
			  }).catch(function(error) {

			  });
			}
			//
		}

		function tabRadioLoop(id){
			var f=document.getElementById(id);
			if (f) { f.tabIndex = -1; f.focus(); }
				radioCount = id;
			if(id>=$(".act-radio-img").length){
				radioCount = 0;
			}
		}

		function playResponseAudio(sndName){
			//new audio
			//var audioAct = document.getElementById("audio-act");
			if($scope.questionNO==$scope.totalQuestions-1){
				//var path = 'audio/assmt/' + sndName + 'last.mp3';
				//audioAct.removeEventListener("ended", audioEnded);
				//audioAct.addEventListener("ended", audioEnded);
				assessmentScore();
			}else{
				//var path = 'audio/assmt/' + sndName + '.mp3';
			};
			/* audioAct.src = path;
			var playPromise = audioAct.play();
			if (playPromise !== undefined) {
			  playPromise.then(function() {
				audioAct.play();
			  }).catch(function(error) {

			  });
			}  */
		}

		function playAudio(sndName){
			//new audio
			var audioAct = document.getElementById("audio-act");
			var path = 'audio/assmt/' + sndName + '.mp3';
			audioAct.src = path;
			var playPromise = audioAct.play();
			if (playPromise !== undefined) {
			  playPromise.then(function() {
				audioAct.play();
			  }).catch(function(error) {

			  });
			}
		}

		function audioEnded(){
			var audioAct = document.getElementById("audio-act");
			audioAct.removeEventListener("ended", audioEnded);
			assessmentScore();
		}

		// ..
		function printCertificate(div){
			var printContents = document.getElementById(div).innerHTML;
			  var popupWin = window.open('', '_blank', 'width=600,height=400');
			  popupWin.document.open();
			  popupWin.document.write('<html><head><title>Certificate</title><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
			  popupWin.document.close();
			  $(".slide-info").html("Click on browser close to exit the course");
			  if(__gscormVersion){
					moduleEnd();
			  };
			  if(__gbookmark != "completed"){
					//__audio.play();
			  };
		}

		function certificate(){
			$(".sld-thankyou").show();
			$(".slide-info").html("Click on browser close to exit the course");
			playAudio("thankyou");
			if(__gscormVersion){
				moduleEnd();
			};
			$(".act-print-page").show();
			$(".act-print").show();
			//$(".act-send-email").show();
			var date = new Date();
			//scorm 1.2
			if(__gscormVersion){
				var name = getUserName(sname);
				$(".act-username").html(name.split(",")[1]+" "+name.split(",")[0]);
				$(".act-certificate-date").html("On:   "+date.toDateString());
			}else{
				var name = "User,Name"
				$(".act-username").html(name.split(",")[1]+" "+name.split(",")[0]);
				$(".act-certificate-date").html("Date:  "+date.toDateString());
			}
			//
		}
		function retakeTest(){
			$(".act-score-page").hide();
			$(".act-choice-response").hide();
			randomize(random,jsonData);
			$scope.questionNO = 0;
			score = 0;
			percentage = 0;
			$scope.isDisabled = false;
			checkQuestionType();
			radioCount = 0;
			//__playQuestionAudio(__qstNO);
		}

		function assessmentScore(){
			attempts++;
			percentage = (score*100)/totalQuestions;
			var passPercent = 80;
			$(".act-score-retake").hide();
			$(".act-score-certificate").hide();
			//$(".act-score-page").show(); 
			//$(".act-score-answer").html(" "+score+" / "+totalQuestions);
			if(percentage>=passPercent){
				__assmtComplete = true;
				setTimeout(function(){ certificate(); }, 5000);
				//certificate();
				$(".act-score-heading").html("<fntsze></fntsze><br/>");
				//playAudio("Assessment_pass");
				//$("body").off('keyup', __printKey);
				//$("body").on('keyup', __printKey);
				//$(".act-score-answer-holder").css("top","303px");
				//$(".act-score-answer-holder").css("left","797px");
				//$(".act-score-page").css("background-image","url(img/assessment/sld-img12.png)");
			}else{
				$(".act-score-answer-holder").css("top","272px");
				$(".act-score-answer-holder").css("left","820px");
				$(".act-score-heading").html("<fntsze></fntsze><br/>");
				$(".act-score-retake").show();
				$(".slide-info").html("<b>Click on 'Retake' button.</b>");
				$("body").off('keyup', __enterKeyRetry);
				$("body").on('keyup', __enterKeyRetry);
				//playAudio("Assessment_fail");
			}
			//scorm 1.2
			if(__gscormVersion){
				BVScorm_score(percentage);
				if(percentage>=passPercent){
					moduleEnd();
				}else{
					moduleEnd1();
				}
			}
			//
		}

		function randomize(random,res){
			if(random){
				$scope.multipleChoice = shuffle(res.data);
			}else{
				$scope.multipleChoice = res.data;
			}
		}

		function shuffle(sourceArray) {
			for (var i = 0; i < sourceArray.length - 1; i++) {
				var j = i + Math.floor(Math.random() * (sourceArray.length - i));

				var temp = sourceArray[j];
				sourceArray[j] = sourceArray[i];
				sourceArray[i] = temp;
			}
			return sourceArray;
		}


		function checkQuestionType(){
			questionType = $scope.multipleChoice[$scope.questionNO].type;
			__qstNO = $scope.multipleChoice[$scope.questionNO].no;
			angular.element(document).ready(function () {
				if(questionType == "singleChoice"){
					$(".act-choice-img").removeClass("act-choice-img").attr("class", "act-radio-img act-choice-img");
					$(".slide-info").html("<b>Select the correct option</b>");
					$("body").off('keyup', __tabKeyRadioSelection);
					$("body").on('keyup', __tabKeyRadioSelection);
				}else{
					$("body").off('keyup', __tabKeyRadioSelection);
				}
			});
		}

		function checkButtonClick(evt,id){
			$("#"+id).toggleClass("act-choice-selected-state")
			if($("#"+id).attr("select")=="yes"){
				$("#"+id).attr("select","no");
			}else{
				$("#"+id).attr("select","yes");
			}
			checkSubmit();
		}

		function radioButtonClick(evt,id){
			radioAnswer = $("#"+id).parent().attr("answer")
			$(".act-radio-img").removeClass("act-radio-selected-state")
			$(".act-radio-img").addClass("act-radio-default-state")
			$("#"+id).addClass("act-radio-selected-state");
			$(".act-choice-submit").show();
			$("body").off('keyup', __enterKeySubmit);
			$("body").on('keyup', __enterKeySubmit);
			//playOptionAudio(id);
			var f=document.getElementById(id);
			if (f) { f.tabIndex = -1; f.focus(); }
				radioCount = id;
			if(id>=$(".act-radio-img").length){
				radioCount = 0;
			}
		}

		function checkSubmit(){
			var selectCount = 0;
			$(".act-choice-img").each(function(){
				if($(this).attr("select") == "yes"){
					selectCount++;
				}
			})
			if(selectCount>0){
				$(".act-choice-submit").show();
			}else{
				$(".act-choice-submit").hide();
			}
		}

		function checkCorrectAnswers(arr){
			var correctAnsNo = 0;
			for(var i=0;i<arr.length;i++){
				if(String(arr[i])=="true"){
					correctAnsNo++
				}
			}
			return correctAnsNo;
		}

		function checkInCorrectAnswers(arr){
			var inCorrectAnsNo = 0;
			for(var i=0;i<arr.length;i++){
				if(String(arr[i])=="false"){
					inCorrectAnsNo++
				}
			}
			return inCorrectAnsNo;
		}

		function optionAnswers(){
			var options = $scope.multipleChoice[$scope.questionNO].options;
			var ansArr = [];
			for(var i=0;i<options.length;i++){
				ansArr.push(options[i].ans);
			}
			return ansArr;
		}

		function radioValidation(){
			$(".act-choice-response").removeClass("act-choice-response-color");
			$(".act-choice-response-img").removeClass("act-choice-response-incorrect-img");
			$(".act-choice-response-img").removeClass("act-choice-response-correct-img");
			if(radioAnswer=="true"){
				$(".act-choice-response").show();
				$(".act-choice-response-txt").html($scope.multipleChoice[$scope.questionNO].response[0]);
				$(".act-choice-response-img").addClass("act-choice-response-correct-img");
				score++;
				playResponseAudio("correct");
				checkNextQ();
			}else{
				score++;
				$(".act-choice-response").show();
				$(".act-choice-response").addClass("act-choice-response-color");
				$(".act-choice-response-txt").html($scope.multipleChoice[$scope.questionNO].response[1]);
				$(".act-choice-response-img").addClass("act-choice-response-incorrect-img");
				playResponseAudio("incorrect");
				$(".act-choice-show-answer").show();
			}

			$(".act-choice-submit").hide();
			$scope.isDisabled = true;
			$(".act-choice-txt").css("cursor","default") 
		}

		function checkValidation(){
			//
			var answer = optionAnswers();
			var ansArr = [];
			var correctAnsNo;
			var doneAnsNo;
			var inCorrectAnsNo;
			$(".act-choice-response").removeClass("act-choice-response-color");
			//
			$(".act-choice-holder").each(function(i){
				var checkImg = $(this).find(".act-choice-img");
				if(checkImg.attr("select")=="yes"){
					var ans = checkImg.parent().attr("answer");
					ansArr.push(ans);
				}else{
					ansArr.push("none");
				}
			});
			correctAnsNo = checkCorrectAnswers(answer);
			doneAnsNo = checkCorrectAnswers(ansArr);
			inCorrectAnsNo = checkInCorrectAnswers(ansArr);

			//
			if(doneAnsNo==correctAnsNo && inCorrectAnsNo==0){
				$(".act-choice-response").show();
				$(".act-choice-response-txt").html($scope.multipleChoice[$scope.questionNO].response[0]);
				$(".act-choice-response-img").removeClass("act-choice-response-incorrect-img");
				$(".act-choice-response-img").addClass("act-choice-response-correct-img");
				score++;
				playResponseAudio("correct");
				checkNextQ();
			}/* else if(doneAnsNo<correctAnsNo && inCorrectAnsNo==0){
				$(".act-choice-show-answer").show();
				$(".act-choice-response").show();
				$(".act-choice-response-txt").html($scope.multipleChoice[$scope.questionNO].response[2]);
				$(".act-choice-response-img").addClass("act-choice-response-correct-img");
			} */else{
				score++;
				$(".act-choice-response").show();
				$(".act-choice-response").addClass("act-choice-response-color");

				$(".act-choice-response-txt").html($scope.multipleChoice[$scope.questionNO].response[1]);
				$(".act-choice-response-img").removeClass("act-choice-response-correct-img");
				$(".act-choice-response-img").addClass("act-choice-response-incorrect-img");
				$(".act-choice-show-answer").show();
				playResponseAudio("incorrect");
			}
			//

			$(".act-choice-submit").hide();
			$scope.isDisabled = true;
			$(".act-choice-txt").css("cursor","default") 
		}

		function showCheckAnswer(){
			$(".act-choice-holder").each(function(i){
				$(this).find(".act-choice-img").removeClass("act-choice-selected-state");
				$(this).find(".act-choice-img").addClass("act-choice-default-state");

				if($(this).attr("answer")=="true"){
					$(this).find(".act-choice-img").addClass("act-choice-selected-state");
					$(this).find(".act-choice-txt-highlight").addClass("act-choice-txt-selected-state");
				}
			});
			 $(".act-choice-show-answer").hide();
			 $(".act-choice-incorrect").hide();
			 $(".act-choice-correct").hide();
			 //$(".act-choice-response").hide();
			 checkNextQ()
		}

		function showRadioAnswer(){
			$(".act-choice-holder").each(function(i){
				$(this).find(".act-radio-img").removeClass("act-radio-selected-state");
				$(this).find(".act-radio-img").addClass("act-radio-default-state");

				if($(this).attr("answer")=="true"){
					$(this).find(".act-radio-img").addClass("act-radio-selected-state");
					$(this).find(".act-choice-txt-highlight").addClass("act-choice-txt-selected-state");
				}
			});
			 $(".act-choice-show-answer").hide();
			 $(".act-choice-incorrect").hide();
			 $(".act-choice-correct").hide();
			 //$(".act-choice-response").hide();

			 checkNextQ()
		}

		function checkNextQ(){
			$("body").off('keyup', __spacebarKeyQuestion);
			$("body").off('keyup', __enterKeySubmit);
			$("body").off('keyup', __enterKeyNext);
			$("body").off('keyup', __tabKeyRadioSelection);
			if($scope.questionNO==$scope.totalQuestions-1){

			}else{
				$(".act-choice-next").show();
				$(".slide-info").html("<b>Click on 'Continue' button.</b>");
				$("body").on('keyup', __enterKeyNext);
				//clearTimeout(clearT);
				//clearT = setTimeout(nextButtonClick, 1000);
			}
		}

		function nextButtonClick(){
			$("body").off('keyup', __spacebarKeyQuestion);
			$("body").off('keyup', __enterKeySubmit);
			$("body").off('keyup', __enterKeyNext);
			$("body").off('keyup', __tabKeyRadioSelection);
			radioCount = 0;
			$scope.questionNO++;
			$(".act-choice-next").hide();
			$(".act-choice-response").hide();
			questionType = $scope.multipleChoice[$scope.questionNO].type;
			__qstNO = $scope.multipleChoice[$scope.questionNO].no;
			$scope.isDisabled = false;
			checkQuestionType();
			clearTimeout(clearT);
			$scope.$apply();
			//__playQuestionAudio(__qstNO);
		}
});

eLearningApp.filter('trustHtml', ['$sce', function($sce){
	return function(text){
		return $sce.trustAsHtml(text);
	}
}])