var adhere = require('adhere')

module.exports = function (method) {
    return adhere(method, function (object, vargs) {
        object.turnstile.enter({
            object: object,
            method: method,
            body: vargs,
            completed: vargs.pop()
        })
    })
}
