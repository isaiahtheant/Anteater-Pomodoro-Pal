var start = document.getElementById('start');
var stop = document.getElementById('stop');
var reset = document.getElementById('reset');
var buttonClickSound = document.getElementById('buttonClickSound');


// Message sending function to interact with background script
function sendMessageToBackground(action) {
    chrome.runtime.sendMessage({ action: action });
}


start.addEventListener('click', function() {
    sendMessageToBackground('startTimer');
    buttonClickSound.play();
    
});

reset.addEventListener('click', function() {
    buttonClickSound.play();
    sendMessageToBackground('resetTimer');
});

stop.addEventListener('click', function(){
    buttonClickSound.play();
    sendMessageToBackground('stopTimer');
});







// Listen for timer updates from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateTimer') {
        document.getElementById('w_minutes').textContent = message.wm;
        document.getElementById('w_seconds').textContent = message.ws < 10 ? `0${message.ws}` : message.ws;
        document.getElementById('b_minutes').textContent = message.bm;
        document.getElementById('b_seconds').textContent = message.bs < 10 ? `0${message.bs}` : message.bs;
        document.getElementById('counter').textContent = message.cycleCounter;
    }
});