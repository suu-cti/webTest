class HideInactives{
    static checkboxID = "hide-inactives-checkbox"
    static originalTableRows = new Array()
    

    constructor(){
        // Entry Point. There is a delay here because the table of students loads in after you've made it to the page
        if(window.location.pathname.includes("courses") && window.location.pathname.includes("users")){
            var checkExist = setInterval(function(){
                if(document.getElementsByTagName('table')[0] != undefined){
                    clearInterval(checkExist)
                    HideInactives.main()
                }
            }, 100)
        }
    }

    
    
    static main(){
        console.log("Entering main")
        $('.v-gutter').prepend('<div id ="inactive-users" style="display: inline-block; width: 100%"> </div>')
        $('#inactive-users').prepend('<span style="font-size: 1.3em;"> Show Inactive Users <input id ="'+ HideInactives.checkboxID +'" type = "checkbox" checked> </input> </span>')
        $('#'+HideInactives.checkboxID).click(HideInactives.boxClicked)
    }
    
    //Behavior for when our checkbox is clicked
    boxClicked(){
        var checked = $('#'+HideInactives.checkboxID).is(":checked")
        if(checked){
            HideInactives.showEntries()
        }
        else{
            HideInactives.removeEntries()
        }
        
    }
    
    //Removes all students who are inactive and saves them into an array to be inserted back in when the checkbox is ticked
    removeEntries(){
        var table = document.getElementsByTagName('table')[0]
        var rows = table.rows
    
        var indicesToRemove = new Array()
    
        for(var i = 0; i < rows.length; i++){
            var cellData = rows[i].cells[1]
            HideInactives.originalTableRows.push(rows[i])
            if(cellData.querySelector('span') != null){
                indicesToRemove.push(i)
            }
        }
        for(var i = indicesToRemove.length-1; i >= 0; i--){
            rows[indicesToRemove[i]].remove()
        }
    }
    
    //Recreates our table and shoves all of our original rows inside of it
    showEntries(){
        var newTable = document.createElement("table")
        newTable.className = "roster ic-Table ic-Table--hover-row ic-Table--condensed ic-Table--striped"
        $('table').replaceWith(newTable)
        for(var i = 0; i < HideInactives.originalTableRows.length; i++){
            $('table').append(HideInactives.originalTableRows[i])
        }
    }
}

new HideInactives()



