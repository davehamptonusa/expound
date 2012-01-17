var test = require("tap").test,
		_ = require("underscore"),
		build = require('../index.js');

//All atributes are Accessor Descriptors.  Writable and value are spoofed by modifying get and set
test("methods", { skip:false }, function (t) {
	t.plan(9);
	t.ok(true, "true is ok -- all is right with the universe");
	var obj = {}, keys;
	//Test a required value
	build(obj).property({
		name: "a",
		value: 37,
		required: true
	});
	t.equal(typeof obj.a, 'number', 'The object is created with value and required');

	obj = {};
	//Test a non-required value
	build(obj).property({
		name: "a",
		value: 37,
		required: false
	});
	t.equal(typeof obj.a, 'number', 'The object is created with value and not required');

	//Test a required value without a value - corect way with t.throws
	obj = {};
	t.throws(	function() {
		build(obj).property({
			name: "a",
			required: true
		})
	}, 'Throws an error');
	t.equal(typeof obj.a, 'undefined', 'The object is not created.');

	//Test a required value without a value - not as good way
	obj = {};

	try {
		build(obj).property({
			name: "a",
			required: true
		});
	}
	catch(e) {
		t.equal('buildPropertyError', e.name, 'Throws an error');
		t.equal(typeof obj.a, 'undefined', 'The object is not created.');
	}

	//Test a required with no value but with a builder
	build(obj).property({
		name: "a",
		builder: function() { return 37; },
		required: true
	});
	keys = Object.keys(obj);
	t.equal(keys[0], "a", 'Attribute has been created with no value.');
	t.equal(typeof obj.a, 'undefined', 'The object is created with value and required');

	obj = {};
});
