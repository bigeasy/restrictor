require('proof')(9, require('cadence')(prove))

function prove (async, okay) {
    var Turnstile = require('turnstile')
    var restrict = require('..')
    var abend = require('abend')

    function Service () {
        this.turnstile = new Turnstile
        this.gathered = []
        this.count = 0
    }

    Service.prototype.message = restrict.push('message', function (message, socket, callback) {
        okay({
            message: message,
            socket: socket
        }, {
            message: {},
            socket: null
        }, 'socket')
        callback()
    })

    Service.prototype.immediate = restrict.enqueue(function (envelope, value, callback) {
        callback(null, envelope.body.shift())
    })

    Service.prototype.cancelable = restrict.push('canceled', function (callback) {
        if (this.count++ == 0) {
            okay('cancellable not canceled')
            callback()
        }  else {
            callback(new Error('canceled'))
        }
    })

    Service.prototype.delayed = restrict.push(function (envelope, value, callback) {
        this.gathered.push(envelope.body.shift())
        setImmediate(callback, null, envelope.body.shift())
    })

    Service.prototype.error = restrict.enqueue(function (value, callback) {
        throw new Error('thrown')
    })

    var service = new Service

    okay(service.immediate.length, 2, 'enqueue arity')
    okay(service.delayed.length, 1, 'push arity')
    okay(service.cancelable.length, 0, 'unfurled push arity')

    var wait
    service.turnstile.listen(function (error) {
        console.log(error.stack)
        okay(error.causes[0].message, 'thrown', 'error')
        wait()
    })

    async(function () {
        service.message({}, null)
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
        service.message({}, null)
        service.message({}, { destroy: function () { okay('destroyed') } })
    })
}
