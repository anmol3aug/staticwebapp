//Author	: Raghu Golconda
//version	: V1.0	
//Date		: september 23 2017
//Company: KPMG, copyrights
eLearningApp.controller('courseMenu', function($scope, $http) {
$scope.couseData = [
	{
		"image":"",
		"direction":"right",
		"heading":"Introduction to Information Security raghu",
		"list":[
				"Information Security Basics",
				"Security Incident ",
				"Types of Security Incidents",
				"Ensuring Information Security",
				"Reporting Security Incidents Data",
				"raghu Classifications Retention and Disposal" 
				]
	},
	{
		"image":"",
		"direction":"left",
		"heading":"Acceptable Use Policy",
		"list":[
				"Clear Desk / Work Space",
				"Portable Storage Devices",
				"Printing and Presentation Guideline",
				"Software Policy",
				"Local Admin Rights"  
				]
	},
	{
		"image":"",
		"direction":"right",
		"heading":"Physical Security",
		"list":[
				"Accessing Office Premises",
				"Laptop Security" 
				]
	},
	{
		"image":"",
		"direction":"left",
		"heading":"System and Communication System",
		"list":[
				"Password security and leading practices",
				"E-mail security and spam control",
				"Use of Instant Messaging",
				"Safeguarding computers and Anti-virus leading practices",
				"Wireless LAN",
				"Remote access",
				"Cloud Services",
				"Social Engineering",
				"Smartphone Management"  
				]
	},
	{
		"image":"", 
		"heading":"Assessment" 
	}
]
})