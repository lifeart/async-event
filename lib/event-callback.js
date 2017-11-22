class EventCallback {
    constructor(callback, timeout = 1000) {
        this.callId = 0;
        this.callback = callback;
        this.eventsList = [];
        this.maxExecutionTime = timeout;
        this.setDefaults();
        return this.callbackWrapper.bind(this);
    }
    get hasTask() {
        return this.isBusy && !this.isFirstCall;
    }
    setDefaults() {
        this.isFirstCall = true;
        this.stopPropagation = false;
        this.preventDefault = false;
        this.isBusy = false;
    }
    runNextEvent() {
        if (this.eventsList.length) {
            this.handleFirstCall(this.eventsList.shift());
        }
    }
    get eventProxy() {
        let noop = () => {};
        const _this = this;
        return {
            get(target, prop) {
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
            set(target, prop, value) {
                target[prop] = value;
                return true;
            }
        }
    }
    pauseEvent(event) {
        event.preventDefault();
        event.stopPropagation();
    }
    async safeCallback(evt) {
        return new Promise((resolve,reject)=>{
            let result = this.callback(evt);
            let maxTimeout = setTimeout(() => {
                reject()
            }, this.maxExecutionTime);
            Promise.resolve(result).then(()=>{
                clearTimeout(maxTimeout);
                resolve();
            }).catch(()=>{
                clearTimeout(maxTimeout);
                reject();
            });
        });
    }
    async handleFirstCall(evt) {

        let target = evt.target;
        this.pauseEvent(evt);

        this.isBusy = true;

        try {
            await this.safeCallback(new Proxy(evt, this.eventProxy));
        } catch (e) {
            console.log('errror',e);
        }
       
        this.isFirstCall = false;
        if (!this.stopPropagation || !this.preventDefault) {
            target.dispatchEvent(new evt.constructor(evt.type, evt));
        } else {
            this.setDefaults();
            this.runNextEvent();
        }
    }
    pushEventToWaitList(evt) {
        this.pauseEvent(evt);
        this.eventsList.push(evt);
    }
    handleSecondCall(evt) {

        if (this.preventDefault) {
            evt.preventDefault();
        }

        if (this.stopPropagation) {
            evt.stopPropagation();
        }
        
        this.setDefaults();
        this.runNextEvent();

    }
    callbackWrapper(evt) {
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
    }
}


export default EventCallback;