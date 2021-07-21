//Hides the "Concludes Course" and "Delete Course" buttons.
//Written by Eric Adams (eadams@instructure.com) on April 16th of some year.
//Edited (and added back in) by Bryce Mecham on September 16, 2020.
(function() {
    console.log('Hiding Course Delete and Conclude');
    // THIS WILL HIDE RESET COURSE CONTENT FOR ANYONE NOT AN ADMIN///
    if($.inArray('admin', ENV['current_user_roles']) == -1 ) {
        $('a[href$="event=conclude"]').hide();
        $('a[href$="event=delete"]').hide();
    } else{
        //do nothing
    }
}());

//Hiding the Don't Post Outcomes results to Learning Mastery Gradebook from rubrics
$(function(){
	$(".hide_outcome_results").hide();
});


//Hides the Don't Post Outcomes results from Quizzes and Discussions.
document.addEventListener("transitionstart", function(){
	$(".hide_outcome_results").hide();
});