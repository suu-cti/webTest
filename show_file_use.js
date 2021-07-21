//NOTE: Pages are a thing in Canvas already. Couldn't find a word to describe all of the places we're grabbing info from, so I refer to them as "Pages", which are different from Pages, which are a part of Canvas
//assignments, pages, modules, etc are all referred to as "Pages"

//This script will go through a course and grab every single "Page" that someone could have linked a file to
//It then goes through the HTML of each of the "Pages" and if it finds that a file has been linked to the "Page", adds it to a list of files
//At the end, we go through all of the files we found and all the files in the course to determine what files have and have not been used in the course
//
//If you're having trouble understanding how everything works, start by collapsing all of the functions. That might help you be able to understand control flow and things a little better
//Also, fair warning. Canvas is not standardized at all. Some of this code is just my fault, but by nature, it's going to be a little nasty
//
//Written by Bo Stevens
//07/01/2021





class ShowFileUse{
    filesUsedInCourse = {}
    allFilesInCourse = {}

    constructor(){
        if(window.location.pathname.includes('files')){
            var checkExist = setInterval(function(){
                if(document.getElementsByClassName('ef-item-row')[0] != undefined){
                    ShowFileUse.main()
                    clearInterval(checkExist)
                }
            }, 100)
        }
    }

    static main(){
        console.log("No I'm Entering my main function poop man")
        $('.ef-actions').prepend('<button class="btn btn-primary btn-scan-files"> Scan files in course </button>')
        $('.ef-directory-header').find('.ef-links-col').before('<span class="ef-occurences-col">Occurrences</span>')
        $('.ef-occurences-col').hide()
        $('.btn-scan-files').click(clickedButton)
    }
    
    //Starts Scanning the course
    //Only happens after the user clicks a button on the Files page. Scanning is pretty intensive, so I wanted to make sure only to do it when the user wanted to
    async clickedButton(){
        console.log("He clik")
    
        //Canvas stores a lot of these things differently, so I'm keeping multiple arrays for each unique way I have to handle these guys
        //Each "Page" has a different attribute that stores the HTMl I'm trying to scrape, so I specified the "Page" at the first index and the attribute we want to grab at the second
        //Make sure whateve the equivalent to id is always at the end because that's how the code will try to access it later
        var placesToScrapeDirectly = [['assignments','htm_url','description','id'],['discussion_topics','message','id']]
        var placesToScrapeViaURL = [['pages','html_url']]
        var placesToScrapeWithDateInformation = [['announcements','message','id']]
    
    
        //url to call the API from
        var courseID = window.location.pathname.split('/')[2]
        var url = "https://suu.instructure.com/api/v1/courses/" + courseID + '/pages'
        //Grabs each page from our Pages
        for(var i = 0; i < placesToScrapeViaURL.length; i++){
            var urls = await getPreliminaryContentFromPage(placesToScrapeViaURL[i], url, new Array())
        }
        //Adds each page to list of items to scrape
        for(var i = 0; i < urls.length; i++){
            placesToScrapeDirectly.push([urls[i],'body',''])
        }
    
    
        //Grabs all of our HTML content of our Modules
        //Grabs content from all of our "Pages"
        for(var i = 0; i < placesToScrapeDirectly.length; i++){
            var url = "https://suu.instructure.com/api/v1/courses/" + courseID + '/' + placesToScrapeDirectly[i][0]
            await getContentFromPage(placesToScrapeDirectly[i], url, courseID)
        }
    
        var date = getDate()
        url = "https://suu.instructure.com/api/v1/" + placesToScrapeWithDateInformation[0][0]  + "?" + 'context_codes[]=course_' + window.location.pathname.split('/')[2] +'&start_date=2011-01-01' + '&end_date=' + date
        await getContentFromPage(placesToScrapeWithDateInformation[0], url, courseID)
        
    
        //Grabbing all files in the course regardless of whether or not they're used
        var url = "https://suu.instructure.com/api/v1/courses/" + courseID + '/files'
        allFilesInCourse = await getFilesFromCourse(url, new Array())
    
        await handleModules(courseID)
    
        $('.ef-occurences-col').show(200)
        
        compareAllFilesToFilesUsed()
    }
    
    //Modules are stored a little differently than the other Page types, so I just put most of the logic here in this method. It reconverges with the standard approach at getFileNamesFromLinks
    async handleModules(courseID){
    
        //Alright, this function is a little dense because we have to query each of the modules, then query for the content inside of them
        var url = "https://suu.instructure.com/api/v1/courses/" + courseID + '/modules'
    
        response = await fetch(url)
        .then(response => response.json())
        .then(async function(data){
            for(var i = 0; i < data.length; i++){
                innerResponse = await fetch(data[i]['items_url'])
                .then(innerResponse => innerResponse.json())
                .then(data => {
                    for(var x = 0; x < data.length; x++){
                        if(data[x]['url'] != null){
                            if(data[x]['url'].includes('files')){
                                getFileNamesFromLinks('"' + data[x]['url'] + '"', 0, 8, url)
                            }
                        }
                    }
                })
            }
        })
    }
     
    //Calls the API to grab every single file from the course regardless of whether or not it is used. Because it's paginated, we have to do this recursively, which is why this is a little gross
    //Gotta keep making the call until there are no more resources to grab
    async getFilesFromCourse(url, previousResponse){
        files = new Array()
        //Calls API using url and page information
        response = await fetch(url)
        .then(async function(response) {
            var link = response.headers.get("Link").split(',')[1]
            if(link.includes("next")){
                var nextUrl = ""
                for(var i = 1; link[i] != '>' && i < link.length; i++ ){
                    nextUrl += link[i]
                }
                previousResponse = await getFilesFromCourse(nextUrl, previousResponse)
            }
            return response.json()
        })
        .then(data => {
            files = data
            for(var i = 0; i < previousResponse.length; i++){
                files.push(previousResponse[i])
            }
        })
        return files
    }
    
    //Used primarily for Pages. To get the html, we need to query each page individually, so this grabs each of those and puts them into an array to query in getContentFromPage
    //Also uses recursion to handle pagination
    async getPreliminaryContentFromPage(pageType, url, previousResponse){
    
        //Stores urls
        var urls = new Array()
    
        //url to call the API from
        var courseID = window.location.pathname.split('/')[2]
    
        //The API call
        response = await fetch(url)
        .then(async function(response){
            var link = response.headers.get("Link").split(',')[1]
            if(link.includes("next")){
                var nextUrl = ""
                for(var i = 1; link[i] != '>' && i < link.length; i++ ){
                    nextUrl += link[i]
                }
                previousResponse = await getPreliminaryContentFromPage(pageType, nextUrl, previousResponse)
            }
            return response.json()
        })
        .then(data => {
            //Grabs the url to each page and pushes it to the urls array
            for(var i = 0; i < data.length; i++){
                tempURL = data[i][pageType[1]].split('/')
                urls.push(pageType[0] + '/' + tempURL[tempURL.length-1])
            }
            for(var i = 0; i < previousResponse.length; i++){
                urls.push(previousResponse[i])
            }
        })
        return urls
    }
    
    //Gets the objects for each of the types of "Pages"(assignments, quizzes, discussions, etc)
    //Pagination ruins everything, so this method acts recursively as well
    async getContentFromPage(location, url, courseID){
        //Calls API using url
    
        response = await fetch(url)
        .then(async function(response){
            if(response.headers.get("Link") != null){
                var link = response.headers.get("Link").split(',')[1]
                if(link.includes("next")){
                    var nextUrl = ""
                    for(var i = 1; link[i] != '>' && i < link.length; i++ ){
                        nextUrl += link[i]
                    }
                    await getContentFromPage(location, nextUrl)
                }
                return response.json()
            }
            else{
                return response.json()
            }
        })
        .then(data => {
            if(data != undefined){
                getHTMLFromContent(data, location, url, courseID)
            }
        })
    }
    //Gets the HTML content for each of the "Pages"
    //Also converts our api url to the url of the actual "page" we're looking at
    //url is passed to keep track of where the content was found
    getHTMLFromContent(content, location, url, courseID){
    
        //Extra content in this case basically just refers to the extra garbage that gets sent along with announcements
        url = removeExtraLinkContent(url, courseID)
    
        //If there is no length, then we don't need to use a loop because we don't have an array (This is here because we have to grab individual pages, which returns a single object instead of an array)
        if(content.length == undefined){
            //We aren't adding the id here like we are below because urls for pages are sent as is and don't need to be edited
            getLinksFromHTML(content[location[1]], url)
        }
    
        //If we do have an array, we loop through it and grab the html from each object
        for(var i = 0; i < content.length; i++){
            
            var id = content[i][location[location.length-1]]
            if(content[i][location[1]] == null){
                getLinksFromHTML(content[i][location[2]], url + '/' + id) 
            }
            else{
                getLinksFromHTML(content[i][location[1]], url + '/' + id)
            }
        }
    }
    
    //It says removeLinkContent but this method is pretty much exclusively for dealing with announcements because their api links are really mangled compared to their real links
    //Method essentially just reformats the url to a format that will take you to the correct page when pasted into a browser
    removeExtraLinkContent(url, courseID){
        if(url.includes('announcements')){
            console.log(url)
            var newURL = url.slice(0,url.indexOf('announcements')) + 'courses/' + courseID + '/discussion_topics'
            console.log(newURL)
            return newURL
    
        }
        else{
            return url
        }
    }
    //Searches the HTML for any links to files in our course
    //pageURL now refers to the actual hyperlink of the "page"
    getLinksFromHTML(content, pageURL){
        if(content != null){
            var position = content.indexOf('href')
            while(position !== -1){
                getFileNamesFromLinks(content, position, 6, pageURL)
                position = content.indexOf('href', position + 1)
            }
        
            position = content.indexOf('src')
            while(position !== -1){
                getFileNamesFromLinks(content, position,6, pageURL)
                position = content.indexOf('src', position+1)
            }
        }
    }
    
    //Searches through the link for the name of our file and saves it and the number of times it has shown up into a dictionary. 
    //idLocation refers to where in the string the fileID is located. Unfortunately, some links have it in different positions, so we need to keep track of this
    getFileNamesFromLinks(content, position, idLocation, pageURL){
        //Links are formatting like src="linkNameHere.com". This first loop reads through everything on the left hand we don't care about, so we end up with linkNameHere.com"
        while(content.charAt(position) != '"'){
            position++
        }
    
        position++
        var tempString = ""
    
        while(content.charAt(position) != '"'){
            tempString += content.charAt(position)
            position++
        }
        if(tempString.startsWith('https://suu.instructure.com')){
            //Just grabbing the fileID from the link we just got
            var fileID = getFileIDFromName(tempString, idLocation)
    
            //When we declare the dictionary, we don't know the types, so the first time we're adding something to the dictionary, we use = and subsequent times we can use += now that we have a set data type
            //I created a dictionary in a dictionary here because for each file, I want to keep track of multiple pieces of data (Occurences of that file in the course and an array of links showing where the file is used)
            if(filesUsedInCourse[fileID] != null){
                filesUsedInCourse[fileID]['occurences'] += 1
                filesUsedInCourse[fileID]['links'].push(pageURL)
            }
            else{
                filesUsedInCourse[fileID] = {}
                filesUsedInCourse[fileID]['links'] = new Array()
                filesUsedInCourse[fileID]['occurences'] = 1
                filesUsedInCourse[fileID]['links'].push(pageURL)
            }
        }
    
    }
    
    //Returns the ids of each of the files by scraping them from the links
    getFileIDFromName(link, idLocation){
        var tempResult = link.split('/')[idLocation]
        var fileID = ""
        var index = 0
        if(tempResult != null){
            //There's going to be some extra garbage at the end of our link that we want to trim off. We know where to cut off the string when we hit a ? or a /
            while(tempResult[index] != "/" && tempResult[index] != "?" && index < tempResult.length){
                fileID += tempResult[index]
                index++
            }
        }
        return fileID
    }
    
    //Compares our list of files used by the course and list of all files in the course total and compares them to show us at the end which files are and are not used by the course
    //Also downloads the csv of our data
    compareAllFilesToFilesUsed(){
        //Stores all of the divs so we can insert our data back into the webpage
        htmlItems = $('.ef-item-row').find('.ef-links-col')
        let csvContent = "File Name, Occurrences, Links\n"
        for(var i = 0; i < Object.keys(allFilesInCourse).length; i++){
            csvContent += csvContentFromData(i)
        }
    
    
        //Handles downloading the csv
        console.log(csvContent)
        var encodedUri = encodeURI(csvContent)
        var link = document.createElement('a')
        link.href = "data:text/csv;charset=utf-8," + encodedUri
        link.target = '_blank'
        link.setAttribute('download','course_data.csv')
        link.click()
    }
    
    //Takes the data we already gathered and puts it in a csv friendly format and returns it as a string
    //Takes in the index of which file we're looking at
    csvContentFromData(index){
        if(filesUsedInCourse[allFilesInCourse[index]['id']] != null){
            var tempString =  allFilesInCourse[index]['display_name'] + ',' + filesUsedInCourse[allFilesInCourse[index]['id']]['occurences'] + ',\"'
            
            //A file can be used in many different places. This will loop through all of those and add those links to our string
            //The if statement is there so I don't insert a newline character if I'm at the last link in the list
            for(var i = 0; i < filesUsedInCourse[allFilesInCourse[index]['id']]['links'].length; i++){
                tempString += filesUsedInCourse[allFilesInCourse[index]['id']]['links'][i].replace('/api/v1', '')
                if(filesUsedInCourse[allFilesInCourse[index]['id']]['links'].length - i > 1){
                    tempString +=  '\n'
                }
            }
            tempString += '\"\n'
            
            return tempString
        }
        else{
            return allFilesInCourse[index]['display_name'] + ',' + '0\n'
        }
    }
    
    
    //To get all of our modules, we need to specify a date range
    //Method returns the current date
    getDate(){
        const d = new Date()
        var date = ""
        date += d.getFullYear() + "-"
        if(d.getMonth() < 10){
            date += "0" + (d.getMonth() +1)
        }
        else{
            date += (d.getMonth() +1)
        }
        date += "-"
        if(d.getDate() < 10){
            date += "0" + d.getDate()
        }
        else{
            date += d.getDate()
        }
        return date
    }
}

new ShowFileUse()

