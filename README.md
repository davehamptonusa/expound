The purpose of 'expound' is to be able to construct your objects in a declarative fashion.  This allows all of the relavant code to be logically near each other in the codebase as well as affords built in functionailty for things you do anyways.  Type checking, triggers, wrappers, private variables etc,

It uses the new ecma script 5 property descriptors to works its mojo.  Normally, property descriptors can be either data descriptors or accessor descriptors - but not both.  'expound' enables you to have the functionailty of both in a familiar syntax.

```javascript
	var expound = require(expound);// expound is a useful word that can be used as either to define or describe.

	expound(myObject).property({
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
		wrap: function (next, assignmentValue) {
			var returnValue;
			console.log('things to do before setting the value');
			returnValue = next();
			console.log('print the returnValue' + returnValue);
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

1. things to do before setting the value or running a function
2. value actually set to 43
3. print thereturnValue 43
4. other important function to run after this value is set or function run

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

### builder
> the builder method, if defined, is called when the value has never been set to populate the value of the attribute.  The builder method is called either immediately, if `lazy:false` and serves to assign default values.
> However, to delay building until needed, you can set `lazy=true` and the value is not built until the value is required.  This is handy if the buildtime of the value is heavy and perhaps isn't often needed.  Like an md5 sum.  It's generally a good practice to move build methods to the lazy state.

### lazy (default: false)
> Defines when the builder method runs if an attribute is created without a value.  Immediately upon creating it (like a default value) if `lazy=false` or only upon retrieving the value if `lazy=true`.

### trigger
> The trigger option is a CODE reference which will be called after the value of the attribute is set. The function is called in the context of the calling object and is passed the updated value, and the old value.  Triggers are not fired at object creation. Triggers do not alter the return value or the value.  Attempting to set the attribute that the trigger is tied to within the trigger function will cause an infinite recursion.  I don't think anyone has time for that.

### wrap
> The wrap function is called in the context of the calling object and allows you to run code and possibly alter the input (right hand value of the assigment - so the '37' in `obj.a=37`).  Although you have access to the returnValue of the assignment, you can not change the return value from the assignment.  Further, re-setting the value of the attribute within the attributes wrap function may easily cause an infinite recursion. 

> In most cases it is better to use a coercion to augment the right-hand value on the way in, a type to validate a right-hand value and a trigger to enact some form of code on the way out.

ALSO coming....

Meta information about properties...

```javascript
expound(myObj).hasBeenSet("a") -> returns whether the myObj.a has ever been set.;
expound(myObj).clear("a") -> sets value to undefined and hasBeenSet to false.;
expound(myObj).history("a") -> returns an array of the stored history of the properties values.;
expound(myObj).isRequired("a");
expound(myObj).isConfigurable("a");
expound(myObj).hasBuilder("a");
expound(myObj).isLazy("a");
expound(myObj).hasTrigger("a");
expound(myObj).typeOf("a");
```
You can see where this is going....





