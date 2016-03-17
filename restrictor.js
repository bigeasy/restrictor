var adhere = require('adhere'),
    abend = require('abend')

module.exports = function (method) {
    return adhere(method, function (object, vargs) {
        object._turnstile.enter({ object: object, method: method }, vargs, vargs.pop())
        object._turnstile.nudge(abend)
    })
}
