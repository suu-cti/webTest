//Calls all of the other scripts
console.log("Script manager working")
var scripts = ['third_party_scripts.js', 'buttons.js']
for(var i = 0; i < scripts.length; i++){
	var script = document.createElement("script");
	script.src = 'https://cdn.jsdelivr.net/gh/suu-otl/webTest@3a11a185be558a637d56c54bd301d80a0b899c96/' + scripts[i];
	document.head.appendChild(script);
}

console.log("HELLLLLLLLLLLOOO WORLD!")