console.log("Third party scripts running")
////////////////////////////////////////////////////
// DESIGN TOOLS CONFIG                            //
////////////////////////////////////////////////////
// Copyright (C) 2017  Utah State University
var DT_variables = {
    iframeID: '',
    // Path to the hosted USU Design Tools
    path: 'https://designtools.ciditools.com/',
    templateCourse: '512808',
    // OPTIONAL: Button will be hidden from view until launched using shortcut keys
    hideButton: false,
 // OPTIONAL: Limit by course format
limitByFormat: false, // Change to true to limit by format
// adjust the formats as needed. Format must be set for the course and in this array for tools to load
formatArray: [
            'online',
            'on-campus',
            'blended'
    ],
    // OPTIONAL: Limit tools loading by users role
    limitByRole: false, // set to true to limit to roles in the roleArray
    // adjust roles as needed
    roleArray: [
            'student',
            'teacher',
            'admin'
    ],
    // OPTIONAL: Limit tools to an array of Canvas user IDs
    limitByUser: false, // Change to true to limit by user
    // add users to array (Canvas user ID not SIS user ID)
    userArray: [
            '1234',
            '987654'
    ]
};

// Run the necessary code when a page loads
$(document).ready(function () {
'use strict';
// This runs code that looks at each page and determines what controls to create
$.getScript(DT_variables.path + 'js/master_controls.js', function () {
    console.log('master_controls.js loaded');
});
});
////////////////////////////////////////////////////
// END DESIGN TOOLS CONFIG                        //
////////////////////////////////////////////////////



//Ally config
window.ALLY_CFG = {
    'baseUrl': 'https://prod.ally.ac',
    'clientId': 4050
};
$.getScript(ALLY_CFG.baseUrl + '/integration/canvas/ally.js');

//Proctorio script to hide edit or take quiz button if not in Chrome
//(function(){var a=document.createElement("script"),b=document.head||document.getElementsByTagName("head")[0];a.onload=function(){b.removeChild(a)};a.src="//cdn.proctorio.net/snippets/gbl/canvas-global-embed.min.js";b.appendChild(a)})();

//Pronto

(function() {
window.prontoInit = {"ixn":"canvas","cid":156,"version":"1.0"};
var script = document.createElement('script');
script.src = `https://chat.trypronto.com/js/embedded.js?cb=${Math.round(new Date().getTime() / 1000)}`;
document.body.appendChild(script);
})();