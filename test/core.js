var test = require("tap").test,
	expound = require('../index.js');

//All atributes are Accessor Descriptors.  Writable and value are spoofed by modifying get and set
test("methods", { skip:false }, function (t) {
	t.plan(18);
	t.ok(true, "true is ok -- all is right with the universe");

	var obj1 = {},
			obj2 = {},
			obj3,
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
	holder1.property({
		name: "b",
		value: {},
		writable: true
	});
	holder2.property({
		name: "a",
		value: 38,
		writable: true
	});
	t.equal(obj1.a, 37, 'Value was properly set and is retrievable');
	t.type(obj1.b, 'object', 'Value was properly set and is retrievable');
	t.equal(obj2.a, 38, 'Value was properly set and is retrievable');

	//Now expound an expounded item
  t.doesNotThrow( function () {
		expound(obj1.b).property({
			name: "a",
			value: 38,
			writable: true
		});
	}, "expounding an expounded attribute doesn't blow up");
	t.equal(obj1.b.a, 38, "retrieving a value from expounded attribute doesn't blow up");

	t.throws( function () {
		holder1.property({
			value: 37
		});
	}, "Throws an error without a name.");

	//test a builder with values set in the builder
	Obj3={};
	BuildObj = function () {
	  //Test a lazy value
		expound(this).property({
			name: "a",
			builder: function () {
				return this.b
			},
			required: true,
			lazy: true
		});
		this.b = 37;
	}

	t.doesNotThrow(	function() {
		obj3 = new BuildObj();
	}, 'Building a required, lazy property with a builder does  not throw an error.');
	t.equal(typeof obj3.a, 'number', 'The constructed object is created and typeof works');
	t.equal(obj3.a, 37, 'The constructed object with the builder method and evals correctly');

	//test a builder with values set outside the builder
	Obj3={};
	BuildObj = function () {
	  //Test a lazy value
		expound(this).property({
			name: "a",
			builder: function () {
				return this.b
			},
			required: true,
			lazy: true
		});
	}

	t.doesNotThrow(	function() {
		obj3 = new BuildObj();
	}, 'Building a required, lazy property with a builder does  not throw an error.');
	obj3.b = 37;
	t.equal(typeof obj3.a, 'number', 'The constructed object is created and typeof works');
	t.equal(obj3.a, 37, 'The constructed object is with the builder method and evals correctly');

	//test a builder with values set in the builder
	Obj3={};
	BuildObj = function () {
	  //Test a lazy value
		expound(this).property({
			name: "a",
			builder: function () {
				return undefined;
			},
			required: true,
			lazy: false
		});
		this.b = 37;
	}

	t.doesNotThrow(	function() {
		obj3 = new BuildObj();
	}, 'Building a required, non-lazy property with a builder throws an error.');
	t.equal(typeof obj3.a, 'undefined', 'The constructed object is created and typeof works');

	//test a builder with values set outside the builder
	Obj3={};
	BuildObj = function () {
	  //Test a lazy value
		expound(this).property({
			name: "a",
			builder: function () {
				return this.b
			},
			required: true,
			lazy: false
		});
	}

	t.doesNotThrow(	function() {
		obj3 = new BuildObj();
	}, 'Building a required, non-lazy property with a builder that returns undefined does throw an error.');
	obj3.b = 37;
	t.equal(typeof obj3.a, 'undefined', 'The Object was not assigned to b as it was not lazy');
	t.equal(obj3.a, undefined, 'The object is with the builder method and evals correctly');
});
