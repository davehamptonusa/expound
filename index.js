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
			valueHasBeenSet: false,
			coerce: false
		},
		//Private function to build values or throw error
		buildValue = function (target) {
 			try {
				this.value = this.builder.call(target);
			}
			catch(err) {
				Throw('Builder Function does not return for attribute ' + this.name + '. Gives: ' + err.message);
			}
		},

		property = function(spec) {
			var 
				self = this,
				target = _.include(Object.keys(this), 'obj') ? this.obj : this,
				prop = {
					//tool for type constraint checking....
					passesTypeConstraint: function () {
						var coercions, coercionNames, activeCoercion,
							resetValueAndThrow = function (message) {
								this.value = undefined;
								this.valueHasBeenSet = false;
								Throw(message);
							},
							checkConstraint = function (type) {
								var checkType;
								//Bail if we have nothing to check 
								if (!type) { return true; }
								(checkType = self.types[type]) || Throw('Type Constraint "' + type +'" No longer exists.');
								
								//Check parents recursively
								checkType.extendsType && checkConstraint.call(this, checkType.extendsType);
								if (!checkType.constraint(this.value)) {
									Throw('Value does not pass type constraint. Expecting: ' + type);
								}
								return true;
							};
						try{
							return checkConstraint.call(this, this.type);
						}

						//This is the entire coercion funcitonality
						//
						catch(err){
							//Check to see if we have coerce set and if the type has coercions
							coercions = self.types[this.type].coerceFrom;
							coercionNames = Object.keys(coercions);
							if (!this.coerce || coercionNames.length === 0) {
								resetValueAndThrow(err.message);
							}

							//If it does, find the first coercion that matches the value
							activeCoercion = _.find(coercionNames, function (fromType) {
								try {
									var foo = checkConstraint.call(this, fromType);
									return checkConstraint.call(this, fromType);
								}
								catch (err) {
									return false;
								}
							}, this);
							//and then run the function associated with that coercion
							if (activeCoercion) {
								this.value = coercions[activeCoercion](this.value);
							}
							else {
								resetValueAndThrow(err.message + '. Coerce is set to true, but the value does not match any registered coercions for the type');
							}
							//try to check the constraint against the new value
							try {
								checkConstraint.call(this, this.type);
							}
							catch(err) {
								resetValueAndThrow('Coerced ' + err.message);
							}
						}
						return true;
					}
				};

			//make sure the spec isn't full of garbage
			//Name
			_.isString(spec.name) || Throw('The name of the attribute must be a string');
			// Booleans
			_.each( _.intersection(['writable', 'enumerable', 'configurable', 'required', 'lazy', 'coerce'], Object.keys(spec)), function (attr) {
				_.isBoolean(spec[attr]) || Throw(attr + ' attribute must be boolean');
			});
			//Functions
			_.each( _.intersection(['wrap', 'trigger', 'builder'], Object.keys(spec)), function (attr) {
				_.isFunction(spec[attr]) || Throw(attr + ' attribute must be ia Function');
			});
			//Type Constraints
			spec.type && (typeof self.types[spec.type] !== 'undefined' || Throw(spec.type + ' is not a defined Type Constraint for' + spec.name));

			//Extend our model
			_.extend(prop, defaultProps, spec);

			//Flag whether the value has been set
			_.include(Object.keys(prop), 'value') && (prop.valueHasBeenSet = true);

			//test for required
			prop.required && !prop.valueHasBeenSet && !prop.builder && Throw('Required Property with no value or builder method for ' + spec.name); 

			//Assign a value to default or non-lazy builders
			if ( !prop.valueHasBeenSet && prop.builder && !prop.lazy ) {
				buildValue.call(prop, target);
				prop.valueHasBeenSet = true;
			}

			//check for type passing and reset values if need be
			prop.valueHasBeenSet && prop.passesTypeConstraint();


			//Create the base setFunciton
			prop.setValue = function(newValue){
				prop.oldValue = prop.value;

				//Check for writability
				!prop.writable && prop.valueHasBeenSet && Throw ('Can not rewrite to a non-writable property for attribute: '+ spec.name);

				prop.value = newValue;
				prop.valueHasBeenSet = true;
				prop.passesTypeConstraint();

				return prop.value;
			};	

			//wrap the setFunction if wrapping
			prop.wrap && (prop.setValue = _.wrap(prop.setValue, function (func, newValue) {
				prop.wrap.call(target, func, newValue);
			}));

			Object.defineProperty(target, prop.name, function () {
				var definition = {};
				
				definition.get = function() {
					!prop.valueHasBeenSet && prop.builder && buildValue.call(prop, target);
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
	type.coerceFrom ={};
});

// Grab a handle to expound myself
extend = expound(expound);
//expound.property when called without an object extends expound itself.  Useful for plug-ins
extend.property({
	name: "addType",
	value: function (type, extendsType, func) {
		
		if (typeof this.types[extendsType] === 'undefined' &&
			extendsType !== null) {
			Throw('When adding type ' + extendsType + ' is not "null" or a defined Type Constraint.');
    }
		this.types[type] = {
			constraint: func,
			extendsType: extendsType,
			coerceFrom: {}
		};
		return this;
	},
	writable: false
});

extend.property({
	name: 'hasType',
	value: function (name) {
		return typeof this.types[name] === 'object' ? true : false;
	},
	writable: false
});

extend.property({
	name: 'addCoercion',
	value: function (type, from, func) {
		//Check Variables
		(typeof this.types[type] === 'undefined') && Throw(type + ' is not a defined Type Constraint.');
		(typeof this.types[from] === 'undefined') && Throw(from + ' is not a defined Type Constraint.');
		_.isFunction(func) || Throw('You must coerce using a function.');

		//Assign
		this.types[type].coerceFrom[from] = func;
		return this;
	},
	writable: false
});
module.exports = expound;

