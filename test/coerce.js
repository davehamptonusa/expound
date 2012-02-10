var test = require("tap").test,
		_ = require("underscore"),
		expound = require('../index.js');

//All atributes are Accessor Descriptors.  Writable and value are spoofed by modifying get and set
test("methods", { skip:false }, function (t) {
	t.plan(9);
	t.ok(true, "true is ok -- all is right with the universe");
	//To add a new coercion, globally.
	t.doesNotThrow( function () {
		expound.addCoercion('isNumber', 'isArray', function (value) {
    	// In this non-real example, were going to assume that the first value in an array is what they really meant.
			return value[0];
		});
	}, 'Creating a global coercion does not fail');
	//then later
  var myObj={}, meta_myObj;
	t.doesNotThrow(function () {
		meta_myObj = expound(myObj).property({
			name: 'a',
			type: 'isNumber',
			coerce: true
		});
	}, 'Adding a coercion to type with a coercion does not fail.');

	//Now we can safely do this
	t.doesNotThrow(function () {
		myObj.a = [45];
	}, 'assigning a value needed to be coerced does not fail.');
	t.ok(myObj.a === 45, 'Value is coerced into a number');

	//Now lets try to do an undefined coercion
	t.throws(function () {
		myObj.a = {a:45};
	}, 'assigning a value needed to be but with no coercion fails.');
	t.doesNotThrow( function () {
		meta_myObj.addCoercion('isNumber', 'isString', function (value) {
    	// In this non-real example, were going to assume that it somehow translated the word to anumber
			return 7;
		});
	}, 'using a local handle to add a gloabl coercion does not fail');
	//reusing the old object...
	t.doesNotThrow(function () {
		myObj.a = 'seven';
	}, 'assigning a value needed to be coerced does not fail.');
	t.ok(myObj.a === 7, 'Value is coerced into a number');
});
