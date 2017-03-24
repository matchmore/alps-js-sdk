var assert = require('assert');
var chai = require('chai');
var manager = require('../lib/manager');
var apiKey = "ea0df90a-db0a-11e5-bd35-3bd106df139b";

describe('Manager', function () {
    describe('#instanciation', function () {
        it('should allow being instanciated with an apiKey', function () {
            var mgr = new manager.Manager(apiKey);
            chai.expect(mgr).to.have.property('apiKey');
        });
    });

    describe('#createUser', function () {
        it('should create the user', function (done) {
			var testName = "test";
			var completion =  function(user) {
				chai.expect(user).to.have.property('name');
				chai.expect(user).to.have.property('userId');
				done();
			}
            var mgr = new manager.Manager(apiKey);
			mgr.createUser(testName, completion)
        });
    });
});
