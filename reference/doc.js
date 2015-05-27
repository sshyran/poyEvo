var doc = {};

doc.Evo={};
doc.Evo.doc='<b>PoyEvo Class</b><br/>'
doc.Evo.doc+='It represents a single evolution, and contains most of parameters defined during its creation.<br/>'
doc.Evo.doc+='For now, it is only used internaly.';
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
doc.start.doc='<b>IDLE function</b>This function is automatically called when lib file is included, and will loop until the page is unload.<br/>'
doc.start.doc+='<u>This function must be called only one time ! Don\'t call it manually !</u>';
doc.state={};
doc.state.doc='<b>State values</b><br/>These values give indications on the operating mode of the evolution<br/>Several states can be combined using the boolean | operator';
	doc.state.canUnderBound={};
	doc.state.canUnderBound.doc='Indicate if the evolution can go under the startValue';
	doc.state.canHoverBound={};
	doc.state.canHoverBound.doc='Indicate if the evolution can overflow the endValue';
	doc.state.isPersitent={};
	doc.state.isPersitent.doc='Indicate if the evolution must be deleted once the endValue is overFlowed';
	doc.state.removeDoubles={};
	doc.state.removeDoubles.doc='Indicate if this evolution must remove doubles when it is created';

doc.range={};
doc.range.doc='<b>Range functions</b>Functions used to expand a bind value';
	doc.range.fixed={};
	doc.range.fixed.doc='Classical range : indicate that property will evoluate between 2 fixes values';
	doc.range.dynamic={};
	doc.range.dynamic.doc='More flexible range : bound values can change during the evolution, and are given by functions';

doc.syntax={};
doc.syntax.doc='Transform an int to a property value like "5px", or "10%"';
	doc.syntax.prefix_suffix={};
	doc.syntax.prefix_suffix.doc='Prefix and suffix a value for example : 5 -> url("5.jpg")';
	doc.syntax.suffix={};
	doc.syntax.suffix.doc='Sufix a value : 5 -> 5px';
	doc.syntax.none={};
	doc.syntax.none.doc='Keep a value like it is : 5 -> 5';
	doc.syntax.grayscale={};
	doc.syntax.grayscale.doc='Put a value in grayscale format : 5 -> rgb(5,5,5)';
	doc.syntax.bgPosition={};
	doc.syntax.bgPosition.doc='Put a value in background position format : 5 -> 0px 5px';

doc.shape={};
doc.shape.doc='Shape functions : give the evolution a non linear progression';
	doc.shape.linear={};
	doc.shape.linear.doc='Keep evolution as it is';
	doc.shape.sin={};
	doc.shape.sin.doc='Evolution will be slown at start and end';
	doc.shape.asin={};
	doc.shape.asin.doc='Evolution will be slown on middle';
	doc.shape.ela={};
	doc.shape.ela.doc='Make an elastic effect at end of evolution';
	doc.shape.pow={};
	doc.shape.pow.doc='Apply a power effect on evolution';
	doc.shape.apow={};
	doc.shape.apow.doc='Inverse effect of power';
	doc.shape.step={};
	doc.shape.step.doc='Give a step shape to the evolution';

doc.bind={};
doc.bind.doc='Bind functions : define which property will be the source of the evolution';
	doc.bind.time={};
	doc.bind.time.doc='Time will be the source (classical animation)';
	doc.bind.rotativeTime={};
	doc.bind.rotativeTime.doc='Time will be source and will periodically revert';
	doc.bind.stepTime={};
	doc.bind.stepTime.doc='Time will be source with a step evolution';
	doc.bind.randTime={};
	doc.bind.randTime.doc='Values are given randomly';
	doc.bind.mouse={};
	doc.bind.mouse.doc='Mouse position is the source of the evolution';
	doc.bind.scrollBar={};
	doc.bind.scrollBar.doc='ScrollBar position will be the source of the evolution';
	doc.bind.property={};
	doc.bind.property.doc='Bind the property of an objet as source of evolution';
	doc.bind.lazyProperty={};
	doc.bind.lazyProperty.doc='Bind the property of an object with lazy effect';

doc.overLay={};
doc.overLay.doc='OverLay functions : Some situations needs to overlay the binding function';
	doc.overLay.expand={};
	doc.overLay.expand.doc='Expand the classical value of binding function (generaly 0->1)';

doc.delEvo={};
doc.delEvo.doc='TODO';
doc.addEvo={};
doc.addEvo.doc='TODO';
	doc.addEvo.cpl={};
	doc.addEvo.cpl.doc='TODO';
	doc.addEvo.std={};
	doc.addEvo.std.doc='TODO';
	doc.addEvo.ani={};
	doc.addEvo.ani.doc='TODO';
	doc.addEvo.sprite={};
	doc.addEvo.sprite.doc='TODO';
	doc.addEvo.dragDrop={};
	doc.addEvo.dragDrop.doc='TODO';
	doc.addEvo.bgEffect={};
	doc.addEvo.bgEffect.doc='TODO';

doc.setEvo={};
doc.setEvo.doc='TODO';
	doc.setEvo.callBack={};
	doc.setEvo.callBack.doc='TODO';

doc.aux={};
doc.aux.doc='TODO';
	doc.aux.searchEvo={};
	doc.aux.searchEvo.doc='TODO';
	doc.aux.deleteConflictualEvo={};
	doc.aux.deleteConflictualEvo.doc='TODO';