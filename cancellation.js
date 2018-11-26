module.exports = function () {
    var vargs = []
    vargs.push.apply(vargs, arguments)
    var method = vargs.pop()
    return vargs.length == 0 ? {
        original: method, guarded: method
    } : {
        original: method,
        guarded: function (envelope, callback) {
            if (vargs.filter(function (property) {
                return envelope[property]
            }).length == 0) {
                method.call(this, envelope, callback)
            } else {
                callback()
            }
        }
    }
}
