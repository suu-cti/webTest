//Code is used to add assignment switching controls to Speed Grader
//Written by Bo Stevens (06/08/2021)


//ENTRY POINT
if(window.location.pathname.includes("gradebook")){
    new AssignmentSwitcher()

}

class AssignmentSwitcher{
    classesDiv = "classesDiv"
    charLimit = 25
    
    showingAssignments = false
    previousAssignment = null
    nextAssignment = null
    

    constructor(){
        this.createAssignmentButtons()
        $(document).click(this.hideButtons)
    }
    
    //This looks nasty, but it just hides the assignments when we click on anything besides our dropdown button
    hideButtons(e){
        if($(e.target).closest("#assignment-dropdown-button").length > 0){
            return false
        }
        this.showingAssignments = false
        $('#'+this.classesDiv).css("visibility", "hidden")
    }
    
    
    //Shows our assignment buttons when clicking on the dropdown button the first time, and hiding the second
    dropdownClicked(){
        if(this.showingAssignments){
            this.showingAssignments = false
            $('#'+this.classesDiv).css("visibility", "hidden")
        }
        else{
            this.showingAssignments = true
            $('#'+this.classesDiv).css("visibility", "visible")
        }
    }
    
    //Adds the buttons used to switch between previous and next assignments as well as the dropdown button
    addNavButtons(){
        previousUrl = "speed_grader?assignment_id=" + this.previousAssignment
        nextUrl = "speed_grader?assignment_id=" + this.nextAssignment
        $('<button id="prev-assignment-button" type="button" style = "background-color: hsla(360, 100%, 100%, 0); border: none; margin-right: 1%;" aria-hidden="true" onclick = location.href="'  + previousUrl + '"  ><i class="icon-arrow-left prev" style="color: white"></i></input>').insertBefore('.assignmentDetails')
        $('<button id="assignment-dropdown-button" type="button" style = "background-color: hsla(360, 100%, 100%, 0); border: none; margin-left: 1%;" aria-hidden="true" onclick = "this.dropdownClicked()"><i class="icon-mini-arrow-down" style="color: white"></i></input>').insertAfter('.assignmentDetails')
        $('<button id="next-assignment-button" type="button" style = "background-color: hsla(360, 100%, 100%, 0); border: none; margin-left: 1%;" aria-hidden="true" onclick = location.href="'  + nextUrl + '" ><i class="icon-arrow-right prev" style="color: white"></i></input>').insertAfter('#assignment-dropdown-button')
        $(".assignmentDetails").css("border", "none")
    }
    
    //Alright, this one is mega nasty, but it's not so bad if you take it line by line. The main purpose of the function is to query the Canvas API to get a list of all assignments in a course and add buttons to take
    //you to each cooresponding speedgrader page
    createAssignmentButtons(){
        courseID = window.location.pathname.split("/")[2]
        url = "https://suu.instructure.com/api/v1/courses/" + courseID + "/assignments"
        currentassignmentID = window.location.search.split("=")[1].split("&")[0]
        $('.assignmentDetails').append('<div id = "'+ this.classesDiv + '" style = "border: 2px solid black; border-radius: 3px; position: absolute; display: inline-block; top: 50px;  min-height: 100px; width: 220px; max-height: 20%; z-index: 10; overflow: auto;"</div>')
        
        //The API call
        response = fetch(url, {order_by: "due_at"})
        .then(response => response.json())
        .then(data => {
            //TODO: This is super chonky. See if you can split some stuff up or something
            assignments = this.getAssignmentIDs(data)
            gradedCheckMarkStatus = "    "
            for(var i = 0; i < Object.keys(assignments).length; i++){
                linkUrl = "speed_grader?assignment_id=" + assignments[i]['id']
                buttonName = assignments[i]['name']
                if(assignments[i]['id'] == currentassignmentID){
                    this.setArrowButtonAttrib(i, assignments)
                }
                if(assignments[i]['needs_grading_count'] == 0){
                    gradedCheckMarkStatus = "✓ "
                }
                if(buttonName.length >= this.charLimit){
                    buttonName = buttonName.substring(0,this.charLimit) + "..."
                }
                $('#'+this.classesDiv).append('<input type="button" style = "width: 100%; height: 35px; background-color: white; border-top: none; border-left: none; border-right: none; border-width: 2px; text-align: left;" onclick = location.href="'  + linkUrl  + '" value="' + gradedCheckMarkStatus + buttonName + '" </input> <br>')
                
            }
            //Adds hover component to buttons
            $('#' + this.classesDiv + ' input').hover(function(){
                $(this).css("background-color", '#f2f2f2')
            },function(){
                $(this).css("background-color","white")
            })
            this.addNavButtons()
        })
        $('#'+this.classesDiv).css("visibility", "hidden")
    }
    
    //Returns a dictionary of assignments considered "valid" (Only published assignments)
    getAssignmentIDs(data){
        assignments = {}
        index = 0
        for(var i = 0; i < Object.keys(data).length; i++){
            if(data[i]['published']){
                assignments[index] = data[i]
                index++
            }
        }
        return assignments
    }
    
    //Determines where the arrow buttons will take you. Could probably be a little more elegant, but it's small and I'm not too worried about it
    setArrowButtonAttrib(index, assignments){
        if(index-1 >= 0){
            this.previousAssignment = assignments[index-1]['id']
        }
        else{
            this.previousAssignment = assignments[Object.keys(assignments).length-1]['id']
        }
    
        if(index+1 < Object.keys(assignments).length ){
            this.nextAssignment = assignments[index+1]['id']
        }
        else{
            this.nextAssignment = assignments[0]['id']
        }
    }
}

