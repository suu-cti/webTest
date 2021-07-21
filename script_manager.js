
/*
// JavaScript Document
var script = document.createElement("script");
script.type = 'text/javascript';
script.src = 'https://cdn.jsdelivr.net/gh/suu-otl/webTest@b355e8d50ff1e93512b7b9c32e1169122735f372/script_manager.js';
document.head.appendChild(script);
*/


//Calls all of the other scripts
// console.log("Script manager working")
var scripts = [ 'assignment_switcher.js', 'buttons.js', 'hide_elements.js', 'knowledge_checks.js',  'third_party_scripts.js', 'tutoring_buttons.js']
for(var i = 0; i < scripts.length; i++){
	var script = document.createElement("script");
	script.src = 'https://www.suu.edu/otl/_canvas-files/' + scripts[i];
	document.head.appendChild(script);
}



var script = document.createElement("script")
script.src = "https://cdn.jsdelivr.net/gh/suu-otl/webTest@688eb9e847b3dda3959ad09800cbe165d6d0b64f/hide_inactives.js"
document.head.appendChild(script)




var script = document.createElement("script")
script.src = "https://cdn.jsdelivr.net/gh/suu-otl/webTest@688eb9e847b3dda3959ad09800cbe165d6d0b64f/show_file_use.js"
document.head.appendChild(script)


//* Calendar Customization === This is where a link to the SUU Academic Calendar is located top right on Calendar page.//
$('#calendar-feed').parent().prepend('<i class="icon-calendar-month"></i> <a href="http://www.google.com/calendar/embed?src=suu.edu_tjl05mhr4lldjqhph0lasfmqk8@group.calendar.google.com&ctz=America/Denver&gsessionid=_lJiWMqvVSpfkVl1KVgY3w/" target="_new">SUU Academic Calendar</a>');

// Course Format - Hidden because SUU does not use it.
$('td'+'#course_course_format').parent().prepend('<div class="alert alert-info">This feature is not available as delivery format is identified by section number at SUU.</div>');

// SUU footer
$('.footer-logo').parent().prepend('<div style="margin: 0 0 10 0; padding-right: 100px; width: 50%; background: #fff;"><strong><a href="https://help.suu.edu/canvas" target="_new">SUU Help Center</a> | <a href="http://library.suu.edu/" target="_new">SUU Library</a> | <a href="https://www.suu.edu/otl/" target="_new">Online Teaching & Learning</a> | <a href="https://www.suu.edu/studentaffairs/pdf/campus-resources-and-services.pdf" target="_new">Campus Resources & Services Directory</a></strong><br /><a href="http://suu.edu" target="_new">Southern Utah University</a> - 351 West University Boulevard - Cedar City, UT 84720 - 435.586.7700<br />Southern Utah University | <a href="http://www.suu.edu/disclaimer.html">Disclaimer</a> | Consumer Complaint Policy [<a href="https://help.suu.edu/uploads/attachments/PP114Student.pdf">In Utah</a>, <a href="http://www.higheredutah.org">Outside Utah</a>] | <a href="https://www.suu.edu/accessibility">Accessibility</a><br /><br />Need Support with Canvas? Contact Us: <a href="mailto:canvas@suu.edu">canvas@suu.edu</a> or call <a href="tel:435-865-8555">435-865-8555</a></div>');

// Custom Learning Outcome Message
// Created by Parker Grimes May 8, 2017
$('.outcomes-content').html('<div class="wrapper"><h2>Learning Outcomes</h2><div class="outcomes-message"><p>Outcomes are created to track competency in a course.</p><p>SUU&#39;s Essential Learning Outcomes (ELO) have been established for all undergraduate courses and loaded into Canvas for you. For more details about SUU ELOs you may refer to <a href="https://www.suu.edu/academics/provost/pdf/elo-full-definitions.pdf">https://www.suu.edu/academics/provost/pdf/elo-full-definitions.pdf</a></p><p>General Education courses are required to assess two ELOs of each faculty member&#39;s choice.  <a href="https://www.suu.edu/academics/provost/pdf/ge-handbook.pdf">Please use this short checklist to meet the requirement: https://www.suu.edu/academics/provost/pdf/ge-handbook.pdf</a></p><p>If you teach a 5000 level course and higher and would like SUU ELOs added to your course, please contact Online Teaching & Learning for assistance: 435-865-8555</p><p>College/school level outcomes for specialized accreditation such as AACSB for the School of Business may be added to Outcomes as well. Please contact Online Teaching & Learning for assistance: 435-865-8555 or <a href="mailto:canvas@suu.edu">canvas@suu.edu</a> or <a href="https://www.suu.edu/otl">https://www.suu.edu/otl</a>.</p></div></div>');
// END Custom Learning Outcome Message