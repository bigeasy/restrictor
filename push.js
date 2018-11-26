var adhere = require('adhere')
var cancellation = require('./cancellation')

module.exports = function () {
    var restricted = cancellation.apply(cancellation, arguments)
    return adhere(restricted.original, restricted.arity + -1, function (object, vargs) {
        object.turnstile.enter({
            object: object,
            method: restricted.guarded,
            body: vargs
        })
    })
}
