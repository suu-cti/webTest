

//Allows professors to add custom un-graded knowledge checks to their pages for students to use
//ENTRY POINT AT BOTTOM!
//Written By: Bo Stevens (6/17/21)
var kcTagPrefix = "knowledge_check_"
var kcTag = "." + kcTagPrefix





class ParentQuestion{
    questionData = null
    lightGreen = ""
    lightRed = ""
    green = ""
    red = ""
    constructor(questionData){
        this.questionData = questionData

        $(questionData).prepend('<div class = "checkbox"> <p>✓</p> </div>')

        var questionTitle = questionData.find(kcTag + 'question_title')
        var questionContent = questionData.find(kcTag + 'question_content')
        var questionCheckbox = questionData.find('.checkbox')

        questionTitle.css('font-size', '1.25em')
        questionTitle.css('border-bottom', '1px solid black')
        questionTitle.css('background-color','#f7f7f7')
        questionTitle.css('margin','0px')
        questionTitle.css('padding-left','5px')
        questionTitle.css('padding-top','5px')
        questionTitle.css('font-weight','bold')
        questionTitle.css('border-radius','5px 10px 0px 0px')


        questionContent.css('padding', '1.1% 1.1% 1.1% 1.25%')
        questionData.removeAttr('style')
        questionData.css('border','1px solid #3d3d3d')
        questionData.css('border-radius','5px 10px 5px 10px')
        questionData.css('margin-bottom','20px')
        questionData.css("width", "70%")
        questionData.find(kcTag + 'question_text').css('font-size', '1.15em')
        questionData.find(kcTag + 'question_text').css('margin-top', '0px')
        questionData.find(kcTag + 'question_text').css('margin-bottom', '10px')

       questionData.find('.text').each(function(){
           $(this).find('.test').find('span').css('font-size','1.05em')
       })


        questionCheckbox.css('float','right')
        questionCheckbox.css('color','green')
        questionCheckbox.css('font-size','1.25em')
        questionCheckbox.css('font-weight','bold')
        questionCheckbox.css('margin-right', '10px')
        questionCheckbox.find('p').css('margin-top', '0px')
        questionCheckbox.hide()

        this.lightGreen = "#daffd6"
        this.lightRed = '#fadbdb'
        this.red = "#e60000"
        this.green = "#009903"
    }

    //Pulls out each individual question or question component from the HTML
    dataFromHTML(name){
        var objectRef = this
        $(this.questionData).find(kcTag + name).each(function(){
            objectRef.removeEditorContent($(this))
            objectRef.questionFromHTML($(this))
        })
    }

    getParameterFromQuestion(question, index, parameterArray){
        index++
        var parameterAttributes = new Array()
        var tempText = ""
        for(index; question[index] != ']' && index < question.length; index++){
            if(question[index] != ','){
                tempText += question[index]
            }
            else{
                tempText = 
                parameterAttributes.push(tempText.toLowerCase().trim())
                tempText = ""
            }
        }
        parameterAttributes.push(tempText.toLowerCase().trim())
        parameterArray.push(parameterAttributes)
        
        return index
    }

    removeEditorContent(element){
        $(element).removeAttr('style')
        $(element).find('.text').find('h4').remove()
        $(element).find('.feedback').find('h4').remove()
        $(element).find('.options').find('h4').remove()
        $(element).find('.equation').find('h4').remove()
        $(this.questionData).find('.editorText').find('h4').remove()

        
        $(element).removeAttr('style')
        $(this.questionData).find('.editorText').removeAttr('style')
        $(kcTag + 'question_text').css({'background-color': '', 'width': '', 'border' : '', 'margin-left': '', 'padding-left' : ''})
        $(kcTag + 'spacer').remove()
        //$(element).find('.options').remove()

        $(element).children().each(function(){
            $(this).removeAttr('style')
            $(this).children().each(function(){
                $(this).removeAttr('style')
            })
        })
    }

    questionAnsweredCorrect(){
        $(this.questionData).find('.checkbox').show(200)
        $(this.questionData).css('background-color', '#f5f5f5')
    }
}

//TODO: ALL CLASSES NEED TO BE MOVED TO THEIR OWN FILES. THEY ARE ONLY LIKE THIS FOR TESTING!
class MultipleChoiceQuestion extends ParentQuestion{
    
    choices = new Array()
    constructor(questionData){
        super(questionData)
        this.dataFromHTML('choice')
    }

    //Creates our question from the HTML
    questionFromHTML(element){
        this.removeEditorContent(element)
        element.find('.feedback').css('color','grey')
        element.find('.feedback').css('margin-left','10px')
        element.find('.feedback').hide()
        $(element).find('.text').css('border-top','hsla(0, 0%, 0%, 0.25) 1px solid')
        $(element).find('.text').css('border-top','hsla(0, 0%, 0%, 0.25) 1px solid')
        $(element).find('.text').css('margin-bottom','4px')
        $(element).find('.text').css('margin-top','4px')
        $(element).find('.text').prepend('<input type="checkbox" style="margin-right: 2.5%;">')

        var parent = this

        $(element).find('.text').on('change',function(){
            //,{parent: this, element: element}, 
            console.log("Clicked")
            parent.onClick(element)
        })

        $(element).find('.text').keydown(function(e){
            var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            if(key == 13){
                $(element).find('.text input').prop('checked', !$(element).find('.text input').prop('checked'))
                parent.onClick(element)
            }
        })
    }

    //Question Behavior on Click
    onClick(element){
        if($(element).attr('data-answer') != null){
            $(element).find('.text').css('color',this.green)
            this.questionAnsweredCorrect()
            if(! $(element).find('.feedback').text().includes("N/A")){
                $(element).find('.feedback').show(200)
            }
        }
        else{
            if(!$(element).find('.feedback').is(":hidden")){
                $(element).find('.feedback').hide(200)
                $(element).find('.text').css('color','black')
            }
            else{
                $(element).find('.feedback').show(200)
                $(element).find('.text').css('color',this.red)
            }
            
        }
    }
}

class SelectAllCorrect extends ParentQuestion{
    numAnswers = 0
    questionsAnswered = 0
    constructor(questionData){
        super(questionData)
        this.dataFromHTML('choice')
    }

    questionFromHTML(element){
        console.log("Running")
        element.find('.feedback').css('color','grey')
        element.find('.feedback').css('margin-left','10px')
        element.find('.feedback').hide()
        if($(element).attr('data-answer') != null){
            this.numAnswers++
        }

        $(element).find('.text').css('margin-bottom','4px')
        $(element).find('.text').css('margin-top','4px')
        $(element).find('.text').css('border-top','hsla(0, 0%, 0%, 0.25) 1px solid')
        $(element).find('.text').find('span').prepend('<input type="checkbox" style="margin-right: 2.5%;">')

        var parent = this

        $(element).find('.text').on('change',function(){
            parent.onClick(element)
        })

        $(element).find('.text').keydown(function(e){
            var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            if(key == 13){
                $(element).find('.text input').prop('checked', !$(element).find('.text input').prop('checked'))
                parent.onClick(element)
            }
        })
    }

    onClick(element){
        if(element.attr('data-answer') != null){
            $(element).css('color','green')
            this.questionsAnswered += 1
            if(this.questionsAnswered >= this.numAnswers){
                this.questionAnsweredCorrect()
            }

            if(! $(element).find('.feedback').text().includes("N/A")){
                $(element).find('.feedback').show(200)
            }
        }
        else{
            if($(element).find('.feedback').is(":hidden")){
                $(element).find('.text').css('color','red')
                $(element).find('.feedback').show(200)
            }
            else{
                $(element).find('.text').css('color','black')
                $(element).find('.feedback').hide(200)
            }
        }
    }
}

class FillInBlankQuestion extends ParentQuestion{
    answers = new Array()
    boolArrForQuestionsAnswered = new Array()

    constructor(questionData){
        super(questionData)
        this.dataFromHTML('question')
        this.formatAnswers()
    }

    //Takes an HTML class as an argument and scrapes out all of the data we need to display the finished question
    questionFromHTML(element){
        element.find('.feedback').css('color','grey')
        element.find('.feedback').css('margin-left','10px')
        element.find('.feedback').hide()
        //After we grab the data from the original version, we remove it from the HTML to replace it later on
        var question = $(element).find('.text').find('p').html()
        $(element).find('.text').remove()
        var questionContent = this.getQuestionText(question)
        this.displayContent(element, questionContent)
    }

    //Takes in the actual question part of our question and scrapes out the question text and answer
    //Since we're going to have multiple spans in our HTML when we reinsert everything (it'll look like this: <span><input><span>) we store our text in an array
    getQuestionText(question){
        var questionContent = new Array()
        var tempText = ""
        for(var i = 0; i < question.length; i++){
            if(question[i] != '['){
                tempText += question[i]
            }
            //Not the best place to do it, but since our answers are lodged into the text, this is where we are going to start pulling that out from. getParameterFromQuestion increments and returns our index
            //which is why we set i = this.getAnswer()
            else{
                questionContent.push(this.createSpan(tempText))
                tempText = ""
                i = this.getParameterFromQuestion(question, i, this.answers)
                questionContent.push(this.createInput())
                this.boolArrForQuestionsAnswered.push(false)
            }
        }
        questionContent.push(this.createSpan(tempText))
        return questionContent
        
    }

    createSpan(text){
        var element = document.createElement('span')
        element.innerHTML = text
        return element
    }

    createInput(){
        var element = document.createElement('input')
        element.type = "text"
        element.style = "width: 100px;"
        return element
    }

    answerIndex = 0
    displayContent(location, content){
        for(var i = 0; i <content.length; i++){
            $(location).append(content[i])
            if(content[i].nodeName == "INPUT"){
                $(content[i]).on("change", {parent: this, questionIndex: this.answerIndex, questionAnsweredArr: this.boolArrForQuestionsAnswered, element: location, answer: this.answers[this.answerIndex], question: content[i]},this.checkAnswer)
                this.answerIndex ++
            }
        }

        var feedback = $(location).find('.feedback')
        feedback.remove()
        $(location).append(feedback)
        feedback.hide()
    }

    //This method is here because when inputting the answers, comma placement and white space could theoretically be all over the place. For example [num1 ,num2] [num1, num2] [ num ,     num2]
    //This just strips out all of that nasty white space and cleans things up so we don't have to worry about answers being improperly formatted
    formatAnswers(){
        for(var i = 0; i < this.answers.length; i++){
            for(var x = 0; x < this.answers[i].length; x++){
                this.answers[i][x] = this.answers[i][x].trim()
            }
        }
    }

    checkAnswer(event){
        if(event.data.answer.includes(event.data.question.value.toLowerCase())){
            $(event.data.question).css('background-color', event.data.parent.lightGreen)



            $(event.data.element).find('.feedback').hide(200)
            event.data.questionAnsweredArr[event.data.questionIndex] = true
            //TODO: This checks if we've answered everything. It's over convoluted
            var questionFinished = true
            for(var i = 0; i < event.data.questionAnsweredArr.length; i++){
                if(event.data.questionAnsweredArr[i] == false){
                    questionFinished = false
                    break
                }
            }
            if(questionFinished){
                event.data.parent.questionAnsweredCorrect()
            }
            
        }
        else{
            if(! $(event.data.element).find('.feedback').text().includes("N/A")){
                $(event.data.element).find('.feedback').show(200)
                //$(event.data.element).find('.feedback').show(200)
            }
           
            $(event.data.question).css('background-color', event.data.parent.lightRed)
        }
    }

}

class EquationQuestionParameter{
    name = ""
    minValue = 0
    maxValue = 0
    value = 0
    constructor(parameters){
        //Auto fills parameter array with zeros in the event that anything hasn't been filled out to avoid crashing and errors
        for(var i = 0; i < 4; i++){
            if(i >= parameters.length){
                parameters.push(0)
            }
        }
        
        this.name = parameters[0]
        this.minValue = parseFloat(parameters[1])
        this.maxValue = parseFloat(parameters[2])
        this.value = (Math.random() * (this.maxValue-this.minValue) + this.minValue).toFixed(parameters[3])
    }
}

class EquationQuestion extends ParentQuestion{
    parameters = new Array()
    elementsToDisplay = new Array()
    correctAnswerThreshold = 0.1
    decimalPlacesToRoundAnswer = 1
    answer = 0
    feedback = null
    
    constructor(questionData){
        super(questionData)
        this.dataFromHTML('question')
        this.equationFromHTML()
        this.displayQuestion()
    }

    questionFromHTML(element){
        element.find('.feedback').css('color','grey')
        element.find('.feedback').css('margin-left','10px')
        element.find('.feedback').hide()

        var questionText = $(element).find('.text').html()

        $(element).find('.text').remove()
        this.feedback = $(element).find('.feedback')
        this.feedback.css('color','grey')
        this.feedback.css('margin-left','10px')
        this.feedback.remove()
        this.correctAnswerThreshold = parseFloat($(element).find('.acceptablerange').html())
        this.decimalPlacesToRoundAnswer = parseFloat($(element).find('.decimalplaces').html())
        $(element).find('.options').find('.acceptablerange').remove()
        $(element).find('.options').find('.decimalplaces').remove()
        this.parseDataFromQuestionText(questionText)
    }

    parseDataFromQuestionText(question){
        var parameterData = new Array()
        var textData = new Array()
        var tempText = ""
        for(var i = 0; i < question.length; i++){
            if(question[i] != '['){
                tempText += question[i]
            }
            else{
                textData.push(tempText)
                tempText = ""
                i = this.getParameterFromQuestion(question, i, parameterData)
                this.parameters.push(new EquationQuestionParameter(parameterData[parameterData.length-1]))
                textData.push(this.parameters[this.parameters.length-1].value)
            }
        }
        textData.push(tempText)
        this.elementsToDisplay = textData
    }

    equationFromHTML(){
        var equation = $(this.questionData).find('.equation').text()
        $(this.questionData).find('.equation').remove()
        for(var i = 0; i < this.parameters.length; i++){
            equation = equation.replace(this.parameters[i].name, this.parameters[i].value)
        }
        this.answer = eval(equation).toFixed(this.decimalPlacesToRoundAnswer)
    }

    displayQuestion(){
        var divToAppend = this.questionData.find(kcTag + 'question_content')
        for(var i = 0; i < this.elementsToDisplay.length; i++){
            divToAppend.append('<span>' + this.elementsToDisplay[i] + '</span>')
        }
        var input = document.createElement('input')
        input.type = "text"
        divToAppend.append('<br>')
        divToAppend.append(input)
        divToAppend.find(input).on("change",{element: input, parent: this}, this.checkAnswer)
        divToAppend.append(this.feedback)
        divToAppend.find(this.feedback).hide()
    }

    checkAnswer(event){
        if(Math.abs(event.data.element.value - event.data.parent.answer).toFixed(event.data.parent.decimalPlacesToRoundAnswer+2) <= event.data.parent.correctAnswerThreshold){
            $(event.data.element).css('background-color', event.data.parent.lightGreen)
            event.data.parent.questionData.find('.feedback').hide(200)
            event.data.parent.questionAnsweredCorrect()
        }
        else{
            $(event.data.element).css('background-color',event.data.parent.lightRed)
            event.data.parent.questionData.find('.feedback').show(200)
        }
        
    }
}

var kcQuestionTypes = {'multiple_choice': MultipleChoiceQuestion,'fill_in_blank' : FillInBlankQuestion, 'select_all': SelectAllCorrect, 'solve_from_equation': EquationQuestion}

//Not a fan of this, but we need this function because javascript won't realize you're trying to instantiate a class from a dictionary, so it has to be sent as a variable to work
function createClass(className, data){
    new className(data)
}


//Entry Point
if(window.location.pathname.includes("pages")){
    for(var question in kcQuestionTypes){
        questionString = kcTag + question
        questions = $(questionString).each(function(i){
            createClass(kcQuestionTypes[question],$(this))
        });
    }
}