//==================================//
//===|        PoyEvo            |===//
//===| Version : 2.0            |===//
//===| Date : 08/04/2015        |===//
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
	Evo: function( targetObject, targetProperty, pe_range_function, pe_syntax_function, pe_bind_function, pe_shape_function, canUnderBound, canHoverBound, isPersitent, unid)
	{
		this.to = targetObject;					
		this.tp = targetProperty;				// 'style.top' for exemple
		this.rf = pe_range_function;			// Function in charge of converting binding function value (0->1) to an other range (ev->sv)
		this.yf = pe_syntax_function;			// Functions used to build the syntax of the value. adding 'px' for example.
		this.bf = pe_bind_function;			// The function wich indicate the percent of evolution. (0->1 in general cases)
		this.sf = pe_shape_function;			// This function make post treatment on the evolution to make it not linear
		
		this.cUB = canUnderBound;				// Indicate if the evolution can go under the startValue
		this.cHB = canHoverBound;				// Indicate if the evolution can overflow the endValue
		this.iPe = isPersitent;					// Indicate if the evolution must be deleted once the endValue is overFlowed
		
		// --- interne ---
		this.uid = unid; 						// Identifiant unique de l'animation
	},
	
	//===| PoyoEvo configuration
	conf: {
		//===| Users Parameters |===//
		'refreshTime':30, 					// Refresh period in ms
		
		//===| Internal Parameters |===//
		'counter':0,
		'listOfEvos':new Array() 			// List the evos curently in process
	},
	
	//===| IDLE function
	start: function()
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
					--i;
				}
			}
			else
			{
				p = iEvo.sf( p);
				poyoCore_setAtribute( iEvo.to, iEvo.tp, iEvo.yf( iEvo.rf(p)));
			}
		}
		
		setTimeout("pe.start()", pe.conf.refreshTime);
	},
	
	
	//===| range functions
	range: {
		fixed: function( startValue, endValue)
		{
			return function( v)
			{
				return ((1-v)*startValue + v*endValue);
			}
		}
	},
	
	//===| syntax functions
	syntax: {
		prefix_suffix: function( prefix, suffix)
		{
			return function( v)
			{
				return prefix + "" + v + "" + suffix;
			}
		},
		
		suffix: function( suffix)
		{
			return pe.syntax.prefix_suffix( "", suffix);
		},
		
		none: function()
		{
			return function( v) { return v;}
		},
		
		grayscale: function()
		{
			return function( v)
			{
				v = parseInt( v);
				return "rgb(" + v + "," + v + "," + v + ")";
			}
		},
		
		bgPosition: function( targetObject, axe, ext)
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
	},
	
	//===| Shape functions
	shape: {
		linear:
			function( p){return p;},
		sin:
			function( p){return 0.5*( 1 + Math.sin(Math.PI*p - Math.PI/2));},
		asin:
			function( p){return 0.5 + (1/Math.PI)*Math.asin(2*p-1);},
		ela:
			function( p){return Math.sqrt(p)+(1-p)*Math.sin(p*4*Math.PI/3);}
	},
	
	//===| Binding functions
	bind: {
		// deltaTime durée avant le démarrage de l'évolution
		time: function( deltaTime, length)
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
		},
		
		// deltaTime écart de temp entre chaque évolution
		// phi : phase de l'évolution
		rotativeTime: function( deltaTime, length, phi)
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
		},
		
		// fonction escalier rotative : utile pour les sprites
		// steps : nombre de pas
		// length : durée de chaque pas !!! en nombre de raffraichissements !!!
		stepTime: function(steps, length)
		{
			var p = steps*length*pe.conf.refreshTime; // periode des oscilations
			
			return function()
			{
				var at = new Date();
				at = at.getTime() % p;
				
				at = parseInt((at/p)*steps);
				
				return at / steps;
			}
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
			}
		},
		
		mouse: function( axe)
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
		},
		
		lazyMouse: function( axe, speed)
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
	},
	
	//===| User functions
	
	delEvo: function( unid)
	{
		for( var i=0; i<pe.conf.listOfEvos.length && pe.conf.listOfEvos[i].uid != unid; ++i);
		
		if( pe.conf.listOfEvos[i].uid == unid)
			pe.conf.listOfEvos.splice( i, 1);
	},
	
	// Création d'une évolution. Contrôle total de l'évolution : utile lorque l'intervale d'évolution varie au cours du temps.
	addEvo: {
		cpl: function( targetObject, targetProperty, pe_range_function, pe_syntax_function, pe_bind_function, pe_shape_function, canUnderBound, canHoverBound, isPersitent, removeDoubles/*=false*/)
		{
			if( removeDoubles != undefined && removeDoubles)
				pe.deleteConflictualEvo( targetObject, targetProperty);
			
			var unid = ++pe.conf.counter;
			pe.conf.listOfEvos.push( new pe.Evo( targetObject, targetProperty, pe_range_function, pe_syntax_function, pe_bind_function, pe_shape_function, canUnderBound, canHoverBound, isPersitent, unid));
			
			return unid;
		},
		
		// Création d'une évolution standard ...
		std: function( targetObject, targetProperty, startValue, endValue, pe_syntax_function, pe_bind_function, pe_shape_function, canUnderBound, canHoverBound, isPersitent, removeDoubles/*=false*/)
		{
			return pe.addEvo.cpl( targetObject, targetProperty, pe.range.fixed(startValue, endValue), pe_syntax_function, pe_bind_function, pe_shape_function, canUnderBound, canHoverBound, isPersitent, removeDoubles);
		},
		
		// fonction dédiée aux évolutions de type animations temporelles.
		ani: function( targetObject, targetProperty, startValue, endValue, pe_syntax_function, deltaTime, length, pe_shape_function, removeDoubles/*=false*/)
		{
			return pe.addEvo.cpl( targetObject, targetProperty, pe.range.fixed(startValue, endValue), pe_syntax_function, pe.bind.time( deltaTime, length), pe_shape_function, false, false, false, removeDoubles);
		},
		
		// fonction dédiée aux évolutions de type sprite.
		sprite: function( targetDiv, img_sprite, nb_img, px_space, timespace, removeDoubles/*=false*/)
		{
			targetDiv.style.backgroundImage = "url('" + img_sprite + "')";
			
			return pe.addEvo.cpl( targetDiv, "style.backgroundPosition", pe.range.fixed(0, nb_img*px_space), pe.syntax.suffix("px 0px"), pe.bind.stepTime(nb_img, timespace), pe.shape.linear, false, false, true, removeDoubles);
		},
	},
	
	//===| Aux functions
	
	// Supprime les annimations ayant pour cible le même objet et la même propriété
	deleteConflictualEvo: function( targetObject, targetProperty)
	{
		for( var i=pe.conf.listOfEvos.length-1; i>=0; --i)
		{
			if( targetObject == pe.conf.listOfEvos[i].to
				&& targetProperty == pe.conf.listOfEvos[i].tp)
			{
				pe.conf.listOfEvos.splice( i, 1);
			}
		}
	}
}

pe.start();