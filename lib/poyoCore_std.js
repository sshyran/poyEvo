var poyoCore_mouse = {x: 0, y: 0, trackerStarted: false};

function gebid( id)
{
	return document.getElementById( id);
}

function reloadMe()
{
	window.location.reload(true);
}

function applySeveralDatas( tDatas)
{
	for( var key in tDatas)
	{
		gebid( key).innerHTML = tDatas[key];
	}
}

// targetProperty examples : "style.display"
function poyoCore_setAtribute( targetObject, targetProperty, value)
{
	var propertyPath = targetProperty.split(".");
	
	for( var i=0; i<propertyPath.length -1; ++i)
	{
		targetObject = targetObject[propertyPath[i]];
	}
	
	targetObject[propertyPath[propertyPath.length-1]] = value;
}

function poyoCore_trackMouse()
{
	if( !poyoCore_mouse.trackerStarted)
	{
		poyoCore_mouse.trackerStarted = true;
		
		document.addEventListener('mousemove', function(e){ 
			poyoCore_mouse.x = e.clientX || e.pageX; 
			poyoCore_mouse.y = e.clientY || e.pageY;
		}, false);
	}
}

function poyoCore_wHeight()
{
	return window.innerHeight;
}

function poyoCore_wWidth()
{
	return window.innerWidth;
}

function poyoCore_getInnerDim( elt)
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
			var uDims = poyoCore_getInnerDim( elt.children[i]);
			
			dims.w = Math.max( dims.w, uDims.w + dims.x);
			dims.h = Math.max( dims.h, uDims.h + dims.y);
		}
	
	return dims;
}

//~ function setalpha(object, value) 
//~ {
//~ 	object.style.opacity = (value / 100);
//~ 	object.style.MozOpacity = (value / 100);
//~ 	object.style.KhtmlOpacity = (value / 100);
//~ 	object.style.filter = "alpha(opacity=" + value + ")";
//~ }
