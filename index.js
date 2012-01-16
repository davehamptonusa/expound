var build,
		Throw = function (msg) {
			throw{
				name: "buildPropertyError",
				message: msg
			}
	  };

build = function(oObj) {
  build.obj = oObj;
  return build;
}

build.property = function(spec) {
	var 
      self = this,
			setFunction,
			valueType = typeof spec.value, 
			valueHasBeenSet = valueType === 'undefined' ? false : true;
			value = valueHasBeenSet ? spec.value : undefined,
			name = spec.name,
      oWritable = typeof spec.writable !== 'undefined' ? spec.writable : true,
      oEnumerable = typeof spec.enumerable !== 'undefined' ? spec.enumerable : true,
      oConfigurable = typeof spec.configurable !== 'undefined' ? spec.configurable : false,
      oRequired = typeof spec.required !== 'undefined' ? spec.required : false,
      oBuilder = typeof spec.builder === 'function' ? spec.builder : undefined,
	    oTrigger = spec.trigger || function () {},
	    oWrap = spec.wrap || undefined;

	//test for required
	oRequired && !valueHasBeenSet && !oBuilder && Throw('Required Property with no value or builder method'); 







	setFunction = function(newValue){
		//Check for writability
		oWritable && (value = newValue);

		//fire trigger
		oTrigger();

		//even attempting to set a non writable object returns the attmepted value.  weird.
		return newValue;
	};  
	Object.defineProperty(self.obj, name, {
		get : function(){ return value; },  
		set : function (newValue) { setFunction(newValue)},
		enumerable : oEnumerable,  
		configurable : oConfigurable
	});  	
	return true;
};

module.exports = build;
