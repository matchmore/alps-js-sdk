var assert = require('assert');
var chai = require('chai');
var manager = require('../lib/manager');
describe('Manager', function () {
    describe('#instanciation', function () {
        it('should allow being instanciated with an apiKey', function () {
            var apiKey = "1234";
            var mgr = new manager.Manager(apiKey);
            chai.expect(mgr).to.have.property('apiKey');
        });
    });
});
