var doc = {};

doc.Evo={};
doc.Evo.doc='<b>PoyEvo Class</b><br/>'
doc.Evo.doc+='It represents a single evolution, and contains most of parameters defined during its creation.<br/>'
doc.Evo.doc+='For now, it is only used internaly.';
	doc.Evo.params={};
	doc.Evo.params.targetObject={};
	doc.Evo.params.targetObject.type='Object';
	doc.Evo.params.targetObject.doc='Contains the object target of the evolution';
	doc.Evo.params.targetProperty={};
	doc.Evo.params.targetProperty.type='string';
	doc.Evo.params.targetProperty.doc='Path to the property target of the evolution';
	doc.Evo.params.pe_range_function={};
	doc.Evo.params.pe_range_function.type='pe.range.function';
	doc.Evo.params.pe_range_function.doc='Function responsible of the range. See : pe.range';
	doc.Evo.params.pe_syntax_function={};
	doc.Evo.params.pe_syntax_function.type='pe.syntax.function';
	doc.Evo.params.pe_syntax_function.doc='Function responsible of the syntax. See : pe.syntax';
	doc.Evo.params.pe_bind_function={};
	doc.Evo.params.pe_bind_function.type='pe.bind.function';
	doc.Evo.params.pe_bind_function.doc='Function responsible of the bind. See : pe.bind';
	doc.Evo.params.pe_shape_function={};
	doc.Evo.params.pe_shape_function.type='pe.shape.function';
	doc.Evo.params.pe_shape_function.doc='Function responsible of the shape. See : pe.shape';
	doc.Evo.params.pe_state_value={};
	doc.Evo.params.pe_state_value.type='pe.state.value';
	doc.Evo.params.pe_state_value.doc='Value containing some behavior parameters on the evolution. See : pe.state';

doc.conf={};
doc.conf.doc='<b>Contains configurations values.</b><br/>'
doc.conf.doc+='Some of them can be modificated directly here, and other are for internal purpose';
	doc.conf.refreshTime={};
	doc.conf.refreshTime.doc='Refresh period in ms.<br/>'
	doc.conf.refreshTime.doc+='Feel free to change it if u want lower CPU load, or better visual effect.<br/>'
	doc.conf.refreshTime.doc+='<i>Default value : 30</i>';
	doc.conf.counter={};
	doc.conf.counter.doc='Intern variable for unique id distribution<br/>'
	doc.conf.counter.doc+='<i>Is intended for internal purposes</i>';
	doc.conf.listOfEvos={};
	doc.conf.listOfEvos.doc='List of evolutions curently in process<br/>'
	doc.conf.listOfEvos.doc+='<i>Is intended for internal purposes</i>';


doc.start={};
doc.start.doc='<b>IDLE function</b><br/>'
doc.start.doc+='This function is automatically called when lib file is included, and will loop until the page is unload.<br/>'
doc.start.doc+='<u>This function must be called only one time ! Don\'t call it manually !</u>';
	doc.start.params={};

doc.state={};
doc.state.doc='<b>State values</b><br/>'
doc.state.doc+='These values give indications on the operating mode of the evolution<br/>'
doc.state.doc+='Several states can be combined using the boolean | operator';
	doc.state.canUnderBound={};
	doc.state.canUnderBound.doc='Indicate if the evolution can go under the startValue';
	doc.state.cUB={};
	doc.state.cUB.doc='Short alias for canUnderBound';
	doc.state.canHoverBound={};
	doc.state.canHoverBound.doc='Indicate if the evolution can overflow the endValue';
	doc.state.cHB={};
	doc.state.cHB.doc='Short alias for canHoverBound';
	doc.state.isPersitent={};
	doc.state.isPersitent.doc='Indicate if the evolution must be deleted once the endValue is overFlowed';
	doc.state.iPE={};
	doc.state.iPE.doc='Short alias for isPersitent';
	doc.state.removeDoubles={};
	doc.state.removeDoubles.doc='Indicate if this evolution must remove doubles when it is created';
	doc.state.rD={};
	doc.state.rD.doc='Short alias for removeDoubles';

doc.range={};
doc.range.doc='<b>Range functions</b><br/>'
doc.range.doc+='Functions used to expand a bind value';
	doc.range.fixed={};
	doc.range.fixed.doc='Classical range : indicate that property will evoluate between 2 fixes values';
		doc.range.fixed.params={};
		doc.range.fixed.params.startValue={};
		doc.range.fixed.params.startValue.type='int/float';
		doc.range.fixed.params.startValue.doc='Low bound of the range';
		doc.range.fixed.params.endValue={};
		doc.range.fixed.params.endValue.type='int/float';
		doc.range.fixed.params.endValue.doc='High bound of the range';

	doc.range.dynamic={};
	doc.range.dynamic.doc='More flexible range : usefull when bound values are subject to change during the evolution';
		doc.range.dynamic.params={};
		doc.range.dynamic.params.startFunction={};
		doc.range.dynamic.params.startFunction.type='function';
		doc.range.dynamic.params.startFunction.doc='Function giving the low bound of the range';
		doc.range.dynamic.params.endFunction={};
		doc.range.dynamic.params.endFunction.type='function';
		doc.range.dynamic.params.endFunction.doc='Function giving the high bound of the range';


doc.syntax={};
doc.syntax.doc='<b>Syntax value</b><br/>'
doc.syntax.doc+='Transform an int to a property value like "5px", or "10%"';
	doc.syntax.prefix_suffix={};
	doc.syntax.prefix_suffix.doc='Prefix and suffix a value for example : 5 -> url("5.jpg")';
		doc.syntax.prefix_suffix.params={};
		doc.syntax.prefix_suffix.params.prefix={};
		doc.syntax.prefix_suffix.params.prefix.type='string';
		doc.syntax.prefix_suffix.params.prefix.doc='Prefix added at begining of the evolution value';
		doc.syntax.prefix_suffix.params.suffix={};
		doc.syntax.prefix_suffix.params.suffix.type='string';
		doc.syntax.prefix_suffix.params.suffix.doc='Suffix added in the end of the evolution value';

	doc.syntax.suffix={};
	doc.syntax.suffix.doc='Sufix a value : 5 -> 5px';
		doc.syntax.suffix.params={};
		doc.syntax.suffix.params.suffix={};
		doc.syntax.suffix.params.suffix.type='string';
		doc.syntax.suffix.params.suffix.doc='Suffix added in the end of the evolution value';

	doc.syntax.none={};
	doc.syntax.none.doc='Keep a value like it is : 5 -> 5';
		doc.syntax.none.params={};

	doc.syntax.grayscale={};
	doc.syntax.grayscale.doc='Put a value in grayscale format : 5 -> rgb(5,5,5)';
		doc.syntax.grayscale.params={};

	doc.syntax.bgPosition={};
	doc.syntax.bgPosition.doc='Put a value in background position format : 5 -> 0px 5px';
		doc.syntax.bgPosition.params={};
		doc.syntax.bgPosition.params.targetObject={};
		doc.syntax.bgPosition.params.targetObject.type='object';
		doc.syntax.bgPosition.params.targetObject.doc='The object target of the animation (needed to reprecise)';
		doc.syntax.bgPosition.params.axe={};
		doc.syntax.bgPosition.params.axe.type='"x" or "y"';
		doc.syntax.bgPosition.params.axe.doc='Precise if syntax must act on first or second parameter of background position';
		doc.syntax.bgPosition.params.ext={};
		doc.syntax.bgPosition.params.ext.type='string';
		doc.syntax.bgPosition.params.ext.doc='Precise unit used to place background (%, px, ...)';


doc.shape={};
doc.shape.doc='<b>Shape functions</b><br/>'
doc.shape.doc+='Give to the evolution a non linear progression';
	doc.shape.linear={};
	doc.shape.linear.doc='Keep evolution as it is';
		doc.shape.linear.params={};

	doc.shape.sin={};
	doc.shape.sin.doc='Evolution will be slown at start and end';
		doc.shape.sin.params={};

	doc.shape.asin={};
	doc.shape.asin.doc='Evolution will be slown on middle';
		doc.shape.asin.params={};

	doc.shape.ela={};
	doc.shape.ela.doc='Make an elastic effect at end of evolution';
		doc.shape.ela.params={};

	doc.shape.pow={};
	doc.shape.pow.doc='Apply a power effect on evolution';
		doc.shape.pow.params={};
		doc.shape.pow.params.f={};
		doc.shape.pow.params.f.type='int/float';
		doc.shape.pow.params.f.doc='The exponent used for the power shape';

	doc.shape.apow={};
	doc.shape.apow.doc='Inverse effect of power';
		doc.shape.apow.params={};
		doc.shape.apow.params.f={};
		doc.shape.apow.params.f.type='int/float';
		doc.shape.apow.params.f.doc='The exponent used for the inverse power shape';

	doc.shape.step={};
	doc.shape.step.doc='Give a step shape to the evolution';
		doc.shape.step.params={};
		doc.shape.step.params.shape_function={};
		doc.shape.step.params.shape_function.type='pe.shape.function';
		doc.shape.step.params.shape_function.doc='Make possible to combine an other shape function with this one';
		doc.shape.step.params.steps={};
		doc.shape.step.params.steps.type='int';
		doc.shape.step.params.steps.doc='Step duration in refresh time tick';


doc.bind={};
doc.bind.doc='<b>Bind functions</b><br/>'
doc.bind.doc+='define which property will be the source of the evolution';
	doc.bind.time={};
	doc.bind.time.doc='Time will be the source (classical animation)';
		doc.bind.time.params={};
		doc.bind.time.params.deltaTime={};
		doc.bind.time.params.deltaTime.type='int';
		doc.bind.time.params.deltaTime.doc='Duration (in ms) between creation of evolution and its begining';
		doc.bind.time.params.duration={};
		doc.bind.time.params.duration.type='int';
		doc.bind.time.params.duration.doc='Duration (in ms) of the evolution';

	doc.bind.rotativeTime={};
	doc.bind.rotativeTime.doc='Time will be source and will periodically revert';
		doc.bind.rotativeTime.params={};
		doc.bind.rotativeTime.params.deltaTime={};
		doc.bind.rotativeTime.params.deltaTime.type='int';
		doc.bind.rotativeTime.params.deltaTime.doc='Duration (in ms) between each time revert';
		doc.bind.rotativeTime.params.duration={};
		doc.bind.rotativeTime.params.duration.type='int';
		doc.bind.rotativeTime.params.duration.doc='Duration (in ms) of each evolution';
		doc.bind.rotativeTime.params.phi={};
		doc.bind.rotativeTime.params.phi.type='int/float';
		doc.bind.rotativeTime.params.phi.doc='Phase of the evolution';

	doc.bind.stepTime={};
	doc.bind.stepTime.doc='Time will be source with a step evolution';
		doc.bind.stepTime.params={};
		doc.bind.stepTime.params.steps={};
		doc.bind.stepTime.params.steps.type='int';
		doc.bind.stepTime.params.steps.doc='Number of step in this evolution';
		doc.bind.stepTime.params.duration={};
		doc.bind.stepTime.params.duration.type='int';
		doc.bind.stepTime.params.duration.doc='Duration (in ms) of the evolution';

	doc.bind.randTime={};
	doc.bind.randTime.doc='Values are given randomly';
		doc.bind.randTime.params={};
		doc.bind.randTime.params.steps={};
		doc.bind.randTime.params.steps.type='int';
		doc.bind.randTime.params.steps.doc='Step duration in refresh time tick between each given random numbers';

	doc.bind.mouse={};
	doc.bind.mouse.doc='Mouse position is the source of the evolution';
		doc.bind.mouse.params={};
		doc.bind.mouse.params.axe={};
		doc.bind.mouse.params.axe.type='"x" or "y"';
		doc.bind.mouse.params.axe.doc='Precise which mouse axe is source';
		doc.bind.mouse.params.speed={};
		doc.bind.mouse.params.speed.type='int/float';
		doc.bind.mouse.params.speed.doc='Speed taken by property to reach the mouse target value';
		doc.bind.mouse.params.speed.comment='optionel';

	doc.bind.scrollBar={};
	doc.bind.scrollBar.doc='ScrollBar position will be the source of the evolution';
		doc.bind.scrollBar.params={};
		doc.bind.scrollBar.params.element={};
		doc.bind.scrollBar.params.element.type='Dom Element';
		doc.bind.scrollBar.params.element.doc='Element whose scrollbar is source';
		doc.bind.scrollBar.params.axe={};
		doc.bind.scrollBar.params.axe.type='"x" or "y"';
		doc.bind.scrollBar.params.axe.doc='Precise which scrollbar axe is source';
		doc.bind.scrollBar.params.speed={};
		doc.bind.scrollBar.params.speed.type='int/float';
		doc.bind.scrollBar.params.speed.doc='Speed taken by property to reach the scrollbar target value';
		doc.bind.scrollBar.params.speed.comment='optionel';

	doc.bind.property={};
	doc.bind.property.doc='Bind the property of an objet as source of evolution';
		doc.bind.property.params={};
		doc.bind.property.params.element={};
		doc.bind.property.params.element.type='object';
		doc.bind.property.params.element.doc='Object whose property is source';
		doc.bind.property.params.property={};
		doc.bind.property.params.property.type='string';
		doc.bind.property.params.property.doc='Path to the property source of the evolution';
		doc.bind.property.params.rangeFtc={};
		doc.bind.property.params.rangeFtc.type='pe.range.function';
		doc.bind.property.params.rangeFtc.doc='Function giving the range of the source property';

	doc.bind.lazyProperty={};
	doc.bind.lazyProperty.doc='Bind the property of an object with lazy effect';
		doc.bind.lazyProperty.params={};
		doc.bind.lazyProperty.params.element={};
		doc.bind.lazyProperty.params.element.type='object';
		doc.bind.lazyProperty.params.element.doc='Object whose property is source';
		doc.bind.lazyProperty.params.property={};
		doc.bind.lazyProperty.params.property.type='string';
		doc.bind.lazyProperty.params.property.doc='Path to the property source of the evolution';
		doc.bind.lazyProperty.params.rangeFtc={};
		doc.bind.lazyProperty.params.rangeFtc.type='pe.range.function';
		doc.bind.lazyProperty.params.rangeFtc.doc='Function giving the range of the source property';
		doc.bind.lazyProperty.params.speed={};
		doc.bind.lazyProperty.params.speed.type='int/float';
		doc.bind.lazyProperty.params.speed.doc='Speed taken by target property to reach the source property value';


doc.overLay={};
doc.overLay.doc='<b>OverLay functions</b><br/>'
doc.overLay.doc+='Some situations needs to overlay the binding function.<br/>'
doc.overLay.doc+='Have a look on the scheme to understand where it is used.';
	doc.overLay.expand={};
	doc.overLay.expand.doc='Expand the classical value of binding function (generaly 0->1)';
		doc.overLay.expand.params={};
		doc.overLay.expand.params.bind_function={};
		doc.overLay.expand.params.bind_function.type='pe.bind.function';
		doc.overLay.expand.params.bind_function.doc='Function responsible of the bind. See : pe.range';
		doc.overLay.expand.params.section={};
		doc.overLay.expand.params.section.type='object';
		doc.overLay.expand.params.section.doc='Expanded values : {low:int/float, high:int/float}';


doc.delEvo={};
doc.delEvo.doc='This function remove an existing evolution.<br/>'
doc.delEvo.doc+='It should be used to clean persistant evos before to remove associated objects.<br/>'
doc.delEvo.doc+='Or to stop runing evolutions before their end.<br/>'
doc.delEvo.doc+='If you need to know which evos are running please use the integrated debug console';
	doc.delEvo.params={};
	doc.delEvo.params.unid={};
	doc.delEvo.params.unid.type='int';
	doc.delEvo.params.unid.doc='Unique id of the evolution';

doc.addEvo={};
doc.addEvo.doc='Contains functions dedicated to the creation of evolutions.<br/>'
doc.addEvo.doc+='The most complete one is "cpl". But the other make possible to create evolutions more simply.';
	doc.addEvo.cpl={};
	doc.addEvo.cpl.doc='The most complete function to create evolutions. Make possible to set the range function';
		doc.addEvo.cpl.params={};
		doc.addEvo.cpl.params.targetObject={};
		doc.addEvo.cpl.params.targetObject.type='object';
		doc.addEvo.cpl.params.targetObject.doc='The object target of the evolution';
		doc.addEvo.cpl.params.targetProperty={};
		doc.addEvo.cpl.params.targetProperty.type='string';
		doc.addEvo.cpl.params.targetProperty.doc='Path to the property target of the evolution';
		doc.addEvo.cpl.params.pe_range_function={};
		doc.addEvo.cpl.params.pe_range_function.type='pe.range.function';
		doc.addEvo.cpl.params.pe_range_function.doc='Function responsible of the range. See : pe.range';
		doc.addEvo.cpl.params.pe_syntax_function={};
		doc.addEvo.cpl.params.pe_syntax_function.type='pe.syntax.function';
		doc.addEvo.cpl.params.pe_syntax_function.doc='Function responsible of the syntax. See : pe.syntax';
		doc.addEvo.cpl.params.pe_bind_function={};
		doc.addEvo.cpl.params.pe_bind_function.type='pe.bind.function';
		doc.addEvo.cpl.params.pe_bind_function.doc='Function responsible of the bind. See : pe.bind';
		doc.addEvo.cpl.params.pe_shape_function={};
		doc.addEvo.cpl.params.pe_shape_function.type='pe.shape.function';
		doc.addEvo.cpl.params.pe_shape_function.doc='Function responsible of the shape. See : pe.shape';
		doc.addEvo.cpl.params.pe_shape_function.comment='=linear';
		doc.addEvo.cpl.params.pe_state_value={};
		doc.addEvo.cpl.params.pe_state_value.type='pe.state.value';
		doc.addEvo.cpl.params.pe_state_value.doc='Value containing some behavior parameters on the evolution. See : pe.state';
		doc.addEvo.cpl.params.pe_state_value.comment='optional';

	doc.addEvo.std={};
	doc.addEvo.std.doc='Classical function to create evolutions. Use a fix range.';
		doc.addEvo.std.params={};
		doc.addEvo.std.params.targetObject={};
		doc.addEvo.std.params.targetObject.type='object';
		doc.addEvo.std.params.targetObject.doc='The object target of the evolution';
		doc.addEvo.std.params.targetProperty={};
		doc.addEvo.std.params.targetProperty.type='string';
		doc.addEvo.std.params.targetProperty.doc='Path to the property target of the evolution';
		doc.addEvo.std.params.startValue={};
		doc.addEvo.std.params.startValue.type='int/float';
		doc.addEvo.std.params.startValue.doc='Low bound of the property value';
		doc.addEvo.std.params.endValue={};
		doc.addEvo.std.params.endValue.type='int/float';
		doc.addEvo.std.params.endValue.doc='High bound of the property value';
		doc.addEvo.std.params.pe_syntax_function={};
		doc.addEvo.std.params.pe_syntax_function.type='pe.syntax.function';
		doc.addEvo.std.params.pe_syntax_function.doc='Function responsible of the syntax. See : pe.syntax';
		doc.addEvo.std.params.pe_bind_function={};
		doc.addEvo.std.params.pe_bind_function.type='pe.bind.function';
		doc.addEvo.std.params.pe_bind_function.doc='Function responsible of the bind. See : pe.bind';
		doc.addEvo.std.params.pe_shape_function={};
		doc.addEvo.std.params.pe_shape_function.type='pe.shape.function';
		doc.addEvo.std.params.pe_shape_function.doc='Function responsible of the shape. See : pe.shape';
		doc.addEvo.std.params.pe_shape_function.comment='=linear';
		doc.addEvo.std.params.pe_state_value={};
		doc.addEvo.std.params.pe_state_value.type='pe.state.value';
		doc.addEvo.std.params.pe_state_value.doc='Value containing some behavior parameters on the evolution. See : pe.state';
		doc.addEvo.std.params.pe_state_value.comment='optional';

	doc.addEvo.ani={};
	doc.addEvo.ani.doc='This function is dedicated to the creation of simple animations. It bind the time to the animation';
		doc.addEvo.ani.params={};
		doc.addEvo.ani.params.targetObject={};
		doc.addEvo.ani.params.targetObject.type='object';
		doc.addEvo.ani.params.targetObject.doc='The object target of the evolution';
		doc.addEvo.ani.params.targetProperty={};
		doc.addEvo.ani.params.targetProperty.type='string';
		doc.addEvo.ani.params.targetProperty.doc='Path to the property target of the evolution';
		doc.addEvo.ani.params.startValue={};
		doc.addEvo.ani.params.startValue.type='int/float';
		doc.addEvo.ani.params.startValue.doc='Low bound of the property value';
		doc.addEvo.ani.params.endValue={};
		doc.addEvo.ani.params.endValue.type='int/float';
		doc.addEvo.ani.params.endValue.doc='High bound of the property value';
		doc.addEvo.ani.params.pe_syntax_function={};
		doc.addEvo.ani.params.pe_syntax_function.type='pe.syntax.function';
		doc.addEvo.ani.params.pe_syntax_function.doc='Function responsible of the syntax. See : pe.syntax';
		doc.addEvo.ani.params.deltaTime={};
		doc.addEvo.ani.params.deltaTime.type='int';
		doc.addEvo.ani.params.deltaTime.doc='Duration (in ms) between creation of evolution and its begining';
		doc.addEvo.ani.params.duration={};
		doc.addEvo.ani.params.duration.type='int';
		doc.addEvo.ani.params.duration.doc='Duration (in ms) of the evolution';
		doc.addEvo.ani.params.pe_shape_function={};
		doc.addEvo.ani.params.pe_shape_function.type='pe.shape.function';
		doc.addEvo.ani.params.pe_shape_function.doc='Function responsible of the shape. See : pe.shape';
		doc.addEvo.ani.params.removeDoubles={};
		doc.addEvo.ani.params.removeDoubles.type='Boolean';
		doc.addEvo.ani.params.removeDoubles.doc='Indicate if evolution must check if there is doubles when created';
		doc.addEvo.ani.params.removeDoubles.comment='=false';

	doc.addEvo.sprite={};
	doc.addEvo.sprite.doc='This function is specialised in sprite creation';
		doc.addEvo.sprite.params={};
		doc.addEvo.sprite.params.targetDiv={};
		doc.addEvo.sprite.params.targetDiv.type='Dom Element';
		doc.addEvo.sprite.params.targetDiv.doc='The DOM element whose background will be animated to give the sprite animation';
		doc.addEvo.sprite.params.img_sprite={};
		doc.addEvo.sprite.params.img_sprite.type='string';
		doc.addEvo.sprite.params.img_sprite.doc='Path to the image which contain the sprite';
		doc.addEvo.sprite.params.nb_img={};
		doc.addEvo.sprite.params.nb_img.type='int';
		doc.addEvo.sprite.params.nb_img.doc='Number of images in the sprite';
		doc.addEvo.sprite.params.px_space={};
		doc.addEvo.sprite.params.px_space.type='int';
		doc.addEvo.sprite.params.px_space.doc='Width in pixels of one sprite element';
		doc.addEvo.sprite.params.timespace={};
		doc.addEvo.sprite.params.timespace.type='int';
		doc.addEvo.sprite.params.timespace.doc='Time in tick between 2 sprites pictures';
		doc.addEvo.sprite.params.removeDoubles={};
		doc.addEvo.sprite.params.removeDoubles.type='Boolean';
		doc.addEvo.sprite.params.removeDoubles.doc='Indicate if evolution must check if there is doubles when created';
		doc.addEvo.sprite.params.removeDoubles.comment='=false';

	doc.addEvo.dragDrop={};
	doc.addEvo.dragDrop.doc='This function is an all in one function dedicated to drag&drop';
		doc.addEvo.dragDrop.params={};
		doc.addEvo.dragDrop.params.targetObject={};
		doc.addEvo.dragDrop.params.targetObject.type='Dom Element';
		doc.addEvo.dragDrop.params.targetObject.doc='The DOM element which will be drag and dropped';
		doc.addEvo.dragDrop.params.callBackFunction={};
		doc.addEvo.dragDrop.params.callBackFunction.type='function';
		doc.addEvo.dragDrop.params.callBackFunction.doc='Function to call when the element is dropped';
		doc.addEvo.dragDrop.params.callBackFunction.comment='optionel';

	doc.addEvo.bgEffect={};
	doc.addEvo.bgEffect.doc='This function is an all in one function dedicated to background images animation effects';
		doc.addEvo.bgEffect.params={};
		doc.addEvo.bgEffect.params.targetObject={};
		doc.addEvo.bgEffect.params.targetObject.type='Dom Element';
		doc.addEvo.bgEffect.params.targetObject.doc='The DOM element whose background will be animated';
		doc.addEvo.bgEffect.params.speed={};
		doc.addEvo.bgEffect.params.speed.type='int/float';
		doc.addEvo.bgEffect.params.speed.doc='Speed taken by property to reach the scrollbar target value';
		doc.addEvo.bgEffect.params.speed.comment='optionel';

	doc.addEvo.fadeIn={};
	doc.addEvo.fadeIn.doc='All in one function to realise a fade in effect';
		doc.addEvo.fadeIn.params={};
		doc.addEvo.fadeIn.params.targetObject={};
		doc.addEvo.fadeIn.params.targetObject.type='Dom Element';
		doc.addEvo.fadeIn.params.targetObject.doc='The DOM element which will fade in';
		doc.addEvo.fadeIn.params.duration={};
		doc.addEvo.fadeIn.params.duration.type='int';
		doc.addEvo.fadeIn.params.duration.doc='Duration (in ms) of the evolution';
		doc.addEvo.fadeIn.params.removeDoubles={};
		doc.addEvo.fadeIn.params.removeDoubles.type='Boolean';
		doc.addEvo.fadeIn.params.removeDoubles.doc='Indicate if evolution must check if there is doubles when created';
		doc.addEvo.fadeIn.params.removeDoubles.comment='=false';

	doc.addEvo.fadeOut={};
	doc.addEvo.fadeOut.doc='All in one function to realise a fade out effect';
		doc.addEvo.fadeOut.params={};
		doc.addEvo.fadeOut.params.targetObject={};
		doc.addEvo.fadeOut.params.targetObject.type='Dom Element';
		doc.addEvo.fadeOut.params.targetObject.doc='The DOM element which will fade out';
		doc.addEvo.fadeOut.params.duration={};
		doc.addEvo.fadeOut.params.duration.type='int';
		doc.addEvo.fadeOut.params.duration.doc='Duration (in ms) of the evolution';
		doc.addEvo.fadeOut.params.removeDoubles={};
		doc.addEvo.fadeOut.params.removeDoubles.type='Boolean';
		doc.addEvo.fadeOut.params.removeDoubles.doc='Indicate if evolution must check if there is doubles when created';
		doc.addEvo.fadeOut.params.removeDoubles.comment='=false';


doc.setEvo={};
doc.setEvo.doc='Contains functions managing evolutions once they are created';
	doc.setEvo.callBack={};
	doc.setEvo.callBack.doc='Set a callBack function to an existing evo';
		doc.setEvo.callBack.params={};
		doc.setEvo.callBack.params.unid={};
		doc.setEvo.callBack.params.unid.type='int';
		doc.setEvo.callBack.params.unid.doc='Unique id of the evolution';
		doc.setEvo.callBack.params.callBackFunction={};
		doc.setEvo.callBack.params.callBackFunction.type='function';
		doc.setEvo.callBack.params.callBackFunction.doc='Callback function to be called once evolution is finished';


doc.aux={};
doc.aux.doc='Contains functions intended for internal use';
	doc.aux.searchEvo={};
	doc.aux.searchEvo.doc='Search an evolution inside list of existing one, by id';
		doc.aux.searchEvo.params={};
		doc.aux.searchEvo.params.unid={};
		doc.aux.searchEvo.params.unid.type='int';
		doc.aux.searchEvo.params.unid.doc='Unique id of the evolution';

	doc.aux.deleteConflictualEvo={};
	doc.aux.deleteConflictualEvo.doc='Remove evolutions that may enter in conflict with the one given';
		doc.aux.deleteConflictualEvo.params={};
		doc.aux.deleteConflictualEvo.params.targetObject={};
		doc.aux.deleteConflictualEvo.params.targetObject.type='object';
		doc.aux.deleteConflictualEvo.params.targetObject.doc='The object we want to check if he has a double evolution';
		doc.aux.deleteConflictualEvo.params.targetProperty={};
		doc.aux.deleteConflictualEvo.params.targetProperty.type='string';
		doc.aux.deleteConflictualEvo.params.targetProperty.doc='The property we want to check if it is not doubled';


