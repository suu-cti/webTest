console.log("Buttons working")

//* Orientation Choices #right-side, .ic-sidebar-logo, .ic-sidebar-logo_image (append)
$('#right-side').prepend('<a class="Button Button--primary Button--block"  href="https://suu.instructure.com/courses/166813">Students - How To Use Canvas</a><br />');

$('#right-side').prepend('<a class="Button Button--primary Button--block"  href="https://library.suu.edu/distance">Library Resource for <br />Distance Learners</a><br />');


//
///Adds tutoring help buttons to specific classes
//
var classDictionary = {
	//Format
	//	"Course Type" : ["URL", "Text To Display"]
	"ENGL" : ["https://www.suu.edu/writingcenter/", "Writing Assistance"],
	"MATH" : ["https://www.suu.edu/academicsuccess/tutoring/", "Tutoring"],
	"COMM" : ["https://www.suu.edu/speech-center/", "Speech and Presentation Assistance"]
}

if(window.location.pathname.includes("courses")){
	var title = document.title.split("-")[0];
	if(classDictionary[title]){
		$('#course_show_secondary').append(`<br /> <a class="Button Button--primary Button--block" href=${classDictionary[title][0]} >${classDictionary[title][1]}</a> `);
	}
}


//
///Adds the Registration Schedule Builder button to only the dashboard.
//
if(window.location.pathname == "/"){
	$('#right-side-wrapper').append('<br /> <a class="Button Button--primary Button--block" style="padding: 0px 0px; border: none;" href="https://suu.collegescheduler.com/"><img src="https://s3-us-west-1.amazonaws.com/mysuu/images/college-scheduler.jpg"></a>');
}

//
///Speed Grader stuff
//
if(window.location.pathname.includes("speed_grader")){
	$(right_side).append('<a class="Button Button--primary Button--block" href="Google.com">Plz work</a> ');
}


//Script Originally written by Kenneth Larson and can be found here: https://community.canvaslms.com/t5/Question-Forum/Is-that-possible-to-add-a-quot-My-Media-quot-button-on-Dashboard/td-p/151848/page/2
//Adjusted by Bryce Mecham on 02/05/2021 to add the My Media link and adjust the position of it within the Account pull out Menu.
$('#global_nav_profile_link').click(function () {    
	'use strict';
	setTimeout(function () {        
		// Find a link within the account menu to find the list
		var $popupPanelList = $('a[href="/dashboard/eportfolios"]').closest('ul');   
		//console.log($popupPanelList);
		if ($popupPanelList.find('.myMediaLink').length === 0) {      
			$('<li class="ic-NavMenu-list-item myMediaLink"> <a href="https://suu.instructure.com/users/' + ENV.current_user_id + '/external_tools/102275" class="ic-NavMenu-list-item__link">My Media</a>').insertBefore('#nav-tray-portal > span > span > div > div > div > div > div > ul > li:nth-child(6)');
			// If they have the share content then use remove 11 if not, remove 10?
			// else use #nav-tray-portal > span > span > div > div > div > div > div > ul > li:nth-child(10);
			if ( document.querySelector("#nav-tray-portal > span > span > div > div > div > div > div > ul > li:nth-child(7) > div > a").innerText == "Shared Content" ) {
				console.log("True");
				$('#nav-tray-portal > span > span > div > div > div > div > div > ul > li:nth-child(11)').remove();
			}
			else{
				console.log("False");
				$('#nav-tray-portal > span > span > div > div > div > div > div > ul > li:nth-child(10)').remove();
			}
		}
	}, 500);
});