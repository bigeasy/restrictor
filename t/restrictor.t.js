require('proof')(4, require('cadence')(prove))

function prove (async, okay) {
    var Turnstile = require('turnstile')
    var restrict = require('..')
    var abend = require('abend')

    function Service () {
        this.turnstile = new Turnstile
        this.gathered = []
        this.count = 0
    }

    Service.prototype.immediate = restrict.enqueue(function (envelope, callback) {
        callback(null, envelope.body.shift())
    })

    Service.prototype.cancelable = restrict.push('canceled', function (envelope, callback) {
        if (this.count++ == 0) {
            okay('cancellable not canceled')
            callback()
        }  else {
            callback(new Error('canceled'))
        }
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
        okay(error.causes[0].message, 'thrown', 'error')
        wait()
    })

    async(function () {
        service.cancelable()
        service.delayed(1)
        service.delayed(2)
        service.immediate(3, async())
    }, function (immediate) {
        okay([ service.gathered, immediate ], [ [ 1, 2 ], 3 ], 'service')
    }, [function () {
        service.error(async())
    }, function (error) {
        okay(error.message, 'thrown', 'caught')
        wait = async()
    }], function () {
        service.cancelable()
    })
}
