var pc = pc ? pc : {};

pc.mouse = {x: 0, y: 0, trackerStarted: false};

function gebid( id)
{
	return document.getElementById( id);
}

pc.reloadMe = function()
{
	window.location.reload(true);
}

pc.goPage = function( url)
{
	window.location.href = url;
}

pc.goPage_fct = function( url)
{
	return function(){
		goPage( url);
	}
}

pc.applySeveralDatas = function( tDatas)
{
	for( var key in tDatas)
	{
		gebid( key).innerHTML = tDatas[key];
	}
}

// targetProperty examples : "style.display"
pc.setAtribute = function( targetObject, targetProperty, value)
{
	var propertyPath = targetProperty.split(".");
	
	for( var i=0; i<propertyPath.length -1; ++i)
	{
		targetObject = targetObject[propertyPath[i]];
	}
	
	targetObject[propertyPath[propertyPath.length-1]] = value;
}

pc.getAtribute = function( targetObject, targetProperty)
{
	var propertyPath = targetProperty.split(".");
	
	for( var i=0; i<propertyPath.length -1; ++i)
	{
		targetObject = targetObject[propertyPath[i]];
	}
	
	return targetObject[propertyPath[propertyPath.length-1]];
}

pc.trackMouse = function()
{
	if( !pc.mouse.trackerStarted)
	{
		pc.mouse.trackerStarted = true;
		
		document.addEventListener('mousemove', function(e){ 
			pc.mouse.x = e.clientX || e.pageX; 
			pc.mouse.y = e.clientY || e.pageY;
		}, false);
	}
}

pc.wHeight = function()
{
	return window.innerHeight;
}

pc.wWidth = function()
{
	return window.innerWidth;
}

// return real dimensions of content of elt
pc.getInnerDim = function( elt)
{
	var dims = {
		'x':elt.offsetLeft,
		'y':elt.offsetTop,
		'w':elt.offsetWidth,
		'h':elt.offsetHeight
	};
	
	if( elt.children != undefined)
		for( var i=0; i<elt.children.length; ++i)
		{
			var uDims = pc.getInnerDim( elt.children[i]);
			
			dims.w = Math.max( dims.w, uDims.w + dims.x);
			dims.h = Math.max( dims.h, uDims.h + dims.y);
		}
	
	return dims;
}

// return position of object relative to browser windows
pc.getAbsPos = function( elt)
{
	var px = 0;
	var py = 0;
	do
	{
		px += elt.offsetLeft || 0;
		py += elt.offsetTop || 0;
		elt = elt.offsetParent;
	} while(elt);

	return {
		'x': px,
		'y': py
	};
};

//~ function setalpha(object, value) 
//~ {
//~ 	object.style.opacity = (value / 100);
//~ 	object.style.MozOpacity = (value / 100);
//~ 	object.style.KhtmlOpacity = (value / 100);
//~ 	object.style.filter = "alpha(opacity=" + value + ")";
//~ }
