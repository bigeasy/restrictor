var adhere = require('adhere')

module.exports = function (method) {
    return adhere(method, -1, function (object, vargs) {
        object.turnstile.enter({
            object: object,
            method: method,
            body: vargs
        })
    })
}
