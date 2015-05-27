$( function(){
	libMe( );
	graphMe( );
	$("legend").click(toggleFieldset);
})

//===| GUI functions |===//
function toggleFieldset( event)
{
	var fieldset = $(this).parent();
	
	if( fieldset.hasClass("hiddenFieldset"))
		fieldset.removeClass("hiddenFieldset");
	else
		fieldset.addClass("hiddenFieldset");
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
			if (root.hasOwnProperty(node) && node != "doc") {

				msg += "<fieldset class='hiddenFieldset'><legend>" + node + "</legend>";
				msg += root[node].doc;
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

function travelPe( root, level, offset)
{
	if (offset === undefined)
		offset = "";

	var msg = "";

	if( typeof root === 'object')
	{
		for (var node in root) {
			if (root.hasOwnProperty(node)) {
				
				var predefinedContent = getDoc( level + node);
				predefinedContent = predefinedContent.replace(/'/g, "\\\'"); // manage ' character
				predefinedContent = predefinedContent.replace(/<br\/>/g, "<br/>'\n" + offset + level + node + ".doc+='"); // break lines at br
				
				msg += offset + level + node + "={};\n";
				msg += offset + level + node + ".doc='" + predefinedContent + "';\n";
				msg += travelPe(root[node], level + node + ".", offset + "\t");
			}
		}
		
		msg += "\n";
	}

	return msg;
}

function getDoc( level)
{
	var predefinedContent = "";
	
	try {
		predefinedContent = eval(level + ".doc");
	}
	catch(err) {
		 predefinedContent = "TODO";
	}
	
	return predefinedContent;
}
