//Calls all of the other scripts
console.log("Script manager working")
var scripts = ['third_party_scripts.js', 'buttons.js']
for(var i = 0; i < scripts.length; i++){
	var script = document.createElement("script");
	script.src = 'https://cdn.jsdelivr.net/gh/suu-otl/webTest@333634a6d048c981291ce295738b1b4f533efc8f/' + scripts[i];
	document.head.appendChild(script);
}