//Code is used to add assignment switching controls to Speed Grader
//Written by Bo Stevens (06/08/2021)

class AssignmentSwitcher{
    classesDiv = "classesDiv"
    charLimit = 35
    
    showingAssignments = false
    previousAssignment = null
    nextAssignment = null
    

    constructor(){
        this.main()
    }
    
    async main(){
        var courseID = window.location.pathname.split("/")[2]
        var url = "https://suu.instructure.com/api/v1/courses/" + courseID + "/assignments"
        var assignments = await AssignmentSwitcher.getAllAssignments(url, new Array())
        this.createAssignmentButtons(assignments)
        $(document).click(this.hideButtons)
    }

    //The Canvas API returns things as a paginated list. This method grabs every assignment from that list and stores it in an array
    //If this looks scary, it's because the solution here is recursive
    static async getAllAssignments(url, previousResponse){
        var assignments = new Array()
        //Calls API using url and page information
        var response = await fetch(url)
        .then(async function(response) {
            var link = response.headers.get("Link").split(',')[1]
            if(link.includes("next")){
                var nextUrl = ""
                for(var i = 1; link[i] != '>' && i < link.length; i++ ){
                    nextUrl += link[i]
                }
                previousResponse = await AssignmentSwitcher.getAllAssignments(nextUrl, previousResponse)
            }
            return response.json()
        })
        .then(data => {
            var paginatedAssignments = AssignmentSwitcher.getAssignmentIDs(data)
            console.log(paginatedAssignments)
            assignments = data
            for(var i = 0; i < previousResponse.length; i++){
                assignments.push(previousResponse[i])
            }
        })
        return assignments
    }

    //Alright, this one is mega nasty, but it's not so bad if you take it line by line. The main purpose of the function is to query the Canvas API to get a list of all assignments in a course and add buttons to take
    //you to each cooresponding speedgrader page
    createAssignmentButtons(assignments){
        var currentassignmentID = window.location.search.split("=")[1].split("&")[0]
        $('.assignmentDetails').append('<div id = "'+ this.classesDiv + '" style = "border: 2px solid black; border-radius: 3px; position: absolute; display: inline-block; top: 50px;  min-height: 100px; width: 300px; max-height: 20%; z-index: 10; overflow: auto;"</div>')
        for(var i = 0; i < assignments.length; i++){
            var gradedCheckMarkStatus = "    "
            for(var i = 0; i < Object.keys(assignments).length; i++){
                var linkUrl = "speed_grader?assignment_id=" + assignments[i]['id']
                var buttonName = assignments[i]['name']
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
        }
            
        $('#'+this.classesDiv).css("visibility", "hidden")
    }
    
    //Returns a dictionary of assignments considered "valid" (Only published assignments)
    static getAssignmentIDs(data){
        var assignments = {}
        var index = 0
        for(var i = 0; i < data.length; i++){
            if(data[i]['published']){
                assignments[index] = data[i]
                index++
            }
        }
        return assignments
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
    dropdownClicked(event){
        if(event.data.parent.showingAssignments){
            event.data.parent.showingAssignments = false
            $('#'+event.data.parent.classesDiv).css("visibility", "hidden")
        }
        else{
            event.data.parent.showingAssignments = true
            $('#'+event.data.parent.classesDiv).css("visibility", "visible")
        }
    }

    
    //Adds the buttons used to switch between previous and next assignments as well as the dropdown button
    addNavButtons(){
        var previousUrl = "speed_grader?assignment_id=" + this.previousAssignment
        var nextUrl = "speed_grader?assignment_id=" + this.nextAssignment
        $('<button id="prev-assignment-button" type="button" style = "background-color: hsla(360, 100%, 100%, 0); border: none; margin-right: 1%;" aria-hidden="true" onclick = location.href="'  + previousUrl + '"  ><i class="icon-arrow-left prev" style="color: white"></i></input>').insertBefore('.assignmentDetails')

        //This one is split in two parts because we need to be able to reference this, which can't be done in a string
        $('<button id="assignment-dropdown-button" type="button" style = "background-color: hsla(360, 100%, 100%, 0); border: none; margin-left: 1%;" aria-hidden="true"><i class="icon-mini-arrow-down" style="color: white"></i></input>').insertAfter('.assignmentDetails')
        $('#assignment-dropdown-button').click({parent: this}, this.dropdownClicked)

        $('<button id="next-assignment-button" type="button" style = "background-color: hsla(360, 100%, 100%, 0); border: none; margin-left: 1%;" aria-hidden="true" onclick = location.href="'  + nextUrl + '" ><i class="icon-arrow-right prev" style="color: white"></i></input>').insertAfter('#assignment-dropdown-button')
        $(".assignmentDetails").css("border", "none")
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

//ENTRY POINT
if(window.location.pathname.includes("gradebook")){
    new AssignmentSwitcher()

}

