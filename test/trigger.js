var test = require("tap").test,
		_ = require("underscore"),
		expound = require('../index.js');

//All atributes are Accessor Descriptors.  Writable and value are spoofed by modifying get and set
test("methods", { skip:false }, function (t) {
	t.plan(11);
	t.ok(true, "true is ok -- all is right with the universe");
	var obj = {}, keys;
	//Test a builder with a non functions
	obj = {};
	t.throws(	function() {
		expound(obj).property({
			name: "a",
			trigger: 1,
			required: false,
			lazy: false
		});
	}, 'Throws an error');

	obj = {};
	expound(obj).property({
		name: "a",
		value: 37,
		trigger: function (nv, ov) {
			obj.b = 7;
		}
	});
	t.notEqual(obj.b, 7, 'The trigger is not fired at object creation');

	obj.a = 38;
	t.equal(obj.b, 7, 'The trigger is fired when the value is set');
	t.equal(obj.a, 38, 'The value of the triggering attribute was also set');

	//Testing context this should be obj
	obj = {};
	expound(obj).property({
		name: "a",
		value: 37,
		trigger: function (nv, ov) {
			this.b = 7;
		}
	});
	obj.a = 38;
	t.equal(obj.b, 7, 'The context is set correctly');

	//Testing that new and old values are being passed correctly
	obj = {};
	expound(obj).property({
		name: "a",
		value: 37,
		trigger: function (nv, ov) {
			this.nv = nv;
			this.ov = ov;
		}
	});
	obj.a = 38;
	t.equal(obj.nv, 38, 'The new value is being passed correctly');
	t.equal(obj.ov, 37, 'The old value is being passed correctly');

	//Testing that new and old values are being passed correctly
	obj = {};
	expound(obj).property({
		name: "a",
		lazy: false,
		trigger: function (nv, ov) {
			this.nv = nv;
			this.ov = ov;
		}
	});
	obj.a = 38;
	t.equal(obj.nv, 38, 'The new value is being passed correctly');
	t.equal(obj.ov, undefined, 'The old value is being passed correctly');

	//Testing infinite recursion
	obj = {};
	t.throws(	function() {
		expound(obj).property({
			name: "a",
			value: 37,
			trigger: function (nv, ov) {
				this.a = ov;
			}
		});
		obj.a = 38;
	}, 'Throws an error for recursing infinitely');
});
