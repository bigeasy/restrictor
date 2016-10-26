require('proof')(1, require('cadence')(prove))

function prove (async, assert) {
    var Turnstile = require('turnstile')
    var restrict = require('..')
    var abend = require('abend')

    function Service () {
        this._turnstile = new Turnstile
    }

    Service.prototype.immediate = restrict(function (state, value, callback) {
        callback(null, value)
    })

    Service.prototype.delayed = restrict(function (state, value, callback) {
        setImmediate(callback, null, value)
    })

    Service.prototype.error = restrict(function (value, callback) {
        throw new Error('thrown')
    })

    var service = new Service

    async(function () {
        service.delayed(1, async())
        service.delayed(2, async())
        service.immediate(3, async())
    }, function (one, two, three) {
        assert([ one, two, three ], [ 1, 2, 3 ], 'service')
    }, function () {
        service.error(function () {})
    })
}
