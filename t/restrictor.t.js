require('proof')(3, require('cadence')(prove))

function prove (async, assert) {
    var Turnstile = require('turnstile/redux')
    var restrict = require('..')
    var abend = require('abend')

    function Service () {
        this.turnstile = new Turnstile
        this.gathered = []
    }

    Service.prototype.immediate = restrict.enqueue(function (envelope, callback) {
        callback(null, envelope.body.shift())
    })

    Service.prototype.delayed = restrict.push(function (envelope, callback) {
        this.gathered.push(envelope.body.shift())
        setImmediate(callback, null, envelope.body.shift())
    })

    Service.prototype.error = restrict.enqueue(function (value, callback) {
        throw new Error('thrown')
    })

    var service = new Service

    var wait
    service.turnstile.listen(function (error) {
        assert(error.causes[0].message, 'thrown', 'error')
        wait()
    })

    async(function () {
        service.delayed(1)
        service.delayed(2)
        service.immediate(3, async())
    }, function (immediate) {
        assert([ service.gathered, immediate ], [ [ 1, 2 ], 3 ], 'service')
    }, [function () {
        service.error(async())
    }, function (error) {
        assert(error.message, 'thrown', 'caught')
        wait = async()
    }])
}
