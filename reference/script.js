$( function(){
	libMe( );
	graphMe( );
	chooseAdder( );
	$("legend").click(toggleFieldset);
})

//===| Evo Builder |===//
function chooseAdder( )
{
	var chooser = gebid( "chooser");
	chooser.innerHTML = ""; 
	
	for (var adder in doc.addEvo) {
		if (doc.addEvo.hasOwnProperty(adder) && adder != "doc") {
			var radio = document.createElement( "input");
			radio.type = "radio";
			radio.id = "adder_" + adder;
			radio.name = "param";
			radio.value = adder;
			
			var label = document.createElement( "label");
			label.setAttribute("for", "adder_" + adder);
			label.innerHTML = adder;
			
			var br = document.createElement( "br");
			
			chooser.appendChild( radio);
			chooser.appendChild( label);
			chooser.appendChild( br);
		}
	}
}

//===| GUI functions |===//
function toggleFieldset( event)
{
	var fieldset = $(this).parent();
	
	var evo = pe.addEvo.ani( fieldset.get( 0), "style.opacity", 1, 0, pe.syntax.none, 0, 500);
	
	if( fieldset.hasClass("hiddenFieldset"))
	{
		pe.setEvo.callBack( evo, function(){
			fieldset.removeClass("hiddenFieldset");
			fieldset.css("height", "");
			pe.addEvo.ani( fieldset.get( 0), "style.opacity", 0, 1, pe.syntax.none, 0, 500);
		})
	}
	else
	{
		pe.setEvo.callBack( evo, function(){
			fieldset.addClass("hiddenFieldset");
			fieldset.css("height", "10px");
			pe.addEvo.ani( fieldset.get( 0), "style.opacity", 0, 1, pe.syntax.none, 0, 500);
		})
	}
}

//===| Graphical view generation |===//
function graphMe( )
{
	gebid("graphLib").innerHTML = travelDoc( doc);
}

function travelDoc( root)
{
	var msg = "";

	if( typeof root === 'object')
	{
		for (var node in root) {
			if (root.hasOwnProperty(node) && node != "doc" && node != "params") {

				msg += "<fieldset class='hiddenFieldset'><legend>" + node + "</legend>";
				msg += root[node].doc;
				
				// deisplay parameters if it is a function
				if( root[node].params != undefined)
				{
					msg += "<hr/>"
					var nbParams = 0;
					for (var param in root[node].params) {
						if (root[node].params.hasOwnProperty(param)) {
							var paramObj = root[node].params[param];
							msg += "<b>" + param + "</b> (<i>" + paramObj.type + "</i>): " + paramObj.doc + "<br/>";
							++nbParams;
						}
					}
					
					if( nbParams == 0)
						msg += "<i>No parameters</i>";
				}
				
				msg += travelDoc(root[node]);
				msg += "</fieldset>";
			}
		}
	}

	return msg;
}

//===| Doc code generation |===//
function libMe()
{
	var msg = "var doc = {};\n\n";
	msg += travelPe( pe, "doc.");
	gebid("rawLib").innerHTML = "<xmp>" + msg + "</xmp>";
}

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func)
{
	var fnStr = func.toString().replace(STRIP_COMMENTS, '');
	var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
	if( result === null)
		result = [];
	return result;
}

function travelPe( root, level, offset)
{
	if (offset === undefined)
		offset = "";

	var msg = "";

	if( typeof root === 'object')
	{
		for (var node in root) {
			if (root.hasOwnProperty(node)) {
				
				var predefinedContent = getDoc( level + node + ".doc");
				predefinedContent = predefinedContent.replace(/'/g, "\\\'"); // manage ' character
				predefinedContent = predefinedContent.replace(/<br\/>/g, "<br/>'\n" + offset + level + node + ".doc+='"); // break lines at br
				
				msg += offset + level + node + "={};\n";
				msg += offset + level + node + ".doc='" + predefinedContent + "';\n";
				if( typeof(root[node]) === "function")
				{
					msg += travelArgs( root[node], level + node, offset);
					msg += "\n";
				}
				msg += travelPe(root[node], level + node + ".", offset + "\t");
			}
		}
		
		msg += "\n";
	}

	return msg;
}

function travelArgs( fct, level, offset)
{
	var msg = "";
	var params = getParamNames( fct);
	offset += "\t";
	
	msg += offset + level + ".params={};\n"
	for( var i=0; i<params.length; ++i)
	{
		var param = params[i];
		
		msg += offset + level + ".params." + param + "={};\n";
		
		var predefinedContent = getDoc( level + ".params." + param + ".type");
		msg += offset + level + ".params." + param + ".type='" + predefinedContent + "';\n";
		
		var predefinedContent = getDoc( level + ".params." + param + ".doc");
		msg += offset + level + ".params." + param + ".doc='" + predefinedContent + "';\n";
	}

	return msg;
}

function getDoc( level)
{
	var predefinedContent = "";
	
	try {
		predefinedContent = eval(level);
	}
	catch(err) {
		 predefinedContent = "TODO";
	}
	
	return predefinedContent;
}
