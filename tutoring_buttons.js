//
///Adds tutoring help buttons to specific classes
//


class TutoringButtons{

    tutoringID = "tutoring_buttons"
    constructor(){
        var classDictionary = this.generateDictionary()
        var documentTitle = document.title.split("-")
        var title = documentTitle[0];
        var buttonText = documentTitle[0] + "-" + documentTitle[1]
        //buttonText = classDictionary[title][1] + buttonText + "?"
        if(classDictionary[title]){
            $('.Sidebar__TodoListContainer').before('<div id="' + this.tutoringID + '" style="background-color: #F4F4F4; border: 2px solid #E7E7E7; padding-bottom: 0.5%"> </div>')
            $('#'+this.tutoringID).append('<p style = "border-bottom: 2px solid #E7E7E7; background-color: #E7E7E7; font-size: 1.5em; text-align: center; margin-bottom: 4%; " >' + buttonText + ' Help</p>')
            for(var i = 0; i < classDictionary[title].length; i++){
                $('#'+this.tutoringID).append('<a class="Button Button--primary Button--block" style = "margin-bottom: 0.5%; width: 90%; margin-left: auto; margin-right: auto;" href="'+ classDictionary[title][i][0] +'" >' + classDictionary[title][i][1] + ' </a>')
            }
        }
    }


    generateDictionary(){
        //Writing Center
        var wc = ["https://www.suu.edu/writingcenter/", "Tutoring"]

        //Tutoring Center
        var tc = ["https://www.suu.edu/academicsuccess/tutoring/", "Writing"]

        //Speech and Presentation Center
        var sc = ["https://www.suu.edu/speech-center/", "Speech And Presentaion"]

        //English as a Second Language Center
        var eslc = ["https://www.suu.edu/alcc/resources.html", "English as a Second Language"]


        
        var classDictionary = {
            "ACCT" : [tc],
            "AGSC" : [wc],
            "ANTH" : [wc,sc],
            "ART"  : [wc],
            "ARTH" : [wc],
            "AA"   : [wc,sc],
            "AT"   : [wc],
            "AMTA" : [],
            "BIOL" : [tc,wc],
            "BA"   : [wc,sc],
            "ANLY" : [],
            "BE"   : [sc],
            "CCET" : [wc],
            "CHEM" : [tc],
            "CHIN" : [],
            "COMM" : [wc,sc],
            "CS"   : [tc],
            "CSIS" : [tc],
            "CM"   : [wc],
            "CJ"   : [wc,sc],
            "CSIA" : [wc],
            "DANC" : [wc],
            "ECED" : [wc],
            "ECON" : [tc,wc],
            "EDUC" : [wc,sc],
            "EDPD" : [wc,sc],
            "EET"  : [tc],
            "ELED" : [wc],
            "EDRG" : [wc],
            "ENGR" : [tc],
            "ENGL" : [tc,wc],
            "FESL" : [eslc],
            "IEP"  : [eslc],
            "EESL" : [eslc],
            "ENTR" : [wc,sc],
            "FLHD" : [tc,wc],
            "FIN"  : [tc],
            "FREN" : [tc],
            "GS"   : [wc,sc],
            "GEOG" : [wc],
            "GEO"  : [wc],
            "GERM" : [],
            "GREK" : [],
            "HIST" : [tc,wc,sc],
            "HONR" : [wc,sc],
            "HRHM" : [wc,sc],
            "HU"   : [wc,sc],
            "HSS"  : [wc,sc],
            "INFO" : [wc],
            "IS"   : [tc],
            "IELG" : [],
            "IELP" : [],
            "INDS" : [wc,sc],
            "KIN"  : [wc],
            "Lang" : [],
            "LEGL" : [wc,sc],
            "LM"   : [wc,sc],
            "MGMT" : [wc,sc],
            "MKTG" : [wc,sc],
            "MATH" : [tc],
            "AERO" : [],
            "MILS" : [],
            "MUSC" : [wc],
            "MUED" : [wc,sc],
            "NR"   : [wc,sc],
            "NURS" : [wc,sc],
            "NFS"  : [tc],
            "ORPT" : [wc],
            "PVA"  : [wc,sc],
            "PHIL" : [tc,wc],
            "PE"   : [wc],
            "PSCI" : [],
            "PHYS" : [tc],
            "PILT" : [],
            "POLS" : [wc,sc],
            "PLA"  : [wc],
            "PRDV" : [wc,sc],
            "PSY"  : [wc,sc],
            "PADM" : [sc],
            "RANG" : [wc,sc],
            "SCI"  : [wc,sc],
            "SCED" : [wc,sc],
            "SOSC" : [wc,sc],
            "SOC"  : [wc,sc],
            "SPAN" : [tc],
            "SPED" : [wc,sc],
            "SUU"  : [wc,sc],
            "STCH" : [],
            "TESL" : [eslc],
            "TECH" : [],
            "THEA" : [wc],
            "WGS"  : [wc,sc]
        }
        return classDictionary
    }
}

if(window.location.pathname.includes("courses")){
    new TutoringButtons()
}
