class HideInactives{
    checkboxID = "hide-inactives-checkbox"
    originalTableRows = new Array()
    

    constructor(){
        //Entry Point. There is a delay here because the table of students loads in after you've made it to the page
        if(window.location.pathname.includes("courses") && window.location.pathname.includes("users")){
            var checkExist = setInterval(function(){
                if(document.getElementsByTagName('table')[0] != undefined){
                    this.main()
                    clearInterval(checkExist)
                }
            }, 100)
        }
    }

    
    
    main(){
        console.log("Entering main")
            $('.v-gutter').prepend('<div id ="inactive-users" style="display: inline-block; width: 100%"> </div>')
            $('#inactive-users').prepend('<span style="font-size: 1.3em;"> Show Inactive Users <input id ="'+ checkboxID +'" type = "checkbox" checked> </input> </span>')
            $('#'+checkboxID).click(boxClicked)
    }
    
    //Behavior for when our checkbox is clicked
    boxClicked(){
        checked = $('#'+checkboxID).is(":checked")
        if(checked){
            showEntries()
        }
        else{
            removeEntries()
        }
        
    }
    
    //Removes all students who are inactive and saves them into an array to be inserted back in when the checkbox is ticked
    removeEntries(){
        table = document.getElementsByTagName('table')[0]
        rows = table.rows
    
        indicesToRemove = new Array()
    
        for(var i = 0; i < rows.length; i++){
            cellData = rows[i].cells[1]
            originalTableRows.push(rows[i])
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
        newTable = document.createElement("table")
        newTable.className = "roster ic-Table ic-Table--hover-row ic-Table--condensed ic-Table--striped"
        $('table').replaceWith(newTable)
        for(var i = 0; i < originalTableRows.length; i++){
            $('table').append(originalTableRows[i])
        }
    }
}

new HideInactives()



