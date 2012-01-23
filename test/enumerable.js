var test = require("tap").test,
		_ = require("underscore"),
		expound = require('../index.js');

//All atributes are Accessor Descriptors.  Writable and value are spoofed by modifying get and set
test("methods", { skip:false }, function (t) {
	t.plan(3);
	t.ok(true, "true is ok -- all is right with the universe");
	var obj = {};
	//Test an enumerable value
	expound(obj).property({
		name: "a",
		value: 37,
		enumerable: true
	});
	_.each(obj, function(value, key) {
		t.ok(true, 'This only runs if its enumerable');
	});

	obj = {};
	//Test an enumerable value but using default
	expound(obj).property({
		name: "a",
		value: 37,
	});
	_.each(obj, function(value, key) {
		t.ok(true, 'This only runs if its enumerable');
	});

	obj = {};
	//Test an non-enumerable value
	expound(obj).property({
		name: "a",
		value: 37,
		enumerable: false
	});
	_.each(obj, function(value, key) {
		//not including this test in plan - since it shouldn't run
		t.ok(true, 'This only runs if its enumerable');
	});

});
