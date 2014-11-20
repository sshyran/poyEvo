//==================================//
//===|        PoyEvo            |===//
//===| Version : 1.01           |===//
//===| Date : 19/11/2014        |===//
//===|                          |===//
//==================================//
//===|                          |===//
//===| Auteur : Johan Maupetit  |===//
//===| Copyrights : Poyostudios |===//
//===|                          |===//
//==================================//
//===| Dépendances :            |===//
//===|  poyoCore_std            |===//
//===|                          |===//
//==================================//
//~ load_jsLib( 'poyoCore_std');

//===| PoyoEvo configuration variable
var pe_conf = {
	//===| Users Parameters |===//
	'refreshTime':30, 					// Refresh period in ms
	
	//===| Internal Parameters |===//
	'trackMouseStarted':false, 		// Indicate if the tracking of the mouse has been launched yet
	'listOfEvos':new Array() 			// List the evos curently in process
	}

//===| PoyEvo Class
var PoyEvo = function( targetObject, targetProperty, startValue, endValue, syntaxFunction, bindingFunction, shapeFunction, canUnderBound, canHoverBound, isPersitent)
{
	this.to = targetObject;					
	this.tp = targetProperty;				// 'style.top' for exemple
	this.sv = startValue;					
	this.ev = endValue;						
	this.yf = syntaxFunction;				// functions used to build the syntax of the value. adding 'px' for example.
	this.bf = bindingFunction;				// The function wich indicate the percent of evolution. (0->1 in general cases)
	this.sf = shapeFunction;				// This function make post treatment on the evolution to make it not linear
	
	this.cUB = canUnderBound;				// Indicate if the evolution can go under the startValue
	this.cHB = canHoverBound;				// Indicate if the evolution can overflow the endValue
	this.iPe = isPersitent;					// Indicate if the evolution must be deleted once the endValue is overFlowed
}

//===| IDLE function
pe_start();

function pe_start()
{
	var i;
	
	for( i = 0; i < pe_conf.listOfEvos.length; ++i)
	{
		var iEvo = pe_conf.listOfEvos[i];
		var p = iEvo.bf();
		
		if( p<0 && !iEvo.cUB)
		{
			poyoCore_setAtribute( iEvo.to, iEvo.tp, iEvo.yf( iEvo.sv));
		}
		else if( p>1 && !iEvo.cHB)
		{
			poyoCore_setAtribute( iEvo.to, iEvo.tp, iEvo.yf( iEvo.ev));
			if( !iEvo.iPe)
			{
				pe_delEvo( i);
				--i;
			}
		}
		else
		{
			p = iEvo.sf( p);
			poyoCore_setAtribute( iEvo.to, iEvo.tp, iEvo.yf((1-p)*iEvo.sv + p*iEvo.ev));
		}
	}
	
	setTimeout("pe_start()", pe_conf.refreshTime);
}

//===| syntax functions

function pe_syntax_prefix_suffix( prefix, suffix)
{
	return function( v)
	{
		return prefix + "" + v + "" + suffix;
	}
}

function pe_syntax_suffix( suffix) {return pe_syntax_prefix_suffix( "", suffix);}

function pe_syntax_bgPosition( targetObject, axe, ext)
{
	return function( v)
	{
		var bgpos = targetObject.style.backgroundPosition.split(" ")
		if( axe == "x")
		{
			return v + ext + " " + bgpos[1];
		}
		else
		{
			return bgpos[0] + " " + v + ext;
		}
	}
}

//===| Shape functions

function pe_shape_linear( p){return p;}
function pe_shape_sin( p){return 0.5*( 1 + Math.sin(Math.PI*p - Math.PI/2));}
function pe_shape_asin( p){return 0.5 + (1/Math.PI)*Math.asin(2*p-1);}
function pe_shape_ela( p){return Math.sqrt(p)+(1-p)*Math.sin(p*4*Math.PI/3);}

//===| Binding functions

// deltaTime durée avant le démarrage de l'évolution
function pe_bind_time( deltaTime, length)
{
	var reftime = new Date();
	reftime = reftime.getTime();
	var startTime = reftime + deltaTime;
	var endTime = startTime + length;
	
	return function()
	{
		var actime = new Date();
		actime = actime.getTime();
		
		return (actime - startTime) / (endTime - startTime);
	}
}

// deltaTime écart de temp entre chaque évolution
// phi : phase de l'évolution
function pe_bind_rotativeTime( deltaTime, length, phi)
{
	var p = 2*(deltaTime + length); // periode des oscilations
	
	return function()
	{
		var at = new Date();
		at = at.getTime() + phi;
		
		at = at % p; // signal dent de scie
		at = Math.abs(at-p/2) - deltaTime/2; // signal triangulaire
		
		return at / length;
	}
}

// fonction escalier rotative : utile pour les sprites
// steps : nombre de pas
// length : durée de chaque pas !!! en nombre de raffraichissements !!!
function pe_bind_stepTime(steps, length)
{
	var p = steps*length*pe_conf.refreshTime; // periode des oscilations
	
	return function()
	{
		var at = new Date();
		at = at.getTime() % p;
		
		at = parseInt((at/p)*steps);
		
		return at / steps;
	}
}

function pe_bind_mouse( axe)
{
	poyoCore_trackMouse();
	
	return function()
	{
		if( axe == "x")
		{
			return poyoCore_mouse.x / poyoCore_wWidth();
		}
		else
		{
			return poyoCore_mouse.y / poyoCore_wHeight();
		}
	}
}

function pe_bind_lazyMouse( axe, speed)
{
	poyoCore_trackMouse();
	
	var ox = poyoCore_mouse.x;
	var oy = poyoCore_mouse.y;
	
	return function()
	{
		ox = (1-speed)*ox + speed*poyoCore_mouse.x;
		oy = (1-speed)*oy + speed*poyoCore_mouse.y;
		
		if( axe == "x")
		{
			return ox / poyoCore_wWidth();
		}
		else
		{
			return oy / poyoCore_wHeight();
		}
	}
}

//===| User functions

function pe_delEvo( id)
{
	pe_conf.listOfEvos.splice( id, 1);
}

// Création d'une évolution standard ... complet.
function pe_addEvo_std( targetObject, targetProperty, startValue, endValue, syntaxFunction, bindingFunction, shapeFunction, canUnderBound, canHoverBound, isPersitent)
{
	return pe_conf.listOfEvos.push( new PoyEvo( targetObject, targetProperty, startValue, endValue, syntaxFunction, bindingFunction, shapeFunction, canUnderBound, canHoverBound, isPersitent));
}

// fonction dédiée aux évolutions de type animations temporelles.
function pe_addEvo_ani( targetObject, targetProperty, startValue, endValue, syntaxFunction, deltaTime, length, shapeFunction)
{
	return pe_conf.listOfEvos.push( new PoyEvo( targetObject, targetProperty, startValue, endValue, syntaxFunction, pe_bind_time( deltaTime, length), shapeFunction, false, false, false));
}

// fonction dédiée aux évolutions de type sprite.
function pe_addEvo_sprite( targetDiv, img_sprite, nb_img, px_space, timespace)
{
	targetDiv.style.backgroundImage = "url('" + img_sprite + "')";
	pe_addEvo_std( targetDiv, "style.backgroundPosition", 0, nb_img*px_space, pe_syntax_suffix("px 0px"), pe_bind_stepTime(nb_img, timespace), pe_shape_linear, false, false, true)
}

//===| Aux functions


