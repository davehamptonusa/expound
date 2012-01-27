var test = require("tap").test,
		_ = require("underscore"),
		expound = require('../index.js');

//All atributes are Accessor Descriptors.  Writable and value are spoofed by modifying get and set
test("methods", { skip:false }, function (t) {
	t.plan(16);
	t.ok(true, "true is ok -- all is right with the universe");
	var obj = {}, keys;
	//Test a builder with a non functions
	obj = {};
	t.throws(	function() {
		expound(obj).property({
			name: "a",
			wrap: 1,
			required: false,
			lazy: false
		});
	}, 'Wrap must be a function');

	obj = {};
	expound(obj).property({
		name: "a",
		value: 37,
		wrap: function (next, assignmentValue) {
			var returnValue;
			obj.b = 7;
			returnValue = next(assignmentValue);
			obj.c = returnValue + 1;
		},
		trigger: function (nv, ov) {
			obj.d = 'foo'
		}
	});
	t.notEqual(obj.b, 7, 'The wrap is not fired at object creation');
	t.type(obj.c, 'undefined', 'The wrap is not fired at object creation');
	t.type(obj.d, 'undefined', 'The trigger is not fired at object creation');

	obj.a = 38;
	t.equal(obj.b, 7, 'The wrap is fired when the value is set');
	t.equal(obj.a, 38, 'The value of the assignment was also set');
	t.equal(obj.c, 39, 'The wrap is fired when the value is set');
	t.equal(obj.d, 'foo', 'The trigger was fired');

	//Do the whole thiing again with 'this'
	obj = {};
	expound(obj).property({
		name: "a",
		value: 37,
		wrap: function (next, assignmentValue) {
			var returnValue;
			this.b = 7;
			returnValue = next(assignmentValue);
			this.c = returnValue + 1;
		},
		trigger: function (nv, ov) {
			this.c = 'foo'
			this.d = 'foo'
		}
	});
	t.notEqual(obj.b, 7, 'The wrap is not fired at object creation');
	t.type(obj.c, 'undefined', 'The wrap is not fired at object creation');
	t.type(obj.d, 'undefined', 'The trigger is not fired at object creation');

	obj.a = 38;
	t.equal(obj.b, 7, 'The wrap is fired when the value is set');
	t.equal(obj.a, 38, 'The value of the assignment was also set');
	t.equal(obj.c, 'foo', 'The itrigger fired after the wrap');
	t.equal(obj.d, 'foo', 'The trigger was fired');
});
