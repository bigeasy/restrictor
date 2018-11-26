module.exports = function () {
    var vargs = []
    vargs.push.apply(vargs, arguments)
    var method = vargs.pop(), canceled
    if (typeof vargs[0] == 'string') {
        vargs[0] = require('.')[vargs[0]]
    }
    if (typeof vargs[0] == 'function') {
        var modifier = vargs[0](method)
        return {
            original: method,
            arity: modifier.arity,
            guarded: modifier.method
        }
    }
    return {
        original: method,
        arity: -1,
        guarded: function (envelope, callback) {
            var vargs = [ envelope ]
            vargs.push.apply(vargs, envelope.body)
            vargs.push(callback)
            method.apply(this, vargs)
        }
    }
}
