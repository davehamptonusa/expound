var test = require("tap").test,
	expound = require('../index.js');

//All atributes are Accessor Descriptors.  Writable and value are spoofed by modifying get and set
test("methods", { skip:false }, function (t) {
	t.plan(3);
	t.ok(true, "true is ok -- all is right with the universe");

	var obj1 = {},
			obj2 = {},
			holder1,
			holder2;

	//Test a that the object is properly recieving a prototype and not being broken
	// or interfering with other object altering
	holder1 = expound(obj1);
	holder2 = expound(obj2);
	
	holder1.property({
		name: "a",
		value: 37,
		writable: true
	});
	holder2.property({
		name: "a",
		value: 38,
		writable: true
	});
	t.equal(obj1.a, 37, 'Value was properly set and is retrievable');
	t.equal(obj2.a, 38, 'Value was properly set and is retrievable');
});
