var test = require("tap").test,
	perlReport = require('../lib/methods/lib/perlReport');

test("methods", { skip:false }, function (t) {
	t.plan(4);
	t.ok(true, "true is ok -- all is right with the universe");
	t.equal(typeof perlReport, 'function', "perlReport is a function");
	function responseReceiver(error, result) {
		t.equal(typeof result, 'object', "result is an object");
		t.ok(result.version, "result.version is ok");
	}
	perlReport('/home/')(responseReceiver);
});
