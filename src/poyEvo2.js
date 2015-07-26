//==================================//
//===|                          |===//
//===|        PoyEvo2           |===//
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

var pe = {

	//===| PoyEvo Class
	Evo: function( targetObject, targetProperty, pe_range_function, pe_syntax_function, pe_bind_function, pe_shape_function, pe_state_value)
	{
		this.to = targetObject;
		this.tp = targetProperty;				// 'style.top' for exemple
		this.rf = pe_range_function;			// Function in charge of converting binding function value (0->1) to an other range (ev->sv)
		this.yf = pe_syntax_function;			// Functions used to build the syntax of the value. adding 'px' for example.
		this.bf = pe_bind_function;			// The function which indicate the percent of evolution. (0->1 in general cases)
		this.sf = pe_shape_function;			// This function make post treatment on the evolution to make it not linear

		this.stv = pe_state_value;				// Indicate which controls must be applied on the evolution

		this.cbf = null;							// CallBack Function

		// --- interne ---
		this.uid = ++pe.conf.counter; 		// Identifiant unique de l'animation

		this.cUB = this.stv & pe.state.CUB;
		this.cHB = this.stv & pe.state.cHB;
		this.iPe = this.stv & pe.state.iPE;
	},

	//===| PoyoEvo configuration
	conf: {
		//===| Users Parameters |===//
		'refreshFunction': function(){pe.aux.timeTicker(30)},	// Refresh period in ms

		//===| Internal Parameters |===//
		'counter': 0,
		'listOfEvos': []									// List the evos curently in process
	},

	//===| IDLE functions
	compute: function()
	{
		var i;

		for( i = 0; i < pe.conf.listOfEvos.length; ++i)
		{
			var iEvo = pe.conf.listOfEvos[i];
			var p = iEvo.bf();

			if( p<0 && !iEvo.cUB)
			{
				poyoCore_setAtribute( iEvo.to, iEvo.tp, iEvo.yf( iEvo.rf(0)));
			}
			else if( p>1 && !iEvo.cHB)
			{
				poyoCore_setAtribute( iEvo.to, iEvo.tp, iEvo.yf( iEvo.rf(1)));
				if( !iEvo.iPe)
				{
					pe.conf.listOfEvos.splice( i, 1);
					if( iEvo.cbf !== null)
						iEvo.cbf();
					--i;
				}
			}
			else
			{
				p = iEvo.sf( p);
				poyoCore_setAtribute( iEvo.to, iEvo.tp, iEvo.yf( iEvo.rf(p)));
			}
		}
	},

	//===| state values
	state: {
		canUnderBound: parseInt('1', 2),			// Indicate if the evolution can go under the startValue
		cUB: parseInt('1', 2),						// short way
		
		canHoverBound: parseInt('10', 2),		// Indicate if the evolution can overflow the endValue
		cHB: parseInt('10', 2),						// short way
		
		isPersitent:  parseInt('100', 2),		// Indicate if the evolution must be deleted once the endValue is overFlowed
		iPE: parseInt('100', 2),					// short way
		
		removeDoubles:  parseInt('1000', 2),	// Indicate if this evolution must remove doubles when it is created
		rD: parseInt('1000', 2)						// short way
	},

	//===| range functions
	range: {
		fixed: function( startValue, endValue)
		{
			return function( v)
			{
				return ((1-v)*startValue + v*endValue);
			};
		},

		dynamic: function( startFunction, endFunction)
		{
			return function( v)
			{
				return ((1-v)*startFunction() + v*endFunction());
			};
		}
	},

	//===| syntax functions
	syntax: {
		prefix_suffix: function( prefix, suffix)
		{
			return function( v)
			{
				return prefix + "" + v + "" + suffix;
			};
		},

		suffix: function( suffix)
		{
			return pe.syntax.prefix_suffix( "", suffix);
		},

		none: function()
		{
			return arguments[0];
		},

		grayscale: function()
		{
			v = parseInt( arguments[0]);
			return "rgb(" + v + "," + v + "," + v + ")";
		},

		bgPosition: function( targetObject, axe, ext)
		{
			return function( v)
			{
				if( targetObject.style.backgroundPosition === "")
					targetObject.style.backgroundPosition = "center center";

				var bgpos = targetObject.style.backgroundPosition.split(" ");
				if( axe == "x")
				{
					return v + ext + " " + bgpos[1];
				}
				else
				{
					return bgpos[0] + " " + v + ext;
				}
			};
		}
	},

	//===| Shape functions
	shape: {
		linear: function()
		{
			return arguments[0];
		},

		sin: function()
		{
			var p = arguments[0];
			return p + (Math.sin(2 * Math.PI * p - Math.PI)) / (2 * Math.PI);
		},

		asin: function()
		{
			var p = arguments[0];
			return p + (Math.sin(2 * Math.PI * p)) / (2 * Math.PI);
		},

		ela: function()
		{
			var p = arguments[0];
			return Math.sqrt(p)+(1-p)*Math.sin(p*4*Math.PI/3);
		},

		pow: function( f)
		{
			return function( p){return Math.pow(p, f);};
		},

		apow: function( f)
		{
			return function( p){return 1-Math.pow(1-p, f);};
		},

		//===| overlay shape functions

		// Change a linear evolution to step one
		// steps : step number
		step: function( shape_function, steps)
		{
			return function( p){
				p = shape_function( p);
				p = parseInt( p*steps)/steps;

				return p;
			};
		}
	},

	//===| Binding functions
	bind: {
		// deltaTime durée avant le démarrage de l'évolution
		time: function( deltaTime, duration)
		{
			var reftime = new Date();
			reftime = reftime.getTime();
			var startTime = reftime + deltaTime;
			var endTime = startTime + duration;

			return function()
			{
				var actime = new Date();
				actime = actime.getTime();

				return (actime - startTime) / (endTime - startTime);
			};
		},

		// deltaTime écart de temp entre chaque évolution
		// phi : phase de l'évolution
		rotativeTime: function( deltaTime, duration, phi)
		{
			var p = 2*(deltaTime + duration); // periode des oscilations

			return function()
			{
				var at = new Date();
				at = at.getTime() + phi;

				at = at % p; // signal dent de scie
				at = Math.abs(at-p/2) - deltaTime/2; // signal triangulaire

				return at / duration;
			};
		},

		// fonction escalier rotative : utile pour les sprites
		// steps : nombre de pas
		// duration : durée de chaque pas en ms
		stepTime: function(steps, duration)
		{
			var p = steps*duration; // periode des oscilations

			return function()
			{
				var at = new Date();
				at = at.getTime() % p;

				at = parseInt((at/p)*steps);

				return at / steps;
			};
		},

		// Retourne un nombre aléatoire variant tous les steps appels
		randTime: function( steps)
		{
			var tirage = 0; // nombre d'appels avant tirage
			var n;

			return function()
			{
				if( tirage < 1)
				{
					tirage = steps;
					n = Math.random();
				}

				-- tirage;

				return n;
			};
		},

		mouse: function( axe, speed/*optionel*/)
		{
			poyoCore_trackMouse();

			if( speed === undefined)
				return pe.bind.property( poyoCore_mouse, axe, axe == "x" ? poyoCore_wWidth : poyoCore_wHeight);
			else
				return pe.bind.lazyProperty( poyoCore_mouse, axe, axe == "x" ? poyoCore_wWidth : poyoCore_wHeight, speed);
		},

		scrollBar: function( element, axe, speed/*optionel*/)
		{
			var property = axe == "x" ? "scrollLeft" : "scrollTop";

			var rangeFtc; var ldb = document.body; var lde = document.documentElement;
			if( element == ldb || element == lde) // element de type body
			{
				//gestion automatique des bugs liés au doctype pour simplifier l'utilisation, et la compatibilité ( document.documentElement <=> document.body)
				window.scrollBy(1, 1);
				element = (lde && lde.scrollTop) ? lde : ldb;
				window.scrollBy(-1, -1);

				rangeFtc = (axe == "x") ?
						function(){return element.scrollWidth - poyoCore_wWidth();}
					:
						function(){return element.scrollHeight - poyoCore_wHeight();}
					;
			}
			else // element de type classique (div, ...)
			{
				rangeFtc = (axe == "x") ?
					function(){return element.scrollWidth - element.offsetWidth;}
				:
					function(){return element.scrollHeight - element.offsetHeight;}
				;
			}

			if( speed === undefined)
				return pe.bind.property( element, property, rangeFtc);
			else
				return pe.bind.lazyProperty( element, property, rangeFtc, speed);
		},

		// Fonction bas niveau prévue plutôt pour un usage interne
		property: function( element, property, rangeFtc)
		{
			return function()
			{
				return poyoCore_getAtribute( element, property) / rangeFtc();
			};
		},

		lazyProperty: function( element, property, rangeFtc, speed)
		{
			var ov = poyoCore_getAtribute( element, property);

			return function()
			{
				ov = (1-speed)*ov + speed*poyoCore_getAtribute( element, property);

				return ov / rangeFtc();
			};
		}
	},

	//===| Overlay functions
	overLay: {
		// Redéfini la plage d'animation
		// Agit comme une surcouche pour une bind function
		// section : {low:0, high:1}
		expand: function( bind_function, section)
		{
			return function( ){
				var p = bind_function();

				p -= section.low;
				p /= section.high - section.low;

				return p;
			};
		},
	},

	//===| User functions
	delEvo: function( unid)
	{
		if( unid instanceof Array)
		{
			for( var i=0; i<unid.length; ++i)
				pe.delEvo( unid[i]);
		}
		else
		{
			var evoId = pe.aux.searchEvo( unid);

			if( evoId !== null)
				pe.conf.listOfEvos.splice( evoId, 1);
		}
	},

	// Création d'une évolution. Contrôle total de l'évolution : utile lorque l'intervale d'évolution varie au cours du temps.
	addEvo: {

		// Controle maximum de l'évolution crée ... Cette fonction est utilisée par toutes les fonctions ci-dessous
		cpl: function( targetObject, targetProperty, pe_range_function, pe_syntax_function, pe_bind_function, pe_shape_function/*=linear*/, pe_state_value/*optional*/)
		{
			if( pe_state_value === undefined)
				pe_state_value = 0;
			if( pe_shape_function === undefined)
				pe_shape_function = pe.shape.linear;

			if( targetObject instanceof Array || targetObject instanceof NodeList)
			{
				var unids = [];
				for(var i=0; i < targetObject.length; ++i)
					unids.push( pe.addEvo.cpl( targetObject[i], targetProperty, pe_range_function, pe_syntax_function, pe_bind_function, pe_shape_function, pe_state_value));
				return unids;
			}
			else
			{
				if( pe_state_value & pe.state.rD)
					pe.aux.deleteConflictualEvo( targetObject, targetProperty);

				var evo = new pe.Evo( targetObject, targetProperty, pe_range_function, pe_syntax_function, pe_bind_function, pe_shape_function, pe_state_value);
				pe.conf.listOfEvos.push( evo);

				return evo.uid;
			}
		},

		// Création d'une évolution standard ...
		std: function( targetObject, targetProperty, startValue, endValue, pe_syntax_function, pe_bind_function, pe_shape_function/*=linear*/, pe_state_value/*optional*/)
		{
			return pe.addEvo.cpl( targetObject, targetProperty, pe.range.fixed(startValue, endValue), pe_syntax_function, pe_bind_function, pe_shape_function, pe_state_value);
		},

		// fonction dédiée aux évolutions de type animations temporelles.
		ani: function( targetObject, targetProperty, startValue, endValue, pe_syntax_function, deltaTime, duration, pe_shape_function, removeDoubles/*=false*/)
		{
			var pe_state_value = removeDoubles ? pe.state.rD : 0;

			return pe.addEvo.cpl( targetObject, targetProperty, pe.range.fixed(startValue, endValue), pe_syntax_function, pe.bind.time( deltaTime, duration), pe_shape_function, pe_state_value);
		},


		//=== Premade functions with side effects ===//

		// fonction dédiée aux évolutions de type sprite.
		sprite: function( targetDiv, img_sprite, nb_img, px_space, timespace, removeDoubles/*=false*/)
		{
			if( targetDiv instanceof Array || targetDiv instanceof NodeList)
				for(var i=0; i < targetDiv.length ;++i)
					targetDiv[i].style.backgroundImage = "url('" + img_sprite + "')";
			else
				targetDiv.style.backgroundImage = "url('" + img_sprite + "')";

			var pe_state_value = removeDoubles ? pe.state.rD : 0;
			pe_state_value |= pe.state.iPE;

			return pe.addEvo.cpl( targetDiv, "style.backgroundPosition", pe.range.fixed(0, nb_img*px_space), pe.syntax.suffix("px 0px"), pe.bind.stepTime(nb_img, timespace), pe.shape.linear, pe_state_value);
		},

		// Démare un Drag & Drop sur l'objet "targetObjet". callBackFunction est appelée au moment du Drop.
		dragDrop: function( targetObject, callBackFunction/*optionel*/)
		{
			// Computing pe_state_value
			var pe_state_value = pe.state.iPE;
			pe_state_value |= pe.state.cUB;
			pe_state_value |= pe.state.cHB;
			pe_state_value |= pe.state.rD;

			// Computing offset
			var offset = poyoCore_getAbsPos( targetObject.parentNode);
			if (poyoCore_mouse.trackerStarted)
			{
				var pObj = poyoCore_getAbsPos( targetObject);

				offset.x += poyoCore_mouse.x - pObj.x;
				offset.y += poyoCore_mouse.y - pObj.y;
			}
			else
			{
				var dObj = poyoCore_getInnerDim( targetObject);

				offset.x += dObj.w / 2;
				offset.y += dObj.h / 2;
			}

			// Starting annimations
			var drx = pe.addEvo.cpl( targetObject, "style.left",
				pe.range.dynamic( function(){ return -offset.x;}, function(){ return poyoCore_wWidth()-offset.x;}),
				pe.syntax.suffix("px"), pe.bind.mouse("x", 0.2), pe.shape.linear, true, true, true, true);
			var dry = pe.addEvo.cpl( targetObject, "style.top",
				pe.range.dynamic( function(){ return -offset.y;}, function(){ return poyoCore_wHeight()-offset.y;}),
				pe.syntax.suffix("px"), pe.bind.mouse("y", 0.2), pe.shape.linear, true, true, true, true);

			// cursor management
			var oldCursor = targetObject.style.cursor;
			targetObject.style.cursor = "move";

			// Defining events
			var blockSelect = function(){return false;};
			var activateSelect = function(){return true;};
			var endDrag = function()
			{
				pe.delEvo( drx);
				pe.delEvo( dry);

				document.removeEventListener( "mouseup", endDrag);
				document.onselectstart = activateSelect;
				document.onmousedown = activateSelect;
				targetObject.style.cursor = oldCursor;

				if( callBackFunction !== undefined)
					callBackFunction();
			};

			document.addEventListener("mouseup", endDrag);
			document.onselectstart = blockSelect;
			document.onmousedown = blockSelect;

			return false;
		},

		bgEffect: function( targetObject, speed/*optionel*/)
		{
			var range = {low:0, high:100};
			if( speed < 0)
			{
				speed = -speed;
				range = {low:100, high:0};
			}

			// calcul de la place en % occupée par l'objet
			var objPos = poyoCore_getAbsPos( targetObject);
			var scrollHeight = document.body.offsetHeight - poyoCore_wHeight(); // champ parcouru par la scrollbar (0->1)
			var wHeight = poyoCore_wHeight() / scrollHeight; // champ % recouvert par la fenetre

			var objSection = {
				low: objPos.y / scrollHeight,
				high: (objPos.y + targetObject.offsetHeight - wHeight) / scrollHeight
			};
			objSection.low -= wHeight;

			pe.addEvo.std( targetObject, "style.background-position", range.low, range.high,
				pe.syntax.bgPosition( gebid("img"), "y", "%"),
				pe.overLay.expand( pe.bind.scrollBar( document.body, "y", speed), objSection),
				pe.shape.linear,
				pe.state.iPE | pe.state.rD);
		},
		
		fadeIn: function( targetObject, duration, removeDoubles/*=false*/)
		{
			targetObject.style.opacity = 0;
			targetObject.style.display = "";
			pe.addEvo.ani( targetObject, "style.opacity", 0, 1, pe.syntax.none, 0, duration, removeDoubles);
		},
		
		fadeOut: function( targetObject, duration, removeDoubles/*=false*/)
		{
			var evo = pe.addEvo.ani( targetObject, "style.opacity", 1, 0, pe.syntax.none, 0, duration, removeDoubles);
			
			pe.setEvo.callBack( evo, function() {
				targetObject.style.display = "none";
			});
		}
	},

	//===| Modification functions
	setEvo: {
		// Définie la fonction qui doit être appelée à la fin de l'annimation
		callBack: function( unid, callBackFunction)
		{
			var evoId = pe.aux.searchEvo( unid);

			if( evoId !== null)
				pe.conf.listOfEvos[evoId].cbf = callBackFunction;
		}
	},

	//===| Aux functions
	aux: {
		searchEvo: function( unid)
		{
			for( var i=0; i<pe.conf.listOfEvos.length && pe.conf.listOfEvos[i].uid != unid; ++i);
			return (pe.conf.listOfEvos[i].uid == unid ? i : null);
		},

		// Supprime les annimations ayant pour cible le même objet et la même propriété
		deleteConflictualEvo: function( targetObject, targetProperty)
		{
			for( var i=pe.conf.listOfEvos.length-1; i>=0; --i)
			{
				if( targetObject == pe.conf.listOfEvos[i].to &&
					targetProperty == pe.conf.listOfEvos[i].tp)
				{
					pe.conf.listOfEvos.splice( i, 1);
				}
			}
		},
		
		timeTicker: function( refreshTime)
		{
			pe.compute();
			setTimeout( pe.conf.refreshFunction, refreshTime);
		}
	}
};

pe.conf.refreshFunction();
