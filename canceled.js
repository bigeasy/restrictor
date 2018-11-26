module.exports = function (method) {
    return {
        arity: 0,
        method: function (envelope, callback) {
            if (envelope.canceled) {
                callback()
            } else {
                method.apply(this, envelope.body.concat(callback))
            }
        }
    }
}
