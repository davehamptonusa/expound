The purpose of buildProperties is to be able to construct your objects in a declarative fashion.  This allows all of the relavant code to be logically near each other in the codebase as well as affords built in functionailty for things you do anyways.  Type checking, triggers, wrappers, private variables etc,

It uses the new ecma script 5 property descriptors to works its mojo.  Normally, property descriptors can be either data descriptors or accessor descriptors - but not both.  buildProperty enables you to have the functionailty of both in a familiar syntax.

```javascript
var build, introspect;  //the two variables are just for semantic naming.  Require as you wish... 
build = introspect = require(buildProperty);

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

ALSO coming....

Meta information about properties...
```javascript
introspect(myObj).hasBeenSet("a") -> returns whether the myObj.a has ever been set.
introspect(myObj).clear("a") -> sets value to undefined and hasBeenSet to false.
introspect(myObj).history("a") -> returns an array of the stored history of the properties values.
introspect(myObj).isRequired("a");
introspect(myObj).isConfigurable("a");
introspect(myObj).hasBuilder("a");
introspect(myObj).isLazy("a");
introspect(myObj).hasTrigger("a");
introspect(myObj).typeOf("a");
```
You can see where this is going....





