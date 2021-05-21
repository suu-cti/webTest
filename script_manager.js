//Calls all of the other scripts
console.log("Script manager working")
var scripts = ['third_party_scripts.js', 'buttons.js']
for(var i = 0; i < scripts.length; i++){
	var script = document.createElement("script");
	script.src = 'https://cdn.jsdelivr.net/gh/suu-otl/webTest@f065e4dab925545dea84a04d9dbd9ec345e0b88f/' + scripts[i];
	document.head.appendChild(script);
}

console.log("HELLLLLLLLLLLOOO WORLD!")