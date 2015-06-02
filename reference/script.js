$( function(){
	libMe( );
	graphMe( );
	
	buildNewCommand();
	
	$("legend").click(toggleFieldset);
})

//===| Evo Builder |===//
var buildStack = {
	stack: [],
	tmpStack: [], // for group building
	
	reset: function()
	{
		buildStack.stack = [];
		buildStack.tmpStack = [];
	},
	
	push: function( fct)
	{
		buildStack.stack.push( fct);
	},
	
	pushGroup: function( fct)
	{
		buildStack.tmpStack.push( fct);
	},
	
	finaliseGroup: function( )
	{
		while( buildStack.tmpStack.length > 0)
			buildStack.push( buildStack.tmpStack.pop());
	},
	
	next: function()
	{
		if( !buildStack.isEmpty())
			buildStack.stack.pop()();
	},
	
	isEmpty: function()
	{
		return buildStack.stack.length == 0;
	}
}

function buildNewCommand()
{
	gebid( "finalEvo").innerHTML = "pe.addEvo.";
	gebid( "chooser").innerHTML = "";
	builderDocNode( doc.addEvo);
}

function builderDocNode( docNode)
{
	var chooser = gebid( "chooser");
	var finalEvo = gebid( "finalEvo");
	
	for (var choice in docNode) {
		if (docNode.hasOwnProperty(choice) && choice != "doc") {
			var item = document.createElement( "div");
			item.className = "btn";
			item.innerHTML = choice;
			
			item.onclick = (function (localChoice, localDocNode) {
				return function(){
					finalEvo.innerHTML += localChoice;
					functionFiller( localDocNode);
				};
			})(choice, docNode[choice]);

			item.onmouseover = (function( localChoice, localDoc) {
				return function(){ liveHelper( localChoice, localDoc)};
			})(choice, docNode[choice]);

			chooser.appendChild( item);
		}
	}
}

function liveHelper( title, docNode)
{
	gebid("liveHelper").innerHTML = "<h4>" + title + "</h4>";
	gebid("liveHelper").innerHTML += generateDocNodeContent( docNode);
}

function resetLiveHelper( )
{
	gebid("liveHelper").innerHTML = "";
}

//path.choice should always be a function
function functionFiller( docNode)
{
	var chooser = gebid( "chooser");
	var finalEvo = gebid( "finalEvo");
	
	finalEvo.innerHTML += "( ";
	var params = docNode.params;
	
	for( var param in params) {
		if (params.hasOwnProperty(param)) {
			
			buildStack.pushGroup(
				(function( localParam, paramInfos) {
					return function() {
						chooser.innerHTML = "<span style='color:#FD0;'>" + localParam + "</span> : ";
						
						liveHelper( localParam, paramInfos);
						typeBehavior( paramInfos.type);
					}
				})( param, params[param])
			);
		}
	}
	
	// function to execute once all parameters are choosed
	buildStack.pushGroup( function () {
		
		finalEvo.innerHTML = finalEvo.innerHTML.substr(0, finalEvo.innerHTML.length -2);
		finalEvo.innerHTML += ")";
		
		if( buildStack.isEmpty())
		{
			finalEvo.innerHTML += "; ";
			
			chooser.innerHTML = "Your command is ready to play. ";
			resetLiveHelper( );

			var resetBtn = document.createElement( "div");
			resetBtn.className = "btn";
			resetBtn.innerHTML = "Reset ?"
			resetBtn.onclick = function(){ buildNewCommand()};
			resetBtn.style.display = "inline-block";
			chooser.appendChild( resetBtn);
		}
		else
		{
			finalEvo.innerHTML += ", ";
			buildStack.next();
		}
	});
	
	buildStack.finaliseGroup();
	
	buildStack.next();
}

function chooseAmong( choiceList)
{
	var chooser = gebid( "chooser");
	var finalEvo = gebid( "finalEvo");
	
	for (var i=0; i<choiceList.length; ++i) {
		var choice = choiceList[i];
		
		var item = document.createElement( "div");
		item.className = "btn";
		item.innerHTML = choice;
		
		item.onclick = (function (localChoice) {
			return function(){
				finalEvo.innerHTML += localChoice;
				finalEvo.innerHTML += ", ";
				buildStack.next();
			};
		})(choice);

		chooser.appendChild( item);
	}
}

function typeBehavior( type)
{
	var chooser = gebid( "chooser");
	var finalEvo = gebid( "finalEvo");
	
	if (type.substr(0,3) == "pe." && type.substr(-9) == ".function") {
		// list possibles function
		var fctType = type.substr(3, type.length - 12);
		
		finalEvo.innerHTML += "pe." + fctType + ".";
		builderDocNode( eval( "doc." + fctType));
	
	} else if ( type == "Boolean") {
		chooseAmong( ["true", "false"]);
	
	} else {
		// display generic input
		var inputTxt = document.createElement("input");
		inputTxt.setAttribute( "type", "text");

		inputTxt.onkeydown = function(event) {
			if( event.keyCode == 13) { // press Enter

				finalEvo.innerHTML += this.value;
				finalEvo.innerHTML += ", ";
				buildStack.next();
			}
		}

		chooser.appendChild( inputTxt);
		inputTxt.focus();
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
				
				msg += generateDocNodeContent( root[node]);
				msg += travelDoc(root[node]);
				msg += "</fieldset>";
			}
		}
	}

	return msg;
}

function generateDocNodeContent( docNode)
{
	var msg = "";
	
	// Argument Node
	if( docNode.type != undefined)
	{
		var msg = "(<b>" + docNode.type + "</b>) ";
		if( docNode.comment != undefined)
			msg += "<i>" + docNode.comment + "</i> ";
	}
	
	msg += docNode.doc;
	
	// Function Node
	if( docNode.params != undefined)
	{
		msg += "<hr/>"
		var nbParams = 0;
		for (var param in docNode.params) {
			if (docNode.params.hasOwnProperty(param)) {
				var paramObj = docNode.params[param];

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
