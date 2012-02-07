var
		expound, extend,
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
			configurable: false,
			required: false,
			lazy: true,
			valueHasBeenSet: false
		},

		property = function(spec) {
			var 
				self = this,
				target = _.include(Object.keys(this), 'obj') ? this.obj : this,
				prop = {
					//tool for type constraint checking....
					passesTypeConstraint: function (superType) {
						//Determine if we are checking our self or the passed in value
						var type = (superType || this.type), 
							checkType;

						//Bail if we have nothing to check 
						if (!type) { return true; }
						checkType = self.types[type];
						
						//Check parents recursively
						checkType && checkType.extendsType && this.passesTypeConstraint(checkType.extendsType);
						if (checkType && !checkType.constraint(this.value)) {
							this.value = undefined;
							this.valueHasBeenSet = false;
							Throw('Value does not pass type constraint. Expecting: ' + type);
						}
						return true;
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
			spec.type && (typeof self.types[spec.type] !== 'undefined' || Throw(spec.type + ' is not a defined Type Constraint'));

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
				prop.wrap.call(target, func, newValue);
			}));

			Object.defineProperty(target, prop.name, function () {
				var definition = {};
				
				definition.get = function() {
					!prop.valueHasBeenSet && prop.builder && ((prop.value = prop.builder.call(target)) || Throw('Builder Function does not return'));
					prop.valueHasBeenSet = true;
					prop.passesTypeConstraint();
					return prop.value;	
				};
				definition.set = function (newValue) { 
					prop.setValue(newValue)
					//fire trigger
					prop.trigger && prop.trigger.call(target, prop.value, prop.oldValue);
				};
				definition.enumerable = prop.enumerable;	
				definition.configurable = prop.configurable;
				return definition;
			}());		
			return self;
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

property.call(expound, {
	name: "property",
	value: property,
	writable: false
});

//Can't use expound on this as its needed in the constructor
expound.types = {
	"isArray": { constraint: function (arg) { return _.isArray(arg); }},
	"isBoolean": { constraint:  function (arg) { return _.isBoolean(arg); }},
	"isDate": { constraint: function (arg) { return _.isDate(arg); }},
	"isFunction": { constraint: function (arg) { return _.isFunction(arg); }},
	"isNumber": { constraint: function (arg) { return _.isNumber(arg); }},
	"isString": { constraint: function (arg) { return _.isString(arg); }},
	"isRegExp": { constraint: function (arg) { return _.isRegExp(arg); }},
	"isObject": { constraint: function(arg) { return (typeof arg === 'object' &&  !_.isArray(arg) && !_.isRegExp(arg) && !_.isFunction(arg)); }}
};

//Set the base constraint as Null
_.each(expound.types, function (type) {
	type.extendsType = null;
});

// Grab a handle to expound myself
extend = expound(expound);
//expound.property when called without an object extends expound itself.  Useful for plug-ins
extend.property({
	name: "addType",
	value: function (type, extendsType, func) {
		
		(typeof this.types[extendsType] === 'undefined') && Throw(extendsType + ' is not a defined Type Constraint.');
		this.types[type] = {
			constraint: func,
			extendsType: extendsType
		};
		return this;
	},
	writable: false
});

extend.property({
	name: 'hasType',
	value: function (name) {
		return typeof this.types[name] === 'object' ? true : false;;
	},
	writable: false
});

module.exports = expound;

