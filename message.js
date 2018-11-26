module.exports = function (method) {
    return {
        arity: -1,
        method: function (envelope, callback) {
            if (envelope.canceled) {
                if (envelope.body[1] != null && typeof envelope.body[1].destroy == 'function') {
                    envelope.body[1].destroy()
                }
                callback()
            } else {
                method.apply(this, envelope.body.concat(callback))
            }
        }
    }
}
