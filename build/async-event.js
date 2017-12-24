var t=function(t,e){return void 0===e&&(e={timeout:1e3}),this.callId=0,this.callback=t,this.eventsList=[],this.maxExecutionTime=e.timeout,this.setDefaults(),this.callbackWrapper.bind(this)},e={hasTask:{configurable:!0},eventProxy:{configurable:!0}};e.hasTask.get=function(){return this.isBusy&&!this.isFirstCall},t.prototype.setDefaults=function(){this.isFirstCall=!0,this.stopPropagation=!1,this.preventDefault=!1,this.isBusy=!1},t.prototype.runNextEvent=function(){this.eventsList.length&&this.handleFirstCall(this.eventsList.shift())},e.eventProxy.get=function(){var t=function(){},e=this;return{get:function(i,n){return"preventDefault"===n?(e.preventDefault=!0,t):"stopPropagation"===n?(e.stopPropagation=!0,t):i[n]},set:function(t,e,i){return t[e]=i,!0}}},t.prototype.pauseEvent=function(t){t.preventDefault(),t.stopPropagation()},t.prototype.safeCallback=function(t){return new Promise(function(e,i){var n=this;return e(new Promise(function(e,i){var s=n.callback(t),r=setTimeout(function(){i()},n.maxExecutionTime);Promise.resolve(s).then(function(){clearTimeout(r),e()}).catch(function(){clearTimeout(r),i()})}))}.bind(this))},t.prototype.handleFirstCall=function(t){return new Promise(function(e,i){var n;n=t.target,this.pauseEvent(t),this.isBusy=!0;var s=function(){try{return this.isFirstCall=!1,this.stopPropagation&&this.preventDefault?(this.setDefaults(),this.runNextEvent()):n.dispatchEvent(new t.constructor(t.type,t)),e()}catch(t){return i(t)}}.bind(this),r=function(t){try{return console.log("errror",t),s()}catch(t){return i(t)}}.bind(this);try{return this.safeCallback(new Proxy(t,this.eventProxy)).then(function(t){try{return s()}catch(t){return r(t)}}.bind(this),r)}catch(t){r(t)}}.bind(this))},t.prototype.pushEventToWaitList=function(t){this.pauseEvent(t),this.eventsList.push(t)},t.prototype.handleSecondCall=function(t){this.preventDefault&&t.preventDefault(),this.stopPropagation&&t.stopPropagation(),this.setDefaults(),this.runNextEvent()},t.prototype.callbackWrapper=function(t){this.callId++,this.hasTask&&t.isTrusted?this.pushEventToWaitList(t):this.isFirstCall?this.handleFirstCall(t):this.handleSecondCall(t)},Object.defineProperties(t.prototype,e),exports.EventCallback=t,exports.default=t;
//# sourceMappingURL=async-event.js.map