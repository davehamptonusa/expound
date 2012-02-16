var test = require("tap").test,
	expound = require('../index.js');

//All atributes are Accessor Descriptors.  Writable and value are spoofed by modifying get and set
test("methods", { skip:false }, function (t) {
	t.plan(12);
	t.ok(true, "true is ok -- all is right with the universe");

	var obj = {};
	//Test a non writable value
	expound(obj).property({
		name: "a",
		value: 37,
		writable: false
	});
  t.equal(obj.a, 37, 'Value was properly set and is retrievable');
  t.throws(function () {
		obj.a = 38;
	}, 'Cant rewrite to a non-writable property');
  t.equal(obj.a, 37, 'Value was not changed when assigned');

	//Test a writable property
	expound(obj).property({
		name: "b",
		value: 37,
		writable: true
	});
  t.equal(obj.b, 37, 'Value was properly set and is retrievable');
  obj.b = 38;
  t.equal(obj.b, 38, 'Value was changed when assigned');

	//Test the default (writable)
	expound(obj).property({
		name: "c",
		value: 37
	});
  t.equal(obj.c, 37, 'Value was properly set and is retrievable');
  obj.c = 38;
  t.equal(obj.c, 38, 'Value was changed when assigned');
	
	//If unassigned at declaration, you should be able to write to it once
	expound(obj).property({
		name: "d",
		writable: false
	});
	t.doesNotThrow(function () {
		obj.d = 37;
	}, 'value can be written to if it was never set.');
  t.equal(obj.d, 37, 'Value was properly set and is retrievable');
  t.throws(function () {
		obj.a = 38;
	}, 'Cant rewrite to a non-writable property');
  t.equal(obj.a, 37, 'Value was not changed when assigned');
});
