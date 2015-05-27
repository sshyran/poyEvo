//==================================//
//===|        PoyEvo            |===//
//===|     Debug Console        |===//
//===|                          |===//
//==================================//
//===|                          |===//
//===| Auteur : Johan Maupetit  |===//
//===| Copyrights : Poyostudios |===//
//===|                          |===//
//==================================//
//===| Dépendances :            |===//
//===|  poyoEvo2                |===//
//===|  poyoCore_std            |===//
//===|                          |===//
//==================================//

//~ load_jsLib( 'poyoCore_std');

var pe_debug = {
	conf: {
		refreshTimeMultiplier: 10,
		limitDisplayedEvosNunber: 100
	},

	consoleWindow:
		null,
	consoleBody:
		null,
	console:
		null,
	report:
		"",

	start: function()
	{
		pe_debug.openConsole();
		pe_debug.idle();
	},

	idle: function()
	{
		pe_debug.generateReport();
		setTimeout(pe_debug.idle, pe.conf.refreshTime*pe_debug.conf.refreshTimeMultiplier);
	},

	openConsole: function()
	{
		pe_debug.consoleWindow = window.open( "", "PoyEvo -- Debug Console", "location=no,menubar=no,status=no,width=640,height=480");
		pe_debug.consoleBody = pe_debug.consoleWindow.document.body;

		pe_debug.consoleBody.style.left = "0";
		pe_debug.consoleBody.style.top = "0";
		pe_debug.consoleBody.style.margin = "0";
		pe_debug.consoleBody.style.width = "100%";
		pe_debug.consoleBody.style.height = "100%";
		pe_debug.consoleBody.style.color = "#3F3";
		pe_debug.consoleBody.style.backgroundColor = "#323232";

		pe_debug.clear();
		pe_debug.printTitle();
		pe_debug.printControlBoard();
		pe_debug.rawWrite("<span id='console'></span>");
		pe_debug.consoleBody.innerHTML = pe_debug.report;
		pe_debug.console = pe_debug.consoleWindow.document.getElementById( "console");
	},

	generateReport: function()
	{
		pe_debug.clear();
		pe_debug.printNumericBoard();
		pe_debug.printEvoListBoard();

		pe_debug.console.innerHTML = pe_debug.report;
	},

	printTitle: function()
	{
		pe_debug.rawWriteLine( "<h3 style='color:#888;'>PoyEvo -- Debug Console </h3>");
	},

	printControlBoard: function()
	{
		pe_debug.printFieldsetStart( "Control Board");
			pe_debug.printBtn( "clearAll");
			//TODO refresh speed control//
		pe_debug.printFieldsetEnd();
	},

	printNumericBoard: function()
	{
		pe_debug.printFieldsetStart( "Numeric Values");
			pe_debug.printValue( "Evo number", pe.conf.listOfEvos.length);
			pe_debug.printValue( "Total Evo created", pe.conf.counter);
		pe_debug.printFieldsetEnd();
	},

	printEvoListBoard: function()
	{
		var listOfEvos = pe.conf.listOfEvos;
		pe_debug.printFieldsetStart( "List of Evos");
			var olduid = 0;
			var luid = 0;
			for( var i=0; i<pe_debug.conf.limitDisplayedEvosNunber && i<listOfEvos.length ; ++i)
			{
				luid = listOfEvos[i].uid;
				pe_debug.printEvo( listOfEvos[i], luid != (1+olduid));
				olduid = luid;
			}
			if( pe_debug.conf.limitDisplayedEvosNunber < listOfEvos.length)
				pe_debug.rawWriteLine("[...]");

		pe_debug.printFieldsetEnd();
	},

	// === HTML generation === //
	clear: function()
	{
		pe_debug.report = "";
	},

	printFieldsetStart: function( title)
	{
		pe_debug.rawWrite( "<fieldset>");
		pe_debug.rawWrite( "<legend>" + title + "</legend>");
	},
	printFieldsetEnd: function( title)
	{
		pe_debug.rawWrite( "</fieldset>");
	},

	printEvo: function( evo, doShare)
	{
		if( doShare)
			pe_debug.rawWrite("<hr/>");

		pe_debug.rawWrite("[");
		pe_debug.rawWriteColored( evo.to.tagName + " ", "#AA5");
		pe_debug.printAttribute( "id", evo.to.id); pe_debug.rawWrite(", ");
		pe_debug.printAttribute( "class", evo.to.className);
		pe_debug.rawWrite("] ");

		pe_debug.rawWrite("{");
		pe_debug.rawWriteColored("[" + evo.uid + "] ", "#FB2");
		pe_debug.printAttribute( "property", evo.tp); pe_debug.rawWrite(", ");
		pe_debug.printAttribute( "state", "0b" + evo.stv.toString(2).toUpperCase()); pe_debug.rawWrite(", ");
		pe_debug.rawWrite("} : ");

		var p = evo.bf();
		pe_debug.rawWriteColored( p.toFixed(3), "#F44");

		p = evo.sf( p);
		pe_debug.rawWrite(" -> ");
		pe_debug.rawWriteColored( p.toFixed(3), "#F44");

		p = poyoCore_getAtribute( evo.to, evo.tp);
		pe_debug.rawWrite(" -> ");
		pe_debug.rawWriteColored( '"' + p + '"', "#CA4");

		pe_debug.rawWriteLine("");
	},

	printBtn: function( action)
	{
		pe_debug.rawWrite( "<button onclick='window.opener.pe_debug_actions." + action + "();'>" + action + "</button>");
	},

	printAttribute: function( name, value)
	{
		pe_debug.rawWriteColored( name + ": ", "#888");
		pe_debug.rawWrite( value);
	},

	printValue: function( name, value)
	{
		pe_debug.rawWriteColored( name + ": ", "#888");
		pe_debug.rawWriteLine( value);
	},

	rawWriteLine: function( rawHtml)
	{
		pe_debug.rawWrite( rawHtml + "<br/>");
	},

	rawWrite: function( rawHtml)
	{
		pe_debug.report += rawHtml;
	},

	rawWriteColored: function( rawHtml, color)
	{
		pe_debug.rawWrite( "<span style='color:" + color + ";'>" + rawHtml + "</span>");
	},
};

window.pe_debug_actions = {
	clearAll: function()
	{
		pe.conf.listOfEvos = [];
	}
};

window.addEventListener("load", pe_debug.start);
