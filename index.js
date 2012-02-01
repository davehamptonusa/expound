var
		expound,
		Throw = function (msg) {
			throw{
				name: "expoundError",
				message: msg
			}
		},
		util = require('util'),
		_ = require('underscore'),
		defaultProps = {
			writable: true,
			enumerable: true,
			comfigurable: false,
			required: false,
			lazy: true,
			valueHasBeenSet: false
		};

expound = function(obj) {
	// return a version of expound derived from prototype.
	// that has the object tied to it.
	var instance = Object.create(expound);

	instance.obj = obj;
	//for subclassing of types
	instance.types = Object.create(expound.types);
	return instance;
}

expound.property = function(spec) {
	var 
		self = this,
		prop = {
			//tool for type constraint checking....
			passesTypeConstraint: function () {
				if (this.type && !self.types[this.type](this.value)) {
					this.value = undefined;
					this.valueHasBeenSet = false;
					Throw('Value does not pass type constraint. Expecting: ' + this.type);
				}
			}
		};

	//make sure the spec isn't full of garbage
	//Name
	_.isString(spec.name) || Throw('The name of the attribute must be a string');
	// Booleans
	_.each( _.intersection(['writable', 'enumerable', 'configurable', 'required', 'lazy'], Object.keys(spec)), function (attr) {
		_.isBoolean(spec[attr]) || Throw(attr + ' attribute must be boolean');
	});
	//Functions
	_.each( _.intersection(['wrap', 'trigger', 'builder'], Object.keys(spec)), function (attr) {
		_.isFunction(spec[attr]) || Throw(attr + ' attribute must be ia Function');
	});
	//Type Constraints
	spec.type && (typeof self.types[spec.type] || Throw(spec.type + ' is not a defined Type Constraint'));

	//Extend our model
	_.extend(prop, defaultProps, spec);

	//Flag whether the value has been set
	_.include(Object.keys(prop), 'value') && (prop.valueHasBeenSet = true);

	//test for required
	prop.required && !prop.valueHasBeenSet && !prop.builder && Throw('Required Property with no value or builder method'); 

	//Assign a value to default or non-lazy builders
	if ( !prop.valueHasBeenSet && prop.builder && !prop.lazy ) {
		((prop.value = prop.builder.call(self.ob)) || Throw('Builder Function does not return'));
		prop.valueHasBeenSet = true;
	}

	//Throw an error for Building a non-required lazy object without a value or builder throws an error.
	!prop.valueHasBeenSet && !prop.required && prop.lazy && !prop.builder && Throw('Inconcievable Situation.  Not Required, lazy object without value or builder.');

	//check for type passing and reset values if need be
	prop.valueHasBeenSet && prop.passesTypeConstraint();


	//Create the base setFunciton
	prop.setValue = function(newValue){
		prop.oldValue = prop.value;

		//Check for writability
		prop.writable && (prop.value = newValue) && (prop.valueHasBeenSet = true);
		prop.passesTypeConstraint();

		//even attempting to set a non writable object returns the attmepted value.	weird.
		return newValue;
	};	

	//wrap the setFunction if wrapping
	prop.wrap && (prop.setValue = _.wrap(prop.setValue, function (func, newValue) {
		prop.wrap.call(self.obj, func, newValue);
	}));

	Object.defineProperty(self.obj, prop.name, function () {
		var definition = {};
		
		definition.get = function() {
			!prop.valueHasBeenSet && prop.builder && ((prop.value = prop.builder.call(self.obj)) || Throw('Builder Function does not return'));
			prop.valueHasBeenSet = true;
			prop.passesTypeConstraint();
			return prop.value;	
		};
		definition.set = function (newValue) { 
			prop.setValue(newValue)
			//fire trigger
			prop.trigger && prop.trigger.call(self.obj, prop.value, prop.oldValue);
		};
		definition.enumerable = prop.enumerable;	
		definition.configurable = prop.configurable;
		return definition;
	}());		
	return self;
};

expound.types = {
	"isArray": function (arg) {
		return _.isArray(arg);
	},
	"isBoolean": function (arg) {
		return _.isBoolean(arg);
	},
	"isDate": function (arg) {
		return _.isDate(arg);
	},
	"isFunction": function (arg) {
		return _.isFunction(arg);
	},
	"isNumber": function (arg) {
		return _.isNumber(arg);
	},
	"isString": function (arg) {
		return _.isString(arg);
	},
	"isRegExp": function (arg) {
		return _.isRegExp(arg);
	},
};

expound.addType = function (name, func) {
	this.types[name] = func;
	return this;
}

module.exports = expound;

