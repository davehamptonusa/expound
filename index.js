var expound,
		Throw = function (msg) {
			throw{
				name: "expoundError",
				message: msg
			}
		},
		alteredObjects = {};

expound = function(obj) {
	//need to return a version of build derived from prototype.
	// that has the object tied to it.
	var returnBuild = Object.create(expound);
	returnBuild.obj = obj;
	return returnBuild;
}

expound.property = function(spec) {
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
		prop.lazy = typeof spec.lazy !== 'undefined' ? spec.lazy : false,
		prop.builder = typeof spec.builder === 'function' ? spec.builder : undefined,
		prop.trigger = spec.trigger || function () {},
		prop.wrap = spec.wrap || undefined;

	//test for required
	prop.required && !prop.valueHasBeenSet && !prop.builder && Throw('Required Property with no value or builder method'); 

	//Assign a value to default or non-lazy builders
	!prop.valueHasBeenSet && prop.builder && !prop.lazy && ((prop.value = prop.builder()) || Throw('Builder Function does not return'));
  
	//Throw an error for Building a non-required lazy object without a value or builder throws an error.
	!prop.valueHasBeenSet && !prop.required && prop.lazy && !prop.builder && Throw('Inconcievable Situation.  Not Required, lazy object without value or builder.');







	prop.setFunction = function(newValue){
		//Check for writability
		prop.writable && (prop.value = newValue);

		//fire trigger
		prop.trigger();

		//even attempting to set a non writable object returns the attmepted value.	weird.
		return newValue;
	};	

	prop.getFunction = function() {
		!prop.valueHasBeenSet && prop.builder && ((prop.value = prop.builder()) || Throw('Builder Function does not return'));
		return prop.value;	
	};

	Object.defineProperty(self.obj, prop.name, {
		get : prop.getFunction,	
		set : function (newValue) { prop.setFunction(newValue)},
		enumerable : prop.enumerable,	
		configurable : prop.configurable
	});		
	return true;
};

module.exports = expound;

