/// <reference path='../../typings/tsd.d.ts' />
import request = require('request');
import Consts = require('./../consts');
import SkypeAccount = require('./../skype_account');
import Utils = require("./../utils");
"use strict";

class Poll {
    public pollAll(skypeAccount:SkypeAccount, messagesCallback:(messages:Array<any>)=>void) {
        var _this = this;
        var headers = {
            'RegistrationToken': skypeAccount.registrationTokenParams.raw
        };
        var options = {
            url: Consts.SKYPEWEB_HTTPS + skypeAccount.messagesHost + '/v1/users/ME/endpoints/SELF/subscriptions/0/poll',
            method: 'POST',
            headers: headers
        };
        request(options, function(error, response, body) {
            if (!error) {
                if (response.statusCode === 200) {
                    Poll.parsePollResult(JSON.parse(body), messagesCallback);
                }
                else {
                    Utils.throwError('Failed to poll messages.');
                }
            }
            _this.pollAll(skypeAccount, messagesCallback);
        };
    }

    private static parsePollResult(pollResult:any, messagesCallback:(messages:Array<any>)=>void) {
        if (pollResult.eventMessages) {
            var messages = pollResult.eventMessages.filter((item) => {
                return item.resourceType === 'NewMessage'; //Fixme there are a lot more EventMessage's types!
            });
            if (messages.length) {
                messagesCallback(messages);
            }
        }
    }
}

export = Poll;