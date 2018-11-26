var adhere = require('adhere')
var cancellation = require('./cancellation')

module.exports = function () {
    var method = cancellation.apply(cancellation, arguments)
    return adhere(method.original, -1, function (object, vargs) {
        object.turnstile.enter({
            object: object,
            method: method.guarded,
            body: vargs
        })
    })
}
