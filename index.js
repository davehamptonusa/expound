var build,
		Throw = function (msg) {
			throw{
				name: "buildPropertyError",
				message: msg
			}
		},
		alteredObjects = {};

build = function(obj) {
	//need to return a version of build derived from prototype.
	// that has the object tied to it.
	var returnBuild = Object.create(build);
	returnBuild.obj = obj;
	return returnBuild;
}

build.property = function(spec) {
	var 
			self = this,
			prop = {};

	//define the basics of the new property based on the spec
		prop.valueType = typeof spec.value, 
		prop.valueHasBeenSet = prop.valueType === 'undefined' ? false : true;
		prop.value = prop.valueHasBeenSet ? spec.value : undefined,
		prop.name = spec.name,
		prop.writable = typeof spec.writable !== 'undefined' ? spec.writable : true,
		prop.enumerable = typeof spec.enumerable !== 'undefined' ? spec.enumerable : true,
		prop.configurable = typeof spec.configurable !== 'undefined' ? spec.configurable : false,
		prop.required = typeof spec.required !== 'undefined' ? spec.required : false,
		prop.builder = typeof spec.builder === 'function' ? spec.builder : undefined,
		prop.trigger = spec.trigger || function () {},
		prop.wrap = spec.wrap || undefined;

	//test for required
	prop.required && !prop.valueHasBeenSet && !prop.builder && Throw('Required Property with no value or builder method'); 







	prop.setFunction = function(newValue){
		//Check for writability
		prop.writable && (prop.value = newValue);

		//fire trigger
		prop.trigger();

		//even attempting to set a non writable object returns the attmepted value.	weird.
		return newValue;
	};	
	Object.defineProperty(self.obj, prop.name, {
		get : function(){ return prop.value; },	
		set : function (newValue) { prop.setFunction(newValue)},
		enumerable : prop.enumerable,	
		configurable : prop.configurable
	});		
	return true;
};

module.exports = build;

