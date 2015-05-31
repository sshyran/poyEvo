$( function(){
	libMe( );
	graphMe( );
	chooseAdder( );
	$("legend").click(toggleFieldset);
})

//===| Evo Builder |===//
//choices: array of remaining parameters to set
function chooseAdder( choices/*optional*/, path/*optional*/)
{
	var chooser = gebid( "chooser");
	var finalEvo = gebid( "finalEvo");
	chooser.innerHTML = ""; 
	
	if( choices === undefined)
	{
		finalEvo.innerHTML = "pe.addEvo.";
		chooseAdder( pe.addEvo, "addEvo");
	}
	else
	{
		for (var choice in choices) {
			if (choices.hasOwnProperty(choice)) {
				var item = document.createElement( "div");
				item.className = "btn";
				item.innerHTML = choice;
				
				item.onclick = (function (localChoice) {
					return function(){ functionFiller( path, localChoice)};
				})(choice);
				
				item.onmouseover = (function( localDoc) {
					return function(){ liveHelper(localDoc)};
				})(getDoc( "doc." + path + "." + choice + ".doc"));
				
				item.onmouseout = function(){ liveHelper("")};
				
				chooser.appendChild( item);
			}
		}
	}
}

function liveHelper( content)
{
	gebid("liveHelper").innerHTML = content;
}

//path.choice should always be a function
function functionFiller( path, choice)
{
	var chooser = gebid( "chooser");
	var finalEvo = gebid( "finalEvo");
	var functionToFill = eval( "pe." + path + "." + choice);
	
	finalEvo.innerHTML += choice + "( ";
	var params = doc[path][choice].params;
	
	
	var fillFunctionStack = [];
	for( var param in params) {
		if (params.hasOwnProperty(param)) {
			fillFunctionStack.push(
				(function( localParam){
					return function() {
						chooser.innerHTML = localParam + " : ";

						var inputTxt = document.createElement("input");
						inputTxt.setAttribute( "type", "text");
						inputTxt.onblur = function() {
							var nextFct = fillFunctionStack.pop();
							if( nextFct != undefined) {
								finalEvo.innerHTML += this.value + ","
								nextFct();
							} else {
								finalEvo.innerHTML += this.value + ")"
								chooser.innerHTML = "";
							}
						};
						chooser.appendChild( inputTxt);
					}
				})( param)
			);
		}
	}
	
	fillFunctionStack.pop()();
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
							
							msg += "<b>" + param + "</b> "
							if( paramObj.comment != undefined)
								msg += "<span style='color:#FFFF00;'>" + paramObj.comment + "</span> "
							msg += "(<i>" + paramObj.type + "</i>): " + paramObj.doc + "<br/>";
							
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
	var fnStrCmts = func.toString()
	var fnStr = fnStrCmts.toString().replace(STRIP_COMMENTS, '');
	
	var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
	var resultCmts = fnStrCmts.slice(fnStrCmts.indexOf('(')+1, fnStrCmts.indexOf(')')).match(ARGUMENT_NAMES);
	
	if( result === null)
	{
		return {
			args: [],
			cmts: []
		};
	}
	else
	{
		for( var i=0; i<result.length; ++i) {
			resultCmts[i] = resultCmts[i].replace( result[i], "");
			resultCmts[i] = resultCmts[i].replace( /(\/\/)|(\/\*)|(\*\/)/g, '');
		}
		
		return {
			args: result,
			cmts: resultCmts
		};
	}
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
	for( var i=0; i<params.args.length; ++i)
	{
		var param = params.args[i];
		var cmt = params.cmts[i];
		
		msg += offset + level + ".params." + param + "={};\n";
		
		var predefinedContent = getDoc( level + ".params." + param + ".type");
		msg += offset + level + ".params." + param + ".type='" + predefinedContent + "';\n";
		
		var predefinedContent = getDoc( level + ".params." + param + ".doc");
		msg += offset + level + ".params." + param + ".doc='" + predefinedContent + "';\n";
		
		if( cmt != undefined && cmt != "")
			msg += offset + level + ".params." + param + ".comment='" + cmt + "';\n";
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
