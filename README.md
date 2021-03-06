# expound.js

The purpose of 'expound' is to be able to construct your objects in a declarative fashion.  This allows all of the relavant code to be logically near each other in the codebase as well making convenient functionailty for things you do anyways.  Type checking, triggers, wrappers, private variables etc.  Primarily for use in constructors.

It uses the new ecma script 5 property descriptors to works its mojo.  Normally, property descriptors can be either data descriptors or accessor descriptors - but not both.  'expound' enables you to have the functionailty of both in a familiar syntax.

Because it uses ECMAScript 5, it's not yet safe to use in the browser world, but should be fine to use in a firefox or chrome extension. It has been primarialy designed for use with [node.js](http://nodejs.org).

expound provides around 10 attributes useful for quickly defining an attribute. It also has a handful of functions useful for defining types at both an object and a "global" level.

As a side note, asynchronous assignments can easily be handled through using a module like [async.js](https://github.com/caolan/async) or other asynchronous tool.  Application level type constraints can easily be added by subclassing expound to your own local version, adding types at the global level, and then exporting the localized expound to your various modules.

## Quick Examples

```javascript
	var expound = require('expound');
	// expound is a useful word that can be used as either to define or describe.

	var meta_myObj = expound(myObject).property({
		//this shows every available option
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
		type: 'isNumber',
		coerce: true
	});
	
	meta_myObject.property({
		//this shows a typical one, reusing an object handle
		name: 'bar',
		builder: function () { return this.foo * 42},
		type: 'isNumber',
	});
	
	//To add a new type, "globally"
	expound.addType('isLessThanTen', 'isNumber', function (value) {
		return expound.types.isNumber(value) && value < 10;
	});
```	  

In the above example, running `myObject.foo = 43;` will run like this:

1. things to do before setting the value or running a function
2. value actually set to 43
3. print thereturnValue 43
4. other important function to run after this value is set or function run

## Download

Releases are available for download from
[GitHub](http://github.com/davehamptonusa/expound/tags).
Alternatively, you can install using Node Package Manager (npm):

    npm install expound


## Documentation

### Attributes

These are the attributes for the `property() method`

* [name](#name)
* [value](#value)
* [writable](#writable)
* [enumerable](#enumerable)
* [configurable](#configurable)
* [required](#required)
* [lazy](#lazy)
* [trigger](#trigger)
* [wrap](#wrap)
* [builder](#builder)
* [type](#type)
* [coerce](#coerce)

### Methods

* [property](#property)
* [setType](#setType)
* [hasType](#hasType)
* [addCoercion](#addCoercion)

###[Road Map](#roadmap)

## Attributes

<a name="name" />
### name
>Specifies the property name as in the 'bar' part of `foo.bar`.

<A NAME="value" />
### value
>Specifies the value of the property.  If not passed in, specify a builder to build the value immediately (like a default) or -- if lazy is `true` builds the first time its value is called.  See lazy below fir more info. 

<A NAME="writable" />
### writable (default: true)
> Boolean to set whether or not you may change the value of the property.  All values are writable at least once.  So if you create an attibute without a value set, you can still set it.  But if writable is set to false, you can not re-write it.  If you create a property with the value set in the constructor of that property, you can not write to it.  Internally, it checks to see if a 'hasBeenSet' flag has been marked as true.

<A NAME="enumerable" />
### enumerable (default: true)
> Same as ECMAScript 5: True if and only if the type of this property descriptor may be changed and if the property may be deleted from the corresponding object.

<A NAME="configurable" />
### configurable (default: false)
> Same as ECMAScript 5: True if and only if this property shows up during enumeration of the properties on the corresponding object.

<A NAME="required" />
### required (default: false)
> Boolean stating whether the value is required at construction.  If required, a value must be passed in or it must have a builder method.

<A NAME="builder" />
### builder
> The builder method, if defined, is called in the context of the attribute's object.  When the value has never been set to populate the value of the attribute.  The builder method is called either immediately, if `lazy:false` and serves to assign default values.

> However, to delay building until needed, you can set `lazy=true` and the value is not built until the value is required.  This is handy if the buildtime of the value is heavy and perhaps isn't often needed.  Like an md5 sum.  It's generally a good practice to move build methods to the lazy state.

<A NAME="lazy" />
### lazy (default: true)
> Defines when the builder method runs if an attribute is created without a value.  Immediately upon creating it (like a default value) if `lazy=false` or only upon retrieving the value if `lazy=true`.

> Object constructors should _always_ have lazy builders.  If not, the builder will throw an error and the attribute will force itself into lazy mode, setting the correct value when the value is retrieved.

> USING LAZY BUILDERS IS THE PREFERRED METHOD OF ALL VALUE ASSIGNMENTS.

<A NAME="trigger" />
### trigger
> The trigger option is a CODE reference which will be called after the value of the attribute is set. The function is called in the context of the attribute's object and is passed the updated value, and the old value.  Triggers are not fired at object creation. Triggers do not alter the return value or the value.  Attempting to set the attribute that the trigger is tied to within the trigger function will cause an infinite recursion.  I don't think anyone has time for that.

<A NAME="wrap" />
### wrap
> The wrap function is called in the context of the calling object and allows you to run code and possibly alter the input (right hand value of the assigment - so the '37' in `obj.a=37`).  Although you have access to the returnValue of the assignment, you can not change the return value from the assignment.  Further, re-setting the value of the attribute within the attributes wrap function may easily cause an infinite recursion. 

> In most cases it is better to use a coercion to augment the right-hand value on the way in, a type to validate a right-hand value and a trigger to enact some form of code on the way out.

<A NAME="type" />
### type
> The type attribute allows you to specify the type of the attibute for type checking.  You can add your own custom types at the object or "global" level.

> Types you get for free are provided through [underscore](http://documentcloud.github.com/underscore):

* isBoolean
* isArray
* isDate
* isFunction
* isNumber
* isRegExp
* isString
* isObject

<A NAME="coerce" />
### coerce (default: false)
> If true, attempts to coerce a value based on any coercions associated with the type field if the initial type constraint fails.


## Methods

<A NAME="expound" />
### expound(OBJ)

Used to create a meta-object handle on an object.  All locally defined types will bind to this object alone.  The handle can be used to add properties to the same object using the same scope.

__ARGUMENTS__

* OBJ - The object to bind the meta-object handle to.

__RETURNS__

An expound meta-object.  You can call other methods against this.  It is chaninable.

__EXAMPLE__

````javascript
	// CREATE A META-OBJECT HANDLE

	var meta_myObj = expound(myObj);

	//Then later
	meta_myObj.addType(...);
	meta_myObj.property({...});	
````
---------------------------------------

<A NAME="property" />
### property(SPEC)

Used to define an objects property.  See the documentation above at [attributes](#attributes) for details.

__ARGUMENTS__

* SPEC - An attributes spec as defined above.

__RETURNS__

An expound meta-object.  You can call other methods against this.  It is chaninable.

__EXAMPLE__

````javascript
	// CREATE "myObj.a" WITH A TYPE CONSTRAINT

  var myObj={};
	var meta_myObj = expound(myObj).property({
		name: 'a',
		type: 'isArray'
	});
````

---------------------------------------

<A NAME="addType" />
### addType(NAME, EXTENDS, FUNCTION)

Used to add types to either the "Global" expound instance or a local meta-object handle of an object.  Types usually extend an existing type. This is useful for creating hierachies of type checks and for coercions.

__ARGUMENTS__

* NAME - A Unique Name to add as a type.  Names are stored in a hash, and handle types descend from the global type, so you can overwrite them.  Names are shared amongst all types (Global, object and Sub) so you may find it useful to use a naming convention like `isInteger::IsNumber`.  But it is not necssary.
* EXTENDS - The name of the type that this is extending.  This type must exist in either the object or the global typelist.  It will recursively check its type extension hierachry starting at the top and working down.  So if `isInteger` extends `isNumber`, and `isLessThanTen` extends `isInteger` expound will check to see if the value passes `isNumber`, then `isInteger` and then finally `isLessTahnTen`.
* FUNCTION (VALUE) - The function should parse the value and return true if it passes, false otherwise.

__RETURNS__

this

__EXAMPLE__

````javascript

	//To add a new type, "globally"
	expound.addType('isLessThanTen', 'isNumber', function (value) {
		return value < 10;
	});
	var meta_myObj = expound(myObj);
````
---------------------------------------

<A NAME="addCoercion" />
### addCoercion(TYPE, FROM, FUNCTION)

Used to add coercions to types.  All Coercions are added to types and are called if the property constructor has `coerce: true` set AND the initial type constraint fails.  They can, however, be added to an object, via its meta-handle, or to expound directly.  

If the inital type constraint fails, the value is first tested against the FROM value, which is a named type or sub-type. If it matches the FUNCTION argument is run to coerce it to the correct type.  That return value is then type checked against the property's type constraint.

You can call `addCoercion()` multiple times on the same type to add coercions from different FROM types.

Coercions run only at the first level, so you can't coerce a subtype to another type that needs to be coerced.  That would be just lazy.

__ARGUMENTS__

* TYPE - The Type name that will have a coercion added to it.
* FROM - The type that the passed in value will be compared against. If the value validates as a valid FROM type, the coercion function will be run to get the coerced value.
* FUNCTION (VALUE) - The function should parse the value and return the coerced value.

__RETURNS__

this

__EXAMPLE__

````javascript

	//To add a new coercion, globally.
	expound.addCoercion('isNumber', 'isArray', function (value) {
    // In this non-real example, were going to assume that the first value in an array is what they really meant.
		return value[0];
	});

	//then later
  var myObj={};
	var meta_myObj = expound(myObj).property({
		name: 'a',
		type: 'isNumber',
		coerce: true
	});

	//Now we can safely do this
	myObj.a = [45];

  //And it will safely assign the number 45 to myObj.a
````
---------------------------------------
<A NAME="roadmap" />
## On the RoadMap
		//delgates: useful for calling other methods in the context of this attribute
		//enableRollback:  Allows attribute values to be rolled back.  Takes integer (0++).  Zero means no rollback.  Keeps history up to value given. keyword 'forever' keeps indefinate history until you run out of memory...
		//rollback: takes an integer.  Rolls back the value to the nth previous version.  Fails if version doesn't exist.  enableRollback must be true.  Rollbacks will be wrapped and trigger.  Not available for functions.

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
