The purpose of buildProperties is to be able to construct your objects in a declarative fashion.  This allows all of the relavant code to be logically near each other in the codebase as well as affords built in functionailty for things you do anyways.  Type checking, triggers, wrappers, private variables etc,

It uses the new ecma script 5 property descriptors to works its mojo.  Normally, property descriptors can be either data descriptors or accessor descriptors - but not both.  buildProperty enables you to have the functionailty of both in a familiar syntax.

```javascript
build(myObject).property({
	name: 'foo',
	value: 42,
	writable: true,
	enumerable: true,
	configurable: false,
	required: true,
	lazy: true,
	trigger: function (newValue, oldValue) {
		console.log('other important function to run after this value is set');
	},
	wrap: function (next) {
	  console.log('things to do before setting the value');
		next();
	  console.log('things to do after setting the value');
	},
	builder: function () {//runs to build the value if not passed in or, if lazy, on initial get
	},
	type: 'array', //or a prototypeOf or a custom type like isValidUser
	//TO BE ADDED IN FUTURE
	//coerce: Takes a value and uses the defined type to create the property.  for example, pass in the user ID, but have it auto and build the user object and store that in the property
	//delgates: useful for calling other methods in the context of this attribute
	//enableRollback:  Allows attribute values to be rolled back.  Takes integer (0++).  Zero means no rollback.  Keeps history up to value given. keyword 'forever' keeps indefinate history until you run out of memory...
	//rollback: takes an integer.  Rolls back the value to the nth previous version.  Fails if version doesn't exist.  enableRollback must be true.  Rollbacks will be wrapped and trigger.  Not available for functions.
});
```	  

In the above example, running `myObject.foo = 43;` will run like this:

```
things to do before setting the value or running a function

\\value actually set to 43

things to do after setting the value or running a function

other important function to run after this value is set or function run
```

### name
>Specifies the property name as in the 'bar' part of `foo.bar`.

### value
>Specifies the value of the property.  If not passed in, specify a builder to build the value immediately (like a default) or -- if lazy is `true` builds the first time its value is called.  See lazy below fir more info. 

### writable (default: true)
> Boolean to set whether or not you may change the value of the property

### enumerable (default: true)
> Same as ECMAScript 5: True if and only if the type of this property descriptor may be changed and if the property may be deleted from the corresponding object.

### configurable (default: false)
> Same as ECMAScript 5: True if and only if this property shows up during enumeration of the properties on the corresponding object.

### required (default: false)
> Boolean stating whether the value is required at construction.  If required, a value must be passed in or it must have a builder method.

### trigger
> _Non-function property:_ The trigger option is a CODE reference which will be called after the value of the attribute is set. The CODE ref is passed the instance itself, the updated value, and the original value if the attribute was already set.


> _Function property:_ The trigger option is a CODE reference which will be called after the function is called.  It will be passed the return value of the function. The original values of the function will still be returned to the orignal caller.  If you wish to change these values, consider using `wrap`.

isa => $type_name
The isa option uses Moose's type constraint facilities to set up runtime type checking for this attribute. Moose will perform the checks during class construction, and within any accessors. The $type_name argument must be a string. The string may be either a class name or a type defined using Moose's type definition features. (Refer to Moose::Util::TypeConstraints for information on how to define a new type, and how to retrieve type meta-data).

required => (1|0)
This marks the attribute as being required. This means a value must be supplied during class construction, or the attribute must be lazy and have either a default or a builder. Note that c<required> does not say anything about the attribute's value, which can be undef.


lazy => (1|0)??
This will tell the class to not create this slot until absolutely necessary. If an attribute is marked as lazy it must have a default or builder supplied.

trigger => $code
The trigger option is a CODE reference which will be called after the value of the attribute is set. The CODE ref is passed the instance itself, the updated value, and the original value if the attribute was already set.

wrap

handles => ARRAY | HASH | REGEXP | ROLE | ROLETYPE | DUCKTYPE | CODE

builder => Str
The value of this key is the name of the method that will be called to obtain the value used to initialize the attribute. See the builder option docs in Class::MOP::Attribute and/or Moose::Cookbook::Basics::Recipe8 for more information.

default => SCALAR | CODE
The value of this key is the default value which will initialize the attribute.


clearer => Str
Creates a method allowing you to clear the value. See the clearer option docs in Class::MOP::Attribute for more information.

predicate => Str
Creates a method to perform a basic test to see if a value has been set in the attribute. See the predicate option docs in Class::MOP::Attribute for more information.


