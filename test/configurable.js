var test = require("tap").test,
		_ = require("underscore"),
		expound = require('../index.js');

//All atributes are Accessor Descriptors.  Writable and value are spoofed by modifying get and set
test("methods", { skip:false }, function (t) {
	t.plan(4);
	t.ok(true, "true is ok -- all is right with the universe");
	var obj = {}, descriptor;
	//Test a configurable value
	expound(obj).property({
		name: "a",
		value: 37,
		configurable: true
	});
	descriptor = Object.getOwnPropertyDescriptor( obj, "a" );
	t.equal(descriptor.configurable, true, 'The object is configurable');

	obj = {};
	//Test a configurable value but using default
	expound(obj).property({
		name: "a",
		value: 37,
	});
	descriptor = Object.getOwnPropertyDescriptor( obj, "a" );
	t.equal(descriptor.configurable, false, 'The object defaults to non-configurable');

	obj = {};
	//Test an non-enumerable value
	expound(obj).property({
		name: "a",
		value: 37,
		configurable: false
	});
	descriptor = Object.getOwnPropertyDescriptor( obj, "a" );
	t.equal(descriptor.configurable, false, 'The object is non-configurable');


});
