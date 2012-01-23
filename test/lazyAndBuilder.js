var test = require("tap").test,
		_ = require("underscore"),
		expound = require('../index.js');

//All atributes are Accessor Descriptors.  Writable and value are spoofed by modifying get and set
test("methods", { skip:false }, function (t) {
	t.plan(37);
	t.ok(true, "true is ok -- all is right with the universe");
	var obj = {}, keys;
	//Test a lazy value
	t.doesNotThrow(	function() {
		expound(obj).property({
			name: "a",
			builder: function () {
				return 37
			},
			required: true,
			lazy: true
		});
	}, 'Building a required, lazy property with a builder does  not throw an error.');

	t.equal(typeof obj.a, 'number', 'The object is created and typeof works');
	t.equal(obj.a, 37, 'The object is with the builder method and evals correctly');

	obj = {};
	t.doesNotThrow(	function() {
		expound(obj).property({
			name: "a",
			builder: function () {
				return 37
			},
			required: true,
			lazy: false
		});
	}, 'Building a required, non-lazy property with a builder does  not throw an error.');

	t.equal(typeof obj.a, 'number', 'The object is created and typeof works');
	t.equal(obj.a, 37, 'The object is with the builder method and evals correctly');

	obj = {};
	t.doesNotThrow(	function() {
		expound(obj).property({
			name: "a",
			builder: function () {
				return 37
			},
			required: false,
			lazy: true
		});
	}, 'Building a non-required, lazy property with a builder does  not throw an error.');

	t.equal(typeof obj.a, 'number', 'The object is created and typeof works');
	t.equal(obj.a, 37, 'The object is with the builder method and evals correctly');

	obj = {};
	t.doesNotThrow(	function() {
		expound(obj).property({
			name: "a",
			builder: function () {
				return 37
			},
			required: false,
			lazy: false
		});
	}, 'Building a non-required non-lazy property with a builder does  not throw an error.');

	t.equal(typeof obj.a, 'number', 'The object is created and typeof works');
	t.equal(obj.a, 37, 'The object is with the builder method and evals correctly');

	obj = {};
	t.throws(	function() {
		expound(obj).property({
			name: "a",
			lazy: true
		});
	}, 'Building a non-required lazy object without a value or builder throws an error.');

	t.equal(typeof obj.a, 'undefined', 'The object is created and typeof works');

	obj = {};
	t.doesNotThrow(	function() {
		expound(obj).property({
			name: "a",
			lazy: false
		});
	}, 'Building a non-required non-lazy object without a value or builder does not throw an error.');

	t.equal(typeof obj.a, 'undefined', 'The object is created and typeof works');
	obj.a = 37;
	t.equal(obj.a, 37, 'The object is with the builder method and evals correctly');

	// Now DO IT AGAIN BUT SET VALUES
	
	t.ok(true, "true is ok -- all is right with the universe");
	var obj = {}, keys;
	//Test a lazy value
	t.doesNotThrow(	function() {
		expound(obj).property({
			name: "a",
			value: 'foo',
			builder: function () {
				return 37
			},
			required: true,
			lazy: true
		});
	}, 'Building a required, lazy property with a builder and value does  not throw an error.');

	t.equal(typeof obj.a, 'string', 'The object is created and typeof works');
	t.equal(obj.a, 'foo', 'The object is with the builder method and evals correctly');

	obj = {};
	t.doesNotThrow(	function() {
		expound(obj).property({
			name: "a",
			value: 'foo',
			builder: function () {
				return 37
			},
			required: true,
			lazy: false
		});
	}, 'Building a required, non-lazy property with a builder and value does  not throw an error.');

	t.equal(typeof obj.a, 'string', 'The object is created and typeof works');
	t.equal(obj.a, 'foo', 'The object is with the builder method and evals correctly');

	obj = {};
	t.doesNotThrow(	function() {
		expound(obj).property({
			name: "a",
			value: 'foo',
			builder: function () {
				return 37
			},
			required: false,
			lazy: true
		});
	}, 'Building a non-required, lazy property with a value and builder does  not throw an error.');

	t.equal(typeof obj.a, 'string', 'The object is created and typeof works');
	t.equal(obj.a, 'foo', 'The object is with the builder method and evals correctly');

	obj = {};
	t.doesNotThrow(	function() {
		expound(obj).property({
			name: "a",
			value: 'foo',
			builder: function () {
				return 37
			},
			required: false,
			lazy: false
		});
	}, 'Building a non-required non-lazy property with a value and builder does  not throw an error.');

	t.equal(typeof obj.a, 'string', 'The object is created and typeof works');
	t.equal(obj.a, 'foo', 'The object is with the builder method and evals correctly');

	obj = {};
	t.doesNotThrow(	function() {
		expound(obj).property({
			name: "a",
			value: 'foo',
			lazy: true
		});
	}, 'Building a non-required lazy object with a value but no builder throws an error.');

	t.equal(typeof obj.a, 'string', 'The object is created and typeof works');
	t.equal(obj.a, 'foo', 'The object is with the builder method and evals correctly');

	obj = {};
	t.doesNotThrow(	function() {
		expound(obj).property({
			name: "a",
			value: 'foo',
			lazy: false
		});
	}, 'Building a non-required non-lazy object without a value or builder does not throw an error.');

	t.equal(typeof obj.a, 'string', 'The object is created and typeof works');
	t.equal(obj.a, 'foo', 'The object is with the builder method and evals correctly');
});
