import EventCallback from '/lib/event-callback.js';

document.getElementById('two').onclick = new EventCallback(function (evt) {
    console.log('callback');
    return new Promise(function (resolve) {
        alert('wait for 2000ms');
        setTimeout(function () {
            if (document.getElementById('defaultPrevented').checked) {
                evt.preventDefault();
            }

            if (document.getElementById('propagationStopped').checked) {
                evt.stopPropagation();
            }
            console.log('lol', evt.target);
            resolve();
        }, 2000);
    })
});

export default EventCallback;