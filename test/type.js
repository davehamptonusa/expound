var test = require("tap").test,
		_ = require("underscore"),
		expound = require('../index.js');

//All atributes are Accessor Descriptors.  Writable and value are spoofed by modifying get and set
test("methods", { skip:false }, function (t) {
	t.plan(29);
	t.ok(true, "true is ok -- all is right with the universe");
	var obj = {}, keys;
	obj = {};
	t.throws(	function() {
		expound(obj).property({
			name: "a",
			type: 'isArray',
			lazy: 'false',
			value: 'foo'
		});
	}, 'non-lazy builder throws expecting an Array');

	obj = {};
	t.doesNotThrow(	function() {
		expound(obj).property({
			name: "a",
			type: 'isArray',
			builder: function() {return 'foo'}
		});
	}, 'Does not throw as value isnt set when expecting an Array');
	t.throws( function () {
		var foo = obj.a;
	}, 'Throws on the get function as it is not an Array.');

	obj = {};
	expound(obj).property({
		name: "a",
		type: 'isArray',
		value: ['foo', 'bar']
	});
  t.doesNotThrow( function () {
		var foo = obj.a;
	},  'Does not throw as it passes type Constraint');

	obj = {};
	t.doesNotThrow(	function () {
		expound(obj).property({
			name: "a",
			type: 'isArray',
			lazy: false,
			value: ['foo', 'bar']
		});
	}, 'Does not throw as it is expecting an Array');

	obj = {};
	t.throws(	function() {
		expound(obj).property({
			name: "a",
			type: 'isBoolean',
			value: 'foo'
		});
		var foo = obj.a;
	}, 'Throws expecting a Boolean');

	obj = {};
	t.doesNotThrow(	function() {
		expound(obj).property({
			name: "a",
			type: 'isBoolean',
			value: false
		});
		var foo = obj.a;
	}, 'Doesnt throw because its a Boolean');

	obj = {};
	t.throws(	function() {
		expound(obj).property({
			name: "a",
			type: 'isDate',
			value: 'foo'
		});
		var foo = obj.a;
	}, 'Throws expecting a date');

	obj = {};
	t.throws(	function() {
		expound(obj).property({
			name: "a",
			type: 'isFunction',
			value: 'foo'
		});
		var foo = obj.a;
	}, 'Throws expecting a Function');

	obj = {};
	t.throws(	function() {
		expound(obj).property({
			name: "a",
			type: 'isNumber',
			value: 'foo'
		});
		var foo = obj.a;
	}, 'Throws expecting a Number');

	obj = {};
	t.throws(	function() {
		expound(obj).property({
			name: "a",
			type: 'isRegExp',
			value: 'foo'
		});
		var foo = obj.a;
	}, 'Throws expecting a RegExp');

	obj = {};
	t.throws(	function() {
		expound(obj).property({
			name: "a",
			type: 'isString',
			value: 7
		});
		var foo = obj.a;
	}, 'Throws expecting a String');

	obj = {};
	t.doesNotThrow(	function() {
		expound(obj).property({
			name: "a",
			type: 'isObject',
			value: {}
		});
		var foo = obj.a;
	}, 'does not Throw, expecting an object');

	obj = {};
	t.throws(	function() {
		expound(obj).property({
			name: "a",
			type: 'typeanator',
			value: 7
		});
		var foo = obj.a;
	}, 'Throws because type constarint doesnt exist');



	obj = {};
	t.doesNotThrow(	function() {
		expound(obj).property({
			name: "a",
			type: 'isDate',
			value: new Date()
		});
		var foo = obj.a;
	}, 'Does not throw as it is Expecting a date');

	//time to make a new type
	obj = {};
	var handler = expound(obj);
	t.doesNotThrow( function () {
		handler.addType('isLessThanTen', 'isNumber', function (value) {
			return value < 10 ? true: false;
		});
	}, "Creating a new Type doesnt throw an error.");
	t.throws( function () {
		handler.property({
			name: 'a',
			type: 'isLessThanTen',
			value: 11
		});
	}, 'Creating a property with a custom type that fails, barfs');

	t.doesNotThrow(function () {
		handler.property({
			name: 'b',
			type: 'isLessThanTen',
			value: 1
		});
		var foo = obj.b;
	}, 'Value passes custom type check');

	t.equal(handler.hasType('isLessThanTen'), true, "handler reports type");
	t.equal(handler.hasType('isLessThanTwenty'), false, "handler reports type");
	t.equal(expound.hasType('isLessThanTen'), false, "Custom type not global");

	//time to make a new GLOBAL type
	obj = {};
	var handler = expound(obj);
	t.doesNotThrow( function () {
		expound.addType('isLessThanTen', 'isNumber', function (value) {
			return value < 10 ? true: false;
		});
	}, "Creating a new Global Type doesnt throw an error.");
	t.throws( function () {
		handler.property({
			name: 'a',
			type: 'isLessThanTen',
			value: 11
		});
	}, 'Creating a property with a custom global type that fails, barfs');

	t.doesNotThrow(function () {
		handler.property({
			name: 'b',
			type: 'isLessThanTen',
			value: 1
		});
		var foo = obj.b;
	}, 'Value passes gloabl custom type check');
	//time to make a new and use an existing type to speed things up
	obj = {};
	var handler = expound(obj);
	t.doesNotThrow( function () {
		expound.addType('isLessThanTen', 'isNumber', function (value) {
			return value < 10;
		});
	}, "Creating a new global Type doesnt throw an error.");
	t.throws( function () {
		expound.addType('isChrisPaterson', 'isADude', function (value) {
			return value < 10;
		});
	}, "Creating a new global Type with an undefined extension type throws an error.");
	t.throws( function () {
		handler.property({
			name: 'a',
			type: 'isLessThanTen',
			value: 11
		});
	}, 'Creating a property with a custom type that fails, barfs');

	t.doesNotThrow(function () {
		handler.property({
			name: 'b',
			type: 'isLessThanTen',
			value: 1
		});
		var foo = obj.b;
	}, 'Value passes custom type check');
});
