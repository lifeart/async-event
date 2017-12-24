var EventCallback$1 = function EventCallback(callback, config) {
    if ( config === void 0 ) config = {
    timeout: 1000
};

    this.callId = 0;
    this.callback = callback;
    this.eventsList = [];
    this.maxExecutionTime = config.timeout;
    this.setDefaults();
    return this.callbackWrapper.bind(this);
};

var prototypeAccessors = { hasTask: { configurable: true },eventProxy: { configurable: true } };
prototypeAccessors.hasTask.get = function () {
    return this.isBusy && !this.isFirstCall;
};
EventCallback$1.prototype.setDefaults = function setDefaults () {
    this.isFirstCall = true;
    this.stopPropagation = false;
    this.preventDefault = false;
    this.isBusy = false;
};
EventCallback$1.prototype.runNextEvent = function runNextEvent () {
    if (this.eventsList.length) {
        this.handleFirstCall(this.eventsList.shift());
    }
};
prototypeAccessors.eventProxy.get = function () {
    var noop = function () {};
    var _this = this;
    return {
        get: function get(target, prop) {
            if (prop === 'preventDefault') {
                _this.preventDefault = true;
                return noop;
            }
            if (prop === 'stopPropagation') {
                _this.stopPropagation = true;
                return noop;
            }
            return target[prop];
        },
        set: function set(target, prop, value) {
            target[prop] = value;
            return true;
        }
    };
};
EventCallback$1.prototype.pauseEvent = function pauseEvent (event) {
    event.preventDefault();
    event.stopPropagation();
};
EventCallback$1.prototype.safeCallback = function safeCallback (evt) {
    return new Promise((function ($return, $error) {
            var this$1 = this;

        return $return(new Promise(function (resolve, reject) {
            var result = this$1.callback(evt);
            var maxTimeout = setTimeout(function () {
                reject();
            }, this$1.maxExecutionTime);
            Promise.resolve(result).then(function () {
                clearTimeout(maxTimeout);
                resolve();
            }).catch(function () {
                clearTimeout(maxTimeout);
                reject();
            });
        }));
    }).bind(this));
};
EventCallback$1.prototype.handleFirstCall = function handleFirstCall (evt) {
    return new Promise((function ($return, $error) {
        var target;
        target = evt.target;
        this.pauseEvent(evt);
        this.isBusy = true;
        var $Try_1_Post = (function () {
            try {
                this.isFirstCall = false;
                if (!this.stopPropagation || !this.preventDefault) {
                    target.dispatchEvent(new evt.constructor(evt.type, evt));
                } else {
                    this.setDefaults();
                    this.runNextEvent();
                }
                return $return();
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }).bind(this);
        var $Try_1_Catch = (function (e) {
            try {
                console.log('errror', e);
                return $Try_1_Post();
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }).bind(this);
        try {
            return this.safeCallback(new Proxy(evt, this.eventProxy)).then((function ($await_2) {
                try {
                    return $Try_1_Post();
                } catch ($boundEx) {
                    return $Try_1_Catch($boundEx);
                }
            }).bind(this), $Try_1_Catch);
        } catch (e) {
            $Try_1_Catch(e);
        }
    }).bind(this));
};
EventCallback$1.prototype.pushEventToWaitList = function pushEventToWaitList (evt) {
    this.pauseEvent(evt);
    this.eventsList.push(evt);
};
EventCallback$1.prototype.handleSecondCall = function handleSecondCall (evt) {
    if (this.preventDefault) {
        evt.preventDefault();
    }
    if (this.stopPropagation) {
        evt.stopPropagation();
    }
    this.setDefaults();
    this.runNextEvent();
};
EventCallback$1.prototype.callbackWrapper = function callbackWrapper (evt) {
    this.callId++;
    if (this.hasTask) {
        if (evt.isTrusted) {
            this.pushEventToWaitList(evt);
            return;
        }
    }
    if (this.isFirstCall) {
        this.handleFirstCall(evt);
    } else {
        this.handleSecondCall(evt);
    }
};

Object.defineProperties( EventCallback$1.prototype, prototypeAccessors );

export { EventCallback$1 as EventCallback };
export default EventCallback$1;
//# sourceMappingURL=async-event.m.js.map
