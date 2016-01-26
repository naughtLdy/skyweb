/// <reference path='../../typings/tsd.d.ts' />
var request = require('request');
var Consts = require('./../consts');
var Utils = require("./../utils");
"use strict";
var Poll = (function () {
    function Poll() {
    }
    Poll.prototype.pollAll = function (skypeAccount, messagesCallback) {
        var _this = this;
        var headers = {
            'RegistrationToken': skypeAccount.registrationTokenParams.raw
        };
        var options = {
            url: Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/endpoints/SELF/subscriptions/0/poll',
            method: 'POST',
            headers: headers
        };
        request(options, function (error, response, body) {
            if (!error) {
                if (response.statusCode === 200) {
                    Poll.parsePollResult(JSON.parse(body), messagesCallback);
                }
                else {
                    Utils.throwError('Failed to poll messages.');
                }
            }
            _this.pollAll(skypeAccount, messagesCallback);
        });
    };
    Poll.parsePollResult = function (pollResult, messagesCallback) {
        if (pollResult.eventMessages) {
            var messages = pollResult.eventMessages.filter(function (item) {
                return item.resourceType === 'NewMessage'; //Fixme there are a lot more EventMessage's types!
            });
            if (messages.length) {
                messagesCallback(messages);
            }
        }
    };
    return Poll;
})();
module.exports = Poll;
