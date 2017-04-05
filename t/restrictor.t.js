require('proof')(1, require('cadence')(prove))

function prove (async, assert) {
    var Turnstile = require('turnstile/redux')
    var restrict = require('..')
    var abend = require('abend')

    function Service () {
        this.turnstile = new Turnstile
    }

    Service.prototype.immediate = restrict(function (envelope, callback) {
        callback(null, envelope.body.shift())
    })

    Service.prototype.delayed = restrict(function (envelope, callback) {
        setImmediate(callback, null, envelope.body.shift())
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
