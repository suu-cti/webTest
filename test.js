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