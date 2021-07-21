//Grabs the position values of all quiz questions when user has navigated to edit page

//the table displaying our files loads in after the rest of the page, so we have to wait until it exists
if(window.location.pathname.includes('files')){
    var checkExist = setInterval(function(){
        if(document.getElementsByClassName('ef-item-row')[0] != undefined){
            clearInterval(checkExist)
            main()
        }
    }, 100)
}

function main(){

    
    //Grabbing the course and quiz IDs from the URL
    pageURL = window.location.pathname.split('/')
    courseID = pageURL[2]
    files = new Array()

    //Calls API
    getFilesFromAPI(files, courseID)

    //Adds checkboxes and trashcan to page
    appendInput(files)
}

function getFilesFromAPI(files, courseID){
    //Making the API call
    url = "https://suu.instructure.com/api/v1/courses/" + courseID + "/files/"
    response = fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        for(var i = 0; i < data.length; i++){
            files.push([data[i]['id'],false])
        }
        console.log(files)
    })
}

function appendInput(files){
    var index = 0
    $(".ef-directory-header").append("<input type='checkbox'> </input>").click({files: files},deleteFiles)
    $(".ef-item-row").each(function(){
        $(this).css("bacground-color","green")
        $(this).append("<input type='checkbox'> </input>").click({files: files, index: index},setFileToDelete)
        index++
    })
}

function setFileToDelete(event){
    event.data.files[event.data.index][1] = true
    console.log("Deleting")
}

function deleteFiles(event){
    for(var i = 0; i < event.data.files.length; i++){
        if(event.data.files[i][1] == true){
            console.log(event.data.files[i][0])
            console.log(typeof(event.data.files[i][0]))
            var url = "https://suu.instructure.com/api/v1/files/" + event.data.files[i][0]
            console.log(url)
            fetch(url).then(res=>console.log(res))
            fetch(url, {
                method: 'DELETE',
                headers:{
                    'Authorization': ""
                }
            }).then(res =>console.log(res))
        }
    }

    
}
