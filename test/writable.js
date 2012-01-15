var test = require("tap").test,
	build = require('../index.js');

//All atributes are Accessor Descriptors.  Writable and value are spoofed by modifying get and set
test("methods", { skip:false }, function (t) {
	t.plan(7);
	t.ok(true, "true is ok -- all is right with the universe");

	var obj = {};
	//Test a non writable value
	build(obj).property({
		name: "a",
		value: 37,
		writable: false
	});
  t.equal(obj.a, 37, 'Value was properly set and is retrievable');
  obj.a = 38;
  t.equal(obj.a, 37, 'Value was not changed when assigned');

	//Test a writable property
	build(obj).property({
		name: "b",
		value: 37,
		writable: true
	});
  t.equal(obj.b, 37, 'Value was properly set and is retrievable');
  obj.b = 38;
  t.equal(obj.b, 38, 'Value was changed when assigned');

	//Test the default (writable)
	build(obj).property({
		name: "c",
		value: 37
	});
  t.equal(obj.c, 37, 'Value was properly set and is retrievable');
  obj.c = 38;
  t.equal(obj.c, 38, 'Value was changed when assigned');
});
