//Author	: Raghu Golconda
//version	: V1.0	
//Date		: september 23 2017
//Company: KPMG, copyrights 
var __tabKeyRadioSelection;
var __enterKeySubmit;
eLearningApp.controller('multipleChoice', function($scope, $http, $document ) {   
	var questionType;
	var radioAnswer; 
	var radioCount = 0;
	var tabKey = 9;
	var enterKey = 13;
	var actAudio;
    $http.get(__gjsonfilePath)
        .then(function(res) { 
			$scope.isDisabled = false;
			$scope.questionNO = 0;
            $scope.multipleChoice = res.data;  
			questionType = $scope.multipleChoice[$scope.questionNO].type; 
			$scope.totalQuestions = $scope.multipleChoice.length;   
			checkQuestionType()
			$scope.choiceButtonClick = function(evt,id){  
				if(questionType == "singleChoice"){ 
					 radioButtonClick(evt,id)
				}else{
					checkButtonClick(evt,id)
				} 
				
			}  
			
			$scope.submitClick = function(evt){   
				if(questionType == "singleChoice"){ 
					radioValidation();
				}else{
					checkValidation();
				};
				$("body").off('keyup', __tabKeyRadioSelection);
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
			 
			$("body").off('keyup', __tabKeyRadioSelection);  
        }); 
		
		__tabKeyRadioSelection = function(e) {
			var keyCode = e.keyCode; 
			if(keyCode===tabKey) { 
				radioCount++
				e.preventDefault(); 
				radioButtonClick(null,radioCount); 
				$("body").on('keyup', __enterKeySubmit); 
			};
		}
		
		__enterKeySubmit = function(e){
			var keyCode = e.keyCode; 
			if(keyCode===enterKey) { 
				radioCount++
				e.preventDefault(); 
				$scope.submitClick();
				$("body").off('keyup', __enterKeySubmit); 
			};
		}
		
		function checkQuestionType(){   
			angular.element(document).ready(function () { 
				if(questionType == "singleChoice"){ 
					$(".act-choice-img").removeClass("act-choice-img").attr("class", "act-radio-img act-choice-img");  
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
			var optAudio = $scope.multipleChoice[$scope.questionNO].audio[$scope.questionNO].option[id-1]
			radioAnswer = $("#"+id).parent().attr("answer"); 
			$(".act-radio-img").removeClass("act-radio-selected-state");
			$(".act-radio-img").addClass("act-radio-default-state");
			$("#"+id).addClass("act-radio-selected-state");
			$(".act-radio-img").attr("select","no");
			$("#"+id).attr("select","yes");  
			//playAudio(optAudio);
			//
			var f=document.getElementById(id);
			if (f) { f.tabIndex = -1; f.focus(); }  
			radioCount = id;
			if(id>=$(".act-radio-img").length){
				radioCount = 0;
			}
			checkSubmit(); 
		}
		
		function playAudio(sndName){
			//audio-act
			var audioAct = document.getElementById("audio-act");
			actAudio = audioAct;
			audioAct.src = 'audio/'+sndName+'.mp3';  
			var playPromise = audioAct.play(); 
			if (playPromise !== undefined) {
			  playPromise.then(function() { 
				audioAct.play(); 
			  }).catch(function(error) {
				 
			  });
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
			if(radioAnswer=="true"){
				$(".act-choice-response").show();
				$(".act-choice-response-txt").html($scope.multipleChoice[$scope.questionNO].response[0]);
				$(".act-choice-response-img").addClass("act-choice-response-correct-img"); 
				var resAudio = $scope.multipleChoice[$scope.questionNO].audio[$scope.questionNO].response[0]; 
				playAudio(resAudio); 
				checkNextQ();
			}else if(radioAnswer=="true1"){
				$(".act-choice-response").show();
				$(".act-choice-response-txt").html($scope.multipleChoice[$scope.questionNO].response[1]);
				$(".act-choice-response-img").addClass("act-choice-response-correct-img"); 
				var resAudio = $scope.multipleChoice[$scope.questionNO].audio[$scope.questionNO].response[1]; 
				playAudio(resAudio);
				checkNextQ();
			}else{
				$(".act-choice-response").show();
				$(".act-choice-response").removeClass("act-choice-response-color");
				//$(".act-choice-response").addClass("act-choice-response-color");
				$(".act-choice-response-txt").html($scope.multipleChoice[$scope.questionNO].response[1]);
				$(".act-choice-response-img").addClass("act-choice-response-incorrect-img");
				//$(".act-choice-show-answer").show();
				var resAudio = $scope.multipleChoice[$scope.questionNO].audio[$scope.questionNO].response[1];
				playAudio(resAudio);
			}
			$(".act-choice-submit").hide();
			$scope.isDisabled = true;
			$(".act-choice-txt").css("cursor","default")
			$(".act-radio-img").css("cursor","default")
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
				$(".act-choice-response-txt").css("background-color","#B2C43C");
				$(".act-choice-response-img").addClass("act-choice-response-correct-img");
				var resAudio = "slide23_C";  
				playAudio(resAudio);
				
				checkNextQ();
			}else if(doneAnsNo<correctAnsNo && inCorrectAnsNo==0){ 
				$(".act-choice-show-answer").show();
				$(".act-choice-response").show();
				$(".act-choice-response-txt").html($scope.multipleChoice[$scope.questionNO].response[1]);
				$(".act-choice-response-txt").css("background-color","#B62427");
				$(".act-choice-response-img").addClass("act-choice-response-correct-img");
				var resAudio = "slide23_I"; 
				playAudio(resAudio);
				
			}else{ 
				$(".act-choice-response").show();
				$(".act-choice-response").addClass("act-choice-response-color");
				
				$(".act-choice-response-txt").html($scope.multipleChoice[$scope.questionNO].response[1]);
				$(".act-choice-response-txt").css("background-color","#B62427");
				$(".act-choice-response-img").addClass("act-choice-response-incorrect-img");
				$(".act-choice-show-answer").show();
				var resAudio = "slide23_I"; 
				playAudio(resAudio);
				
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
				}
			});
			 $(".act-choice-show-answer").hide();
			 $(".act-choice-incorrect").hide();
			 $(".act-choice-correct").hide(); 
			 $(".act-choice-response").hide();  
			 checkNextQ()
		}
		
		function showRadioAnswer(){
			$(".act-choice-holder").each(function(i){  
				$(this).find(".act-radio-img").removeClass("act-radio-selected-state");
				$(this).find(".act-radio-img").addClass("act-radio-default-state");
				
				if($(this).attr("answer")=="true"){
					$(this).find(".act-radio-img").addClass("act-radio-selected-state");
				}
			});
			 $(".act-choice-show-answer").hide();
			 $(".act-choice-incorrect").hide();
			 $(".act-choice-correct").hide(); 
			 $(".act-choice-response").hide(); 
			 checkNextQ()
		}
		
		function checkNextQ(){
			if($scope.questionNO==$scope.totalQuestions-1){ 
				actAudio.onended = function() {
					__audio.play();
				}; 
			}else{
				$(".act-choice-next").show(); 
			} 
		}
		
		function nextButtonClick(){
			$scope.questionNO++;
			$(".act-choice-next").hide(); 
			$(".act-choice-response").hide();
			questionType = $scope.multipleChoice[$scope.questionNO].type;
			$scope.isDisabled = false;
		}
});

eLearningApp.filter('trustHtml', ['$sce', function($sce){ 
	return function(text){
		return $sce.trustAsHtml(text); 
	}
}])