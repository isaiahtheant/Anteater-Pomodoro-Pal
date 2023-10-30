// Define initial timer values
var wm = 25;  // Work Minutes
var ws = 0;   // Work Seconds
var bm = 5;   // Break Minutes
var bs = 0;   // Break Seconds

// Variable to store the timer interval
var startTimer;

// Counter 
var cycleCounter = 0; 

// Function to send timer updates to the popup
function sendUpdateToPopup() {
    // Send timer values to the popup
    chrome.runtime.sendMessage({ action: 'updateTimer', wm, ws, bm, bs, cycleCounter });
}

// Function to start the timer
function startTimerFunction() {
    if (startTimer === undefined) {
        // Interval to update timer every second
        startTimer = setInterval(function () {
            if (ws != 0) {
                ws--;
            } else if (wm != 0 && ws == 0) {
                ws = 59;
                wm--;
            }

            // Start break timer if reaches zero
            if (wm == 0 && ws == 0) {
                if (bs != 0) {
                    bs--;
                } else if (bm != 0 && bs == 0) {
                    bs = 59;
                    bm--;
                }
            }

            // Cycle goes up when both timers at zero
            if (wm == 0 && ws == 0 && bm == 0 && bs == 0) {
                // Reset the timers cycleCounter + 1
                wm = 25;
                ws = 0;
                bm = 5;
                bs = 0;
                cycleCounter++;

               
            }

            // Send updated values to popup
            sendUpdateToPopup();
        }, 1000); 
    }
}

// Load the timer state when open extension
chrome.storage.sync.get(['wm', 'ws', 'bm', 'bs', 'cycleCounter'], function(result) {
    // Initialize timer values with stored values or defaults
    wm = result.wm !== undefined ? result.wm : 25;
    ws = result.ws !== undefined ? result.ws : 0;
    bm = result.bm !== undefined ? result.bm : 5;
    bs = result.bs !== undefined ? result.bs : 0;
    cycleCounter = result.cycleCounter !== undefined ? result.cycleCounter : 0;

    // Colons for time
    document.getElementById('w_minutes').innerText = wm;
    document.getElementById('w_seconds').innerText = ws < 10 ? `0${ws}` : ws;
    document.getElementById('b_minutes').innerText = bm;
    document.getElementById('b_seconds').innerText = bs < 10 ? `0${bs}` : bs;

    // Start the timer if already running
    if (wm > 0 || ws > 0 || bm > 0 || bs > 0) {
        startTimerFunction();
    }
});


// Listen for messages 
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Handle messages 
    if (message.action === 'startTimer') {
        startTimerFunction(); // Start the timer
    } else if (message.action === 'resetTimer') {
        // Reset timer values and stop the timer
        wm = 25;
        ws = 0;
        bm = 5;
        bs = 0;
        cycleCounter = 0;
        clearInterval(startTimer);
        startTimer = undefined;
        sendUpdateToPopup();
        // Update the timer state in storage when press reset
        chrome.storage.sync.set({ wm, ws, bm, bs, cycleCounter });
    } else if (message.action === 'stopTimer') {
        // Stop the timer and update timer in storage
        clearInterval(startTimer);
        startTimer = undefined;
        sendUpdateToPopup();
        chrome.storage.sync.set({ wm, ws, bm, bs, cycleCounter });
    }
});
